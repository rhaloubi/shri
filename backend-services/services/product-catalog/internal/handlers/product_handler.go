package handlers

import (
	"encoding/json"
	"net/http"
	"product-catalog/internal/domain"
	"product-catalog/internal/middleware"

	"github.com/gorilla/mux"
	"gorm.io/gorm"
)

type ProductHandler struct {
	db *gorm.DB
}

func NewProductHandler(db *gorm.DB) *ProductHandler {
	return &ProductHandler{db: db}
}

func (h *ProductHandler) CreateProduct(w http.ResponseWriter, r *http.Request) {
	claims, ok := r.Context().Value("claims").(middleware.Claims)
	if !ok || claims.StoreID == "" {
		http.Error(w, "Unauthorized - Store access required", http.StatusUnauthorized)
		return
	}

	var product domain.Product
	if err := json.NewDecoder(r.Body).Decode(&product); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Set the store ID from claims
	product.StoreID = claims.StoreID

	if err := h.db.Create(&product).Error; err != nil {
		http.Error(w, "Failed to create product", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(product)
}

func (h *ProductHandler) GetProduct(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	productID := vars["id"]

	var product domain.Product
	if err := h.db.First(&product, "id = ?", productID).Error; err != nil {
		http.Error(w, "Product not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(product)
}

func (h *ProductHandler) UpdateProduct(w http.ResponseWriter, r *http.Request) {
	claims, ok := r.Context().Value("claims").(middleware.Claims)
	if !ok || claims.StoreID == "" {
		http.Error(w, "Unauthorized - Store access required", http.StatusUnauthorized)
		return
	}

	vars := mux.Vars(r)
	productID := vars["id"]

	// Verify product belongs to the store
	var existingProduct domain.Product
	if err := h.db.First(&existingProduct, "id = ?", productID).Error; err != nil {
		http.Error(w, "Product not found", http.StatusNotFound)
		return
	}

	if existingProduct.StoreID != claims.StoreID {
		http.Error(w, "Forbidden - Product belongs to different store", http.StatusForbidden)
		return
	}

	var product domain.Product
	if err := json.NewDecoder(r.Body).Decode(&product); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Ensure store ID remains unchanged
	product.ID = productID
	product.StoreID = claims.StoreID

	if err := h.db.Save(&product).Error; err != nil {
		http.Error(w, "Failed to update product", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(product)
}

func (h *ProductHandler) DeleteProduct(w http.ResponseWriter, r *http.Request) {
	claims, ok := r.Context().Value("claims").(middleware.Claims)
	if !ok || claims.StoreID == "" {
		http.Error(w, "Unauthorized - Store access required", http.StatusUnauthorized)
		return
	}

	vars := mux.Vars(r)
	productID := vars["id"]

	// Verify product belongs to the store
	var existingProduct domain.Product
	if err := h.db.First(&existingProduct, "id = ?", productID).Error; err != nil {
		http.Error(w, "Product not found", http.StatusNotFound)
		return
	}

	if existingProduct.StoreID != claims.StoreID {
		http.Error(w, "Forbidden - Product belongs to different store", http.StatusForbidden)
		return
	}

	if err := h.db.Delete(&domain.Product{}, "id = ?", productID).Error; err != nil {
		http.Error(w, "Failed to delete product", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (h *ProductHandler) GetProductsByStore(w http.ResponseWriter, r *http.Request) {
	claims, ok := r.Context().Value("claims").(middleware.Claims)
	if !ok || claims.StoreID == "" {
		http.Error(w, "Unauthorized - Store access required", http.StatusUnauthorized)
		return
	}

	vars := mux.Vars(r)
	storeID := vars["storeId"]

	// Verify user has access to the store
	if storeID != claims.StoreID {
		http.Error(w, "Forbidden - Access to store denied", http.StatusForbidden)
		return
	}

	var products []domain.Product
	if err := h.db.Where("store_id = ?", storeID).Find(&products).Error; err != nil {
		http.Error(w, "Failed to fetch products", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(products)
}
