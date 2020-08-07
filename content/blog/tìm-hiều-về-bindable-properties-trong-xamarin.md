---
path: Tìm hiều về Bindable Properties trong Xamarin
date: 2020-08-07T07:32:19.914Z
title: Tìm hiều về Bindable Properties trong Xamarin
description: Bindable Properties trong Xamarin là gì ? và nó hoạt động như thế
  nào? Cách thức sử dụng ???
---
## Bindable Properties là gì ? 

Xem hình demo dưới đây:

![Bindable Properties](../assets/bindableproperty.png "Bindable Properties")



Binding là 1 quá trình kết nối 1 BindableProperty tới 1 property của BindingContext. Thường thấy là 1 property của 1 phần tử UI kết nối đến 1 property của ViewModel. 

Bindable properties là 1 thuộc tính mở rộng của CLR (Common Language Runtime) bằng cách thêm 1 type [`BindableProperty`](https://docs.microsoft.com/en-us/dotnet/api/xamarin.forms.bindableproperty)  thay cho việc thêm 1 field. Mục đích của Bindable Properties là cung cấp thêm 1 hệ thống thuộc tính mà có thể hổ trợ data binding, styles, templates,  và giá trị được set thông qua quan hệ parent-child. Ngoài ra, bindable property còn có thể dùng để set những giá trị mặc định, xác thực dữ liệu (validation), và callback gọi khi có sự thay đổi của các thuộc tính.



Các property nên implement bindable properties để hỗ trợ được các mục đích như sau:

* Biến đổi dữ liệu để hợp lệ dữ liệu với data binding.
* Setting các thuộc tính thông qua \`style\`
* Cung cấp giá trị default mà khác với giá trị default của type của property.
* Xác thực dữ liệu của property.
* Theo dõi sự thay đổi của giá trị.

## Cách tạo Bindable Property:



## Cách sử dụng Bindable Property: