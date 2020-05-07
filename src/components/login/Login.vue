<template>
  <div class="login-wrrapper">
    <div class="login-box">
      <!-- 头像盒子 -->
      <div class="login-logo">
        <img alt src="../../assets/loginLogo.jpg" />
      </div>
      <!-- 表单盒子 -->
      <el-form
        :model="loginForm"
        :rules="rules"
        class="form-box"
        label-width="0px"
        ref="loginFormRef"
      >
        <el-form-item prop="username">
          <el-input prefix-icon="iconfont icon-username" v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input prefix-icon="iconfont icon-mima" type="password" v-model="loginForm.password"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button @click="submitData" type="primary">登录</el-button>
          <el-button @click="resetLoginData" type="info">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      // 这是登录表单的数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 这是表单的验证规则对象
      rules: {
        // 用户名验证规则
        username: [
          // required表示是否为必填项; message表示提示信息; trigger表示什么方式触发
          { required: true, message: '请输入用户名', trigger: 'blur' },
          // min表示最小长度; max表示最大长度; message表示提示信息; trigger表示什么方式触发
          { min: 1, max: 16, message: '长度在 1 到 16 个字符', trigger: 'blur' }
        ],
        // 密码的验证规则
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
        ]
      },
      action: '不存在'
    }
  },
  methods: {
    // 表单重置按钮的定义使用
    resetLoginData() {
      // resetFields()element-ui中的表单属性，需要先获取到表单的实例对象，才能调用触发，
      // 对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
      this.$refs.loginFormRef.resetFields()
    },
    submitData() {
      // 提交数据前，需要预校验数据是否合法
      /**
       * 对整个表单进行校验的方法，参数为一个回调函数。
       * 该回调函数会在校验结束后被调用，并传入两个参数：是否校验成功和未通过校验的字段。
       * 若不传入回调函数，则会返回一个 promise
       */
      this.$refs.loginFormRef.validate(async v => {
        if (!v) {
          this.$message.error({
            message: '请填写完整信息',
            duration: 1500
          })
          return
        }
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) {
          // 验证失败，弹出提示框
          this.$message.error({
            message: '您输入的信息不正确，请重新确认并登录',
            duration: 1500
          })
          this.$refs.loginFormRef.resetFields()
        } else {
          /**
           * 登录验证成功之后需要进行的操作
           * 1. 将登录成功之后返回的 token，保存到客户端中的 sessionStorage 中
           *    1.1 项目中除了登录之外的其他API接口，必须在登录之后才能访问
           *    1.2 token 只赢在当前网站打开期间生效，所以将 token 保存在 sessionStorage 中
           * 2. 通过编程式导航跳转到后台主页，路由地址是 '/home'
           */
          window.sessionStorage.setItem('token', res.data.token)
          this.$router.push('/home')
        }
      })
    }
  }
}
</script>

<style scoped>
.login-wrrapper {
  height: 100%;
  background-color: #2b4b6b;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-box {
  width: 500px;
  height: 320px;
  background-color: #fff;
  border-radius: 15px;
  position: relative;
}

.login-logo {
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 150px;
  height: 150px;
  padding: 5px;
  background-color: #fff;
  border: 1px solid #eee;
  border-radius: 50%;
  box-shadow: 0 0 10px #ddd;
}

.login-logo img {
  width: 100%;
  border-radius: 50%;
}

.form-box {
  width: 100%;
  padding: 20px;
  position: absolute;
  bottom: 0;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
