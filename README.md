## 工作方法指南

- 工作流程和方法
  - 参照[软件开发工作指南](./manage/engineering.md)对开发的工作进行规范，涉及工作流程，工作方法，代码规范，工作完成定义和项目状况确认这几个方面。
- 提交commit
  - 在提交每个commit的时候，根据[Commit信息编写指南](./Git/Commit信息编写指南.md)填写commit信息**Angular规范**，以便在发布版本的时候，利用commit信息自动生成ChangeLog。
- 代码审查，可以参考[代码审查指南](https://www.codeproject.com/Articles/524235/Codeplusreviewplusguidelines)中的方法进行审查。
- 版本发布
  - [版本发布指南](./Git/release.md)

## 开发相关

### EntityFramework
> [EntityFramework基础教程](./EntityFramework)
  1. [EntityFramework教程](./EntityFramework/EntityFramework教程.md)
  2. [EntityFramework关联、存储过程和更新数据库](./EntityFramework/EntityFramework关联、存储过程和更新数据库.md)
  3. [EntityFramework高级功能](./EntityFramework/EntityFramework高级功能.md)
  4. [EntityFramework测试](./EntityFramework/EntityFramework测试.md)
  5. [EntityFramework培训.pptx](./EntityFramework/EntityFramework培训.pptx)

### 单元测试
> [单元测试方法](./UnitTest)

### CodeReview
> [CodeReview](./CodeReview/CodeReview.md)

### 设计模式
> [设计模式](./DesignPattern/设计模式.md)

## 工具使用

### Git

#### Git管理程序的使用

Markdown格式填写Issue(工单): git管理系统中可以使用Markdown格式编写内容，方法参考:[Markdown编写指南](./DocWriting/markdown-guide.md)

ISSUE_TEMPLATE.md: 为了在填写工单的时候，有参考信息，可以在项目根目录放置 [ISSUE_TEMPLATE.md](./DocWriting/ISSUE_TEMPLATE.md) 文件，这样就能在工单(issue)中显示相应的提示信息。

#### Git实践方法

- [Gitlab使用流程和工作流程(参考ppt)](./Git/Gitlab使用流程和工作流程.pptx)
- [解决git换行问题](./Git/解决git换行问题.md)
- [Commit信息编写指南](./Git/Commit信息编写指南.md)
- [从其他分支合并特定commit](./Git/从其他分支合并特定commit.md)
- [Git多项目代码合并](./Git/Git多项目代码合并.md)
- [合并SVN修改内容](./Git/合并SVN修改内容.md)
- [合并代码库](./Git/合并代码库.md)
- [撤销提交](./Git/撤销提交.md)
- [版本发布指南](./Git/release.md)