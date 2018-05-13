# Selenium自动化测试

## 元素定位

- 当页面存在Id的时候，尽量使用id来定位元素，因为id具有唯一性。
- 只有在少数元素不好定位的情况下，选择XPath或cssSelector。
- 也可以执行JavaScript来操作元素。

```java
<div id="bgDiv">...</div>
<input name="input_name" type="text">
<div class="test_class"><span>Testclass</span></div><div class="test_class"><span>Guoda</span></div>
<iframe src="xxx"></frame>
<a href="https://cn.bing.com">searchInBing</a>
<a href="https://cn.bing.com">search In Bing</a>
<div id="food"><span class="dairy">milk</span><span class="dairy aged">cheese</span></div>

<input type="text" name="example" />
<input type="text" name="other" />

WebElement element = driver.findElement(By.id("bgDiv"));
WebElement element = driver.findElement(By.name("input_name"));
WebElement element = driver.findElement(By.className("test_class"));
WebElement element = driver.findElement(By.tagName("iframe"));
WebElement element = driver.findElement(By.linkText("searchInBing"));
WebElement element = driver.findElement(By.partialLinkText("Bing"));
WebElement element = driver.findElement(By.cssSelector("#food span.dairy.aged"));
WebElement element = driver.findElement(By.xpath("//input"));
```

## 基本测试场景

```java
public class TestBing{
    private WebDriver driver;
    private String baseUrl;

    @Before
    public void setUp() throws Exception{
        driver = new FireFoxDriver();
        baseUrl = "https://cn.bing.com/";
    }
    @Test
    public void testBing() throws Exception{
        driver.get(baseUrl);
        Thread.sleep(2000);
        driver.findElement(By.id("sb_from_q")).sendKeys("WebDriver");
        driver.findElement(By.id("sb_from_go")).click();
    }
    @After
    public void tearDown() throws Exception{
        driver.quit();
    }
}
```

### 显式等待

提供了明确的等待条件，若条件满足，则不再等待

```java
WebElement searchElement = (new WebDriverWait(driver, 10)).until(
    new ExpectedCondition)<WebElement>(){
    publice WebElement apply(WebDriver wd){
        return wd.findElement(By.id("sb_from_q"));
    }
});

searchElement.clear();
```

### 隐式等待

没有明确设定在何时开始等待，相当于设置了全局范围的等待

```java
    @Before
    public void setUp() throws Exception{
        driver = new FireFoxDriver();
        baseUrl = "https://cn.bing.com/";
        driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
    }
```

## Selenium Grid

> 分布式测试执行工具
> 由一个Hub节点和若干个Node组成，Hub用来管理Node的状态，并接受远程客户端代码的调用请求，再把请求命令转发给Node执行。

### 启动Hub和Node

```shell
# 启动Hub，可以指定端口
java -jar selenium-server-standalone-x.xx.x.jar -role hub

# 启动Node，需要根据hub注册地址进行注册，然后指定node的端口
java -jar selenium-server-standalone-x.xx.x.jar -role node -hub http://<hub_ip>:4444/grid/register -port 4000
```

### 查看Selenium Grid状态

通过Hub的Console页面`http://<hub_ip>:4444/grid/console`就可以查看当前Selenium Grid的状态。

页面中可以查看所有Node的注册信息。

### 调用Selenium Grid

```java
public class TestGrid{
    private String baseUrl;
    @Test
    public void testGrid() throws Exception{
        baseUrl = "https://cn.bing.com";
        DesiredCapabilities capability = new DesiredCapabilities();
        capability.setBrowserName("firefox");
        capability.setPlatform(Platform.VISTA);
        WebDriver driver = null;
        try{
            driver = new RemoteWebDriver(
                new URL("http://192.168.1.111:4000/wd/hub"),
                capability);
        }
        catch(NalformedURLException e){
            e.printStackTrace();
        }

        driver.get(base.Url);

        WebElement searchElement = (new WebDriverWait(driver, 10)).until(new ExpectedCondition<WebElement>(){
            public WebElement apply(WebDriver wd){
                return wd.findElement(By.id("sb_from_q"));
            }
        });

        searchElement.clear();
        searchElement.sendKeys("WebDriver");
        driver.findElement(By.id("sb_form_go")).click();

        driver.quit();
    }
}
```

## 创建不同的Driver对象

### 创建Driver对象

```python
from selenium import webdriver
# Firefox
driver = webdriver.Firefox()

# Chrome, Ie, Edge
driver = webdriver.Chrome("/path/to/chromedriver")
driver = webdriver.Ie("path_IEDriverServer.exe")
driver = webdriver.Edge("path_MicrosoftWebDriver.exe")

# opera
webdriver_service = service.Service("path/to/poeradriver")
webdriver_service.start()
driver = webdriver.Remote(webdriver_service.service_url, webdriver.DesiredCapabilities.OPERA)
```

### 加载非默认配置信息

默认情况下Cookies、历史信息、或用户在本地浏览器中的配置等信息不会加载，如果需要加载的话，需要提前声明FirefoxProfile，所有配置可以参考

> <http://kb.mozillazine.org/about:config_entries>
>
> <https://support.mozilla.org/en-US/products/firefox/customize/firefox-options-preferences-and-settings>

```python
improt os
from selenium import webdriver
fp = webdriver.FirefoxProfile()
fp.set_preference("browser.download.folderList", 2)
fp.set_preference("browser.download.manager.showWhenStarting", False)
fp.set_preference("browser.download.dir", os.getcwd())
fp.set_preference("browser.helperApps.neverAsk.saveToDisk", "application/octet-stream")
driver = webdriver.Firefox(fire_foxprofile=fp)
```

### Headless 浏览器

Hedless浏览器是没有图形界面的浏览器，可以提高脚本运行速度，也称为GUI-Less浏览器。一般有两种：HtmlUnit和PhantomJS

- HtmlUnit使用java开发，JavaScript引擎是Rhino，这个引擎没有广泛支持，所以可能会与主流浏览器处理结果有差异。
- PhantomJS使用的Javascript引擎是Webkit，与Chrome、safari的相同，所以更接近于真实浏览器行为。

> PhantomJS配置参数可以参考 <http://phantomjs.org/api/command-line.html>

```python
driver = webdriver.PhantomJS(executable_path="path/to/phantomjsdriver")

# 配置参数(忽略已过期或自定义证书SSL错误)
driver = webdriver.PhantomJS(service_args=["--ignore-ssl-errors=true"])
```

建议：

- 如果需要对Web页面元素的显示或样式等做大量校验，那么就不要使用PhantomJS
- 如果使用Headliss浏览器做GUI测试，那么在页面操作的关键之处保存截图
