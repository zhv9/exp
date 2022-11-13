# build project by golang:1.19-alpine with "go" and "project" folder as volume.
# the executable file will build into mounted volume. no need to copy it out of docker image.
docker run \
    -it \
    --rm \
    --name go-httpd-builder \
    -v $HOME/go:/root/go \
    -v "$(pwd)":/go \
    -w /go \
    golang:1.19-alpine \
    sh -c 'export GOPATH=/root/go && go build -o httpd ./main.go'
