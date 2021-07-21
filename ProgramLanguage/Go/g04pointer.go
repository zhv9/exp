package main

import "fmt"

func refBasic() {
	answer := 42
	fmt.Println(&answer) // 0x14000124008 地址 // & 用来引用地址

	address := &answer    // 这个 address 就是指向 int 类型的指针 *int
	fmt.Println(*address) // 42 // * 用来解引用
	fmt.Printf("address is a %T\n", address)
}

func refType() {
	china := "China"
	var home *string // 定义一个指向 string 类型的指针
	fmt.Printf("home is a %T\n", home)

	home = &china      // 将 string 的地址赋值给 home
	fmt.Println(*home) // 解引用获取对应的值，也就是 china 对应的值
}

type person struct {
	name, superpower string
	age              int
}

func refStruct() {
	timmy := &person{name: "Tim", age: 10} // 这里带 & 所以是指向 person 的指针
	timmy.superpower = "flying"            // 自动解引用，不需要像下面那样手动解引用
	// (*timmy).superpower = "flying"
	fmt.Printf("%+v\n", timmy)
}

func birthday(p *person) { // 函数
	p.age++
}
func (p *person) birthday() { // person 的方法
	p.age++
}
func refArgument() {
	// go 语言的函数和方法都是按值传递参数的，函数操作的都是传递参数的副本
	// 为了修改或者减少复制，就可以用指针进行传递了
	alex := person{
		name: "Alex",
		age:  14,
	}
	birthday(&alex) // 因为是引用，所以可以在函数中直接修改
	fmt.Printf("%+v\n", alex)

	terry := &person{
		name: "Terry",
		age:  15,
	}
	terry.birthday() // 把引用传入
	fmt.Printf("%+v\n", terry)

	nathan := person{
		name: "Nathan",
		age:  15,
	}
	// 虽然nathan 变量不是地址
	// 但使用 . 可以自动将地址传入对应的方法，不需要引用
	terry.birthday()
	fmt.Printf("%+v\n", nathan)
}

func main() {
	refBasic()
	refType()
	refStruct()
}
