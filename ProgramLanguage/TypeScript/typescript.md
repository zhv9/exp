---
marp: true
paginate: true
---

# Typescript

---

- [Typescript](#typescript)
  - [为什么要用 TypeScript](#为什么要用-typescript)
  - [类型标记和基本类型](#类型标记和基本类型)
  - [枚举类型](#枚举类型)
  - [联合类型](#联合类型)
  - [泛型](#泛型)
  - [定义类型和接口](#定义类型和接口)
    - [interface 和 type 的差别](#interface-和-type-的差别)
  - [工具类](#工具类)

---

## 为什么要用 TypeScript

- TypeScript 相对于 JavaScript 做了类型标记和限制
- 做编译时检查，避免运行时报错
- 让 IDE 有更优秀的提示，更好的自动补全

---

<style scoped>
section { font-size: 22px; }
</style>

## 类型标记和基本类型

```ts
{
  let a: number = 1;
  let b: string = `${a} abc`;
  let c: boolean = true;
  let listNumber: number[] = [1, 2, 3];
  let listString: string[] = ['a', 'b', 'c'];
  let arrayString: Array<string> = ['a', 'b', 'c']; // same as string[]
  let obj: any = { x: 0 };
  // function parameter and return type annotations
  function myFunc(myNumber: number): string {
    return myNumber.toString();
  }
  // Object types
  function printCoord(pt: { x: number; y: number }) {}
  {
    // Optional Properties
    function printName(obj: { first: string; last?: string }) {}
    // Both OK
    printName({ first: 'Bob' });
    printName({ first: 'Alice', last: 'Alisson' });
  }
}
```

参考链接：https://www.typescriptlang.org/docs/handbook/2/everyday-types.html

---

## 枚举类型

枚举类型就是为了方便记忆所设置的类型，类似于传统的 `const SomeType = {UP: 'UP', DOWN: 'DOWN'}` 的方法但更易用。

```ts
{
  enum Direction {
    Up = "UP",
    Down = "DOWN",
    Left = "LEFT",
    Right = "RIGHT",
  }
  
  let theDirection: Direction;
  theDirection = Direction.Up;
}
```

枚举还有很多更高级的用法，可以参考下面链接：

https://www.typescriptlang.org/docs/handbook/enums.html

---

<style scoped>
section { font-size: 20px; }
</style>

## 联合类型

联合类型就是将不同类型组合到一起，如下函数就可以处理两种类型。但是

```ts
function printId(id: number | string) {
  console.log("Your ID is: " + id);
}
printId(101); // OK
printId("202"); // OK
// Error
printId({ myID: 22342 });
// Argument of type '{ myID: number; }' is not assignable to parameter of type 'string | number'.
// Type '{ myID: number; }' is not assignable to type 'number'.
```

如果需要对其中一种类型做操作，比如加一个 `id.toUpperCase()` 那么就会报错。这时就需要在函数内部对类型做检查。

```ts
function printId(id: number | string) {
  if (typeof id === "string") {
    // In this branch, id is of type 'string'
    console.log(id.toUpperCase());
  } else {
    // Here, id is of type 'number'
    console.log(id);
  }
}
```

参考链接：https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types

---

<style scoped>
section { font-size: 24px; }
</style>

## 泛型

泛型就是在写的时候不写明具体是哪种类型，这时它就可以支持很多种类型，不用重复写很多相同的函数。这个泛型不是随便写的，而是有一定逻辑的。

```ts
  function hello<T>(arg: [T]): T {
    return arg[0];
  }
  console.log(hello(["aaa"]));
```

还可以声明一个被另一个类型参数约束的类型参数，比如下面这个就是声明了一个 `Key` 类型，它是所给的 `Type` 中的 "key"。这时这个 Key 类型就是动态的，是由传入的第一个参数类型中的 "key" 所决定的。

```ts
function getProperty<Type, Key extends keyof Type>(obj: Type, key: Key) {
  return obj[key];
}
let x = { a: 1, b: 2, c: 3, d: 4 };
getProperty(x, "a");
getProperty(x, "m");
// Argument of type '"m"' is not assignable to parameter of type '"a" | "b" | "c" | "d"'.
```

参考链接：https://www.typescriptlang.org/docs/handbook/2/generics.html

---

## 定义类型和接口

interface type

```ts
interface SquareConfig {
  color?: string;
  width?: number;
}
type Area = {
  color?: string;
  area: number;
}
```

参考链接：
- type：https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-aliases
- interface：https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#interfaces

---

<style scoped>
section { font-size: 24px; }
</style>

### interface 和 type 的差别

- interface 和 type 虽然语法不同但是都可以做继承（interface）或者组合（type）来达到相同目的。

```ts
interface Animal { name: string }
interface Bear extends Animal { honey: boolean }
```

```ts
type Animal = { name: string }
type Bear = Animal & { honey: boolean }
```

- interface 可以定义一个同名的接口来添加新字段，但 type 只能在原有的 type 上添加。
- type 可以给基础类型做

```ts
interface Window { title: string }
interface Window { ts: TypeScriptAPI }
```

如果用 type 按照上面的语法定义，就会提示错误 `Error: Duplicate identifier 'Window'.`

参考链接：https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces

---

## 工具类

常用的有以下几种：

- `Pick<Type, Keys>`: 从 Type 中选部分属性出来
- `Omit<Type, Keys>`: 从 Type 中去掉部分属性
- `Partial<Type>`: 把 Type 中的所有属性变为可选
- `Record<Keys,Type>`: Key Value 的那种 Object 类型

参考链接：https://www.typescriptlang.org/docs/handbook/utility-types.html
