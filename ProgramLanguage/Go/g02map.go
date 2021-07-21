package main

import "fmt"

func main() {
	// map 的定义：map[key]value
	// map 传递是引用传递

	// make 的第二个参数是可选的，是预先分配的内存空间
	temperatureMake := make(map[string]int, 8)
	fmt.Println(len(temperatureMake))
	temperature := map[string]int{
		"Earth": 15,
		"Mars":  -65,
	}

	temp := temperature["Earth"]
	fmt.Printf("On average the Earth is %v C.\n", temp)

	temperature["Earth"] = 16
	temperature["Venus"] = 464
	fmt.Println(temperature)

	moon := temperature["Moon"]
	fmt.Println(moon) // 这里没有值，也就是 int 的默认值 0

	// 用逗号分隔出来的 ok 可以拿到这个 Moon 是否存在，并在后面作为 if 判断依据
	if moon, ok := temperature["Moon"]; ok {
		fmt.Printf("On average the moon is %v C.\n", moon)
	} else {
		fmt.Println("no moon temperature")
	}
}
