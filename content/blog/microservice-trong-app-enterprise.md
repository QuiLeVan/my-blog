---
path: Microservice trong App Enterprise
date: 2020-08-03T08:32:36.601Z
title: Microservice trong App Enterprise
description: Giới thiệu sơ lược về microservice với 1 ứng dụng enterprise.
---
Microservice đảm bảo sự nhanh nhẹn, khả năng mở rộng, độ ổn định cao. 1 microservice có thể được tách rời và hoạt động cùng với các microservice khác để tạo thành 1 ứng dụng hoàn chỉnh.

Microservice nên bao gồm các dịch vụ đủ nhỏ để tạo nên service độc lập và đảm bảo nó sẽ thực hiện chức năng duy nhất của microservice đó. 1 Ứng dụng mua bán thường sẽ có các service sau:

\- shopping carts: giỏ hàng

\- inventory processing : quản lý kho hàng.

\- purchase subsystems

\- payment processing

Microservice mở rộng để đáp ứng nhu cầu:

![](../assets/microservicesapp.png)

Microservice có thể mở rộng gần như là tức thì. Cho phép ứng dụng đáp ứng được việc cân bằng tải.

Mô hình kinh điển cho việc mở rộng để cân bằng tải là : tầng stateless (ko trạng thái) với dữ liệu được chia sẽ bên ngoài để lưu những dữ liệu ko thay đổi (cache data). Các Stateful microservices quản lý các data ko thay đổi thường được lưu ở máy chủ cục bộ nơi chạy các microservice để tránh chi phí truy cập mạng & sự phức tạp khi quản lý chồng chéo các service với nhau.