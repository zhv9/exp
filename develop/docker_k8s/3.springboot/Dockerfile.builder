FROM maven:3.8.6-jdk-11

WORKDIR /java

COPY ./ .
RUN mvn --settings ./settings.xml clean install
RUN cp target/*.jar target/app.jar
