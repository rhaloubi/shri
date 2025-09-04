package domain

type OrderItem struct {
	ID         string  `gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	OrderID    string  `gorm:"type:uuid;not null"`
	ProductID  string  `gorm:"type:uuid;not null"`
	Quantity   int     `gorm:"not null"`
	UnitPrice  float64 `gorm:"type:decimal(10,2);not null"`
	TotalPrice float64 `gorm:"type:decimal(10,2);not null"`
	Order      Order   `gorm:"foreignKey:OrderID"`
}
