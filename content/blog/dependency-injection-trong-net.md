---
path: Dependency Injection trong .NET
date: 2020-07-29T23:56:08.584Z
title: Dependency Injection trong .NET
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



## Dependency Injection trong ASP.NET Core?