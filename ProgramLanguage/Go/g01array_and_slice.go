package main

import "fmt"

func main() {
	// 下面声明了 8 位的数组，的 8 可以用 ... 代替
	var planets = [8]string{"Ceres", "Pluto", "Haumea", "Makemake", "Eris"}

	for i := 0; i < len(planets); i++ {
		fmt.Println(i, planets[i])
	}

	sliceArray := planets[0:3] // 这个是切分数组，是半开区间，包含0，1，2 三个数据
	for i, item := range sliceArray {
		fmt.Println(i, item)
	}

	newSlice := []string{"This", "is", "slice", "use", "[]string", "not", "[8]string"}
	fmt.Println(newSlice)
}
