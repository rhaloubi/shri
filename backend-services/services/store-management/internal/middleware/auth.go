package middleware

import (
	"context"
	"encoding/json"
	"net/http"
	"strings"
)

type Claims struct {
	UserID  string `json:"user_id"`
	IsAdmin bool   `json:"is_admin"`
}

type AuthenticationMiddleware struct{}

func NewAuthMiddleware() *AuthenticationMiddleware {
	return &AuthenticationMiddleware{}
}

func (m *AuthenticationMiddleware) ValidateToken(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		authorizationHeader := r.Header.Get("Authorization")
		if authorizationHeader == "" {
			http.Error(w, "Authorization header required", http.StatusUnauthorized)
			return
		}

		tokenParts := strings.Split(authorizationHeader, " ")
		if len(tokenParts) != 2 || tokenParts[0] != "Bearer" {
			http.Error(w, "Invalid authorization format", http.StatusUnauthorized)
			return
		}

		// Here you would normally validate the JWT token
		// For now, we'll assume the token is a JSON string containing user_id and is_admin
		var claims Claims
		if err := json.Unmarshal([]byte(tokenParts[1]), &claims); err != nil {
			http.Error(w, "Invalid token", http.StatusUnauthorized)
			return
		}

		// Add claims to request context
		ctx := context.WithValue(r.Context(), "claims", claims)
		next.ServeHTTP(w, r.WithContext(ctx))
	}
}

func (m *AuthenticationMiddleware) RequireAdmin(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		claims, ok := r.Context().Value("claims").(Claims)
		if !ok || !claims.IsAdmin {
			http.Error(w, "Admin access required", http.StatusForbidden)
			return
		}
		next.ServeHTTP(w, r)
	}
}
