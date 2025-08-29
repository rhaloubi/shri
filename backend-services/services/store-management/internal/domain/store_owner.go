package domain

import (
	"time"

	"github.com/google/uuid"
)

type StoreOwner struct {
	ID           uuid.UUID `gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	UserID       uuid.UUID `gorm:"type:uuid;unique"`
	BusinessName string    `gorm:"not null"`
	Phone        string    `gorm:"not null"`
	CreatedAt    time.Time
	UpdatedAt    time.Time
}
