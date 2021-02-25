# Loop

## loop

```rust
fn main() {
    let mut counter = 0; // set a counter to 0
    loop {
        counter +=1; // increase the counter by 1
        println!("The counter is now: {}", counter);
        if counter == 5 { // stop when counter == 5
            break;
        }
    }
    let mut counter = 0; // set a counter to 0
    let my_number = loop {
        counter +=1; // increase the counter by 1
        println!("The counter is now: {}", counter);
        if counter == 5 { // stop when counter == 5
            break counter; // 这里会把 counter 返回出去给 my_number
        }
    }
}
```

`loop` 可以通过 `'` 和 `:` 来命名，叫做"tick"

```rust
fn main() {
    let mut counter = 0;
    let mut counter2 = 0;
    println!("Now entering the first loop.");

    'first_loop: loop {
        // Give the first loop a name
        counter += 1;
        println!("The counter is now: {}", counter);
        if counter > 9 {
            // Starts a second loop inside this loop
            println!("Now entering the second loop.");

            'second_loop: loop {
                // now we are inside 'second_loop
                println!("The second counter is now: {}", counter2);
                counter2 += 1;
                if counter2 == 3 {
                    break 'first_loop; // Break out of 'first_loop so we can exit the program
                }
            }
        }
    }
}
```

## while

`while` 和其他语言基本差不多，不过没有 `while true` 用 `loop` 就可以了

```rust
fn main() {
    let mut counter = 0;

    while counter < 5 {
        counter +=1;
        println!("The counter is now: {}", counter);
    }
}
```

## for

`for` 写起来和其他语言稍有差别，不过基本没太多变化

```rust
fn main() {
    for number in 0..3 {
        println!("The number is: {}", number); // 0, 1, 2
    }
    for number in 0..=3 { // 用 = 的意思是包含 3 这个下标的值
        println!("The next number is: {}", number); // 0, 1, 2, 3
    }
    for _ in 0..3 { // 如果不需要循环的 number 那可以用 _ 代替，如果不用 _ 则编译器会有警告
        println!("Printing the same thing three times");
    }
}
```
