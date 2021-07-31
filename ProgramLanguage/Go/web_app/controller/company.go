package controller

import (
	"net/http"
	"regexp"
	"strconv"
	"text/template"
)

func registerCompanyRoutes() {
	http.HandleFunc("/companies", handleCompanies)
	// "/companies/123" 就会进到这里，因为带 / 和这个更吻合
	http.HandleFunc("/companies/", handleCompany)
}

func handleCompanies(rw http.ResponseWriter, r *http.Request) {
	t, _ := template.ParseFiles("templates/layout.html", "templates/companies.html")
	t.ExecuteTemplate(rw, "layout", nil)
}

func handleCompany(rw http.ResponseWriter, r *http.Request) {
	t, _ := template.ParseFiles("templates/layout.html", "templates/company.html")
	pattern, _ := regexp.Compile(`/companies/(\d+)`)
	matches := pattern.FindStringSubmatch(r.URL.Path)
	if len(matches) > 0 {
		companyId, _ := strconv.Atoi(matches[1])
		t.ExecuteTemplate(rw, "layout", companyId)
	} else {
		rw.WriteHeader(http.StatusNotFound)
	}
}
