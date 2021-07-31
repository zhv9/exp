package controller

import (
	"net/http"
	"text/template"
)

func registerAboutRoutes() {
	http.HandleFunc("/about", handleAbout)
}

func handleAbout(rw http.ResponseWriter, r *http.Request) {
	t, _ := template.ParseFiles("templates/layout.html", "templates/about.html")
	t.ExecuteTemplate(rw, "layout", "")
}
