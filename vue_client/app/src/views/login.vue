<template>
    <Layout class="page">
        <Form class="login">
            <FormItem :error='formError.account'>
                <Input placeholder="帐号/邮箱/手机号" v-model="form.account" @input="formError.account=''" >
                <span slot="prepend">
                    <Icon type='ios-contact'/>
                </span>
                </Input>
            </FormItem>
            <FormItem :error='formError.password'>
                <Input placeholder="密码" type="password" v-model="form.password" @input="formError.password=''">
                    <span slot="prepend">
                        <Icon type='ios-lock' :size='iconSize'/>
                    </span>
                </Input>
            </FormItem>
            <FormItem :error='formError.captcha'>
                <Input placeholder="验证码" v-model="form.captcha" @input="formError.captcha=''"/>
            </FormItem>
            <FormItem>
                    <img :src="captchaCode" @click="getImgSrc"/>
            </FormItem>
            <FormItem>
                <Button long @click="login">登陆</Button>
            </FormItem>
            <router-link to="/register">没有帐号？</router-link>
        </Form>
    </Layout>
</template>

<script>
import axios from 'axios'
import {captcha,login} from '../../api/index.js'
export default {
    data(){
        return {
            iconSize:15,
            captchaCode:`${captcha}${Math.random()*10}`,
            form:{
                account:'admin',
                password:'123',
                captcha:''
            },
            formError:{
                account:'',
                password:'',
                captcha:''
            }

        }
    },
    methods:{
        getImgSrc(e){
            const imgSrc=captcha
            this.captchaCode=imgSrc+e.timeStamp
            // console.log(new Date().getTime())
        },
        login(e){
            login(this.form)
            .then(res=>{
                const {errors,code,user}=res.data;
                Object.keys(errors).forEach(k=>{
                    this.formError[k]=errors[k]
                })
                if(errors.captcha||errors.account||errors.password){
                    const imgSrc=captcha
                    this.captchaCode=imgSrc+e.timeStamp
                    this.form.captcha=''
                }
                if(code=='1'){
                    // console.log(user)
                    //调用vuex的mutations对象中的login方法，传入参数user
                    this.$store.commit('login',user)
                    this.$router.push('/')
                }
            })
            .catch(err=>{
                console.log(err)
            })
        }
    }
};
</script>

<style>
.login {
  width: 300px;
  margin: 100px auto;
}
</style>