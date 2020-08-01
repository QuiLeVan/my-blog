---
path: Unit test trong Enterprise Apps
date: 2020-07-31T23:03:33.097Z
title: Unit test trong Enterprise Apps
description: "Mobile apps có những vấn đề đặc biệt mà trên desktop app hoặc web
  app không bao giờ có. Vd nhiều loại thiết bị khác nhau, ảnh hưởng tốc độ, trải
  nghiệm người dùng giữa ios/android, kết nối mạng, những dịch vụ mà thiết bị hỗ
  trợ ... "
---
Mobile apps có những vấn đề đặc biệt mà trên desktop app hoặc web app không bao giờ có. 
Vd nhiều loại thiết bị khác nhau, ảnh hưởng tốc độ, trải nghiệm người dùng giữa ios/android, 
kết nối mạng, những dịch vụ mà thiết bị hỗ trợ ...
Do đó cần phải test rất kỹ trên mobile app để đưa ra thị trường ứng dụng có chất lượng, 
ổn định & có hiệu suất tốt.

Có rất nhiều loại test trên mobile, điển hình như: unit testing, integration testing & user interface testing. Nhưng với unit testing là phổ biến nhất, trong bài này sẽ chỉ tập trung vào unit test.

## Unit Test là gì ?

  * Kiểm thử 1 unit nhỏ của app, thường là 1 phương thức, cô lập phương thức đó với các thành phần khác trong code. Xác minh nó hoạt động theo đúng chức năng.
  * Mục tiêu: kiểm tra mỗi unit hoạt động theo đúng mong đợi theo design, để không làm sinh ra các lỗi khác trong ứng dụng - khó khăn khi debug vì ko biết lỗi phát sinh từ đâu.

## Tại sao cần có Unit Test?

  * Để phát hiện ra lỗi ngay trong từng unit. Tránh sau này khi có quá nhiều code - sinh lỗi mất rất nhiều thời gian để debug.
  * Để đánh giá lại các function nào vẫn hoạt động tốt sau khi nâng cấp các lib / update những phần liên quan đến proj ...

## 1 dự án thì tiến hành implement Unit Test như thế nào ?

Thường đi theo mẫu: `arrange-act-assert`
* Arrange: Khởi tạo các đối tượng & set giá trị truyền vào cho các phương thức để thử nghiệm.
* Act: Gọi các phương thức cần test với các arguments được yêu cầu.
* Assert: Xác minh các hoạt động của phương thức cần test thực hiện đúng như mong đợi.

 ### Cách thức test với:

#### 1. Dependency Injection and Unit Testing:

Một cách thức để áp dụng kiến trúc : loosely-coupled (liên kết lỏng lẻo) là để phục vụ cho unit test. Ví dụ sử dụng DI với Autofac như sau:

```csharp
public class OrderDetailViewModel : ViewModelBase  
{  
    private IOrderService _ordersService;  

    public OrderDetailViewModel(IOrderService ordersService)  
    {  
        _ordersService = ordersService;  
    }  
    ...  
}
```

`OrderDetailViewModel` class có phụ thuộc vào `IOrderService` type với `container` khi mà khởi tạo đối tượng `OrderDetailViewModel`. Xem thêm phần [Denpendence Injection (DI)](https://blog.quilv.com/blog/dependency-injection-trong-net/) để rõ hơn. Lúc này để test `OrderDetailViewModel` class thì chúng ta sẽ tạo 1 đối tượng `OrderService` giả ( mock ) cho mục đích test. 

Xem hình dưới:

![](../assets/unittesting.png)

Cách làm này chấp nhận 1 đối tượng `OrderService` được truyền vào class `OrderDetailViewModel` vào thời điểm runtime & lúc để test unit `OrderDetailViewModel`. Khi test thì nó sẽ truyền vào đối tượng giả : `OrderMockService`. Lợi ích lớn nhất của việc này là có thể test với dữ liệu giả mà ko cần phải sử dụng web service hoặc cấu hình database rất phức tạp & tốn thời gian khi kiểm thử.

#### 2. Testing MVVM Applications

Test `models & view model` từ MVVM thì cũng giống kỹ thuật với việc test các class khác ( sử dụng unit test & data giả ). Tuy nhiên có 1 số pattern điển hình cho `model & view model` mà có cái lợi riêng khi sử dụng testing unit.

> TIP:

> Test one thing with each unit test. Don't be tempted to make a unit test exercise more than one aspect of the unit's behavior. 
> Doing so leads to tests that are difficult to read and update. It can also lead to confusion when interpreting a failure.

*Tạm dịch như sau:*

> Test 1 vấn đề cho mỗi unit test.
> Đừng ham test nhiều hơn mong đợi của 1 unit test.
> Nếu ko thì các test case sẽ trở nên khó đọc và khó update.
> Khả năng tạo ra những nhầm lẫn khi giải thích 1 cái lỗi nào đó.

Trong **eShopOnContainers mobile App** dùng xUnit (xunit.github.io) để kiểm thử. Nó hỗ trợ 2 kiểu unit test khác nhau:

* Test các trường hợp luôn luôn đúng.
* Test với tập theo lý thuyết là luôn đúng với tập hợp dữ liệu cụ thể nào đó.

Mỗi unit test trong **eShopOnContainers mobile App** là những `fact test`, mỗi unit test method sẽ được kèm theo với thuộc tính : `[Fact]`

> Note:

> xUnit tests are executed by a test runner. To execute the test runner, run the eShopOnContainers.TestRunner project for the required platform.

##### 2.1 Testing Asynchronous Functionality ( Test chức năng bất đồng bộ)

Khi implement theo mẫu MVVM, thì view models thường sẽ gọi các service khác để xử lý, và nó thường là các function bất đồng bộ (asynchronous). Để test code trong trường hợp này thì ta sẽ dùng service giả theo ví dụ sau:
```csharp
[Fact]  
public async Task OrderPropertyIsNotNullAfterViewModelInitializationTest()  
{  
    var orderService = new OrderMockService();  
    var orderViewModel = new OrderDetailViewModel(orderService);  

    var order = await orderService.GetOrderAsync(1, GlobalSetting.Instance.AuthToken);  
    await orderViewModel.InitializeAsync(order);  

    Assert.NotNull(orderViewModel.Order);  
}
```
Unit test này sẽ kiểm tra thuộc tính `Order` của `OrderDetailViewModel` instance sẽ có giá trị sau khi phương thức `InitializeAsync` được gọi. Phương thức này sẽ được gọi khi view tương ứng với `view model` này được Navigate tới.

Khi `OrderDetailViewModel` được khởi tạo thì nó sẽ mong đợi 1 tham số là đối tượng `OrderService` được truyền vào. Tuy nhiên, `OrderService` sẽ nhận dữ liệu từ web service. Do đó để test ta phải tạo 1 mock service `OrderMockService` để test.

##### 2.2 Testing INotifyPropertyChanged Implementations

Khi implement INotifyPropertyChange thì `view` sẽ cập nhật những thay đổi bắt nguồn từ `view models` và `model`.

Những thuộc tính này cũng có thể được update trực tiếp thông qua unit test bằng cách attach `event handler` vào trong sự kiện `PropertiyChanged`. Khi giá trị được thay đổi thì sự kiện sẽ được gọi theo như ví dụ sau:

```csharp
[Fact]  
public async Task SettingOrderPropertyShouldRaisePropertyChanged()  
{  
    bool invoked = false;  
    var orderService = new OrderMockService();  
    var orderViewModel = new OrderDetailViewModel(orderService);  

    orderViewModel.PropertyChanged += (sender, e) =>  
    {  
        if (e.PropertyName.Equals("Order"))  
            invoked = true;  
    };  
    var order = await orderService.GetOrderAsync(1, GlobalSetting.Instance.AuthToken);  
    await orderViewModel.InitializeAsync(order);  

    Assert.True(invoked);  
}
```

Unit test này sẽ gọi `InitializeAsync` của lớp `OrderDetailViewModel`, điều này khiến cho `Order` sẽ update & unit test sẽ được pass vì sự kiện `PropertyChanged` sẽ được gọi cho thuộc tính `Order`.

##### 2.3 Testing Message-based Communication

View Model mà dùng [MessagingCenter](https://blog.quilv.com/blog/messagingcenter-trong-xamarin/) để trao đổi dữ liệu với nhau giữa các lớp liên kết lỏng lẻo 
thì có thể thực hiện được unit test bằng cách đăng ký lắng nghe đến message được gửi đi bằng code đang thử nghiệm như ví dụ:

```csharp
[Fact]  
public void AddCatalogItemCommandSendsAddProductMessageTest()  
{  
    bool messageReceived = false;  
    var catalogService = new CatalogMockService();  
    var catalogViewModel = new CatalogViewModel(catalogService);  

    Xamarin.Forms.MessagingCenter.Subscribe<CatalogViewModel, CatalogItem>(  
        this, MessageKeys.AddProduct, (sender, arg) =>  
    {  
        messageReceived = true;  
    });  
    catalogViewModel.AddCatalogItemCommand.Execute(null);  

    Assert.True(messageReceived);  
}
```

Unit Test này kiểm tra `CatalogViewModel` gửi tin `AddProduct`  message để đáp ứng việc xử lý `AddCatalogItemCommand` khi được gọi. 
Bởi vì MesseagingCenter hỗ trợ việc đăng ký nhận nhiều tin, nên unit test có thể đăng ký lắng nghe tin nhắn `AddProduct` và thực hiện callback được nhận lại từ nó. 

##### 2.4 Testing Exception Handling

ví dụ:
```csharp
[Fact]  
public void InvalidEventNameShouldThrowArgumentExceptionText()  
{  
    var behavior = new MockEventToCommandBehavior  
    {  
        EventName = "OnItemTapped"  
    };  
    var listView = new ListView();  

    Assert.Throws<ArgumentException>(() => listView.Behaviors.Add(behavior));  
}
```

Unit Test này sẽ ném ra lỗi, vì list view hiện tại ko có sự kiện nào tên : `OnItemTapped`.

> Tips:

> Avoid writing unit tests that examine exception message strings. Exception message strings might change over time, and so unit tests that rely on their presence are regarded as brittle.

##### 2.5 Testing Validation

Có 2 khía cạnh để test trường hợp này:

* 1 là test bất kỳ cái rule nào được cho là chính xác.
* 2 là test `ValidatableObject<T>` như mong đợi.

Logic Validation thường dễ dàng test vì thường nó là một quá trình khép kín phụ thuộc đầu vào - đầu ra. 
Cần phải kiểm tra kết quả của `Validate` method mà mỗi giá trị có 1 ít nhất qui tắc xác nhận liên quan như sau:

```csharp
[Fact]  
public void CheckValidationPassesWhenBothPropertiesHaveDataTest()  
{  
    var mockViewModel = new MockViewModel();  
    mockViewModel.Forename.Value = "John";  
    mockViewModel.Surname.Value = "Smith";  

    bool isValid = mockViewModel.Validate();  

    Assert.True(isValid);  
}
```

Unit Test này hợp lệ khi mock data đều có chứa 2 thuộc tính đó.

Unit Test cũng test trên các trường hợp inValid, Error...

```csharp
[Fact]  
public void CheckValidationFailsWhenOnlyForenameHasDataTest()  
{  
    var mockViewModel = new MockViewModel();  
    mockViewModel.Forename.Value = "John";  

    bool isValid = mockViewModel.Validate();  

    Assert.False(isValid);  
    Assert.NotNull(mockViewModel.Forename.Value);  
    Assert.Null(mockViewModel.Surname.Value);  
    Assert.True(mockViewModel.Forename.IsValid);  
    Assert.False(mockViewModel.Surname.IsValid);  
    Assert.Empty(mockViewModel.Forename.Errors);  
    Assert.NotEmpty(mockViewModel.Surname.Errors);  
}
```

## Tổng Kết:

* Unit Test thường test những đơn vị nhỏ của app, thường là method. Những thành phần mà độc lập với các phần khác & xác thực được chúng đúng chức năng theo mong đợi.
* Mục tiêu là các function hoạt động đúng với chức năng mong muốn & không có những error được lan truyền ra các thành phần khác của app.
* Các behavior của các object được test có thể được thay các đối tượng phụ thuộc bằng các đối tượng giả để test.(cái mà có thể mô phỏng được các đối tượng phụ thuộc).
* Kích hoạt unit test để thực hiện các chức năng mà ko cần phải sử dụng các web service hay database ..

Nguồn từ: `https://docs.microsoft.com/en-us/xamarin/xamarin-forms/enterprise-application-patterns/unit-testing`