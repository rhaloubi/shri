package handlers

import (
	"encoding/json"
	"net/http"
	"product-catalog/internal/domain"
	"product-catalog/internal/middleware"
	"product-catalog/internal/util"

	"github.com/gorilla/mux"
	"gorm.io/gorm"
)

type ImageHandler struct {
	db         *gorm.DB
	cloudinary *util.CloudinaryService
}

func NewImageHandler(db *gorm.DB) (*ImageHandler, error) {
	cloudinary, err := util.NewCloudinaryService()
	if err != nil {
		return nil, err
	}
	return &ImageHandler{db: db, cloudinary: cloudinary}, nil
}

func (h *ImageHandler) UploadImage(w http.ResponseWriter, r *http.Request) {
	claims, ok := r.Context().Value("claims").(middleware.Claims)
	if !ok || claims.StoreID == "" {
		http.Error(w, "Unauthorized - Store access required", http.StatusUnauthorized)
		return
	}

	vars := mux.Vars(r)
	productID := vars["productId"]

	// Verify product belongs to the store
	var product domain.Product
	if err := h.db.First(&product, "id = ?", productID).Error; err != nil {
		http.Error(w, "Product not found", http.StatusNotFound)
		return
	}

	if product.StoreID != claims.StoreID {
		http.Error(w, "Forbidden - Product belongs to different store", http.StatusForbidden)
		return
	}

	// Parse multipart form
	if err := r.ParseMultipartForm(10 << 20); err != nil {
		http.Error(w, "Failed to parse form", http.StatusBadRequest)
		return
	}

	file, header, err := r.FormFile("image")
	if err != nil {
		http.Error(w, "No image file provided", http.StatusBadRequest)
		return
	}
	defer file.Close()

	// Upload to Cloudinary
	url, err := h.cloudinary.UploadImage(r.Context(), header.Filename)
	if err != nil {
		http.Error(w, "Failed to upload image", http.StatusInternalServerError)
		return
	}

	// Create image record
	image := &domain.Image{
		ProductID: productID,
		URL:       url,
		AltText:   r.FormValue("altText"),
		IsPrimary: false,
	}

	if err := h.db.Create(image).Error; err != nil {
		http.Error(w, "Failed to save image record", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(image)
}

func (h *ImageHandler) SetPrimaryImage(w http.ResponseWriter, r *http.Request) {
	claims, ok := r.Context().Value("claims").(middleware.Claims)
	if !ok || claims.StoreID == "" {
		http.Error(w, "Unauthorized - Store access required", http.StatusUnauthorized)
		return
	}

	vars := mux.Vars(r)
	imageID := vars["id"]
	productID := vars["productId"]

	// Verify product belongs to the store
	var product domain.Product
	if err := h.db.First(&product, "id = ?", productID).Error; err != nil {
		http.Error(w, "Product not found", http.StatusNotFound)
		return
	}

	if product.StoreID != claims.StoreID {
		http.Error(w, "Forbidden - Product belongs to different store", http.StatusForbidden)
		return
	}

	// Start a transaction
	err := h.db.Transaction(func(tx *gorm.DB) error {
		// First, set all images for this product as non-primary
		if err := tx.Model(&domain.Image{}).Where("product_id = ?", productID).Update("is_primary", false).Error; err != nil {
			return err
		}

		// Then set the specified image as primary
		if err := tx.Model(&domain.Image{}).Where("id = ?", imageID).Update("is_primary", true).Error; err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		http.Error(w, "Failed to set primary image", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (h *ImageHandler) UpdateImageAltText(w http.ResponseWriter, r *http.Request) {
	claims, ok := r.Context().Value("claims").(middleware.Claims)
	if !ok || claims.StoreID == "" {
		http.Error(w, "Unauthorized - Store access required", http.StatusUnauthorized)
		return
	}

	vars := mux.Vars(r)
	imageID := vars["id"]
	productID := vars["productId"]

	// Verify product belongs to the store
	var product domain.Product
	if err := h.db.First(&product, "id = ?", productID).Error; err != nil {
		http.Error(w, "Product not found", http.StatusNotFound)
		return
	}

	if product.StoreID != claims.StoreID {
		http.Error(w, "Forbidden - Product belongs to different store", http.StatusForbidden)
		return
	}

	var req struct {
		AltText string `json:"altText"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if err := h.db.Model(&domain.Image{}).Where("id = ?", imageID).Update("alt_text", req.AltText).Error; err != nil {
		http.Error(w, "Failed to update alt text", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (h *ImageHandler) DeleteImage(w http.ResponseWriter, r *http.Request) {
	claims, ok := r.Context().Value("claims").(middleware.Claims)
	if !ok || claims.StoreID == "" {
		http.Error(w, "Unauthorized - Store access required", http.StatusUnauthorized)
		return
	}

	vars := mux.Vars(r)
	imageID := vars["id"]
	productID := vars["productId"]

	// Verify product belongs to the store
	var product domain.Product
	if err := h.db.First(&product, "id = ?", productID).Error; err != nil {
		http.Error(w, "Product not found", http.StatusNotFound)
		return
	}

	if product.StoreID != claims.StoreID {
		http.Error(w, "Forbidden - Product belongs to different store", http.StatusForbidden)
		return
	}

	if err := h.db.Delete(&domain.Image{}, "id = ?", imageID).Error; err != nil {
		http.Error(w, "Failed to delete image", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
