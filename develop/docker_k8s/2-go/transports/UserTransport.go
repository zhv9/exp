package transports

import (
	"context"
	"encoding/json"
	"errors"
	"hello/endpoints"
	"net/http"
	"strconv"
)

func DecodeUserRequest(c context.Context, r *http.Request) (any, error) {
	if r.URL.Query().Get("uid") != "" {
		uid, _ := strconv.Atoi(r.URL.Query().Get("uid"))
		return endpoints.UserRequest{Uid: uid}, nil
	}
	return nil, errors.New("request should have uid in query")
}

func EncodeUserResponse(c context.Context, w http.ResponseWriter, response any) error {
	w.Header().Set("Content-type", "application/json")
	return json.NewEncoder(w).Encode(response)
}
