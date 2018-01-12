## 安装git时选择check out as-is commit as-is
![安装Git时选择不自动改变换行](./img/Git换行问题-1.安装Git时选择不自动改变换行.png)

## 已经安装过的和服务器修改config文件
![服务器设置不自动改变换行符](./img/Git换行问题-2.服务器设置不自动改变换行符.png)

## 修改git代码库属性文件(.attribute)

\* text=auto # 按照系统的设置来换行

\* text eol=crlf # 所有的换行改为/r/n

\* text eol=lf # 所有的换行改为/n

![去掉text自动改换行的属性](./img/Git换行问题-3.去掉text自动改换行的属性.png)
