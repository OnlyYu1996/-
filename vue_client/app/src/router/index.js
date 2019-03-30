import Vue from 'vue'
import Router from 'vue-router'
import home from '@/views/home.vue'
import settingManager from '@/views/setting.vue'
import userManager from '@/views/userManager.vue'
import login from '@/views/login.vue'
import Register from '@/views/register.vue'

Vue.use(Router)
export default new Router({
  // mode:'history',//默认为hash 
  routes: [
    {
      path: '/',
      name: 'home',
      component: home,
      //当前路由的元数据，自定义
      meta:{
        requireAuth:true
      },
      redirect:'/users',
      children:[
        {
          path:'/users',
          name:'userManager',
          component:userManager,
          meta:{
            requireAuth:true
          }
        },
        {
          path:'/setting',
          name:'settingManager',
          component:settingManager,
          meta:{
            requireAuth:true
          }
        }
      ]
    },
    {
      path:'/login',
      name:'login',
      component:login,
      meta:{
        cheakIsLogin:true
      }
    },
    {
      path:'/register',
      name:'Register',
      component:Register,
      meta:{
        cheakIsLogin:true
      }
    }
  ]
})
