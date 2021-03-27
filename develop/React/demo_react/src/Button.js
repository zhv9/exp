import React, { Component } from 'react';

export default class Button extends Component {
  constructor() {
    super()
  }
  render() {
    console.log('Button组件更新了')
    return (
      <button type="button">来自外部 js 的 button</button>
    )
  }
}