package domain

type Image struct {
	ID         string `gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	ProductID  string `gorm:"type:uuid;not null"`
	URL        string `gorm:"not null"`
	AltText    string
	IsPrimary  bool   `gorm:"default:false"`
}