package interfaces

import (
	"context"
	"product-catalog/internal/domain"
)

type ProductRepository interface {
	Create(ctx context.Context, product *domain.Product) error
	GetByID(ctx context.Context, id string) (*domain.Product, error)
	GetByStore(ctx context.Context, storeID string) ([]domain.Product, error)
	Update(ctx context.Context, product *domain.Product) error
	Delete(ctx context.Context, id string) error
	UpdateStatus(ctx context.Context, id string, isActive bool) error
	Search(ctx context.Context, query string) ([]domain.Product, error)
	GetByCategory(ctx context.Context, category string) ([]domain.Product, error)
	GetFeatured(ctx context.Context) ([]domain.Product, error)
}