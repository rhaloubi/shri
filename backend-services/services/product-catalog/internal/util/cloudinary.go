package utils

import (
	"context"
	"fmt"
	"os"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
)

type CloudinaryService struct {
	cld *cloudinary.Cloudinary
}

func NewCloudinaryService() (*CloudinaryService, error) {
	// Get Cloudinary credentials from environment variables
	cloudName := os.Getenv("CLOUDINARY_CLOUD_NAME")
	apiKey := os.Getenv("CLOUDINARY_API_KEY")
	apiSecret := os.Getenv("CLOUDINARY_API_SECRET")

	// Create new Cloudinary instance
	cld, err := cloudinary.NewFromParams(cloudName, apiKey, apiSecret)
	if err != nil {
		return nil, fmt.Errorf("failed to initialize Cloudinary: %v", err)
	}

	return &CloudinaryService{cld: cld}, nil
}

// UploadImage uploads an image file to Cloudinary and returns the secure URL
func (s *CloudinaryService) UploadImage(ctx context.Context, filePath string) (string, error) {
	uploadResult, err := s.cld.Upload.Upload(ctx, filePath, uploader.UploadParams{
		Folder: "product_images",
	})
	if err != nil {
		return "", fmt.Errorf("failed to upload image: %v", err)
	}
	return uploadResult.SecureURL, nil
}
