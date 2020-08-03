---
path: Xác thực và ủy quyền (Authentication and Authorization) trong Enterprise App
date: 2020-08-03T13:18:35.318Z
title: Authentication and Authorization trong Enterprise App
description: "Authentication: quá trình nhận dạng thông tin như user/pass & xác
  thực thông tin với server ..."
---
Authentication: quá trình nhận dạng thông tin như user/pass & xác thực thông tin với server. Nếu thông tin đăng nhập (credential) hợp lệ thì credential được coi là 1 danh tính xác thực (authenticated identity). Khi Danh tính được xác thực thì sẽ có 1 ủy quyền (authorization) tạo ra xác định là sẽ được quyền truy cập vào phần nào của resource.

Có nhiều cách để implement Authentication & Authorization trong Xamarin Form để giao tiếp với ASP.NET web app, kể cả dùng ASP.NET Core Identity, những nhà cung cấp việc xác thực bên ngoài như: Microsoft, facebook, google,... & có authentication middleware (trung gian xác thực). 

Trong ứng dụng eShopOnContainers sử dụng containerized identity microservice ( 1 microservice để chuyên việc xác thực - IdentityServer 4). Mobile App sẽ yêu cầu 1 token từ phía IdentityServer hoặc là yêu cầu để truy cập resource của app.  IdentityServer cung cấp 1 token thay thế cho user, và user phải đăng nhập để lấy token đó. Nhưng IdentityServer sẽ ko cung cấp user interface hoặc database cho việc xác thực, nên eShopOnContainers phải sử dụng ASP.NET Core Identity để thực hiện việc này.

## Authentication

#### Bearer Tokens với IdentityServer 4:

https://github.com/IdentityServer/IdentityServer4 

Open source OpenID Connect and OAuth 2.0 framework for ASP.NET Core

OpenID Connect & OAuth 2.0 giống nhau nhưng thực sự chức năng rất khác nhau.

OpenID Connect là lớp xác thực trên cùng của OAuth 2.0 protocol. OAuth 2 là 1 giao thức yêu cầu mã access token để sử dụng các API. 

Sự kết hợp của OpenID Connect và OAuth 2.0 kết hợp hai mối quan tâm bảo mật cơ bản về xác thực và truy cập API & trong IdentityServer 4 thì sử dụng cả 2 loại này.

![](https://docs.microsoft.com/en-us/xamarin/xamarin-forms/enterprise-application-patterns/authentication-and-authorization-images/authentication.png)

#### Adding IdentityServer to a Web Application

#### Configuring IdentityServer

#### Configuring API Resources

#### Configuring Identity Resources

#### Configuring Clients:

Nhận diện được client nào được gửi thông tin lên

#### Configuring the Authentication Flow

#### Thực hiện Authentication:

![](https://docs.microsoft.com/en-us/xamarin/xamarin-forms/enterprise-application-patterns/authentication-and-authorization-images/sign-in.png)

Khi sign-out

![](https://docs.microsoft.com/en-us/xamarin/xamarin-forms/enterprise-application-patterns/authentication-and-authorization-images/sign-out.png)

Sign-in Code:

```csharp
private async Task SignInAsync()  
{  
    ...  
    LoginUrl = _identityService.CreateAuthorizationRequest();  
    IsLogin = true;  
    ...  
}

// CreateAuthorizationRequest sẽ đc implement
public string CreateAuthorizationRequest()
{
    // Create URI to authorization endpoint
    var authorizeRequest = new AuthorizeRequest(GlobalSetting.Instance.IdentityEndpoint);

    // Dictionary with values for the authorize request
    var dic = new Dictionary<string, string>();
    dic.Add("client_id", GlobalSetting.Instance.ClientId);
    dic.Add("client_secret", GlobalSetting.Instance.ClientSecret); 
    dic.Add("response_type", "code id_token");
    dic.Add("scope", "openid profile basket orders locations marketing offline_access");
    dic.Add("redirect_uri", GlobalSetting.Instance.Callback);
    dic.Add("nonce", Guid.NewGuid().ToString("N"));
    dic.Add("code_challenge", CreateCodeChallenge());
    dic.Add("code_challenge_method", "S256");

    // Add CSRF token to protect against cross-site request forgery attacks.
    var currentCSRFToken = Guid.NewGuid().ToString("N");
    dic.Add("state", currentCSRFToken);

    var authorizeUri = authorizeRequest.Create(dic); 
    return authorizeUri;
}
```

Sau khi thực hiện điều này thì :LoginUrl sẽ được trả về & gia trị isLogin = true, lúc đó Webview trong LoginView sẽ được enable. WebView binding data đến LoginUrl trong LoginViewModel và gọi behavior : NavigateCommand trong LoginViewModel & thực hiện process như sau:

```csharp
private async Task NavigateAsync(string url)
{
    var unescapedUrl = System.Net.WebUtility.UrlDecode(url);

    if (unescapedUrl.Equals(GlobalSetting.Instance.LogoutCallback))
    {
        _settingsService.AuthAccessToken = string.Empty;
        _settingsService.AuthIdToken = string.Empty;
        IsLogin = false;
        LoginUrl = _identityService.CreateAuthorizationRequest();
    }
    else if (unescapedUrl.Contains(GlobalSetting.Instance.Callback))
    {
        var authResponse = new AuthorizeResponse(url);
        if (!string.IsNullOrWhiteSpace(authResponse.Code))
        {
            var userToken = await _identityService.GetTokenAsync(authResponse.Code);
            string accessToken = userToken.AccessToken;

            if (!string.IsNullOrWhiteSpace(accessToken))
            {
                _settingsService.AuthAccessToken = accessToken;
                _settingsService.AuthIdToken = authResponse.IdentityToken;
                await NavigationService.NavigateToAsync<MainViewModel>();
                await NavigationService.RemoveLastFromBackStackAsync();
            }
        }
    }
}
```

Lưu được access Token & Navigate đến MainViewModel...

## Authorization

Sau khi Authentication thì cần Authorization (ủy quyền) để truy cập dữ liệu bằng các API.

Code backend để hạn chế quyền truy cập thì vd như sau:

```csharp
[Authorize]  
public class BasketController : Controller  
{  
    ...  
}
```

Nếu 1 user mà chưa unauthorized truy cập đến function mà đánh dấu là \[Authorize] thì trả về error 401.

Xem thêm quá trình dưới để hiểu rõ:

![](https://docs.microsoft.com/en-us/xamarin/xamarin-forms/enterprise-application-patterns/authentication-and-authorization-images/authorization.png)

### Configuring IdentityServer to Perform Authorization

### Making Access Requests to APIs từ phía Mobile App:

demo:

```csharp
var authToken = Settings.AuthAccessToken;  
Order = await _ordersService.GetOrderAsync(Convert.ToInt32(order.OrderNumber), authToken);
```

tương tự trường hợp khác:

```csharp
var authToken = Settings.AuthAccessToken;  
await _basketService.UpdateBasketAsync(new CustomerBasket  
{  
    BuyerId = userInfo.UserId,   
    Items = BasketItems.ToList()  
}, authToken);
```



```csharp
httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
```

The `DefaultRequestHeaders` property of the `HttpClient` class exposes the headers that are sent with each request, and the access token is added to the `Authorization` header prefixed with the string `Bearer`. When the request is sent to a RESTful API, the value of the `Authorization` header is extracted and validated to ensure that it's sent from a trusted issuer, and used to determine whether the user has permission to invoke the API that receives it.