# Types

## Variable Definition

```rust
fn main() {
    const CONSTANT_VARIABLE: i32 = 12; // 数值不变
    static STATIC_VARIABLE: i32 = 12; // 数值和内存地址不变
    let my_variable = "char"; // "&str"
    let my_variable: String = "string".to_string();
    let my_variable = 12; // 不可变变量 12
    let mut my_variable = 12; // 可变变量
    let my_variable_ref = &mut my_variable; // 引用变量

    let my_number; // 这里定义了一个未初始化的变量，如果一直不初始化，那么编译器就不编译，并且报错。这样写的作用在于可以在定义的地方确定其作用范围，在其他地方为其赋值
    {
      my_number = 100;
    }
    println!("{}", my_number);
}
```

## Print

```rust
fn main() {
    // 不换行
    print!("Hello worlds no new line!");
    // 普通 print
    println!("Hello, worlds number {} and {}", 8, 9);
    // debug print 是对没有实现 `std::fmt::Display` 的类型使用的。这个 `?` 是可以指定类型的，比如 b(bin), x(hex), o(oct), p(reference)
    println!("This is debug print: {:?}", ());
    // debug print pretty mode
    println!("This is debug print: {:#?}", ());

    // {} 这个大括号还有很多其他用法，比如定义变量表达式
    println!("{hello} {world}", hello = "Hello", world = "World"); // Prints: Hello World
    println!("{:-^30}", "middle"); // Prints: ------------middle------------ // 一行总共30字符中间位置用"middle"代替
    println!("{left:-<15}{right:->15}", left = "Left", right = "Right"); // Prints: Left---------------------Right

    // `r#` 这里的主要作用是忽略 rust 里面的关键字，有它就可以用各类关键字当变量名，另外使用 `r#` 可以让字符串更好读
    println!("He said, \"You can find the file at c:\\files\\my_documents\\file.txt.\" Then I found the file."); // We used \ five times here
    println!(
        r#"He said, "You can find the file at c:\files\my_documents\file.txt." Then I found the file."#
    )
}
```

## Mutability & Shadowing

```rust
fn main() {
    let mut my_number = 8; // 加了 `mut` 才能修改，否则是只读的
    my_number = 10;
    println!("{}", my_number); // Prints: 10

    // Shadowing
    let my_number = 9.2; // 这里虽然也是 my_number 但是已经是一个新变量了
    println!("{}", my_number); // Prints: 9.2
    {
        let my_number = -1; // 这里虽然也会遮蔽上一层的 my_number 但是仅限于当前 {} 的作用域
        println!("{}", my_number) // Prints: -1
    }
    println!("{}", my_number); // prints 9.2

    // Change by reference
    let mut my_number = 10;
    let num_ref = &mut my_number; // 如果原来的 `my_number` 不能修改，也就不能使用可修改的引用变量
    *num_ref += 10;
    println!("{}", my_number); // Prints: 20
}
```

## Reference & dereference (Pointer)

和 C 语言一样有 * 作为指针和 & 作为引用，不过就算使用了再多的 * 还是 & 都只会引用到最初给的变量上，不过如果用了太多 * 则会直接在编辑器上报错。

```rust
fn main() {
    let my_number = 15; // This is an i32
    let single_reference = &my_number; //  This is a &i32
    let double_reference = &single_reference; // This is a &&i32
    let five_references = &&&&&my_number; // This is a &&&&&i32
    println!("my_number {}", my_number);
    println!("single_reference {:p} {}", single_reference, single_reference); // `*single_reference` 是可以的，但是 `**single_reference` 就会报错 `type `{integer}` cannot be dereferenced`
    println!("double_ref {:p} {}", double_reference, double_reference);
    println!("five_ref {:p} {}", five_references, five_references);

    // 上面这些变量打印的都是 15 但是他们都不是相同类型。在使用 assert_eq 的时候会报下面的错误
    assert_eq!(my_number, five_references); // no implementation for `{integer} == &&&&&{integer}`
}
```

### Reference and ownership

```rust
fn return_str() -> &str {
    let country = String::from("Austria");
    let country_ref = &country;
    country_ref // ⚠️
}
fn main() {
    let country = return_str();
}
```

在 `return_str` 中虽然想返回一个字符串的地址，但是由于 `country` 的所有权仅限于 `return_str()` 只返回地址的话，**所有权**是不会带着的，所以在执行完 `return_str` 后 `country` 会释放掉，当然 `&country` 也就同样没有用了。如果需要函数中的数据，需要直接返回对应的值，这样**所有权**也会同样交给外部函数。

### Mutable references

使用引用有两条规则：

- 不可变引用，可以有任意多个。因为不管谁读，都不用害怕数据有问题，因为源数据不可变。
- 可变引用，只能有一个引用。因为如果有多个，其中有一个改变了数据，会导致其他正在读数据的引用出现不可预期问题。

```rust
fn main() {
    // Change by reference
    let mut my_number = 10;
    let num_ref = &mut my_number; // 如果原来的 `my_number` 不能修改，也就不能使用可修改的引用变量
    *num_ref += 10;
    println!("{}", my_number); // Prints: 20
}
```

下面有两端代码，第一段代码由于在**修改数字前创建**所以会在 `let number_ref = &number;` 处报错。但第二段代码将 `let number_ref = &number;` 放到修改数字后，则不会报错。原因是编译器可以知道在修改数字后，再没有用过修改的那个引用。不会发生同时使用**可变引用**和**不可变引用**的情况。(如果在最后加一个 `println!("{}", number_change);` 的话，同样会报错)

```rust
fn main() {
    let mut number = 10;
    let number_change = &mut number; // 创建一个可变引用
    let number_ref = &number; // 在修改数字前，创建一个不可变引用。**这里会报错**
    *number_change += 10; // 给数组加10
    println!("{}", number_ref); // 打印不可变引用
}
```

```rust
fn main() {
    let mut number = 10;
    let number_change = &mut number; // 创建一个可变引用
    *number_change += 10; // 给数组加10
    let number_ref = &number; // 在修改数字后，创建一个不可变引用。**这里不会报错**
    println!("{}", number_ref); // 打印不可变引用
}
```

### Giving references to functions

对于函数来说，引用非常有用。因为所有权的问题，如果将数据直接给被调用函数，那这个数据的所有权也就给了对应被调用函数了。很有可能会在被函数结束后释放掉，所以之后就不能再用了。但是如果给的是引用就不存在这个问题，因为所有权还在调用函数中。

```rust
fn print_country(country_name: String) {
    println!("{}", country_name);
}

fn main() {
    let country = String::from("China");
    print_country(country); // 这里可以打印出 "China"
    print_country(country); // 因为 country 已经在上一个 print_country 释放掉了，所以这里会报错
}
```

将代码修改成传引用，就不会出现 country 被释放的情况，因为所有权没有给被调用函数

```rust
fn print_country(country_name: &String) {
    println!("{}", country_name);
}

fn main() {
    let country = String::from("China");
    print_country(&country); // 这里可以打印出 "China"
    print_country(&country); // 这里也可以打印出 "China"
}
```

如果需要修改的话：

```rust
fn add_hungary(country_name: &mut String) { // 这个函数需要一个可变的 String
    country_name.push_str("-Hungary"); // push_str() adds a &str to a String
}

fn main() {
    let mut country = String::from("Austria");
    println!("It says: {}", country);
    add_hungary(&mut country); // 由于函数需要一个可变的 String 所以这里需要给 &mut country
    println!("Now it says: {}", country); // 由于传的是引用，所以这里也可以再使用
}
```

下面这种方法也可以将数据传入并且修改该数据，主要的原因是 `main` 函数把所有权交给了被调用函数 `adds_hungary`，既然有了 `country` 的所有权，那么 `adds_hungary` 就可以想干什么干什么了。但是也由于所有权的转变，在调用 `adds_hungary` 后 `country` 也会被释放掉。

```rust
fn main() {
    let country = String::from("Austria"); // country 是不可变的，但是需要修改 country 的内容，如何做呢
    adds_hungary(country);
}

fn adds_hungary(mut country: String) { // 这里说明了如何做，adds_hungary 拿到了 country 的所有权，并且声明其为可变
    country.push_str("-Hungary");
    println!("{}", country);
}
```

### 结论

- `fn function_name(variable: String)` 获取并且拥有**只读**的 `String`。如果不返回任何数据，则这个变量就会在函数结束时释放
- `fn function_name(mut variable: String)` 获取并且拥有**可写**的 `String`。如果不返回任何数据，则这个变量就会在函数结束时释放
- `fn function_name(variable: &String)` 借用只读 String。只可以读取不能修改
- `fn function_name(variable: &mut String)` 借用可修改的 String。并且可以通过这个引用修改它

## String 和类型转换

和其他编程软件相似，有两种 string 类型：String 和 &str

- &str：写起来和其他变成软件有点不一样，原因是这个 str 是一个 char 的数组，它需要一个 & 来获取这个数组的地址和大小。
- String：这个和其他的变成软件差不多，都是包装基本字符串的一个类，是一个指针。

```rust
fn main() {
    let my_string = String::from("This is the string text");
    let my_string = "This is the string text".to_string();
    // 下面必须加类型声明 `String` 因为 `&str` 可以转换成很多种类型，如果不标明希望转换的类型的话，就会报错
    let my_string: String = "This is the string text".into();
}
```

## Copy type

有很多简单类型，叫做 `copy 类型`，这些数据都存在栈上。编译器也知道它们的大小，所以给函数赋值时，会直接复制该数据。所以对于这些数据就不用再关心所有权了。

这些类型包括：整数(integers), 浮点数(floats), 布尔值(booleans (true and false)), 和 字符(char)

### 如何确认类型是否实现了 copy

对于 `char` 类型，通过文档

https://doc.rust-lang.org/std/primitive.char.html

左边 **Trait Implementations** 实现了 **Copy**, **Debug** 和 **Display**，所以 char 就可以：

- 给一个副本到函数中 (Copy)
- 使用 {} 来打印 (Display)
- 使用 {:?} 来打印 (Debug)

对于 `String` 类型

https://doc.rust-lang.org/std/string/struct.String.html

它不是 **Copy** 类型，下面文档里面没有 **Copy**，但是有 **Clone**，**Clone** 和 **Copy** 差不多，但是更占内存。可以通过 `.clone()` 来使用。

```rust
fn prints_country(country_name: String) {
    println!("{}", country_name);
}

fn main() {
    let country = String::from("Clone");
    prints_country(country.clone()); // clone 了一个 country 给函数，country 的所有权还保留在 main 函数中
    prints_country(country);
}
```

## 集合类型

### Array

对于数组，类型的定义是 `[type; number]` 第一个是数组中的类型，第二个是数量。因此数组的大小是不变的，并且包含的数据类型必须相同。

```rust
fn main() {
    let array1 = ["One", "Two"]; // This one is type [&str; 2]
    let array2 = ["One", "Two", "Five"]; // But this one is type [&str; 3]. Different type!
}
```

如果希望一个数组中的数据完全一样，则可以

```rust
fn main() {
    let my_array = ["a"; 10];
    println!("{:?}", my_array); // ["a", "a", "a", "a", "a", "a", "a", "a", "a", "a"]
}
```

如果希望获取数组中一部分数据，首先需要使用 `&`，通过这个来让编译器获取数组的长度。通过 `..` 来决定范围。

- index 从 0 开始
- index 的范围不包含末尾(不包含范围最后一个) `[0..2]` 包含 2 个元素，第 0 个和第 1 个
- = 用来包含末尾 `[0..=2]` 包含 3 个元素，第 0, 1, 2 个

```rust
fn main() {
    let array_of_ten = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    let three_to_five = &array_of_ten[2..5];
    let three_to_six = &array_of_ten[2..=5];
    let start_at_two = &array_of_ten[1..];
    let end_at_five = &array_of_ten[..5];
    let everything = &array_of_ten[..];

    println!("Three to five: {:?}, Three to six: {:?}, start at two: {:?}, end at five: {:?}, everything: {:?}", three_to_five, three_to_six, start_at_two, end_at_five, everything);
}
```

### Vectors 向量

与 `&str` 和 `String` 类似，`Vectors` 是 `Arrays` 的包装类型，它的功能更多但是比 `array` 慢一点。定义方法是 `let mut my_vec = Vec::new();` 然后 `my_vec.push(String::from("Windy"));` 数据来指定内部类型，或者 `let mut my_vec: Vec<String> = Vec::new();`，另外也可以通过`vec!` 宏 `let mut my_vec = vec![8, 10, 10]` 来定义。

```rust
fn main() {
    let mut my_vec = Vec::new();
    my_vec.push(String::from("Windy"));

    let mut my_vec: Vec<String> = Vec::new();

    let mut my_vec = vec![8, 10, 10];

    let my_vec: Vec<u8> = [1, 2, 3].into();
    let my_vec2: Vec<_> = [9, 0, 10].into(); // Vec<_> means "choose the Vec type for me" Rust will choose Vec<i32>
}
```

`Vec` 和 `array` 不一样，可以动态的调整大小。方法就是开始会指定一个默认大小。在添加到上限的时候，自动将数据搬移到其他地方，并且增加到原来两倍大小(0, 4, 8, ...)。如果事前知道数组可能的大小，则可以给定初始大小。来避免频繁的搬移数据。

```rust
fn main() {
    let mut num_vec = Vec::with_capacity(8); // Give it capacity 8
    num_vec.push('a'); // add one character
    println!("{}", num_vec.capacity()); // prints 8
    num_vec.push('a'); // add one more
    println!("{}", num_vec.capacity()); // prints 8
    num_vec.push('a'); // add one more
    println!("{}", num_vec.capacity()); // prints 8.
    num_vec.push('a'); // add one more
    num_vec.push('a'); // add one more // Now we have 5 elements
    println!("{}", num_vec.capacity()); // Still 8
}
```

### Tuples 元组

元组用 `()` 来表示。如果函数没有指定返回值，则会默认返回一个空元组。`fn do_something() -> () {}` 这个函数输入了一个空元组，返回了一个空元组。

- 和数组不一样的地方在于，元组可以包含不同的类型。
- 和数组相同的地方在于，元组也是通过下标来访问数据的。不过用的是 `.` 而不是 `[]`

```rust
fn main() {
    // 这个元组类型是 (&str, i32, Vec<char>, char, [i32; 3], f64)
    let random_tuple = ("Here is a name", 8, vec!['a'], 'b', [8, 9, 10], 7.7); 
    println!(
        "Inside the tuple is: First item: {:?}
Second item: {:?}
Third item: {:?}
Fourth item: {:?}
Fifth item: {:?}
Sixth item: {:?}",
        random_tuple.0,
        random_tuple.1,
        random_tuple.2,
        random_tuple.3,
        random_tuple.4,
        random_tuple.5,
    )
}
```

Rust 的元组也有类似于 js 中的解构方法对元组进行操作。

```rust
fn main() {
    let str_vec = vec!["one", "two", "three"];

    let (a, b, c) = (str_vec[0], str_vec[1], str_vec[2]); // 这样就可以省去写 3 行来进行赋值了
    println!("{:?}", b);

    // 如果只想要部分数据的话
    let (_, _, variable) = (str_vec[0], str_vec[1], str_vec[2]); // 下划线的就是不要的数据
    println!("{:?}", variable);
}
```

## Structs

结构体(struct) 是用来创建自定义类型的。结构体的命名必须是 PascalCase 也就是第一个字母大写。有三种结构体分别是：

- unit struct: `struct FileDirectory;` 只写名字和分号，这个结构体什么都不做
- tuple struct: `struct Colour(u8, u8, u8);` 这个结构体内的数据是没有名字的，只能通过 index 来检索。在需要简单结构的时候比较有用
- named struct: `struct SizeAndColour { size: u32, colour: Colour }` 这个结构体的内部数据有了名称，可以通过名称来使用其数据

```rust
struct Colour(u8, u8, u8); // 定义元组结构体

struct SizeAndColour {
    size: u32,
    colour: Colour, // 可以把结构体放入这个命名的结构体中
}

fn main() {
    let my_colour = Colour(50, 0, 50);
    println!("The second part of the colour is: {}", my_colour.1); // 通过下标使用元组结构体

    // 为命名结构体赋值
    let size_and_colour = SizeAndColour {
        size: 150,
        colour: my_colour, // 最后一个可以加逗号也可以不加。不过加了比较好，在调整顺序的时候不会出错。另外 rustfmt 默认会给加上
    };

    let size = 150;
    let colour = Colour(50, 2, 50);
    let size_and_colour2 = SizeAndColour {
        size, // 和 js 一样，可以这样省略冒号后面的赋值
        colour,
    }
}
```

Struct 也可以像元组一样做解构，做法如下

```rust
struct Person { // 创建一个 Person 的结构体
    name: String,
    real_name: String,
    height: u8,
    happiness: bool,
}

fn main() {
    let papa_doc = Person { // 创建一个变量 pap_doc
        name: "Papa Doc".to_string(),
        real_name: "Clarence".to_string(),
        height: 170,
        happiness: false,
    };

    let Person { // 解构 pap_doc
        name: a, // 可以给解构的变量像这样重新命名
        real_name, // 也可以直接用原来的名字
        height,
        happiness,
    } = papa_doc;

    println!(
        "They call him {} but his real name is {}. He is {} cm tall and is he happy? {}",
        a, real_name, height, happiness
    );
}
```

## Enums 枚举

enum 和 struct 写起来有些相似，枚举是提供选择的，结构体是组合数据的。

结构体用 `.` 来访问数据，枚举用 `::` 来访问枚举值

```rust
// create the enum with two choices
enum ThingsInTheSky {
    Sun,
    Stars,
}

// With this function we can use an i32 to create ThingsInTheSky.
fn create_skystate(time: i32) -> ThingsInTheSky {
    match time {
        6..=18 => ThingsInTheSky::Sun, // Between 6 and 18 hours we can see the sun
        _ => ThingsInTheSky::Stars, // Otherwise, we can see stars
    }
}

// With this function we can match against the two choices in ThingsInTheSky.
fn check_skystate(state: &ThingsInTheSky) {
    match state {
        ThingsInTheSky::Sun => println!("I can see the sun!"),
        ThingsInTheSky::Stars => println!("I can see the stars!")
    }
}

fn main() {
    let time = 8; // it's 8 o'clock
    let skystate = create_skystate(time); // create_skystate 返回 ThingsInTheSky 枚举类型
    check_skystate(&skystate); // 给 check_skystate 一个 skystate 引用
}
```

另外还可以给枚举结构指定类型，并在之后使用时赋值

```rust
enum ThingsInTheSky {
    Sun(String), // 这样就可以在使用时给它赋值了
    Stars(String),
}

fn create_skystate(time: i32) -> ThingsInTheSky {
    match time {
        6..=18 => ThingsInTheSky::Sun(String::from("I can see the sun!")), // 给枚举赋值
        _ => ThingsInTheSky::Stars(String::from("I can see the stars!")),
    }
}

fn check_skystate(state: &ThingsInTheSky) {
    match state {
        ThingsInTheSky::Sun(description) => println!("{}", description), // 使用时就可以为其命名并使用
        ThingsInTheSky::Stars(n) => println!("{}", n), // 任何名称都可以
    }
}

fn main() {
    let time = 8;
    let skystate = create_skystate(time);
    check_skystate(&skystate);
}
```

使用 use 可以把枚举下的内容引入进来，这样就可以不用写那么多次枚举名了。

Rust 的枚举也和其他语言一样，可以指定值，并且也是对未赋值的自动给加 1 后的值。

```rust
enum Season {
    Spring, // 和其他语言类似，枚举会默认给一个从 0 开始的整数
    Summer = 1, // 如果需要，可以和其他语言一样，通过 = 给其赋值
    Autumn, // 如果不赋值，那么就自动给下一个值，也就是 2
    Winter,
}

fn main() {
    use Season::*; // 通过 use 引入 Season 中所有内容，后面就可以不用写 Season 了，只需要写 Spring, Summer
    let four_seasons = vec![Spring, Summer, Autumn, Winter];
    for season in four_seasons {
        println!("{}", season as u32); // 这里可以把枚举当作整数使用
    }
}
```

enum 中的数据类型也可以是不同的，

```rust
enum Number {
    U32(u32),
    I32(i32),
}

fn get_number(input: i32) -> Number {
    let number = match input.is_positive() {
        true => Number::U32(input as u32), // 如果是正数则将数据转换成 u32 类型
        false => Number::I32(input), // 否则给出原值(input 本身就是 i32)
    };
    number
}

fn main() {
    let my_vec = vec![get_number(-800), get_number(8)];

    for item in my_vec {
        match item {
            Number::U32(number) => println!("It's a u32 with the value {}", number),
            Number::I32(number) => println!("It's an i32 with the value {}", number),
        }
    }
}
```

## Implementing structs and enums 结构体和枚举的实现

struct 和 enum 就类似于一种数据结构，而对它们 `impl` 就是给他们增加操作数据的方法。这样将数据和操作分开的方式虽然不太符合 OO 但是这样有更大的灵活性和扩展性。

`#[]` 叫做特性(attributes)，使用这个标志可以告诉编译器，给这个结构体 `Debug` 的功能，还有其他很多种特性可以通过这个标志使用。

- 一般方法：使用 `.` 来调用。(Regular methods)
- 关联方法：使用 `::` 来调用。(Associated methods (or "static" methods))

```rust
#[derive(Debug)] // 有了这个 Debug 就可以使用 {:?} 来打印这个结构体了
struct Animal {
    age: u8,
    animal_type: AnimalType,
}

#[derive(Debug)]
enum AnimalType {
    Cat,
    Dog,
}

impl Animal {
    fn new() -> Self {
        // Self 就是 Animal.
        // 也可以用 Animal 代替 Self

        Self {
            // 当写 Animal::new() 时我们就得到了一个 10 岁的 cat
            age: 10,
            animal_type: AnimalType::Cat,
        }
    }

    fn change_to_dog(&mut self) { // 因为是在 Animal 中, &mut self 也就意味着 &mut Animal
                                  // 使用 .change_to_dog() 来把 Cat 换成 Dog
                                  // 只要有 &mut self 就可以修改
        println!("Changing animal to dog!");
        self.animal_type = AnimalType::Dog;
    }

    fn change_to_cat(&mut self) {
        // use .change_to_cat() to change the dog to a cat
        // with &mut self we can change it
        println!("Changing animal to cat!");
        self.animal_type = AnimalType::Cat;
    }

    fn check_type(&self) {
        // 可以通过 check_type 来检查当前的状态
        match self.animal_type {
            AnimalType::Dog => println!("The animal is a dog"),
            AnimalType::Cat => println!("The animal is a cat"),
        }
    }
}

impl AnimalType { // 通过 impl 也可以对 enum 实现其方法
    fn check(&self) {
        match self {
            AnimalType::Cat => println!("I am cat"),
            AnimalType::Dog => println!("I am dog"),
        }
    }
}

fn main() {
    let mut new_animal = Animal::new(); // 用关联方法创建一个 animal
                                        // 它是一个 10 岁的 cat
    new_animal.check_type(); // 使用 impl Animal 中的方法
    new_animal.change_to_dog();
    new_animal.check_type();
    new_animal.change_to_cat();
    new_animal.check_type();

    new_animal.animal_type.check(); // 使用 impl AnimalType(enum) 中的方法
}
```

## Generics 泛型

和其他有泛型的语言写法类似，泛型写在尖括号里面。

```rust
fn return_number<T>(number: T) -> T {
    println!("Here is your number.");
    number
}

fn main() {
    let number = return_number(5);
}
```

有些时候，需要对泛型的实现进行规定，比如想打印就需要有 `Display` 或 `Debug` 那么需要使用 `T: Display` 来规定其必须包含的实现。如果需要多个实现，则可以用 `+` 来增加实现 `T: Display + PartialOrd`。

```rust
use std::fmt::Display;
use std::cmp::PartialOrd;

fn compare_and_display<T: Display, U: Display + PartialOrd>(statement: T, num_1: U, num_2: U) {
    println!("{}! Is {} greater than {}? {}", statement, num_1, num_2, num_1 > num_2);
}

fn main() {
    compare_and_display("Listen up!", 9, 8);
}
```

如果需要实现的特性太多，尖括号中内容很多的时候，也可以用 `where` 放到函数代码段前

```rust
use std::cmp::PartialOrd;
use std::fmt::Display;

fn compare_and_display<T, U>(statement: T, num_1: U, num_2: U)
where
    T: Display,
    U: Display + PartialOrd,
{
    println!("{}! Is {} greater than {}? {}", statement, num_1, num_2, num_1 > num_2);
}

fn main() {
    compare_and_display("Listen up!", 9, 8);
}
```

另外，如果需要使用非参数中的类型，则可以在使用时也用尖括号来定义内部类型 `let new_data = change_type::<&str, String>("a")`

```rust
fn print_type_of<T>(_: &T) {
    println!("{}", std::any::type_name::<T>())
}

fn change_type<T, U: From<T>>(data: T) -> U {
    println!("Here is your number.");
    let new_data: U = data.into();
    new_data
}

fn main() {
    let new_data = change_type::<&str, String>("a");
    print!("Data is {} and new type is ", new_data);
    print_type_of(&new_data);
}
```

## Option and Result

Option 和 Result 是为了让 Rust 更安全。

### Option

Option 是在不确定数据存在或不存在时用的。在数据存在时使用 `Some(value)` 不存在的时候使用 `None`。

```rust
fn take_fifth(value: Vec<i32>) -> i32 {
    value[4]
}

fn main() {
    let new_vec = vec![1, 2];
    let index = take_fifth(new_vec); // 在这里就会报 panic 因为 index 超过边界
}
```

所以需要使用 `enum Option<T> { None, Some(T) }` 来包裹返回值。可以通过以下方法处理 `Option`

- match: 用 `match` 处理 `Some<T>` 和 `None`
- is_some(): 在 `Option<T>` 类型上使用 `.is_some()` 方法来检查是否是 `Some<T>`

```rust
fn take_fifth(value: Vec<i32>) -> Option<i32> {
    if value.len() < 5 {
        // .len() gives the length of the vec.
        // It must be at least 5.
        None
    } else {
        Some(value[4])
    }
}

fn handle_option(option: Option<i32>) {
    match option {
        Some(number) => println!("Found a {}", number),
        None => println!("Found a None"),
    }
}

fn main() {
    let new_vec = vec![1, 2];
    let bigger_vec = vec![1, 2, 3, 4, 5];
    println!("{:?}, {:?}", take_fifth(new_vec), take_fifth(bigger_vec)); // None, Some(5)

    // 如果需要取 Some 中的数据，则需要对其 unwrap 也就是 take_fifth(bigger_vec).unwrap();
    // 但是 None 是不能 unwrap 的，take_fifth(new_vec).unwrap(); 就会报错

    // 可以通过 match 来取 Some 中的数据
    handle_option(take_fifth(vec![1, 2])); // Found a None
    handle_option(take_fifth(vec![1, 2, 3, 4, 5])); // Found a 5

    // 另外还可以通过 .is_some(); 来检查是否 Some<T>
    let new_vec = vec![1, 2, 3, 4, 5];
    let got_fifth = take_fifth(new_vec);
    if got_fifth.is_some() {
        println!("Got a {}", got_fifth.unwrap());
    } else {
        println!("Got None");
    }
}
```

### Result

`Option` 是确定有或没有的，而 `Result` 是用来确定是否报错的 `enum Result<T, E> { Ok(T), Err(E) }` 其中 `T` 是 `Ok` 的返回类型，`E` 是 `Err` 的返回类型

处理 `Result` 和 `Option` 类似

- match: 用 `match` 处理 `Ok<T>` 和 `Err<E>`
- is_ok(): 在 `Result<T, E>` 类型上使用 `.is_ok()` 来检查是否是 `Ok<T>`
- 

```rust
fn give_result(input: i32) -> Result<(), ()> {
    if input % 2 == 0 {
        return Ok(())
    } else {
        return Err(())
    }
}

fn main() {
    if give_result(5).is_ok() {
        println!("It's okay, guys")
    } else {
        println!("It's an error, guys")
    }
}
```

```rust
fn check_if_five(number: i32) -> Result<i32, String> {
    match number {
        5 => Ok(number),
        _ => Err("Sorry, the number wasn't five.".to_string()), // This is our error message
    }
}

fn main() {
    let mut result_vec = Vec::new(); // Create a new vec for the results

    for number in 2..7 {
        result_vec.push(check_if_five(number)); // push each result into the vec
    }

    println!("{:?}", result_vec);
}
```

## `if let` and `while let`

如果对 None 或者 Err 的结果不关心，那还可以使用 `if let` 表达式来处理。

`if let Some(number) = my_vec.get(index)` 意思是如果从 `my_vec.get(index)` 获取 `Some(number)`

```rust
fn main() {
    let my_vec = vec![2, 3, 4];

    for index in 0..10 {
      if let Some(number) = my_vec.get(index) {
        println!("The number is: {}", number);
      }
    }
}
```

`while let` 类型于 `if let` 的循环版

```rust
fn main() {
    let weather_vec = vec![
        vec!["Berlin", "cloudy", "5", "-7", "78"],
        vec!["Athens", "sunny", "not humid", "20", "10", "50"],
    ];
    for mut city in weather_vec {
        println!("For the city of {}:", city[0]); // 数据中第一个数据是城市信息
        while let Some(information) = city.pop() {
            // 这个意味着: 一直循环到 pop 完数据
            // 当 vector 中没有数据可以 pop 则会返回 None，这时就跳出循环了
            if let Ok(number) = information.parse::<i32>() {
                // 尝试 parse information，它的结果如果是 Ok(number) 则会打印出来
                println!("The number is: {}", number);
            }  // 不需要再写其他代码，因为在出现错误时不需要做任何事，错误结果都丢弃掉
        }
    }
}
```

## ? 操作符

这个 ? 操作符只能放在自定义函数中，而不能放到 main 函数中，自定义函数的返回值需要是 `Result<T, E>` 类型。在一个表达式之后使用 ? 操作符后，如果该操作正常则正常向下执行，如果报错，则不继续执行且立即返回 `Err<E>`，`Err` 中的内容取决于报错的内容。

```rust
fn parse_str(input: &str) -> Result<i32, std::num::ParseIntError> {
    let parsed_number = input.parse::<i32>()?;
    Ok(parsed_number)
}

fn main() {
    let str_vec = vec!["Seven", "8", "9.0", "nice", "6060"];
    for item in str_vec {
        let parsed = parse_str(item);
        println!("{:?}", parsed);
    }
}
```

上面的例子看不出来多大用处，其实主要的用处在于链式调用时的处理，可以简化很多错误处理

```rust
use std::num::ParseIntError;

fn parse_str(input: &str) -> Result<i32, ParseIntError> {
    let parsed_number = input.parse::<u16>()?.to_string().parse::<u32>()?.to_string().parse::<i32>()?; // 每次添加 ? 来检查是否可以继续将值传递下去
    Ok(parsed_number)
}

fn main() {
    let str_vec = vec!["Seven", "8", "9.0", "nice", "6060"];
    for item in str_vec {
        let parsed = parse_str(item);
        println!("{:?}", parsed);
    }
}
```

## Traits (特征，特质)

之前使用的 `Debug`, `Copy`, `Clone` 都是 traits。在给一个类型 trait 时，需要实现它。由于 `Debug` 非常常用，所以有些特性(attributes) 可以做自动实现。在写 `#[derive(Debug)]` 时就自动实现了 `Debug`。

trait 主要是给结构体定义方法的，还可以给 trait 上 添加 traits 有以下几种形式：

- 方法仅定义在 trait 中，impl 实现为空，不能使用结构体中的数据
- 方法在 trait 中定义，impl 实现覆写方法，此时可以使用 `&self` 调用结构体中的数据
- trait 中定义方法签名，impl 实现中定义方法内容，此时可以使用 `&self` 调用结构体中的数据
- 给结构体实现特定 trait：https://doc.rust-lang.org/std/fmt/trait.Display.html
- 在定义 trait 时通过 `:` 为其添加 trait 
- trait 和 impl 实现中都不定义内容，只是对其进行组合约定类型。然后在外部方法中对其操作

具体参考 https://dhghomon.github.io/easy_rust/Chapter_34.html

### 基本的使用方法

```rust
struct Animal { // A simple struct - an Animal only has a name
    name: String,
}

trait Dog { // The dog trait gives some functionality
    fn bark(&self) { // It can bark
        println!("Woof woof!");
    }
    fn run(&self) { // and it can run
        println!("The dog is running!");
    }
}

impl Dog for Animal {
    fn run(&self) {
        println!("{} is running!", self.name); // 因为在实现内，可以知道结构体中的数据
    }
}

fn main() {
    let rover = Animal {
        name: "Rover".to_string(),
    };

    rover.bark(); // Now Animal can use bark()
    rover.run();  // and it can use run()
}
```

### 给 trait 添加 trait

```rust
struct Monster {
    health: i32,
}

#[derive(Debug)] // Now Wizard has Debug
struct Wizard {
    health: i32, // Now Wizard has health
}
#[derive(Debug)] // So does Ranger
struct Ranger {
    health: i32, // So does Ranger
}

trait FightClose: std::fmt::Debug { // Now a type needs Debug to use FightClose
    fn attack_with_sword(&self, opponent: &mut Monster) {
        opponent.health -= 10;
        println!(
            "You attack with your sword. Your opponent now has {} health left. You are now at: {:?}", // We can now print self with {:?} because we have Debug
            opponent.health, &self
        );
    }
    fn attack_with_hand(&self, opponent: &mut Monster) {
        opponent.health -= 2;
        println!(
            "You attack with your hand. Your opponent now has {} health left.  You are now at: {:?}",
            opponent.health, &self
        );
    }
}
impl FightClose for Wizard {}
impl FightClose for Ranger {}

trait FightFromDistance: std::fmt::Debug { // We could also do trait FightFromDistance: FightClose because FightClose needs Debug
    fn attack_with_bow(&self, opponent: &mut Monster, distance: u32) {
        if distance < 10 {
            opponent.health -= 10;
            println!(
                "You attack with your bow. Your opponent now has {} health left.  You are now at: {:?}",
                opponent.health, self
            );
        }
    }
    fn attack_with_rock(&self, opponent: &mut Monster, distance: u32) {
        if distance < 3 {
            opponent.health -= 4;
        }
        println!(
            "You attack with your rock. Your opponent now has {} health left.  You are now at: {:?}",
            opponent.health, self
        );
    }
}
impl FightFromDistance for Ranger {}

fn main() {
    let radagast = Wizard { health: 60 };
    let aragorn = Ranger { health: 80 };

    let mut uruk_hai = Monster { health: 40 };

    radagast.attack_with_sword(&mut uruk_hai);
    aragorn.attack_with_bow(&mut uruk_hai, 8);
}
```

### 约定类型，在外部方法中处理

```rust
use std::fmt::Debug;  // So we don't have to write std::fmt::Debug every time now

struct Monster {
    health: i32,
}

#[derive(Debug)]
struct Wizard {
    health: i32,
}
#[derive(Debug)]
struct Ranger {
    health: i32,
}

trait Magic{} // No methods for any of these traits. They are just trait bounds
trait FightClose {}
trait FightFromDistance {}

impl FightClose for Ranger{} // Each type gets FightClose,
impl FightClose for Wizard {}
impl FightFromDistance for Ranger{} // but only Ranger gets FightFromDistance
impl Magic for Wizard{}  // and only Wizard gets Magic

fn attack_with_bow<T: FightFromDistance + Debug>(character: &T, opponent: &mut Monster, distance: u32) {
    if distance < 10 {
        opponent.health -= 10;
        println!(
            "You attack with your bow. Your opponent now has {} health left.  You are now at: {:?}",
            opponent.health, character
        );
    }
}

fn attack_with_sword<T: FightClose + Debug>(character: &T, opponent: &mut Monster) {
    opponent.health -= 10;
    println!(
        "You attack with your sword. Your opponent now has {} health left. You are now at: {:?}",
        opponent.health, character
    );
}

fn fireball<T: Magic + Debug>(character: &T, opponent: &mut Monster, distance: u32) {
    if distance < 15 {
        opponent.health -= 20;
        println!("You raise your hands and cast a fireball! Your opponent now has {} health left. You are now at: {:?}",
    opponent.health, character);
    }
}

fn main() {
    let radagast = Wizard { health: 60 };
    let aragorn = Ranger { health: 80 };

    let mut uruk_hai = Monster { health: 40 };

    attack_with_sword(&radagast, &mut uruk_hai);
    attack_with_bow(&aragorn, &mut uruk_hai, 8);
    fireball(&radagast, &mut uruk_hai, 8);
}
```
