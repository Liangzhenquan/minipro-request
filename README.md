## 基于微信小程序封装的请求库

`正常场景下， 我们的请求都需要统一配置token以及对请求和响应进行拦截，于是对小程序的请求封装了一下`

### 1.安装下载

```js
npm i minipro-request or yarn add minipro-request
```

### 2.引入以及使用

```js
// app.js
import { Request, mixedServe } from "minipro-request";
// Request可接受默认的参数，baseUrl是域名
const request = new Request({
  baseUrl: "url", //域名，
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

reqeust.post： post 请求
reqeust.get： get 请求
传染给 post 和 get 的其他请求，会覆盖 new Request 的时候的默认请求（除拦截器外） 3.使用拦截器
可通过 new Request 的时候传入拦截器,requestInterceptors 和 responseInterceptors 接受一个数组
数组可传入多个函数，函数必须 return config

```js
const reqInter = (config) => {
  config.header.token = "token";
  return config;
};
const resInter = (res) => {
  return res;
};
new Reuqest({
  requestInterceptors: [reqInter],
  responseInterceptors: [resInter],
});
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
import { Request, mixedServe } from "minipro-request";
// Request可接受默认的参数，baseUrl是域名
const request = new Request({
  baseUrl: "url", //域名，
});
const list = ['user','list']
const services = list.map((service) => require(`./services/${service}.js`));
const request = mixedServe({
  services,
  request
})
App({
  onLaunch(){},
  request
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
