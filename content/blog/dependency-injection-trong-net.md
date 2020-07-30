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
> 2. Có khả năng dễ dàng test mỗi class độc lập bởi vì chúng ta có thể truyền vào một đối tượng giả, hoặc đối tượng mẫu vào thông qua constructor thay vì sử dụng một implementation cứng. Xem thêm ở bài [Unit Test](https://blog.quilv.com/blog/unit-test-trong-xamarin)

Với các dependency thì thường sẽ có 1 container để chứa list các register & mapping giữa interfact và abstract types và instance mà được implement từ interface. 

Có cách khác để inject (tiêm) các dêpndency( phụ thuộc) như: *property setter injection hoặc method call injection* nhưng ít sử dụng. Chỉ focus inject vào constructor.

## Dependency Injection trong Xamarin sử dụng ntn?

Ở ViewModel, cụ thể là ProfileViewModel có cấu trúc như sau:

```csharp
public class ProfileViewModel : ViewModelBase  
{  
    private IOrderService _orderService;  

    public ProfileViewModel(IOrderService orderService)  
    {  
        _orderService = orderService;  
    }  
    ...  
}
```

Constructor của ProfileViewModel nhận 1 instance của interface IOrderService được tiêm vào từ 1 class khác. Sự phụ thuộc duy nhất trong class ProfileViewModel là trên interface IOrderService. Nên lúc này ProfileViewModel sẽ ko cần quan tâm đến việc khởi tạo đối tượng cho interface IOrderService. Lớp mà chịu trách nhiệm khởi tạo interface & tiêm nó vào ProfileViewModel thì nó được gọi là ***container ( IoC Container)***

DI Container se làm giảm liên kết giữa các objects bằng cách cung cấp các việc để khởi tạo các đối tượng của lớp và quản lý vòng đời của chúng. Trong quá trình tạo các đối tượng, container sẽ chứa toàn bộ các phụ thuộc (depedency) mà các object cần, nếu như các phụ thuộc chưa được khởi tạo thì container sẽ giúp tạo & giải quyết các phụ thuộc trước.

Chú ý nguyên văn:

> Dependency injection can also be implemented manually using factories. However, using a container provides additional capabilities such as lifetime management, and registration through assembly scanning.

Lợi ích khi sử dụng DI container:

* A container removes the need for a class to locate its dependencies and manage their lifetimes.
* A container allows mapping of implemented dependencies without affecting the class.
* A container facilitates testability by allowing dependencies to be mocked.
* A container increases maintainability by allowing new classes to be easily added to the app.