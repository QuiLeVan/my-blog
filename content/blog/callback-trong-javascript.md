---
path: Callback trong Javascript
date: 2020-08-16T08:44:12.897Z
title: Callback trong Javascript
description: Tất cả các vấn đề về javascript sẽ đc lưu ở đây.
---
## Mẫu viết function callback trong javascript:

```javascript
function doSomething(callback) {
    // ...

    // Call the callback
    callback('stuff', 'goes', 'here');
}

function foo(a, b, c) {
    // I'm the callback
    alert(a + " " + b + " " + c);
}

doSomething(foo);
```