import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, AxiosInstance } from 'axios'
import { isLogin, getToken } from '@/utils/auth'
import { ElNotification } from 'element-plus'
import { useUserStore } from '@/store'
import { useRouter } from "vue-router";

const baseURL = <string>import.meta.env.VITE_APP_BASE_API

const service: AxiosInstance = axios.create({
  baseURL,
  timeout: 5000
})

// 请求前的统一处理
service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    if (isLogin()) {
      if (config.headers) config.headers['Authorization'] = getToken()
    }
    if (config.headers) config.headers['Content-Type'] = 'application/json'
    return config
  },
  (error: AxiosError) => {
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data
  },
  (error: AxiosError) => {
    // 兼容blob下载出错json提示
    if (error.response && error.response.data instanceof Blob && error.response.data.type.toLowerCase().indexOf('json') !== -1) {
      const reader = new FileReader()
      reader.readAsText(error.response.data, 'utf-8')
      reader.onload = function () {
        const errorMsg = JSON.parse(<string>reader.result).message
        ElNotification.error({
          title: errorMsg,
          duration: 5000
        })
      }
    } else {
      let code = 0
      try {
        code = error.response && error.response.data.status
      } catch (e) {
        if (error.toString().indexOf('Error: timeout') !== -1) {
          ElNotification.error({
            title: '网络请求超时',
            duration: 5000
          })
          return Promise.reject(error)
        }
      }
      console.log(code)
      if (code) {
        if (code === 401) {
          useUserStore().logOut().then(() => {
            // 用户登录界面提示
            ElNotification({
              title: '提示',
              message: '当前登录状态已过期，请重新登录！',
              type: 'warning',
              duration: 5000
            })
            location.reload()
          })
        } else if (code === 403) {
          const router = useRouter()
          router.push({ path: '/401' })
        } else {
          const errorMsg = error.response && error.response.data.message
          if (errorMsg !== undefined) {
            ElNotification.error({
              title: errorMsg,
              duration: 5000
            })
          }
        }
      } else {
        ElNotification.error({
          title: '接口请求失败',
          duration: 5000
        })
      }
    }
    return Promise.reject(error)

  }
)


export default service