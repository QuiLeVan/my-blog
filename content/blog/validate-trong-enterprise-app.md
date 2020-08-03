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


