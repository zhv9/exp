---
marp: true
paginate: true
---

# 使用 testing-library 测试

---

<style scoped>
section {
    font-size: 22px;
}
</style>

- [使用 testing-library 测试](#使用-testing-library-测试)
    - [测试流程](#测试流程)
        - [AAA 原则](#aaa-原则)
    - [测试准备 - render 组件](#测试准备---render-组件)
    - [操作组件](#操作组件)
        - [定位元素](#定位元素)
            - [byTestId](#bytestid)
            - [定位元素的原则](#定位元素的原则)
    - [操作组件](#操作组件-1)
        - [检查组件显示和消失](#检查组件显示和消失)
    - [检查结果](#检查结果)
    - [测试 redux](#测试-redux)
    - [测试 hooks](#测试-hooks)
    - [mock API](#mock-api)
    - [testing-library 的限制](#testing-library-的限制)
    - [其他参考文档](#其他参考文档)

---

## 测试流程

---

<style scoped>
section {
    font-size: 24px;
}
</style>

### AAA 原则

- Arrange：准备
- Act：操作
- Assert：检查

> 一个测试只测一件事，内容与标题相符，测试中不能有分支和循环（有时候 assert 可以有循环）。

```js
import {render, screen, fireEvent} from '@testing-library/react'

const Button = ({onClick, children}) => (
  <button onClick={onClick}>{children}</button>
)

test('calls onClick prop when clicked', () => {
  // Arrange
  const handleClick = jest.fn()
  render(<Button onClick={handleClick}>Click Me</Button>)
  // Act
  fireEvent.click(screen.getByText(/click me/i))
  // Assert
  expect(handleClick).toHaveBeenCalledTimes(1)
})
```

---

## 测试准备 - render 组件

https://testing-library.com/docs/react-testing-library/intro

```js
import {render, screen, fireEvent} from '@testing-library/react'

test('calls onClick prop when clicked', () => {
  // Arrange
  const handleClick = jest.fn()
  render(<Button onClick={handleClick}>Click Me</Button>)
  // Act
  fireEvent.click(screen.getByText(/click me/i))

  expect(handleClick).toHaveBeenCalledTimes(1)
})
```

---

## 操作组件

---

### 定位元素

https://testing-library.com/docs/queries/about

| 函数    | 功能                                   | 使用的地方                       |
| ------- | -------------------------------------- | -------------------------------- |
| screen  | 当前 render 的组件                     | 准备阶段                         |
| getBy   | 获取元素，找不到报错                   | 最初 render 的组件上             |
| findBy  | 查找组件，会等一段时间，时间过了会报错 | 在操作后才出现的组件上           |
| queryBy | 搜索组件，如果找不到返回空             | 在 assert 上判断元素已经不存在了 |

---

#### byTestId

https://testing-library.com/docs/queries/bytestid/

- screen.getByTestId()

```js
import {render, screen} from '@testing-library/react'

function MyComponent() {
  return <div data-testid="custom-element" />;
}

render(<MyComponent />)
const element = screen.getByTestId('custom-element')
```

---

#### 定位元素的原则

https://testing-library.com/docs/queries/about#priority

- 尽量语意化
- `role -> label -> text/value -> test-id`
- test-id 是最后手段

---

## 操作组件

https://testing-library.com/docs/dom-testing-library/api-events

- fireEvent：对元素做一些操作，比如按按钮、输入文本、在元素上移入或移出鼠标、拖动元素等。
- waitFor：一般用在等待某些元素出现或某些操作执行完毕

> 这个 waitFor 有个特殊问题，如果发现在 CI 服务器的 docker 中跑会偶尔失败，那就需要控制一下分配的 cpu 数量符合 docker 设定的数量。
> 
> 因为默认线程是 `CPU 核心数 - 1`。如果是 32 核 CPU，就算在 docker 中设置了 4 也会以 31 个线程来跑测试用例。那没有获取到线程的用例就会 timeout 了。

---

### 检查组件显示和消失

https://testing-library.com/docs/guide-disappearance

```js
test('movie title no longer present in DOM', async () => {
  // element is removed
  await waitForElementToBeRemoved(() => queryByText('the mummy'))
})
```

---

## 检查结果

https://github.com/testing-library/jest-dom#custom-matchers

- .toHaveTextContent()
- .toBeInTheDocument()
- .toBeDisabled()
- .not

---

<style scoped>
section {
    font-size: 18px;
}
</style>

## 测试 redux

https://redux.js.org/usage/writing-tests

主要就是把 Provider 包在要测试的组件外面，然后设置好 redux 中的数据。

使用 [redux-mock-store](https://github.com/reduxjs/redux-mock-store) 可以简化准备 Provider 的工作。

```js
import configureStore from 'redux-mock-store' //ES6 modules
const { configureStore } = require('redux-mock-store') //CommonJS

const middlewares = []
const mockStore = configureStore(middlewares)

// You would import the action from your codebase in a real scenario
const addTodo = () => ({ type: 'ADD_TODO' })

it('should dispatch action', () => {

  // Initialize mockstore with empty state
  const initialState = {}
  const store = mockStore(initialState)

  // Dispatch the action
  store.dispatch(addTodo())

  // Test if your store dispatched the expected actions
  const actions = store.getActions()
  const expectedPayload = { type: 'ADD_TODO' }
  expect(actions).toEqual([expectedPayload])
})
```

---

<style scoped>
section {
    font-size: 24px;
}
</style>

## 测试 hooks

https://github.com/testing-library/react-hooks-testing-library

**利用 renderHook 测试**

```js
import { useState, useCallback } from 'react'
export function useCounter() {
  const [count, setCount] = useState(0)
  const increment = useCallback(() => setCount((x) => x + 1), [])
  return { count, increment }
}
```

```js
import { renderHook, act } from '@testing-library/react-hooks'
import useCounter from './useCounter'

test('should increment counter', () => {
  const { result } = renderHook(() => useCounter())
  act(() => {
    result.current.increment()
  })
  expect(result.current.count).toBe(1)
})
```

---

## mock API

https://jestjs.io/docs/mock-functions

- `__mocks__` 目录内的东西是全局 mock
- `const myMock = jest.fn();`
- `expect(myMock).toHaveBeenCalledWith(arg1, arg2);`
- `beforeAll(jest.clearAllMocks())`

---

## testing-library 的限制

https://github.com/jsdom/jsdom#unimplemented-parts-of-the-web-platform

由于没有实际 render 所以以下不支持：

- Navigation：导航
- Layout：各种尺寸相关的内容

---

## 其他参考文档

使用 testing-library 测试 React 的各类模块的示例：https://www.freecodecamp.org/news/8-simple-steps-to-start-testing-react-apps-using-react-testing-library-and-jest/
