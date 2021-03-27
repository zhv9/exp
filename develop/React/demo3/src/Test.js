import React, { Component } from 'react'

export default class Test extends Component {
  constructor(props) {
    super()
    console.log('constructor')
    this.state = {
      time: new Date()
    }
  }

  render() {
    console.log('render')
    return (
      <div style={{ border: "solid black 1px" }}>
        <p>Test</p>
        <button type='button' onClick={() => this.setState({})}>Set State 更新</button>
        <button type='button' onClick={() => this.forceUpdate()}>forceUpdate</button>
        <p>{this.state.time.getSeconds()}</p>
      </div>
    )
  }

  tick() {
    this.setState({
      time: new Date()
    })
  }

  // 加载
  componentWillMount() {
    console.log(this.props.name + '组件将要加载 componentWillMount')
    this.timeId = setInterval(() => this.tick(), 1000)
  }

  componentDidMount() {
    console.log(this.props.name + '组件已经加载 componentDidMount')
  }

  // 更新生命周期  
  componentWillReceiveProps(nextProps) {
    console.log(this.props.name + '组件将要接受参数 componentWillReceiveProps')
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log(this.props.name + '组件是否更新 shouldComponentUpdate')
    console.log(nextState)
    if (nextState.time.getSeconds() % 2 === 0) {
      return true
    }
    return false
    // 如果return false 则组件就不会更新了
  }

  componentWillUpdate(nextProps, nextState) {
    console.log(this.props.name + '组件将要更新 componentWillUpdate')
  }

  // getSnapshotBeforeUpdate(){
  //   console.log('在更新前获取截图 getSnapshotBeforeUpdate')
  // }

  componentDidUpdate(prevProps, prevState, info) {
    console.log(this.props.name + '组件已经更新完毕 componentDidUpdate')
  }

  componentWillUnmount() {
    console.log(this.props.name + '组件将要卸载 componentWillUnmount')
    clearInterval(this.timeId)
  }
}