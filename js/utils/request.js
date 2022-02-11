/*
 * @Author: zhangchuanzhong
 * @Date: 2021-04-20 11:09:22
 * @LastEditors: xu jun, fangqi
 * @LastEditTime: 2022-01-25 09:46:42
 * @Description: request.js
 * @Copyright(c) 2021 CMIM Network Co.,Ltd. All Rights Reserved
 */
import axios from 'axios'
import { baseURL } from '@/settings'
import { SUCCESS } from '@/utils/code'
import store from '@/store'
import { debounce } from '@/utils'
import { Message } from 'element-ui'

const showErrorMessage = debounce(message => {
  Message.closeAll()
  Message.error(message || '服务器异常，请重试')
}, 1000)

const request = axios.create({
  baseURL,
  timeout: 60000, // 请求超时时间60s,
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})

// 添加请求拦截器
request.interceptors.request.use(
  config => {
    if (store.getters.userId) {
      config.headers.Authorization = store.getters.token
      config.headers.userId = store.getters.userId
      config.headers.productCode = 'ATG'
    }
    // get请求增加时间戳
    if (config.method === 'get') {
      config.params = config.params || {}
      config.params.timestamp = new Date().getTime()
    }

    // 链接上参数
    if (config.params) {
      filterFalseConf(config.params, [''])
    }
    // 请求体参数
    if (config.data) {
      filterFalseConf(config.data, ['', null, undefined])
    }

    return config
  },
  error => {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// response拦截器
request.interceptors.response.use(
  response => {
    const config = response.config
    const res = response.data || {}
    if (!['arraybuffer', 'blob'].includes(config.responseType) && res.status !== SUCCESS) {
      const message = res.messages && res.messages[0]

      // 是否显示返回的错误提示，不传默认显示，false为不显示
      if (config.showErrorMessage !== false) {
        showErrorMessage(message)
      }
      return Promise.reject(message || 'Error')
    } else {
      return response.status === 200 ? Promise.resolve(res) : Promise.reject(response)
    }
  },
  error => {
    const { response } = error

    if (!response) {
      console.warn('httpResponse为空', error)
      return Promise.reject(error)
    }
    console.warn('response:error', response)
    const { data, config, status } = response

    if (data) {
      let { message } = data
      if (config.useCustMsg) {
        message = config.useCustMsg(response)
      }
      // 是否显示返回的错误提示，不传默认显示，false为不显示
      if (config.showErrorMessage !== false || status === 401) {
        showErrorMessage(message)
      }

      // 有data时返回data
      return Promise.reject(data)
    } else {
      if (config.showErrorMessage === false) {
        return Promise.reject(error)
      }
      return handleError(status, error)
    }
  }
)

// http错误处理
function handleError(status, error) {
  switch (status) {
    case 400:
      showErrorMessage('错误的请求')
      break
    case 401:
      // 无token
      showErrorMessage('登录已过期，请重新登录')
      break
    case 403:
      // 无权限访问
      showErrorMessage('无用户信息')
      break
    case 404:
      showErrorMessage('请求的资源不存在')
      break
    case 500:
    case 502:
    case 503:
    case 504:
      showErrorMessage('服务器出错')
      break
  }
  return Promise.reject(error)
}

// 对false值做处理
function filterFalseConf(conf, faseArr) {
  for (const i in conf) {
    if (faseArr.includes(conf[i])) {
      delete conf[i]
    }
  }
}

export default request
