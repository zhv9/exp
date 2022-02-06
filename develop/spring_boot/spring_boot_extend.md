# Spring boot extend

https://github.com/maryellenteaches/ExtendingSecuringDockerizing

## Define the schema and default data

在 resources 下面创建下面三个设置，spring 的 data repository initialization 就会自动初始化数据库

- `schema.sql`: 创建数据库表的 sql
- `data.sql`: 初始化的数据
- `application.properties` 内添加：`spring.jpa.hibernate.ddl-auto=none`
- https://github.com/maryellenteaches/ExtendingSecuringDockerizing/tree/1-3-end/explorecali/src/main/resources

另外 region 在数据库中是一个字符串，那么我们就需要一个转换类，对它做转换。需要在 domain\Region 下面创建一个 `RegionConverter` 并添加以下代码。

https://github.com/maryellenteaches/ExtendingSecuringDockerizing/blob/1-3-end/explorecali/src/main/java/com/example/ec/domain/RegionConverter.java

```java
@Converter(autoApply = true)
public class RegionConverter implements AttributeConverter<Region, String> {
    @Override
    public String convertToDatabaseColumn(Region region) {
        return region.getLabel();
    }

    @Override
    public Region convertToEntityAttribute(String dbData) {
        return Region.findByLabel(dbData);
    }
}
```

然后只要运行了这个 spring boot 应用，那就会自动执行 `schema.sql`, `data.sql` 并自动将 `String` 转换为 `Region`

## 确定事务性业务的边界

### 什么是事物性

有时候调用服务的时候会一次处理很多事务，这些事务应该要全部成功或全部失败，不能出现只成功一部分的情况。因为这些事务很有可能是互相关联的。在下面的例子中，就有可能会出现只有部分操作会成功的情况。

在下面这个例子中，我们一次性让多个 customer 对当前的 tour 打分（rating），由于表做了一个 customer 只能打一次分的规则。那在多个customer 同时打分的时候，如果其中有一个 customer 已经打过分，那么此时就会失败（例如下面的示例）。在没有进行“事务性”处理的情况下，会有部分成功，部分失败，而这是不应该出现的。

事务失败的示例：

- 插入的数据：customer 1,2,3,4,5,6 的评分
- 已有的数据：customer 4 已有
- 实际结果：插入了 customer 1,2,3 的数据，在 customer 4 处失败，后续的 customer 5,6 没有插入。

https://github.com/maryellenteaches/ExtendingSecuringDockerizing/blob/1-4-begin/explorecali/src/main/java/com/example/ec/service/TourRatingService.java#L132

```java
// 在表定义的时候，一个 tour_id 只能对应一个 customer_id
ALTER TABLE tour_rating ADD UNIQUE MyConstraint (tour_id, customer_id);

// 如果执行下面代码，就有可能出现某个 customer_id 已经打过分，而导致事务失败的情况
public void rateMany(int tourId,  int score, Integer [] customers) {
    tourRepository.findById(tourId).ifPresent(tour -> {
        for (Integer c : customers) {
            tourRatingRepository.save(new TourRating(tour, c, score));
        }
    });
}
```

### 如何解决

解决“事物性”问题本身很复杂但在 spring boot 里面则比较简单，只要添加 `@Transactional` 注解在对应的 service 方法或类上即可。

```java
@Transactional
public void rateMany(int tourId,  int score, Integer [] customers) {
    tourRepository.findById(tourId).ifPresent(tour -> {
        for (Integer c : customers) {
            tourRatingRepository.save(new TourRating(tour, c, score));
        }
    });
}
```

## Logging

- Error：最高级别，发生比较严重的问题。一般放到报错的地方，比如返回 404 的方法里。
- Warning：一般级别，同 Info。
- Info：一般级别，同 Warning。比如用来记录用户访问的 url
- Debug：Debug 时候使用。可以放到具体业务中，记录使用了哪些参数。
- Trace：最低级别，开发人员检查流程用

然后需要添加对应 log 的配置文件，放到 resources 目录中。可以直接使用 spring 默认配置并设置一下 log 级别，然后在 application.properties 文件内设置一下 log 地址。

以下是配置文件示例：

https://github.com/maryellenteaches/ExtendingSecuringDockerizing/tree/2-1-end/explorecali/src/main/resources

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <include resource="org/springframework/boot/logging/logback/base.xml" />
    <logger name="com.example.ec" level="DEBUG" />
</configuration>
```

## Test

### Unit test

测试应该只测试代码而不是依赖。

在测试 service 的时候，只测试 service 的代码，而不测试其中 `@Autowired` 的 `Repository`。这时就需要使用 mock 框架，比如“Mockito”来处理这部分问题了。

https://github.com/maryellenteaches/ExtendingSecuringDockerizing/blob/2-2/explorecali/src/test/java/com/example/ec/service/TourRatingServiceTest.java

```java
@RunWith(MockitoJUnitRunner.class)
public class TourRatingServiceTest {

    private static final int CUSTOMER_ID = 123;
    private static final int TOUR_ID = 1;
    private static final int TOUR_RATING_ID = 100;

    @Mock
    private TourRepository tourRepositoryMock;
    @Mock
    private TourRatingRepository tourRatingRepositoryMock;

    @InjectMocks //Autowire TourRatingService(tourRatingRepositoryMock, tourRepositoryMock)
    private TourRatingService service;

    @Mock
    private Tour tourMock;
    @Mock
    private TourRating tourRatingMock;

    @Before // 设置一些通用的 mock 返回值
    public void setupReturnValuesOfMockMethods() {
        when(tourRepositoryMock.findById(TOUR_ID)).thenReturn(Optional.of(tourMock));
        when(tourMock.getId()).thenReturn(TOUR_ID);
        when(tourRatingRepositoryMock.findByTourIdAndCustomerId(TOUR_ID,CUSTOMER_ID)).thenReturn(Optional.of(tourRatingMock));
        when(tourRatingRepositoryMock.findByTourId(TOUR_ID)).thenReturn(Arrays.asList(tourRatingMock));
    }

    @Test
    public void lookupRatingById() {
        // 设置 mock 的返回值
        when(tourRatingRepositoryMock.findById(TOUR_RATING_ID)).thenReturn(Optional.of(tourRatingMock));

        // 调用并检查结果
        assertThat(service.lookupRatingById(TOUR_RATING_ID).get(), is(tourRatingMock));
    }
    @Test
    public void createNew() {
        // 为 TourRating.class 准备一个假的 TourRating 对象，类似于添加了一个 spy
        ArgumentCaptor<TourRating> tourRatingCaptor = ArgumentCaptor.forClass(TourRating.class);

        //invoke createNew
        service.createNew(TOUR_ID, CUSTOMER_ID, 2, "ok");

        // 检查 tourRatingRepository.save 被调用了，并且是被 TourRating 对象调用的
        verify(tourRatingRepositoryMock).save(tourRatingCaptor.capture());

        // 检查 TourRating 是否按照给定数据设置了正确的值
        assertThat(tourRatingCaptor.getValue().getTour(), is(tourMock));
        assertThat(tourRatingCaptor.getValue().getCustomerId(), is(CUSTOMER_ID));
        assertThat(tourRatingCaptor.getValue().getScore(), is(2));
        assertThat(tourRatingCaptor.getValue().getComment(), is("ok"));
    }
}
```

### Integration test

集成测试是在 spring 容器中运行的。在进行集成测试的时候，会正常启动 spring 应用，所以 `schema.sql` 和 `data.sql` 都会执行。为了测试的可重复性，需要在测试 class 上添加 `@Transactional` 注解，来让每个测试在结束后回退测试过程中的数据。

https://github.com/maryellenteaches/ExtendingSecuringDockerizing/blob/2-2/explorecali/src/test/java/com/example/ec/service/TourRatingServiceIntegrationTest.java

```java
@RunWith(SpringRunner.class)
@SpringBootTest
@Transactional
public class TourRatingServiceIntegrationTest {
    private static final int CUSTOMER_ID = 456;
    private static final int TOUR_ID = 1;
    private static final int NOT_A_TOUR_ID = 123;

    @Autowired
    private TourRatingService service;

    // Happy Path delete existing TourRating.
    @Test
    public void delete() {
        List<TourRating> tourRatings = service.lookupAll();
        service.delete(tourRatings.get(0).getTour().getId(), tourRatings.get(0).getCustomerId());
        assertThat(service.lookupAll().size(), is(tourRatings.size() - 1));
    }

    // UnHappy Path, Tour NOT_A_TOUR_ID does not exist
    @Test(expected = NoSuchElementException.class)
    public void deleteException() {
        service.delete(NOT_A_TOUR_ID, 1234);
    }
}
```

### Rest api test

在测试 controller 的时候，由于 service 是外部资源，所以需要将它们都 mock 掉。使用到的 POJO（也就是 domain 里面的那些 entity）也要一并 mock 掉，因为后面要让这些返回固定的数据。

https://github.com/maryellenteaches/ExtendingSecuringDockerizing/tree/2-3/explorecali/src/test/java/com/example/ec/web

```java
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = RANDOM_PORT)
public class RatingControllerTest {
    private static final String RATINGS_URL = "/ratings";

    // 这些 tour, rating 在 db 里面都没有
    private static final int TOUR_ID = 999;
    private static final int RATING_ID = 555;
    private static final int CUSTOMER_ID = 1000;
    private static final int SCORE = 3;
    private static final String COMMENT = "comment";

    @MockBean
    private TourRatingService tourRatingServiceMock;

    @Mock
    private TourRating tourRatingMock;

    @Mock
    private Tour tourMock;

    @Autowired // 这个是拿来模拟 rest 请求的
    private TestRestTemplate restTemplate;

    @Before
    public void setupReturnValuesOfMockMethods() {
        when(tourRatingMock.getTour()).thenReturn(tourMock);
        when(tourMock.getId()).thenReturn(TOUR_ID);
        when(tourRatingMock.getComment()).thenReturn(COMMENT);
        when(tourRatingMock.getScore()).thenReturn(SCORE);
        when(tourRatingMock.getCustomerId()).thenReturn(CUSTOMER_ID);
    }

    @Test
    public void getRatings() {
        when(tourRatingServiceMock.lookupAll())
                .thenReturn(
                        Arrays.asList(tourRatingMock, tourRatingMock, tourRatingMock));

        ResponseEntity<List> response = restTemplate
                .getForEntity(RATINGS_URL, List.class);

        assertThat(response.getStatusCode(), is(HttpStatus.OK));
        assertThat(response.getBody().size(), is(3));
    }

    @Test
    public void getOne()  {
        when(tourRatingServiceMock.lookupRatingById(RATING_ID))
                .thenReturn(Optional.of(tourRatingMock));

        ResponseEntity<RatingDto> response = restTemplate
                .getForEntity(RATINGS_URL + "/" + RATING_ID, RatingDto.class);

        assertThat(response.getStatusCode(), is(HttpStatus.OK));
        assertThat(response.getBody().getCustomerId(), is(CUSTOMER_ID));
        assertThat(response.getBody().getComment(), is(COMMENT));
        assertThat(response.getBody().getScore(), is(SCORE));
    }
}
```

## Add Swagger

添加 swagger 的两个依赖就可以将 swagger 添加到项目中了。

```xml
    <dependency>
        <groupId>org.springdoc</groupId>
        <artifactId>springdoc-openapi-ui</artifactId>
        <version>1.4.5</version>
    </dependency>
    <dependency>
        <groupId>org.springdoc</groupId>
        <artifactId>springdoc-openapi-data-rest</artifactId>
        <version>1.4.5</version>
    </dependency>
```

但是如果希望调整每个接口的描述等信息，则需要到代码中使用注解来写对应的内容。在整个 spring 应用入口写的就会显示在最上方。在各个 api 处写的就会变成对应 api 的描述。

- `@OpenAPIDefinition(info = @Info(title = "", description = "", version = ""))`：在应用入口处对整体做描述
- `@Tag(name = "", description = "")`：在 api 的 class 上添加，描述这一组 api
- `@Operation(summary = "")`：在 api 方法上添加，来描述 api 的作用
- `@ApiResponses(value = {@ApiResponse(...), @ApiResponse(...)})`：在 api 方法上添加，来描述 api 的返回值

## Security

一般包括“授权 Authorization”和“验证 Authentication”两部分

- 授权
    - 用户名和密码是否正确
    - 认证成功后向用户发放一个验证用的 token，或拒绝进入
- 验证
    - 检查 token 是否正确和有效
    - 检查权限是否支持当前的操作

### 为 spring boot 添加认证

首先需要维护一张用户表，和一些用户，用来做用户登录和验证之用。

https://github.com/maryellenteaches/ExtendingSecuringDockerizing/tree/3-1-end/explorecali/src/main/resources

https://github.com/maryellenteaches/ExtendingSecuringDockerizing/blob/3-1-end/explorecali/src/main/java/com/example/ec/domain/User.java

```sql
CREATE TABLE security_role (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  description varchar(100) DEFAULT NULL,
  role_name varchar(100) DEFAULT NULL
);

CREATE TABLE security_user (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  username varchar(255) NOT NULL,
  password varchar(255) NOT NULL,
  first_name varchar(255) NOT NULL,
  last_name varchar(255) NOT NULL
);

CREATE TABLE user_role (
  user_id BIGINT NOT NULL,
  role_id BIGINT NOT NULL,
  CONSTRAINT FK_SECURITY_USER_ID FOREIGN KEY (user_id) REFERENCES security_user (id),
  CONSTRAINT FK_SECURITY_ROLE_ID FOREIGN KEY (role_id) REFERENCES security_role (id)
);
```

之后只要添加一个安全依赖即可，在添加下面依赖后，访问任何接口都会做认证，如果不通过就会跳转到登录页面。

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

### 不需要认证的 api

项目中总会有一些不需要认证的 api，比如“登录”的 api，或一些可以公开的数据。这时就可以添加配置文件来对它们进行配置。

https://github.com/maryellenteaches/ExtendingSecuringDockerizing/blob/3-2/explorecali/src/main/java/com/example/ec/security/WebSecurityConfiguration.java

```java
@Configuration
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class WebSecurityConfiguration extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        // Entry points
        http.authorizeRequests()
                .antMatchers("/packages/**").permitAll()
                .antMatchers("/tours/**").permitAll()
                .antMatchers("/ratings/**").permitAll()
                .antMatchers("/users/signin").permitAll()
                .antMatchers("/v3/api-docs/**","/swagger-ui/**", "/swagger-ui.html").permitAll()
                // Disallow everything else..
                .anyRequest().authenticated();

        // Disable CSRF (cross site request forgery)
        http.csrf().disable();

        // No session will be created or used by spring security
        http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
    }
}
```

在配置完成后，我们还需要添加一个 service 做认证工作。service 中执行 `authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));` 完成并返回认证结果。

https://github.com/maryellenteaches/ExtendingSecuringDockerizing/blob/3-2/explorecali/src/main/java/com/example/ec/service/UserService.java

```java
@Service
public class UserService {
    private UserRepository userRepository;
    private AuthenticationManager authenticationManager;
    private RoleRepository roleRepository;
    private PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, AuthenticationManager authenticationManager,
                       RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.authenticationManager = authenticationManager;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Authentication signin(String username, String password) {
        return authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
    }
 }
```

另外我们还需要一个查找和检查用户名密码是否正确的类。这个类需要实现 `UserDetailsService` 接口。这样的话，`authenticationManager` 就会找到并调用我们所写的类了。

https://github.com/maryellenteaches/ExtendingSecuringDockerizing/blob/3-2/explorecali/src/main/java/com/example/ec/security/ExploreCaliUserDetailsService.java

```java
@Component
public class ExploreCaliUserDetailsService implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String s) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(s).orElseThrow(() ->
                new UsernameNotFoundException(String.format("User with name %s does not exist", s)));

        //org.springframework.security.core.userdetails.User.withUsername() builder
        return withUsername(user.getUsername())
                .password(user.getPassword())
                .authorities(user.getRoles())
                .accountExpired(false)
                .accountLocked(false)
                .credentialsExpired(false)
                .disabled(false)
                .build();
    }
}
```

### JWT

添加 JWT 需要做以下设置

- 添加 `JwtTokenProvider`
    - createToken：作用是通过 username、roles 等信息生成 JwtToken
    - isValidToken：校验 JwtToken
    - 另外还有一些获取 JwtToken 中所存数据的 helper 方法
- 添加 `JwtTokenFilter`，为的是处理 `@PreAuthorize`
    - 这个类继承了 `GenericFilterBean`
    - 类中复写了 `doFilter` 方法，在 `doFilter` 方法就可以对 controller 中的 `@PreAuthorize` 注解校验。
- 修改 pom.xml 增加 jjwt 依赖
- 修改 `UserController`
    - `@PreAuthorize("hasRole('ROLE_ADMIN')"`：对于 getAllUsers 和 signup 接口需要管理员才能访问，添加这个注解就可以实现目标。这个注解依赖于 spring web filter，而具体实现由 `JwtTokenFilter` 处理。
- 修改 `WebSecurityConfiguration` 增加 `JwtTokenFilter`
    - 关键点是 `http.addFilterBefore(new JwtTokenFilter(userDetailsService), UsernamePasswordAuthenticationFilter.class);` 将 `JwtTokenFilter` 添加到 `filterChain` 中。
- 修改 `ExploreCaliUserDetailsService` 也就是实现了 `UserDetailsService` 接口的服务
    - 主要是从 JwtToken 提取数据和根据用户名获取 user 信息

Reference: https://github.com/maryellenteaches/ExtendingSecuringDockerizing/tree/3-5/explorecali/src/main/java/com/example/ec/security

```java
@Component
public class JwtProvider {
    private final String ROLES_KEY = "roles";
    private JwtParser parser;
    private String secretKey;
    private long validityInMilliseconds;

    @Autowired
    public JwtProvider(@Value("${security.jwt.token.secret-key}") String secretKey,
                       @Value("${security.jwt.token.expiration}")long validityInMilliseconds)
    // Create JWT string given username and roles.
    public String createToken(String username, List<Role> roles)
    // Validate the JWT String
    public boolean isValidToken(String token)
    // Get the username from the token string
    public String getUsername(String token)
    // Get the roles from the token string
    public List<GrantedAuthority> getRoles(String token)
}

public class JwtTokenFilter extends GenericFilterBean {
    private static final Logger LOGGER = LoggerFactory.getLogger(JwtTokenFilter.class);
    private static final String BEARER = "Bearer";

    private ExploreCaliUserDetailsService userDetailsService;

    public JwtTokenFilter(ExploreCaliUserDetailsService userDetailsService) {
    }

    // Determine if there is a JWT as part of the HTTP Request Header.
    // If it is valid then set the current context With the Authentication(user and roles) found in the token
    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain filterChain)
            throws IOException, ServletException {
        //Check for Authorization:Bearer JWT
        String headerValue = ((HttpServletRequest)req).getHeader("Authorization");
        getBearerToken(headerValue).ifPresent(token-> {
            //Pull the Username and Roles from the JWT to construct the user details
            userDetailsService.loadUserByJwtToken(token).ifPresent(userDetails -> {
                //Add the user details (Permissions) to the Context for just this API invocation
                SecurityContextHolder.getContext().setAuthentication(
                        new PreAuthenticatedAuthenticationToken(userDetails, "", userDetails.getAuthorities()));
            });
        });

        //move on to the next filter in the chains
        filterChain.doFilter(req, res);
    }

    // if present, extract the jwt token from the "Bearer <jwt>" header value.
    private Optional<String> getBearerToken(String headerVal)
}

@RestController
@RequestMapping("/users")
public class UserController {
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public List<User> getAllUsers() {
        return userService.getAll();
    }
}

@Configuration
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class WebSecurityConfiguration extends WebSecurityConfigurerAdapter {
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.addFilterBefore(new JwtTokenFilter(userDetailsService), UsernamePasswordAuthenticationFilter.class);
    }
}

@Service
public class UserService {
    private UserRepository userRepository;
    private AuthenticationManager authenticationManager;
    private RoleRepository roleRepository;
    private PasswordEncoder passwordEncoder;
    private JwtProvider jwtProvider;

    @Autowired
    public UserService(UserRepository userRepository, AuthenticationManager authenticationManager,
                       RoleRepository roleRepository, PasswordEncoder passwordEncoder, JwtProvider jwtProvider)
    // Sign in a user into the application, with JWT-enabled authentication
    public Optional<String> signin(String username, String password)
    // Create a new user in the database.
    public Optional<User> signup(String username, String password, String firstName, String lastName)

    public List<User> getAll()
}
```

### Unit test with JwtToken

由于现在很多 api 要求附带一个 `Authorization` 的 header，所以之前写的测试都失败了。为了附带 header 我们需要把之前的 `restTemplate.<http method>(url, body, return value)` 替换为 `restTemplate.exchange(url, method, HttpEntity(body, headers), return value)`

```java
@Test
public void createTourRating() throws Exception {
    // restTemplate.postForEntity(TOUR_RATINGS_URL, ratingDto, Void.class); // 没有 header 的情况
    restTemplate.exchange(TOUR_RATINGS_URL, POST,
            new HttpEntity(ratingDto, jwtRequestHelper.withRole("ROLE_CSR")),
            Void.class);

    verify(this.serviceMock).createNew(TOUR_ID, CUSTOMER_ID, SCORE, COMMENT);
}

@Test
public void delete() throws Exception {
    // restTemplate.delete(TOUR_RATINGS_URL + "/" + CUSTOMER_ID); // 没有 header 的情况
    restTemplate.exchange(TOUR_RATINGS_URL, POST,
            new HttpEntity(ratingDto, jwtRequestHelper.withRole("ROLE_CSR")),
            Void.class);

    verify(serviceMock).delete(TOUR_ID, CUSTOMER_ID);
}
```
