<template>
  <div id="app" >
    <keep-alive :include="['LayoutIndex']">
    <router-view/>
    </keep-alive>
  </div>
</template>
<script>
export default {
  data () {
    return {
      checked: true,
      value: 3
    }
  }
}
</script>

<style lang="less">
.box {
  width: 300px;
  height: 300px;
  background-color: pink;
}
</style>
