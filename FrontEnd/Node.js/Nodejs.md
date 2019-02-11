# Node js

## Setup and configurations

### Install dependencies
https://jscomplete.com/learn/create-javascript-development-environment-node-react

```sh
# Initializing
npm init
# Installing Main Dependencies
npm install --save express

npm i -S mongodb
npm i -S react react-dom
npm install --save-dev webpack

# Installing Development Dependencies
# npm i webpack webpack-cli
npm i -D babel-cli babel-loader babel-preset-es2015 babel-preset-stage-2 babel-preset-react
# nodemon 自动检查代码变化并重启 node
npm i -D nodemon

npm i -D eslint eslint-plugin-react babel-eslint

```
### Create files

创建一些文件

src/index.js
public/index.html
api/index.js
server.js

### Add configuration

#### package.json

在 package.json 中创建一些常用的命令

```json
"scripts": {
  "start": "nodemon --exec babel-node server.js --ignore public/",
  "dev": "webpack -wd"
},
```

#### webpack.config.js

设置使用 webpack 打包的时候需要执行的操作

```js
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve('public'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }
};
```

#### babel.config.js

babel 设置

```js
module.exports = {
  presets: ['@babel/react', '@babel/env'],
  plugins: ['@babel/plugin-proposal-class-properties']
};
```

#### eslintrc.js

eslint 设置


## Import module

通过使用 import 导入模块，如果需要导入非 default 的模块，则需要使用解构方法 {...}

下面的 config 是 export default 的模块，其他的是非 default 模块。

```js
// server.js
import config, { nodeEnv, logStars } from './config';

console.log(config, nodeEnv);

logStars('Use function');

// config.js
const env = process.env;

export const nodeEnv = env.NODE_ENV || 'development';

export const logStars = function(message){
  console.log('******');
  console.log(message);
  console.log('******');
};

export default {
  port: env.PORT || 8080
};
```
## Use https and http

```js
import https from 'https';
import http from 'http';

// use https
https.get('https://www.bing.com', res => {
  console.log('Response code is:', res.statusCode);
  res.on('data', chunk => {
    console.log(chunk.toString());
  });
});

// use http server
const server = http.createServer();

server.on('request', (req, res)=> {
  res.write('hello http\n');
  setTimeout(()=> {
    res.write('time out\n');
    res.end();
  }, 3000);
});

server.listen(8080);
```
## Use express

使用 express 可以简化很多东西，比如下面代码中代替“fs”的部分。

```js
import config, { nodeEnv, logStars } from './config';
import express from 'express';
import fs from 'fs';

server.get('/', (req, res)=>{
  res.send('Hello Express');
});

// 使用 express.static 代替 fs 读取文件
server.use(express.static('public'));

// server.get('/about.html', (req, res)=>{
//   fs.readFile('./public/about.html', (err, data)=>{
//     res.send(data.toString());
//   });
// });

server.listen(config.port, ()=> {
  console.info('Express listening on port:', config.port);
});
```
### Use API router

在使用 API 的时候，可以通过导入 express.Router() 来做。

```js
// api/index.js
import express from 'express';

const router = express.Router();
router.get('/', (req, res)=>{
  res.send({data:[]});
});

export default router;

// server.js
import apiRouter from './api';
server.use('/api', apiRouter);

```
