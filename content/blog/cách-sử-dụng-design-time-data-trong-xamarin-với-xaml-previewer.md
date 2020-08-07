---
path: Cách sử dụng Design Time Data trong Xamarin với XAML Previewer
date: 2020-08-07T13:23:31.977Z
title: Cách sử dụng Design Time Data trong Xamarin với XAML Previewer
description: Hướng dẫn cách sử dụng Design Time Data trong Xamarin với XAML Previewer
---
Đôi khi có một số màn hình cần phải có data giả thì việc căn chỉnh mới có thể làm tốt được. Sử dụng Design Time Data có thể tạo data giả và chúng ta có thể align layout trên đó.

## Cách sử dụng:

Muốn sử dụng add code sau vào header của XAML page:

```xml
xmlns:d="http://xamarin.com/schemas/2014/forms/design"
xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
mc:Ignorable="d"
```

Sau khi thêm nó, sử dụng `d:` ở trước bất kỳ attribute hoặc control nào muốn hiển thị data giả. Phần thử mà cùng với `d:` sẽ ko được show lúc runtime.
Ví dụ:

```xml
<Label Text="{Binding Name}" d:Text="Name!" />
```

## Xem hình ảnh lúc design:

```xml
<Image Source={Binding ProfilePicture} d:Source="DesignTimePicture.jpg" />
```

![](https://docs.microsoft.com/en-us/xamarin/xamarin-forms/xaml/xaml-previewer/xaml-previewer-images/designtimedata-image-sm.png)

## Data giả cho ListView:

```xml
<StackLayout>
    <ListView ItemsSource="{Binding Items}">
        <d:ListView.ItemsSource>
            <x:Array Type="{x:Type x:String}">
                <x:String>Item One</x:String>
                <x:String>Item Two</x:String>
                <x:String>Item Three</x:String>
            </x:Array>
        </d:ListView.ItemsSource>
        <ListView.ItemTemplate>
            <DataTemplate>
                <TextCell Text="{Binding ItemName}"
                          d:Text="{Binding .}" />
            </DataTemplate>
        </ListView.ItemTemplate>
    </ListView>
</StackLayout>
```

![](https://docs.microsoft.com/en-us/xamarin/xamarin-forms/xaml/xaml-previewer/xaml-previewer-images/designtimedata-itemssource-sm.png)

Phía trên sử dụng là `x:String` và chúng ta có thể thay nó bằng data model trong proj của chúng ta.

vd như sau: có model monkey:

```csharp
namespace Monkeys.Models
{
    public class Monkey
    {
        public string Name { get; set; }
        public string Location { get; set; }
    }
}
```

Trong XAML sẽ sử dụng:

```xml
xmlns:models="clr-namespace:Monkeys.Models"
...
<StackLayout>
    <ListView ItemsSource="{Binding Items}">
        <d:ListView.ItemsSource>
            <x:Array Type="{x:Type models:Monkey}">
                <models:Monkey Name="Baboon" Location="Africa and Asia"/>
                <models:Monkey Name="Capuchin Monkey" Location="Central and South America"/>
                <models:Monkey Name="Blue Monkey" Location="Central and East Africa"/>
            </x:Array>
        </d:ListView.ItemsSource>
        <ListView.ItemTemplate>
            <DataTemplate x:DataType="models:Monkey">
                <TextCell Text="{Binding Name}"
                          Detail="{Binding Location}" />
            </DataTemplate>
        </ListView.ItemTemplate>
    </ListView>
</StackLayout>
```

## Bonus Thêm 1 số trường hợp xử lý khác:

### ActivityIndicator

```xml
<ActivityIndicator 
    Grid.RowSpan="2"
    IsVisible="{Binding IsBusy}"
    IsRunning="{Binding IsBusy}"
    d:IsRunning="True"
    HorizontalOptions="Center"
    VerticalOptions="Center"/>
```

![](https://montemagno.com/content/images/2019/10/Activity.PNG)


