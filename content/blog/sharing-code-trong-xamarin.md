---
path: Sharing code trong Xamarin
date: 2020-07-31T04:29:13.323Z
title: Sharing code trong Xamarin
description: Tất cả mọi vấn đề về share code trong Xamarin.
---
Hiện tại trong Xamarin sử dụng 2 loại : .NET standard libraries và Shared Projects. Portable Class Libraries vẫn còn support nhưng đang được xem xét thay thế bằng .NET standard libraries.

## Share code bằng .NET Standard

![](https://docs.microsoft.com/vi-vn/xamarin/cross-platform/app-fundamentals/code-sharing-images/netstandard.png)

* .NET Standard libraries có API thống nhất được dùng cho Xamarin và .NET CORE. Có thể implement code để sử dụng cho nhiều platform.
* xuất dll file để chạy trên ios/ android /...
* Sử dụng Device.RuntimePlatform để kiểm tra Device.ios / Device.Android ...

## Share code bằng Share Projects

![](https://docs.microsoft.com/vi-vn/xamarin/cross-platform/app-fundamentals/code-sharing-images/sharedassetproject.png)

* Loại Shared Asset Project (sử dụng chung asset) để sử dụng mã nguồn chung với nhau.
* Dùng #if để chạy theo yêu cầu của từng nền tảng cụ thể. ( #if \_\_ANDROID\_\_)
* Làm khó quản lý code trong các proj lớn.
* Share Proj sẽ ko được tự động biên dịch khi nó không có 1 platform nào liên kết tới nó. Nếu có lỗi thì vẫn chạy được, chỉ khi nào platform liên kết tới thì lỗi mới được show lên.
  ![](https://docs.microsoft.com/vi-vn/xamarin/cross-platform/app-fundamentals/shared-projects-images/xs-reference.png)
* Khi show Option thì rất ít thông tin được hiển thị, vì nó ko có tự biên dịch
  ![](https://docs.microsoft.com/vi-vn/xamarin/cross-platform/app-fundamentals/shared-projects-images/xs-sharedprojectoptions.png)

## Share code bằng Portable Class Libraries ( deprecated)

* xuất dll file & hỗ trợ đa nền tảng giống như .NET Standard nhưng đã lỗi thời.
* Giờ .NET Standard có thể thay thế.

## NuGet Project: Thư viện đa nền tảng cho share code.

Cập nhật sau ...

## Tự tạo gói Nuget cho Xamarin.

Cập nhật sau ...

## Sử dụng thư viện C/C++ trong Xamarin

Cập nhật sau ...