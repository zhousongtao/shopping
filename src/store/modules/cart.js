import { getCartList, updateCart, delSelectCart } from '@/api/cart.js'
import { Toast } from 'vant'

export default {
  namespaced: true,
  state () {
    return {
      cartList: []
    }
  },
  mutations: {
    // 修改state中的数据
    setCartList (state, payload) {
      state.cartList = payload
    },
    // 小选控制全选
    changeItemChecked (state, payload) {
      const goodsStatus = state.cartList.find(item => item.goods_id === payload)
      goodsStatus.isChecked = !goodsStatus.isChecked
    },
    toggleAllChecked (state, payload) {
      state.cartList.forEach(item => {
        item.isChecked = payload
      })
    },
    changeCount (state, { goodsId, goodsNum }) {
      const goods = state.cartList.find(item => item.goods_id === goodsId)
      goods.goods_num = goodsNum
    }
  },
  actions: {
    async getCart (context) {
      const { data } = await getCartList()
      // 后台返回的数据中，不包含复选框的选中状态，为了实现将来的功能
      // 需要手动维护数据，给每一项添加一个isChecked状态 标记当前商品是否选中
      data.list.forEach(item => {
        item.isChecked = false
      })
      context.commit('setCartList', data.list)
    },
    async changeItemCount (context, obj) {
      const { goodsNum, goodsId, goodsSkuId } = obj
      // 先本地修改
      context.commit('changeCount', { goodsId, goodsNum })
      // 在同步到后台
      await updateCart(goodsId, goodsNum, goodsSkuId)
    },
    async delCart (context) {
      const selCartList = context.getters.selCartList.map(item => item.id)
      await delSelectCart(selCartList)
      context.dispatch('getCart')
      Toast('删除成功')
    }
  },
  getters: {
    // 计算所有商品总数
    cartTotal (state) {
      return state.cartList.reduce((p, c) => p + c.goods_num, 0)
    },
    // 选中的商品项
    selCartList (state) {
      return state.cartList.filter(item => item.isChecked)
    },
    // 选中的总数
    selCount (state, getters) {
      return getters.selCartList.reduce((p, c) => p + c.goods_num, 0)
    },
    // 选中的总价
    selPrice (state, getters) {
      return getters.selCartList.reduce((p, c) => p + c.goods_num * c.goods.goods_price_min, 0).toFixed(2)
    },
    // 是否全选
    isAllchecked (state) {
      return state.cartList.every(item => item.isChecked)
    }

  }
}
