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
* Implicit Styles
* Global Styles
* Style Inheritance
* Dynamic Styles
* Device Styles
* Style Classes

### Sử dụng Style với CSS:

* Hiện tại vẫn chưa support full cho CSS. 
* [Xem Thêm](https://docs.microsoft.com/en-us/xamarin/xamarin-forms/user-interface/styles/css/)

- - -

## Theming và cách sử dụng: