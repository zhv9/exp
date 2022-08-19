# DDD 贫血模型和充血模型

## 三层架构

- Model
- View
- Controller

## 贫血模型

- 传统的开发模式
- MVC 就属于贫血模型
- 面向过程

```
DB
=> Entity/Repository(数据库数据实体模型)
=> Service(将实体模型数据转换为业务数据模型) => BO(Business Object)
=> Controller(将业务数据转换为对外接口数据类型) => VO(Value Object)
```

其中 BO 是一个纯数据结构，不包含任何业务逻辑，业务逻辑集中在 Service 中。然后通过 Service 操作 BO。也就是 Service 层的数据和业务逻辑被分割为 BO 和 Service 两个类中。

像 BO 这种只包含数据，不包含业务逻辑的类，就叫做贫血模型。

贫血模型将数据与操作分离，破坏了面向对象的封装特性，是典型的面向过程的编程风格。

## 充血模型

与贫血模型相反，将数据和对应的业务逻辑封装到同一个类中。满足面向对象的封装特性的就是充血模型。

## 领域驱动设计

领域驱动设计(DDD)，主要是用来指导如何解耦业务系统，划分业务模块，定义业务领域及其交互。

基于充血模型的 DDD 开发模式的代码也是按照 MVC 三层架构分成的。Controller 层负责暴露接口，Repository 负责存取数据，Service 层负责业务逻辑。主要区别在 Service 层。

## 贫血模型和充血模型之间的差异

贫血模型中，Service 层包含 Service 类和 BO 类两部分。BO 只包含数据，不包含业务逻辑。

充血模型中，Service 层包含 Service 类和 Domain 类两部分。 Domain 相当于 BO。不过 Domain 不止包含数据还包含业务逻辑。而 Service 层就非常单薄了。

### 贫血模型

```ts
const db: DB = {
  valueA: 1,
  valueB: 2,
  sum: null,
  updateSum: function (sum) {
    this.sum = sum;
  }
}

class BO {
  value1;
  value2;
}

class service {
  constructor(repo: DB) {
    this.db = repo;
  }
  function convert(dbData: DB): BO {
    return {
      value1: dbData.valueA,
      value2: dbData.valueB,
    }
  }

  function add() {
    const addNumbers: BO = this.convert(this.db);
    const sum = addNumbers.value1 + addNumbers.value2;
    this.db.updateSum(sum);
  }
}
```

### 充血模型

```ts
const db: DB = {
  valueA: 1,
  valueB: 2,
  sum: null,
  updateSum: function (sum) {
    this.sum = sum;
  }
}

class BusinessDomain {
  constructor({value1, value2}) {
    this.value1 = value1;
    this.value2 = value2;
  }
  value1;
  value2;
  function add() {
    return this.value1 + this.value2;
  }
}

class service {
  function convert(dbData: DB): BusinessDomain {
    const boValue = {
      value1: dbData.valueA,
      value2: dbData.valueB,
    }
    return new BusinessDomain(boValue);
  }

  function add() {
    constructor(repo: DB) {
      this.db = repo;
    }
    const business: BusinessDomain = this.convert(this.db);
    const sum = business.add();
    this.db.updateSum(sum);
  }
}
```

## 为什么贫血模型更受欢迎

面向过程的弊端是数据和操作分离后，数据本身的操作就不受限制了。任何代码都可以随意修改数据。这么看贫血模型似乎不太好，但非常受广大程序员欢迎的原因：

1. 大部分业务都比较简单，不需要进行什么精心设计就可以了。
2. 充血模型设计比贫血模型设计有难度。需要设计好暴露的操作和定义业务逻辑。
3. 转型有难度。

## 什么项目适合充血模型

对于复杂的系统，对代码复用性、易维护要求高的系统，可以考虑使用充血模型设计。但是必须花更大精力在前期设计上。

另外系统需求应该较为稳定，不会有重大变化。如果天天有变化，那么设计再好的模型也没办法适应。
