# React

## React Jest Test

### Package

```sh
npm install --save-dev jest
npm install --save-dev babel-jest babel-preset-es2015 babel-preset-react
npm install --save react react-dom
# 用来测试react组件的工具
npm install --save-dev react-addons-test-utils
```

设置测试脚本和 `.babelrc`：

```json
"scripts": {
  "test": "jest"
}

// .babelrc
{
  "presets": {"es2015": "react"}
}
```

### Simple Test And Shallow Renderer

由于 Jest 会在源代码中寻找以 .spec、test 命名或位于 __tests__folder 下的文件，所以建议按照这个标准命名。

Jest 的基本使用方法 `test ('works', ()=>{ expect(true).toBe(true) }`， 其中第一个参数是对测试的描述，第二个是实际测试的代码函数，可以用 `expect()` 对某个对象进行预测，并且可以链式调用其它方法，例如 `toBe()`。

对一个简单的 button 组件进行测试的方法如下：

```js
export default class Button extends React.Component {
  render(){
    return (
      <button>
        {this.props.text}
      </button>
    )
  }
}

test('renders with text', ()=>{
  const text = 'text'
  // Given 实现浅渲染，创建 renderer 变量 => 传入文本变量渲染 Button 组件 => 获得渲染结果
  const renderer = TestUtils.createRenderer()
  renderer.render(<Button text={text} />)
  const button = renderer.getRenderOutput()
  
  // When 渲染结果类似于下面这个对象
  expectedReactObject = {
    '$$typeof': Symbol(react.element),
      type: 'button',
      key: null,
      ref: null,
      props: {onClick: undefined, children: 'test'},
      _owner: null,
      _store: {}
  }

  // Then 验证代码
  expect(button.type).toBe('button')
  expect(button.props.children).toBe('test')
})
```

### Test Function Action Use Mock And DOM

测试点击按钮时调用传给组件的 onClick 处理器，由于无法用 TestUtils 在浅渲染中模拟 DOM 事件，所以需要使用 mock 与独立 DOM。

使用 Jest 的 `jest.fn()` 就可以创建一个 mock 函数。方法如下：

```js
export default class Button extends React.Component {
  render(){
    return (
      <button onClick = { this.props.onClick }>
        {this.props.text}
      </button>
    )
  }
}

test('fires the onClick callback', ()=>{
  // Given 创建 mock 函数
  const onClick = jest.fn()
  // Given 将组建渲染进 DOM
  const tree = TestUtils.renderIntoDocument(
    <Button onClick = { onClick } />
  )
  // Given 上面渲染出来的是实际的 DOM 元素，就不能简单的用类来获取了，需要使用下面方法来获取这个button
  const button = TestUtils.findRenderedDOMComponentWithTag(
    tree,
    'button'
  )
  // When 测试的时候使用 TestUtils 中的函数模拟事件
  TestUtils.Simulate.click(button)
  // Then 然后预测代码检查 mock 函数被调用过
  expect(onClick).toBeCalled()
})

```

## React Mocha Test

### Package

```sh
npm --save-dev mocha
npm --save-dev babel-register babel-preset-es2015 babel-preset-react

# 使用 chai 可以像 Jest 那样编写预测代码。
# Chai-spies 用来 mock 函数检查 onClick 是否调用的
# jsdom 是用来创建独立 DOM 的
npm --save-dev chai chai-spies jsdom
```

设置测试脚本：

```json
"scripts": {
  "test": "mocha --compilers js:babel-register"
}
```

```js
global.document = jsdom("")
global.window = document.defaultView

describe('Button',()=>{
  it('renders with test', ()=>{
    const test = 'test'
    const renderer = TestUtils.createRenderer()

    renderer.render(<Button text={text} />)
    const button = renderer.getRenderOutput()

    expect(button.type).to.equal('button')
    expect(button.props.children).to.equal(text)
  })
  
  it('fires the onClick callback', ()=>{
    const onClick = spy()
    const tree = TestUtils.renderIntoDocument(
      <Button onClick = { onClick } />
    )
    const button = TestUtils.findRenderedDOMComponentWithTag(
      tree,
      'button'
    )
    TestUtils.Simulate.click(button)
    expect(onClick).to.be.called()
  })
})
```

## Status and Logic Test For Redux TodoMVC Sample

首先分析软功能，根据功能确认测试点是以下几点

- 用 props 的值初始化状态
- 元素正确使用了 placeholder 属性
- 类名和条件逻辑相匹配
- 输入框的值改变时，状态会随之更新
- onSave 回调会由不同的状态和条件触发

```js
import { shallow } from 'enzyme'

const noop = ()=> {}
test('sets the text prop as value', ()=>{
  const text = 'text'
  const wrapper = shallow(
    <TodoTextInput text={text} onSave={noop} />
  )
  expect(wrapper.prop('value')).toBe(text)
})

test('uses the placeholder prop', ()=>{
  const placeholder = 'placeholder'
  const wrapper = shallow(
    <TodoTextInput placeholder={placeholder} onSave={noop} />
  )
  expect(wrapper.prop('placeholder')).toBe(placeholder)
})

// 测试传入某些 props 后，元素是否会新增相应类名
test('applies the right class names', ()=>{
  const wrapper = shallow(
    <TodoTextInput editing newTodo onSave={noop} />
  )
  expect(wrapper.hasClass('edit new-todo')).toBe(true)
})

// 测试按下 enter 键时，是否会用元素的值调用 onSave 回调
test('fires onSave on enter', ()=>{
  const onSave = jest.fn()
  const value = 'value'
  const wrapper = shallow(<TodoTextInput onSave={ onSave } />)

  // 传入事件对象来模拟按键事件。事件带有两个属性，带有 value 属性的 target(发生该事件的元素) 和 which(按键码) 
  wrapper.simulate('keydown', {target: { value }, which: 13})
  expect(onSave).toHaveBeenCalledWith(value)
})

// 测试按下的不是 enter 键时，onSave 不会调用
test('fires onSave on enter', ()=>{
  const onSave = jest.fn()
  const value = 'value'
  const wrapper = shallow(<TodoTextInput onSave={ onSave } />)

  wrapper.simulate('keydown', {target: { value: '' } })
  expect(onSave).not.toBeCalled()
})

// 检查在元素上多了 newTodo 属性后，会导致元素值重置
test('clears the value after save if new', ()=>{
  const value = 'value'
  const wrapper = shallow(<TodoTextInput newTodo onSave={noop} />)
  wrapper.simulate.('keydown', {target: {value}, which: 13})
  expect(wrapper.prop('value')).toBe('')
})

test('updates the text on change', ()=>{
  const value = 'value'
  const wrapper = shallow(<TodoTextInput onSave={noop} />)
  wrapper.simulate.('change', {target: { value }})
  expect(wrapper.prop('value')).toBe(value)
})

test('fires onSave on blur if not new',()=>{
  // Same as onSave
})
```
