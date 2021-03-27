import React, { Component } from 'react';

export default class PropsButton extends Component {
  constructor() {
    super()
  }
  render() {
    return (
      <button type="button">
        {this.props.name}
      </button>
    )
  }
}

// 函数的组件
const PropsNav = function (props) {
  return (
    <div style={{ color: "white", backgroundColor: "black" }}>
      {props.title}
      {props.children}
    </div>
  )
}
export {PropsNav}