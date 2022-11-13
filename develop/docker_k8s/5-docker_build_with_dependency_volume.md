# 挂载依赖卷构建

## 挂载卷

由于 `docker build` 不支持挂载卷，所以需要用 `docker run` 来操作。

- `-it`: 打开 docker 终端，就可以看到操作的 log 了
- `-rm`: 如果有相同名称的容器名就删掉
- `-name`: 给容器加名字
- `-v`: 挂载卷，格式是 `<本地绝对路径>:<docker 中绝对路径>`
- `-w`: 工作空间地址，也就是进入 docker 后的初始目录
- `golang:1.19-alpine`: image 名称
- `sh`: 执行的脚本`sh -c xxxx` 使用 `-c` 以后才能添加多个命令

## golang 构建 

golang 这边挂载了 `-v $HOME/go:/root/go` 和项目目录，同时在执行脚本的时候设置了 `export GOPATH=/root/go` 这样在编译时就可以使用宿主机已经下载的依赖。

```sh
docker run \
    -it \
    --rm \
    --name go-httpd-builder \
    -v $HOME/go:/root/go \
    -v "$(pwd)":/go \
    -w /go \
    golang:1.19-alpine \
    sh -c 'export GOPATH=/root/go && go build -o httpd ./main.go'
```

## springboot 构建

springboot 这边挂载了 m2 目录 `-v $HOME/.m2:/root/.m2` 和项目目录，这样就可以直接使用宿主机的 maven 依赖了。另外还可以在运行 docker 之前先执行 `mvn dependency:go-offline` 将所有依赖下载下来。

```sh
mvn dependency:go-offline

docker run \
    -it \
    --rm \
    --name java-httpd-builder \
    -v $HOME/.m2:/root/.m2 \
    -v "$(pwd)":/java \
    -w /java \
    maven:3.8.6-jdk-11 \
    bash -c 'mvn clean install && cp target/*.jar target/app.jar'
```
