class Request {
  constructor(props = {}) {
    this.globalOptions = {
      header: {},
      ...props,
    };
    this.interceptors = {
      request: [],
      response: [],
    };
  }
  useRequestInterceptor(resolved, rejected) {
    this.interceptors.request.push({ resolved, rejected });
  }
  useResponseInterceptor(resolved, rejected) {
    this.interceptors.response.push({ resolved, rejected });
  }
  get(options = {}) {
    return this.run({
      ...options,
      method: 'GET',
    });
  }
  post(options = {}) {
    return this.run({
      ...options,
      method: 'POST',
    });
  }
  request(options = {}) {
    return new Promise((resolve, reject) => {
      wx.request({
        ...options,
        success: (res) => {
          resolve(res);
        },
        fail: (err) => {
          reject(err);
        },
      });
    });
  }
  run(config) {
    const chain = [
      {
        resolved: this.request,
        rejected: undefined,
      },
    ];
    this.interceptors.request.forEach((interceptor) => {
      chain.unshift(interceptor);
    });
    this.interceptors.response.forEach((interceptor) => {
      chain.push(interceptor);
    });
    let promise = Promise.resolve({ ...this.globalOptions, ...config });
    while (chain.length) {
      const { resolved, rejected } = chain.shift();
      promise = promise.then(resolved, rejected);
    }
    return promise;
  }
}

export default Request;
