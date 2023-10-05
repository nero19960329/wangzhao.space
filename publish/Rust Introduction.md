---
title: Rust Introduction
dateCreated: 2022-11-14T18:36:00
---

## 官方教程

[https://doc.rust-lang.org/stable/book/](https://doc.rust-lang.org/stable/book/)

民间翻译版: [https://kaisery.github.io/trpl-zh-cn/](https://kaisery.github.io/trpl-zh-cn/)

## Why Rust?

from [https://kaisery.github.io/trpl-zh-cn/ch00-00-introduction.html](https://kaisery.github.io/trpl-zh-cn/ch00-00-introduction.html)

> Rust 程序设计语言能帮助你编写更快、更可靠的软件。在编程语言设计中，上层的编程效率和底层的细粒度控制往往不能兼得，而 Rust 则试图挑战这一矛盾。Rust 通过平衡技术能力和开发体验，允许你控制内存使用等底层细节，同时也不需要担心底层控制带来的各种麻烦。
> 

from [https://www.rust-lang.org/](https://www.rust-lang.org/)

> Performance
Rust is blazingly fast and memory-efficient: with no runtime or garbage collector, it can power performance-critical services, run on embedded devices, and easily integrate with other languages.
> 

> Reliability
Rust’s rich type system and ownership model guarantee memory-safety and thread-safety — enabling you to eliminate many classes of bugs at compile-time.
> 

> Productivity
Rust has great documentation, a friendly compiler with useful error messages, and top-notch tooling — an integrated package manager and build tool, smart multi-editor support with auto-completion and type inspections, an auto-formatter, and more.
> 

![](https://s1.ax1x.com/2023/03/27/ppyF7QJ.png)

## 安装

[https://kaisery.github.io/trpl-zh-cn/ch01-01-installation.html](https://kaisery.github.io/trpl-zh-cn/ch01-01-installation.html)

### rustup

Rust 的版本管理命令行工具。

```bash
curl --proto '=https' --tlsv1.3 <https://sh.rustup.rs> -sSf | sh
rustc --version
```

更新

```bash
rustup update
```

## 快速上手

### Hello, World!

```rust
// main.rs
fn main() {
    println!("Hello, world!");
}

```

Then,

```bash
rustc main.rs
./main
```

### Hello, Cargo!

```bash
cargo new hello_cargo  // new project
cd hello_cargo
tree
.
├── Cargo.toml
└── src
    └── main.rs
cargo build // debug build
cargo build --release // release build
cargo run // run program
```

### Playground

[https://play.rust-lang.org/](https://play.rust-lang.org/)

## 基本语法

### 变量与可变性

变量分**不可变**与**可变**：

```rust
let x = 5; // immutable variable
x = 6; // error!
let mut y = 5; // mutable variable
y = 6; // ok!
```

常量：

```rust
const HALF: f32 = 0.5; // no `let`, must annotate its type!
```

### 数据类型

**标量**

- 整型
    - i8/u8, i16/u16, i32/u32, i64/u64, i128/u128, isize/usize
    - isize/usize 随计算机架构而变
- 浮点型 f32/f64
- 布尔型 bool
- 字符类型 char

**复合类型**

- 元组类型
    - (xx, xx, xx, ...), e.g. (i32, u8, f32)
- 数组类型 -- 定长
    - [xx], e.g. [u8]
    - [xx; 长度] e.g. [u8; 5]

### 控制流

**if**

```rust
fn main() {
    let number = 6;

    if number % 4 == 0 {
        println!("number is divisible by 4");
    } else if number % 3 == 0 {
        println!("number is divisible by 3");
    } else if number % 2 == 0 {
        println!("number is divisible by 2");
    } else {
        println!("number is not divisible by 4, 3, or 2");
    }
}
```

**loop**

实际上是 `while True`

```rust
fn main() {
    let mut counter = 0;

    loop {
        counter += 1;

        if counter < 5 {
            continue;
        } else if counter == 10 {
            break;
        } else {
            println!("counter: {}", counter);
        }
    }
}
```

**while**

```rust
fn main() {
    let a = [10, 20, 30, 40, 50];
    let mut index = 0;

    while index < 5 {
        println!("the value is: {}", a[index]);

        index += 1;
    }
}
```

**for**

```rust
fn main() {
    let a = [10, 20, 30, 40, 50];

    for element in a {
        println!("the value is: {element}");
    }

    for i in 0..a.len() {
        println!("the value is: {}", a[i]);
    }
}
```

### 函数

**函数**

```rust
fn foo() -> () {
    println!("hey!");
}
```

**参数**

**必须**声明参数类型。

```rust
fn foo(x: i32, y: i32) -> () {
    println!("passing {} and {}", x, y);
}
```

**返回值**

一般返回无需 `return` 等关键词，直接写出要返回的值即可，也不用分号。

```rust
fn foo(x: i32, y: i32) -> i32 {
    x + y
}
```

Option<T>: 可能是 **空值** 的返回类型

```rust
fn foo(x: i32, y: i32) -> Option<f64> {
    if y == 0 {
        None
    } else {
        Some(x as f64 / y as f64)
    }
}

fn main () {
    let ret = foo(2, 0);
    if ret.is_none() {  // check `ret` is none
        println!("None occurs!")
    } else {
        println!("{}", ret.unwrap());  // `.unwrap()`: Option<T> -> T
    }
}
```

Result<T, E>: 有**潜在错误**的返回类型

```rust
fn foo(x: i32, y: i32) -> Result<f64, &'static str> {
    if y == 0 {
        Err("divides zero!")
    } else {
        Ok(x as f64 / y as f64)
    }
}

fn main () {
    let ret = foo(2, 0).unwrap();
    println!("{}", ret);
}
```

上述只用静态字符串来表达错误，这里还有使用真正的错误类型来表达错误的方式，以及许多错误传播的语法，本次不再细说。

### 结构体

```rust
struct User {
    active: bool,
    username: String,
    email: String,
    sign_in_count: u64,
}

fn main() {
    let user1 = User {
        email: String::from("someone@example.com"),
        username: String::from("someusername123"),
        active: true,
        sign_in_count: 1,
    };
}
```

### 所有权 (ownership)

from [https://kaisery.github.io/trpl-zh-cn/ch04-01-what-is-ownership.html](https://kaisery.github.io/trpl-zh-cn/ch04-01-what-is-ownership.html)

> 所有程序都必须管理其运行时使用计算机内存的方式。一些语言中具有垃圾回收机制，在程序运行时有规律地寻找不再使用的内存；在另一些语言中，程序员必须亲自分配和释放内存。Rust 则选择了第三种方式：通过所有权系统管理内存，编译器在编译时会根据一系列的规则进行检查。如果违反了任何这些规则，程序都不能编译。在运行时，所有权系统的任何功能都不会减慢程序。
> 

所有权规则：

1. Rust 中的每一个值都有一个 **所有者** （ *owner* ）。
2. 值在任一时刻有且只有一个所有者。
3. 当所有者（变量）离开作用域，这个值将被丢弃。

**变量作用域**

```rust
    {                      // s 在这里无效, 它尚未声明
        let s = "hello";   // 从此处起，s 是有效的

        // 使用 s
    }                      // 此作用域已结束，s 不再有效
```

**移动**

```rust
    let s1 = String::from("hello");
    let s2 = s1;  // "hello" has been moved to s2

    println!("s1: {}, s2: {}", s1, s2); // compiler will complain!
```

因为整数是有已知固定大小的简单值，所以这两个 `5` 被放入了栈中。

但 `String` 由于有一个指向堆的指针（存储在栈上）

![](https://s1.ax1x.com/2023/03/27/ppyFIWF.png)

所以 `let s2 = s1;` 一句实际上做的是 move 操作（与 cpp 的 std::move 类似）

![](https://s1.ax1x.com/2023/03/27/ppyFoz4.png)

执行后 `s1` 变成了一个无效的变量，不能再被使用了。

**克隆**

连数据一起拷贝。未来提及 trait 时也有其他情况，这里不引入。

```rust
    let s1 = String::from("hello");
    let s2 = s1.clone();

    println!("s1 = {}, s2 = {}", s1, s2);
```

**拷贝**

栈上数据：基本类型。未来提及 trait 时也有其他情况，这里不引入。

```rust
    let x = 5;
    let y = x;

    println!("x = {}, y = {}", x, y);
```

**所有权与函数**

```rust
fn main() {
    let s = String::from("hello");  // s 进入作用域

    takes_ownership(s);             // s 的值移动到函数里 ...
                                    // ... 所以到这里不再有效

    let x = 5;                      // x 进入作用域

    makes_copy(x);                  // x 应该移动函数里，
                                    // 但 i32 是 Copy 的，
                                    // 所以在后面可继续使用 x

} // 这里, x 先移出了作用域，然后是 s。但因为 s 的值已被移走，
  // 没有特殊之处

fn takes_ownership(some_string: String) { // some_string 进入作用域
    println!("{}", some_string);
} // 这里，some_string 移出作用域并调用 `drop` 方法。
  // 占用的内存被释放

fn makes_copy(some_integer: i32) { // some_integer 进入作用域
    println!("{}", some_integer);
} // 这里，some_integer 移出作用域。没有特殊之处
```

**返回值与作用域**

```rust
fn main() {
    let s1 = gives_ownership();         // gives_ownership 将返回值
                                        // 转移给 s1

    let s2 = String::from("hello");     // s2 进入作用域

    let s3 = takes_and_gives_back(s2);  // s2 被移动到
                                        // takes_and_gives_back 中,
                                        // 它也将返回值移给 s3
} // 这里, s3 移出作用域并被丢弃。s2 也移出作用域，但已被移走，
  // 所以什么也不会发生。s1 离开作用域并被丢弃

fn gives_ownership() -> String {             // gives_ownership 会将
                                             // 返回值移动给
                                             // 调用它的函数

    let some_string = String::from("yours"); // some_string 进入作用域.

    some_string                              // 返回 some_string
                                             // 并移出给调用的函数
                                             //
}

// takes_and_gives_back 将传入字符串并返回该值
fn takes_and_gives_back(a_string: String) -> String { // a_string 进入作用域
                                                      //

    a_string  // 返回 a_string 并移出给调用的函数
}
```

#### 引用

**引用**

> 引用 （ reference ）像一个指针，因为它是一个地址，我们可以由此访问储存于该地址的属于其他变量的数据。 与指针不同，引用确保指向某个特定类型的有效值。
> 

```rust
fn main() {
    let s1 = String::from("hello");

    let len = calculate_length(&s1);

    println!("The length of '{}' is {}.", s1, len);
}

fn calculate_length(s: &String) -> usize {
    s.len()
}
```

默认不允许修改引用的值。

**可变引用**

```rust
fn main() {
    let mut s = String::from("hello");

    change(&mut s);
}

fn change(some_string: &mut String) {
    some_string.push_str(", world");
}
```

限制：如果你有一个对该变量的可变引用，你就不能再创建对该变量的引用。

```rust
    let mut s = String::from("hello");

    let r1 = &mut s;  // ok
    let r2 = &mut s;  // not ok!

    println!("{}, {}", r1, r2);
```

理由是防止数据竞争，Rust 干脆在编译时期就不允许可能导致数据竞争的逻辑出现。

代码可以修改为：

```rust
    let mut s = String::from("hello");

    {
        let r1 = &mut s;
    } // r1 在这里离开了作用域，所以我们完全可以创建一个新的引用

    let r2 = &mut s;
```

另一种典型的错误：

```rust
    let mut s = String::from("hello");

    let r1 = &s; // 没问题
    let r2 = &s; // 没问题
    let r3 = &mut s; // 大问题

    println!("{}, {}, and {}", r1, r2, r3);
```

理由也是类似的：

> 不可变引用的用户可不希望在他们的眼皮底下值就被意外的改变了
> 

代码可以修改为：

```rust
    let mut s = String::from("hello");

    let r1 = &s; // 没问题
    let r2 = &s; // 没问题
    println!("{} and {}", r1, r2);
    // 此位置之后 r1 和 r2 不再使用

    let r3 = &mut s; // 没问题
    println!("{}", r3);
```

**悬垂引用（非法）**

```rust
fn main() {
    let reference_to_nothing = dangle();
}

fn dangle() -> &String { // dangle 返回一个字符串的引用

    let s = String::from("hello"); // s 是一个新字符串

    &s // 返回字符串 s 的引用
} // 这里 s 离开作用域并被丢弃。其内存被释放。
  // 危险！
```

代码可以修改为：

```rust
fn no_dangle() -> String {
    let s = String::from("hello");

    s  // 所有权被移动出去，所以没有值被释放
}
```
