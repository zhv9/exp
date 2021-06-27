# JWT Token

https://help.aliyun.com/document_detail/177489.html

## JWT 基本内容

JWT(Json Web Token) token 分三部分：

`<Header>.<Payload>.<Signature>`

- Header: Base64, 是一个 json 内容，`{'typ': 'JWT', 'alg': 'HS256'}`
- Payload: Base64, 是一个 json 内容，可以包含任意信息，可以有颁发者、用户标识、令牌受众、过期时间、令牌唯一标识等。还可以添加一些其他需要的信息
- Signature: 通过 HMACSHA256(`<Header>.<Payload>`, secret私匙) 加密

secret私匙保存在服务器端，用来签发和验证 JWT。

## JWT 在服务器端的配置

1. 首先通过算法生成用于 token 生成与验证的私匙和公匙。
2. 私匙用于授权服务签发 JWT，将其放到签发 token 的服务器上。
3. 公匙配置到 API 网关，在收到请求时，对请求验证。

## JWT 在客户端的使用方法

使用的话，一般在请求头里面添加 `Authorization`

```js
fetch('api/user/1', {
  headers: {
    'Authorization': 'Bearer ' + token
  }
})
```

- JWT 不仅可以用于认证，还可以用于传递信息。
- JWT 默认是不加密的（header 和 payload 都是 base64 编码）
