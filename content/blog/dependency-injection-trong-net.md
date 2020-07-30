---
path: Dependency Injection trong .NET
date: 2020-07-29T23:56:08.584Z
title: Dependency Injection trong Xamarin
description: Tìm hiểu về những điều thú vị xung quanh depedency injection và
  unit testing. Tìm hiểu rằng tại sao depedency injection lại rất quan trọng
  trong việc unit testing.
---
## Dependency injection là gì ?

* Dependency injection (DI) là 1 kiểu của Inversion of Control ( IoC).
* IoC :

  * Là một khái niệm cho một nhóm các nguyên tắc thiết kế hướng tới việc loại bỏ sự phụ thuộc trong code.
  * Nó làm việc bằng cách tự động tạo các instance của các thành phần phụ thuộc ở các module khác và đặt vào một nơi gọi là container.
  * Một container nó là một nhà máy (factory) có trách nhiệm cung cấp các instance (thể hiện) của các kiểu được yêu cầu.
* DI là một kiểu đặc biệt của IoC cho phép các thành phần phụ thuộc (các thành phần khác, các service trong chương trình) được inject (tiêm) trực tiếp từ container vào một constructor (hàm khởi dựng) hoặc một thuộc tính công khai (public properties) của một class phụ thuộc vào chúng.

Ví dụ:

```csharp
public class CodeEditor
{

  private SyntaxChecker syntaxChecker;


  public CodeEditor()
  {

  this.syntaxChecker = new SyntaxChecker();

  }
}
```

Instance của Kiểu SyntaxChecker tạo ra trong constructor của CodeEditor là 1 sự phụ thuộc cứng vì nó tạo bằng toán tử new. Ví dụ SyntaxChecker được viết bởi 1 người khác, sau này họ sẽ thay đổi bằng cách loại bỏ constructor ko tham số, lúc này thì CodeEditor sẽ bị lỗi. Nếu trường hợp có nhiều nơi trong code sử dụng SyntaxChecker() thì sẽ update lại toàn bộ code. Điều này thực sự ko lý tưởng.

> Cách tiếp cận tốt hơn là gì ?

Sử dụng DI cách như sau:

```csharp
public class CodeEditor

{

  private ISyntaxChecker syntaxChecker;



  public CodeEditor(ISyntaxChecker syntaxChecker)

  {

  this.syntaxChecker = syntaxChecker;

  }

}
```

Tạo ra những Class implement interface ISyntaxChecker.

```csharp
// a contract to define the behavior of a syntax checker

public interface ISyntaxChecker

{

  bool IsValid();

  bool GetLineCount();

  bool GetErrorCount();

  ...

}



// a concrete SyntaxChecker implementation focused on JavaScript

public class JavaScriptSyntaxChecker : ISyntaxChecker

{



  public JavaScriptSyntaxChecker()

  {



  }



  public bool IsValid()

  {

  // implement JavaScript IsValid() method here...

  }



  ... other methods defined in our interface

}
```

Khi khởi tạo instance cho CodeEditor thì có thể khởi tạo các thể hiện của Class đã implement interface ISyntaxChecker. Sau đó truyền nó vào constructor của CodeEditor như sau:

```csharp
 JavaScriptSyntaxChecker jsc = new JavaScriptSyntaxChecker(); // dependency

 CodeEditor codeEditor = new CodeEditor(jsc);



 CSharpSyntaxChecker cssc = new CSharpSyntaxChecker(); // dependency

 CodeEditor codeEditor = new CodeEditor(cssc);
```

Lúc này thì ta đã giảm được tất cả sự phụ thuộc cứng giữa CodeEditor & SyntaxChecker. Chỉ cần 1 Class implement interface ISyntaxChecker thì có thể truyền vào CodeEditor & CodeEditor có thể xử lý ...

> Có rất nhiều lợi ích mà nó mang lại, nhưng quan trọng nhất là 2 điều này:
>
> 1. Có thể quản lý được việc khởi tạo các thành phần phụ thuộc bên ngoài và sử dụng chúng. => Sử dụng Ioc Container, nó là gì, xem thêm [ở đây](https://blog.quilv.com/blog/ioc-container)
>
> 2. Có khả năng dễ dàng test mỗi class độc lập bởi vì chúng ta có thể truyền vào một đối tượng giả, hoặc đối tượng mẫu vào thông qua constructor thay vì sử dụng một implementation cứng. Xem thêm ở bài [Unit Test](https://blog.quilv.com/blog/unit-test-trong-xamarin)

## Dependency Injection trong Xamarin sử dụng ntn?