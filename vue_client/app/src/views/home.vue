<template>
  <Layout class="home">
    <Layout>
      <Sider hide-trigger class="sider">
        <Menu @on-select="select" width="140" theme="dark" active-name="/users">
          <MenuItem name="/users">用户管理</MenuItem>
          <Submenu name="2" accordion="true">
            <template slot="title">系统设置</template>
            <MenuItem name="/setting">个人设置</MenuItem>
            <MenuItem name>后台设置</MenuItem>
          </Submenu>
        </Menu>
      </Sider>
      <Content class="content">
        <router-view/>
      </Content>
    </Layout>
    <Footer>Fotter</Footer>
  </Layout>
</template>

<script>
import { mapActions, mapGetters, createNamespacedHelpers } from "vuex";
//使用createNamespacedHelpers 需要在模块中添加namespaced:true属性，其中参数的js文件导入时的模块名
const users = createNamespacedHelpers("users");
const rules = createNamespacedHelpers("rules");
export default {
  methods: {
    ...mapActions(["CHUANGE_NUM"]),
    select(name) {
      if (name) this.$router.push(name);
    }
  },
  computed: {
    ...mapGetters(["c", "d"]),
    ...users.mapGetters(["users"]),
    ...rules.mapGetters(["admin"])
  }
};
</script>

<style>
.home {
  height: 100%;
}
.home .contnet {
  width: 100%;
  height: 100%;
  padding: 10px;
}
</style>