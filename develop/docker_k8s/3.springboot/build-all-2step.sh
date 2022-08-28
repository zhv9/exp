# build by builder docker
docker build -t java-httpd-builder -f Dockerfile.builder .

# copy executable file to local
docker create --name extract-httpserver java-httpd-builder
docker cp extract-httpserver:/java/target/app.jar ./target/app.jar
docker rm -f extract-httpserver
docker rmi -f java-httpd-builder

# build runtime image
docker build -t java-httpd-oracle -f Dockerfile.target .
