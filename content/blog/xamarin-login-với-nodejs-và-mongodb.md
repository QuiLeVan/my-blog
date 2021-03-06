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

### 2.1 Cấu hình project server:

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

### 2.2 Edit code để chạy code server kết nối với mongodb

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

Sau đó chạy lệnh: `node index.js`

### 2.3 Thêm code để hoàn thiện các api để đăng ký user, Authentication ..

#### Register Endpoint:

Sẽ chứa 3 param được truyền lên từ User gồm: email, name, pass.

Sau đó sẽ salt & hash password rồi lưu vào database.

Update code như sau:

```javascript
//Register Endpoint ( correct parameter from user : name, email, password)
        app.post('/register',(request, response, next)=>{
            var postData = request.body;

            var plaintPassword = postData.password;
            var hashData = saltHashPassword(plaintPassword);

            var password = hashData.passwordHash;//Save Password hash from sha512{}
            var salt = hashData.salt; // Save Salt

            var name = postData.name;
            var email = postData.email;

            var insertJson = {
                'email': email,
                'password': password,
                'salt': salt,
                'name': name
            };

            var db = client.db('xamarinnodejs'); // name db we create at first step (mongodb)

            //check exist email
            db.collection('user')// collection we create at first step
                .find({'email':email}).count(function (err,number){
                    if(number != 0){
                        response.json('Email already exists');
                        console.log('Email already exists');
                    }
                    else{
                        //Insert data
                        db.collection('user')
                            .insertOne(insertJson, function (error, res){
                                response.send('Registration success');
                                console.log('Registration success');
                            })
                    }
                })
        })

        //Start web Server
        app.listen(3000,()=>{
            console.log('Connected to mongodb, Web Service run on port : 3000');
        })
```

#### Login Endpoint:

Cách xử lý:

Khi User gửi thông tin login lên server với email & password thì:

\- Lấy thông tin email & password

\- Lấy khóa 'salt' dựa trên email từ database.

\- Hash password của User với salt. Nếu hash data trùng với password thì login thành công.

Code:

```javascript
//Login Endpoint
        app.post('/login',(request, response, next)=>{
            var postData = request.body;

            var email = postData.email;
            var userPassword = postData.password;
            
            var db = client.db('xamarinnodejs'); // name db we create at first step (mongodb)

            //check exist email
            db.collection('user')// collection we create at first step
                .find({'email':email}).count(function (err,number){
                    if(number == 0){
                        response.json('Email not exists');
                        console.log('Email not exists');
                    }
                    else{
                        //Find data
                        db.collection('user')
                            .findOne({'email': email}, function (error, user){
                                var salt = user.salt; //Get Salt
                                var hashed_password = checkHashPassword(userPassword, salt).passwordHash; // Hash password with salt
                                var encrypted_password = user.password; // Get password save in database.
                                if(hashed_password == encrypted_password){
                                    response.json('Login success');
                                    console.log('Login success');
                                }
                                else{
                                    response.json('Wrong Pass');
                                    console.log('Wrong Pass');
                                }
                            })
                    }
                })
        })
```

Thử test lại bằng post-man:

![](../assets/screen-shot-2020-08-05-at-07.08.33.png)

Thử với command line trong mongo shell:

```shell
db.user.find()
```

## 3. Tạo Project Xamarin Form

Các bước tạo như 1 proj Xamarin Form bình thường.
Hàm xử lý để login với backend vừa tạo:

```csharp
private async Task LoginAsync() {

    HttpClient httpClient = new HttpClient();

    var data = new LoginInfo();
    data.email = _email;
    data.password = _password;

    var uri = "http://localhost:3000/login";
    var content = new StringContent(JsonConvert.SerializeObject(data));
    content.Headers.ContentType = new MediaTypeHeaderValue("application/json");

    HttpResponseMessage response = await httpClient.PostAsync(uri, content);

    await HandleErrorResponse(response);

    string serialized = await response.Content.ReadAsStringAsync();

    await Application.Current.MainPage.DisplayAlert("Alert", serialized, "OK");
}
```

Và LoginInfo.cs:

```csharp
public class LoginInfo
{
    public string email;
    public string password;
}
```

> **Note**:
> ***IOS Build***:
> Phải thêm các trường này vào info.plist cho ios :
>
> ```xml
> 	<key>NSAppTransportSecurity</key>
> 	<dict>
> 		<key>NSAllowsArbitraryLoads</key>
> 		<true/>
> 	</dict>
> ```
>
> ***Android Build:***
>
> * Trong Proj android/Properties/AssemblyInfo.cs, thêm đoạn code sau:
>
>   ```csharp
>   [assembly: Application(UsesCleartextTraffic = true)]
>   ```
> * Nếu chạy server ở local host thì dùng ip của máy debug, không dùng localhost / 127.0.0.1 ( nên là: 192.168.1.123 vd vậy)