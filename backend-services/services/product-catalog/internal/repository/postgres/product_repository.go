package postgres

import (
	"context"
	"fmt"
	"product-catalog/internal/domain"
	"product-catalog/internal/repository/interfaces"

	"gorm.io/gorm"
)

type productRepository struct {
	db *gorm.DB
}

func NewProductRepository(db *gorm.DB) interfaces.ProductRepository {
	return &productRepository{db: db}
}

func (r *productRepository) Create(ctx context.Context, product *domain.Product) error {
	return r.db.WithContext(ctx).Create(product).Error
}

func (r *productRepository) GetByID(ctx context.Context, id string) (*domain.Product, error) {
	var product domain.Product
	if err := r.db.WithContext(ctx).First(&product, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &product, nil
}

func (r *productRepository) GetByStore(ctx context.Context, storeID string) ([]domain.Product, error) {
	var products []domain.Product
	if err := r.db.WithContext(ctx).Where("store_id = ?", storeID).Find(&products).Error; err != nil {
		return nil, err
	}
	return products, nil
}

func (r *productRepository) Update(ctx context.Context, product *domain.Product) error {
	return r.db.WithContext(ctx).Save(product).Error
}

func (r *productRepository) Delete(ctx context.Context, id string) error {
	return r.db.WithContext(ctx).Delete(&domain.Product{}, "id = ?", id).Error
}

func (r *productRepository) UpdateStatus(ctx context.Context, id string, isActive bool) error {
	return r.db.WithContext(ctx).Model(&domain.Product{}).Where("id = ?", id).Update("is_active", isActive).Error
}

func (r *productRepository) Search(ctx context.Context, query string) ([]domain.Product, error) {
	var products []domain.Product
	searchQuery := fmt.Sprintf("%%%s%%", query)
	if err := r.db.WithContext(ctx).Where(
		"name ILIKE ? OR description ILIKE ? OR category ILIKE ?",
		searchQuery, searchQuery, searchQuery,
	).Find(&products).Error; err != nil {
		return nil, err
	}
	return products, nil
}

func (r *productRepository) GetByCategory(ctx context.Context, category string) ([]domain.Product, error) {
	var products []domain.Product
	if err := r.db.WithContext(ctx).Where("category = ?", category).Find(&products).Error; err != nil {
		return nil, err
	}
	return products, nil
}

func (r *productRepository) GetFeatured(ctx context.Context) ([]domain.Product, error) {
	var products []domain.Product
	if err := r.db.WithContext(ctx).Where("is_active = ?", true).Limit(10).Find(&products).Error; err != nil {
		return nil, err
	}
	return products, nil
}