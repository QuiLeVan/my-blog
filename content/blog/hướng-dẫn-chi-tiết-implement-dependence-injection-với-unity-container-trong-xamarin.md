---
path: Hướng dẫn chi tiết implement Dependence Injection với Unity Container
  trong Xamarin
date: 2020-07-30T08:20:34.717Z
title: Hướng dẫn chi tiết implement Dependence Injection với Unity Container
  trong Xamarin
description: Chi tiết cách thức implement DI với Unity Container.
---
Để hiểu được bài này thì phải nắm được thế nào là [Dependence Injection](https://blog.quilv.com/blog/dependency-injection-trong-net/) (DI). Nếu chưa nắm được thì đọc [ở đây](https://blog.quilv.com/blog/dependency-injection-trong-net/).

## **Ví dụ đơn giản để hiểu cách sử dụng Dependence Injection :**

### Thiết kế ứng dụng load danh sách Product gồm 2 thông tin:

* Name
* Price

Xây dựng theo mô hình MVVM: 

* Models: Product chứa 2 thông tin Name & Price
* Views: ProductsPage : show thông tin bao gồm name & price của list Products trong listview.
* ViewModels: ProductsViewModel: chứa list Products được load từ 1 server thông qua 1 Service Class. ( ProductsService)

Yêu cầu sử dụng Dependence Injection để giảm sự liên kết cứng giữa ProductsViewModel & Service (ProductsService) để có thể sử dụng Unit Test.

![](../assets/screen-shot-2020-07-30-at-15.48.33.png)



### Trong trường hợp không sử dụng DI, thì các class được cấu hình như sau:

![](../assets/screen-shot-2020-07-30-at-16.08.36.png)

Với các Class:

```csharp
//Product
public class Product
{
    public string Name { get; set; }
    public double Price { get; set; }
    public override string ToString()
    {
        return $"{Name} : {Price} USD";
    }
}

//Interface
public interface IProductsService
{
    IEnumerable<Product> Getproducts();
}

//Service Load Test Data
public class ProductsService: IProductsService
{
    public ProductsService()
    {
    }

    public IEnumerable<Product> Getproducts()
    {
        return new List<Product> {
            new Product { Name = "Food 1", Price = 5 },
            new Product { Name = "Food 2", Price = 12 },
        };
    }
}

// ViewsModel
public class ProductsViewModel
{
    public IEnumerable<Product> Products { get; set; }
    public ProductsViewModel()
    {
        var productsService = new ProductsService();
        Products = productsService.Getproducts();
    }
}
```

Như trên, thì ta thấy sự liên kết cứng giữa ProductsViewModel & ProductService. Nếu trường hợp ProductService do bên thứ 3 cung cấp & họ bỏ phương thức khởi tạo ko có tham số, nếu như trong code chúng ta có rất nhiều chỗ implement phương thức khởi tạo đó, thì chúng ta phải thay đổi lại hết. Và cái này liên kết cứng nên chúng ta không thể viết Unit Test cho trường hợp này được.



## Tiến hành implement DI với Unity Container trong Xamarin.

1. Thay code của lớp ProductsViewModel như sau:

```csharp
public class ProductsViewModel
    {
        private readonly IProductsService _productsService;

        public IEnumerable<Product> Products { get; set; }


        public ProductsViewModel(IProductsService productsService)
        {
            _productsService = productsService; //new ProductsService();

            DownloadProduct();
        }

        void DownloadProduct() {
            Products = _productsService.Getproducts();
        }
    }
```

2. Add Nudget sau:

* Unity
* Unity.ServiceLocation
* CommonServiceLocator

3. Thay đổi code-behind của App.xaml:

```csharp
public partial class App : Application
    {
        public App()
        {
            InitializeComponent();

            //Init UnityContainer
            UnityContainer unityContainer = new UnityContainer();
            unityContainer.RegisterType<IProductsService, ProductsService>();

            var unityServiceLocator = new UnityServiceLocator(unityContainer);
            ServiceLocator.SetLocatorProvider(() => unityServiceLocator);

            MainPage = new ProductsPage();
        }

        protected override void OnStart()
        {
        }

        protected override void OnSleep()
        {
        }

        protected override void OnResume()
        {
        }
    }
```



> Khi đối tượng của ProductViewModel được tạo, và nó yêu cầu truyền đối tượng IProductsService, và đối tượng này được tự động tạo ra từ ServiceLocator từ Unity Container. 

Lúc này khi khởi chạy sẽ sinh 1 lỗi: không tìm thấy default constructor của class ProductViewModel, vì ProductsPage.xaml đang binding tới.

```xml
<ContentPage.BindingContext>
    <viewModels:ProductsViewModel/>
</ContentPage.BindingContext>
```

Để giải quyết vấn đề này thì có 2 cách để xử lý:

***Cách 1: Chuyển BindingContext vào code behind để xử lý.***

```csharp
public partial class ProductsPage : ContentPage
{
    public ProductsPage()
    {
        InitializeComponent();

        BindingContext = ServiceLocator.Current.GetInstance<ProductsViewModel>();
    }
}
```