## 基于微信小程序封装的请求库

`正常场景下， 我们的请求都需要统一配置token以及对请求和响应进行拦截，于是对小程序的请求封装了一下`

### 1.安装下载

```js
npm i minipro-request or yarn add minipro-request
```

### 2.引入以及使用

```js
// app.js
import Request, { mixedServe } from 'minipro-request';
// Request可接受默认的参数
const request = new Request({
  timeout: 10000, // 默认配置
});
App({
  onLaunch() {},
  request,
});
```

```js
// pages/index/index.js
const app = getApp()
Page({
  onLoad() {
    this.getData()
  },
  async getData() {
    const res = await app.request.post({
      url: "/login",
      data: {},
      ...
    })
  }
})
```

### 响应和请求拦截

```js
const req = new Request({
  timeout: 10000,
});
req.useRequestInterceptor((config) => {
  config.url = 'http://localhost:8080/' + (config.url || '');
  config.header.Authorization = `Bearer`;
  return config;
});
req.useResponseInterceptor(
  (res) => {
    console.log('响应成功', res);
  },
  (err) => {
    console.log('响应失败', err);
  },
);
```

### 3.混入请求

有时候，我们不同的模块，会生成不同的请求文件
| servers
--| user.js
--| list.js  
 ...
提供了对请求的混入

```js
// services/user.js
class User {
  getUser(data) {
    return this.request.post({
      url: "/login",
      data
    })
  }
}

// app.js
import Request,{ mixedServe } from "minipro-request";
// Request可接受默认的参数
const request = new Request({
  timeout: 10000, // 默认配置
});
const list = ['user','list']
const services = list.map((service) => require(`./services/${service}.js`));
const fetch = mixedServe({
  services,
  request
})
App({
  onLaunch(){},
  request:fetch
})

//pages/index/index.js
const app = getApp()
Page({
  onLoad() {
    this.getData()
  }
  async getData() {
    const res = await app.request.getUser({
      name: '123'
    })
  }
})
```
