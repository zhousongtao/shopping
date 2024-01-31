// 约定一个通用的键名
const INFO_KEY = 'xiaozhou_shopping_info' // 个人信息
const HISTORY_KEY = 'xiaozhou_history_key' // 搜索历史

export const getInfo = () => {
  const result = localStorage.getItem(INFO_KEY)
  return result ? JSON.parse(result) : { token: '', userId: '' }
}

export const setInfo = (info) => {
  localStorage.setItem(INFO_KEY, JSON.stringify(info))
}
export const removeInfo = () => {
  localStorage.removeItem(INFO_KEY)
}

export const getHistoryList = () => {
  const result = localStorage.getItem(HISTORY_KEY)
  return result ? JSON.parse(result) : []
}
export const setHistoryList = (list) => {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(list))
}
