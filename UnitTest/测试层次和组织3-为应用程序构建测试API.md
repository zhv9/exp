# 为应用程序构建测试API

## 重构测试代码：
需要用到的技术：
* 在测试类中使用**继承**，使代码可重用
* 创建测试工具类和方法
* 将API介绍给开发使用

## 使用测试类继承模式
通过实现基类来实现如下内容：
* 重用工具和工厂方法
* 在不同的类上运行同一组测试
* 使用**通用**的setup和teardown代码
* 为派生基类的编程人员提供测试指导

> **三种测试类继承的模式**
> * 抽象测试基础结构类
> * 测试类模版
> * 抽象测试驱动类

> **要用到的重构技术**
> * 重构类层次
> * 使用泛型

## 抽象测试基础结构类模式
1. 要包含通用的基础结构；
2. 通用的setup和teardown代码；
3. 多个测试类中使用的一些特殊断言；
4. 其他类派生这个基类。


### 不遵循DRY原则的测试类示例
代码中包含以下内容：
* LogAnalyzer类和方法：需要测试的类和方法
* LoggingFacility类：使用了Logger
* ConfigurationManager类：也使用了LoggingFacility，需要测试
* LogAnalyzerTests类和方法
* ConfigurationManagerTests

被测试类：

```
public interface ILogger
{
    void Log(string text);
}

public static class LoggingFacility
{
    public static void Log(string text)
    {
        Logger.Log(text);
    }

    private static ILogger logger;

    public static ILogger Logger
    {
        get { return logger; }
        set { logger = value; }
    }
}

public class LogAnalyzer
{
    public void Analyze(string fileName)
    {
        if (fileName.Length < 8)
        {
            LoggingFacility.Log("File Name too short:" + fileName);
        }
    }
}

public class ConfigurationManager
{
    public bool IsConfiguerd(string configName)
    {
        LoggingFacility.Log("checking" + configName);
        return true; //result;
    }
}
```
测试类：

```
[TestFixture]
public class LogAnalyzerNotDryTests
{
    [Test]
    public void Analyze_EmptyFile_ThrowException()
    {
        LogAnalyzer la =new LogAnalyzer();
        la.Analyze("myemptyfile.txt");
        //测试的其余部分
    }

    [TearDown]
    public void TearDown()
    {
        LoggingFacility.Logger = null;
    }
}

[TestFixture]
public class ConfigurationManagerTests
{
    [Test]
    public void Analyze_EmptyFile_ThrowException()
    {
        ConfigurationManager cm = new ConfigurationManager();
        bool configured = cm.IsConfiguerd("something");
        //方法的其他部分
    }

    [TearDown]//这个TearDown和上面一个的一样，所以可以进行重构，放入测试基类中
    public void TearDown()
    {
        LoggingFacility.Logger = null;
    }
}
```

