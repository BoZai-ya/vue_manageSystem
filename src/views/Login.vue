<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 登录图片 -->
      <div class="login_img">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 表单 -->
      <el-form
        ref="loginForm"
        label-width="0"
        class="login_form"
        :model="loginInfo"
        :rules="rules"
      >
        <el-form-item prop="username">
          <el-input
            placeholder="请输入用户名"
            prefix-icon="el-icon-user"
            v-model="loginInfo.username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            placeholder="请输入密码"
            prefix-icon="el-icon-goods"
            type="password"
            v-model="loginInfo.password"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" size="small" @click="login">登录</el-button>
          <el-button type="info" size="small" @click="resetLoginFrom"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginInfo: {
        username: "admin",
        password: "123456",
      },
      // 表单验证规则
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 10,
            message: "长度在 6 到 10 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    // 登录验证
    // validate:	对整个表单进行校验的方法，参数为一个回调函数。该回调函数会在校验结束后被调用，并传入两个参数：是否校验成功和未通过校验的字段。若不传入回调函数，则会返回一个 promise
    login() {
      this.$refs.loginForm.validate(async (info) => {
        // console.log(info);
        if (!info) return;
        const { data: result } = await this.$axios.post(
          "login",
          this.loginInfo
        );
        // console.log(result);
        // 判断登录状态码 meta.status
        if (result.meta.status !== 200) {
          this.$message.error("用户名或密码输入错误");
        } else {
          this.$message.success("登录成功");
          window.sessionStorage.setItem("token", result.data.token);
          this.$router.push("/home");
        }
      });
    },

    // 重置按钮
    resetLoginFrom() {
      this.$refs.loginForm.resetFields();
    },
  },
};
</script>

<style scoped>
.login_container {
  background-color: rgb(177, 209, 228);
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login_box {
  width: 400px;
  height: 300px;
  background-color: #fff;
  border-radius: 5px;
}
.login_box .login_img {
  width: 150px;
  border-radius: 50%;
  box-shadow: 0 2px 15px 1px;
  margin-top: -50px;
  margin-left: 32%;
  background-color: #ccc;
}
.login_box .login_img img {
  width: 100%;
  margin: 0 auto;
  border-radius: 50%;
}
.login_form {
  margin-top: 10px;
  padding: 20px;
  box-sizing: border-box;
}

.login_form .btns {
  padding: 10px;
  display: flex;
  justify-content: flex-end;
}
</style>
