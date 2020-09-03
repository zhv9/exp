# React Hooks Overview

以下是一个有大部分类型 hooks 的 react 组件，其中包含了使用和设置 state 数据功能，获取 redux 数据功能，调用 action 和使用 ref。

使用 hooks 组件个人觉得最大的好处是节省代码和容易重构。后面各个部分都会对代码行数进行比较。

```js
import applyFilter from './action';

function Summary() {
  // useSelector 获取 redux 数据
  const summaryData = useSelector((storeState) => storeState.summaryData, isEqual);
  const filterData = useSelector((storeState) => storeState.filterData, isEqual);

  const templateData = useSelector((storeState) => storeState.template, isEqual);
  const details = useSelector((storeState) => storeState.details, isEqual);

  // useState 使用当前组件的 state。包括了部分 constructor, setState, this.state 等。
  const [pageNumber, setPage] = useState(50);

  const [currentSummary] = summaryData.split(0, pageNumber);

  function changePage() {
    setPage(pageNumber + 50);
  }

  function checkScrollEnd() {
    const endElement = document.getElementById('domEnd');
    if(checkEnd(endElement)) return true;
    return false;
  }

  // useDispatch 是用来处理 action 的。
  const dispatch = useDispatch();
  function setFilter(newFilter) {
    dispatch(applyFilter(newFilter));
  }

  // useEffect 当前组件的生命周期函数(didMount, didUpdate, shouldUpdate, willReceiveProps)
  useEffect(() => {
    const throttleFunc = throttle(checkScrollEnd);
    window.addEventListener('scroll', throttleFunc);
    return () => {
      window.removeEventListener('scroll', throttleFunc);
    }
  });

  const actionBarRef = useRef(null);

  return (
    <>
      <SummaryTable summary={currentSummary} filterData={filterData} />
      <Detail templateData={templateData} details={details} />
      <ActionBar ref={actionBarRef} page={page} changePage={changePage}  />
      <div id='domEnd'>
    </>
  );
}
```

使用 hooks 相对于 class 组件的一大优势在于非常容易重构，如果想把上面看起来很复杂的组件按照业务提取出来，那么基本上只要一些复制粘贴的操作就行了。

参考 [Custom hooks](#Custom-hooks)

## setState

### Compare with class component

以下是官方的 useState 示例，hooks 的只有 9 行，而 class 版的有 17 行。

```js
import React, { useState } from "react";

function Example() {
  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

```js
// 对应 class 组件的写法
class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
    };
  }

  render() {
    const { count } = this.state;
    return (
      <div>
        <p>You clicked {count} times</p>
        <button onClick={() => this.setState({ count: count + 1 })}>Click me</button>
      </div>
    );
  }
}
```

### Usage of useState

首先 useState 有 3 个关键数据，他们分别是：

1. 0: 初始化 state 时的值，类似于在 class 组件的 constructor 中对 state 进行初始化。这部分只在第一次渲染时执行一次。
2. count: 当前 state 值。
3. setCount: 设置 state 的函数。

这个 useState 会返有两个元素的数组，这样的话通过展开操作就可以很容易对 state 和设置 state 的方法命名。

注意：如果 state 里面是一个对象，而只想更新其中一个参数，则需要先把所有数据组合起来再写 state。像下面这样：

```js
const [allState, setAllState] = useState({ count: 0, page: 1 });

function setPage(newPage) {
  const newState = { ...allState, page: newPage };
  setAllState(newState);
}
```

## useSelector & useStore

### Compare with class component

以下是官方的 useSelector 示例，hooks 的只有 4 行，而 class 版的有 11 到 15 行。

```js
import React from "react";
import { useSelector } from "react-redux";

export const CounterComponent = () => {
  const counter = useSelector((state) => state.counter, isEqual);
  return <div>{counter}</div>;
};
```

对应的 class 组件

```js
import React from "react";
import { connect } from "react-redux";

export class CounterComponent extends React.component {
  shouldComponentUpdate(nextProps) {
    // check counter different
    if (isEqual(this.props.counter, nextProps.counter)) return false;
    return true;
  }

  render() {
    const { counter } = this.props;
    return <div>{counter}</div>;
  }
}

function mapStateToProps(state) {
  const { counter } = state;
  // use reselect to check counter different
  return { counter };
}

export default connect(mapStateToProps)(CounterComponent);
```

### Usage of useSelector

`const result: any = useSelector(selector: Function, equalityFn?: Function)` 有两个参数：

- 第一个参数：selector 函数，这个函数的参数是当前 store，可以从这个 store 中获取需要的参数。
- 第二个参数：比较函数，比较第一个参数返回值是否和前一次相同，默认是浅比较，但如果需要的话，可以使用`isEqual`做深比较。

### Different from useSelector to useStore

useSelector 和 useStore 都是从 redux store 中获取数据，但他们有一些不同：

|                               | useStore                                | useSelector                                                   |
| ----------------------------- | --------------------------------------- | ------------------------------------------------------------- |
| store 更新后是否更新/触发渲染 | 否                                      | 是                                                            |
| 获取数据方法                  | const data = useStore()getState().data; | const data = useSelector((state)=> state.data, [checkEqual]); |

由于 useStore 的数据在第一次渲染后不会更新也不会触发重新渲染，所以一般建议使用 useSelector，只在特色情况下使用 useStore。

## useDispatch

### Compare with class component

以下是官方的 useSelector 示例，hooks 的只有 9 行，而 class 版的有 18 行，如果没有`mapDispatchToProps`的话，也有 13 行。

```js
import React from "react";
import { useDispatch } from "react-redux";

export function CounterComponent({ value }) {
  const dispatch = useDispatch();

  return (
    <div>
      <span>{value}</span>
      <button onClick={() => dispatch({ type: "increment-counter" })}>Increment counter</button>
    </div>
  );
}
```

对应的 class 组件

```js
import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

const increment = () => ({ type: "INCREMENT" });

export class CounterComponent extends React.component {
  render() {
    const { value, boundIncrement } = this.props;
    return (
      <div>
        <span>{value}</span>
        <button onClick={() => boundIncrement()}>Increment counter</button>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    boundIncrement: dispatch(increment()),
  };
};

export default connect(null, mapStateToProps)(CounterComponent);
```

### Usage of useDispatch

这个函数很简单，就是获取 `dispatch` 函数，获取的函数可以有两个用法，一种是直接给一个`{ type: string, payload: string }`，一种是将 `dispatch`和获取 store 的函数传回调函数。

```js
import React from "react";
import { useDispatch } from "react-redux";

function add(value) {
  return (dispatch, getState) => {
    const store = getState();
    const { step } = store;
    dispatch({ type: "increment-counter", payload: firstValue + secondValue });
  };
}

export function CounterComponent({ value }) {
  const dispatch = useDispatch();
  const value = useSelector((state) => state.value);

  // 直接 dispatch
  const addOne = () => dispatch({ type: "increment-counter" });

  // 将 dispatch 和 getState 注入回调函数
  const addByStep = () => dispatch(add(value));

  return (
    <div>
      <span>{value}</span>
      <button onClick={() => addOne()}>Increment counter 1</button>
      <button onClick={() => addByStep()}>Increment counter by step</button>
    </div>
  );
}
```

## useEffect

### Compare with class component

以下官方示例实现了朋友上线和下线注册的功能，会在组件渲染后注册，在组件卸载后注销。hooks 组件用了 16 行代码，而 class 组件用了 30 行代码。

```js
import React, { useState, useEffect } from "react";

function FriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    // Specify how to clean up after this effect:
    return function cleanup() {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  if (isOnline === null) {
    return "Loading...";
  }
  return isOnline ? "Online" : "Offline";
}
```

使用 class 实现：

```js
class FriendStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isOnline: null };
    this.handleStatusChange = this.handleStatusChange.bind(this);
  }

  componentDidMount() {
    ChatAPI.subscribeToFriendStatus(this.props.friend.id, this.handleStatusChange);
  }
  componentWillUnmount() {
    ChatAPI.unsubscribeFromFriendStatus(this.props.friend.id, this.handleStatusChange);
  }
  handleStatusChange(status) {
    this.setState({
      isOnline: status.isOnline,
    });
  }

  render() {
    if (this.state.isOnline === null) {
      return "Loading...";
    }
    return this.state.isOnline ? "Online" : "Offline";
  }
}
```

### Usage of useEffect

使用 useEffect 有三个关键点：

1. 第一个参数中的函数体：是生命周期中渲染过后执行的内容(`didMount`, `didUpdate`)。
2. 第一个参数中的返回值(函数)：是生命周期中卸载前执行的内容(`willUnmount`)。
3. 第二个参数(数组)：如果给的值有变化才重新执行 useEffect 中的内容。如果给一个空数组则 useEffect 只执行一次，也就是只有 `didMount` 和 `willUnmount`。

上面的代码执行的顺序是：

```js
// Mount with { friend: { id: 100 } } props
ChatAPI.subscribeToFriendStatus(100, handleStatusChange); // Run first effect

// Update with { friend: { id: 200 } } props
ChatAPI.unsubscribeFromFriendStatus(100, handleStatusChange); // Clean up previous effect
ChatAPI.subscribeToFriendStatus(200, handleStatusChange); // Run next effect

// Update with { friend: { id: 300 } } props
ChatAPI.unsubscribeFromFriendStatus(200, handleStatusChange); // Clean up previous effect
ChatAPI.subscribeToFriendStatus(300, handleStatusChange); // Run next effect

// Unmount
ChatAPI.unsubscribeFromFriendStatus(300, handleStatusChange); // Clean up last effect
```

从上面顺序可以看出，由于默认情况下 `useEffect` 第二个参数没有给值，所以在每次数据改变，都会执行清除操作。

# Rules of Hooks

1. 如果 hooks 中有数据变化，则会将整个 react 函数全部重新运行一遍。也就是说会先执行 useEffect 返回函数中的内容(也就是 unmount 操作)，再从头执行一遍 react 函数，当然设置 state 默认值的部分只在第一次渲染时设置。
2. hooks 只能放在 react 函数的根节点下，不能放到循环或者嵌套的函数中或 if 中。这样的目的是保证每次渲染都执行了同样的 hooks。如果每次执行的 hooks 不同，则整个组件就会乱套了。
3. hooks 只能从 react 函数中调用，不能在普通函数中调用。除非在自定义的 hooks(use\* 函数) 中调用。

这部分请参考： [Rules of Hooks](https://reactjs.org/docs/hooks-rules.html)

## Custom hooks

自定义的 hooks 通俗的理解就是把组件中的内容提取出来，放到一个自定义的 hooks 里面，在重构时非常有用。有了自定义的 hooks 就可以先在一个组件中实现功能，再需要更好的组织代码或共享组件公共功能时，将对应的东西提取出来。提取的内容可以是整合数据的函数，显示组件，甚至是生命周期。

下面就是将本文第一个组件进行抽取后的代码：

```js
import applyFilter from './action';

function useSummary() {
  const filterData = useSelector((storeState) => storeState.filterData, isEqual);
  const summaryData = useSelector((storeState) => storeState.summaryData, isEqual);
  const [currentSummary] = summaryData.split(0, pageNumber);
  const [pageNumber, setPage] = useState(50);

  function changePage() {
    setPage(pageNumber + 50);
  }
  return { currentSummary, filterData, pageNumber, changePage };
}

function useDetails() {
  const templateData = useSelector((storeState) => storeState.template, isEqual);
  const details = useSelector((storeState) => storeState.details, isEqual);
  return { templateData, details };
}

function usePagination() {
  function checkScrollEnd() {
    const endElement = document.getElementById('domEnd');
    if(checkEnd(endElement)) return true;
    return false;
  }

  useEffect(() => {
    const throttleFunc = throttle(checkScrollEnd);
    window.addEventListener('scroll', throttleFunc);
    return () => {
      window.removeEventListener('scroll', throttleFunc);
    }
  });
}

function Summary() {
  const { currentSummary, filterData, pageNumber, changePage } = useSummary();
  const { templateData, details } = useDetails();
  const
  const dispatch = useDispatch();
  function setFilter(newFilter) {
    dispatch(applyFilter(newFilter));
  }

  usePagination();
  const actionBarRef = useRef(null);

  return (
    <>
      <Filter setFilter={setFilter} />
      <SummaryTable summary={currentSummary} filterData={filterData} />
      <Detail templateData={templateData} details={details} />
      <ActionBar ref={actionBarRef} page={page} changePage={changePage}  />
      <div id='domEnd'>
    </>
  );
}
```

# Other hooks

其他还有：

- [useContext](https://reactjs.org/docs/hooks-reference.html#usecontext)
- [useReducer](https://reactjs.org/docs/hooks-reference.html#usereducer)
- [useCallback](https://reactjs.org/docs/hooks-reference.html#usecallback)
- [useMemo](https://reactjs.org/docs/hooks-reference.html#usememo)
- [useRef](https://reactjs.org/docs/hooks-reference.html#useref)
- [useImperativeHandle](https://reactjs.org/docs/hooks-reference.html#useimperativehandle)
- [useLayoutEffect](https://reactjs.org/docs/hooks-reference.html#uselayouteffect)
- [useDebugValue](https://reactjs.org/docs/hooks-reference.html#usedebugvalue)

其中 `useMemo` 和 `useRef` 稍微常用一些。

useMemo 类似于 reselect，但更好用一些。

useRef 则是需要使用 ref 的时候用。
