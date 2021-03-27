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

## Snapshots test

如果觉得花费大量时间为单个组件写测试代码不值得，还可以使用 Jest 的**快照测试**功能来做测试。

快照测试就是特定时间传入某些 props 后组件的照片。Jest 每次运行测试时，都会创建新的照片，并与上一次的进行比较，以检查是否有新的变化。

### Package

快照内容由 react-test-renderer 包的 render 方法输出。

```sh
npm install --save-dev react-test-renderer
```

### Snapshots test code

 ```js
import TodoTextInput form './TodoTextInput'
 
test('snapshots are awesome', ()=>{
  const component = renderer.create(
    <TodoTextInput onSave={ ()=>{} } />
  )
})
// 上面返回组件的实例，使用组件的 toJSON 方法生成 json
const tree = component.toJSON()  


// 最后编写预测语句检查 tree 变化
expect(tree).toMatchSnapshot()

// 如果输出 tree 则结果是这样的(实际保存的 snapshot 则类似于 jsx)：
{
  type: 'input',
    props:
      {
        className:'',
        type: 'text',
        placeholder: undefined,
        autoFocus: 'true',
        value: '',
        onBlur: [Function],
        onChange: [Function],
        onKewDown: [Function]
      },
      children: null
}

 ```

快照保存在 `_snapshots_` 文件夹下，其中每个文件都表示一个快照。

如果给组件添加一个 `editing` 属性，并再次执行 `npm test` 控制台就会给出 `FAIL` 和变化点。

执行 `npm test -- -u` 可以更新快照

如果使用快照，可以在组件被错误修改的时候将其测试出来，这样开发人员就不用编写大量的测试来覆盖所有组件状态了。

## Coverage Check

可以使用 Jest 对测试覆盖率检查，有两种方法
- Jest 命令后面加上 `-coverage`
- 在 package 中为 Jest 创建配置，并将 collectCoverage 选项设置为 true

## React Advanced Component Test

被测代码，调用了 getJSON 函数

```js
// 这个返回 promise 对象，其中包含了请求路径返回的 JSON 数据
import getJSON from './get-json'

class extends React.Component{
  constructor(props){
    super(props)

    this.state = { data: []}
  }
  componentDidMount(){
    const endpoint = typeof url === 'function'
      ? url (this.props)
      : url
    getJSON(endpoint).then(data => this.setState({ data }))
  }

  render(){
    return <Component {...this.props} {...this.state} />
  }
}
```

需要测试三个方面：
1. 检查增强后的组件接收到的 props 是否正确的传递给了组件
1. 测试根据 URL 生成的请求路径逻辑，看看它是否适用于函数和字符串两种情况
1. 如果 getJSON 函数返回数据，目标组件就能接收到它

```js
import { shallow, mount} from 'enzyme'
import withData from './with-data'
import getJSON from './get-json'

// 使用 data 变量模拟数据，用来检查获取到的数据是否正确传递给了组件
// 一个空的 List 组件，是要增强的目标组件，这样才能判断所有特性是否都能正常运行
const data = 'data'
const List = ()=> <div />

// 我们不使用外部数据，避免外部不可用时导致测试失败
// 测试框架会将 get-json 替换成作为第二个参数的函数。这个函数返回 jest.fn 创建的 mock 函数，这个 mock 函数会返回类似于 promise 的对象。
jest.mock('./get-json', ()=>(
  jest.fn( () => ({then: callback => callback(data)}) )
))

// 检查 props 是否正确传给了目标组件，下面将空 List 组件
test('passes the props to the component', ()=>{
  const ListWithGists = withData()(List)
  const username = 'kv'
  const wrapper = shallow(<ListWithGists username={username} />)
  expect (wrapper.prop('username')).toBe(username)
})

// 检查是否用传入的 URL 调用了 getJSON 函数
test('uses the function url', ()=>{
  // 使用 mock 功能生成 URL 函数
  const url = jest.fn(props => (
    'https://api.github.com/users/${props.username}/gists'
  ))

  // 增强 List 组件并定义传给它的 props
  const withGists = withData(url)
  const ListWithGists = withGists(List)
  const props = {username: 'kv'}

  mount(<ListWithGists {...props} />)
  
  expect(url).toHaveBeenCalledWith(props)
  expect(getJSON).toHaveBeenCalledWith(
    'https://api.github.com/users/${props.username}/gists'
  )
})

// 检查返回给 getJSON 模块的数据是否正确地传递给了目标组件
test('passes the data to the component', ()=>{
  const ListWithGists = withData()(List)
  const wrapper = mount(<ListWithGists />)
  expect(wrapper.prop('data')).toEqual(data)
})
```

## Page Object Test

多层嵌套组件的测试，下面是被测代码

```js
class Controlled extends React.component{
  constructor(props){
    super(props)
    this.state = {
      firstName: 'D',
      lastName: 'A'
    }
  }
  this.handleChange = this.handleChange.bind(this)
  this.handleSubmit = this.handleSubmit.bind(this)

  handleChange({ target }){
    this.setState({
      [target.name]: target.value,
    })
  }
  
  handleSubmit(e){
    e.preventDefault()

    this.props.onSubmit(
      '${this.state.firstName} ${this.state.lastName}'
    )
  }

  render(){
    return (
      <form onSubmit = {this.handleSubmit}>
        <input
          type="text"
          name="firstName"
          value={this.state.firstName}
          onChange={this.handleChange}
        />
        <button>Submit</button>
      </form>
    )
  }
}
```

测试需要对输入框中输入内容并提交表单时用输入值触发 onSubmit 回调。

```js
// 先使用 jest.fn 模拟 onSubmit 函数
test('submits the form', ()=>{
  const onSubmit = jest.fn()
  const wrapper = shallow(<Controlled onSubmit={onSubmit} />)

  // 找到输入框触发它的 change 事件并传入新值
  const firstName = wrapper.find('[name="firstName"]')
  firstName.simulate(
    'change',
    {target: {name: 'firstName', value: 'first'}}
  )
  // 下面 lastName 和上面的firstName 有些重复，可以考虑重构一下
  const lastName = wrapper.find('[name="lastName"]')
  lastName.simulate(
    'change',
    {target: {name: 'lastName', value: 'last'}}
  )

  // 模拟表单提交
  const form = wrapper.find('form')
  form.simulate('submit', { preventDefault: ()=>{} })

  // 预测 onSubmit 会被表单的输入值调用
  expect(onSubmit).toHaveBeenCalledWith('first last')
})
```