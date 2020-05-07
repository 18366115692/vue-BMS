<template>
  <el-container class="home-wrapper">
    <!-- home 头部 -->
    <el-header>
      <div class="header-left">
        <img src="../../assets/homeLogo.jpg" alt="" />
        <span>后台商城管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!-- 内容左侧导航条 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <div class="toggle-button" @click="changeWidth">|||</div>
          <!-- 一级导航栏 -->
          <el-submenu
            :index="group.id + ''"
            v-for="group in menulist"
            :key="group.id"
          >
            <template slot="title">
              <i :class="iconObj[group.id]"></i>
              <span>{{ group.authName }}</span>
            </template>
            <!-- 二级导航栏 -->
            <el-menu-item
              :index="'/' + item.path"
              v-for="item in group.children"
              :key="item.id"
              @click="handleChangeItem('/' + item.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ item.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      // 主体左侧列表数据
      menulist: [],
      // 自定义绑定第三方字体图标
      iconObj: {
        125: 'iconfont icon-1',
        103: 'iconfont icon-quanxian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-dingdan',
        145: 'iconfont icon-shuju'
      },
      // 是否隐藏主体左侧导航栏
      isCollapse: false,
      // 当前选中的列表高亮
      activePath: ''
    }
  },
  created() {
    // 获取导航栏列表数据
    this.getMenuList()
    // 初始化页面的高亮
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      // 点击退出，先清空token值，在跳转回登录界面
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList() {
      const { data: res } = await this.$http.request('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
    },
    changeWidth() {
      this.isCollapse = !this.isCollapse
    },
    handleChangeItem(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.home-wrapper {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .el-button {
    padding: 0 20px;
    height: 40px;
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.header-left {
  display: flex;
  align-items: center;
  img {
    width: 56px;
    height: 56px;
    border-radius: 50%;
  }
  span {
    margin-left: 3px;
    color: #fff;
    font-size: 20px;
  }
}
.iconfont {
  margin-right: 10px;
}
.toggle-button {
  background-color: #999;
  color: #fff;
  font-size: 12px;
  text-align: center;
  line-height: 24px;
  letter-spacing: 0.2em;  // 设置字体之间的间距
  cursor: pointer;
  font-weight: 600;
}
</style>
