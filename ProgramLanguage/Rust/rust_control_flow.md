# Control flow

## if

和其他语言基本一样。

```rust
fn main() {
    let my_number = 5;
    if my_number % 2 == 1 && my_number > 0 { // % 2 means the number that remains after diving by two
        println!("It's a positive odd number");
    } else if my_number == 6 {
        println!("It's six")
    } else {
        println!("It's a different number")
    }
}
```

## match

`match` 用起来类似于 js 中用 object 做 map 选择或者 `switch case` 表达式。不过 `match` 必须将所有的可能的数值都列在表达式中。如果需要表示其他(if 表达式中的 else)则可以用 `_` 分支来处理。

对于常量，还可以用 `@` 来命名，给到箭头后面表达式中

```rust
fn main() {
    let my_number: u8 = 5;
    match my_number {
        0 => println!("it's zero"),
        1 => println!("it's one"),
        two @ 2 => println!("it's two {}", two), // 这里给 2 命名为 two，可以将这个变量赋值给匹配后的表达式中
        _ => println!("It's some other number"), // 如果不加这一行，就会报错 non-exhaustive patterns: `3u8..=std::u8::MAX` not covered
        // u8 是从 0 到 255 如果没有 _ 则这个 match 就包含不了所有的数据
    }
}
```

`match` 还可以用来赋值，因为可以看到每个表达式结尾是逗号而不是分号。但是所有分支的返回类型必须相同，否则就会报错。

```rust
fn main() {
    let my_number = 5;
    let second_number = match my_number {
        0 => 0,
        5 => 10,
        _ => 2,
    };
}
```

`match` 的写法：

- match 加 `{}` 代码块
- 左边写匹配值，使用 `=>`(fat arrow) 来表明匹配后执行的内容。
- 每一行叫做 `arm`
- 每行用逗号分隔，而不是分号。(Rust 里用分号意味着不返回值)

`match` 还可以用元组来进行匹配：

```rust
fn main() {
    let sky = "cloudy";
    let temperature = "warm";

    match (sky, temperature) {
        ("cloudy", "cold") => println!("It's dark and unpleasant today"),
        ("clear", "warm") => println!("It's a nice day"),
        ("cloudy", "warm") => println!("It's dark but not bad"),
        _ => println!("Not sure what the weather is."),
    }
}
```

`match` 的匹配项中还可以加 `if` 来进行二次判断，这个称为 "match guard"

```rust
fn match_colours(rbg: (i32, i32, i32)) {
    match rbg {
        (r, _, _) if r < 10 => println!("Not much red"),
        (_, b, _) if b < 10 => println!("Not much blue"),
        (_, _, g) if g < 10 => println!("Not much green"),
        _ => println!("Each colour has at least 10"),
    }
}

fn main() {
    let first = (200, 0, 0);
    let second = (50, 50, 50);
    let third = (200, 50, 0);

    match_colours(first);
    match_colours(second);
    match_colours(third);
}
```
