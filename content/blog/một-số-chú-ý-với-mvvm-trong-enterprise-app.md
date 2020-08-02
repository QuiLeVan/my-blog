---
path: Mot so chu y voi MVVM trong Enterprise App
date: 2020-08-02T13:47:41.326Z
title: Một số chú ý với MVVM trong Enterprise App.
description: Một số lưu ý khi sử dụng MVVM trong Enterprise App để dễ dàng apply unit test.
---
Một số chú ý như sau:

## View:

> Tip
>
> Avoid enabling and disabling UI elements in the code-behind. Ensure that view models are responsible for defining logical state changes that affect some aspects of the view's display, such as whether a command is available, or an indication that an operation is pending. Therefore, enable and disable UI elements by binding to view model properties, rather than enabling and disabling them in code-behind.

## ViewModel:

> Tip 
>
> Keep the UI responsive with asynchronous operations. Mobile apps should keep the UI thread unblocked to improve the user's perception of performance. Therefore, in the view model, use asynchronous methods for I/O operations and raise events to asynchronously notify views of property changes.
>
> Centralize data conversions in a conversion layer. It's also possible to use converters as a separate data conversion layer that sits between the view model and the view. This can be necessary, for example, when data requires special formatting that the view model doesn't provide.

## Kết Nối giữa View & View Model

> Tip
>
> Keep view models and views independent. The binding of views to a property in a data source should be the view's principal dependency on its corresponding view model. Specifically, don't reference view types, such as [`Button`](https://docs.microsoft.com/en-us/dotnet/api/xamarin.forms.button) and [`ListView`](https://docs.microsoft.com/en-us/dotnet/api/xamarin.forms.listview), from view models. By following the principles outlined here, view models can be tested in isolation, therefore reducing the likelihood of software defects by limiting scope.

###  Tự động tạo View Model với View Model Locator:

1 `View Model Locator` là 1 custom class quản lý đối tượng view model & liên kết với view. Trong eShopOnContainers thì ViewModelLocator có 1 thuộc tính được attach : `AutoWireViewModel` được dùng để liên kết giữa `view` & `view model`.

```xml
viewModelBase:ViewModelLocator.AutoWireViewModel="true"
```

thuộc tính AutoWireViewModel là 1 bindable property được init là `false`. Khi giá trị thay đổi thì nó sẽ gọi sự kiện : `OnAutoWireViewModelChanged`

```csharp
private static void OnAutoWireViewModelChanged(BindableObject bindable, object oldValue, object newValue)  
{  
    var view = bindable as Element;  
    if (view == null)  
    {  
        return;  
    }  

    var viewType = view.GetType();  
    var viewName = viewType.FullName.Replace(".Views.", ".ViewModels.");  
    var viewAssemblyName = viewType.GetTypeInfo().Assembly.FullName;  
    var viewModelName = string.Format(  
        CultureInfo.InvariantCulture, "{0}Model, {1}", viewName, viewAssemblyName);  

    var viewModelType = Type.GetType(viewModelName);  
    if (viewModelType == null)  
    {  
        return;  
    }  
    var viewModel = _container.Resolve(viewModelType);  
    view.BindingContext = viewModel;  
}
```

> Tip
>
> Sử dụng `View Model Locator`  để dễ thay thế. Cái này được dùng như việc thay thế Dependence Injection chẳng hạn như để kiểm thử hoặc design time data.