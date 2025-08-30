package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"store-management/internal/domain"
	"store-management/internal/middleware"
	"store-management/internal/utils"

	"github.com/gorilla/mux"
	"gorm.io/gorm"
)

type StoreHandler struct {
	db         *gorm.DB
	cloudinary *utils.CloudinaryService
}

func NewStoreHandler(db *gorm.DB) (*StoreHandler, error) {
	cloudinary, err := utils.NewCloudinaryService()
	if err != nil {
		return nil, err
	}
	return &StoreHandler{db: db, cloudinary: cloudinary}, nil
}

func (h *StoreHandler) CreateStore(w http.ResponseWriter, r *http.Request) {
	claims, ok := r.Context().Value("claims").(middleware.Claims)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	// Check if user is a store owner
	var storeOwner domain.StoreOwner
	result := h.db.Where("user_id = ?", claims.ID).First(&storeOwner)
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

	// Parse multipart form
	if err := r.ParseMultipartForm(10 << 20); err != nil { // 10 MB max
		http.Error(w, "Failed to parse form", http.StatusBadRequest)
		return
	}

	// Create store instance
	var store domain.Store
	store.Name = r.FormValue("name")
	store.Description = r.FormValue("description")
	store.Street = r.FormValue("street")
	store.City = r.FormValue("city")
	store.State = r.FormValue("state")
	store.StoreOwnerID = storeOwner.ID

	// Handle logo upload
	file, header, err := r.FormFile("logo")
	if err == nil {
		defer file.Close()

		// Validate file type
		if !strings.HasPrefix(header.Header.Get("Content-Type"), "image/") {
			http.Error(w, "File must be an image", http.StatusBadRequest)
			return
		}

		// Create store in database first to get the ID
		result = h.db.Create(&store)
		if result.Error != nil {
			http.Error(w, "Failed to create store", http.StatusInternalServerError)
			return
		}

		// Upload to Cloudinary
		publicID := fmt.Sprintf("store-%s-logo", store.ID)
		logoURL, err := h.cloudinary.UploadImage(r.Context(), file, publicID)
		if err != nil {
			// Rollback store creation if image upload fails
			h.db.Delete(&store)
			http.Error(w, "Failed to upload logo", http.StatusInternalServerError)
			return
		}

		// Update store with logo URL
		store.LogoURL = logoURL
		h.db.Save(&store)
	} else {
		// Create store without logo
		result = h.db.Create(&store)
		if result.Error != nil {
			http.Error(w, "Failed to create store", http.StatusInternalServerError)
			return
		}
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(store)
}

func (h *StoreHandler) UpdateStore(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	// Get existing store
	var store domain.Store
	if result := h.db.First(&store, "id = ?", id); result.Error != nil {
		http.Error(w, "Store not found", http.StatusNotFound)
		return
	}

	// Parse multipart form
	if err := r.ParseMultipartForm(10 << 20); err != nil {
		http.Error(w, "Failed to parse form", http.StatusBadRequest)
		return
	}

	// Update store fields
	if name := r.FormValue("name"); name != "" {
		store.Name = name
	}
	if description := r.FormValue("description"); description != "" {
		store.Description = description
	}
	if street := r.FormValue("street"); street != "" {
		store.Street = street
	}
	if city := r.FormValue("city"); city != "" {
		store.City = city
	}
	if state := r.FormValue("state"); state != "" {
		store.State = state
	}

	// Handle logo update
	file, header, err := r.FormFile("logo")
	if err == nil {
		defer file.Close()

		// Validate file type
		if !strings.HasPrefix(header.Header.Get("Content-Type"), "image/") {
			http.Error(w, "File must be an image", http.StatusBadRequest)
			return
		}

		// Delete old logo if exists
		if store.LogoURL != "" {
			oldPublicID := fmt.Sprintf("store-%s-logo", store.ID)
			if err := h.cloudinary.DeleteImage(r.Context(), oldPublicID); err != nil {
				// Log error but continue
				fmt.Printf("Failed to delete old logo: %v\n", err)
			}
		}

		// Upload new logo
		publicID := fmt.Sprintf("store-%s-logo", store.ID)
		logoURL, err := h.cloudinary.UploadImage(r.Context(), file, publicID)
		if err != nil {
			http.Error(w, "Failed to upload new logo", http.StatusInternalServerError)
			return
		}
		store.LogoURL = logoURL
	}

	// Save updates
	result := h.db.Save(&store)
	if result.Error != nil {
		http.Error(w, "Failed to update store", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(store)
}

func (h *StoreHandler) DeleteStore(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	// Get existing store
	var store domain.Store
	if result := h.db.First(&store, "id = ?", id); result.Error != nil {
		http.Error(w, "Store not found", http.StatusNotFound)
		return
	}

	// Delete logo from Cloudinary if exists
	if store.LogoURL != "" {
		publicID := fmt.Sprintf("store-%s-logo", store.ID)
		if err := h.cloudinary.DeleteImage(r.Context(), publicID); err != nil {
			// Log error but continue with store deletion
			fmt.Printf("Failed to delete logo from Cloudinary: %v\n", err)
		}
	}

	// Delete store from database
	result := h.db.Delete(&store)
	if result.Error != nil {
		http.Error(w, "Failed to delete store", http.StatusInternalServerError)
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

	if claims.Role == "admin" {
		// Admin can see all stores
		result = h.db.Find(&stores)
	} else {
		// Regular users can only see stores they own
		var storeOwner domain.StoreOwner
		result = h.db.Where("user_id = ?", claims.ID).First(&storeOwner)
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
