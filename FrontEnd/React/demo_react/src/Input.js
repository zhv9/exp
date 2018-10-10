import React, { Component } from 'react'

// 受控组件
export default class Input extends Component {
  constructor() {
    super()
    this.state = {
      value: ""
    }
  }

  handleInput(e) {
    console.log(e.target.value) // target: html 标签
    console.log(e.nativeEvent) // 原生事件
    if (e.target.value.length > 10) {
      return
    }
    this.setState({
      value: e.target.value
    })
  }

  render() {
    return (
      <input type="text" onInput={(e) => this.handleInput(e)} value={this.state.value} />
    )
  }
}