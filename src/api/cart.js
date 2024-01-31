import request from '@/utils/request'
// 加入购物车
export const addCart = (goodsId, goodsNum, goodsSkuId) => {
  return request.post('/cart/add', { goodsId, goodsNum, goodsSkuId })
}

// 获取购物车列表
export const getCartList = () => {
  return request.get('/cart/list')
}

// 购物车商品更新
export const updateCart = (goodsId, goodsNum, goodsSkuId) => {
  return request.post('/cart/update', { goodsId, goodsNum, goodsSkuId })
}

// 删除购物车商品
export const delSelectCart = (cartIds) => {
  return request.post('/cart/clear', { cartIds })
}
