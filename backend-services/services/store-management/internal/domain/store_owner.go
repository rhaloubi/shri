package domain

import (
	"time"
)

type StoreOwner struct {
	ID           string `gorm:"type:uuid;primaryKey"` // Will be set from JWT user ID
	BusinessName string `gorm:"not null"`
	Phone        string `gorm:"not null"`
	CreatedAt    time.Time
	UpdatedAt    time.Time
}
