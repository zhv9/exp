package main

import (
	"fmt"
	"math/rand"
	"time"
)

func main() {
	fmt.Println("hello")
	c1 := make(chan int)
	for i := 0; i < 5; i++ {
		go sleepyGopher(i, c1)
	}

	timeoutCh := time.After(2 * time.Second)

	for i := 0; i < 5; i++ {
		select {
		case gopherId := <-c1:
			fmt.Println("gopher ", gopherId, "finished")
		case <-timeoutCh:
			fmt.Println("timeout")
			// 如果不在这 return 的话，c1 通道就会接收完所有的值。
			// 而不是在 timeout 以后退出
			return
		}
	}
}

func sleepyGopher(id int, c chan int) {
	time.Sleep(time.Duration(rand.Intn(4000)) * time.Millisecond)
	fmt.Println(id, "snore")
	c <- id
}
