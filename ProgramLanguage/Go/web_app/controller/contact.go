package controller

import (
	"log"
	"net/http"
	"text/template"
)

func registerContactRoutes() {
	http.HandleFunc("/contact", handleContact)
}

func handleContact(rw http.ResponseWriter, r *http.Request) {
	t, _ := template.ParseFiles("templates/layout.html")
	e := t.ExecuteTemplate(rw, "layout", "")
	log.Println(e)
}
