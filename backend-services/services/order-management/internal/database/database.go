package database

import (
	"database/sql"
	"fmt"
	"os"
	"order-management/internal/domain"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type DBConnection struct {
	GormDB *gorm.DB
	SQLDB  *sql.DB
}

func InitDB() (*DBConnection, error) {
	// Read DATABASE_URL from environment
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		return nil, fmt.Errorf("DATABASE_URL is not set")
	}

	// Open GORM connection
	gormDB, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}

	// Run migrations
	if err := autoMigrate(gormDB); err != nil {
		return nil, fmt.Errorf("failed to run migrations: %w", err)
	}

	// Get underlying *sql.DB for cleanup
	sqlDB, err := gormDB.DB()
	if err != nil {
		return nil, fmt.Errorf("failed to get sql.DB from gorm.DB: %w", err)
	}

	return &DBConnection{
		GormDB: gormDB,
		SQLDB:  sqlDB,
	}, nil
}

func (dbConn *DBConnection) Close() error {
	return dbConn.SQLDB.Close()
}

// autoMigrate runs database migrations for all models
func autoMigrate(db *gorm.DB) error {
	// Enable UUID extension for PostgreSQL
	if err := db.Exec("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\"").Error; err != nil {
		return fmt.Errorf("failed to create uuid extension: %w", err)
	}

	// Run migrations for all models
	return db.AutoMigrate(
		&domain.Order{},
		&domain.OrderItem{},
	)
}