class MiniproRequest {
  constructor(options) {
    const {requestInterceptors,responseInterceptors,...other} = options
    this.options = other
    this.reqInterceptors = requestInterceptors || []
    this.resInterceptors = responseInterceptors || []
  }
  useInterceptor(props) {
    const {initValue,arr} = props
    const copyOptions = Object.assign({},initValue,{})   //拷贝一份参数
    return arr.reduce((total,cur) => {
      const copyTotal = Object.assign({},total,{})
      return cur(copyTotal)
    }, copyOptions)
  }
  useReqInter(options) {
    return this.useInterceptor({
      initValue: options,
      arr: this.reqInterceptors
    })
  }
  useResInter(res) {
    return this.useInterceptor({
      initValue: res,
      arr: this.resInterceptors
    })
  }
  mergeOptions(props) {
     const {options,method} = props
     const {url,data,...otherOptions} = options
     return {
      ...this.options,
      url: this.options.baseUrl + url,
      data,
      header: {
        ...this.options.header || {},
        ...otherOptions.header || {}
      },
      ...otherOptions,
      method
     }
  }
  request(options) {
    const newOptions = this.useReqInter(this.mergeOptions(options))
    return new Promise((resolve,reject) => {
      wx.request({
        ...newOptions,
        success: (res) => {
          const newRes = this.useResInter(res)
          resolve(newRes.data)
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  }
  post(options = {}) {
    return this.request({
      options,
      method: "POST"
    })
  }
  get(options = {}) {
    return this.request({
      options,
      method: "GET"
    })
  }
}
export default MiniproRequest