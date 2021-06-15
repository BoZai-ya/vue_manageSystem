<template>
  <el-container class="home_container">
    <el-header>
      <span>波妞电商管理系统</span>
      <el-button type="info" size="small" @click="loginOut"
        >退出</el-button
      ></el-header
    >

    <!-- 
      unique-opened 只让一个子菜单展开 其他的闭合
      :router="true" 这个是开启路由模式， 如果值布尔值true 可以简写为 router 是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转
     -->
    <el-container>
      <el-aside width="200px">
        <el-menu
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          unique-opened
          :router="true"
        >
          <el-submenu
            :index="String(item.id)"
            v-for="item in menuList"
            :key="item.id"
          >
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item
              :index="String(childItem.path)"
              v-for="childItem in item.children"
              :key="childItem.id"
            >
              <template slot="title">
                <i class="el-icon-document"></i>
                <span>{{ childItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menuList: [],
    };
  },
  methods: {
    // 退出登录
    loginOut() {
      // 清空token
      window.sessionStorage.clear();
      // 跳转到登录页
      this.$router.push("/login");
    },
    // 获取菜单列表
    async getMenuList() {
      const { data: res } = await this.$axios.get("menus");
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.menuList = res.data;
      // console.log(this.menuList);
    },
  },

  async created() {
    this.getMenuList();
    // const { data: res } = await this.$axios.get("users");
    // // 因为请求的时候添加了 token 验证所有可以成功请求数据
    // console.log(res);
  },
};
</script>

<style scoped>
.home_container {
  height: 100vh;
}
.el-header {
  background-color: #3a3d3f;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  line-height: 60px;
  font-size: 24px;
  padding: 0 50px;
}
.el-button {
  height: 35px;
}
.el-aside {
  background-color: rgb(84, 92, 100);
}

.el-main {
  background-color: #f4f7fa;
  color: #333;
}
</style>
