# 简述
可以自己建立一个测试替身(test double)：就是自己写一个在内存中的Context和DbSets
也可以用一个mock框架来建立一个：比如用Moq
用这种内存方法在单元测试的时候可能比较好。但是使用LinQ to Objects来操作内存数据和LinQ to Entity来操作数据库还是有区别的。

# 建立一个单元测试
## 被测的EF 模型

```
using System.Collections.Generic; 
using System.Data.Entity; 
 
namespace TestingDemo 
{ 
    public class BloggingContext : DbContext 
    { 
        public virtual DbSet<Blog> Blogs { get; set; } 
        public virtual DbSet<Post> Posts { get; set; } 
    } 
 
    public class Blog 
    { 
        public int BlogId { get; set; } 
        public string Name { get; set; } 
        public string Url { get; set; } 
 
        public virtual List<Post> Posts { get; set; } 
    } 
 
    public class Post 
    { 
        public int PostId { get; set; } 
        public string Title { get; set; } 
        public string Content { get; set; } 
 
        public int BlogId { get; set; } 
        public virtual Blog Blog { get; set; } 
    } 
}

```
## 被测方法
下面的测试是
- 建立一个新Blog(AddBlog)
- 返回所有Blogs，返回数据用名称排序(GetAllBlogs)。
- 另外再提供一个异步方法，获取所有的以名称排序的blogs(GetAllBlogsAsync)


```
using System.Collections.Generic; 
using System.Data.Entity; 
using System.Linq; 
using System.Threading.Tasks; 
 
namespace TestingDemo 
{ 
    public class BlogService 
    { 
        private BloggingContext _context; 
 
        public BlogService(BloggingContext context) 
        { 
            _context = context; 
        } 
 
        public Blog AddBlog(string name, string url) 
        { 
            var blog = _context.Blogs.Add(new Blog { Name = name, Url = url }); 
            _context.SaveChanges(); 
 
            return blog; 
        } 
 
        public List<Blog> GetAllBlogs() 
        { 
            var query = from b in _context.Blogs 
                        orderby b.Name 
                        select b; 
 
            return query.ToList(); 
        } 
 
        public async Task<List<Blog>> GetAllBlogsAsync() 
        { 
            var query = from b in _context.Blogs 
                        orderby b.Name 
                        select b; 
 
            return await query.ToListAsync(); 
        } 
    } 
}

```

## 测试一个非查询场景
下面是对非查询语句进行测试
- 使用了Moq建立了一个Context，然后它建立了一个DbSet<Blog>，他们一起返回一个上下文(Context)的Blogs属性。
- 然后利用BlogService建立一个导向Moq的Blog。
- 然后使用AddBlog方法，建立一个Blog
- 最后测试验证，service是否新增了一个blog，并且在Context上使用了SaveChanges。

```
using Microsoft.VisualStudio.TestTools.UnitTesting; 
using Moq; 
using System.Data.Entity; 
 
namespace TestingDemo 
{ 
    [TestClass] 
    public class NonQueryTests 
    { 
        [TestMethod] 
        public void CreateBlog_saves_a_blog_via_context() 
        { 
            var mockSet = new Mock<DbSet<Blog>>(); 
 
            var mockContext = new Mock<BloggingContext>(); 
            mockContext.Setup(m => m.Blogs).Returns(mockSet.Object); 
 
            var service = new BlogService(mockContext.Object); 
            service.AddBlog("ADO.NET Blog", "http://blogs.msdn.com/adonet"); 
 
            mockSet.Verify(m => m.Add(It.IsAny<Blog>()), Times.Once()); 
            //mockSet.Verify(m => m.Add(It.Is<Blog>(n => n.customEqual(new Blog { Name = "ADO.NET Blog", Url = "http://blogs.msdn.com/adonet" })), Times.Once());
            mockContext.Verify(m => m.SaveChanges(), Times.Once()); 
        } 
    } 
}
```

## 测试查询语句
为了可以在模拟的DbSet上执行查询语句，需要一个IQuerable的实现。
- 第一步是建立一些内存数据，使用List<Blog>.AsQueryable()
- 第二步建立一个Context和DbSet<Blog>
- 然后把IQueryable实现给Dbset设置上，就是委托LINQ to Objects来操作List<T>

然后就可以在虚拟的mock上建立一个BlogService，然后用GetAllBlogs获取所有的用名称排列的data


```
using Microsoft.VisualStudio.TestTools.UnitTesting; 
using Moq; 
using System.Collections.Generic; 
using System.Data.Entity; 
using System.Linq; 
 
namespace TestingDemo 
{ 
    [TestClass] 
    public class QueryTests 
    { 
        [TestMethod] 
        public void GetAllBlogs_orders_by_name() 
        { 
            var data = new List<Blog> 
            { 
                new Blog { Name = "BBB" }, 
                new Blog { Name = "ZZZ" }, 
                new Blog { Name = "AAA" }, 
            }.AsQueryable(); 
 
            var mockSet = new Mock<DbSet<Blog>>(); 
            mockSet.As<IQueryable<Blog>>().Setup(m => m.Provider).Returns(data.Provider); 
            mockSet.As<IQueryable<Blog>>().Setup(m => m.Expression).Returns(data.Expression); 
            mockSet.As<IQueryable<Blog>>().Setup(m => m.ElementType).Returns(data.ElementType); 
            mockSet.As<IQueryable<Blog>>().Setup(m => m.GetEnumerator()).Returns(data.GetEnumerator()); 
 
            var mockContext = new Mock<BloggingContext>(); 
            mockContext.Setup(c => c.Blogs).Returns(mockSet.Object); 
 
            var service = new BlogService(mockContext.Object); 
            var blogs = service.GetAllBlogs(); 
 
            Assert.AreEqual(3, blogs.Count); 
            Assert.AreEqual("AAA", blogs[0].Name); 
            Assert.AreEqual("BBB", blogs[1].Name); 
            Assert.AreEqual("ZZZ", blogs[2].Name); 
        } 
    } 
}
```

## 测试异步查询
为了使用异步查询语句，需要u多做一些工作，如果直接使用getAllBlogsAsync
来查询Moq的DbSet，就会出现以下错误

System.InvalidOperationException: The source IQueryable doesn't implement IDbAsyncEnumerable<TestingDemo.Blog>. Only sources that implement IDbAsyncEnumerable can be used for Entity Framework asynchronous operations. For more details see http://go.microsoft.com/fwlink/?LinkId=287068.

为了使用异步方法，需要建立一个内存中的 DbAsyncQueryProvider 来执行异步查询语句。
同时这样就可以设置一个用Moq执行的查询语句。


```
using System.Collections.Generic; 
using System.Data.Entity.Infrastructure; 
using System.Linq; 
using System.Linq.Expressions; 
using System.Threading; 
using System.Threading.Tasks; 
 
namespace TestingDemo 
{ 
    internal class TestDbAsyncQueryProvider<TEntity> : IDbAsyncQueryProvider 
    { 
        private readonly IQueryProvider _inner; 
 
        internal TestDbAsyncQueryProvider(IQueryProvider inner) 
        { 
            _inner = inner; 
        } 
 
        public IQueryable CreateQuery(Expression expression) 
        { 
            return new TestDbAsyncEnumerable<TEntity>(expression); 
        } 
 
        public IQueryable<TElement> CreateQuery<TElement>(Expression expression) 
        { 
            return new TestDbAsyncEnumerable<TElement>(expression); 
        } 
 
        public object Execute(Expression expression) 
        { 
            return _inner.Execute(expression); 
        } 
 
        public TResult Execute<TResult>(Expression expression) 
        { 
            return _inner.Execute<TResult>(expression); 
        } 
 
        public Task<object> ExecuteAsync(Expression expression, CancellationToken cancellationToken) 
        { 
            return Task.FromResult(Execute(expression)); 
        } 
 
        public Task<TResult> ExecuteAsync<TResult>(Expression expression, CancellationToken cancellationToken) 
        { 
            return Task.FromResult(Execute<TResult>(expression)); 
        } 
    } 
 
    internal class TestDbAsyncEnumerable<T> : EnumerableQuery<T>, IDbAsyncEnumerable<T>, IQueryable<T> 
    { 
        public TestDbAsyncEnumerable(IEnumerable<T> enumerable) 
            : base(enumerable) 
        { } 
 
        public TestDbAsyncEnumerable(Expression expression) 
            : base(expression) 
        { } 
 
        public IDbAsyncEnumerator<T> GetAsyncEnumerator() 
        { 
            return new TestDbAsyncEnumerator<T>(this.AsEnumerable().GetEnumerator()); 
        } 
 
        IDbAsyncEnumerator IDbAsyncEnumerable.GetAsyncEnumerator() 
        { 
            return GetAsyncEnumerator(); 
        } 
 
        IQueryProvider IQueryable.Provider 
        { 
            get { return new TestDbAsyncQueryProvider<T>(this); } 
        } 
    } 
 
    internal class TestDbAsyncEnumerator<T> : IDbAsyncEnumerator<T> 
    { 
        private readonly IEnumerator<T> _inner; 
 
        public TestDbAsyncEnumerator(IEnumerator<T> inner) 
        { 
            _inner = inner; 
        } 
 
        public void Dispose() 
        { 
            _inner.Dispose(); 
        } 
 
        public Task<bool> MoveNextAsync(CancellationToken cancellationToken) 
        { 
            return Task.FromResult(_inner.MoveNext()); 
        } 
 
        public T Current 
        { 
            get { return _inner.Current; } 
        } 
 
        object IDbAsyncEnumerator.Current 
        { 
            get { return Current; } 
        } 
    } 
}
```
以上就是我们的异步查询方法，这样就可以写一个单元测试来测试GetAllBlogsAsync方法。


```
using Microsoft.VisualStudio.TestTools.UnitTesting; 
using Moq; 
using System.Collections.Generic; 
using System.Data.Entity; 
using System.Data.Entity.Infrastructure; 
using System.Linq; 
using System.Threading.Tasks; 
 
namespace TestingDemo 
{ 
    [TestClass] 
    public class AsyncQueryTests 
    { 
        [TestMethod] 
        public async Task GetAllBlogsAsync_orders_by_name() 
        { 
 
            var data = new List<Blog> 
            { 
                new Blog { Name = "BBB" }, 
                new Blog { Name = "ZZZ" }, 
                new Blog { Name = "AAA" }, 
            }.AsQueryable(); 
 
            var mockSet = new Mock<DbSet<Blog>>(); 
            mockSet.As<IDbAsyncEnumerable<Blog>>() 
                .Setup(m => m.GetAsyncEnumerator()) 
                .Returns(new TestDbAsyncEnumerator<Blog>(data.GetEnumerator())); 
 
            mockSet.As<IQueryable<Blog>>() 
                .Setup(m => m.Provider) 
                .Returns(new TestDbAsyncQueryProvider<Blog>(data.Provider)); 
 
            mockSet.As<IQueryable<Blog>>().Setup(m => m.Expression).Returns(data.Expression); 
            mockSet.As<IQueryable<Blog>>().Setup(m => m.ElementType).Returns(data.ElementType); 
            mockSet.As<IQueryable<Blog>>().Setup(m => m.GetEnumerator()).Returns(data.GetEnumerator()); 
 
            var mockContext = new Mock<BloggingContext>(); 
            mockContext.Setup(c => c.Blogs).Returns(mockSet.Object); 
 
            var service = new BlogService(mockContext.Object); 
            var blogs = await service.GetAllBlogsAsync(); 
 
            Assert.AreEqual(3, blogs.Count); 
            Assert.AreEqual("AAA", blogs[0].Name); 
            Assert.AreEqual("BBB", blogs[1].Name); 
            Assert.AreEqual("ZZZ", blogs[2].Name); 
        } 
    } 
}

```
