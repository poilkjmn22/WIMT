/*
 * @Author: zhangchuanzhong
 * @Date: 2021-04-15 15:08:24
 * @LastEditors: fangqi
 * @LastEditTime: 2022-01-14 11:24:16
 * @Description: 工具函数
 * @Copyright(c) 2021 CMIM Network Co.,Ltd. All Rights Reserved
 */
/**
 * @功能 按格式转换日期 yyyy-MM-dd h:m:s
 * @参数 <Date> date
 * @参数 <String> fmt
 * @use dateFormat(new Date(), 'yyyy-MM-dd h:m:s');
 */
// 默认时间格式
const defaultDateFormat = 'yyyy-MM-dd'

export const dateFormat = (date, fmt = defaultDateFormat) => {
  const o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    S: date.getMilliseconds()
  }

  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, `${date.getFullYear()}`.substr(4 - RegExp.$1.length))
  }

  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : `00${o[k]}`.substr(`${o[k]}`.length))
    }
  }

  return fmt
}

// 格式化daterange
export const formatDateRange = (range, fmt = defaultDateFormat, allrange = true) => {
  if (range && range.length > 1) {
    let [start, end] = range
    if (typeof start === 'string') {
      start = new Date(start)
    }
    if (typeof end === 'string') {
      end = new Date(end)
    }
    if (fmt === defaultDateFormat && allrange) {
      return [`${dateFormat(start, fmt)} 00:00:00`, `${dateFormat(end, fmt)} 23:59:59`]
    } else {
      return [`${dateFormat(start, fmt)}`, `${dateFormat(end, fmt)}`]
    }
  } else {
    return []
  }
}

// 时间间隔是否大于n天
export const timePeriodGretterThanNday = (start, end, n) => {
  if (start && end) {
    return new Date(end.substring(0, 10)).getTime() - new Date(start.substring(0, 10)).getTime() > n * 24 * 60 * 60 * 1000
  } else {
    return false
  }
}

// 周范围
export const getWeekRange = (year, month, date, day) => {
  if (day === 0) {
    day = 7
  }
  const start = dateFormat(new Date(year, month - 1, date - day + 1))
  const end = dateFormat(new Date(year, month - 1, date - day + 7))

  return [`${start} 00:00:00`, `${end} 23:59:59`]
}

// 月范围
export const getMonthRange = (year, month) => {
  const start = dateFormat(new Date(year, month - 1, 1))
  const end = dateFormat(new Date(year, month - 1 + 1, 0))

  return [`${start} 00:00:00`, `${end} 23:59:59`]
}

// 根据月份返回季度初始月
export const getSeasonStartMonth = month => {
  return (Math.ceil(month / 3) - 1) * 3 + 1
}

// 季度范围
export const getSeasonRange = (year, month) => {
  month = getSeasonStartMonth(month)

  const start = dateFormat(new Date(year, month - 1, 1))
  const end = dateFormat(new Date(year, month - 1 + 3, 0))

  return [`${start} 00:00:00`, `${end} 23:59:59`]
}

// 年范围
export const getYearRange = year => {
  return [`${year}-01-01 00:00:00`, `${year}-12-31 23:59:59`]
}

// 获取周期时间范围
export const getPeriodDateRange = (datetime, period = 'month') => {
  let d = datetime
  if (typeof datetime === 'string') {
    d = new Date(datetime.replace(/-/g, '/'))
  }
  const year = d.getFullYear()
  const month = d.getMonth() + 1
  const date = d.getDate()
  const day = d.getDay()

  switch (period) {
    case 'week':
      return getWeekRange(year, month, date, day)
    case 'season':
      return getSeasonRange(year, month)
    case 'year':
      return getYearRange(year)
    default:
      return getMonthRange(year, month)
  }
}

// 获取菜单按钮的权限
export const formatUserMenus = menus => {
  const result = menus?.reduce((obj, { resourceContent, children }) => {
    if (resourceContent) {
      obj[resourceContent] = true
    }
    if (children && children.length > 0) {
      obj = {
        ...obj,
        ...formatUserMenus(children)
      }
    }
    return obj
  }, {})

  return result || {}
}

// 获取label的值
export const getLabel = (value, arr) => {
  const result = arr.filter(item => item.value === value)[0]
  if (result) {
    return result.label
  }
  return null
}

// 获取pageNum
export const getPageNum = ({ pageNum, pageSize, total, list }) => {
  let result = null
  const pages = Math.ceil(+total / +pageSize)
  // 最后一页数据且只有一条数据时
  if (+pageNum > 1 && +pageNum === pages) {
    if (list.length === 1) {
      result = +pageNum - 1
    }
  }
  return result
}

// 防抖
export const debounce = (func, wait = 500) => {
  let timeout
  return (event, ...rest) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      func(event, ...rest)
    }, wait)
  }
}

// 生成唯一id
export const idGenerator = () => {
  return (Number(Math.random().toString().substr(2, 10)) * 1000 + Date.now()).toString(36)
}

export function formatObj(obj) {
  return Object.keys(obj).map(key => {
    return {
      label: obj[key],
      value: key
    }
  })
}

// 下载blob文件
export const downloadBlobFile = (data, fileName, type = 'application/vnd.ms-excel') => {
  const blob = new Blob([data], { type })

  if (window.navigator.msSaveOrOpenBlob) {
    navigator.msSaveBlob(blob, fileName)
  } else {
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    window.URL.revokeObjectURL(link.href)
  }
}

//轮询方式执行一个函数
export function pollingFunc(cb, interval = 10000, options = { leading: true, cancel: false }) {
  let id
  function innerPolling() {
    clearTimeout(id)
    id = setTimeout(() => {
      if (!options.cancel) {
        cb()
        innerPolling()
      }
    }, interval)
  }
  if (options.leading) {
    cb()
  }
  innerPolling()
}

export function once(func, execTimesLimit = 1) {
  let execTimes = 0
  return function () {
    const args = [...arguments]
    if (execTimes < execTimesLimit) {
      execTimes++
      func.apply(this, args)
    }
  }
}

function isArray(obj) {
  if (Array.isArray) {
    return Array.isArray(obj)
  }
  return Object.prototype.toString.call(obj) === '[object Array]'
}

function isIntegerLike(obj) {
  return /^-?\d+$/.test(obj)
}

export function insertAfter(arr, index, item) {
  if (!isArray(arr)) {
    return arr
  }
  const res = []
  if (index < 0) {
    res.push(item)
  }
  for (let i = 0; i < arr.length; i++) {
    res.push(arr[i])
    if (i === index) {
      res.push(item)
    }
  }
  return res
}

export function moveAfter(arr, destIndex, srcIndex) {
  if (!isArray(arr)) {
    return arr
  }
  if (!isIntegerLike(destIndex) || !isIntegerLike(srcIndex)) {
    throw new Error('参数类型不正确(expect: Intger Like value)')
  }
  if (srcIndex < 0) {
    return arr
  }
  if (destIndex >= arr.length) {
    destIndex = arr.length - 1
  }
  const res = []
  for (let i = 0; i < arr.length; i++) {
    if (i !== srcIndex) {
      res.push(arr[i])
    }
    if (i === destIndex) {
      res.push(arr[srcIndex])
    }
  }

  return res
}

export function arrSwap(arr, idx1, idx2) {
  const tmp = arr[idx1]
  arr[idx1] = arr[idx2]
  arr[idx2] = tmp
}

export function arrLast(arr) {
  return arr[arr.length - 1]
}

export function arrRemoveAt(arr, idx) {
  arr.splice(idx, 1)
}

export function arrRemoveLast(arr) {
  arr.splice(arr.length - 1, 1)
}

export function getLongestContinuousSubstring(source, continuousStep = 1) {
  if (typeof source !== 'string') {
    return 0
  }
  const continuous = []
  let i = source.length
  let continuousLength = 1
  while (i > 0) {
    i--
    if (i > 0 && source.charCodeAt(i) - source.charCodeAt(i - 1) === continuousStep) {
      continuousLength += 1
    } else {
      if (continuousLength > 1) {
        continuous.push([i, continuousLength])
      }
      continuousLength = 1
    }
  }
  let max = 1
  for (const c of continuous) {
    max = Math.max(max, c[1])
  }
  return max
}

export function hasContinuousSubstring(source, continuousStep = 1, threshold = 3) {
  return getLongestContinuousSubstring(source, continuousStep) >= threshold
}
