import React, { Component } from 'react'

export default class Test extends Component {
  constructor(props) {
    super()
    console.log('constructor')
  }

  render() {
    console.log('render')
    return (
      <div style={{ border: "solid black 1px" }}>
        Test
        <button type='button' onClick={() => this.setState({})}>Set State 更新</button>
        <button type='button' onClick={() => this.forceUpdate()}>forceUpdate</button>
      </div>
    )
  }

  // 加载
  componentWillMount() {
    console.log(this.props.name + '组件将要加载 componentWillMount')
  }

  componentDidMount() {
    console.log(this.props.name + '组件已经加载 componentDidMount')
  }

  // 更新生命周期  
  componentWillReceiveProps() {
    console.log(this.props.name + '组件将要接受参数 componentWillReceiveProps')
  }

  shouldComponentUpdate() {
    console.log(this.props.name + '组件是否更新 shouldComponentUpdate')
    return true
  }

  componentWillUpdate() {
    console.log(this.props.name + '组件将要更新 componentWillUpdate')
  }

  // getSnapshotBeforeUpdate(){
  //   console.log('在更新前获取截图 getSnapshotBeforeUpdate')
  // }

  componentDidUpdate() {
    console.log(this.props.name + '组件已经更新完毕 componentDidUpdate')
  }

}