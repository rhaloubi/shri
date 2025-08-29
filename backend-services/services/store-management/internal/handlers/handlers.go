package handlers

import (
    "gorm.io/gorm"
    "github.com/gorilla/mux"
)

type Handler struct {
    db *gorm.DB
}

func NewHandler(db *gorm.DB) *Handler {
    return &Handler{db: db}
}

func (h *Handler) RegisterRoutes(router *mux.Router) {
    // Routes will be added here
}