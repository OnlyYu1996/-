import Vue from 'vue'
import Vuex from 'vuex'
import rules from './modules/rules'
import users from './modules/users'


//注册vuex插件
Vue.use(Vuex)

//初始化user 如果存在就设为sessionStorage中的user，如果不存在就初始化为空
const user=JSON.parse(sessionStorage.getItem('user'))||{userName:null,phone:null,email:null}
//1、创建一个仓库
export default new Vuex.Store({
    //仓库的原始数据，可以预设，也可以通过ajax想后台请求
    state:{
        user
    },
    //订阅数据变化 内容为方法
    getters:{
        user(state){
            return state.user
        }
    },
    //定于方法以改变数据，使用this.$store.commit('login')调用
    mutations:{
        //只能传两个参数，第一个参数为仓库对象，第二个参数设置为需要同步的参数，可以是数组或者JSON对象，使用this.$store.commit('login','login')
        login(state,payload){
            state.user=payload
            //把user信息存入到本地存储中
            sessionStorage.setItem('user',JSON.stringify(payload))
        },
        loginOut(state){
            state.user={userName:null,phone:null,email:null}
            sessionStorage.removeItem('user')
        }
    },
    // actions 也是一个一对多的功能
    actions:{
    },
    modules:{
        rules,
        users
    }
})