
5. 关联(Fluent API)
   1. 1-1-or-0关联(WithOptional)
   2. 1-1关联(Required，Principal，Dependent)
   3. *-*关联(HasMany，WithMany，.Map)
   4. 单向关联()
   5. 关联删除
   6. 设置混合外键
   7. 重命名一个外键名称(.Map)
   8. 定义一个非惯例的外键名称
6. 创建索引
7. 实体类
   1. 有映射关系的实体类
   2. TPH、TPC、TPT
8. 存储过程
9. 变更跟踪
10. 更新数据库
    1. Enable-Migrations
    2. update-database
    3. Add-Migration [name]

# 关联(Fluent API)
## 1-1-or-0关联(WithOptional)
下面是1和1或者0关联的示例，OfficeAssignment拥有InstructorId

```
// Configure the primary key for the OfficeAssignment 
modelBuilder.Entity<OfficeAssignment>() 
    .HasKey(t => t.InstructorID); 
 
// Map one-to-zero or one relationship 
modelBuilder.Entity<OfficeAssignment>() 
    .HasRequired(t => t.Instructor) 
    .WithOptional(t => t.OfficeAssignment);
    
```

## 1-1关联(Required，Principal，Dependent)
一对一关联时，需要指定哪一个是主体(Principal)的哪一个是依赖(Dependent)的
在都是Optional时候，需要在HasOptional后使用WithOptionalPrincipal或WithOptionalDependent。
都是Required的时候，需要在HasRequired后使用WithRequiredPrincipal或WithRequiredDependent方法。


```
// Configure the primary key for the OfficeAssignment 
modelBuilder.Entity<OfficeAssignment>() 
    .HasKey(t => t.InstructorID); 
 
modelBuilder.Entity<Instructor>() 
    .HasRequired(t => t.OfficeAssignment) 
    .WithRequiredPrincipal(t => t.Instructor);
```

```
//下面是1-to-1单向关系,blogTable中没有BlogInfo表的Id
blogTable
    .HasRequired(c => c.Info)
    .WithRequiredPrincipal(c=>c.Blog);

//下面是1-to-1双向关系，blogTable中有BlogInfo表的Id
blogTable
    .HasRequired(c => c.Info)
    .WithRequiredDependent(c => c.Blog);
```

## *-*关联(HasMany，WithMany，.Map)
多对多关联是教师和课程之间的示例。
如果不用.Map的话，EF会根据惯例自动生成中间表。列名分别是：Course_CourseID 和 Instructor_InstructorID 

```
modelBuilder.Entity<Course>() 
    .HasMany(t => t.Instructors) 
    .WithMany(t => t.Courses) 
    .Map(m => 
    { 
        m.ToTable("CourseInstructor"); 
        m.MapLeftKey("CourseID"); 
        m.MapRightKey("InstructorID"); 
    });
```


```
blogArticleTable
    .HasKey(c => c.Id)
    .HasMany(c => c.File)
    .WithMany(c => c.Article)
    //Map用来自定义多对多中间表名称和列名的
    .Map(m =>
    {
        m.ToTable("BlogArticleFile");//中间表名
        m.MapLeftKey("BlogArticleId");//blogArticleTable的ID在其他表上显示的名字
        m.MapRightKey("BlogFileId");//其他表的ID在blogArticleTable上显示的名字
    });
```

## 单向关联()
单向关联就是把其中的一个关联属性去掉，如下，就只能从教师找到教室了

```
// Configure the primary Key for the OfficeAssignment 
modelBuilder.Entity<OfficeAssignment>() 
    .HasKey(t => t.InstructorID); 
 
modelBuilder.Entity<Instructor>() 
    .HasRequired(t => t.OfficeAssignment) 
    .WithRequiredPrincipal();
```

## 关联删除
可以使用WillCascadeOnDelete设置关联删除(cascade)。

如果一个外键依赖于一个非空实体，EF就会自动设置关联删除；

如果外键依赖的实体是可空的，EF就不会设置关联删除，并且主体删除后，外键会设置为null。

用下面这两句可以关闭关联删除：

```
modelBuilder.Conventions.Remove<OneToManyCascadeDeleteConvention>()
modelBuilder.Conventions.Remove<ManyToManyCascadeDeleteConvention>()
```

下面是关闭关联删除的方法。
```
modelBuilder.Entity<Course>() 
    .HasRequired(t => t.Department) 
    .WithMany(t => t.Courses) 
    .HasForeignKey(d => d.DepartmentID) 
    .WillCascadeOnDelete(false);
```


## 设置混合外键
如果需要把Department的主键设置为DepartmentID 和 Name这两个属性，就可以按照下面方法设置Department的主键和Course的外键(有个好处是数据库里面不光能看到部门ID还能看到名称，这样更清晰一些)。

```
// Composite primary key 
modelBuilder.Entity<Department>() 
.HasKey(d => new { d.DepartmentID, d.Name }); 
 
// Composite foreign key 
modelBuilder.Entity<Course>()  
    .HasRequired(c => c.Department)  
    .WithMany(d => d.Courses) 
    .HasForeignKey(d => new { d.DepartmentID, d.DepartmentName });
```

## 重命名一个外键名称(.Map)


```
modelBuilder.Entity<Course>() 
    .HasRequired(c => c.Department) 
    .WithMany(t => t.Courses) 
    .Map(m => m.MapKey("ChangedDepartmentID"));
```


## 定义一个非惯例的外键名称
如果不想用自动生成的外键名称的话，就可以用下面的方法自定义一个外键。

```
modelBuilder.Entity<Course>() 
         .HasRequired(c => c.Department) 
         .WithMany(d => d.Courses) 
         .HasForeignKey(c => c.SomeDepartmentID);

```

## 上面例子所用的数据库模型

```
using System.Data.Entity; 
using System.Data.Entity.ModelConfiguration.Conventions; 
// add a reference to System.ComponentModel.DataAnnotations DLL 
using System.ComponentModel.DataAnnotations; 
using System.Collections.Generic; 
using System; 
 
public class SchoolEntities : DbContext 
{ 
    public DbSet<Course> Courses { get; set; } 
    public DbSet<Department> Departments { get; set; } 
    public DbSet<Instructor> Instructors { get; set; } 
    public DbSet<OfficeAssignment> OfficeAssignments { get; set; } 
 
    protected override void OnModelCreating(DbModelBuilder modelBuilder) 
    { 
        // Configure Code First to ignore PluralizingTableName convention 
        // If you keep this convention then the generated tables will have pluralized names. 
        modelBuilder.Conventions.Remove<PluralizingTableNameConvention>(); 
    } 
} 
 
public class Department 
{ 
    public Department() 
    { 
        this.Courses = new HashSet<Course>(); 
    } 
    // Primary key 
    public int DepartmentID { get; set; } 
    public string Name { get; set; } 
    public decimal Budget { get; set; } 
    public System.DateTime StartDate { get; set; } 
    public int? Administrator { get; set; } 
 
    // Navigation property 
    public virtual ICollection<Course> Courses { get; private set; } 
} 
 
public class Course 
{ 
    public Course() 
    { 
        this.Instructors = new HashSet<Instructor>(); 
    } 
    // Primary key 
    public int CourseID { get; set; } 
 
    public string Title { get; set; } 
    public int Credits { get; set; } 
 
    // Foreign key 
    public int DepartmentID { get; set; } 
 
    // Navigation properties 
    public virtual Department Department { get; set; } 
    public virtual ICollection<Instructor> Instructors { get; private set; } 
} 
 
public partial class OnlineCourse : Course 
{ 
    public string URL { get; set; } 
} 
 
public partial class OnsiteCourse : Course 
{ 
    public OnsiteCourse() 
    { 
        Details = new Details(); 
    } 
 
    public Details Details { get; set; } 
} 
 
public class Details 
{ 
    public System.DateTime Time { get; set; } 
    public string Location { get; set; } 
    public string Days { get; set; } 
} 
     
public class Instructor 
{ 
    public Instructor() 
    { 
        this.Courses = new List<Course>(); 
    } 
 
    // Primary key 
    public int InstructorID { get; set; } 
    public string LastName { get; set; } 
    public string FirstName { get; set; } 
    public System.DateTime HireDate { get; set; } 
 
    // Navigation properties 
    public virtual ICollection<Course> Courses { get; private set; } 
} 
 
public class OfficeAssignment 
{ 
    // Specifying InstructorID as a primary 
    [Key()] 
    public Int32 InstructorID { get; set; } 
 
    public string Location { get; set; } 
 
    // When the Entity Framework sees Timestamp attribute 
    // it configures ConcurrencyCheck and DatabaseGeneratedPattern=Computed. 
    [Timestamp] 
    public Byte[] Timestamp { get; set; } 
 
    // Navigation property 
    public virtual Instructor Instructor { get; set; } 
}

```


# 创建索引
完整的创建索引的方法参考Code First Data Annotations

单一index
```
modelBuilder 
    .Entity<Department>() 
    .Property(t => t.Name) 
    .HasColumnAnnotation("Index", new IndexAnnotation(new IndexAttribute()));
```
多重index
```
modelBuilder 
    .Entity<Department>() 
    .Property(t => t.Name) 
    .HasColumnAnnotation( 
        "Index",  
        new IndexAnnotation(new[] 
            { 
                new IndexAttribute("Index1"), 
                new IndexAttribute("Index2") { IsUnique = true } 
            })));
```


# 实体类

## 有映射关系的实体类


## TPH、TPC、TPT
### Table-Per-Hierarchy
TPH就是将所有的对象数据都放到同一个数据表中，再以Discriminator来分隔。

```
modelBuilder.Entity<Course>()  
    .Map<Course>(m => m.Requires("Type").HasValue("Course"))  
    .Map<OnsiteCourse>(m => m.Requires("Type").HasValue("OnsiteCourse"));
```

### Table-Per-Type (TPT)
TPT表示将类内的属性存到各自的数据表内，父类拥有自己的表格，而继承线则由Foreign Key关联替代，因此子类只会保存该类内的属性。
TPT的设计比较偏向一般数据库设计方针。

```
modelBuilder.Entity<Course>().ToTable("Course");  
modelBuilder.Entity<OnsiteCourse>().ToTable("OnsiteCourse");
```

### Table-Per-Concrete Class (TPC)
TPC的方法是将继承的数据表放在各自的类型数据表中，并没有特别的关联，也就是各自独立。实现上数据表是分开的，而且数据表内会重复存放继承而来的结构。

```
modelBuilder.Entity<Course>() 
    .Property(c => c.CourseID) 
    .HasDatabaseGeneratedOption(DatabaseGeneratedOption.None); 
 
modelBuilder.Entity<OnsiteCourse>().Map(m => 
{ 
    m.MapInheritedProperties(); 
    m.ToTable("OnsiteCourse"); 
}); 
 
modelBuilder.Entity<OnlineCourse>().Map(m => 
{ 
    m.MapInheritedProperties(); 
    m.ToTable("OnlineCourse"); 
});
```


# 存储过程


# 更新数据库
## Enable-Migrations
在Package Manager Console中执行Enable-Migrations。
然后项目中就会增加Migration/Configuration.cs里面有DatabaseMigration相关代码。

## update-database
执行Update-Database，就可以将数据库升级为最新版。

## Add-Migration [name]
在修改数据后执行Add-Migration [name]就可以根据实体自动产生相应的Migration代码，其中[name]这次修改数据库的命名。
