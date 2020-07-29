---
path: MessagingCenter trong Xamarin
date: 2020-07-29T02:10:14.819Z
title: MessagingCenter trong Xamarin
description: "Publish-subcribe pattern là 1 pattern gửi tin nhắn. Publisher gửi
  tin mà ko cần biết có 1 receiver nào : subscribers. Tương tự subscribers sẽ
  lắng nghe các thông tin nào đó, mà ko cần biết có 1 publisher nào gửi hay ko
  .."
---
Event trong .NET sử dụng pattern publish - subscribe pattern. Đây là cái đơn giản nhất để truyền thông tin giữa các components nếu như ko yêu cầu sự kết nối giữa chặt chẽ giữa các components.

Tuy nhiên vòng đời của publisher & subscriber phải liên kết đến các object, và subscriber type thì phải liên kết với publisher type. Điều này có khả năng tạo leak memory.( trường hợp có quá nhiều object tạm subscribe đến event của 1 static hoặc long-live object). Nếu subscriber ko được remove thì object đã liên kết đến publisher (long-live) vẫn giữ, nên nó sẽ ko được giải phóng khỏi bộ nhớ.

![](../assets/messaging-center.png)

MessagingCenter  X.F implements publish-subscribe pattern. Cơ chế giúp publisher-subscriber trao đổi thông tin mà ko có sự liên kết nào như trên. 

Messaging Center hỗ trợ multicast ( đa hướng) : nhiều publishers có thể gửi cùng 1 loại tin và có nhiều subscribers đăng ký lắng nghe đến 1 loại tin.

* MessagingCenter.Send
* MessagingCenter.Subscribe
* MessagingCenter.Unsubscribe

> Internally, the [`MessagingCenter`](https://docs.microsoft.com/en-us/dotnet/api/xamarin.forms.messagingcenter) class uses weak references. This means that it will not keep objects alive, and will allow them to be garbage collected. Therefore, it should only be necessary to unsubscribe from a message when a class no longer wishes to receive the message.

## Publish a message



## Subscribe to a message

## Unsubscribe from a message