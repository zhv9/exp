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

## 常规API

### 浏览器操作

```python
driver.maximize_window() # 窗口最大化
driver.title # 获得窗口标题
driver.add_cookie({'name':'lang', 'value':'python'}) # 创建cookie
driver.get_cookie() # 获取cookie
driver.get_cookie(your_cookie) # 获取特定cookie
driver.delete_all_cookies() # 删除所有cookie
driver.delete_cookie(your_cookie) # 删除特定cookie
driver.save_screenshot(your_file_name) # 屏幕截图
```

### ActionChains

将一系列操作插入插入一个列队中，在最后使用perform()来执行列队中的所有命令。

一般在测试悬浮菜单，鼠标拖放等场景时，会经常用到。

```python
menu = driver.find_element_by_css_selector(".nav")
hidden_submenu = driver.find_element_by_css_selector(".nav#submenu1")

# 组合到一条来执行ActionChains
ActionChains(driver).move_to_element(menu).click(hidden_submenu).perform()

# 或者分解到多条来执行ActionChains
actions = ActionChains(driver)
actions.move_to_element(menu)
actions.click(hidden_submenu)
actions.perform()
```

### Alert

```python
Alert(driver).accept()
Alert(driver).dismiss()
name_prompt = Alert(driver)name_prompt.send_keys("aaa")name_prompt.accept()
```

### Desired Capabilities

用来连接Selenium Server或者Selenium Grid时来实例化WebDriver

```python
driver = webdriver.Remote(
    command_excutor="http://127.0.0.1:4444/wd/hub",
    desired_capabilities=DesiredCapabilities.CHROME)
)
```

Desired Capabilities也可以自定义或在已有的基础上更新(字典)对象部分值

```python
# 从头做
desired_caps = dict()
desired_caps["appPackage"] = "com.android.settings"
desired_caps["platformName"] = "Android"

# 基于已有定义

capabilities = DesiredCapabilities.FIREFOX.copy()
capabilities["platform"] = "WINDOWS"
capabilities["version"] = "10"
```

### Keys

引用Keys可以完成很多特殊键的输入，比如回车、Tab、F1~F12、方向键等。

```python
# 点击页面元素后，按Enter键
actionChains(driver).click(to_station_element).send_keys(Keys.ENTER).perform()
```

### Wait

有两种等待机制，显示等待和隐式等待

```python
# 显示等待需要设置等待条件和等待时间
wait = WebDriverWait(driver, 5)
element = wait.until(expected_)conditions.element_to_be_clickable((By.ID, "spnUid"))

# 隐式等待只需要设置等待时间
driver.implicitly_wait(5)
```

### execute_script

可以运行JavaScript脚本，比如获得当前的User Agent`driver.execute_script("return navigator.userAgent")`。

### switch_to

用来在父页面、子页面、弹出框之前切换，如果存在多个窗口可供切换，那么Driver是可以获取到这些窗口句柄的，否则会抛出异常。

`driver.switch_to.window(driver.window_handles[1])`
