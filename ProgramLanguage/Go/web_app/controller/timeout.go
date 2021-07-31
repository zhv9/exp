package controller

import (
	"fmt"
	"net/http"
	"strconv"
	"time"
)

func registerTimeoutRoutes() {
	http.HandleFunc("/timeout", handleTimeout)
}

func handleTimeout(rw http.ResponseWriter, r *http.Request) {
	t, err := strconv.Atoi(r.FormValue("timeout"))
	if err != nil {
		rw.WriteHeader(http.StatusBadRequest)
	}
	time.Sleep(time.Duration(t) * time.Second)
	fmt.Fprintln(rw, t)
}
