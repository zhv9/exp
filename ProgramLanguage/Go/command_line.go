package main

import (
	"bufio"
	"fmt"
	"os"
)

func main() {
	var s, sep string

	// os.Args 是操作系统的参数集合，第0个是命令本身，后面是每个用空格分隔的每个参数
	// 下面的 for 循环是为了把集合参数打印到一行写的，也可以用 strings.Join 来做
	for _, arg := range os.Args[1:] {
		s += sep + arg
		sep = " "
	}
	fmt.Println(s)

	// 下面是读取过用户在执行过程中输入数据的方法
	fmt.Println("What's your name?")
	reader := bufio.NewReader(os.Stdin)
	text, _ := reader.ReadString('\n') // 用 \n 表示输入完成。这里把 \n 也会读如 text 中
	fmt.Printf("Your name is: %s", text)
}
