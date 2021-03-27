# React

注：以下笔记主要参考了“红点工厂”的视频教程和ppt。

## setting

如果需要在js中写 html 的话，可以在 vscode 中添加以下设置，但是有时会有些影响 js 的编写

```js
    "emmet.includeLanguages": {
        "javascript": "javascriptreact"
    },
    "emmet.triggerExpansionOnTab": true
```

## React语法和结构

### import … from … 关键字

```js
import React, { Component } from ‘react’;//引⼊入React 及其 Component
import logo from './logo.svg';           //引⼊入React logo（图像资源）
import './App.css';                      //引⼊入APP.css（css资源）
```

解构

```js
var obj = {
    a :’this is a’,
    b :’this is b’,
    c: ‘this is c’
    };
var {a} = obj; //a = ‘this is a’; 
```
### class 和 extends 关键字 

```js
// es6
class App extends Component{
    render(){}
} 

// es5
var App = function(){
this.render = function(){}
}
App.prototype = new Component();
```

### render函数

⽤用于将JSX渲染DOM到⻚页⾯面中

1. 在 React 组件（类）中是必须要实现的
2. render 函数只在 state 改变后触发


### export语法

变量量引出给其他组件使⽤用，类似于 Node 中的 exports，组件式开发的基础。

### JSX语法和细则

#### JSX标签属性说明

| HTML 标签属性 | JSX             | 原因                          |
| ------------- | --------------- | ----------------------------- |
| for           | htmlFor         | for 在 JS 中为 for 循环关键字 |
| class         | className       | class 在 JS 中为声明类关键字  |
| style         | 需使⽤用 JS 对象 |                               |

#### JSX中执⾏行行JS代码 {}

一个{ }中只能执⾏行行⼀一⾏行行JS语句句

```js
{xiaoming.sex ? "男":"⼥"}

{
    history.map((v,k)=><p></p>)
}
```

#### JSX中注释：使⽤用{ }

```
HTML注释：<—注释的内容—>
JSX注释：{ /**注释的内容**/} 
```

#### JSX中必须只有一个根节点

```js
render(){
    return(
        <div>
            <p></p>
            <img /> 
        </div>)
}
```

## 组件化开发

### 组件书写方式

以编写⽂文件为src/Nav.js的<Nav />组件为例：

```js
// 类方式
import React , {Component} from ‘react’;

export default class Nav extends Component{
    constructor(){
        super();
    }
    render(){…}
}

// 函数方式
const Nav = (props) => {
    return <div>NavBar</div>
} 
export default Nav;
```

### 组件引入方式

```js
// 主文件
import Nav from ‘./src/Nav’;
… 
render(){
    return(
        <div>
            <Nav />
        </div>)
}

// 组件
const Nav = (props) => {
    return <div>NavBar</div>
}

// 最终效果
<div>
    <div>NavBar</div>
</div>
```

## 事件监听和处理理

```js
class Demo extends Component{
    handleClick(){} 
    render(){
        <p onClick={()=>this.handleClick()}></p>
    }
}
```

1. 在 jsx 中，事件监听的属性为驼峰式命名
2. 在 jsx 中，事件监听指向一个 js 函数

html: `onclick="handleClick()"`

jsx: `onClick={()=>this.handleClick()}` 

## 在 jsx 中回调函数的 this 问题

```js
<p onClick={this.handleClick}></p>
// this => <p>
```
jsx 的<p></p>会被编译为 React.createElement，这样会丢失 this 作⽤用域

解决⽅方案1: 在 constructor 中 bind 绑定组件的 this
解决⽅方案2: 使⽤用箭头函数保留留组件 this 作⽤用域

```js
// bind 绑定 this 作⽤用域
constructor(){
    this.handleClick.bind(this)
}
handleClick(){}

// es6箭头函数保留留作⽤用域
<p onClick={()=>this.handleClick()}></p>
```

## state, props, context

React组件的三个属性
- this.state: 组件状态
- this.props: 组件接受的参数
- this.context: 组件接受的上下文


### state

像人一样，处在开心/难过的不同状态时 所呈现的表情是不一样的。

React 通过限制 state，使程序状态更加可控

1. state 只能在组件的 constructor 中初始化
2. state 只能使用 setState 方法更新
3. setState 会导致 render 重新执行，渲染组件和子组件

```js
constructor(){
    this.state = {
        happy: true
    }
}
this.setState({
    happy: false
})
```

state 用在 render 中渲染 jsx

```js
render(){
    return(
        <p> hello !I’m {this.state.happy}</p>
    )
}
```

### props 组件间参数 - 子组件难免要使用父组件指定的参数

```js
<Nav title={'名字'} >
    <span>组件的⼦子组件</span>
</Nav>

class Nav extends Component{
    constructor(props){
        super(props)  //继承⽗父组件的props
    }
    render(){
        return (
            <div>{…this.props.children}</div>
        )
    }
}
```

- Nav 中 this.prop
  - this.props.title    //“名字”
  - 在组件标签中，可以指定一个属性传递给子组件
  - this.props.children    //<span>组件的子组件</span> 
  - this.props.children 是一个特殊的属性， 组件的子组件可以在此获取
- 一般通过解构语句放到 jsx 中
- constructor 中继承 props: 在构造函数需要用 this.props 的时候

### context 上下文参数传递 - 在主组件中设置 context，参数会自动传递

## 状态提升 - 将组件的状态提升到共同的父组件中 然后组件共享父组件的状态

在每个组件中可以通过setState去修改组件状态，
但是如何修改别的组件的state呢？

> `<App />`
> > `<Title />`
> >
> > `<p style={{color: 'red'}}>标题</p>`
> 
> > `<Button />`
> >
> > `onClick 改变 Title 的颜色？`

每个组件维护⾃自⼰己的 state

难以去修改别的组件的 state

```js
App --> props --> Button
App --> props --> Title

// App
state = {themeColor: 'red'}

// title
state = {themeColor: this.props.themeColor}

// Button
state = {themeColor: this.props.themeColor}
```



## 方法下放 - 将父组件的函数传递给子组件

在 Button 组件中使用 App 传递的 handleClick 方法

```js
class App extends Component {
    handleClick() {
        this.setState()
    }
    render() {
        return (
            <Button
                onClick={() => this.handleClick()}
            />)
    }
}

class Button extends Component{
// 省略代码
    render(){
        return (
            <button
                onClick={()=>this.props.handleClick()}
            >换色</button>
        )
    }
}
```

## 生命周期函数

![ReactLifeCycle](./image/ReactLifeCycle.png)
