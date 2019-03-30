<template>
  <div id="app">
    <Header class="header">
      <div>admin</div>
      <div v-if="user.userName">
        <span>欢迎您：{{user.userName}}</span>
        <Button size='small' type="error" @click="loginOut">注销</Button>
      </div>
      <!--如果localStorage没有登陆信息，则跳转登陆-->
      <div v-else>
        <router-link to="/login">登陆</router-link>
      </div>
    </Header>

  <router-view/>
  </div>
</template>

<script>
import {mapState,mapGetters,mapMutations,mapActions} from 'vuex'
export default {
  name: 'App',
  methods:{
    loginOut(){
      this.$store.commit('loginOut')
      this.$router.push('/login')
    }
  },
  computed:{
    ...mapGetters(['user']),
    invalidRoute(){
      // console.log(this.$route.matched)
      return !this.$route.matched || this.$route.matched.length === 0;
    }
  },
  watch:{
    invalidRoute(newData){
      if(newData){
        this.$router.push('/')
      }
    }
  }
}
</script>

<style>
  body, html, #app{
    height: 100%;
  }
  #app .header{
    height: 10%;
    background-color: aliceblue;
    display: flex;
    justify-content: space-between;
  }
</style>
