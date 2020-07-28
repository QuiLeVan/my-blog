---
path: User Interface (UI) trong Xamarin
date: 2020-07-28T22:08:22.628Z
title: User Interface (UI) trong Xamarin
description: "Những kiến thức về UI : Style, Theme .. trong Xamarin Form"
---
## Style trong Xamarin Form là gì và cách sử dụng như thế nào?

### Style trong Xamarin Form là gì ?

* class Style (Xamarin.Forms.Style ) 
* Nhóm các thành phần UI chung để sử dụng lại & thay đổi nhanh chóng như: các loại button, các loại text h1, h2 ...
* Style sử dụng : XAML Style hoặc Cascading Style Sheets ( CSS)

### Sử dụng Style với XAML Style:

* Explicit Styles: apply cho 1 đối tượng cụ thể

  ```xml
  <ContentPage xmlns="http://xamarin.com/schemas/2014/forms" xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml" x:Class="Styles.ExplicitStylesPage" Title="Explicit" IconImageSource="xaml.png">
      <ContentPage.Content>
          <StackLayout Padding="0,20,0,0">
              <StackLayout.Resources>
                  <ResourceDictionary>
                      <Style x:Key="labelRedStyle" TargetType="Label">
                        ...
                      </Style>
                      ...
                  </ResourceDictionary>
              </StackLayout.Resources>
              <Label Text="These labels" Style="{StaticResource labelRedStyle}" />
              ...
          </StackLayout>
      </ContentPage.Content>
  </ContentPage>
  ```
* Implicit Styles: Sử dụng để apply chung cho 1 TargetType vd: Button/ Label ...

  ```xml
  <ContentPage xmlns="http://xamarin.com/schemas/2014/forms" xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml" xmlns:local="clr-namespace:Styles;assembly=Styles" x:Class="Styles.ImplicitStylesPage" Title="Implicit" IconImageSource="xaml.png">
      <ContentPage.Resources>
          <ResourceDictionary>
              <Style TargetType="Entry">
                  <Setter Property="HorizontalOptions" Value="Fill" />
                  <Setter Property="VerticalOptions" Value="CenterAndExpand" />
                  <Setter Property="BackgroundColor" Value="Yellow" />
                  <Setter Property="FontAttributes" Value="Italic" />
                  <Setter Property="TextColor" Value="Blue" />
              </Style>
          </ResourceDictionary>
      </ContentPage.Resources>
      <ContentPage.Content>
          <StackLayout Padding="0,20,0,0">
              <Entry Text="These entries" />
              <Entry Text="are demonstrating" />
              <Entry Text="implicit styles," />
              <Entry Text="and an implicit style override" BackgroundColor="Lime" TextColor="Red" />
              <local:CustomEntry Text="Subclassed Entry is not receiving the style" />
          </StackLayout>
      </ContentPage.Content>
  </ContentPage>
  ```
* Global Styles: Để sử dụng chung cho toàn pages (ResourceDictionary tại App.xaml ), tránh việc lặp đi lặp lại việc tạo style giữa các page , có thể override style tại resource page / resource của từng phần tử.
* Style Inheritance: Để kế thừa lại từ style khác, mục đích tái sử dụng & ko duplicate. Sử dụng BaseOn:

  ```xml
  <ContentPage xmlns="http://xamarin.com/schemas/2014/forms" xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml" x:Class="Styles.StyleInheritancePage" Title="Inheritance" IconImageSource="xaml.png">
      <ContentPage.Resources>
          <ResourceDictionary>
              <Style x:Key="baseStyle" TargetType="View">
                  <Setter Property="HorizontalOptions"
                          Value="Center" />
                  <Setter Property="VerticalOptions"
                          Value="CenterAndExpand" />
              </Style>
              <Style x:Key="labelStyle" TargetType="Label"
                     BasedOn="{StaticResource baseStyle}">
                  ...
                  <Setter Property="TextColor" Value="Teal" />
              </Style>
              <Style x:Key="buttonStyle" TargetType="Button"
                     BasedOn="{StaticResource baseStyle}">
                  <Setter Property="BorderColor" Value="Lime" />
                  ...
              </Style>
          </ResourceDictionary>
      </ContentPage.Resources>
      <ContentPage.Content>
          <StackLayout Padding="0,20,0,0">
              <Label Text="These labels"
                     Style="{StaticResource labelStyle}" />
              ...
              <Button Text="So is the button"
                      Style="{StaticResource buttonStyle}" />
          </StackLayout>
      </ContentPage.Content>
  </ContentPage>
  ```
* Dynamic Styles: Style sẽ ko thay đổi sau khi được assign. Sử dụng DynamicResource để giải quyết việc này. DynamicResource va StaticResource markup extension là giống nhau, chỉ khác StaticResource là : single dictionary lookup, và DynamicResource tồn lại liên kết đến Dictionary key -> khi dictionary entry đã liên kết với dictionary key bị thay đổi thì nó sẽ thay đổi theo -> UI sẽ được cập nhật. Tiến hành qua 2 bước:

  * Khai báo dynamic style XAML file:

    ```xml
    <ContentPage xmlns="http://xamarin.com/schemas/2014/forms" xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml" x:Class="Styles.DynamicStylesPage" Title="Dynamic" IconImageSource="xaml.png">
        <ContentPage.Resources>
            <ResourceDictionary>
                <Style x:Key="baseStyle" TargetType="View">
                  ...
                </Style>
                <Style x:Key="blueSearchBarStyle"
                       TargetType="SearchBar"
                       BasedOn="{StaticResource baseStyle}">
                  ...
                </Style>
                <Style x:Key="greenSearchBarStyle"
                       TargetType="SearchBar">
                  ...
                </Style>
                ...
            </ResourceDictionary>
        </ContentPage.Resources>
        <ContentPage.Content>
            <StackLayout Padding="0,20,0,0">
                <SearchBar Placeholder="These SearchBar controls"
                           Style="{DynamicResource searchBarStyle}" />
                ...
            </StackLayout>
        </ContentPage.Content>
    </ContentPage>
    ```
  * Xử lý ở code-behind: 

    ```csharp
    public partial class DynamicStylesPage : ContentPage
    {
        bool originalStyle = true;

        public DynamicStylesPage ()
        {
            InitializeComponent ();
            Resources ["searchBarStyle"] = Resources ["blueSearchBarStyle"];
        }

        void OnButtonClicked (object sender, EventArgs e)
        {
            if (originalStyle) {
                Resources ["searchBarStyle"] = Resources ["greenSearchBarStyle"];
                originalStyle = false;
            } else {
                Resources ["searchBarStyle"] = Resources ["blueSearchBarStyle"];
                originalStyle = true;
            }
        }
    }
    ```
* Device Styles: X.F chứa 6 loại để hiển thị cho phần Label:

  * BodyStyle
  * CaptionStyle
  * ListItemDetailTextStyle
  * ListItemTextStyle
  * SubtitleStyle
  * TitleStyle

  ```xml
  <ContentPage xmlns="http://xamarin.com/schemas/2014/forms" xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml" x:Class="Styles.DeviceStylesPage" Title="Device" IconImageSource="xaml.png">
      <ContentPage.Resources>
          <ResourceDictionary>
              <Style x:Key="myBodyStyle" TargetType="Label"
                BaseResourceKey="BodyStyle">
                  <Setter Property="TextColor" Value="Accent" />
              </Style>
          </ResourceDictionary>
      </ContentPage.Resources>
      <ContentPage.Content>
          <StackLayout Padding="0,20,0,0">
              <Label Text="Title style"
                Style="{DynamicResource TitleStyle}" />
              <Label Text="Subtitle text style"
                Style="{DynamicResource SubtitleStyle}" />
              <Label Text="Body style"
                Style="{DynamicResource BodyStyle}" />
              <Label Text="Caption style"
                Style="{DynamicResource CaptionStyle}" />
              <Label Text="List item detail text style"
                Style="{DynamicResource ListItemDetailTextStyle}" />
              <Label Text="List item text style"
                Style="{DynamicResource ListItemTextStyle}" />
              <Label Text="No style" />
              <Label Text="My body style"
                Style="{StaticResource myBodyStyle}" />
          </StackLayout>
      </ContentPage.Content>
  </ContentPage>
  ```
* Style Classes: để sử dụng nhiều style cho 1 TargetType: vd BoxView có nhiều Style :

  ```xml
  <ContentPage ...>
      <ContentPage.Resources>
          <Style TargetType="BoxView"
                 Class="Separator">
              <Setter Property="BackgroundColor"
                      Value="#CCCCCC" />
              <Setter Property="HeightRequest"
                      Value="1" />
          </Style>

          <Style TargetType="BoxView"
                 Class="Rounded">
              <Setter Property="BackgroundColor"
                      Value="#1FAECE" />
              <Setter Property="HorizontalOptions"
                      Value="Start" />
              <Setter Property="CornerRadius"
                      Value="10" />
          </Style>    

          <Style TargetType="BoxView"
                 Class="Circle">
              <Setter Property="BackgroundColor"
                      Value="#1FAECE" />
              <Setter Property="WidthRequest"
                      Value="100" />
              <Setter Property="HeightRequest"
                      Value="100" />
              <Setter Property="HorizontalOptions"
                      Value="Start" />
              <Setter Property="CornerRadius"
                      Value="50" />
          </Style>

          <Style TargetType="VisualElement"
                 Class="Rotated"
                 ApplyToDerivedTypes="true">
              <Setter Property="Rotation"
                      Value="45" />
          </Style>        
      </ContentPage.Resources>
  </ContentPage>
  ```

### Sử dụng Style với CSS:

* Hiện tại vẫn chưa support full cho CSS. 
* [Xem Thêm](https://docs.microsoft.com/en-us/xamarin/xamarin-forms/user-interface/styles/css/)

- - -

## Theming và cách sử dụng: