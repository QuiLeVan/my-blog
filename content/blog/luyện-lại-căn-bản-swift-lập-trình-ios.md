---
path: Luyện lại căn bản Swift & Lập trình IOS
date: 2020-08-17T22:51:19.017Z
title: Luyện lại căn bản Swift & Lập trình IOS
description: Ôn lại các kiến thức cơ bản về Swift & lập trình IOS
---
## Chap 1: Mở đầu:

### 1 chương trình nhỏ trong swift

có tên & đuôi là .swift như: greeting.swift

```swift
func greet(name: String, surname: String) { print("Greetings \(name) \(surname)")
}
let myName = "Homer"
let mySurname = "Simpson"
greet(name: myName, surname: mySurname)
```

### Optional Value và Optional Enum:

Kiểu Optional : kiểm tra giá trị có tồn tại hay ko. Kiểu như: "Có giá trị, thì nó sẽ bằng x" hoặc là "sẽ ko có giá trị nào cả"

vd:

```swift
let x: String? = "Hello Qui"

if let y = x {
    print(y)
}

// Neu khai bao : let x: String? = nil
// Thi se ko in ra duoc gi ca
```

\- String? cũng chính là : Optional<String>, ở vd trên nếu như ta in : print(x.dynamicType) thì sẽ có kết quả là Optional<String>

\- Optional<> được khai báo như sau:

```swift
enum Optional<Wrapped> {
/// The absence of a value.
case none
/// The presence of a value, stored as `Wrapped`.
 case some(Wrapped)
}
```

## Chap 2: Variables & Properties

### Tạo 1 biến:

Khai báo theo mẫu: var tiếp theo là tên, kiểu và giá trị:

```swift
var myVariable: Int = 10
myVariable = 20 // co thể thay đổi giá trị

let myNumber: Int = 10 // giá trị này sẽ ko thay đổi khi khai báo let

//Swift sẽ tự nhận loại khi gán giá trị
let myInt = 10 // số này là kiểu Int
let myDouble = 3.14 // số này là kiểu Double
let myFloat: Float = 3.14 //trường hợp này phải khai báo mới hiểu Float

```

### Property Observers

```swift
var myProperty = 5 { 
  willSet {
    print("Will set to \(newValue). It was previously \(myProperty)") 
  }

  didSet {
    print("Did set to \(myProperty). It was previously \(oldValue)")
  }
}

myProperty = 6
// prints: Will set to 6, It was previously 5 
// prints: Did set to 6. It was previously 5
```

> Note:
>
> willSet & didSet sẽ ko được gọi trong các trường hợp:
>
> * Khởi tạo biến với giá trị ban đầu
> * Gán giá trị bằng chính nó.

Nhớ với willSet sẽ tương ứng với param là newValue, didSet sẽ tương ứng với param là oldValue.

Trường hợp để dễ đọc hơn thì ta có thể đưa tham số vào willSet và didSet như vd dưới & tuyệt đối ko dùng newValue & oldValue để truyền vào willSet & didSet

```swift
var myFontSize = 10 
{ 
  willSet(newFontSize) 
  {
    print("Will set font to \(newFontSize), it was \(myFontSize)") 
  }

  didSet(oldFontSize) {
    print("Did set font to \(myFontSize), it was \(oldFontSize)")
  } 
}
```