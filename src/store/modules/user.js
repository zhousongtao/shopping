import { setInfo, getInfo } from '@/utils/storage'

export default {
  namespaced: true,
  state () {
    return {
      // 个人权证相关
      // 用户信息
      userInfo: getInfo()
    }
  },
  mutations: {
    // 所有mutations的第一个参数都是state
    setUserInfo (state, data) {
      state.userInfo = data
      setInfo(data)
    }
  },
  actions: {
    logout (context) {
      // 个人信息要重置
      context.commit('setUserInfo', {})
      // 购物车信息要重置
      context.commit('cart/setCartList', [], { root: true })
    }
  },
  getters: {}
}
