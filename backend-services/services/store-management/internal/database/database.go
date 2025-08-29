package database

import (
	"database/sql"
	"fmt"
	"os"

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
