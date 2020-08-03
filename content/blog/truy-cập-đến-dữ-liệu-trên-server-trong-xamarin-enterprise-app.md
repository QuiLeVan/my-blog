---
path: Truy cập đến dữ liệu trên Server trong Xamarin Enterprise App
date: 2020-08-03T15:03:53.221Z
title: Truy cập đến dữ liệu trên Server trong Xamarin Enterprise App
description: Hướng dẫn sơ bộ cách sử dụng API để đọc dữ liệu phía server.
---
## Representational State Transfer (REST)

Có thể nói bản thân **REST** không phải là một loại công nghệ. Nó là phương thức tạo API với nguyên lý tổ chức nhất định. Những nguyên lý này nhằm hướng dẫn lập trình viên tạo môi trường xử lý API request được toàn diện.

Để hiểu rõ hơn về **RESTful API** ta sẽ đi lần lượt giải thích các khái niệm **API**, **REST** hay **RESTful**.

* **REST** (**RE**presentational **S**tate **T**ransfer) là một dạng chuyển đổi cấu trúc dữ liệu, một kiểu kiến trúc để viết API. Nó sử dụng phương thức HTTP đơn giản để tạo cho giao tiếp giữa các máy. Vì vậy, thay vì sử dụng một URL cho việc xử lý một số thông tin người dùng, REST gửi một yêu cầu HTTP như GET, POST, DELETE, vv đến một URL để xử lý dữ liệu.
* **API** (**A**pplication **P**rogramming **I**nterface) là một tập các quy tắc và cơ chế mà theo đó, một ứng dụng hay một thành phần sẽ tương tác với một ứng dụng hay thành phần khác. API có thể trả về dữ liệu mà bạn cần cho ứng dụng của mình ở những kiểu dữ liệu phổ biến như JSON hay XML
* **RESTful API** là một tiêu chuẩn dùng trong việc thiết kế các API cho các ứng dụng web để quản lý các resource. RESTful là một trong những kiểu thiết kế API được sử dụng phổ biến ngày nay để cho các ứng dụng (web, mobile…) khác nhau giao tiếp với nhau.

## Sử dụng RESTful APIs

### Tạo Web Requests

#### Tạo 1 GET Request ?

#### Tạo 1 POST Request ?

#### Tạo 1 DELETE Request?

## Caching Data

Tốc độ có thể cải thiện đáng kể nếu như những dữ liệu được sử dụng thường xuyên được lưu trữ ở gần nơi sử dụng & lưu vào fast storage. 

Hình thức lưu trữ cache phổ biến là lưu ở dạng read-through caching. Nếu dữ liệu chưa có trong cache thì nó sẽ truy xuất vào database & đẩy vào cache.  xem thêm : https://docs.microsoft.com/en-us/azure/architecture/patterns/cache-aside

### Managing Data Expiration

### Caching Images

## Increasing Resilience

it must be able to do all of the following:

* Detect faults when they occur, and determine if the faults are likely to be transient.
* Retry the operation if it determines that the fault is likely to be transient and keep track of the number of times the operation was retried.
* Use an appropriate retry strategy, which specifies the number of retries, the delay between each attempt, and the actions to take after a failed attempt.

### Retry Pattern

it can handle the failure in any of the following ways:

* Retrying the operation. The app could retry the failing request immediately.
* Retrying the operation after a delay. The app should wait for a suitable amount of time before retrying the request.
* Cancelling the operation. The application should cancel the operation and report an exception.

### Circuit Breaker Pattern

Trong 1 số trường hợp, thử lại luôn xảy ra lỗi, nếu liên tục thử lại thì làm điều này vô nghĩa. Thay vào đó, chấp nhận & xử lý lỗi đó ngay. 

Mẫu ngắt mạch có thể ngăn ứng dụng liên tục cố gắng thực hiện một thao tác có khả năng bị lỗi, đồng thời cho phép ứng dụng phát hiện xem lỗi đã được khắc phục hay chưa.