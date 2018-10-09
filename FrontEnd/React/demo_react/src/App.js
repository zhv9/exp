import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

// 从外部引入组件
import './Button';
import Button from './Button';

// 类方法生成组件
class Nav extends Component {
  constructor() {
    super()
  }

  render() {
    return (
      <div style={{ color: "white", backgroundColor: "black" }}>类方法生成组件</div >
    )
  }
}

// 函数方法生成组件
const ButtonIn = function () {
  return (
    <button type="button">来自函数Button组件</button>
  )
}
class App extends Component {
  constructor() {
    super()
    this.state = {
      like: false
    }
  }

  // 处理 like 状态
  handleClick() {
    this.setState({
      like: !this.state.like
    })
  }
  render() {
    var name = "xiaoming";
    var arr = [1, 2, 3, 4, 5];
    return (
      <div className="App">
        <div>
          <h1>这是第一行</h1>
          <label htmlFor="input">
            <h2>用 react 的 htmlFor 代替原生 for</h2>
            <input type="text" id="input" />
          </label>
          <p></p>

          {/* 使用三元运算符 */}
          js三元运算符: {name === 'xiaoming' ? 'this is xiaoming' : 'not xiaoming'}
          <p></p>
          html: name
          <p></p>

          {/* 使用ES6 的 map 做遍历 */}
          使用ES6 的 map 做遍历: {
            arr.map((v, k) => {
              return <li>{v}-{k}</li>
            })
          }
        </div>
        <div>
          使用 react 做点赞按钮
          <button type="button" style={this.state.like ? { color: "red" } : { color: "black" }}
            onClick={() => this.handleClick()}>
            {this.state.like ? '已赞' : '喜欢'}
          </button>
        </div>
        <div>
          {/* 使用类方法生成的组件 */}
          <Nav />

          {/* 使用函数生成的组件 */}
          <ButtonIn />

          {/* 使用外部js生成的组件 */}
          <Button />
        </div>
      </div>
    );
  }
}

export default App;
