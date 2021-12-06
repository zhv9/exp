---
marp: true
paginate: true
---

# React basic and principle

---

## 一段最基本的 React 代码

```ts
type Props = {
  onClick: () => void;
}
function Button(props: Props) {
  return <button onClick={props.onClick}>Click Me!</button>
}

function App() {
  // model
  const [data, setData] = useState<'hello' | 'world'>('hello');
  // controller
  function onClick() {
    setData(data === 'hello' ? 'world' : 'hello');
  }
  // view
  return (
    <>
      <Button onClick={onClick} />
      <div>{data}</div>
    </>
  )
}
```

- 两个组件组合成为一个完整组件
- 在点击按钮后，App 会由于数据变更而整体重新渲染。
- Button 在 App 重新渲染后，由于它是 App 的返回值，所以也被动的重新渲染了。

---

## React 的特点

- 声明式
- 组件化
- MVC

---

### 声明式

- 命令式编程：很具体地告诉计算机如何执行某个任务。
- 声明式编程：是将程序的描述与求值分离开。它关注如何用各种表达式来描述程序逻辑，而不一定要指明其控制流或状态的变化。

---

### 组件化

React 是通过将页面根据“单一功能原则”进行拆分，然后通过组合的方式将拆分的组件整合成一个完整的复杂页面。

React 组合组件时一般是两种方式：

- [包含关系](https://zh-hans.reactjs.org/docs/composition-vs-inheritance.html#containment)
- [特例关系](https://zh-hans.reactjs.org/docs/composition-vs-inheritance.html#specialization)

> 继承是没有必要的

https://zh-hans.reactjs.org/docs/composition-vs-inheritance.html

---

### MVC

官网虽然没有具体表明，但实际上 React 就是 MVC 结构。

1. `View` 层根据 `Model` 层的数据进行渲染
2. 用户通过触发 `controller` 层的事件，修改 `Model` 层数据
3. `Model` 的变化又引发 `View` 层变更

![good architecture](https://github.com/tum-esi/common-coding-conventions/blob/master/res/img/architecture-better.svg)

---

## React 哲学

https://zh-hans.reactjs.org/docs/thinking-in-react.html

1. 为设计好的 UI 划分组件层级
2. 用 React 创建一个静态版本
3. 确定 UI state 的最小（且完整）表示
4. 确定 state 放置的位置
5. 添加反向数据流（来更新顶层放置的 state）

---

### 拆分组件

https://zh-hans.reactjs.org/docs/thinking-in-react.html#step-1-break-the-ui-into-a-component-hierarchy

---

<style scoped>section {font-size: 20px;}</style>

## React 开发原则

- 基本原则
    - Keep It Simple Stupid.
    - 组件单一职责
    - 以业务驱动整体结构设计，同一个业务的代码放在一起，要有完整性
    - 以数据驱动具体细节实现
    - 层级不要过多
- 编码原则
    - 不要有魔法数字
    - 模式匹配代替长串的 if 或 switch
    - 嵌套 if 是不可接受的
    - 使用 const 而非 let，数据不应该被直接修改
    - 使用函数式而非命令式，数据处理使用 map、filter、reduce 而不是 for + if
    - 不要保存衍生数据（计算结果不保存，在运行时实时计算），如 dropdown 中的 label、表格中的“合计”。
    - 重复的代码可以抽离成受控组件，但如果组件接受参数过多则可能需要继续拆分
    - 命名不用缩写

**但**，易于阅读的代码比什么都重要！！
