package domain

import (
	"time"
)

type Review struct {
	ID        string    `gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	UserID    string    `gorm:"type:uuid;not null"`
	ProductID string    `gorm:"type:uuid;not null"`
	Rating    int       `gorm:"not null"`
	Comment   string    `gorm:"type:text"`
	CreatedAt time.Time
}