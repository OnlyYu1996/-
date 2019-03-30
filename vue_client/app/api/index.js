const baseUrl='/api' //开发api
// const baseUrl=''  //生产api
import axios from 'axios'
//获取验证码接口
export const captcha=`${baseUrl}/captcha?`
/**
 * login
 * 后台登陆接口
 * @param {*} data 
 */
export function login(data){
    return axios.post(`${baseUrl}/login`,data)
}
/**
 * register
 * 后台注册接口
 * @param {*} data 
 */
export function register(data){
    return axios.post(`${baseUrl}/register`,data)
}
/**
 * deleteUser
 * 删除用户
 * @param {*} data 
 */
export function deleteUser(data){
    return axios.post(`${baseUrl}/delete`,data)
}
/**
 * users
 * 用户数据操作接口
 * @param {String} param 
 */
export function users(param){
    return axios.get(`${baseUrl}/users?${param}`)
}