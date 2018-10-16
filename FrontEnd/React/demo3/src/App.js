import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Test from './Test'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isRenderTest: true
    }
  }
  render() {
    return (
      <div className="App">
        App
        <button type='button' onClick={() => this.setState({})}>App 父组件 setState</button>
        <button type='button' onClick={() => this.setState({ isRenderTest: !this.state.isRenderTest })}>切换渲染Test2</button>
        <Test name="test1"></Test>
        <hr />
        {this.state.isRenderTest ? <Test name="test2"></Test> : "不渲染"}
      </div>
    );
  }
}

export default App;
