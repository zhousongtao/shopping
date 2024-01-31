export default {
  // 此处编写的就是Vue 组件实例的配置项 通过一定语法 可以直接混入到组件内部
  // data methods computed 生命周期函数...
  // 注意点：如果此处和组件内提供了同名的data活methods 则组件内优先级更高
  // 如果编写了生命周期函数，则mixins中的生命周期函数 和 页面的生命周期函数，会用数组管理统一执行
  data () {
    return {
      title: '标题'
    }
  },
  methods: {
    loginConfirm () {
      // 判断token是否存在
      const token = this.$store.getters.token
      if (!token) {
        // 弹确认框
        this.$dialog.confirm({
          title: '温馨提示',
          message: '此时需要先登录才能继续操作',
          confirmButtonText: '去登录',
          cancelButtonText: '再逛逛'
        }).then(() => {
          // 如果希望，跳转到登录 => 登录后能回跳回来，需要在跳转去携带参数(当前的路径地址)
          // this.$route.fullPath会包含查询参数
          this.$router.replace({
            path: '/login',
            query: {
              backUrl: this.$route.fullPath
            }
          })
        }).catch(() => { })
        return true
      }
      return false
    }
  }
}
