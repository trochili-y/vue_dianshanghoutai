<template>
  <el-container class="home_container">
    <!-- 头部 -->
    <el-header>
      <div>
        <img
          src="../assets/tt.jpg"
          alt=""
        >
        <span>电商后台管理系统</span>
      </div>
      <el-button
        type="info"
        @click="logout"
      >
        退出
      </el-button>
    </el-header>
    <!-- 内容主体 -->
    <el-container>
      <el-aside :width="isCollapse ? '64px':'200px'">
        <div
          class="toggle-button"
          @click="toggeleCollapse"
        >
          |||
        </div>
        <!-- 侧边栏菜单区域 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu
            v-for="item in menulist"
            :key="item.id"
            :index="item.id + ''"
          >
            <!--一级菜单模板区 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconObj[item.id]" />
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              v-for="subItem in item.children"
              :key="subItem.id"
              :index="'/'+subItem.path"
              @click="savaNavState('/'+subItem.path)"
            >
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu" />
                <!-- 文本 -->
                <span>{{ subItem.authName }}</span>
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
      menulist: {},
      iconObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao',
      },
      isCollapse: false,
      // 被激活的链接地址
      activePath:'',
    }
  },
  created() {
    this.getMenuList()
    this.activePath=window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
// 获取菜单列表
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
      // this.$message.success(res.meta.msg)
    },
    toggeleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    savaNavState(activePath){
      window.sessionStorage.setItem('activePath',activePath)
      this.activePath=activePath
    }
  },
}
</script>


<style lang="less" scoped>
.home_container {
  height: 100%;
}

.el-header {
  background: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 20;
  align-items: center;
  color: #fff;
  font-style: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
    img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }
  }
}
.el-aside {
  background: #333744;
  .el-menu {
    border-right: 0;
  }
}
.el-main {
  background: #e9edf1;
}
.iconfont {
  margin-right: 10px;
}
.toggle-button {
  background: #4a5064;
  font-style: 10px;
  line-height: 24px;
  text-align: center;
  color: #fff;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
