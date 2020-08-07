---
path: Hướng dẫn tạo Customize Control trong Xamarin ( Effects)
date: 2020-08-07T02:30:01.514Z
title: Hướng dẫn tạo Customize Control trong Xamarin ( Effects)
description: Trong bài này hướng dẫn cách thay đổi hiệu ứng của Entry khi chúng
  ta focus vào nó.
---
<ol>

<li>

[**Các bước để tạo Customize Control (Effects) ntn?**](#h2_1)

</li>

<li>

[**Ví dụ cụ thể để tạo Customize Control**](#h2_2)

</li>

<ol>
<li>

[Tạo Customize Control ở Android](#h3_1)

</li>

<li>

[Tạo Customize Control ở IOS](#h3_2)

</li>

<li>

[Sử dụng Customize Control trong Share Proj:](#h3_3)
</li>

<ol>
<li>

[*Sử dụng với XAML*](#h4_1)

</li>

<li>

[*Sử dụng với code csharp*](#h4_2)
</li>
</ol>
</ol>

</ol>

<a name="h2_1"></a>

## Các bước để tạo Customize Control (Effects) ntn?

* 1. Tạo subclass PlatformEffect
* 2. Override hàm OnAttached & viết logic để customize
* 3. Override hàm OnDetached & viết logic để xóa việc customize nếu như cần thiết.
* 4. Thêm ResolutionGroupName attribute vào class. Tên này nên là duy nhất ( theo tên của namespace) việc này để tránh tác động đến những effect khác cùng tên. Chỉ áp dụng 1 lần cho mỗi dự án.
* 5. Thêm ExportEffect attribute vào effect class. Thuộc tính này đăng ký với ID duy nhất để sử dụng trong xamarin.form cùng với group name để xác định được chính xác effect được sử dụng cho control. Thuộc tính này nhận 2 tham số: Tên của loại hiệu ứng, và chuỗi là ID duy nhất để xác định effect khi được áp dụng cho control

<a name="h2_2"></a>

## Ví dụ cụ thể để tạo Customize Control

Ví dụ sẽ mô tả cụ thể cách apply FocusEffect : thay đổi màu background của Entry khi focus vào nó. 

Flow như sau:

![](https://docs.microsoft.com/en-us/xamarin/xamarin-forms/app-fundamentals/effects/creating-images/focus-effect.png)

Entry trong Homepage được customized bởi FocusEffect trong mỗi platfom cụ thể (ios / android). Mỗi FocusEffect được kế thừa từ PlatformEffect, Kết quả Entry sẽ được render tương ứng với mỗi platform cụ thể khi nó được focus. Ví dụ như hình dưới:

![](https://docs.microsoft.com/en-us/xamarin/xamarin-forms/app-fundamentals/effects/creating-images/screenshots-2.png)


<a name="h3_1"></a>

### Tạo Customize Control ở Android

```csharp
using System;
using Xamarin.Forms;
using Xamarin.Forms.Platform.Android;

[assembly: ResolutionGroupName("MyCompany")]
[assembly: ExportEffect(typeof(EffectsDemo.Droid.FocusEffect), nameof(EffectsDemo.Droid.FocusEffect))]
namespace EffectsDemo.Droid
{
    public class FocusEffect : PlatformEffect
    {
        Android.Graphics.Color originalBackgroundColor = new Android.Graphics.Color(0, 0, 0, 0);
        Android.Graphics.Color backgroundColor;

        protected override void OnAttached()
        {
            try
            {
                backgroundColor = Android.Graphics.Color.LightGreen;
                Control.SetBackgroundColor(backgroundColor);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Cannot set property on attached control. Error: ", ex.Message);
            }
        }

        protected override void OnDetached()
        {
        }

        protected override void OnElementPropertyChanged(System.ComponentModel.PropertyChangedEventArgs args)
        {
            base.OnElementPropertyChanged(args);
            try
            {
                if (args.PropertyName == "IsFocused")
                {
                    if (((Android.Graphics.Drawables.ColorDrawable)Control.Background).Color == backgroundColor)
                    {
                        Control.SetBackgroundColor(originalBackgroundColor);
                    }
                    else
                    {
                        Control.SetBackgroundColor(backgroundColor);
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Cannot set property on attached control. Error: ", ex.Message);
            }
        }
    }
}
```

<a name="h3_2"></a>

### Tạo Customize Control ở IOS

```csharp
using Xamarin.Forms;
using Xamarin.Forms.Platform.iOS;

[assembly:ResolutionGroupName ("MyCompany")]
[assembly:ExportEffect (typeof(EffectsDemo.iOS.FocusEffect), nameof(EffectsDemo.iOS.FocusEffect))]
namespace EffectsDemo.iOS
{
    public class FocusEffect : PlatformEffect
    {
        UIColor backgroundColor;

        protected override void OnAttached ()
        {
            try {
                Control.BackgroundColor = backgroundColor = UIColor.FromRGB (204, 153, 255);
            } catch (Exception ex) {
                Console.WriteLine ("Cannot set property on attached control. Error: ", ex.Message);
            }
        }

        protected override void OnDetached ()
        {
        }

        protected override void OnElementPropertyChanged (PropertyChangedEventArgs args)
        {
            base.OnElementPropertyChanged (args);

            try {
                if (args.PropertyName == "IsFocused") {
                    if (Control.BackgroundColor == backgroundColor) {
                        Control.BackgroundColor = UIColor.White;
                    } else {
                        Control.BackgroundColor = backgroundColor;
                    }
                }
            } catch (Exception ex) {
                Console.WriteLine ("Cannot set property on attached control. Error: ", ex.Message);
            }
        }
    }
}
```

<a name="h3_3"></a>

### Sử dụng Customize Control trong Share Proj:

<a name="h4_1"></a>

#### Sử dụng với XAML

```xml
<Entry Text="Effect attached to an Entry" ...>
    <Entry.Effects>
        <local:FocusEffect />
    </Entry.Effects>
    ...
</Entry>
```


FocusEffect được khai báo ở project Share như sau:

```csharp
public class FocusEffect : RoutingEffect
{
    public FocusEffect () : base ($"MyCompany.{nameof(FocusEffect)}")
    {
    }
}
```
<a name="h4_2"></a>

#### Sử dụng với code csharp

```csharp
var entry = new Entry {
  Text = "Effect attached to an Entry",
  ...
};
```

Ở Homepage:

```csharp
public HomePageCS ()
{
  ...
  entry.Effects.Add (Effect.Resolve ($"MyCompany.{nameof(FocusEffect)}"));
  ...
}
```