package main

import (
	"fmt"
	"hello/endpoints"
	"hello/services"
	"hello/transports"

	"net/http"
	"time"

	kitHttp "github.com/go-kit/kit/transport/http"
	"github.com/gorilla/mux"
)

func greet(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hello World! %s", time.Now())
}

func getKitServer() *kitHttp.Server {
	user := services.UserService{}
	endpoint := endpoints.GenUserEndpoint(user)
	return kitHttp.NewServer(endpoint, transports.DecodeUserRequest, transports.EncodeUserResponse)
}

func main() {
	router := mux.NewRouter()

	router.HandleFunc("/health", greet)

	kitServer := getKitServer()
	router.Handle("/user", kitServer)

	http.ListenAndServe(":8080", router)
}
