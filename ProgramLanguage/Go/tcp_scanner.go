package main

import (
	"fmt"
	"net"
	"sort"
	"sync"
)

var ip = "192.168.2.1"

type portStatus struct {
	port int
	open bool
}

func scanner(port int) portStatus {
	status := portStatus{port: port, open: false}
	address := fmt.Sprintf("%s:%d", ip, port)
	conn, err := net.Dial("tcp", address)
	if err != nil {
		fmt.Printf("%s 关闭!!\n", address)
		return status
	}
	conn.Close()
	fmt.Printf("%s 打开\n", address)
	status.open = true
	return status
}

func useWaitGroup() {
	// 这个 WaitGroup 是一个计数器，用 add 的话就会加一，done 就会减一
	// wait 就会等到计数器归零后再继续向下走。
	var wg sync.WaitGroup
	for i := 21; i < 120; i++ {
		wg.Add(1)
		go func(port int) {
			scanner(port)
			wg.Done()
		}(i)
	}
	wg.Wait()
}

func worker(ports chan int, wg *sync.WaitGroup, result chan portStatus) {
	for p := range ports {
		status := scanner(p)
		result <- status
		wg.Done()
	}
}

func useChannel() {
	ports := make(chan int, 100) // 这个 100 是这个 channel 的缓冲
	var wg sync.WaitGroup

	// 有了这个 results 后 WaitGroup 应该就没有必要了。
	// 但实际上没有 WaitGroup 的话就会提早关闭 result 导致 panic
	results := make(chan portStatus)
	var openPorts []int
	var closePorts []int

	for i := 0; i < cap(ports); i++ {
		// 这里先准备好 capacity 数量的 worker
		go worker(ports, &wg, results)
	}

	// 这个收集结果的 goroutine 需要先于执行操作的 goroutine
	// 不然就有可能收集不到结果了，因为 result 没有缓冲也就是只能放一个。
	// 如果 result 里面已经有数据了，后面又有新数据，就卡到那块了
	go func() {
		for i := 1; i < 1024; i++ {
			port := <-results
			if port.open {
				openPorts = append(openPorts, port.port)
			} else {
				closePorts = append(closePorts, port.port)
			}
		}
	}()

	for i := 1; i < 1024; i++ {
		wg.Add(1)
		fmt.Println("add port: ", i)
		// 由于 ports 最大只有 100 所以这里的添加在添加满以后，就会停下。
		// 直到 ports 中的内容减少以后才能继续添加进去
		ports <- i
	}
	wg.Wait()
	close(ports)
	close(results)

	// 所有的执行完后需要对结果排序
	sort.Ints(openPorts)
	sort.Ints(closePorts)

	fmt.Println("Open ports: ", openPorts)
	fmt.Println("Close ports: ", closePorts)

}

func main() {
	useWaitGroup()
	useChannel()
}
