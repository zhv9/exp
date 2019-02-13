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

## Node as a Web Server

### Import module

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
### Use https and http

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
### Use express

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

## React basic

### Generate from react to js and add to html

1. 使用 react 编写好代码。
2. 然后使用 npm run dev(webpack -wd) 生成 bundle.js 文件，这个文件会自动放入 public 目录中。
3. 在 html 中添加生成后 bundle.js 文件的引用。
4. 运行 node server。

```js
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
  <h2 className="text-center">
    Hello React with JSX!!
  </h2>,
  document.getElementById('root')
);
```

```html
<!-- index.ejs -->
<%- include('header') -%>
  <div id="root"><%- content -%></div>
<%- include('footer') -%>

<!-- footer.ejs -->
<script src="/bundle.js" charset="utf-8"></script>

</body>
</html>
```

### React Components Props

React 使用 props 来将父级数据传递给子级，对于传递的数据需要对类型做校验

```jsx
import React from 'react';
import ReactDOM from 'react-dom';

// 从父级获取 props 到子模块，子模块就可以使用 “props.” 来使用传递来的数据了
const App = (props) => {
  return (
    <h2 className="text-center">
      {props.headerMessage}
    </h2>
  );
};

// 类型校验
App.propTypes = {
  headerMessage: React.PropTypes.string.isRequired // 如果这个传递参数是必要的，则加上".isRequired"
};

// 如果父级有可能没有传递数据，则可以设置默认 props
App.defaultProps = {
  headerMessage: 'Hello!!'
};

ReactDOM.render(
  <App headerMessage="Hello props!"/>,
  document.getElementById('root')
);
```

### 模块组件化

```jsx
// 将 Header 提取为一个组件，并从父级(App)获取一个 message 显示。
const Header = ({ message }) => {
  return (
    <h2 className="text-center">
      {message}
    </h2>
  );
};

Header.propTypes = {
  message: React.PropTypes.string
};

// 在 App 组件中引用上面写的 Header 组件，这样来使程序组件化
const App = () => {
  return (
    <div className="App">
      // 这里引用组件
      <Header message="Naming Contests" />
      <div>
        ...
      </div>
    </div>
  );
};

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
```

> 上面的代码实际上由三部分组成：Header, App, ReactDOM.render。在实际工作中应该将这三份部分分开到不同文件中去，一般是分开放到 src/components 目录中。

### Components Stats

如果需要使用动态数据(stats)则需要将前面所说的 function 改为 class 并继承 React.Component

```jsx
import React from 'react';
import Header from './Header';

class App extends React.Component {
  state = {
    pageHeader: 'Naming Contests'
  };
  render() {
    return (
      <div className="App">
        <Header message={this.state.pageHeader} />
        <div>
          ...
        </div>
      </div>
    );
  }
}

export default App;
```

### Component Life Cycle

在生命周期中比较重要的两个是：

- componentDidMount()：在组件加载后执行的内容，一般将 ajax, timer, listeners 放在这里。
- componentWillUnmount()：在组件卸载时执行，一般是放 clean timer, listener。


```jsx
import React from 'react';
import Header from './Header';

class App extends React.Component {
  state = {
    pageHeader: 'Naming Contests'
  };
  componentDidMount() {
    //ajax, timers, listeners
  }
  componentWillUnmount() {
    // clean timers, listeners
  }
  render() {
    return (
      <div className="App">
        <Header message={this.state.pageHeader} />
        <div>
          ...
        </div>
      </div>
    );
  }
}

export default App;
```

## Working with data

### Loading Data

```json
{
  "contests": [
    {
      "id": 1,
      "categoryName": "Business/Company",
      "contestName": "Cognitive Building Bricks"
    },
    {
      "id": 2,
      "categoryName": "Magazine/Newsletter",
      "contestName": "Educating people about sustainable food production"
    },
    {
      "id": 3,
      "categoryName": "Software Component",
      "contestName": "Big Data Analytics for Cash Circulation"
    },
    {
      "id": 4,
      "categoryName": "Website",
      "contestName": "Free programming books"
    }
  ]
}
```

> 对于上面的 json 文件，首先需要添加 json-loader 依赖，然后在 webpack 中添加 loader 设置，使 webpack 可以处理 json 文件。

```js
module.exports = {
  entry: './src/index.js',
  output: {
    path: __dirname + '/public',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader'
      }
    ]
  }
};
```

> 通过 import 导入 json 文件，然后就可以直接使用了。

```js
import React from 'react';
import ReactDOM from 'react-dom';

// 导入 json 数据
import data from './testData';
console.log(data);

import App from './components/App';

// 用 data.contests 使用数据
ReactDOM.render(
  <App contests={data.contests} />,
  document.getElementById('root')
);
```

### Displaying a list of objects

在显示一个 object 对应的列表内容的时候，一般是将单个内容使用组件包装起来，然后在父组件中将列表中的数据通过包装好的组件填充到界面上。

```js
// **显示列表中的一个数据**
import React from 'react';

const ContestPreview = (contest) => (
  <div className="ContestPreview">
    <div>
      {contest.categoryName}
    </div>
    <div>
      {contest.contestName}
    </div>
  </div>
);

export default ContestPreview;
```

```js
// 遍历整个列表，每个 object 对应(map)一个 ContestPreview 组件
render() {
  return (
    <div className="App">
      <Header message={this.state.pageHeader} />
      <div>
        // **使用map来遍历整个数组**
        {this.props.contests.map(contests =>
          <ContestPreview {...contests} />
        )}
        // **显示单个数据**
        {/* <ContestPreview {...this.props.contests[0]} /> */}
      </div>
    </div>
  );
}
```

### Using Sass with Node

为了让页面显示更好看一些，需要使用 css 样式来应用样式，但是普通的 css 的写法太过麻烦，所以这里使用 sass，并在 ContestPreview 中引用样式。

```css
.ContestPreview {
  margin: 1em;
  border: 1px solid #ccc;

  .category-name {
    border-bottom: 1px solid #ccc;
    padding: 0.25em 0.5em;
    font-weight: bold;
    background-color: #eee;
  }

  .contest-name {
    padding: 0.5em;
  }
}
```

在代码中引用样式

```js
import React from 'react';

const ContestPreview = (contest) => (
  <div className="ContestPreview"> // 添加对应的 class
    <div className="category-name"> // 添加对应的 class
      {contest.categoryName}
    </div>
    <div className="contest-name"> // 添加对应的 class
      {contest.contestName}
    </div>
  </div>
);

export default ContestPreview;
```

为了使用 sass 

1. 首先需要安装 node-sass-middleware 来让程序可以识别 sass

```sh
npm install node-sass-middleware
```

2. 其次在 server.js 中调用 sassMiddleware 将 sass 编译为 css

```js
import sassMiddleware from 'node-sass-middleware';
server.use(sassMiddleware({
  src: path.join(__dirname, 'sass'), // sass 文件存放的目录
  dest: path.join(__dirname, 'public') // 生成的 css 文件存放的目录
}));
```

3. 然后将 css 文件的引用添加到 header.ejs 中

```html
<link rel="stylesheet" href="/style.css" media="screen">
```

### Reading from the state

### Fetching data from a remote API

## Rendering on the Server

### Fetching data from the server side

### Server rendering with ReactDOMServer

### Fix the checksum problem

## Routing on Client and Server

### Handling the contest click event

### Navigating to a contest

### Looking up the contest on route change

### Fetching contest information from the API

### A bit of refactoring

### Server-side routing for a contest

### Navigating to a list of contests

### Handling the browser's back button

## Working with MongoDB

### Reading data from MongoDB

### API to fetch a list of names

### Displaying the list of names

### Example script to update all data

### Converting the application to use _id

### Creating an API to propose a name

### Wiring the proposed new name form

### Challenges and QA

### Alternatives: MERN and Electrode
