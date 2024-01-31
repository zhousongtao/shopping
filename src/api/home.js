import requst from '@/utils/request'

// 获取首页数据
export const getHomeData = () => {
  return requst.get('/page/detail', {
    params: {
      pageId: 0
    }
  })
}
