package middleware

import (
	"net/http"
	"os"
)

func ServiceAuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Check if request comes from API Gateway
		gatewaySecret := r.Header.Get("X-Gateway-Secret")
		if gatewaySecret != os.Getenv("GATEWAY_SECRET") {
			http.Error(w, "Unauthorized: Direct access not allowed", http.StatusUnauthorized)
			return
		}
		next.ServeHTTP(w, r)
	})
}
