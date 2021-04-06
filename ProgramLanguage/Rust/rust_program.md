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
