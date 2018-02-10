# 使用gitea发布版本

## 预发布和测试

### 检出到Release分支

![创建release分支(也可以不用)](./img/release-1.创建release分支(也可以不用).png)

### 测试和解决问题

![对release分支提交修改内容](./img/release-2.对release分支提交修改内容.png)

### 提交到服务器(也可以合并到master分支中)

将release分支提交到服务器后，就可以通过这个分支来建立一个标签了。

也可以在本地也可以建立标签后直接将标签提交到服务器，但是这种方法在服务器上能显示的信息就比较少了，并且不能将构建好的软件也加入发布连接中，所以不用这种方式。

![推送release分支到服务器(也可以合并回master)](./img/release-3.推送release分支到服务器(也可以合并回master).png)

## 正式发布版本

使用版本发布页面的“发布版本”功能。

![进入版本发布页面](./img/release-4.进入版本发布页面.png)

### 通过release分支创建版本发布

上面的是标签名称，名称根据版本规则填写即可。下面的是版本信息，在内容时，建议在填写变更记录。

![填写发布内容](./img/release-5.填写发布内容.png)


### 通过release发布的结果

通过release分支发布版本的坏处在于，以后这个分支基本不动，所以最新代码有任何改动，这个版本信息中是无法查看的。

![发布后的状态](./img/release-6.发布后的状态.png)


### 通过master分支创建版本发布

通过master分支发布版本的好处在于以后提交内容到master后，在这个发布版本上就能看的有多少内容在该版本发布后提交到master了。

![基于master分支创建发布版本](./img/release-7.基于master分支创建发布版本.png)


### 通过master发布的结果

![使用master分支的版本的情况](./img/release-8.使用master分支的版本的情况.png)