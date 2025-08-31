package interfaces

import (
	"context"
	"product-catalog/internal/domain"
)

type ImageRepository interface {
	Create(ctx context.Context, image *domain.Image) error
	GetByProduct(ctx context.Context, productID string) ([]domain.Image, error)
	UpdateAltText(ctx context.Context, id string, altText string) error
	Delete(ctx context.Context, id string) error
	SetPrimary(ctx context.Context, id string, productID string) error
}