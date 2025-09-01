package routes

import (
	"log"
	"product-catalog/internal/handlers"
	"product-catalog/internal/middleware"

	"github.com/gorilla/mux"
	"gorm.io/gorm"
)

// SetupRoutes configures all the routes for the product catalog service
func SetupRoutes(r *mux.Router, db *gorm.DB) {
	// Initialize handlers
	productHandler := handlers.NewProductHandler(db)
	imageHandler, err := handlers.NewImageHandler(db)
	if err != nil {
		log.Fatalf("Failed to initialize image handler: %v", err)
	}

	// Initialize middleware
	authMiddleware, err := middleware.NewAuthMiddleware()
	if err != nil {
		log.Fatalf("Failed to initialize auth middleware: %v", err)
	}

	// Product routes
	r.HandleFunc("/api/products", authMiddleware.ValidateToken(productHandler.CreateProduct)).Methods("POST")
	r.HandleFunc("/api/products/{id}", productHandler.GetProduct).Methods("GET")
	r.HandleFunc("/api/products/{id}", authMiddleware.ValidateToken(productHandler.UpdateProduct)).Methods("PUT")
	r.HandleFunc("/api/products/{id}", authMiddleware.ValidateToken(productHandler.DeleteProduct)).Methods("DELETE")

	// Product image routes (integrated with products)
	r.HandleFunc("/api/products/{productId}/images", authMiddleware.ValidateToken(imageHandler.UploadImage)).Methods("POST")
	r.HandleFunc("/api/products/{productId}/images/{imageId}", authMiddleware.ValidateToken(imageHandler.DeleteImage)).Methods("DELETE")
	r.HandleFunc("/api/products/{productId}/images/{imageId}/primary", authMiddleware.ValidateToken(imageHandler.SetPrimaryImage)).Methods("PUT")
	r.HandleFunc("/api/products/{productId}/images/{imageId}/alt-text", authMiddleware.ValidateToken(imageHandler.UpdateImageAltText)).Methods("PUT")

	// Store-specific product routes
	r.HandleFunc("/api/stores/{storeId}/products", authMiddleware.ValidateToken(productHandler.GetProductsByStore)).Methods("GET")
}
