import axios from 'axios'


// 创建axios实例
const request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL as string,
  timeout: 30000,
})

// request拦截器
request.interceptors.request.use(
  config => {
    return config
  },
  error => {
    console.log(error)
    Promise.reject(error)
  }
)

// response 拦截器
request.interceptors.response.use(
  response => {
    // 对响应数据做点什么
    return response.data
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)
export default request