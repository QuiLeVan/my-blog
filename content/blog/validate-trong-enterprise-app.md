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

### Hiển thị highlight phần input không hợp lệ

### Hiển thị thông báo error không hợp lệ

> **Nguồn từ**: *https://docs.microsoft.com/en-us/xamarin/xamarin-forms/enterprise-application-patterns/validation*