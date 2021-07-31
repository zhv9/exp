# go web

https://www.bilibili.com/video/BV1Xv411k7Xn

## hello world

```go
func helloWeb() {
	// 这个就是对根路由进行响应，第二个参数是回调函数，在请求到达时就会执行这个函数
	http.HandleFunc("/", func(rw http.ResponseWriter, r *http.Request) {
		rw.Write([]byte("hello world"))
	})
	// 第二个参数使用 nil，实际就使用的是 DefaultServeMux 就类似于路由器
	http.ListenAndServe("localhost:8080", nil)
}
```

## 自定义 http handler

```go
package main

import "net/http"

type myHandler struct{}

func (m *myHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Hello world"))
}

func main() {
	mh := myHandler{}
	server := http.Server{
		Addr:    "localhost:8080",
		Handler: &mh,
	}
	server.ListenAndServe()
}
```

## 多个 handler

```go
package main

import "net/http"

type helloHandler struct{}

func (m *helloHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Hello world"))
}

type aboutHandler struct{}

func (m *aboutHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("About"))
}

func welcome(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Welcome"))
}

func main() {
	hh := helloHandler{}
	ah := aboutHandler{}
	server := http.Server{
		Addr:    "localhost:8080",
		Handler: nil,
	}
	http.Handle("/hello", &hh)
	http.Handle("/about", &ah)
	http.HandleFunc("/home", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Home"))
	})
	http.Handle("/welcome", http.HandlerFunc(welcome))
	server.ListenAndServe()
}
```

## FileServer

```go
package main

import "net/http"

func main() {
	// // 手写 file server 版
	// http.HandleFunc("/", func(rw http.ResponseWriter, r *http.Request) {
	// 	http.ServeFile(rw, r, "wwwroot"+r.URL.Path)
	// })
	// http.ListenAndServe(":8080", nil)

	// 使用 FileServer 版
	http.ListenAndServe(":8080", http.FileServer(http.Dir("wwwroot")))
}
```

## 处理 http 请求

```go
package main

import (
	"fmt"
	"net/http"
)

func main() {
	http.HandleFunc("/header", func(rw http.ResponseWriter, r *http.Request) {
		fmt.Fprintln(rw, r.Header)
		fmt.Fprintln(rw, r.Header["Accept-Encoding"])
		fmt.Fprintln(rw, r.Header.Get("Accept-Encoding"))
		url := r.URL
		query := url.Query()               // map[string][]string: map[id:[1234] thread_id:[5678]]
		id := query["id"]                  // []string{"1234"}: [1234]
		threadId := query.Get("thread_id") // "5678"
		fmt.Fprintln(rw, query)
		fmt.Fprintln(rw, id)
		fmt.Fprintln(rw, threadId)
	})

	http.HandleFunc("/post", func(rw http.ResponseWriter, r *http.Request) {
		length := r.ContentLength
		body := make([]byte, length)
		r.Body.Read(body)
		fmt.Fprintln(rw, string(body))
	})
	http.ListenAndServe(":8080", nil)
}
```

使用以下请求测试

```
### GET test
GET http://localhost:8080/header?id=1234&thread_id=5678


### POST test
POST http://localhost:8080/post
Content-Type: application/json

{
    "name": "sample",
    "time": "123"
}
```

## 处理表单请求

```go
package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
)

func main() {
	http.HandleFunc("/process_form", func(rw http.ResponseWriter, r *http.Request) {
		r.ParseForm()
		// Nike 是 url 里面 first_name 的值。表单的值会放到切片前面 url 的会放到后面
		fmt.Fprintln(rw, r.Form) // map[first_name:[foo Nike] last_name:[bar]]
		// 使用 PostForm 就可以只拿 form 表单中的值
		fmt.Fprintln(rw, r.PostForm) // map[first_name:[foo] last_name:[bar]]
	})
	http.HandleFunc("/process_multipart_form", func(rw http.ResponseWriter, r *http.Request) {
		r.ParseMultipartForm(1024) // 读取数据的长度
		// 第一部分是一个 map 就是表单的数据，第二部分是文件
		fmt.Fprintln(rw, r.MultipartForm) // &{map[first_name:[foo] last_name:[bar]] map[image:[0x140000c2190]]}

		// ----------
		// FormValue 和 PostFormValue 会自动调用 ParseMultipartForm，并返回 key 的第一个数据
		// 如果表单的 enctype 设置为 multipart/form-data 那么 FormValue 是无法获得 form 中的值，只能获得 url 中的值。
		fmt.Fprintln(rw, r.FormValue("first_name"))     // Nike 也就是 url 中的值
		fmt.Fprintln(rw, r.PostFormValue("first_name")) // foo 也就是 form 中的值

		// ----------
		// 处理文件
		fileHeader := r.MultipartForm.File["uploaded"][0] // 因为可以上传多个文件
		file, err := fileHeader.Open()

		// 使用 FormFile 会自动调用 ParseMultipartForm，并返回第一个文件
		// file, _, err := r.FormFile("uploaded")
		if err == nil {
			data, err := ioutil.ReadAll(file)
			if err == nil {
				fmt.Fprintln(rw, string(data))
			}
		}
	})
	http.ListenAndServe(":8080", nil)
}
```

使用以下请求测试

```
### POST urlencoded form test
POST http://localhost:8080/process_form?first_name=Nike
Content-Type: application/x-www-form-urlencoded

first_name=foo
&last_name=bar

### POST multipart form test
Post http://localhost:8080/process_multipart_form?first_name=Nike
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW

------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="first_name"

foo
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="last_name"

bar
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="uploaded"; filename="test.rest"
Content-Type: image/png

< ./test.rest
------WebKitFormBoundary7MA4YWxkTrZu0gW--

```

## 处理响应

```go
package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

func writeExample(rw http.ResponseWriter, r *http.Request) {
	str := `<html>
<head><title>web</title></head>
<body><h1>hello</h1></body>
</html>`
	rw.Write([]byte(str))
}

func writeHeaderExample(rw http.ResponseWriter, r *http.Request) {
	rw.WriteHeader(501) // 响应的状态码
	fmt.Fprintln(rw, "No such service, try next path")
}

func headerExample(rw http.ResponseWriter, r *http.Request) {
	rw.Header().Set("Location", "http://google.com")
	rw.WriteHeader(302)
}

type Post struct {
	User    string
	Threads []string
}

func jsonExample(rw http.ResponseWriter, r *http.Request) {
	rw.Header().Set("Content-Type", "application/json")
	post := &Post{
		User:    "foo",
		Threads: []string{"first", "second", "third"},
	}
	json, _ := json.Marshal(post)
	rw.Write(json)
}

func main() {
	http.HandleFunc("/write", writeExample)
	http.HandleFunc("/writeheader", writeHeaderExample)
	http.HandleFunc("/redirect", headerExample)
	http.HandleFunc("/json", jsonExample)

	http.ListenAndServe(":8080", nil)
}
```

使用以下请求测试

```
### write
GET http://localhost:8080/write

### write header
GET http://localhost:8080/writeheader

### header
GET http://localhost:8080/redirect
# curl -i localhost:8080/redirect

### json
GET http://localhost:8080/json

```

## template

### simple template

```html
<!DOCTYPE html>
<html lang="en">
  <body>
    <h1>hello</h1>
    {{ . }}
  </body>
</html>
```

```go
package main

import (
	"net/http"
	"text/template"
)

func process(rw http.ResponseWriter, r *http.Request) {
	t, _ := template.ParseFiles("./wwwroot/index.html")
	t.Execute(rw, "hello world")

	ts, _ := template.ParseFiles("t1.html", "t2.html")
	ts.ExecuteTemplate(rw, "t2.html", "hello world") // 指定模板集中的模板
}

func main() {
	http.HandleFunc("/process", process)

	http.ListenAndServe(":8080", nil)
}
```

### 解析模板与执行

首先有一些 html 对应的文件。其中 `templates` 中的文件是通过 `template` 库函数读入内存。`wwwroot` 中的数据是通过 `http.FileServer(http.Dir("wwwroot"))` 解析的。

```
/templates
----/home.html
----/about.html

/wwwroot
----/css/
--------/home.css
--------/about.css
```

```go
package main

import (
	"log"
	"net/http"
	"text/template"
)

func loadTemplates() *template.Template {
	result := template.New("templates")
	result, err := result.ParseGlob("templates/*.html")
	template.Must(result, err) // 解析出错的时候直接恐慌，另外这个函数是在程序启动的时候执行
	return result
}

func main() {
	templates := loadTemplates()

	http.HandleFunc("/", func(rw http.ResponseWriter, r *http.Request) {
		fileName := r.URL.Path[1:]
		t := templates.Lookup((fileName)) // 路径就是文件名，所以根据路径来找 template
		if t != nil {
			err := t.Execute(rw, nil) // 找到模板的时候把模板带数据（这里没带）返回
			if err != nil {
				log.Fatalln(err.Error()) // 执行模板出错的时候报错
			}
		} else {
			rw.WriteHeader(http.StatusNotFound) // 在没有找到模板的时候返回 404
		}
	})

	http.Handle("/css/", http.FileServer(http.Dir("wwwroot")))
	http.Handle("/img/", http.FileServer(http.Dir("wwwroot")))

	http.ListenAndServe(":8080", nil)
}
```

### 模板组合

1. 首先是 layout 模板，是页面的框架。名字通过 `{{ define "layout"}}` 定义成 `layout` 接受一个名字为 `content` 的文件。
2. 其次是 content 模板，是页面的内容。名字也可以通过 `{{ define "content"}}` 定义成名为 `content` 的文件。
3. 接下来就可以通过模板引擎将被命名为 `content` 个各种模板加载到名为 `layout` 的模板中。

layout 模板

```html
{{ define "layout"}}
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Layout</title>
  </head>
  <body>
    <nav class="navbar navbar-dark bg-primary">
      <a class="nav-brand" href="#">Navbar</a>
    </nav>
    <!-- {{ template "content" .}} -->
    {{ block "content" .}} 110 {{ end }}
  </body>
</html>
{{ end }}
```

content 模板

```html
{{define "content"}}
<h1>Home</h1>
<h2>{{ . }}</h2>
{{ end }}
```

模板引擎

```go
func registerHomeRoutes() {
	http.HandleFunc("/home", handleHome)
}

func handleHome(rw http.ResponseWriter, r *http.Request) {
	t, _ := template.ParseFiles("templates/layout.html", "templates/home.html")
	t.ExecuteTemplate(rw, "layout", "hello world")
}
```

## 路由

main 函数中调用 controller 中的 RegisterRoutes 函数，来注册所有的 routes。

```go
package controller

func RegisterRoutes() {
	// 静态路由，一个路径对应一个页面
	registerHomeRoutes()
	registerAboutRoutes()
	registerContactRoutes()

	// 动态路由
	registerCompanyRoutes()
}
```

其中一个静态路由

```go
package controller

import (
	"net/http"
	"text/template"
)

func registerHomeRoutes() {
	http.HandleFunc("/home", handleHome)
}

func handleHome(rw http.ResponseWriter, r *http.Request) {
	t, _ := template.ParseFiles("templates/layout.html", "templates/home.html")
	t.ExecuteTemplate(rw, "layout", "hello world")
}
```

动态路由

```go
package controller

import (
	"net/http"
	"regexp"
	"strconv"
	"text/template"
)

func registerCompanyRoutes() {
	http.HandleFunc("/companies", handleCompanies)
	// "/companies/123" 就会进到这里，因为带 / 和这个更吻合
	http.HandleFunc("/companies/", handleCompany)
}

func handleCompanies(rw http.ResponseWriter, r *http.Request) {
	t, _ := template.ParseFiles("templates/layout.html", "templates/companies.html")
	t.ExecuteTemplate(rw, "layout", nil)
}

func handleCompany(rw http.ResponseWriter, r *http.Request) {
	t, _ := template.ParseFiles("templates/layout.html", "templates/company.html")
	pattern, _ := regexp.Compile(`/companies/(\d+)`)
	matches := pattern.FindStringSubmatch(r.URL.Path)
	if len(matches) > 0 {
		companyId, _ := strconv.Atoi(matches[1])
		t.ExecuteTemplate(rw, "layout", companyId)
	} else {
		rw.WriteHeader(http.StatusNotFound)
	}
}
```

## json

将 json 和 struct 相互映射在 go 里面用 tags 来映射。

```json
{
	"id": 123,
	"name": "foo",
	"country": "bar",
}
```

```go
// 后面跟的叫 tags 用来和 json 做映射的。如果没有这的话，为了导出而大写的字段名就和 json 对不上了
type Company struct {
	Id      int    `json:"id"`
	Name    string `json:"name"`
	Country string `json:"country"`
}
```

### 处理未知结构的 json

```go
map[string]interface{} // 用来存储任意 json 对象
[]interface{} // 用来存储任意数组
```

### 处理 json



```go
package controller

import (
	"encoding/json"
	"log"
	"net/http"
)

type Company struct {
	Id      int    `json:"id"`
	Name    string `json:"name"`
	Country string `json:"country"`
}

func registerJsonRoutes() {
	http.HandleFunc("/json", handleJson)
}

func handleJson(rw http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodPost:
		dec := json.NewDecoder(r.Body)
		company := Company{}
		err := dec.Decode(&company)
		if err != nil {
			log.Println(err.Error())
			rw.WriteHeader(http.StatusInternalServerError)
			return
		}

		enc := json.NewEncoder(rw)
		err = enc.Encode(company)
		if err != nil {
			log.Println(err.Error())
			rw.WriteHeader(http.StatusInternalServerError)
			return
		}
	case http.MethodGet:
		company := Company{123, "foo", "bar"}
		bytes, _ := json.Marshal(company) // 还可以用 MarshalIndent(company, "", "  ") 这种带格式的
		jsonStr := string(bytes)
		fmt.Fprintln(rw, jsonStr)

		_ = json.Unmarshal([]byte(jsonStr), &company)
		fmt.Println(company)
	default:
		rw.WriteHeader(http.StatusMethodNotAllowed)
	}
}
```

## 中间件

- Logging
- 安全校验
- 请求超时
- 响应压缩

```go
package middleware

import "net/http"

type AuthMiddleware struct {
	Next http.Handler
}

func (am *AuthMiddleware) ServeHTTP(rw http.ResponseWriter, r *http.Request) {
	// 没有 Next 的时候使用默认的路由
	if am.Next == nil {
		am.Next = http.DefaultServeMux
	}

	auth := r.Header.Get("Authorization")
	if auth != "" {
		am.Next.ServeHTTP(rw, r)
	} else {
		rw.WriteHeader(http.StatusUnauthorized)
	}
}
```

```go
package main

import (
	"net/http"
	"web_app/controller"
	"web_app/middleware"
)

func main() {
	controller.RegisterRoutes()

	http.ListenAndServe(":8081", new(middleware.AuthMiddleware))
}
```

## 请求上下文

修改请求上下文中的 timeout 字段。其实这个上下文是不能修改的，只能返回一个新的，所以需要使用 `r = r.WithContext(ctx)` 把以前的换掉。

```go
package middleware

import (
	"context"
	"net/http"
	"time"
)

type TimeoutMiddleware struct {
	Next http.Handler
}

func (tm TimeoutMiddleware) ServeHTTP(rw http.ResponseWriter, r *http.Request) {
	if tm.Next == nil {
		tm.Next = http.DefaultServeMux
	}

	ctx := r.Context()
	ctx, _ = context.WithTimeout(ctx, 3*time.Second)
	r = r.WithContext(ctx) // 用新的 context 代替以前的

	ch := make(chan struct{})
	go func() {
		tm.Next.ServeHTTP(rw, r)
		ch <- struct{}{} // 在处理完后面的工作后给 ch 放一个空 struct{}
	}()

	select {
	case <-ch: // 如果先从 ch 获取到内容，那么就直接返回
		return
	case <-ctx.Done(): // 如果 ctx 先 Done() 说明超时了，那就返回超时的状态
		rw.WriteHeader(http.StatusRequestTimeout)
	}
	ctx.Done()
}
```

处理 timeout 的情况。

```go
package controller

import (
	"fmt"
	"net/http"
	"strconv"
	"time"
)

func registerTimeoutRoutes() {
	http.HandleFunc("/timeout", handleTimeout)
}

func handleTimeout(rw http.ResponseWriter, r *http.Request) {
	t, err := strconv.Atoi(r.FormValue("timeout"))
	if err != nil {
		rw.WriteHeader(http.StatusBadRequest)
	}
	time.Sleep(time.Duration(t) * time.Second)
	fmt.Fprintln(rw, t)
}
```

## https

go 语言自带了生成密钥文件的代码，可以执行下面命令生成文件：

```sh
go run /usr/local/go/src/crypto/tls/generate_cert.go -host localhost
```

```cmd
go run c:\go\src\crypto\tls\generate_cert.go -host localhost
```

然后在 `ListenAndServeTLS` 中把两个文件导入：

```go
http.ListenAndServeTLS(":8080", "cert.pem", "key.pem", nil)
```
