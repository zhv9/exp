package main

import (
	"net/http"
	"web_app/controller"
	"web_app/middleware"
)

func main() {
	controller.RegisterRoutes()

	// go http.ListenAndServe(":8080", nil)
	http.ListenAndServe(":8080", &middleware.TimeoutMiddleware{
		Next: new(middleware.AuthMiddleware),
	})
	http.ListenAndServeTLS(":8080", "cert.pem", "key.pem", nil)
}
