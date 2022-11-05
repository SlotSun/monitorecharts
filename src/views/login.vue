<template>
  <div class="login">
    <div class="dl">
      <div class="dt">电子设备数据监控报表</div>

      <div class="dd">
        <a-input
          v-model:value="form.username"
          placeholder="请输入用户名"
          allow-clear
        />
        <a-input-password
          v-model:value="form.password"
          placeholder="请输入密码"
          class="mt20"
          @keyup.enter="tologin"/>
        <a-button type="primary" block class="mt20" @click="tologin">登录</a-button>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
export default {
  name: "loginView",
  components: {},
  data() {
    return {
      activeKey: "1",
      form: {
        username: "",
        password: "",
      },
    };
  },
  methods:{
    tologin(){
      console.log('登录', this.form)
      if(this.form.username=='admin'&&this.form.password=='123456'){
        
        localStorage.setItem('logininfo111', JSON.stringify({
          login: true,
          timestamp: Date.now()
        }))
        this.$router.push('/home')
      }
      
    }
  }
};
</script>
<style lang="less" scoped>
.login {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .dl {
    width: 500px;
    .dt {
      font-size: 30px;
      text-align: center;
      margin-bottom: 50px;
    }
  }
}
</style>
