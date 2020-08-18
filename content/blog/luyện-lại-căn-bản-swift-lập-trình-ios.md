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

### Lazy khi khai báo 1 biến:

Khi khai báo lazy, thì chưa chạy thì nó chưa lưu gì cả. Rất có ích cho việc tiết kiệm memory khi tính toán của biến tốn nhiều chi phí tính toán. 

```swift
lazy var veryExpensiveVariable = expensiveMethod()

// Thường được assign đến 1 giá trị trả về của closure
lazy var veryExpensiveString = { () -> String in 
  var str = expensiveStrFetch()
  str.expensiveManipulation(integer: arc4random_uniform(5))
  return str
}()

// khi khai báo lazy thì phải dùng var
```

### Các khai báo thông thường

```swift
class Dog {
  var name = ""
}
//Sử dụng:
let myDog = Dog()
myDog.name = "Dog1"

```

hoặc:

```swift
var pi = 3.14
class Circle {
  var radius = 0.0
  var circumference: Double 
  {
    get {
      return pi * radius * 2
    }
    
    set {
      radius = newValue / pi / 2 }
  } 
}
let circle = Circle()
circle.radius = 1 
print(circle.circumference) 
// Prints "6.28" 
circle.circumference = 14 
print(circle.radius) 
// Prints "2.229..."
```

### Type Properties

là những property  dựa trên chính type của nó, ko phải theo instance. Khai báo nó với từ khóa static như sau:

```swift
struct Dog {
  static var noise = "Bark!"
}

print(Dog.noise) // Bark!
```

Có thể áp dụng được cho dạng thuộc tính dạng lưu trữ & thuộc tính dạng tính toán ( dựa vào các thuộc tính lưu trữ trong type/ class để tính toán ra giá trị & nó ko dùng để lưu trữ)

Trong class thì có thể dùng từ khóa class để thay thế cho static & dùng nó để có thể override giá trị. Nhưng nó chỉ có thể áp dụng cho thuộc tính dạng tính toán. Vd:

```swift
class Animal {
    class var noise: String {
      return "Animal noise!" 
    }
}
class Pig: Animal {
  override class var noise: String { 
    return "Oink oink!"
  } 
}
// Loại này thường được dùng trong singleTon Pattern.
```

## Other : Note những cái cần thiết:

### 1. Tupe trong swift:

```swift
let testTuple = ("abc", 123, "bcd", 456, last: "fjalsjdfljasdf")

print(testTuple.2)
print(testTuple.last)
```

Sử dụng Tupe như 1 giá trị trả về trong function

```swift
func tupleReturner() -> (Int, String) {
    return (3, "Hello")
}
let myTuple = tupleReturner()

print(myTuple.0) // 3
print(myTuple.1) // "Hello"

//Hoặc:
func tupleReturner() -> (anInteger: Int, aString: String) { 
  return (3, "Hello")
}
let myTuple = tupleReturner() 
print(myTuple.anInteger) // 3 
print(myTuple.aString) // "Hello"

```

Sử dụng typealias để đặt tên cho tupe type:

```swift
// Define a circle tuple by its center point and radius
let unitCircle: (center: (x: CGFloat, y: CGFloat), radius: CGFloat) = ((0.0, 0.0), 1.0)
func doubleRadius(ofCircle circle:(center: (x: CGFloat, y: CGFloat), radius: CGFloat))
        -> (center: (x: CGFloat, y: CGFloat), radius: CGFloat){
            return (circle.center, circle.radius * 2.0)
}

//Biểu diễn như trên rất dài
//Nếu như dùng nhiều chỗ thì có thể sử dụng typealias như sau:
// Define a circle tuple by its center point and radius
typealias Circle = (center: (x: CGFloat, y: CGFloat), radius: CGFloat)
let unitCircle: Circle = ((0.0, 0.0), 1)

func doubleRadius(ofCircle circle: Circle) -> Circle {
    // Aliased tuples also have access to value labels in the original tuple type.
    return (circle.center, circle.radius * 2.0)
}

```

#### Những lợi ích khi sử dụng tuple:

Swap 2 giá trị với nhau ko cần dùng biến tạm:

```swift
var a = "Marty McFly"
var b = "Emmett Brown"

(a, b) = (b, a)
print(a) // "Emmett Brown"
print(b) // "Marty McFly"
```

Sử dụng trong swtich case như sau:

```swift
let switchTuple = (firstCase: true, secondCase: false)

switch switchTuple {
    case (true, false):
        // do something
    case (true, true):
        // do something
    case (false, true):
        // do something
    case (false, false):
        // do something
}
```

### Enum trong Swift:

Có nhiều khác biệt hơn so với các ngôn ngữ khác:

```swift
protocol ChangesDirection {
    mutating func changeDirection()
}
enum Direction {
    // enumeration cases
    case up, down, left, right
    // initialise the enum instance with a case
    
    // that's in the opposite direction to another
    init(oppositeTo otherDirection: Direction) {
        self = otherDirection.opposite
    }
    // computed property that returns the opposite direction
    var opposite: Direction {
        switch self {
        case .up:
            return .down
        case .down:
            return .up
        case .left:
            return .right
        case .right:
            return .left
            
        }
    }
}
// extension to Direction that adds conformance to the ChangesDirection protocol
extension Direction: ChangesDirection {
    mutating func changeDirection() {
self = .left }
}

var dir = Direction(oppositeTo: .down) // Direction.up
dir.changeDirection() // Direction.left
let opposite = dir.opposite // Direction.right
```