package main

import (
	"fmt"
	"strings"
)

func sourceGopher(downstream chan string) {
	source := []string{"hello world", "bad apple", "good bye"}
	for _, v := range source {
		downstream <- v
	}
	close(downstream)
}

// func filterGopher(upstream, downstream chan string) {
// 	for {
// 		item, ok := <-upstream // 通道有两个参数，如果通道关闭则第二个参数 ok 就变为 false
// 		if !ok {
// 			close(downstream)
// 			return
// 		}
// 		if !strings.Contains(item, "bad") {
// 			downstream <- item
// 		}
// 	}
// }

func filterGopher(upstream, downstream chan string) {
	for item := range upstream { // 用 range 可以简化通道关闭检查
		if !strings.Contains(item, "bad") {
			downstream <- item
		}
	}
	close(upstream)
}

func printGopher(upstream chan string) {
	for { // 这里也可以用 range 简化
		v, ok := <-upstream
		if !ok {
			return
		}
		fmt.Println(v)
	}
}

func main() {
	c1 := make(chan string)
	c2 := make(chan string)
	go sourceGopher(c1)
	go filterGopher(c1, c2)
	printGopher(c2)
}
