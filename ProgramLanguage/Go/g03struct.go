package main

import (
	"fmt"
	"strings"
)

func varStruct() {
	// 结构体变量
	var curiosity struct {
		lat  float64
		long float64
	}
	curiosity.lat = -4.5895
	curiosity.long = 137.4417
	fmt.Println(curiosity.lat, curiosity.long)
	fmt.Println(curiosity)
}

// 结构体类型
type location struct {
	lat  float64
	long float64
}

func typeStruct() {
	var spirit = location{lat: -4.5895, long: 137.4417}
	fmt.Println(spirit)
}

func copyType() {
	a := location{-4, 5}
	b := a // 赋值是完全复制 struct，下面打印出来的数值是不一样的
	a.long += 3
	fmt.Println(a, b)
}

type coordinate struct {
	d, m, s float64
	h       rune
}

// 这个是在 coordinate 类型上挂一个 decimal 方法
func (c coordinate) decimal() float64 {
	sign := 1.0
	switch c.h {
	case 'S', 'W', 's', 'w':
		sign = -1
	}
	return sign * (c.d + c.m/60 + c.s/3600)
}

// new 开头的函数就是构造函数，也可以直接写为 new
func newCoordinate(d, m, s float64, h rune) coordinate {
	return coordinate{d, m, s, h}
}

func structMethod() {
	lat := coordinate{4, 35, 22.2, 'S'}
	long := coordinate{137, 26, 30.12, 'E'}
	fmt.Println(lat.decimal(), long.decimal())
}

// interface 描述了 struct 应该要有哪些方法
// 只要某个 struct 有对应的方法，就自动符合对应的 interface

// 接口变量
var t interface {
	talk() string
}

// 接口类型，用来复用
type talker interface {
	talk() string
}

type martian struct{}

func (m martian) talk() string {
	return "nack nack"
}

type laser int

func (l laser) talk() string {
	return strings.Repeat("pew ", int(l))
}

func shout(t talker) {
	louder := strings.ToUpper(t.talk())
	fmt.Println(louder)
}

func useInterface() {
	// 带有 talk() 的结构体，就符合 talk 接口
	// 也就可以给对应的接口变量赋值
	t = martian{}
	fmt.Println((t.talk()))
	t = laser(3)
	fmt.Println(t.talk())

	// 只要实现了 talk() 方法就符合 talker 接口定义。
	// 他们的都可以作为参数来使用
	shout(martian{})
	shout(laser(4))
}

func main() {
	varStruct()
	typeStruct()
	structMethod()

}
