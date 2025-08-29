package main

import (
    "fmt"
    "log"
    "net/http"
    "os"
    "store-management/internal/handlers"
    "store-management/internal/middleware"
    "github.com/gorilla/mux"
    "github.com/joho/godotenv"
)

func main() {
    // Load environment variables
    if err := godotenv.Load(); err != nil {
        log.Printf("Warning: .env file not found")
    }

    // Initialize database connection
    db, err := database.InitDB()
    if err != nil {
        log.Fatalf("Failed to connect to database: %v", err)
    }
	log.Println("Database connected")
    defer db.Close()

    // Create router
    router := mux.NewRouter()

    // Add middleware
    router.Use(middleware.LoggingMiddleware)
    router.Use(middleware.AuthMiddleware)

    // Initialize handlers
    h := handlers.NewHandler(db)

    // Register routes
    h.RegisterRoutes(router)

    // Start server
    port := os.Getenv("PORT")
    if port == "" {
        port = "8001"
    }

    fmt.Printf("Server starting on port %s\n", port)
    log.Fatal(http.ListenAndServe(":"+port, router))
}