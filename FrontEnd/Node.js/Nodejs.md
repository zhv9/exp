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

> map 数据时添加唯一 `key` 的说明：如果对一个列表做动态 `map` 的话，react 就会要求给每一条数据添加一个唯一的 key。所以在 map 任何东西的时候都需要注意给每个子元素添加一个唯一的 `key`。

在正常状况下从API返回的数据会比较慢，这样的话，用上面的方法显示数据就会导致页面已经加载完，但数据还没到的情况。这样会导致页面报错。所以一般会先给页面提供一个**空数据**，这样页面就不会报错了。然后再在后面通过 API 返回值更新这个**数据**。

```js
import React from 'react';
import ReactDOM from 'react-dom';

// 模拟 API 数据没有返回的情况
// import data from './testData';
import App from './components/App';

ReactDOM.render(
  // 1. 最初的状态
  // <App contests={data.contests} />,
  // 2. 修改后的：初始化的时候给这里传入一个空数组来使页面不会报错
  <App contests={[]} />,
  document.getElementById('root')
);
```

上面也可以不传数据给 App 组件，而是由 App 组件自己获取数据，并放到组件的 `state` 中，然后在 `componentDidMount()` 中做 `setState` 操作，将数据放入 `state` 的 `contests` 中去，页面会自动在 `state` 修改后更新。

```js
// 导入数据来模拟 API 调用
import data from '../testData';

class App extends React.Component {
  state = {
    pageHeader: 'Naming Contests',
    // 在 state 中添加一个 contests
    contests: []
  };
  componentDidMount() {
    // 在这里添加一个 setState 来模拟 API 调用
    this.setState({
      contests: data.contests
    });
  }
  componentWillUnmount() {
    // clean timers, listeners
  }
}
```

### Fetching data from a remote API

在前面有在 server.js 中启动了一个类似于下面的 API server，并且在 `api` 目录中有一个 `index.js`。我们可以将这个 `get` 操作作为获取数据的途径。

```js
server.use('/api', apiRouter);
server.use(express.static('public'));

server.listen(config.port, () => {
  console.info('Express listening on port', config.port);
});
```

在 API 代码中，我们可以读取磁盘中的数据，然后通过 get API 的 response 发送出去。

```js
import express from 'express';
// 导入磁盘中的数据
import data from '../src/testData';

const router = express.Router();

// 设置 get 的路由，并返回 contests 数据
router.get('/contests', (req, res) => {
  res.send({ contests: data.contests });
});

export default router;
```

在页面处需要通过 ajax 来获取数据，这时我们就需要一个库来简化操作，这里使用 axios 来做，执行下面的命令获取 axios。

```sh
npm i -S axios
```

然后在 componentDidMount() 中添加 axios 调用 api，axios 是基于 `promise` 的，所以后面使用 `then()` 和 `catch()` 来处理后续操作。然后通过 `setState()` 将 API 返回的数据显示到界面上。

```js
// 引入 axios 模块
import axios from 'axios';

class App extends React.Component {
  state = {
    pageHeader: 'Naming Contests',
    contests: []
  };
   componentDidMount() {
    // 现在使用的是同一个服务器地址，所以直接写路径就可以了
    axios.get('/api/contests')
      .then(resp => {
        // console.log(resp);
        // 通过在 setState 中调用返回的 resp 中的数据来更新页面信息
        this.setState({
          contests: resp.data.contests
        });
      })
      .catch(console.error);
   }
}
```

## Rendering on the Server

前面所作的大部分东西都是通过 JavaScript 渲染出来的，如果浏览器不支持 JavaScript 的话，前面的所有东西就都不会显示了。

同时为了优化搜索引擎查询结果，我们需要在服务器端渲染所有数据，然后返回附带数据的完整 html 页面给浏览器。

在取消浏览器中的 JavaScript 后，界面上就只剩下下面代码(server.js)中的 `...` 了。所以要做的就是在这个 server.js 中 get 操作的时候，**预先渲染 react 组件并且使用从 API 获取的数据**。

```js
import config from './config';
import apiRouter from './api';
import sassMiddleware from 'node-sass-middleware';
import path from 'path';

import express from 'express';
const server = express();

// ......

server.get('/', (req, res) => {
  res.render('index', {
    content: '...'
  });
});
```

### Fetching data from the server side

首先是需要让 server 代码可以获取 API 数据

1. 创建一个名为 serverRender.js 的文件，在这个文件中我们会从 API 获取数据
2. 由于需要写完整 url 并且不 hard code 所以需要在 config.js 中添加 url 配置
3. 在 serverRender.js 中调用 config 中的配置通过 axios 获取 API 中的数据
4. 在 server.js 中
   1. 引入 serverRender 来使代码生效
   2. 由于之前只**监听**了 port，在这里我们也应该**监听**一下对应的 host

> serverRender.js

```js
// fetch the data from the api
import config from './config';
import axios from 'axios';

// 这里不能使用“/api”，因为这是前端部分，所以这里需要写完整的 url。
// 为了不 hard code 需要去 config.js 中添加 url 设置。添加完设置后可以使用 ${config.serverUrl} 获取值
// 注：在``中可以使用${}来执行代码，并将返回值直接拼接到字符串上
axios.get(`${config.serverUrl}/api/contests`)
  .then(resp => {
    console.log(resp.data);
  });
```

> config.js

```js
const env = process.env;

export const nodeEnv = env.NODE_ENV || 'development';

export default {
  port: env.PORT || 8080,
  // 添加 HOST 设置，0.0.0.0 代表本地 ip
  host: env.HOST || '0.0.0.0',
  // 添加获取 url 的方法
  get serverUrl() {
    return `http://${this.host}:${this.port}`;
  }
};
```

> server.js

```js
// 下面做的 import 暂时只是为了使刚才写的代码生效
import './serverRender';

server.get('/', (req, res) => {
  res.render('index', {
    content: '...'
  });
});

server.use('/api', apiRouter);
server.use(express.static('public'));

// 这里添加了 config.host，之前因为是本地的原因就只监听了 config.port，所以这次加全。
server.listen(config.port, config.host, () => {
  console.info('Express listening on port', config.port);
});
```

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
