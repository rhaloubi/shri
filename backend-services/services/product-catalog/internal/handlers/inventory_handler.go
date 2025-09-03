package handlers

import (
	"encoding/json"
	"net/http"
	"product-catalog/internal/domain"
	"product-catalog/internal/middleware"

	"github.com/gorilla/mux"
	"gorm.io/gorm"
)

type InventoryHandler struct {
	db *gorm.DB
}

func NewInventoryHandler(db *gorm.DB) *InventoryHandler {
	return &InventoryHandler{db: db}
}

func (h *InventoryHandler) GetInventory(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	productID := vars["productId"]

	var inventory domain.Inventory
	if err := h.db.First(&inventory, "product_id = ?", productID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			http.Error(w, "Inventory not found", http.StatusNotFound)
		} else {
			http.Error(w, "Failed to fetch inventory", http.StatusInternalServerError)
		}
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(inventory)
}

func (h *InventoryHandler) UpdateInventory(w http.ResponseWriter, r *http.Request) {
	claims, ok := r.Context().Value("claims").(middleware.Claims)
	if !ok || claims.ID == "" {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	vars := mux.Vars(r)
	productID := vars["productId"]

	// Verify product belongs to the store
	var product domain.Product
	if err := h.db.First(&product, "id = ?", productID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			http.Error(w, "Product not found", http.StatusNotFound)
		} else {
			http.Error(w, "Database error", http.StatusInternalServerError)
		}
		return
	}

	if product.StoreID != claims.ID {
		http.Error(w, "Forbidden - Product belongs to different store", http.StatusForbidden)
		return
	}

	// Parse update data
	var updateData struct {
		Quantity int `json:"quantity"`
		Reserved int `json:"reserved"`
	}

	if err := json.NewDecoder(r.Body).Decode(&updateData); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Start transaction
	tx := h.db.Begin()
	if tx.Error != nil {
		http.Error(w, "Failed to start transaction", http.StatusInternalServerError)
		return
	}
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	// Get or create inventory
	var inventory domain.Inventory
	result := tx.FirstOrCreate(&inventory, domain.Inventory{ProductID: productID})
	if result.Error != nil {
		tx.Rollback()
		http.Error(w, "Failed to get/create inventory", http.StatusInternalServerError)
		return
	}

	// Update inventory
	inventory.Quantity = updateData.Quantity
	inventory.Reserved = updateData.Reserved

	if err := tx.Save(&inventory).Error; err != nil {
		tx.Rollback()
		http.Error(w, "Failed to update inventory", http.StatusInternalServerError)
		return
	}

	// Commit transaction
	if err := tx.Commit().Error; err != nil {
		tx.Rollback()
		http.Error(w, "Failed to commit transaction", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(inventory)
}