// 格式化时间
export const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  return `${hours}小时${minutes}分钟`
}

// 格式化价格
export const formatPrice = (price) => {
  return `￥${price.toFixed(2)}`
}

// 防抖函数
export const debounce = (fn, delay) => {
  let timer = null
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

// 节流函数
export const throttle = (fn, delay) => {
  let last = 0
  return function (...args) {
    const now = Date.now()
    if (now - last > delay) {
      last = now
      fn.apply(this, args)
    }
  }
}

// 深拷贝
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj
  const copy = Array.isArray(obj) ? [] : {}
  Object.keys(obj).forEach(key => {
    copy[key] = deepClone(obj[key])
  })
  return copy
} 