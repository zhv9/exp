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

src/index.js
public/index.html
api/index.js
server.js

### Add script

package.json
```json
"scripts": {
  "start": "nodemon --exec babel-node server.js --ignore public/",
  "dev": "webpack -wd"
},
```
webpack.config.js

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

babel.config.js

```js
module.exports = {
  presets: ['@babel/react', '@babel/env'],
  plugins: ['@babel/plugin-proposal-class-properties']
};
```

eslintrc.js

## Import module

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