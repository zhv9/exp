# build by builder docker
docker build -t go-httpd-builder:latest -f Dockerfile.build .

# copy executable file to local
docker create --name extract-httpserver httpd-builder
docker cp extract-httpserver:/go/httpd ./httpd
docker rm -f extract-httpserver
docker rmi -f httpd-builder

# build runtime image
docker build -t go-httpd-alpine -f Dockerfile.target .
