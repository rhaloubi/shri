package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"product-catalog/internal/database"

	/*"product-catalog/internal/middleware"
	"product-catalog/internal/routes"*/

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Printf("Warning: .env file not found")
	}

	// Initialize database connection
	dbConn, err := database.InitDB()
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer dbConn.Close()
	log.Println("Database connected")

	// Create router
	router := mux.NewRouter()

	// Add middleware
	//router.Use(middleware.LoggingMiddleware)

	// Setup routes before starting the server
	//routes.SetupRoutes(router, dbConn.GormDB)

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8002"
	}

	fmt.Printf("Server starting on port %s\n", port)
	log.Fatal(http.ListenAndServe(":"+port, router))
}
