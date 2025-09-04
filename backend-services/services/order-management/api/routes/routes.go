package routes

import (
	"order-management/internal/handlers"
	"order-management/internal/middleware"

	"github.com/gorilla/mux"
	"gorm.io/gorm"
)

func SetupRoutes(router *mux.Router, db *gorm.DB) error {
	authMiddleware, err := middleware.NewAuthMiddleware()
	if err != nil {
		return err
	}

	orderHandler := handlers.NewOrderHandler(db)

	// Order routes
	router.HandleFunc("/api/orders", authMiddleware.ValidateToken(orderHandler.CreateOrder)).Methods("POST")
	router.HandleFunc("/api/orders", authMiddleware.ValidateToken(orderHandler.GetUserOrders)).Methods("GET")
	router.HandleFunc("/api/orders/{orderId}", authMiddleware.ValidateToken(orderHandler.GetOrderByID)).Methods("GET")

	return nil
}