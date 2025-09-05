package proxy

import (
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
)

type ProxyRouter struct {
	serviceURLs  map[string]string
	gatewaySecret string
}

func NewProxyRouter() *ProxyRouter {
	return &ProxyRouter{
		serviceURLs: map[string]string{
			"store-service":   os.Getenv("STORE_SERVICE_URL"),
			"product-service": os.Getenv("PRODUCT_SERVICE_URL"),
			"order-service":  os.Getenv("ORDER_SERVICE_URL"),
		},
		gatewaySecret: os.Getenv("GATEWAY_SECRET"),
	}
}

func (pr *ProxyRouter) ProxyRequest(service string) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		serviceURL := pr.serviceURLs[service]
		if serviceURL == "" {
			http.Error(w, "Service not found", http.StatusNotFound)
			return
		}

		url, err := url.Parse(serviceURL)
		if err != nil {
			http.Error(w, "Invalid service URL", http.StatusInternalServerError)
			return
		}

		// Add gateway secret header for service authentication
		r.Header.Set("X-Gateway-Secret", pr.gatewaySecret)
		r.Header.Set("X-Gateway-Service", service)
		r.Header.Set("X-Forwarded-Host", r.Header.Get("Host"))

		proxy := httputil.NewSingleHostReverseProxy(url)
		r.URL.Host = url.Host
		r.URL.Scheme = url.Scheme

		proxy.ServeHTTP(w, r)
	})
}