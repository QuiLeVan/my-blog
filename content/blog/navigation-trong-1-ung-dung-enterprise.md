---
path: Navigation trong 1 ung dung Enterprise
date: 2020-08-02T07:38:51.763Z
title: Navigation trong 1 ung dung Enterprise
description: Xamarin form có hỗ trợ navigation để điều hướng các page. Thường là
  tương tác giữa người dùng với UI hoặc để nó thay đổi trạng thái của ứng dụng
  dựa vào cập nhật logic của ứng dụng. Khi sử dụng MVVM thì nó sẽ phức tạp...
---
Xamarin form có hỗ trợ navigation để điều hướng các page. Thường là tương tác giữa người dùng với UI hoặc để nó thay đổi trạng thái của ứng dụng dựa vào cập nhật logic của ứng dụng. Khi sử dụng MVVM thì nó sẽ trở nên phức tạp, hãy cùng nghiên cứu các vấn đề dưới đây nhé:

* Làm sao để biết được page nào chúng ta sẽ điều hướng đến, trong trường hợp các liên kết ko chặt chẽ và ko có sự phụ thuộc giữa các view với nhau. ???
* Làm sao để biết được 1 view khi điều hướng ( navigate) tới, thì đã được khởi tạo hay chưa? Trong trường hợp sử dụng MVVM thì cả view & view model cần được khởi tạo và liên kết với nhau qua view binding context. Khi 1 app sử dụng dependence injection container thì việc khởi tạo view & view model cần 1 cơ chế khởi tạo riêng. 
* Nên thực hiện điều hướng đến view đầu tiên hay là view-model đầu tiên. Khi `view` được điều hướng trước, thì page để điều hướng tới sẽ nhận dưới dạng type của view đó. Trong khi điều hướng, thì cái view được chọn sẽ được khởi tạo cùng với view-model tương ứng với view & các service sử dụng được init theo. Một cách tiếp cận khác: là view-model sẽ được điều hướng đến đầu tiên, và cái page sẽ được điều hướng tới là tên của view-model type.
* Làm để nào để tách biệt hành vi điều hướng giữa view & view-model. MVVM thì nó tách biệt giữa layer UI & layer business logic. Tuy nhiên việc điều hướng trong ứng dụng thường được sử dụng ở layer hiển thị. Nhưng Navigation phải thường được khởi tạo và phối hợp với view-model...
* Làm sao để truyền parameter thông qua navigation cho mục đích khởi tạo ? Ví dụ: người dùng điều hướng đến view : order detail, thì lúc này order data cần phải truyền đến cái view để hiển thị lên chính xác dữ liệu.
* Làm sao phối hợp với điều hướng, để các qui tắc ( design của app) vẫn chạy đúng. Ví dụ : hiển thị lên popup để sửa lại những input ko hợp lệ, hoặc nhắc nhở bỏ qua nhũng thay đổi khi thoát khỏi view...

Trong phần này sẽ giới thiệu `NavigationService` sử dụng điều hướng đến view-model trước & xử lý các vấn đề trên.

> Lưu ý:

> `NavigationService` này chỉ áp dụng cho ContentPage, sử dụng trên các loại khác sẽ có những bug ko mong muốn.

## Navigation giữa các page trong Xamarin App:

Navigation có thể viết ở code-behind của view, nó sẽ đơn giản nhưng sẽ khó để tạo các unit test. Đặt Navigation ở view-model thì logic để điều hướng có thể được test thông qua unit test. Ví dụ : 1 app có thể sẽ ko cho người dùng truy cập vào khi dữ liệu nhập vào ko hợp lệ.

1 NavigationService nên được gọi từ view-model, điều này giúp việc testing dễ dàng. Tuy nhiên, muốn điều hướng đến 1 view thông qua view-model thì bắt buộc phải có liên kết từ view-model đến view, mà trong 1 số view đặc biệt thì những view-model đang active ko có sự liên kết này, thì sẽ xử lý ntn ???. Lúc này `NavigationService` sẽ giải quyết được vấn đề này. 

NavigationSerive sẽ implement interface dưới:

```csharp
public interface INavigationService  
{  
    ViewModelBase PreviousPageViewModel { get; }  
    Task InitializeAsync();  
    Task NavigateToAsync<TViewModel>() where TViewModel : ViewModelBase;  
    Task NavigateToAsync<TViewModel>(object parameter) where TViewModel : ViewModelBase;  
    Task RemoveLastFromBackStackAsync();  
    Task RemoveBackStackAsync();  
}
```

Interface này chỉ định những class implement nó phải có các method :

`Update các method sau ...`

Ngoài ra, `INavigationService` interface bắt buộc phải implement thuộc tính `PreviousPageViewModel`, thuộc tính này sẽ trả về view model type được liên kết với cái page trước trong stack điều hướng.

> Note:

> An INavigationService interface would usually also specify a GoBackAsync method, which is used to programmatically return to the previous page in the navigation stack. However, this method is missing from the eShopOnContainers mobile app because it's not required.

### Tạo instance NavigationService:

`NavigationService` được implement từ interface INavigationService, và được đăng ký như 1 single instance với DI Container ( Autofac) như sau:

```csharp
builder.RegisterType<NavigationService>().As<INavigationService>().SingleInstance();
```

Interface INavigationService được resolve trong ViewModelBase constructor như sau: [xem thêm phần DI container implement trong Xamarin với unity container](https://blog.quilv.com/blog/h%C6%B0%E1%BB%9Bng-d%E1%BA%ABn-chi-ti%E1%BA%BFt-implement-dependence-injection-v%E1%BB%9Bi-unity-container-trong-xamarin/)

```csharp
NavigationService = ViewModelLocator.Resolve<INavigationService>();
```

Đoạn code trên lấy được liên kết đến đối tượng NavigationService được tạo ra và lưu trữ trong Autofac Denpendence Injection Container lúc gọi method `InitNavigation` trong App.

Lớp `ViewModelBase` lưu instance `NavigationService` như 1 thuộc tính của nó với type `INavigationService`. Mà mọi lớp view-model đều kế thừa từ ViewModelBase nên có thể dùng thuộc tính `NavigationService` này để sử dụng 1 số phương thức của `INavigationService`.

Mục đích của việc này để tránh việc inject đối tượng `NavigationService` từ DI Container trong mỗi view-model class.

### Xử lý các yêu cầu điều hướng:

Trong Xamarin Form thì sẽ cung cấp 1 lớp để xử lý điều hướng [NavigationPage](https://docs.microsoft.com/en-us/dotnet/api/xamarin.forms.navigationpage), cái này thực hiện 1 số điều hướng giúp người dùng chuyển qua lại giữa các page như họ mong muốn.

Thay vì sử dụng NavigationPage trực tiếp, thì eShopOnContainers wraps NavigationPage trong CustomNavigationView như sau:

```csharp
public partial class CustomNavigationView : NavigationPage  
{  
    public CustomNavigationView() : base()  
    {  
        InitializeComponent();  
    }  

    public CustomNavigationView(Page root) : base(root)  
    {  
        InitializeComponent();  
    }  
}
```

> TIP

> Consider caching pages. Page caching results in memory consumption for views that are not currently displayed. However, without page caching it does mean that XAML parsing and construction of the page and its view model will occur every time a new page is navigated to, which can have a performance impact for a complex page. For a well-designed page that does not use an excessive number of controls, the performance should be sufficient. However, page caching might help if slow page loading times are encountered.

### Điều hướng khi app được khởi chạy ( App Lauched):

### Truyền parameter thông qua Navigation:

### Gọi Navigation sử dụng behavior ( Command)

### Xác nhận hoặc hủy bỏ điều hướng.

## Tổng kết

Trong Xamarin form hỗ trợ sẵn Navigation & có thể hoạt động tốt, nhưng khi áp dụng với MVVM thì nó sẽ trở nên phức tạp hơn.

Phần này giới thiệu cách sử dụng `NavigationService` để điều hướng đến view-model trước. Đặt logic điều hướng trong view-model để logic này có thể được kiểm tra tự động bởi unit test để đảm bảo việc hoạt động của ứng dụng là chính xác.