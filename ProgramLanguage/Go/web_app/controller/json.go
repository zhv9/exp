package controller

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

type Company struct {
	Id      int    `json:"id"`
	Name    string `json:"name"`
	Country string `json:"country"`
}

func registerJsonRoutes() {
	http.HandleFunc("/json", handleJson)
}

func handleJson(rw http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodPost:
		dec := json.NewDecoder(r.Body)
		company := Company{}
		err := dec.Decode(&company)
		if err != nil {
			log.Println(err.Error())
			rw.WriteHeader(http.StatusInternalServerError)
			return
		}

		enc := json.NewEncoder(rw)
		err = enc.Encode(company)
		if err != nil {
			log.Println(err.Error())
			rw.WriteHeader(http.StatusInternalServerError)
			return
		}
	case http.MethodGet:
		company := Company{123, "foo", "bar"}
		bytes, _ := json.Marshal(company) // 还可以用 MarshalIndent(company, "", "  ") 这种带格式的
		jsonStr := string(bytes)
		fmt.Fprintln(rw, jsonStr)

		_ = json.Unmarshal([]byte(jsonStr), &company)
		fmt.Println(company)
	default:
		rw.WriteHeader(http.StatusMethodNotAllowed)
	}
}
