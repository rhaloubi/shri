package routes

import (
	"os"
	"store-management/internal/handlers"
	"store-management/internal/middleware"

	"github.com/gorilla/mux"
	"gorm.io/gorm"
)

func SetupRoutes(r *mux.Router, db *gorm.DB) {
	jwtSecret := os.Getenv("JWT_SECRET")
	storeOwnerHandler := handlers.NewStoreOwnerHandler(db)
	storeHandler := handlers.NewStoreHandler(db)
	authMiddleware := middleware.NewAuthMiddleware(jwtSecret)

	// Store Owner routes
	r.HandleFunc("/api/store-owners", authMiddleware.ValidateToken(storeOwnerHandler.CreateStoreOwner)).Methods("POST")
	r.HandleFunc("/api/store-owners", authMiddleware.ValidateToken(storeOwnerHandler.ListStoreOwners)).Methods("GET")
	r.HandleFunc("/api/store-owners/{id}", authMiddleware.ValidateToken(storeOwnerHandler.GetStoreOwner)).Methods("GET")
	r.HandleFunc("/api/store-owners/{id}", authMiddleware.ValidateToken(storeOwnerHandler.UpdateStoreOwner)).Methods("PUT")
	r.HandleFunc("/api/store-owners/{id}", authMiddleware.ValidateToken(storeOwnerHandler.DeleteStoreOwner)).Methods("DELETE")

	// Store routes
	r.HandleFunc("/api/stores", authMiddleware.ValidateToken(storeHandler.CreateStore)).Methods("POST")
	r.HandleFunc("/api/stores", authMiddleware.ValidateToken(storeHandler.ListStores)).Methods("GET")
	r.HandleFunc("/api/stores/{id}", authMiddleware.ValidateToken(storeHandler.GetStore)).Methods("GET")
	r.HandleFunc("/api/stores/{id}", authMiddleware.ValidateToken(storeHandler.UpdateStore)).Methods("PUT")
	r.HandleFunc("/api/stores/{id}", authMiddleware.ValidateToken(storeHandler.DeleteStore)).Methods("DELETE")
	r.HandleFunc("/api/store-owners/{ownerID}/stores", authMiddleware.ValidateToken(storeHandler.GetStoresByOwner)).Methods("GET")
}
