# Redux

## Redux 是用来代替 MVC 框架的 -- 避免 view 层修改 model 层

![ReduxFlow](./image/ReduxFlow.png)

Dispatcher: 处理动作分发，维持 Store 之间的依赖关系
Store：存储数据和处理数据相关逻辑
Action：驱动 Dispatcher 的 JavaScript 对象
View：视图部分

需要增加新功能的时候，要做的只是增加一种新的 Action 类型，Dispatcher 的对外接口并不用改变。

## Redux 的基本原则

- 唯一数据源
  - 数据应该只存储在唯一的一个 Store 上
- 保持状态只读
  - 不能直接修改状态，要修改 Store 的状态，必须要通过派发一个 action 对象来完成。
- 数据改变只能通过纯函数来完成
  - 指的是 Reducer，每个 Reducer 的签名是`reducer(state, action)`，reducer 需要做的就是根据两个参数返回一个新的对象，因为必须是纯函数，所以这个 reducer 不能产生任何副作用。


## 一个简单的流程

### Store

```js
import {createStore} from 'redux';
import reducer from './Reducer.js';
const initValues = {
  'First': 0,
  'Second': 10,
  'Third': 20
};
const store = createStore(reducer, initValues);
export default store;
```

### Reducer

```js
import * as ActionTypes from './ActionTypes.js';

export default (state, action) => {
  const {counterCaption} = action;

  switch (action.type) {
    case ActionTypes.INCREMENT:
      return {...state, [counterCaption]: state[counterCaption] + 1};
    case ActionTypes.DECREMENT:
      return {...state, [counterCaption]: state[counterCaption] - 1};
    default:
      return state
  }
}
```

### Action

```js
export const INCREMENT = 'increment';
export const DECREMENT = 'decrement';
```

```js
import * as ActionTypes from './ActionTypes.js';
export const increment = (counterCaption) => {
  return {
    type: ActionTypes.INCREMENT,
    counterCaption: counterCaption
  };
};
export const decrement = (counterCaption) => {
  return {
    type: ActionTypes.DECREMENT,
    counterCaption: counterCaption
  };
};
```

### Dispatcher

```js
function mapDispatchToProps(dispatch, ownProps) {
  return {
    onIncrement: () => {
      dispatch(Actions.increment(ownProps.caption));
    },
    onDecrement: () => {
      dispatch(Actions.decrement(ownProps.caption));
    }
  }
}

// 如果没有用 react-redux 则可以这样
import store from '../Store.js';
onIncrement() {
  store.dispatch(Actions.increment(this.props.caption));
}
onDecrement() {
  store.dispatch(Actions.decrement(this.props.caption));
}
```


## Store

### 使用 context 来传递 store

为了让所有组件都能拿到这个唯一的 Store，Redux 使用 context 来传递。

但是比较麻烦的是上级组件需要宣称自己支持 context，并且提供一个函数来返回代表 context 的对象。

然后上级组件之下的所有子孙组件，只要宣称自己需要这个 context，就可以通过 `this.context` 访问到这个共同的环境对象。

```js
import {PropTypes, Component} from 'react';
class Provider extends Component {
  getChildContext() {
    return {
      store: this.props.store
    };
  }
  render() {
    return this.props.children;
  }
}
Provider.propTypes = {
  store: PropTypes.object.isRequired
}
Provider.childContextTypes = {
  store: PropTypes.object
};

export default Provider;
```

所有对 store 的访问，都是通过 `this.context.store` 完成。

```js
class CounterContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.onIncrement = this.onIncrement.bind(this);
    this.onDecrement = this.onDecrement.bind(this);
    this.onChange = this.onChange.bind(this);
    this.getOwnState = this.getOwnState.bind(this);
    this.state = this.getOwnState();
  }
  getOwnState() {
    return {
      value: this.context.store.getState()[this.props.caption]
    };
  }
  onIncrement() {
    this.context.store.dispatch(Actions.increment(this.props.caption));
  }
  onDecrement() {
    this.context.store.dispatch(Actions.decrement(this.props.caption));
  }
  ```

### 使用 React-Redux

使用 context 传递 store 虽然可行，但是还是太麻烦。

使用 React-Redux 库以后：

- 就可以不用再自己实现 Provider 了，只需要 `import {Provider} from 'react-redux';` 即可。这样可以使代码变得更简洁。
- 可以使用 connect 来连接 action。

#### connect

用法 `export default connect(mapStateToProps, mapDispatchToProps)(Counter);`

这个函数主要做了两件事：

- 把 store 上的状态转化为组件的 props。`mapStateToProps`
- 把组件中的用户动作转化为派送给 store 的动作。`mapDispatchToProps`

```js
import React, { PropTypes } from 'react';
import * as Actions from '../Actions.js';
import {connect} from 'react-redux';

function Counter({caption, onIncrement, onDecrement, value}) {
  return (
    <div>
      <button style={buttonStyle} onClick={onIncrement}>+</button>
      <button style={buttonStyle} onClick={onDecrement}>-</button>
      <span>{caption} count: {value}</span>
    </div>
  );
}
Counter.propTypes = {
  caption: PropTypes.string.isRequired,
  onIncrement: PropTypes.func.isRequired,
  onDecrement: PropTypes.func.isRequired,
  value: PropTypes.number.isRequired
};
function mapStateToProps(state, ownProps) {
  return {
    value: state[ownProps.caption]
  }
}
function mapDispatchToProps(dispatch, ownProps) {
  return {
    onIncrement: () => {
      dispatch(Actions.increment(ownProps.caption));
    },
    onDecrement: () => {
      dispatch(Actions.decrement(ownProps.caption));
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Counter);
```

#### Provider

 这个 Provider 要求 store 必须包含以下三个函数

 - subscribe
 - dispatch
 - getState

## 模块化 React 和 Redux 应用

### 文件组织

### 模块边界和接口

### store 状态树设计

### 针对 store 的 action 设计 - actionType 和 action

### reducer 组合

由于 createStore 只能接受一个 reducer 所以需要将 reducer 组合起来`combineReducers({a: reducerA, b: reducerB})`

