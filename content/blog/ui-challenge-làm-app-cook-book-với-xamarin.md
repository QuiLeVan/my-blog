---
path: UI Challenge - Làm App Cook Book với Xamarin
date: 2020-07-29T07:25:35.004Z
title: UI Challenge - Làm App Cook Book với Xamarin
description: "Thực hành xây dựng app Cook Book với Xamarin Form "
---
Xây Dựng app theo design :

Design 1:

![](../assets/design-forms.jpg)

Design 2:

![](../assets/design.jpg)

Figma link: [here](https://www.figma.com/file/PR7CQoRfOGStg2c7qNWQCt/Cook-Book?node-id=0%3A1)

## Một số chú ý về design Cook Book :

* Thiết kế trên iphoneX/XS
* Sử dụng SafeArea trên iphoneX

  ```xml
  <ContentPage ...
            xmlns:ios="clr-namespace:Xamarin.Forms.PlatformConfiguration.iOSSpecific;assembly=Xamarin.Forms.Core"
            ios:Page.UseSafeArea="True"/>
  ```
* Color
* Dùng font từ resource

  * Import font.ttf & chuyển sang embed resource
  * File AssemblyInfo.cs thêm code

    ```csharp
    [assembly: ExportFont("Cooking.ttf")]
    ```
  * Trong file xaml sử dụng:

    ```xml
    <Span Text="{x:Static local:IconFont.favorite_outline}" FontFamily="Cooking" FontSize="24" />
    ```

## Tool sử dụng:

* <https://github.com/kphillpotts/XDtoXF>: tool export XD to Xaml.
* Sharpnado.MaterialFrame
* Xamarin.Forms.PancakeView ( [https://github.com/sthewissen/Xamarin.Forms.PancakeView/wiki/)](https://github.com/sthewissen/Xamarin.Forms.PancakeView/wiki/Shapes)
* FFImageLoading.Svg.Forms
* [https://www.sharpnado.com/materialframe-blur/ (](https://www.sharpnado.com/materialframe-blur/)[https://github.com/roubachof/Sharpnado.MaterialFrame)](https://github.com/roubachof/Sharpnado.MaterialFrame)
* Build font icon: <https://icomoon.io/app/#/select>

  <https://www.svgrepo.com/>

  Chuyển font sang code: <https://andreinitescu.github.io/IconFont2Code/>

## Các bước thực hiện:

1. #### Tạo project với VS
2. #### Config cho App:

a. Style Color 

Trong App.xaml file: thêm cấu hình <Color/>

```xml
<Application.Resources>

        <Color x:Key="close_button_textcolor">#8F8D8F</Color>
        <Color x:Key="close_button_background">#DDDFE0</Color>
        <Color x:Key="white">#FFFFFF</Color>
        <Color x:Key="details_title">#424951</Color>
        <!--<Color x:Key="">#FDF8D8</Color>-->
        <Color x:Key="description">#A4A6A8</Color>
        <Color x:Key="ingredient_list">#FAFBF8</Color>
        <Color x:Key="app_title">#4E3000</Color>
        <Color x:Key="ingredient_name">#6E6E6C</Color>
        <!--<Color x:Key="">#FBFBFB</Color>-->
        <Color x:Key="button_color">#966900</Color>
        <Color x:Key="main_yellow">#FDDB00</Color>

    </Application.Resources>
```

b. Cấu hình cho mainPage: 

* Build TopBar

  ```xml
  <Grid Padding="16">
              <Grid.RowDefinitions>
                  <RowDefinition Height="60"/>
                  <RowDefinition Height="*"/>
              </Grid.RowDefinitions>

              <Grid.ColumnDefinitions>
                  <ColumnDefinition Width="*"/>
                  <ColumnDefinition Width="36"/>
              </Grid.ColumnDefinitions>
          </Grid>
  ```
* Add Image topbar: data here

  ![](../assets/topshape.svg)
* Tạo thư mục `Resource` trong proj share để dùng chung
* Kéo image svg phía trên vào , phải chuột item chọn `build action -> embed resource`
* thêm nuget package : ffloadingimage.svg.form cho cả 3 (proj share/ ios/ android)
* Edit text Cook book : vị trí & font size ( [https://docs.microsoft.com/en-us/xamarin/xamarin-forms/user-interface/text/fonts)](https://docs.microsoft.com/en-us/xamarin/xamarin-forms/user-interface/text/fonts)

  ```xml
  <Label Text="Cook book" Margin="32,0,16,16" VerticalOptions="Center" VerticalTextAlignment="Center" TextColor="{StaticResource app_title}" FontFamily=".SFUIText-Semibold" FontSize="34" />
  ```
* Add ff image svg before label Cook book.

  ```xml
  <ff:SvgCachedImage Margin="0,-160,0,0" Source="resource://topshape.svg" HeightRequest="400" VerticalOptions="Start" Aspect="AspectFill" />
  ```

c. Cấu hình list view item với Collection View: ( data load về từ link: https://www.thewissen.io/pancakes.json)

* Xây dựng model pancake

  ```csharp
  public partial class Pancake
      {
          [JsonProperty("name")]
          public string Name { get; set; }

          [JsonProperty("origin")]
          public string Origin { get; set; }

          [JsonProperty("description")]
          public string Description { get; set; }

          [JsonProperty("imageUrl")]
          public Uri ImageUrl { get; set; }

          [JsonProperty("ingredients", NullValueHandling = NullValueHandling.Ignore)]
          public Ingredient[] Ingredients { get; set; }

          [JsonProperty("steps", NullValueHandling = NullValueHandling.Ignore)]
          public string[] Steps { get; set; }
      }

      public partial class Ingredient
      {
          [JsonProperty("uom")]
          public string Uom { get; set; }

          [JsonProperty("ingredient")]
          public string Name { get; set; }
      }
  ```
* Xây dựng phương thức load data.

  ```csharp
  public static class PancakeService
      {
          static HttpClient httpClient;
          static List<Pancake> pancakes;

          public static async Task<List<Pancake>> GetPancakes()
          {
              if (pancakes != null)
                  return pancakes;

              if (httpClient == null)
              {
                  httpClient = new HttpClient();
              }

              var result = await httpClient.GetAsync("https://www.thewissen.io/pancakes.json");
              var resultAsString = await result.Content.ReadAsStringAsync();

              return JsonConvert.DeserializeObject<List<Pancake>>(resultAsString);
          }
      }
  ```
* Update Collection View ( Full source)

  ```xml
  <Grid>

          <ff:SvgCachedImage Margin="0,-160,0,0" Source="resource://topshape.svg" HeightRequest="400" VerticalOptions="Start" Aspect="AspectFill" />

          <CollectionView ItemsSource="{Binding .}" SelectionMode="Single" SelectionChanged="CollectionView_SelectionChanged">
              <CollectionView.ItemsLayout>
                  <LinearItemsLayout ItemSpacing="20" Orientation="Vertical" />
              </CollectionView.ItemsLayout>
              <CollectionView.Header>
                  <Grid HeightRequest="120">
                      <Grid.ColumnDefinitions>
                          <ColumnDefinition Width="*"/>
                          <ColumnDefinition Width="Auto"/>
                      </Grid.ColumnDefinitions>

                      <Label x:Name="title" Margin="32,0,16,16" Text="Cook Book" VerticalOptions="End" VerticalTextAlignment="Center" TextColor="{StaticResource app_title}" FontFamily=".SFUIText-Semibold" FontSize="34" />

                      <Button x:Name="search" Grid.Column="1" Margin="0,0,32,16" FontFamily="Cooking" Text="{x:Static local:IconFont.search}" VerticalOptions="End" CornerRadius="20" HeightRequest="40" WidthRequest="40" FontSize="18" TextColor="{StaticResource app_title}" BackgroundColor="{StaticResource white}" />
                  </Grid>
              </CollectionView.Header>
              <CollectionView.ItemTemplate>
                  <DataTemplate>
                      <StackLayout Padding="16,0">
                          <yummy:PancakeView CornerRadius="20">
                              <yummy:PancakeView.Shadow>
                                  <yummy:DropShadow Color="#000000" Opacity="0.3" Offset="10,10" BlurRadius="10" />
                              </yummy:PancakeView.Shadow>

                              <Grid HeightRequest="480">
                                  <Grid.RowDefinitions>
                                      <RowDefinition Height="*" />
                                      <RowDefinition Height="80" />
                                  </Grid.RowDefinitions>

                                  <Image Source="{Binding ImageUrl}" Aspect="AspectFill" Grid.RowSpan="2" />

                                  <yummy:PancakeView Grid.Row="0" VerticalOptions="Start" HeightRequest="120">
                                      <yummy:PancakeView.BackgroundGradientStops>
                                          <yummy:GradientStopCollection>
                                              <yummy:GradientStop Color="#CC000000" Offset="0" />
                                              <yummy:GradientStop Color="Transparent" Offset="2" />
                                          </yummy:GradientStopCollection>
                                      </yummy:PancakeView.BackgroundGradientStops>
                                  </yummy:PancakeView>

                                  <Label Margin="16,16,0,0" FontSize="20" FontFamily=".SFUIText-Semibold" TextColor="{StaticResource white}">
                                      <Label.FormattedText>
                                          <FormattedString>
                                              <Span Text="{x:Static local:IconFont.favorite_outline}" FontFamily="Cooking" FontSize="24" />
                                              <Span Text=" 52" />
                                          </FormattedString>
                                      </Label.FormattedText>
                                  </Label>

                                  <sharpnado:MaterialFrame Grid.Row="1" CornerRadius="0" MaterialBlurStyle="Dark" MaterialTheme="AcrylicBlur" />

                                  <Label Grid.Row="1" Margin="20" VerticalOptions="Center" Text="{Binding Name}" FontSize="28" FontFamily=".SFUIText-Semibold" TextColor="{StaticResource white}" />
                              </Grid>

                          </yummy:PancakeView>
                      </StackLayout>
                  </DataTemplate>
              </CollectionView.ItemTemplate>
          </CollectionView>
      </Grid>
  ```

  Code behind:

  ```csharp
  public partial class MainPage : ContentPage
      {
          public MainPage()
          {
              InitializeComponent();
          }

          protected async override void OnAppearing()
          {
              base.OnAppearing();

              BindingContext = await PancakeService.GetPancakes();
          }

          async void CollectionView_SelectionChanged(System.Object sender, Xamarin.Forms.SelectionChangedEventArgs e)
          {
              var selectedItem = e.CurrentSelection.FirstOrDefault();

              if (selectedItem != null)
              {
                  //await Navigation.PushAsync(new DetailPage(selectedItem as Pancake));
              }
          }
      }
  ```

#### 3. Build Detail Page:

> Sẽ Cập Nhật Sau...