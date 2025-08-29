package handlers

import (
	"encoding/json"
	"net/http"

	"store-management/internal/domain"
	"store-management/internal/middleware"

	"github.com/gorilla/mux"
	"gorm.io/gorm"
)

type StoreHandler struct {
	db *gorm.DB
}

func NewStoreHandler(db *gorm.DB) *StoreHandler {
	return &StoreHandler{db: db}
}

func (h *StoreHandler) CreateStore(w http.ResponseWriter, r *http.Request) {
	claims, ok := r.Context().Value("claims").(middleware.Claims)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	// Check if user is a store owner
	var storeOwner domain.StoreOwner
	result := h.db.Where("user_id = ?", claims.UserID).First(&storeOwner)
	if result.Error != nil {
		http.Error(w, "Must be a store owner to create a store", http.StatusForbidden)
		return
	}

	// Check if store owner already has a store
	var existingStore domain.Store
	result = h.db.Where("store_owner_id = ?", storeOwner.ID).First(&existingStore)
	if result.Error == nil {
		http.Error(w, "Store owner already has a store", http.StatusConflict)
		return
	}

	var store domain.Store
	if err := json.NewDecoder(r.Body).Decode(&store); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Set the store owner ID
	store.StoreOwnerID = storeOwner.ID

	result = h.db.Create(&store)
	if result.Error != nil {
		http.Error(w, "Failed to create store", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(store)
}

func (h *StoreHandler) GetStore(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	var store domain.Store
	result := h.db.First(&store, "id = ?", id)
	if result.Error != nil {
		http.Error(w, "Store not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(store)
}

func (h *StoreHandler) UpdateStore(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	var store domain.Store
	if err := json.NewDecoder(r.Body).Decode(&store); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	result := h.db.Model(&domain.Store{}).Where("id = ?", id).Updates(store)
	if result.Error != nil {
		http.Error(w, "Failed to update store", http.StatusInternalServerError)
		return
	}
	if result.RowsAffected == 0 {
		http.Error(w, "Store not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(store)
}

func (h *StoreHandler) DeleteStore(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	result := h.db.Delete(&domain.Store{}, "id = ?", id)
	if result.Error != nil {
		http.Error(w, "Failed to delete store", http.StatusInternalServerError)
		return
	}
	if result.RowsAffected == 0 {
		http.Error(w, "Store not found", http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (h *StoreHandler) ListStores(w http.ResponseWriter, r *http.Request) {
	claims, ok := r.Context().Value("claims").(middleware.Claims)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var stores []domain.Store
	var result *gorm.DB

	if claims.IsAdmin {
		// Admin can see all stores
		result = h.db.Find(&stores)
	} else {
		// Regular users can only see stores they own
		var storeOwner domain.StoreOwner
		result = h.db.Where("user_id = ?", claims.UserID).First(&storeOwner)
		if result.Error != nil {
			http.Error(w, "Store owner not found", http.StatusNotFound)
			return
		}
		result = h.db.Where("store_owner_id = ?", storeOwner.ID).Find(&stores)
	}

	if result.Error != nil {
		http.Error(w, "Failed to fetch stores", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(stores)
}

func (h *StoreHandler) GetStoresByOwner(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	ownerID := vars["ownerID"]

	var stores []domain.Store
	result := h.db.Where("store_owner_id = ?", ownerID).Find(&stores)
	if result.Error != nil {
		http.Error(w, "Failed to fetch stores", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(stores)
}
