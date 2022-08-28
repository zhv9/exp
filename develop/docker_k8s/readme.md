# k8s & Docker

[k8s 学习笔记](https://www.zhihu.com/column/c_1388898360892444672)

## Docker 命令

```sh
# 在容器中执行 shell 命令
docker run alpine echo "Hello World"
# 运行指定版本的 image，tag，不给的话就是 latest
docker run <image>:<tag>

# 在当前目录(最后那个 .) 构建指定名称的 Dockerfile -t 是镜像名。-f 可以不给，给的话就是构建用的 docker 文件名
docker build -t go-httpd-alpine -f Dockerfile.multistage .

# 列出本地所有镜像
docker images

# 执行基于 go-httpd-alpine 镜像，映射主机 8081 到容器内 8080 端口，并在后台运行的容器
# --name 可以不给，不给的话就会随机生成一个(例如sharp_nightingale)
docker run --name httpd-container -p 8081:8080 -d go-httpd-alpine

# 在运行中的容器内执行 shell 脚本 (-i:确保标准输入流保持开放。-t：分配一个伪终端TTY)
docker exec -it httpd-container /bin/sh

# 从 go-httpd-builder 创建一个 extract-httpserver 的容器
docker create --name extract-httpserver go-httpd-builder
docker stop httpd-container # 停止容器
docker rm httpd-container # 删除容器
docker rmi -f httpd-build # 删除镜像
```



