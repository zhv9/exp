// 基本类型
{
  let a: number = 1;
  let b: string = 'hello';
  let c: string = `${b} abc`;
  let listNumber: number[] = [1, 2, 3];
  let listString: string[] = ['a', 'b', 'c'];
  let listArray: Array<string> = ['a', 'b', 'c'];
}

// 变量声明
{
  const a: number = 1;
  let b: number = 2;
}


// 泛型
{
  function hello<T>(arg: [T]): T {
    return arg[0];
  }
  console.log(hello(["aaa"]));
}

{
  import fs from 'fs';

  function readFileAsync(filePath: string) {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      })
    })
  }
}

// 枚举
{
  enum a {
    Monday,
    Tuesday,
    Wednesday,
    Thursday,
    Friday,
    Saturday,
    Sunday
  }

  let b: 'Monday' | 'Tuesday';
  b = 'Monday';
}

// iterator, generator
{
  // iterator
  const array = [3, 4, 5];
  for (const key in array) {
    console.log(key);
  }

  for (const iterator of array) {
    console.log(iterator);
  }
}

{
  // generator: function*
  function* infiniteList() {
    let i = 0;
    while (true) {
      yield i++;
    }
  }

  const gen1 = infiniteList();
  console.log(gen1.next);

  const array: number[] = [10, 2, 1, 3, 5, 7, 9];

  function* sortArray(array: Array<number>) {
    let lastArray = array;
    while (lastArray.length > 0) {
      const max: number = Math.max(...lastArray);
      lastArray.splice(lastArray.indexOf(max), 1);
      yield max;
    }
  }

  let gen = sortArray(array);
  let newValue: { value: number, done: boolean };
  do {
    newValue = gen.next();
    console.log(newValue.value);
  } while (newValue.done);

}

// interface
{
  interface SquareConfig {
    color?: string;
    width?: number;
  }
  function createSquare(config: SquareConfig): { color: string; area: number } {
    let newSquare = { color: 'wite', area: 100 };
    if (config.color) {
      newSquare.color = config.color;
    }
    if (config.width) {
      newSquare.area = config.width * config.width;
    }
    return newSquare;
  }
  console.log(createSquare({ width: 10 }));

  interface Point {
    readonly x: number;
    readonly y: number;
  }
  let p1: Point = { x: 100, y: 100 };
  p1.x = 2; // error 因为 x 和 y 是只读的

  let p2: Point = { x: 1, z: 2 }; // z 会报错，因为 Point 接口中没有定义 z

  interface anySquareConfig {
    color?: string;
    width?: number;
    [propName: string]: any;  // 只要不是 color 或 width 就是 any 类型
  }

  const anySquare: anySquareConfig = {
    color: 'black',
    width: '1', // error width 需要是number类型
    anyProp: [1, 2],  // OK
  }

  // 函数类型 interface
  interface SearchFunc {
    (source: string, subString: string): boolean; // 形参是两个 string，返回值是 boolean 的函数
  }
  let mySearch: SearchFunc;
  mySearch = function (source, subString) {
    const result = source.search(subString);
    return !!~result;
  }
}

// class
{
  interface ShapeColor {
    color: string;
  }

  interface ShapeName {
    name: string;
  }

  class theSquare implements ShapeColor, ShapeName {
    color: string;
    name: string;
    private privateName: string;
    area: number;
    constructor(color: string = 'white', name = 'square') {
      this.color = color;
      this.name = name;
    }
    areaWithSameSideLength(sideLength: number) {
      this.area = sideLength * sideLength;
      return this.area;
    }

    // 外部只能使用 pName 来读写 privateName
    public set pName(v: string) {
      if (~v.indexOf('p')) {
        this.privateName = v;
      }
    }

    public get pName(): string {
      return this.privateName;
    }
  }

  const mySquare = new theSquare();
  mySquare.areaWithSameSideLength(12);
  console.log('mySquare.area 12', mySquare.area);

  mySquare.pName = 'a';
  console.log('square pName input a: ', mySquare.pName); // undefined
  mySquare.pName = 'private';
  console.log('square pName input private: ', mySquare.pName); // private

  class theRect extends theSquare {
    constructor(name: string) {
      super(name)
    }
    areaWithDifferentSideLength(longSideLength: number, shortSideLength: number) {
      this.area = longSideLength * shortSideLength;
      return this.area;
    }
  }

  const myRect = new theRect('rect');
  console.log('myRect.name', myRect.name);
  myRect.areaWithSameSideLength(12);
  console.log('area 12: ', myRect.area);

  myRect.areaWithDifferentSideLength(12, 10);
  console.log('area 12*10: ', myRect.area);

}

// abstract
{
  abstract class Animal {
    abstract makeSound(): void;
    move(): void {
      console.log('Moving');
    }
  }
  class dog extends Animal {
    makeSound() {
      console.log('wang');
    }
  }
}

// namespace
// 可以用同一个 namespace 写在不同的文件中，用起来是一样的
namespace n {
  namespace Validation {
    const lettersRegexp = /^[A-Za-z]+$/;
    const numberRegexp = /[0-9]+$/;
    export function LettersOnlyValidator(letter: string) {
      const isAcceptable = lettersRegexp.test(letter);
      return isAcceptable;
    }
    export function ZipCodeValidator(zipCode: string) {
      const isAcceptable = numberRegexp.test(zipCode);
      return isAcceptable;
    }
  }
  const h = Validation.LettersOnlyValidator('hello'); // 使用时需要带上 namespace
  const z = Validation.ZipCodeValidator('123');
  console.log('hello validate string: ', h);
  console.log('123 validate string: ', z);

}

