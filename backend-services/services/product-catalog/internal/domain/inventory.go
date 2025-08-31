package domain

import (
	"time"
)

type Inventory struct {
	ID        string    `gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	ProductID string    `gorm:"type:uuid;not null;unique"`
	Quantity  int       `gorm:"not null;default:0"`
	Reserved  int       `gorm:"default:0"`
	UpdatedAt time.Time
}