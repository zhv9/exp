# 目录
1. 三类实体与数据库映射的方法
2. 整体介绍
   1. CodeFirst主要实体类介绍
   2. 连接字符串
   3. 数据读取和使用方法
3. 映射
   1. DbContex类
   2. DbSet属性
   2. OnModelCreating方法
   3. Data Annotation和Fluent API介绍
   4. 继承EntityTypeConfiguration<EntityType>并添加映射代码
4. 字段属性配置


# 三类实体与数据库的映射方法
分别是：
* DB First--通过从数据库导入来构建实体
* Model First--使用模型设计工具设计模型，然后生成相关实体
* Code First--通过编制代码来映射实体和数据库

# 整体介绍
## Code First主要实体类介绍
Code First是通过编制代码来实现，其中有几个重要的类和方法：
### DbContext类
主要是负责与数据库进行通信，管理实体到数据库的映射模型，跟踪实体的更改（正如这个类名字Context所示，其维护了一个EF内存中容器，保存所有被加载的实体并**跟踪其状态**）。关于模型映射和更改跟踪下面都有专门的小节来讨论。

DbContext中最常用的几个方法如：

* SaveChanges(和异步方法SaveChangesAsync)：用于将实体的修改保存到数据库。

* Set<T>：获取实体相应的DbSet对象，我们对实体的增删改查操作都是通过这个对象来进行的。

还有几个次常用但很重要的属性方法：

* Database属性：一个数据库对象的表示，通过其SqlQuery、ExecuteSqlCommand等方法可以直接执行一些Sql语句或SqlCommand；还可以通过Database对象控制事务。

* Entry：获取EF Context中的实体的状态，在更改跟踪一节会讨论其作用。

* ChangeTracker：返回一个DbChangeTracker对象，通过这个对象的Entries属性，我们可以查询EF Context中所有缓存的实体的状态。

方法 | 作用
---|---
SaveChanges(和异步方法SaveChangesAsync)| 用于将实体的修改保存到数据库。
Set<T> | 获取实体相应的DbSet对象，我们对实体的增删改查操作都是通过这个对象来进行的。

还有几个次常用但很重要的属性方法：


方法 | 作用
---|---
Database属性 | 一个数据库对象的表示，通过其SqlQuery、ExecuteSqlCommand等方法可以直接执行一些Sql语句或SqlCommand；还可以通过Database对象控制事务。
Entry | 获取EF Context中的实体的状态，在更改跟踪一节会讨论其作用。
ChangeTracker | 返回一个DbChangeTracker对象，通过这个对象的Entries属性，我们可以查询EF Context中所有缓存的实体的状态。

### DbSet类
这个类的对象正是通过刚刚提到的Set<T>方法获取的对象。其中的方法都与操作实体有关，如：

* Find/FindAsync：按主键获取一个实体，首先在EF Context中查找是否有被缓存过的实体，如果查找不到再去数据库查找，如果数据库中存在则缓存到EF Context并返回，否则返回null。

* Attach：将一个已存在于数据库中的对象添加到EF Context中，实体状态被标记为Unchanged。对于已有相同key的对象存在于EF Context的情况，如果这个已存在对象状态为Unchanged则不进行任何操作，否则将其状态更改为Unchanged。

* Add：将一个已存在于数据库中的对象添加到EF Context中，实体状态被标记为Added。对于已有相同key的对象存在于EF Context且状态为Added则不进行任何操作。

* Remove：将一个已存在于EF Context中的对象标记为Deleted，当SaveChanges时，这个对象对应的数据库条目被删除。注意，调用此方法需要对象已经存在于EF Context。

* Include：详见下面预加载一节。

* AsNoTracking：详见变更跟踪一节。

* Local属性：用来跟踪所有EF Context中状态为Added，Modified、Unchanged的实体。作用好像不是太大。没怎么用过。

* Create：这个方法至今好像没有用到过，不知道干啥的。

## 连接字符串
使用Code First时，在app.config的 **<connectionStrings>** 中添加下面代码。在有某个特定的数据库文件时用下面这个写法：
```
<configuration> 
  <connectionStrings> 
    <add name="BloggingCompactDatabase" 
         providerName="System.Data.SqlServerCe.4.0" 
         connectionString="Data Source=Blogging.sdf"/> 
  </connectionStrings> 
</configuration>
```
使用SqlServer时使用以下代码：


```
<configuration> 
  <connectionStrings> 
    <add name="BlogModel"
         connectionString="Data Source=AMETHYST\SQLEXPRESS;
         Initial Catalog=Test;
         Integrated Security=True;
         Pooling=False"
         providerName="System.Data.SqlClient"/>
  </connectionStrings> 
</configuration>

```
使用本地数据库时使用以下代码：


```
<configuration> 
  <connectionStrings> 
        <add name="BlogModel"
        connectionString="data source=(LocalDb)\MSSQLLocalDB;
        initial catalog=ConsoleTryCode.BlogModel;
        integrated security=True;
        MultipleActiveResultSets=True;
        App=EntityFramework"
        providerName="System.Data.SqlClient" />
  </connectionStrings> 
</configuration>

```


## 数据读取和使用方法
对于以下两个实体类Blog和BlogInfo：

```
// 有2个实体分别是Blog和BlogInfo

public class Blog
{
    public int Id { get; set; }
    public Guid OwnerId { get; set; }
    public string Caption { get; set; }
    public DateTime DateCreated { get; set; }

    //一个Blog对一个Info
    public BlogInfo Info { get; set; }

    //一个Blog对多个Article
    public ICollection<BlogArticle> Article { get; set; }

}

public class BlogInfo
{
    
    public Guid Id { get; set; }
    public string Information { get; set; }

    //一个Blog对一个Info
    public Blog Blog { get; set; }

}

```

### 增加：
```cs
using(BlogModel context=new BlogModel())
{
    context.Blog.Add(new Blog
    {
        Id = 1,
        Caption = "Customer #1",
        DateCreated = DateTime.Now,
        Info=new BlogInfo
        {
            Information="TryA"
        }
    });
    context.SaveChanges;
}
```

### 查询：
```cs
using(BlogModel context=new BlogModel())
{

    //查多条
    var q = from item in context.Blogs
    select;
    
    //查第一条
    var blog = from b in context.Blogs 
                   where b.Caption.StartsWith("B")
                   select b; 
                   
    var blog = context.Blogs 
                    .Where(b => b.Caption == "ADO.NET Blog") 
                    .FirstOrDefault(); 
                    
    // 会查找数据库中的数据
    var blog = context.Blogs.Find(3); 
 
    // 会返回实例中的数据而不是到数据库中查找 
    var blogAgain = context.Blogs.Find(3); 
 
    context.Blogs.Add(new Blog { Id = -1 }); 
 
    // 会查到数据库中不存在的这个new Blog数据
    var newBlog = context.Blogs.Find(-1); 
 
    // 会根据这个string查找User
    var user = context.Users.Find("johndoe1987"); 
}
```

### 修改：
```cs
using(BlogModel context=new BlogModel())
{
    //查一条然后修改
    var blog = (from b 
                in context.Blogs 
                where b.Caption.StartsWith("B") 
                select b)
                .single(); 
    blog.Caption = "Best";
    context.SaveChanges;
    
    //根据Id修改
    blog = new Blogs()
    {
        Id = 1,//会根据这个ID来修改
        Caption = best
    };
    //下面这条是blog实例全部属性都写全的时候用
    context.Entry<Blogs>(blog).State = System.Data.Entity.EntityState.Modified;
    
    //下面这条是blog实例只写了Id和要改的部分
    context.Entry<Blogs>(blog).Property<string>(b => b.Caption).IsModified = true;
}
```

### 删除：
```cs
using(BlogModel context=new BlogModel())
{
    //查一条然后删除
    var blog = (from b 
                in context.Blogs 
                where b.Name.StartsWith("B") 
                select b)
                .single(); 
    context.Blogs.Remove(blog);
    context.SaveChanges;
}
```

# 映射

## DbContex类

通过继承DbContext类，来对数据库进行访问。

```cs
public class BlogModel : DbContext
{
    public BlogModel()
        : base("name=BlogModel")
    {
    }
    
    public virtual DbSet<Blog> Blog { get; set; }
    public virtual DbSet<BlogInfo> BlogInfo { get; set; }
    
    protected override void OnModelCreating(DbModelBuilder modelBuilder)
    {
        
    }
}
```
## DbContext中的构造方法
上面调用基类的构造方法中的“name=BlogModel”定义了连接字符串的名称，DbContext就可以通过这个连接字符串连接数据库了。

## DbSet属性
如果要定义在EF中使用的表格或视图表，就要在DbContext的派生类内定义以DbSet<T>为类型的属性。以下代码就定义了Blog和BlogArticle表格。

```cs
public class BlogModel : DbContext
{
    public BlogModel()
        : base("name=BlogModel")
    {
    }
    
    public virtual DbSet<Blog> Blog { get; set; }
    public virtual DbSet<BlogArticle> BlogArticle { get; set; }

}
```

因为这些代码没有明确定义，所以DbContext会按照默认的条件生成表格：
1. 表格名称有DbSet<T>所引入的类型名称进行单数化或复数化。
2. 只要名称是ID的都会变成主键(Primary Key)
3. 字段类型按照默认方式。
4. 若字段类型采用Nullable<T>类型时，那么字段会自动设置为允许NULL，而string默认就允许NULL。
5. 只要类型中有定义连接到别的类型的属性，且另一端有连接到原本的类型时，即会在数据库中加入外键约束。至于是何种约束，要看是一对一，一对多，或是多对多。


## OnModelCreating方法
DbContext中有一个可复写的方法OnModelCreating()，这个方法要从派生类来复写，它会在DbContext中进行初始化调用，并且会将处理完成的模型结构数据锁定在内存中。
OnModelCreating()会传入一个DbModelBuilder对象作为参数，DbModelBuilder是用来定义结构对应的类，它和它使用的辅助类都使用了Fluent API风格来设计，使用起来十分便利，语法上也相当清楚。
例如：

```cs
public class BlogModel : DbContext
{
    public BlogModel()
        : base("name=BlogModel")
    {
    }
    
    public virtual DbSet<Blog> Blog { get; set; }
    public virtual DbSet<BlogArticle> BlogArticle { get; set; }

}
```

## Data Annotation和Fluent API介绍
Data Annotation是在实体类的属性上添加注释，如下所示：


```cs
    public class User
    {
        下面的Key说明Id是主键
        [Key]
        public int Id { get; set; }
        public string LoginName { get; set; }

        //对应有0个或1个blog
        public Blog Blog { get; set; }
    }
```
EF支持的完整的注释列表：
* KeyAttribute
* StringLengthAttribute
* MaxLengthAttribute
* ConcurrencyCheckAttribute
* RequiredAttribute
* TimestampAttribute
* ComplexTypeAttribute
* ColumnAttribute
* TableAttribute
* InversePropertyAttribute
* ForeignKeyAttribute
* DatabaseGeneratedAttribute
* NotMappedAttribute

由于Data Annotation不利于解耦合，所以一般使用Fluent API。
Fluent API是在OnModelCreating()方法中添加代码，如下：

```cs
protected override void OnModelCreating(DbModelBuilder modelBuilder)
{
    #region 定义各个表格的名称和类型
    //Blog类要映射到数据库内的Blog表格，默认是blogs
    var blogTable = modelBuilder.Entity<Blog>().ToTable("Blog");
    var user = modelBuilder.Entity<User>();
    //BlogArticle类要映射到数据库内的BlogArticle表格，默认是BlogArticles
    var blogArticleTable = modelBuilder.Entity<BlogArticle>().ToTable("BlogArticle");
    var blogInfo = modelBuilder.Entity<BlogInfo>().ToTable("BlogInfo");
    var blogFile = modelBuilder.Entity<BlogFile>().ToTable("BlogFile");
    #endregion
}
```


## 继承EntityTypeConfiguration<EntityType>并添加映射代码
使用上面这种方法的一个问题是OnModelCreating方法会随着映射配置的增多而越来越大。一种更好的方法是继承EntityTyptConfiguration<EntityType>并在这个类中添加映射代码，如：

```cs
public class UserMap : EntityTypeConfiguration<User>
{
    public UserMap()
    {
        this.ToTable("User");
        this.HasKey(c => c.Id);
        //下面是1-to-0~1关系一个user可以没有或者一个blog，对应一个或多个，是通过在实体类中写的
        this.HasRequired(c => c.Blog)
            .WithOptional();
    }
}
```
然后在OnModelCreating中添加映射的配置信息：

```cs
protected override void OnModelCreating(DbModelBuilder modelBuilder)
{
    //单独配置一条配置信息
    modelBuilder.Configurations.Add(new UserMap());
    
    //使用反射将程序集中所有的EntityTypeConfiguration<>一次性添加到modelBuilder.Configurations集合中
    var typesToRegister = Assembly.GetExecutingAssembly().GetTypes()
        .Where(type => !String.IsNullOrEmpty(type.Namespace))
        .Where(type => type.BaseType != null && type.BaseType.IsGenericType && type.BaseType.GetGenericTypeDefinition() == typeof(EntityTypeConfiguration<>));
    foreach (var type in typesToRegister)
    {
        dynamic configurationInstance = Activator.CreateInstance(type);
        modelBuilder.Configurations.Add(configurationInstance);
    }
}
```


# 字段属性配置



```
protected override void OnModelCreating(DbModelBuilder modelBuilder)
{
    #region 确定表中各个字段属性
    //ID类型是int，但数据库内的实际上是bigint，同时这个字段是必须的
    blogTable
        .Property(c => c.Id)
        .IsRequired()
        .HasColumnType("bigint");

    blogArticleTable
        .Property(c => c.BlogId)
        .IsRequired()
        .HasColumnType("bigint");

    blogInfo
        .Property(c => c.Id)
        .HasDatabaseGeneratedOption(DatabaseGeneratedOption.Identity);

    blogArticleTable.Property(c => c.Subject)
        .IsRequired()
        .HasMaxLength(250);
        
    blogArticleTable.Property(c => c.Body)
        .IsRequired()
        .HasMaxLength(4000);
    #endregion
}
```

