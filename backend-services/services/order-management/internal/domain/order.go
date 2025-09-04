package domain

import (
	"time"
)

type OrderStatus string

const (
	Pending   OrderStatus = "pending"
	Confirmed OrderStatus = "confirmed"
	Shipped   OrderStatus = "shipped"
	Delivered OrderStatus = "delivered"
	Cancelled OrderStatus = "cancelled"
)

type Order struct {
	ID                string      `gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	UserID            string      `gorm:"not null"`
	OrderNumber       string      `gorm:"not null;unique"`
	Status            OrderStatus `gorm:"type:varchar(20);not null;default:'pending'"`
	TotalAmount       float64     `gorm:"type:decimal(10,2);not null"`
	ShippingAddressID string      `gorm:"type:uuid;not null"`
	CreatedAt         time.Time
	UpdatedAt         time.Time
	OrderItems        []OrderItem `gorm:"foreignKey:OrderID;constraint:OnDelete:CASCADE"`
}
