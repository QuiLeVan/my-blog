---
path: Upload 1 hoặc nhiều images lên server nodejs với Xamarin
date: 2020-08-05T10:11:00.467Z
title: Upload 1 hoặc nhiều images lên server nodejs với Xamarin
description: Tuts làm thế nào để upload 1 hoặc nhiều image lên server nodejs với
  xamarin. ( có code backend nodejs)
---
## Hướng dẫn upload 1 ảnh từ Xamarin lên server nodejs. 

### Cập nhật Server Nodejs

Cấu hình proj tương tự với bài [Login với server Node Js](https://blog.quilv.com/blog/xamarin-login-v%E1%BB%9Bi-nodejs-v%C3%A0-mongodb/)

Code server để upload ảnh: dùng thêm thư viện multer, dùng lệnh npm install -save multer để cài đặt ở phía server & cập nhật code.

```javascript
...
var multer = require('multer');

//FOR Upload Image
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads');
    },
    filename: function (req, file, callback) {
        console.log(file.originalname);
        callback(null, file.originalname);
    }
});

var upload = multer({ storage: storage }).single('image');
...
//Upload image
app.post('/upload',(req, res)=>{
    console.log('Photo API Hit');
    upload(req, res, function (err) {
        console.log(req.file);
        if (err) {
            console.log("Photo API ERROR: "+err);
            return res.end("Error uploading file.");
        }
        console.log("SUCCESS");
        res.end("File is uploaded");
    });
})
```

Check status ở postman:

![](../assets/screen-shot-2020-08-05-at-20.43.33.png)



### Cập nhật code ở Xamarin

Add thêm thư viện nuget: Xam.Plugin.Media ( theo hướng dẫn setup cho android & ios)

Thêm code để upload ảnh như sau:

```csharp
private async Task UploadAsync()
{
    await Task.Delay(10);

    MediaFile mediaFile = await CrossMedia.Current.PickPhotoAsync();

    StreamContent scontent = new StreamContent(mediaFile.GetStream());

    scontent.Headers.ContentDisposition = new ContentDispositionHeaderValue("form-data")
    {
        FileName = "newimage",
        Name = "image"
    };
    scontent.Headers.ContentType = new MediaTypeHeaderValue("image/jpeg");

    var client = new HttpClient();
    var multi = new MultipartFormDataContent();
    multi.Add(scontent);
    var url = "http://localhost:3000/upload";

    HttpResponseMessage response = client.PostAsync(url, multi).Result;


    await HandleErrorResponse(response);

    string serialized = await response.Content.ReadAsStringAsync();

    await Application.Current.MainPage.DisplayAlert("Alert", serialized, "OK");

}

private static async Task HandleErrorResponse(HttpResponseMessage response)
{
    if (!response.IsSuccessStatusCode)
    {
        var content = await response.Content.ReadAsStringAsync();
        if (response.StatusCode == HttpStatusCode.Forbidden ||
            response.StatusCode == HttpStatusCode.Unauthorized)
        {
            await Application.Current.MainPage.DisplayAlert("Error Forbiden | Unauthorized", content, "OK");
            throw new Exception(content);
        }

        await Application.Current.MainPage.DisplayAlert("Error Other", content, "OK");
        throw new HttpRequestExceptionEx(response.StatusCode, content);
    }
}
```

## Hướng dẫn upload nhiều ảnh từ Xamarin lên server nodejs:

> Cập nhật sau