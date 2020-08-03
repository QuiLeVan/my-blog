---
path: Validate trong Enterprise App
date: 2020-08-03T01:53:34.320Z
title: Validate trong Enterprise App
description: Bất kỳ App nào nhận input từ phía user thì phải qua kiểm tra là nó
  có hợp lệ hay ko. Ví dụ kiểm tra input nhập vào chỉ chứa ký tự, giới hạn bao
  nhiêu ký tự & ko có ký tự đặc biệt...
---
Bất kỳ App nào nhận input từ phía user thì phải qua kiểm tra là nó có hợp lệ hay ko. Ví dụ kiểm tra input nhập vào chỉ chứa ký tự, giới hạn bao nhiêu ký tự & ko có ký tự đặc biệt...

Trong mẫu MVVM thì view hoặc view-model sẽ thường đảm nhận việc xác thực dữ liệu đầu vào và thông báo lỗi đến view để người dùng biết như thế nào là dữ liệu chính xác khi có lỗi. 

Trong ứng dụng mẫu eShopOnContainers, thực hiện việc đồng bộ kiểm tra dữ liệu hợp lệ theo cơ chế client-server được kiểm tra ở view-model, sau đó notify đến view & highlight phần dữ liệu nào ko hợp lệ. 

![validation](https://docs.microsoft.com/en-us/xamarin/xamarin-forms/enterprise-application-patterns/validation-images/validation.png)

*chú thích:*

thuộc tính của view-model để xác thực dữ liệu được khai báo với type: `ValidatableObject<T>,` mỗi thể hiện của `ValidatableObject<T>` đều có 1 tập các validation là các qui tắc để xác thực dữ liệu hợp lệ hay ko ? List Validations : `List<IValidationRule<T>> Validations` . 

Các rule này được tạo ra khi khơi tạo view-model và thêm vào các thuộc tính ValidatableObject. 

```csharp
//Login view-model
private void AddValidations()
{
    _userName.Validations.Add(new IsNotNullOrEmptyRule<string> { ValidationMessage = "A username is required." });
    _password.Validations.Add(new IsNotNullOrEmptyRule<string> { ValidationMessage = "A password is required." });
}
```

Việc xác thực được gọi khi thuộc tính `ValidatableObject` gọi hàm Validate() để xử lý. Nếu có lỗi thì sẽ trả về list Error nằm ValidatableObject class.

```csharp
public class ValidatableObject<T> : ExtendedBindableObject, IValidity
{
    ...
    public List<string> Errors
    {
        get
        {
            return _errors;
        }
        set
        {
            _errors = value;
            RaisePropertyChanged(() => Errors);
        }
    }
    ...
    public bool IsValid
    {
        get
        {
            return _isValid;
        }
        set
        {
            _isValid = value;
            RaisePropertyChanged(() => IsValid);
        }
    }
}
```

Và IsValid property sẽ thay đổi & gửi notification đến view để cập nhật ...

## Tạo ra các rule để xác thực đầu vào ( validation rule):

Thêm các Validation Rule vào các thuộc tính cần được xác thực như sau:

```csharp
public interface IValidationRule<T>  
{  
    string ValidationMessage { get; set; }  
    bool Check(T value);  
}
```

Tạo ra 1 class rule implement interface IValidationRule:

```csharp
public class IsNotNullOrEmptyRule<T> : IValidationRule<T>  
{  
    public string ValidationMessage { get; set; }  

    public bool Check(T value)  
    {  
        if (value == null)  
        {  
            return false;  
        }  

        var str = value as string;  
        return !string.IsNullOrWhiteSpace(str);  
    }  
}
```

vd tiếp cho việc check email rule:

```csharp
public class EmailRule<T> : IValidationRule<T>  
{  
    public string ValidationMessage { get; set; }  

    public bool Check(T value)  
    {  
        if (value == null)  
        {  
            return false;  
        }  

        var str = value as string;  
        Regex regex = new Regex(@"^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$");  
        Match match = regex.Match(str);  

        return match.Success;  
    }  
}
```

> Note
>
> Property validation can sometimes involve dependent properties. An example of dependent properties is when the set of valid values for property A depends on the particular value that has been set in property B. To check that the value of property A is one of the allowed values would involve retrieving the value of property B. In addition, when the value of property B changes, property A would need to be revalidated.

## Cách thêm các Validate Rule ở trên vào các thuộc tính ValidatableObject của view-model:

Tạo properties để sử dụng Binding

```csharp
public ValidatableObject<string> UserName  
{  
    get  
    {  
        return _userName;  
    }  
    set  
    {  
        _userName = value;  
        RaisePropertyChanged(() => UserName);  
    }  
}  

public ValidatableObject<string> Password  
{  
    get  
    {  
        return _password;  
    }  
    set  
    {  
        _password = value;  
        RaisePropertyChanged(() => Password);  
    }  
}
```

Để xác thực được dữ liệu đó thì phải add các rule được tạo ra ở trên vào các thuộc tính _user hoặc _password như sau:

```csharp
private void AddValidations()  
{  
    _userName.Validations.Add(new IsNotNullOrEmptyRule<string>   
    {   
        ValidationMessage = "A username is required."   
    });  
    _password.Validations.Add(new IsNotNullOrEmptyRule<string>   
    {   
        ValidationMessage = "A password is required."   
    });  
}
```

## Kích hoạt Validation:

Trong eShopOnContainers thì có thể kích hoạt việc xác thực thủ công hoặc được kích hoạt tự động thông qua notifcation khi các thuộc tính bị thay đổi.

### Kích hoạt validation thủ công:

Trong trường hợp app eShopOnContainers, sử dụng kích hoạt thủ công cho mock service (dịch vụ giả) như sau:

User tap vào login button ở LoginView

Command sẽ được gọi: MockSignInAsync sẽ thực hiện ở model-view: LoginViewModel & nó sẽ gọi hàm xác thực:

```csharp
private bool Validate()  
{  
    bool isValidUser = ValidateUserName();  
    bool isValidPassword = ValidatePassword();  
    return isValidUser && isValidPassword;  
}  

private bool ValidateUserName()  
{  
    return _userName.Validate();  
}  

private bool ValidatePassword()  
{  
    return _password.Validate();  
}
```

Phương thức Validate của _userName, _password được gọi đến Validate của lơp ValidatableObject. và nó xử lý code như sau:

```csharp
public bool Validate()  
{  
    Errors.Clear();  

    IEnumerable<string> errors = _validations  
        .Where(v => !v.Check(Value))  
        .Select(v => v.ValidationMessage);  

    Errors = errors.ToList();  
    IsValid = !Errors.Any();  

    return this.IsValid;  
}
```

```

```

Lúc này IsValid & Errors đều cập nhật & sẽ notification đến View.

### Kích hoạt tự động sử dụng binding khi property change:

```xml
<Entry Text="{Binding UserName.Value, Mode=TwoWay}">  
    <Entry.Behaviors>  
        <behaviors:EventToCommandBehavior  
            EventName="TextChanged"  
            Command="{Binding ValidateUserNameCommand}" />  
    </Entry.Behaviors>  
    ...  
</Entry>
```

sử dụng Binding mode TwoWay thì Validation sẽ được trigger khi entry input dữ liệu vào.

## Hiển thị Error trong khi Validate dữ liệu:

![validation-login](https://docs.microsoft.com/en-us/xamarin/xamarin-forms/enterprise-application-patterns/validation-images/validation-login.png)

### Hiển thị highlight phần input không hợp lệ

Xử dụng behavior để attach 1 LineColorBehavior vào Entry để hiển thị thông báo lỗi. sử dụng như sau:

```xml
<Entry Text="{Binding UserName.Value, Mode=TwoWay}">
    <Entry.Style>
        <OnPlatform x:TypeArguments="Style">
            <On Platform="iOS, Android" Value="{StaticResource EntryStyle}" />
            <On Platform="UWP" Value="{StaticResource UwpEntryStyle}" />
        </OnPlatform>
    </Entry.Style>
    ...
</Entry>
```

Và với Style được khai báo ở App sẽ thiết đặt như sau:

```xml
<Style x:Key="EntryStyle"  
       TargetType="{x:Type Entry}">  
    ...  
    <Setter Property="behaviors:LineColorBehavior.ApplyLineColor"  
            Value="True" />  
    <Setter Property="behaviors:LineColorBehavior.LineColor"  
            Value="{StaticResource BlackColor}" />  
    ...  
</Style>
```

Trong đó:
ApplyLineColor & LineColor được attach vào property binding của LineColorBehavior

```csharp
public static class LineColorBehavior
{
    public static readonly BindableProperty ApplyLineColorProperty =
        BindableProperty.CreateAttached("ApplyLineColor", typeof(bool), typeof(LineColorBehavior), false, 
            propertyChanged: OnApplyLineColorChanged);

    public static readonly BindableProperty LineColorProperty =
        BindableProperty.CreateAttached("LineColor", typeof(Color), typeof(LineColorBehavior), Color.Default);
...
}
```
Và khi đó giá trị của ApplyLineColor được set hoặc thay đổi thì gọi OnApplyLineColorChanged method và nó được xử lý như sau:

```csharp
public static class LineColorBehavior  
{  
    ...  
    private static void OnApplyLineColorChanged(  
                BindableObject bindable, object oldValue, object newValue)  
    {  
        var view = bindable as View;  
        if (view == null)  
        {  
            return;  
        }  

        bool hasLine = (bool)newValue;  
        if (hasLine)  
        {  
            view.Effects.Add(new EntryLineColorEffect());  
        }  
        else  
        {  
            var entryLineColorEffectToRemove =   
                    view.Effects.FirstOrDefault(e => e is EntryLineColorEffect);  
            if (entryLineColorEffectToRemove != null)  
            {  
                view.Effects.Remove(entryLineColorEffectToRemove);  
            }  
        }  
    }  
}
```
EntryLineColorEffect được add vào trong Effect của view nếu  thuộc tính ApplyLineColor có giá trị true. Còn ko thì nó sẽ bị remove ra.

EntryLineColorEffect là subclass của RoutingEffect:

```csharp
public class EntryLineColorEffect : RoutingEffect  
{  
    public EntryLineColorEffect() : base("eShopOnContainers.EntryLineColorEffect")  
    {  
    }  
}
```

RoutingEffect là 1 platform-independent effect (hiệu ứng theo từng nền tảng ios-android..). EntryLineColorEffect sẽ gọi base constructor và truyền parameter là  1 group & tên hiệu ứng duy nhất cho nền tảng. `eShopOnContainers.EntryLineColorEffect`. Vd implement eShopOnContainers.EntryLineColorEffect cho ios:
```csharp
[assembly: ResolutionGroupName("eShopOnContainers")]  
[assembly: ExportEffect(typeof(EntryLineColorEffect), "EntryLineColorEffect")]  
namespace eShopOnContainers.iOS.Effects  
{  
    public class EntryLineColorEffect : PlatformEffect  
    {  
        UITextField control;  

        protected override void OnAttached()  
        {  
            try  
            {  
                control = Control as UITextField;  
                UpdateLineColor();  
            }  
            catch (Exception ex)  
            {  
                Console.WriteLine("Can't set property on attached control. Error: ", ex.Message);  
            }  
        }  

        protected override void OnDetached()  
        {  
            control = null;  
        }  

        protected override void OnElementPropertyChanged(PropertyChangedEventArgs args)  
        {  
            base.OnElementPropertyChanged(args);  

            if (args.PropertyName == LineColorBehavior.LineColorProperty.PropertyName ||  
                args.PropertyName == "Height")  
            {  
                Initialize();  
                UpdateLineColor();  
            }  
        }  

        private void Initialize()  
        {  
            var entry = Element as Entry;  
            if (entry != null)  
            {  
                Control.Bounds = new CGRect(0, 0, entry.Width, entry.Height);  
            }  
        }  

        private void UpdateLineColor()  
        {  
            BorderLineLayer lineLayer = control.Layer.Sublayers.OfType<BorderLineLayer>()  
                                                             .FirstOrDefault();  

            if (lineLayer == null)  
            {  
                lineLayer = new BorderLineLayer();  
                lineLayer.MasksToBounds = true;  
                lineLayer.BorderWidth = 1.0f;  
                control.Layer.AddSublayer(lineLayer);  
                control.BorderStyle = UITextBorderStyle.None;  
            }  

            lineLayer.Frame = new CGRect(0f, Control.Frame.Height-1f, Control.Bounds.Width, 1f);  
            lineLayer.BorderColor = LineColorBehavior.GetLineColor(Element).ToCGColor();  
            control.TintColor = control.TextColor;  
        }  

        private class BorderLineLayer : CALayer  
        {  
        }  
    }  
}
```

Entry cũng add DataTrigger như sau:
```xml
<Entry Text="{Binding UserName.Value, Mode=TwoWay}">  
    ...  
    <Entry.Triggers>  
        <DataTrigger   
            TargetType="Entry"  
            Binding="{Binding UserName.IsValid}"  
            Value="False">  
            <Setter Property="behaviors:LineColorBehavior.LineColor"   
                    Value="{StaticResource ErrorColor}" />  
        </DataTrigger>  
    </Entry.Triggers>  
</Entry>
```

This DataTrigger monitors the UserName.IsValid property, and if it's value becomes false, it executes the Setter, which changes the LineColor attached property of the LineColorBehavior attached behavior to red.

![](https://docs.microsoft.com/en-us/xamarin/xamarin-forms/enterprise-application-patterns/validation-images/validation-redline.png)


### Hiển thị thông báo error không hợp lệ

```xml
<Label Text="{Binding UserName.Errors, Converter={StaticResource FirstValidationErrorConverter}}"  
       Style="{StaticResource ValidationErrorLabelStyle}" />
```

> **Nguồn từ**: *https://docs.microsoft.com/en-us/xamarin/xamarin-forms/enterprise-application-patterns/validation*