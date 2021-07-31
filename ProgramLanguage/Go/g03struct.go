package main

import (
	"fmt"
	"math"
	"strings"
)

// ------------------------------------
// 结构体变量

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

// ------------------------------------
// 结构体类型

type location struct {
	lat  float64
	long float64
}

func typeStruct() {
	var spirit = location{lat: -4.5895, long: 137.4417}
	fmt.Println(spirit)
}

// ------------------------------------
// 结构体的赋值

func copyType() {
	a := location{-4, 5}
	b := a // 赋值是完全复制 struct，下面打印出来的数值是不一样的
	a.long += 3
	fmt.Println(a, b)
}

// ------------------------------------
// 结构体的构造函数及其方法

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

type world struct {
	radius float64
}

// 在 world 类型上声明一个方法
func (w world) distance(p1, p2 location) float64 {
	s1, c1 := math.Sincos(rad(p1.lat))
	s2, c2 := math.Sincos(rad(p2.lat))
	clong := math.Cos(rad(p1.long - p2.long))
	return w.radius * math.Acos(s1*s2+c1*c2*clong)
}

// rad converts degrees to radians.
func rad(deg float64) float64 {
	return deg * math.Pi / 180
}

func structConstructorAndMethod() {
	lat := coordinate{4, 35, 22.2, 'S'}        // 使用字面量来构造 coordinate
	long := newCoordinate(137, 26, 30.12, 'E') // 使用 构造用函数 来构造 coordinate
	fmt.Println(lat.decimal(), long.decimal())

	var mars = world{radius: 2289.5}
	spirit := location{-14.5684, 175.472636}
	opportunity := location{-1.9462, 354.4734}

	dist := mars.distance(spirit, opportunity) // 使用 mars 定义的方法
	fmt.Printf("%.2f km\n", dist)
}

// ------------------------------------
// 组合和转发来实现面向对象中的继承

/**
这个是一般定义类型的方法，和下面那种对比的差别在于：
如果在 temperature 上定义方法，并且 report 类型想用的话，
就得使用 report.temperature.average()。
而下面的方式则可以直接使用 report.average() 也就是“嵌入”
**/
// type report struct {
// 	sol         int
// 	temperature temperature
// 	location    location
// }

// 这个是将 temperature 和 location 嵌入到 report 类型中，report 就可以使用嵌入类型的方法了
//
// 在使用上面这个类型的时候如果里面的字段都含有相同的方法，比如 sol 和 location 都有 days() 方法
// 则 report.days() 就会报错，这时就得按照原始路径使用 days() 方法
// 如果非要使用 report.days() 那就在 report 上定义一个 days() 方法就可以了
type report struct {
	sol
	temperature
	location
}

// 给基础类型定义有意义的名称方法来使用
type sol int

func (s sol) days(s2 sol) int {
	days := int(s2 - s)
	if days < 0 {
		days = -days
	}
	return days
}

type temperature struct {
	high, low celsius
}

type celsius float64

// -------
// 类型组合

func typeCombination() {
	bradbury := location{-4.5895, 137.4417}
	t := temperature{high: -1.0, low: -78.0}
	report := report{
		sol:         15,
		temperature: t,
		location:    bradbury,
	}

	fmt.Printf("%+v\n", report)
	fmt.Printf("a balmy %v \n", report.temperature.high)
}

// -------
// 方法的转发

func (t temperature) average() celsius {
	return (t.high + t.low) / 2
}

// 这个就是方法的转发
// 将 report 上的 average 方法转发到 temperature 的 average 方法上了
func (r report) average() celsius {
	return r.temperature.average()
}

func methodForward() {
	bradbury := location{-4.5895, 137.4417}
	t := temperature{high: -1.0, low: -78.0}
	// 1. 首先可以通过 temperature 直接调用 average 方法
	fmt.Println(t.average())
	report := report{
		sol:         15,
		temperature: t,
		location:    bradbury,
	}
	// 2. 其次可以通过 report 中的 temperature 调用 average 方法
	fmt.Println(report.temperature.average())
}

func objectOriented() {
	typeCombination()
	methodForward()
}

// ------------------------------------
// 接口及其自动实现，来使接口后定义成为可能

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

// 为 martian 类型实现了 talker 接口，也就是 talker 接口里面的 talk 方法
func (m martian) talk() string {
	return "nack nack"
}

type laser int

// 为 laser 类型实现了 talker 接口，也就是 talker 接口里面的 talk 方法
func (l laser) talk() string {
	return strings.Repeat("pew ", int(l))
}

// 接受一个 talker 类型参数
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
	structConstructorAndMethod()
	useInterface()
}
