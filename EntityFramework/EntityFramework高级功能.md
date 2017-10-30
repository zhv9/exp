# 关闭 Automatic Detect Changes
如果需要提升性能可以考虑关闭 Automatic Detect Changes，一般来讲使用以下方法的时候会影响 Automatic Detect Changes：
- DbSet.Find
- DbSet.Local
- DbSet.Remove
- DbSet.Add
- DbSet.Attach
- DbContext.SaveChanges
- DbContext.GetValidationErrors
- DbContext.Entry
- DbChangeTracker.Entries
用以下代码来关闭AutoDetectChanges：

```
using (var context = new BloggingContext()) 
{ 
    try 
    { 
        context.Configuration.AutoDetectChangesEnabled = false; 
 
        // Make many calls in a loop 
        foreach (var blog in aLotOfBlogs) 
        { 
            context.Blogs.Add(blog); 
        } 
    } 
    finally 
    { 
        context.Configuration.AutoDetectChangesEnabled = true; 
    } 
}
```
一定不要忘记打开AutoDetectChanges，所以用try-finally。

# Config File Settings
## DatabaseLogger interceptor
用来拦截对数据库的操作，并记录到文件中的，便于查找问题。

```
<interceptors> 
  <interceptor type="System.Data.Entity.Infrastructure.Interception.DatabaseLogger, EntityFramework"> 
    <parameters> 
      <parameter value="C:\Temp\LogOutput.txt"/> 
      <--!下面这个是为了避免每次开软件都覆盖前一次的记录而加的-->
      <parameter value="true" type="System.Boolean"/> 
    </parameters> 
  </interceptor> 
</interceptors>
```


