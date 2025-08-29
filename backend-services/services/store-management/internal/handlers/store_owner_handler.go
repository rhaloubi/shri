package handlers

import (
	"encoding/json"
	"net/http"

	"store-management/internal/domain"
	"store-management/internal/middleware"

	"github.com/gorilla/mux"
	"gorm.io/gorm"
)

type StoreOwnerHandler struct {
	db *gorm.DB
}

func NewStoreOwnerHandler(db *gorm.DB) *StoreOwnerHandler {
	return &StoreOwnerHandler{db: db}
}

func (h *StoreOwnerHandler) CreateStoreOwner(w http.ResponseWriter, r *http.Request) {
	claims, ok := r.Context().Value("claims").(middleware.Claims)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	// Check if user already has a store owner profile
	var existingOwner domain.StoreOwner
	result := h.db.Where("user_id = ?", claims.UserID).First(&existingOwner)
	if result.Error == nil {
		http.Error(w, "User already has a store owner profile", http.StatusConflict)
		return
	}

	var storeOwner domain.StoreOwner
	if err := json.NewDecoder(r.Body).Decode(&storeOwner); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Set the user_id from the token
	storeOwner.UserID = claims.UserID

	result = h.db.Create(&storeOwner)
	if result.Error != nil {
		http.Error(w, "Failed to create store owner", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(storeOwner)
}

func (h *StoreOwnerHandler) GetStoreOwner(w http.ResponseWriter, r *http.Request) {
	claims, ok := r.Context().Value("claims").(middleware.Claims)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	vars := mux.Vars(r)
	id := vars["id"]

	var storeOwner domain.StoreOwner
	result := h.db.First(&storeOwner, "id = ?", id)
	if result.Error != nil {
		http.Error(w, "Store owner not found", http.StatusNotFound)
		return
	}

	// Check if user is admin or the owner
	if !claims.IsAdmin && storeOwner.UserID != claims.UserID {
		http.Error(w, "Forbidden", http.StatusForbidden)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(storeOwner)
}

func (h *StoreOwnerHandler) UpdateStoreOwner(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	var storeOwner domain.StoreOwner
	if err := json.NewDecoder(r.Body).Decode(&storeOwner); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	result := h.db.Model(&domain.StoreOwner{}).Where("id = ?", id).Updates(storeOwner)
	if result.Error != nil {
		http.Error(w, "Failed to update store owner", http.StatusInternalServerError)
		return
	}
	if result.RowsAffected == 0 {
		http.Error(w, "Store owner not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(storeOwner)
}

func (h *StoreOwnerHandler) DeleteStoreOwner(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	result := h.db.Delete(&domain.StoreOwner{}, "id = ?", id)
	if result.Error != nil {
		http.Error(w, "Failed to delete store owner", http.StatusInternalServerError)
		return
	}
	if result.RowsAffected == 0 {
		http.Error(w, "Store owner not found", http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (h *StoreOwnerHandler) ListStoreOwners(w http.ResponseWriter, r *http.Request) {
	claims, ok := r.Context().Value("claims").(middleware.Claims)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var storeOwners []domain.StoreOwner
	var result *gorm.DB

	if claims.IsAdmin {
		// Admin can see all store owners
		result = h.db.Find(&storeOwners)
	} else {
		// Regular users can only see their own store owner profile
		result = h.db.Where("user_id = ?", claims.UserID).Find(&storeOwners)
	}

	if result.Error != nil {
		http.Error(w, "Failed to fetch store owners", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(storeOwners)
}
