package main

import (
	"api-gateway/internal/middleware"
	"api-gateway/internal/proxy"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Printf("Warning: .env file not found")
	}

	// Create router
	router := mux.NewRouter()

	// Add middleware
	router.Use(middleware.CORSMiddleware)
	router.Use(middleware.LoggingMiddleware)
	router.Use(middleware.RateLimitMiddleware)

	// Initialize proxy router
	proxyRouter := proxy.NewProxyRouter()

	apiRouter := router.PathPrefix("/api").Subrouter()

	// Setup service routes with specific paths
	apiRouter.PathPrefix("/stores").Handler(proxyRouter.ProxyRequest("store-service"))
	apiRouter.PathPrefix("/store-owners").Handler(proxyRouter.ProxyRequest("store-service"))
	apiRouter.PathPrefix("/products").Handler(proxyRouter.ProxyRequest("product-service"))
	apiRouter.PathPrefix("/orders").Handler(proxyRouter.ProxyRequest("order-service"))

	// Health check endpoint
	router.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		fmt.Fprintf(w, "API Gateway is healthy")
	})

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8000"
	}

	log.Printf("API Gateway starting on port %s\n", port)
	log.Fatal(http.ListenAndServe(":"+port, router))
}
