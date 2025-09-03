package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"product-catalog/internal/domain"
	"product-catalog/internal/middleware"
	"product-catalog/internal/util"
	"strconv"
	"strings"

	"github.com/gorilla/mux"
	"gorm.io/gorm"
)

type ProductHandler struct {
	db         *gorm.DB
	cloudinary *util.CloudinaryService
}

func NewProductHandler(db *gorm.DB) (*ProductHandler, error) {
	cloudinary, err := util.NewCloudinaryService()
	if err != nil {
		return nil, err
	}
	return &ProductHandler{db: db, cloudinary: cloudinary}, nil
}

func (h *ProductHandler) CreateProduct(w http.ResponseWriter, r *http.Request) {
	claims, ok := r.Context().Value("claims").(middleware.Claims)
	if !ok || claims.ID == "" {
		http.Error(w, "Unauthorized - Store access required", http.StatusUnauthorized)
		return
	}

	var product domain.Product
	var hasFile bool

	// Check content type to determine how to parse the request
	contentType := r.Header.Get("Content-Type")

	if strings.Contains(contentType, "multipart/form-data") {
		// Handle multipart form data
		if err := r.ParseMultipartForm(10 << 20); err != nil { // 10 MB max
			http.Error(w, "Failed to parse form", http.StatusBadRequest)
			return
		}

		// Try to get product data from form field
		productData := r.FormValue("product")
		if productData != "" {
			// Product data is provided as JSON string in form field
			if err := json.Unmarshal([]byte(productData), &product); err != nil {
				http.Error(w, "Invalid product JSON in form field", http.StatusBadRequest)
				return
			}
		} else {
			// Extract product data from individual form fields
			product.Name = r.FormValue("name")
			product.Description = r.FormValue("description")
			product.Category = r.FormValue("category")
			product.SKU = r.FormValue("sku")

			// Parse price
			if priceStr := r.FormValue("price"); priceStr != "" {
				if price, err := strconv.ParseFloat(priceStr, 64); err == nil {
					product.Price = price
				}
			}

			// Parse isActive
			if isActiveStr := r.FormValue("isActive"); isActiveStr != "" {
				if isActive, err := strconv.ParseBool(isActiveStr); err == nil {
					product.IsActive = isActive
				} else {
					product.IsActive = true // default
				}
			} else {
				product.IsActive = true // default
			}

			// Validate required fields
			if product.Name == "" {
				http.Error(w, "Product name is required", http.StatusBadRequest)
				return
			}
		}

		// Check if there's a file
		if _, _, err := r.FormFile("image"); err == nil {
			hasFile = true
		}

	} else {
		// Handle JSON request body
		if err := json.NewDecoder(r.Body).Decode(&product); err != nil {
			http.Error(w, "Invalid JSON request body", http.StatusBadRequest)
			return
		}
	}

	// Set the store ID from claims
	product.StoreID = claims.ID

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

	// Create product first to get the ID
	if err := tx.Create(&product).Error; err != nil {
		tx.Rollback()
		http.Error(w, "Failed to create product", http.StatusInternalServerError)
		return
	}

	// Handle image upload if present (only for multipart requests)
	if hasFile {
		file, _, err := r.FormFile("image")
		if err == nil && file != nil {
			defer file.Close()

			// Upload to Cloudinary
			publicID := fmt.Sprintf("product-%s-image", product.ID)
			imageURL, err := h.cloudinary.UploadImage(r.Context(), file, publicID)
			if err != nil {
				tx.Rollback()
				http.Error(w, "Failed to upload image", http.StatusInternalServerError)
				return
			}

			// Create image record
			image := domain.Image{
				ProductID: product.ID,
				URL:       imageURL,
				AltText:   r.FormValue("altText"),
				IsPrimary: true, // First image is primary
			}

			if err := tx.Create(&image).Error; err != nil {
				tx.Rollback()
				http.Error(w, "Failed to save image record", http.StatusInternalServerError)
				return
			}
		}
	}

	// Commit transaction
	if err := tx.Commit().Error; err != nil {
		tx.Rollback()
		http.Error(w, "Failed to commit transaction", http.StatusInternalServerError)
		return
	}

	// Return success response
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success":    true,
		"message":    "Product created successfully",
		"product_id": product.ID,
	})
}

func (h *ProductHandler) GetProduct(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	productID := vars["id"]

	var product domain.Product
	if err := h.db.Preload("Images").First(&product, "id = ?", productID).Error; err != nil {
		http.Error(w, "Product not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(product)
}

func (h *ProductHandler) UpdateProduct(w http.ResponseWriter, r *http.Request) {
	claims, ok := r.Context().Value("claims").(middleware.Claims)
	if !ok || claims.ID == "" {
		http.Error(w, "Unauthorized - Store access required", http.StatusUnauthorized)
		return
	}

	vars := mux.Vars(r)
	productID := vars["id"]

	// Verify product belongs to the store
	var existingProduct domain.Product
	if err := h.db.First(&existingProduct, "id = ?", productID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			http.Error(w, "Product not found", http.StatusNotFound)
		} else {
			http.Error(w, "Database error", http.StatusInternalServerError)
		}
		return
	}

	if existingProduct.StoreID != claims.ID {
		http.Error(w, "Forbidden - Product belongs to different store", http.StatusForbidden)
		return
	}

	// Parse the update data
	var updateData map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&updateData); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Remove fields that shouldn't be updated
	delete(updateData, "id")
	delete(updateData, "store_id")
	delete(updateData, "created_at")

	// Validate and clean the update data
	allowedFields := map[string]bool{
		"name":        true,
		"description": true,
		"category":    true,
		"price":       true,
		"sku":         true,
		"is_active":   true,
		"isActive":    true, // Handle both snake_case and camelCase
	}

	cleanedData := make(map[string]interface{})
	for key, value := range updateData {
		if allowedFields[key] {
			// Handle camelCase to snake_case conversion
			if key == "isActive" {
				cleanedData["is_active"] = value
			} else {
				cleanedData[key] = value
			}
		}
	}

	// Check if there's anything to update
	if len(cleanedData) == 0 {
		http.Error(w, "No valid fields to update", http.StatusBadRequest)
		return
	}

	// Perform selective update using Updates()
	if err := h.db.Model(&existingProduct).Updates(cleanedData).Error; err != nil {
		http.Error(w, "Failed to update product", http.StatusInternalServerError)
		return
	}

	// Fetch the updated product to return
	var updatedProduct domain.Product
	if err := h.db.First(&updatedProduct, "id = ?", productID).Error; err != nil {
		http.Error(w, "Failed to fetch updated product", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"message": "Product updated successfully",
		"product": updatedProduct,
	})
}

func (h *ProductHandler) DeleteProduct(w http.ResponseWriter, r *http.Request) {
	claims, ok := r.Context().Value("claims").(middleware.Claims)
	if !ok || claims.ID == "" {
		http.Error(w, "Unauthorized - Store access required", http.StatusUnauthorized)
		return
	}

	vars := mux.Vars(r)
	productID := vars["id"]

	// Verify product belongs to the store
	var existingProduct domain.Product
	if err := h.db.First(&existingProduct, "id = ?", productID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			http.Error(w, "Product not found", http.StatusNotFound)
		} else {
			http.Error(w, "Database error", http.StatusInternalServerError)
		}
		return
	}

	if existingProduct.StoreID != claims.ID {
		http.Error(w, "Forbidden - Product belongs to different store", http.StatusForbidden)
		return
	}

	// Use transaction to delete product and its images
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

	// First, delete all associated images
	if err := tx.Where("product_id = ?", productID).Delete(&domain.Image{}).Error; err != nil {
		tx.Rollback()
		http.Error(w, "Failed to delete product images", http.StatusInternalServerError)
		return
	}

	// Then delete the product
	if err := tx.Delete(&domain.Product{}, "id = ?", productID).Error; err != nil {
		tx.Rollback()
		http.Error(w, "Failed to delete product", http.StatusInternalServerError)
		return
	}

	// Commit transaction
	if err := tx.Commit().Error; err != nil {
		tx.Rollback()
		http.Error(w, "Failed to commit deletion", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"message": "Product deleted successfully",
	})
}

func (h *ProductHandler) GetProductsByStore(w http.ResponseWriter, r *http.Request) {
	claims, ok := r.Context().Value("claims").(middleware.Claims)
	if !ok || claims.ID == "" {
		http.Error(w, "Unauthorized - Store access required", http.StatusUnauthorized)
		return
	}

	vars := mux.Vars(r)
	storeID := vars["storeId"]

	// Verify user has access to the store
	if storeID != claims.ID {
		http.Error(w, "Forbidden - Access to store denied", http.StatusForbidden)
		return
	}

	var products []domain.Product
	if err := h.db.Preload("Images").Where("store_id = ?", storeID).Find(&products).Error; err != nil {
		http.Error(w, "Failed to fetch products", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(products)
}
