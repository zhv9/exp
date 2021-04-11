# Programming

## Iterator 迭代器

迭代器和其他语言类似，都时通过实现 `next()` 方法来迭代的。向量通过以下几个方法使用迭代器。

- `.iter()` 返回的是引用，所以原始向量不会消失
- `.iter_mut()` 返回的是可变引用，可以修改内部的值的引用，可以用 for_each 来处理数据
- `.into_iter()` 返回实际数值，在遍历后，原始数据就释放掉了。

实现自己的迭代器，需要在实现中定义数据类型 `type Item = <some type>` 和 `next()` 方法。

https://doc.rust-lang.org/std/iter/trait.Iterator.html

https://doc.rust-lang.org/std/iter/index.html#implementing-iterator

## Closures 闭包

闭包和 js 的差不多，不过用的是两个竖线 `||` 而不是两个括号加胖箭头 `() =>`

## Lifetime 生命周期

用 `'x` (' 加一个变量) 来标记，这个是给引用变量使用的。大部分时候 rust 可以自动识别生命周期，但是有些时候，需要自己标记，来让变量活的更长一些。一般是通过泛型来标记

```rust
struct Adventurer<'a> {
    name: &'a str, // 因为这个是引用类型所以需要标记生命周期，这个意味着 name 这个&str 活的和 Adventurer 一样长
    hit_points: u32,
}

impl Adventurer<'_> { // 因为 struct Adventurer<'a> 有定义生命周期，所以这里实现也要，但是因为内部不用，所以可以用匿名 _ 下划线标记
    fn take_damage(&mut self) {
        self.hit_points -= 20;
        println!("{} has {} hit points left!", self.name, self.hit_points);
    }
}

impl std::fmt::Display for Adventurer<'_> {

        fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
            write!(f, "{} has {} hit points.", self.name, self.hit_points)
        }
}

fn main() {
    let mut billy = Adventurer {
        name: "Billy",
        hit_points: 100_000,
    };
    println!("{}", billy);
    billy.take_damage();
}
```

## Interior mutability 内部可变

对于一个结构体，可以设置其为可变也可以设置为不可变，但是如果只想变其中一部分的话，就得借助其他工具了。

- Cell: 比较适合简单 Copy 类型 `Cell<bool>`, `Cell::new(true)`, `some_cell.set(false)`
- RefCell: 适合较复杂类型，使用和可变引用相同 `RefCell<bool>`, `RefCell::new(true)`, `some_ref_cell.borrow_mut()`
- Mutex: 可以对其 lock 然后操作，出了当前作用域后自动释放 lock，也可以用 drop 提前释放 `some_changer = my_mutex.lock().unwrap()`, `some_changer = new_value`
- RwLock: 和 Mutex 类似，不过和可变引用相同 `read1 = my_rwlock.read().unwrap()`, `write1 = my_rwlock.write().unwrap()`

## Cow(copy/clone on write)

这个类型(Copy on write)顾名思义，在实际写入时再进行 Copy 操作。如果不对其修改则不会发生克隆操作，如果修改了则会进行克隆。

另外它还有其他作用。

## Rc(reference counter 引用计数器)

RC 就是引用计数器，为了让更多地方使用其包裹的变量。用来对所有引用的地方进行计数，当计数为 0 的时候，这个数据就可以清理了。

```rust
use std::rc::Rc;

fn main() {
    let first_owner = Rc::new("This a big string".to_string()); // 创建一个 Rc 类型
    println!("first_owner: {}", Rc::strong_count(&first_owner)); // 引用计数为 1
    let new_owner = first_owner.clone(); // 对这个类型 clone 但实际上不是真正的 clone，而是引用计数器加一，实际使用的还是原来的数据。
    println!("After new owner: {}", Rc::strong_count(&first_owner)); // 引用计数为 2
}
```

## 多线程

### 创建多线程

下面这个代码有时候会打印有时候不会，因为 `main` 函数有可能会在线程执行完毕前结束。如果多开几个线程的话，有可能部分的线程会打印，也有可能有的会 panic。

```rust
fn main() {
    std::thread::spawn(|| {
        println!("I am printing something");
    });
    for _ in 0..10 { // set up ten threads
        std::thread::spawn(|| {
            println!("I am printing something in for");
        });
    }
}
```

为了让 `main` 在所有线程结束后再结束，需要将线程放到一个变量中，然后 `join` 到 `main` 函数中。

```rust
fn main() {
    for _ in 0..10 {
        let handle = std::thread::spawn(|| {
            println!("I am printing something");
        });

        handle.join(); // Wait for the threads to finish
    }
}
```

### 线程安全

如果从外部给一个引用(也就是借用)到线程中，则线程可以对其做任何事情。这样的话，在其他线程引用(借用)后，线程就会不安全了。下面代码会报“借用”错误。

```rust
fn main() {
    let mut my_string = String::from("Can I go inside the thread?");

    let handle = std::thread::spawn(|| { // 此处会报: may outlive borrowed value `my_string`
        println!("{}", my_string); // 此处会报: `my_string` is borrowed here
    });
    handle.join();
}
```

对于解决方法，报的错误中会提示到使用 `move` 来让闭包获取变量所有权。

```rust
fn main() {
    let mut my_string = String::from("Can I go inside the thread?");

    let handle = std::thread::spawn(move|| {
        println!("{}", my_string);
    });

    // std::mem::drop(my_string);  // 这里不能 drop，因为 handle 拥有 `my_string` 的所有权。如果添加这条代码，则会报错

    handle.join();
}
```

## impl trait

impl trait 和泛型很相似。范型的类型是写在尖括号里面的，而 `impl trait` 是写在参数类型或返回值上的。如果和其他语言比较的话，有些像 `typescript` 的 `type` 和 `typeof`

```rust
use std::fmt::Display;

fn gives_generic_i32<T: PartialOrd + Display>(n: T) {
    println!("generic number is {}", n);
}

fn gives_trait_i32(n: impl PartialOrd + Display) {
    println!("trait number is {}", n);
}

fn main() {
    gives_generic_i32(8);
    gives_trait_i32(9)
}
```

如果写成 ts 的话应该就类似于这样的吧：

```ts
enum NumberA { // 或使用 const NumberA = { a: 1 } 也是可以的
  a,
}

enum NumberB {
  b,
}
// ts 一般不这么处理，都是先定义好 type 然后直接 NumberA & NumberB 就好了，这里主要是为了和 rust 写法一致
function print_generic_number<T extends typeof NumberA & typeof NumberB>(n: T) {
  console.log(n);
}
function print_trait_number(n: typeof NumberA & typeof NumberB) {
  console.log(n);
}

print_generic_number({ a: 2, b: 3 });
print_trait_number({ a: 2, b: 3 });
```

## Arc (atomic reference counter 原子引用计数器)

前面的引用计数器可以让变量有多个所有者，但是在线程中，则需要使用 `Arc`。原子意味着使用处理器来操作，这样数据每次处理时只被写入一次。不会出现不同线程同时写入数据造成数据错误的情况。

`Rc` 速度更快一些，所以单线程的时候不使用 `Arc`

```rust
use std::sync::{Arc, Mutex};

fn main() {
    let my_number = Arc::new(Mutex::new(0));

    let my_number1 = Arc::clone(&my_number);
    let my_number2 = Arc::clone(&my_number);

    let thread1 = std::thread::spawn(move || { // 需要将 clone 的数据 move 到线程中
        for _ in 0..10 {
            *my_number1.lock().unwrap() += 1; // Lock the Mutex, change the value
        }
    });

    let thread2 = std::thread::spawn(move || {
        for _ in 0..10 {
            *my_number2.lock().unwrap() += 1;
        }
    });

    thread1.join().unwrap();
    thread2.join().unwrap();
    println!("Value is: {:?}", my_number);
    println!("Exiting the program");
}
```

## Channel (多生产者单消费者，可用于线程间通信)

```rust
use std::sync::mpsc::channel; // mpsc: multiple producer, single consumer

fn main() {
    let (sender, receiver) = channel(); // pub fn channel<T>() -> (Sender<T>, Receiver<T>)
    let sender_clone = sender.clone();

    std::thread::spawn(move|| { // move sender in
        sender.send("Send a &str this time").unwrap();
    });

    std::thread::spawn(move|| { // move sender_clone in
        sender_clone.send("And here is another &str").unwrap();
    });

    println!("{}", receiver.recv().unwrap());
}
```

## Attributes (特性)

在 Rust 中的特性是指 `#[derive(Debug)]` 这类代码，写在代码上的特性会告诉编译器对应的信息。使用 `#` 就可以给下一行加特性，如果写成 `#!` 则会应用到它整体。

```rust
#![allow(dead_code)]
#![allow(unused_variables)]

struct Struct1 {} // 创建 2 个结构体
struct Struct2 {}

fn main() {
    let char1 = 'ん'; // 和 4 个变量。虽然都没有使用，但是由于顶部有写两个 allow 的特性，所以编译器没有 warning
    let char2 = ';';
    let some_str = "I'm just a regular &str";
    let some_vec = vec!["I", "am", "just", "a", "vec"];
}
```

通过 `#[derive(TraitName)]` 可以为结构体或枚举派生对应的 trait。不过有些 trait 可以有些不行，比如 Display 就不行。使用逗号分隔可以添加多个 trait。

通过 `#[cfg()]` 作用是对代码块做配置，告诉编译器是否运行该代码块。

## Box (在堆上申请内存放置数据)

`Box` 和 `str` 的 `&` 类似，由于 `str` 的长度可以是任意的，但 `&` (引用)是固定长度的，这样编译器就可以使用了。`Box` 和 `&str` 相似，同时可以使用 `*` 来引用其值。

```rust
fn main() {
    let my_box = Box::new(1); // This is a Box<i32>
    let an_integer = *my_box; // This is an i32
    println!("{:?}", my_box);
    println!("{:?}", an_integer);
}
```

同时 `Box` 也可以递归使用，比如链表就可以用如下代码来表示

```rust
struct List {
    item: Option<Box<List>>, // 没有这个 Box 就会报错，因为 List 的长度就会是不定的
}
impl List {
    fn new() -> List {
        List {
            item: Some(Box::new(List { item: None })),
        }
    }
}
fn main() {
    let mut my_list = List::new();
}
```

## impl trait (返回值是 trait 的时候需要用 Box 装箱)

`trait` 可以组合到任意数据类型上，所以它的长度是不定的，如下代码就给各种类型实现了 `JustATrait`。然而如果某个函数需要返回 `JustATrait` 类型，则由于 `trait` 的长度不确定，所以就会报错。既然是因为不确定长度，则这时就可以使用 `Box` 的特性使用栈上的 `Box` 引用堆上的 `trait`。即：`Box<dyn JustATrait>`，其中 `dyn` 是 dynamic 的缩写，代表这是 trait 不是结构体或枚举。

```rust
#![allow(dead_code)] // Tell the compiler to be quiet
use std::mem::size_of; // This gives the size of a type

trait JustATrait {} // We will implement this on everything

enum EnumOfNumbers {
    I8(i8),
    AnotherI8(i8),
    OneMoreI8(i8),
}
impl JustATrait for EnumOfNumbers {}

struct StructOfNumbers {
    an_i8: i8,
    another_i8: i8,
    one_more_i8: i8,
}
impl JustATrait for StructOfNumbers {}

enum EnumOfOtherTypes {
    I8(i8),
    AnotherI8(i8),
    Collection(Vec<String>),
}
impl JustATrait for EnumOfOtherTypes {}

struct StructOfOtherTypes {
    an_i8: i8,
    another_i8: i8,
    a_collection: Vec<String>,
}
impl JustATrait for StructOfOtherTypes {}

struct ArrayAndI8 {
    array: [i8; 1000], // This one will be very large
    an_i8: i8,
    in_u8: u8,
}
impl JustATrait for ArrayAndI8 {}

fn main() {
    println!(
        "{}, {}, {}, {}, {}",
        size_of::<EnumOfNumbers>(),
        size_of::<StructOfNumbers>(),
        size_of::<EnumOfOtherTypes>(),
        size_of::<StructOfOtherTypes>(),
        size_of::<ArrayAndI8>(),
    );
}
```

```rust
#![allow(unused)]
fn main() {
    // 下面函数的返回值是 JustATrait，由于其长度不定，编译器无法识别
    fn returns_just_a_trait() -> JustATrait {
        let some_enum = EnumOfNumbers::I8(8);
        some_enum
    }
    // 下面使用了 Box 就可以解决 JustATrait 长度不确定的问题了，将其装箱放到堆中，使用栈中的 Box 来引用。
    // 其中 dyn 是 dynamic 的缩写，代表这是 trait 不是结构体或枚举
    fn returns_just_a_trait() -> Box<dyn JustATrait> {
        let some_enum = EnumOfNumbers::I8(8);
        Box::new(some_enum)
    }
}
```

## Default (参数默认值)

在 Rust 中每个基本类型都有其默认值，即 `Default::default()`，它可以根据数据类型给定其默认值。

```rust
fn main() {
    let default_i8: i8 = Default::default();
    let default_str: String = Default::default();
    let default_bool: bool = Default::default();

    println!("'{}', '{}', '{}'", default_i8, default_str, default_bool); // print: '0', '', 'false'
}
```

非基本类型如果需要 default 的话，则需要通过 `impl Default for SomeType` 单独为其实现。

```rust
#[derive(Debug)]
struct Character {
    name: String,
    age: u8,
    height: u32,
    weight: u32,
    lifestate: LifeState,
}

#[derive(Debug)]
enum LifeState {
    Alive,
    Dead,
    NeverAlive,
    Uncertain,
}

impl Character {
    fn new(name: String, age: u8, height: u32, weight: u32, alive: bool) -> Self {
        Self {
            name,
            age,
            height,
            weight,
            lifestate: if alive {
                LifeState::Alive
            } else {
                LifeState::Dead
            },
        }
    }
}

impl Default for Character {
    fn default() -> Self {
        Self {
            name: "Billy".to_string(),
            age: 15,
            height: 170,
            weight: 70,
            lifestate: LifeState::Alive,
        }
    }
}

fn main() {
    let character_1 = Character::default(); // 使用 impl Default for Character 后就可以这样来使用默认值了

    println!(
        "The character {:?} is {:?} years old.",
        character_1.name, character_1.age
    );
}
```

## Deref and DrefMut (为自定义类型实现使用 `*` 访问数据的 trait)

`Deref` 是为你的类型实现使用 `*` 访问数据的 trait，需要通过 `impl Deref for SomeType` 并定义一个 `fn deref(&self) -> &Self::Target` 来给期望的类型定义引用。在有了 `Deref` 后，对应结构体就可以直接使用引用值可用的方法了。

`DerefMut` 也就是定义可修改的引用。

```rust
use std::ops::Deref;
#[derive(Debug)]
struct HoldsANumber(u8);

impl Deref for HoldsANumber {
    type Target = u8; // 在这里注明使用引用时返回的类型

    fn deref(&self) -> &Self::Target {
        &self.0 // 在使用 * 引用值的时候，返回 &self.0
    }
}

fn main() {
    let my_number = HoldsANumber(20);
    println!("{:?}", *my_number + 20); // 如果不带 impl Deref for HoldsANumber，则不能用 * 引用数据，而只能用 my_number.0 来引用
    println!("{:?}", my_number.checked_sub(100)); // checked_sub 这个方法来自于 u8，有 Deref 后就可以直接使用了
}
```

## macros (编写宏)

写一个宏可以通过另外一个宏 `macro_rules!` 开头，之后跟着宏的名字和 `{}`。内部有些像 `match`。和 `match` 的区别在于，`match` 的每个条件返回值类型需要是相同的，而宏不需要，主要原因是宏只是获取一个输入然后给出对应的输出。输入的类型确定的时候，输出的类型也就是确定的。并且由于没有 `_` 所以非内部定义的输入，都会报错。

```rust
macro_rules! six_or_print {
    (6) => { // 在输入为 6 的时候，返回 6
        6
    };
    () => { // 在输入为元组(默认入参)的时候，打印并返回默认的 ()
        println!("You didn't give me 6.");
    };
}

fn main() {
    let my_number = six_or_print!(6);
    let my_tuple = six_or_print!();
    println!("{:?}", my_number);
    println!("{:?}", my_tuple);
}
```

宏如果只能写确定值的话，那它就很没用了，所以也有办法给其变量来使用，使用 `$input:expr` 来接收参数

```rust
macro_rules! might_print {
    ($input:expr) => {
        println!("You gave me: {:?}", $input); // 使用 {:?} 的原因是可以接收不同种类的数据
    }
}

fn main() {
    might_print!(()); // give it a (), prints: `You gave me: ()`
    might_print!(6); // give it a 6, prints `You gave me: 6`
    might_print!(vec![8, 9, 7, 10]); // give it a vec, prints `You gave me: [8, 9, 7, 10]`
}
```

除了 `expr` 还可以用 `block | expr | ident | item | lifetime | literal | meta | pat | path | stmt | tt | ty | vis`。

https://doc.rust-lang.org/beta/reference/macros-by-example.html

- `item`: an Item
- `block`: a BlockExpression
- `stmt`: a Statement without the trailing semicolon (except for item statements that require semicolons)
- `pat`: a Pattern
- `expr`: an Expression
- `ty`: a Type
- `ident`: an IDENTIFIER_OR_KEYWORD
- `path`: a TypePath style path
- `tt`: a TokenTree (a single token or tokens in matching delimiters (), [], or {})
- `meta`: an Attr, the contents of an attribute
- `lifetime`: a LIFETIME_TOKEN
- `vis`: a possibly empty Visibility qualifier
- `literal`: matches -?LiteralExpression

### 常用宏入参

宏中比较常用的是 `expr`，`ident` 和 `tt`。

- `expr` 可以接收表达式，变量等。
- `ident` 可以接收变量或函数名称的标识，但不能接收表达式。编译时会进行宏的展开，这个标识在宏中处理后可以直接在宏外部使用
- `tt` token tree 接收一个 token(符号，标识符)，默认不接收空格、逗号一类东西。否则它会认为给了它超过一个东西或其他信息。

### expr & ident

```rust
macro_rules! check {
    ($input1:ident, $input2:expr) => {
        println!(
            "Is {:?} equal to {:?}? {:?}",
            $input1,
            $input2,
            $input1 == $input2
        );
    };
}

fn main() {
    let x = 6;
    let my_vec = vec![7, 8, 9];
    check!(x, 6);
    check!(my_vec, vec![7, 8, 9]);
    // check!(vec![7, 8, 9], my_vec); // 第一个由于是 ident 所以不能接收 vec![7, 8, 9] 这种表达式参数
    check!(x, 10);
}
```

### tt

如果要给 tt 多于一个参数，需要使用 `$($input:tt),*)`，意思是用逗号分隔数据有 0 个或多个。这个 `*` 也可以是 `+` 或 `?`，意义和正则中的意义一样。

```rust
macro_rules! print_anything {
    ($($input1:tt),*) => {
        let output = stringify!($($input1),*);
        println!("{}", output);
    };
}

fn main() {
    print_anything!(abc, 123);
    print_anything!();
    print_anything!(abc, defg, 123abc, !);
}
```

### 通过宏定义函数

```rust
macro_rules! make_a_function {
    ($name:ident, $($input:tt),*) => {
        fn $name() { // 第一个参数 ident 类型，可以作为函数名使用
            let output = stringify!($($input),*); // 把除了函数名以外的转成 string
            println!("{}", output);
        }
    };
}

fn main() {
    make_a_function!(print_it, 5, 5, 6, I); // 定义一个名称为 print_it() 的函数，然后打印后面给的所有参数
    print_it(); // 这个函数在宏中通过 $name 定义了。结果是： 5, 5, 6, I
    make_a_function!(say_its_nice, this, is, really, nice); // 这里也一样只是换了个函数名
    say_its_nice(); // 结果是：this, is, really, nice
}
```
