# cache dependencies to maven home(may no needed)
mvn dependency:go-offline

# build project by maven:3.8.6-jdk-11 with ".m2" and "project" folder as volume.
# the jar will build into mounted volume. no need to copy it out of docker image.
docker run \
    -it \
    --rm \
    --name java-httpd-builder \
    -v $HOME/.m2:/root/.m2 \
    -v "$(pwd)":/java \
    -w /java \
    maven:3.8.6-jdk-11 \
    bash -c 'mvn clean install && cp target/*.jar target/app.jar'
