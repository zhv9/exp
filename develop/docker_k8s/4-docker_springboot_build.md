# spring boot 构建

https://spring.io/guides/topicals/spring-boot-docker

## 分步构建

java 也可以分为两步来编译，最终编译镜像的大小是 `806.05 MB`。去掉编译环境的镜像大小是 `509.68 MB`。它们主要差在 maven 环境、源码和依赖包上。其他部分应该是没有差异的。

```dockerfile
# 对代码做编译的镜像
FROM maven:3.8.6-jdk-11 as builder

WORKDIR /java
COPY ./ .
# 这里使用预定义的 maven settings.xml 来指定依赖下载地址
RUN mvn --settings ./settings.xml clean install -DskipTests
RUN cp target/*.jar target/app.jar

# 构建运行时的镜像
FROM openjdk:11-oracle
VOLUME /tmp
COPY --from=builder java/target/app.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
```
