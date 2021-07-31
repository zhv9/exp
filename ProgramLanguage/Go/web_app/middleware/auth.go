package middleware

import "net/http"

type AuthMiddleware struct {
	Next http.Handler
}

func (am *AuthMiddleware) ServeHTTP(rw http.ResponseWriter, r *http.Request) {
	// 没有 Next 的时候使用默认的路由
	if am.Next == nil {
		am.Next = http.DefaultServeMux
	}

	auth := r.Header.Get("Authorization")
	if auth != "" {
		am.Next.ServeHTTP(rw, r)
	} else {
		rw.WriteHeader(http.StatusUnauthorized)
	}
}
