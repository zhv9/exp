# 制作 docker 镜像

## 准备项目

自动生成一个 go 项目，作为测试项目

```go
package main

import (
	"fmt"
	"net/http"
	"time"
)

func greet(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hello World! %s", time.Now())
}

func main() {
	http.HandleFunc("/", greet)
	http.ListenAndServe(":8080", nil)
}
```

## 构建

### 直接构建

直接通过 go 语言的基础脚本构建，会包括整个的构建环境。构建后一般环境(Debian)镜像大小为 `847.46 MB`，alpine 环境镜像为 `354.68 MB`。

```Dockerfile
# https://hub.docker.com/_/golang
FROM golang:1.19-alpine

WORKDIR /go
COPY ./main.go .

RUN go build -o httpd ./main.go

ENTRYPOINT [ "/go/httpd" ]
```

```sh
docker build -t httpd-direct:latest -f Dockerfile.direct .
```

### 分解构建和执行镜像

虽然 alpine 环境小了很多，但是还是包含了 go 语言环境，导致镜像依然比较大。现在有一个比较流行的做法：

1. 使用 golang:1.19-alpine 编译代码 [Dockerfile.build](Dockerfile.build)
2. 使用 alpine 执行编译后的代码 [Dockerfile.target](Dockerfile.target)

```dockerfile
# 编译代码的 Dockerfile.build
FROM golang:1.19-alpine

WORKDIR /go
COPY ./main.go .

RUN go build -o httpd ./main.go
```

```dockerfile
# 执行代码的 Dockerfile.target
FROM alpine

COPY ./httpd /root/httpd
RUN chmod +x /root/httpd

WORKDIR /root

ENTRYPOINT [ "/root/httpd" ]
```

#### 胶水脚本

它们还需要用胶水脚本 [build-all-2step.sh](2-go/build-all-2step.sh) 组合到一起。

- 这个脚本首先构建 builder 镜像，将代码编译成二进制文件。
- 然后将二进制文件复制出来，并删除前一步的 builder 镜像。
- 最后将二进制文件复制到空白镜像中使用。

```sh
# build by builder docker
docker build -t go-httpd-builder:latest -f Dockerfile.build .

# copy executable file to local
docker create --name extract-httpserver go-httpd-builder
docker cp extract-httpserver:/go/httpd ./httpd
docker rm -f extract-httpserver
docker rmi -f go-httpd-builder

# build runtime image
docker build -t go-httpd-alpine -f Dockerfile.target .
```

最终构建出来的镜像文件只有 `17.82 MB`。

#### 合并两步构建去掉胶水脚本

在 17.05.0_ce 之后的 docker 支持多阶段构建，这样就可以将所有构建的脚本写入一个 dockerfile 中，去掉胶水脚本了。其中主要是通过 `as builder` 和 `COPY --from=builder` 来连接的。构建出来大小和分步构建的相同，都是 `17.82 MB`。

[Dockerfile.multistage](Dockerfile.multistage)

```dockerfile
FROM golang:alpine as builder

WORKDIR /go
COPY ./main.go .

RUN go build -o httpd ./main.go

FROM alpine

WORKDIR /root/
COPY --from=builder /go/httpd .
RUN chmod +x /root/httpd

ENTRYPOINT [ "/root/httpd" ]
```
