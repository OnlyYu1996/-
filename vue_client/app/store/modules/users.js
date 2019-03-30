export default{
    namespaced:true,//带命名空间
    state:{
        users:''
    },
    getters:{
        users(state){
            return state.users
        }
    },
    mutations:{
        changeUsers(state,payload){
            state.users=payload
        }
    },
    actions:{
        CHANHE_USERS({commit},payload){
            commit('changeUsers',payload)
        }
    }
}