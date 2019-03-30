// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
//导入路由设置 
import router from './router'
//导入仓库配置
import store from '../store'
import iview from 'iview'
import 'iview/dist/styles/iview.css'

Vue.use(iview)
Vue.config.productionTip = false

router.replace('./users')
//路由守卫
router.beforeEach((to,from,next)=>{
  //如果需要验证，首页守卫
  if(to.meta && to.meta.requireAuth){
    //vuex仓库中的信息是否存在
    if(sessionStorage.user){
      next()
    }else{
      //拦截路由
      next('./login')
    }
  }else{//不需要验证，直接放行
    next()
  }
})


/* eslint-disable no-new */
new Vue({
  el: '#app',
  //把路由添加进vue实例
  router,
  //把vuex仓库添加到vue实例
  store,
  components: { App },
  template: '<App/>',
  mounted(){
    // console.log(this)
  }
})
// console.log(store)
//vuex相当于在vue实例中混入了vuex对象，
