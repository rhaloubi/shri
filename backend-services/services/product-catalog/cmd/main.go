package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"product-catalog/api/routes"
	"product-catalog/internal/database"
	"syscall"
	"time"

	"github.com/fsnotify/fsnotify"
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

	// Setup routes
	routes.SetupRoutes(router, dbConn.GormDB)

	// Get port
	port := os.Getenv("PORT")
	if port == "" {
		port = "8002"
	}

	// Create server
	server := &http.Server{
		Addr:    ":" + port,
		Handler: router,
	}

	// Start file watcher if in development
	if os.Getenv("GO_ENV") == "development" {
		go watchFiles()
	}

	// Handle graceful shutdown
	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt, syscall.SIGTERM)

	// Start server
	go func() {
		fmt.Printf("Server starting on port %s\n", port)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Server error: %v", err)
		}
	}()

	// Wait for stop signal
	<-stop
	log.Println("Shutting down server...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	server.Shutdown(ctx)
}

func watchFiles() {
	watcher, err := fsnotify.NewWatcher()
	if err != nil {
		return
	}
	defer watcher.Close()

	// Watch main directories
	dirs := []string{"./internal", "./api"}
	for _, dir := range dirs {
		watcher.Add(dir)
	}

	for {
		select {
		case event := <-watcher.Events:
			if event.Op&fsnotify.Write == fsnotify.Write &&
				len(event.Name) > 3 && event.Name[len(event.Name)-3:] == ".go" {
				log.Printf("File changed: %s - Restarting...", event.Name)
				os.Exit(0) // Exit and let process manager restart
			}
		case <-watcher.Errors:
			return
		}
	}
}
