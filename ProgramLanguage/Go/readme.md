# Go 语言中包和文件的引用

1. 如果需要引用第三方组件，就需要创建 `go.mod` 文件然后使用 `go get xxxx` 获取对应包。不然是引用不到的。
2. 如果在一个目录中引用这个目录中其他文件，需要保证这个目录中所有 `.go` 文件的包名，也就是第一行的 `package xxx` 一样，不然这整个目录的引用都会报错。
3. 如果是可执行文件，则 `main()` 函数的 package 需要是 `main`。
4. 如果文件在子目录中，则 `package` 的名字必须和目录名一样，然后用 `<mod name>/<package name>` 引用。
5. 如果 vscode 的 workspace 中有多个 go 项目的话，有会导致项目间冲突，无法引用子模块中的内容。需要一个 vscode 打开一个项目（以后有可能会解决这个问题）。

下面分别是项目中目录和相关组件的代码关系：

```go
// root/children/test.go
package children

func ChildrenTest() {
}

```

```go
// root/go.mod
module my_mod

go 1.16
```

```go
// root/test.go
package main // 同一个目录下，包名需要是一样的

func RootTest() {
}
```

```go
// root/main.go
package main // 同一个目录下，包名需要是一样的，如果不需要生成可执行程序，则不需要用 main 包

import "my_mod/children" // 因为包不同(children)，所以需要引用，然后调用

func main() {
    children.ChildrenTest()
    RootTest() // 因为是同一个包(main)内，所以可以直接调用
}
```
