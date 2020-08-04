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

Tạo database với name : xamarinnodejs & Collection la: user

```shell
use xamarinnodejs
db.createCollection('user')

```

## 2. Cài đặt Nodejs

```shell
npm init
```

và nhập các thông tin cần thiết, tương tự như:

```json
{
  "name": "xamarin_nodejs_mongodb",
  "version": "0.0.1",
  "description": "example to use nodejs mongodb with xamarin",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [
    "nodejs",
    "xamarin"
  ],
  "author": "levanqui88@gmail.com",
  "license": "ISC"
}
```

Tiếp theo, install các package cần thiết:

Crypto : Mã hóa password

Body-Parser: Để đọc các dữ liệu được lấy về từ User khi họ request lên.

Express: thư viện để tạo RESTful API 

Mongodb: để kết nối đến mongo database.

```shell
npm install -save mongodb express body-parser crypto
```

Thêm file index.js vào root folder:

```javascript
//import package
var mongodb = require('mongodb');
var ObjectID = mongodb.ObjectID;
var crypto = require('crypto');
var express = require('express');
var bodyParser = require('body-parser');

//PASSWORD UTIL
//CREATE FUNCTION TO RANDOM SALT
var genRandomString = function(length){
    return crypto.randomBytes(Math.ceil(length/2))
        .toString('hex')//Convert to hexa format
        .slice(0,length);
}

var sha512 = function(password, salt){
    var hash = crypto.createHmac('sha512',salt);
    hash.update(password);
    var value = hash.digest('hex');
    return{
        salt:salt,
        passwordHash:value
    }
}

function saltHashPassword(userPassword){
    var salt = generateRandomString(16);
    var passwordData = sha512(userPassword, salt);
    return passwordData;
}

function checkHashPassword(userPassword, salt){
    var passwordData = sha512(userPassword, salt);
    return passwordData;
}

//CREATE EXPRESS SERVICE
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//CREATE MONGODB CLIENT
var MongoClient = mongodb.MongoClient;

//Connection URL
var url = 'mongodb://localhost:27017'; // default port : 27017

MongoClient.connect(url,{useNewUrlParser: true}, function(err, client){
    if(err)
        console.log('Unable to connect to Mongodb', err);
    else{
        //Start web Server
        app.listen(3000,()=>{
            console.log('Connected to mongodb, Web Service run on port : 3000');
        })
    }

})

```