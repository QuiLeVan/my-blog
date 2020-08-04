---
path: "[Xamarin] Login với Nodejs và mongodb"
date: 2020-08-04T22:29:37.330Z
title: "[Xamarin] Login với Nodejs và mongodb"
description: Hướng dẫn tạo app xamarin form login với node js & mongodb
---
Hướng dẫn thực hiện trên máy Mac

## 1. Cài đặt mongodb trên mac

### 1.1 Install:

brew tap mongodb/brew
brew install mongodb-community@4.4

### 1.2 Các lệnh cần thiết:

Chạy:
brew services start mongodb-community@4.4

Khi muốn dừng:
brew services stop mongodb-community@4.4

Chạy ở ngầm:
mongod --config /usr/local/etc/mongod.conf --fork

Dừng chạy ngầm:
kết nối mongod từ mongo shell & dùng lệnh shutdown.

Kiểm tra xem có chạy mongo hay ko:
ps aux | grep -v grep | grep mongod

### 1.3. Tạo database:

Trong terminal gõ lệnh: `mongo` để truy cập vào mongo shell

Tạo database với name : xamarinnodejs

```shell
use xamarinnodejs
```