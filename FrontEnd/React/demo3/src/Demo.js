import React, { Component } from "react";

export default class Demo extends Component {
  constructor(props) {
    super(props)
    console.log("constructor")
    this.state = {
      isRender: true
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    console.log("静态生命周期函数")
    // 函数返回结果将会被添加到state，添加/更新state的内容
    // 返回 null 说明 state 不需要任何改变
    return {
      like: true
    }
  }

  render() {
    return (
      <div>Demo</div>
    )
  }

  componentDidMount() {
    console.log(this.props.name + '组件已经加载 componentDidMount')
  }

  shouldComponentUpdate() {
    console.log(this.props.name + '组件是否更新 shouldComponentUpdate')
    return true
  }

  // getSnapshotBeforeUpdate(){
  //   console.log('在更新前获取截图 getSnapshotBeforeUpdate')
  // }

  componentDidUpdate(prevProps, prevState, info) {
    console.log(this.props.name + '组件已经更新完毕 componentDidUpdate')
  }

  componentWillUnmount() {
    console.log(this.props.name + '组件将要卸载 componentWillUnmount')
  }
}