# 代码整洁

https://gist.github.com/wojteklu/73c6914cc446146b8b533c0988cf8d29

https://github.com/tum-esi/common-coding-conventions

## 代码可读性

- 名副其实：变量命名应该与内容相符
- 避免误导：0 和 O 或者长相相似的单词不能有。
- 有意义的区分
    - `copyChars(char a1[], char a2[])` 中的 a1 和 a2 不能表明他们的差别，用 source 和 destination 更好。
    - 一个类中有两个方法 `ProductData` 和 `ProductInfo` 虽然名字不同，但是意思差不多。别人无法知道该用哪个。
    - 不要在命名时候写废话，比如：`NameString`，其中 `String` 没有意义
- 使用**可以搜索**的名称
- 业务问题使用**业务领域名称**：与涉及业务领域更接近的代码，应当使用业务领域的命名。
- 解决方案使用**技术领域名称**：因为程序的读者是程序员，所以在非业务层面可以使用程序员熟悉的技术名称。比如：AccountVisitor（访问者模式）或者 JobQueue。
- 类名和对象名：使用名词
- 方法名：使用动词
- 避免思维映射：不应该让读者理解错误，比如 HP 有人认为是电脑公司有人认为是 Hit Point。
- 添加有意义的语境
    - 在 houseNumber，state，city 中可以轻易知道 state 是 address 的一部分。如果把 state 单独拿出来就不知道是什么了。所以需要为他们添加对应语境，例如命名加上 address(addressState)或更好的方式是将它们定义到 Address 类中（Address.state）。

## 短小的函数

函数不超过 20 行，大多数不超过 10 行。函数参数尽可能少，最好不要有参数。

函数越短小，就越容易阅读，而且越符合`单一责任`原则。

## 不要重复自己

## 用代码来阐述

## 能用函数变量就别用注释

