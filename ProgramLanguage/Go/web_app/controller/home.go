package controller

import (
	"net/http"
	"text/template"
)

func registerHomeRoutes() {
	http.HandleFunc("/home", handleHome)
}

func handleHome(rw http.ResponseWriter, r *http.Request) {
	t, _ := template.ParseFiles("templates/layout.html", "templates/home.html")
	t.ExecuteTemplate(rw, "layout", "hello world")
}
