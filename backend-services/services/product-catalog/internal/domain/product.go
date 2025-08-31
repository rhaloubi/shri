package domain

import (
	"time"
)

type Product struct {
	ID          string    `gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	StoreID     string    `gorm:"type:uuid;not null"`
	Name        string    `gorm:"not null"`
	Description string    `gorm:"type:text"`
	Category    string
	Price       float64   `gorm:"type:decimal(10,2)"`
	SKU         string
	IsActive    bool      `gorm:"default:true"`
	CreatedAt   time.Time
	UpdatedAt   time.Time
}
