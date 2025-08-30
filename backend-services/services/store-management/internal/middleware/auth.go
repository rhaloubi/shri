package middleware

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/lestrrat-go/jwx/jwk"
	"github.com/lestrrat-go/jwx/jwt"
)

type Claims struct {
	ID    string `json:"id"`
	Email string `json:"email"`
	Role  string `json:"role"`
}

type AuthenticationMiddleware struct {
	key jwk.Key
}

// NewAuthMiddleware loads Ed25519 public key from JWT_PUBLIC_KEY env variable
func NewAuthMiddleware() (*AuthenticationMiddleware, error) {
	jwkJSON := os.Getenv("JWT_PUBLIC_KEY")
	if jwkJSON == "" {
		return nil, fmt.Errorf("JWT_PUBLIC_KEY environment variable not set")
	}

	key, err := jwk.ParseKey([]byte(jwkJSON))
	if err != nil {
		return nil, fmt.Errorf("failed to parse JWK: %v", err)
	}

	return &AuthenticationMiddleware{
		key: key,
	}, nil
}

func (m *AuthenticationMiddleware) ValidateToken(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		auth := r.Header.Get("Authorization")
		if auth == "" {
			http.Error(w, "Authorization header required", http.StatusUnauthorized)
			return
		}

		parts := strings.SplitN(auth, " ", 2)
		if len(parts) != 2 || parts[0] != "Bearer" {
			http.Error(w, "Use 'Bearer <token>'", http.StatusUnauthorized)
			return
		}

		tokenStr := parts[1]
		set := jwk.NewSet()
		set.Add(m.key)

		log.Println("DEBUG: Parsing JWT:", tokenStr)

		token, err := jwt.Parse([]byte(tokenStr), jwt.WithKeySet(set))
		if err != nil {
			log.Printf("DEBUG: JWT parse/verify failed: %v", err)
			http.Error(w, fmt.Sprintf("Invalid or expired token: %v", err), http.StatusUnauthorized)
			return
		}

		log.Println("DEBUG: Token parsed successfully")

		// Extract raw claims for debugging
		rawClaims := token.PrivateClaims()
		claimsJSON, _ := json.MarshalIndent(rawClaims, "", "  ")
		log.Println("DEBUG: Raw Claims:", string(claimsJSON))

		// Unmarshal claims into struct
		var claims Claims
		if err := json.Unmarshal(claimsJSON, &claims); err != nil {
			log.Printf("DEBUG: Failed to parse claims struct: %v", err)
			http.Error(w, "Invalid token claims", http.StatusUnauthorized)
			return
		}

		// Debug: print extracted claims
		log.Printf("DEBUG: Claims: ID=%s, Email=%s, Role=%s", claims.ID, claims.Email, claims.Role)

		// Store claims in context
		ctx := context.WithValue(r.Context(), "claims", claims)
		next.ServeHTTP(w, r.WithContext(ctx))
	}
}

func (m *AuthenticationMiddleware) RequireAdmin(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		claims, ok := r.Context().Value("claims").(Claims)
		if !ok || claims.Role != "admin" {
			http.Error(w, "Admin access required", http.StatusForbidden)
			return
		}
		next.ServeHTTP(w, r)
	}
}

func GetClaims(ctx context.Context) (Claims, bool) {
	claims, ok := ctx.Value("claims").(Claims)
	return claims, ok
}
