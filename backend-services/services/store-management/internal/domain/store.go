package domain

import (
	"time"
)

type Store struct {
	ID           string `gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	StoreOwnerID string `gorm:"type:uuid;not null"`
	Name         string `gorm:"not null"`
	Description  string
	Street       string `gorm:"not null"`
	City         string `gorm:"not null"`
	State        string `gorm:"not null"` // region in Morocco
	Latitude     float64
	Longitude    float64
	LogoURL      string
	IsActive     bool `gorm:"default:true"`
	CreatedAt    time.Time
	UpdatedAt    time.Time
	StoreOwner   StoreOwner `gorm:"foreignKey:StoreOwnerID"`
}
