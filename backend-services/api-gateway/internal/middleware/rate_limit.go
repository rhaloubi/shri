package middleware

import (
	"net/http"
	"sync"
	"time"
)

type RateLimiter struct {
	requests map[string][]time.Time
	mutex    sync.Mutex
}

var limiter = &RateLimiter{
	requests: make(map[string][]time.Time),
}

func RateLimitMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		limiter.mutex.Lock()
		defer limiter.mutex.Unlock()

		ip := r.RemoteAddr
		now := time.Now()
		window := now.Add(-time.Minute)

		requests := limiter.requests[ip]
		validRequests := make([]time.Time, 0)

		for _, req := range requests {
			if req.After(window) {
				validRequests = append(validRequests, req)
			}
		}

		if len(validRequests) >= 100 { // 100 requests per minute
			http.Error(w, "Rate limit exceeded", http.StatusTooManyRequests)
			return
		}

		limiter.requests[ip] = append(validRequests, now)
		next.ServeHTTP(w, r)
	})
}