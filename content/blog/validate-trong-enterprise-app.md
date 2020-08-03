---
path: Validate trong Enterprise App
date: 2020-08-03T01:53:34.320Z
title: Validate trong Enterprise App
description: Bất kỳ App nào nhận input từ phía user thì phải qua kiểm tra là nó
  có hợp lệ hay ko. Ví dụ kiểm tra input nhập vào chỉ chứa ký tự, giới hạn bao
  nhiêu ký tự & ko có ký tự đặc biệt...
---
Bất kỳ App nào nhận input từ phía user thì phải qua kiểm tra là nó có hợp lệ hay ko. Ví dụ kiểm tra input nhập vào chỉ chứa ký tự, giới hạn bao nhiêu ký tự & ko có ký tự đặc biệt...

Trong mẫu MVVM thì view hoặc view-model sẽ thường đảm nhận việc xác thực dữ liệu đầu vào và thông báo lỗi đến view để người dùng biết như thế nào là dữ liệu chính xác khi có lỗi. 

Trong ứng dụng mẫu eShopOnContainers, thực hiện việc đồng bộ kiểm tra dữ liệu hợp lệ theo cơ chế client-server được kiểm tra ở view-model, sau đó notify đến view & highlight phần dữ liệu nào ko hợp lệ. 

![validation](https://docs.microsoft.com/en-us/xamarin/xamarin-forms/enterprise-application-patterns/validation-images/validation.png)

*chú thích:*

## Tạo ra các qui chuẩn cho việc xác thực đầu vào ( validation rule):

Thêm các Validation Rule vào các thuộc tính cần được xác thực

## Kích hoạt Validation:

Trong eShopOnContainers thì có thể kích hoạt việc xác thực thủ công hoặc được kích hoạt tự động thông qua notifcation khi các thuộc tính bị thay đổi.

### Kích hoạt validation thủ công:

### Kích hoạt tự động:

## Hiển thị Error trong khi Validate dữ liệu:

### Hiển thị highlight phần input không hợp lệ

### Hiển thị thông báo error không hợp lệ

> **Nguồn từ**: *https://docs.microsoft.com/en-us/xamarin/xamarin-forms/enterprise-application-patterns/validation*