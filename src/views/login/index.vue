<template>
  <div class="login">
    <van-nav-bar title="会员登录" left-arrow @click-left="$router.go(-1)" />
    <div class="container">
      <div class="title">
        <h3>手机号登录</h3>
        <p>未注册的手机号登录后将自动注册</p>
      </div>

      <div class="form">
        <div class="form-item">
          <input v-model="mobile" class="inp" maxlength="11" placeholder="请输入手机号码" type="text">
        </div>
        <div class="form-item">
          <input v-model="picCode" class="inp" maxlength="5" placeholder="请输入图形验证码" type="text">
          <img v-if="picUrl" :src="picUrl" @click="getPicCode" alt="">
        </div>
        <div class="form-item">
          <input class="inp" placeholder="请输入短信验证码" type="text" v-model="msgCode">
          <button @click="getCode" >{{ second === 60 ? '获取验证码': second + '秒后重新发送'}}</button>
        </div>
      </div>

      <div class="login-btn" @click="login">登录</div>
    </div>
  </div>
</template>

<script>
import { getPicCodeApi, getMsgCodeApi, codeLoginApi } from '@/api/login'
import { mapMutations } from 'vuex'
import { addAddress } from '@/api/address'
// import { Toast } from 'vant'
export default {
  name: 'LoginPage',
  data () {
    return {
      picCode: '', // 用户输入的图形验证码
      picKey: '', // 将来请求传递的图形验证码唯一标识
      picUrl: '', // 请求返回的图形验证码图片地址
      totalSecond: 60, // 总秒数
      second: 60, // 当前秒数，开定时器 second
      mobile: '',
      msgCode: ''// 短信验证码
    }
  },
  created () {
    this.getPicCode()
  },
  methods: {
    // 获取图形验证码
    async getPicCode () {
      clearTimeout(this.timerPicCode) // 清除上一次的定时器
      this.timerPicCode = null
      this.timerPicCode = setTimeout(async () => {
        const { data: { base64, key } } = await getPicCodeApi()
        this.picUrl = base64
        this.picKey = key
        // Toast('获取图形验证码成功')
        // this.$toast('获取图形验证码成功')
      }, 300)
    },
    // 校验手机号和图形验证码是否合法
    validFn () {
      if (!/^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1589]))\d{8}$/.test(this.mobile)) {
        this.$toast.fail('请输入正确的手机号')
        return false // 手机号不合法，返回false
      }
      if (!/^\w{4}$/.test(this.picCode)) {
        this.$toast.fail('请输入四位的图形验证码')
        return false // 图形验证码不合法，返回false
      }
      return true // 手机号和图形验证码都合法，返回true
    },
    // 获取短信验证码
    async getCode () {
      if (this.validFn() === false) return // 校验手机号和图形验证码是否合法
      if (this.second === 60 && !this.timerSendCode) {
        const res = await getMsgCodeApi(this.picCode, this.picKey, this.mobile)
        this.$toast.success('短信验证码发送成功\n' + res.message)

        this.second--
        this.timerSendCode = setInterval(() => {
          this.second--
          if (this.second === 0) {
            this.second = 60
            clearInterval(this.timerSendCode)
            this.timerSendCode = null
          }
        }, 1000)
      }
    },
    // 登录
    async login () {
      if (this.validFn() === false) return // 校验手机号和短信验证码是否合法
      if (!/^\d{6}$/.test(this.msgCode)) {
        this.$toast.fail('请输入正确的短信验证码')
        return
      }
      const res = await codeLoginApi(this.mobile, this.msgCode)
      this.setUserInfo(res.data)
      // this.$store.commit('user/setUserInfo', res.data)
      this.$toast.success('登录成功')
      // 分配收货地址
      const url = this.$route.query.backUrl || '/home'
      this.$router.replace(url) // 跳转到首页
      await addAddress()
    },
    ...mapMutations('user', ['setUserInfo']),
    destroyed () {
      clearInterval(this.timerSendCode)
      clearTimeout(this.timerPicCode)
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  padding: 49px 29px;

  .title {
    margin-bottom: 20px;
    h3 {
      font-size: 26px;
      font-weight: normal;
    }
    p {
      line-height: 40px;
      font-size: 14px;
      color: #b8b8b8;
    }
  }

  .form-item {
    border-bottom: 1px solid #f3f1f2;
    padding: 8px;
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    .inp {
      display: block;
      border: none;
      outline: none;
      height: 32px;
      font-size: 14px;
      flex: 1;
    }
    img {
      width: 94px;
      height: 31px;
    }
    button {
      height: 31px;
      border: none;
      font-size: 13px;
      color: #cea26a;
      background-color: transparent;
      padding-right: 9px;
    }
  }

  .login-btn {
    width: 100%;
    height: 42px;
    margin-top: 39px;
    background: linear-gradient(90deg,#ecb53c,#ff9211);
    color: #fff;
    border-radius: 39px;
    box-shadow: 0 10px 20px 0 rgba(0,0,0,.1);
    letter-spacing: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
