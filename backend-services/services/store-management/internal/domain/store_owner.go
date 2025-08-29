package domain

import (
	"time"
)

type StoreOwner struct {
	ID           string `gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	UserID       string `gorm:"not null;unique"`
	BusinessName string `gorm:"not null"`
	Phone        string `gorm:"not null"`
	CreatedAt    time.Time
	UpdatedAt    time.Time
}
