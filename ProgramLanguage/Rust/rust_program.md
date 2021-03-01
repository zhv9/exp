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

## Rc

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
