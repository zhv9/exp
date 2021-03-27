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

### 可能会遇到的异常

#### NoSuchElementException

- 元素定位方式有误，可能是页面源码有改动，元素属性值发生了改变。
- 元素还在不可用的状态下，在这种状态下，如果尝试获取该元素，就会报错。
- 在执行过程中突然出现了弹窗，影响了对之前页面的操作。

#### ElementNotVisibleException

要确认这个元素是不是在隐藏域中

#### StaleElementReferenceException

元素的引用不是最新的：某些操作后，导致DOM重新构建了，而最初创建的引用就无法在测试脚本中继续使用了。

可以用显式等待的方法，等元素过时之后，再重新find方法建立引用。

## Page Object

把页面作为类的对象来维护，将各个页面的元素操作与访问方式抽离出来，即分解成元素的**操作类**与元素的**访问类**。

下面示例将测试分为测试用例，测试页面，页面元素三部分。

```python
# 对页面中的元素进行定位
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
class HomePage_Element(object):
    txt_query = (By.NAME, "q")
class SearchPage_Element(object):
    btn_search = (By.XPATH, "/html/body/div[4]/div[1]/div[1]/div/form/div[2]/div[2]/button")
    menu_select = ()
    menu_item_most_stars = ()
```

```python
from PageElements import HomePage_Element
# 从PageElement中获取元素对象，并封装操作，如也可以考虑直接封装好操作类，然后在这里使用操作类完成一些具体的操作。
class BasePage(object):
    def __init__(self, driver):
        self.driver = driver
class HomePage(BasePage):
    """Home page action methods come here. I.e. Python.org"""
    def is_title_matches(self):
        """Verifies that the hardcoded text "Python" appears in page title"""
        return "GitHub" in self.driver.title
    def enter_query_txt(self, value):
        """Triggers the search"""
        element = self.driver.find_element(HomePage_Element.HomePage_Element.txt_query)
        element.send_keys(value)
```

```python
import unittest
from selenium import webdriver
import page
# 测试方法，调用page中的各个方法来执行各项操作
class GitHubSearch(unittest.TestCase):
    """A sample test class to show how page object works"""
    def setUp(self):
        self.driver = webdriver.Firefox()
        self.driver.get("https://github.com/")
    def test_search_in_python_org(self):
        #Load the home page. In this case the home page of github.com.
        home_page = page.HomePage(self.driver)
        #Checks if the word "GitHub" is in title
        assert home_page.is_title_matches(), "github.com title doesn't match."
        #Sets the text of search textbox to "microsoft"
        home_page.enter_query_txt('microsoft')
        # search_results_page = page.SearchResultsPage(self.driver)
        # #Verifies that the results page is not empty
        # assert search_results_page.is_results_found(), "No results found."
    def tearDown(self):
        self.driver.close()
```

## 自动化框架

### 线性脚本

直接录制的就是一种线性脚本，这种脚本没有将业务、数据和脚本分离。方法没有重用，全部都在一起，这种脚本不利于维护。

### 模块化框架

把一些常用的方法封装起来，以达到重用的效果。比如登录的“输入用户名=>输入密码=>点登录键”是经常用到的功能，因此将这些操作封装到一个模块中，就可以在多个脚本中使用。

> 优点：
> - 相同模块，方法可以重用
> - 开发效率较高
> - 脚本容易维护

---
> 缺点：
> - 需要花时间分析出可重用的部分
> - 数据和脚本没有分离，依然是hard code(简单情况下)
> - 对脚本开发人和维护人员要求较高

### 数据驱动框架

对于模块化框架中最大的问题在于没有将数据和代码分离，这就会导致如果脚本中仅仅是数据不一样，也需要用多个脚本来完成，这样并不符合重用的原则。

数据驱动框架就是来解决代码和数据分离的问题的，数据单独存放，用数据来驱动测试脚本。

> 优点：
> - 测试数据仅数值变化时无需修改脚本。
> - 脚本数据分离，可分开维护。

---
> 缺点：
> - 需要花更多时间定义如何分离和存取测试数据
> - 对脚本开发和维护人员要求较高

### 关键字驱动框架

这种框架需要根据测试用例定义关键字，并使其与相应的操作或功能关联起来。在用例中书写对应的关键字，在执行过程中根据对应关键字执行相应的操作。

这种方法的优缺点和数据驱动框架基本类似，但是还有一个优点：

> 将测试脚本和测试代码分开，脚本可以由完全不懂开发的人进行编写，测试代码由专门的开发人员开发。

### 混合框架

在实际自动化测试时，一般会使用混合的方案，包含了模块化、数据驱动和关键字驱动。包含以下几个部分

- WebDriver
    - 选择和执行浏览器驱动
- PageObject
    - BasePage：所有页面中都要用到的操作或数据
    - Locator：各个页面每个元素的定位
    - Action：各个页面的基本操作和数据获取
- Feature
    - 使用Cucumber框架写的用户故事
    - 故事中可以包含“数据驱动”的部分，在一个场景中使用多组数据
- StepDefination
    - 映射用户故事中的各个步骤和断言
    - 执行PageObject中的元素和操作