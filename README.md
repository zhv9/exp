# 开发管理

- 工作流程和方法
  - 参照[软件开发工作指南](dev_management/engineering.md)对开发的工作进行规范，涉及工作流程，工作方法，代码规范，工作完成定义和项目状况确认这几个方面。
- 提交commit
  - 在提交每个commit的时候，根据[Commit信息编写指南](./tools/Git/Commit信息编写指南.md)填写commit信息**Angular规范**，以便在发布版本的时候，利用commit信息自动生成ChangeLog。
- 代码审查
  - 可以参考[代码审查指南](https://www.codeproject.com/Articles/524235/Codeplusreviewplusguidelines)中的方法进行审查。
  - 或参考[CodeReview](dev_management/CodeReview.md)
- 版本发布
  - [版本发布指南](./tools/Git/release.md)

# 开发相关

## 开发基础知识

1. [设计模式(C#)](./dev_basic/DesignPattern/设计模式.md)
2. [DDD贫血模型和充血模型](dev_basic/DesignPattern/OOP/DDD贫血模型和充血模型.md)
3. [数据结构与算法](dev_basic/DSA)

## 软件开发及库的使用

1. [EntityFramework基础(C#)](./develop/EntityFramework)
   1. [EntityFramework教程](develop/EntityFramework/EntityFramework教程.md)
   2. [EntityFramework关联、存储过程和更新数据库](develop/EntityFramework/EntityFramework关联、存储过程和更新数据库.md)
   3. [EntityFramework高级功能](develop/EntityFramework/EntityFramework高级功能.md)
   4. [EntityFramework测试](develop/EntityFramework/EntityFramework测试.md)
   5. [EntityFramework培训.pptx](develop/EntityFramework/EntityFramework培训.pptx)
2. [Node.js](./develop/Node.js)
3. [React](./develop/React)
   1. [react](develop/React/react.md)
   2. [redux](develop/React/redux.md)
   3. [react hooks](develop/React/react_hooks.md)
   4. [react test](develop/React/react_test.md)
4. [VSCode 插件开发](./develop/VSCodeExtension)
   1. [VSCode结构](develop/VSCodeExtension/1.VSCode结构.md)
   2. [插件能做什么](develop/VSCodeExtension/2.插件能做什么.md)
   3. [插件HelloWorld](develop/VSCodeExtension/3.插件HelloWorld.md)
   4. [主要配置和API](develop/VSCodeExtension/4.主要配置和API.md)
   5. [webView](develop/VSCodeExtension/5.webView.md)

## 测试

1. [Jmeter使用方法培训-webservice性能测试.pptx](testing/Jmeter使用方法培训-webservice性能测试.pptx)
2. [Selenium 自动化测试](testing/SeleniumAutoTesting.md)
3. [单元测试方法(C#)](./testing/UnitTest)

## 编程语言

1. [Java(only code no docs)](ProgramLanguage/Java)
2. [Typescript](ProgramLanguage/TypeScript)
3. [Rust](ProgramLanguage/Rust/readme.md)

## 工具使用

1. [Git 的一些技巧](tools/Git)
   - [Gitlab使用流程和工作流程(参考ppt)](tools/Git/Gitlab使用流程和工作流程.pptx)
   - [解决git换行问题](tools/Git/解决git换行问题.md)
   - [Commit信息编写指南](tools/Git/Commit信息编写指南.md)
   - [从其他分支合并特定commit](tools/Git/从其他分支合并特定commit.md)
   - [Git多项目代码合并](tools/Git/Git多项目代码合并.md)
   - [合并SVN修改内容](tools/Git/合并SVN修改内容.md)
   - [合并代码库](tools/Git/合并代码库.md)
   - [撤销提交](tools/Git/撤销提交.md)
   - [版本发布指南](tools/Git/release.md)

## 脚本

1. [gitea查询SQL](scripts/gitea查询SQL.sql)
2. [C# 工程修改版本号脚本](scripts/MakeReleaseVersion.sh)

## 编写文档

Markdown格式填写Issue(工单): git管理系统中可以使用Markdown格式编写内容，方法参考:[Markdown编写指南](./DocWriting/markdown-guide.md)

ISSUE_TEMPLATE.md: 为了在填写工单的时候，有参考信息，可以在项目根目录放置 [ISSUE_TEMPLATE.md](./DocWriting/ISSUE_TEMPLATE.md) 文件，这样就能在工单(issue)中显示相应的提示信息。
