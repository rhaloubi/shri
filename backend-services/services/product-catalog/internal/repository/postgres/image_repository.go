package postgres

import (
	"context"
	"product-catalog/internal/domain"
	"product-catalog/internal/repository/interfaces"

	"gorm.io/gorm"
)

type imageRepository struct {
	db *gorm.DB
}

func NewImageRepository(db *gorm.DB) interfaces.ImageRepository {
	return &imageRepository{db: db}
}

func (r *imageRepository) Create(ctx context.Context, image *domain.Image) error {
	return r.db.WithContext(ctx).Create(image).Error
}

func (r *imageRepository) GetByProduct(ctx context.Context, productID string) ([]domain.Image, error) {
	var images []domain.Image
	if err := r.db.WithContext(ctx).Where("product_id = ?", productID).Find(&images).Error; err != nil {
		return nil, err
	}
	return images, nil
}

func (r *imageRepository) UpdateAltText(ctx context.Context, id string, altText string) error {
	return r.db.WithContext(ctx).Model(&domain.Image{}).Where("id = ?", id).Update("alt_text", altText).Error
}

func (r *imageRepository) Delete(ctx context.Context, id string) error {
	return r.db.WithContext(ctx).Delete(&domain.Image{}, "id = ?", id).Error
}

func (r *imageRepository) SetPrimary(ctx context.Context, id string, productID string) error {
	// Start a transaction
	return r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		// First, set all images for this product as non-primary
		if err := tx.Model(&domain.Image{}).Where("product_id = ?", productID).Update("is_primary", false).Error; err != nil {
			return err
		}

		// Then set the selected image as primary
		if err := tx.Model(&domain.Image{}).Where("id = ?", id).Update("is_primary", true).Error; err != nil {
			return err
		}

		return nil
	})
}