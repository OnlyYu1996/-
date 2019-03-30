<template>
    <Layout class="page">
        <Form class="register">
            <FormItem :error='formError.userName'>
                <Input placeholder="帐号" v-model="form.userName" @input="formError.userName=''">
                <span slot="prepend">
                    <Icon type='ios-contact' :size='iconSize'/>
                </span>
                </Input>
            </FormItem>
            <FormItem :error='formError.email'>
                <Input placeholder="邮箱" v-model="form.email" @input="formError.email=''">
                    <span slot="prepend">
                        <Icon type='ios-mail' :size='iconSize'/>
                    </span>
                </Input>
            </FormItem>
            <FormItem :error='formError.phone'>
                <Input placeholder="手机号" v-model="form.phone" @input="formError.phone=''">
                    <span slot="prepend">
                        <Icon type='ios-phone-portrait' :size='iconSize'/>
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
                    <Input placeholder="验证码" @input="formError.captcha=''" v-model="form.captcha"/>
            </FormItem>
            <FormItem :error='formError.captcha'>
                    <Img :src="captchaCode" @click="getSrc" /> 
            </FormItem>
            <FormItem>
                <Button long type="success" @click="register">注册</Button>
            </FormItem>
            <router-link to="/login">已有帐号？</router-link>
        </Form>
    </Layout>
</template>

<script>
import axios from 'axios'
import {captcha,register} from '../../api/index.js'
export default {
    data(){
        return {
            iconSize:25,
            captchaCode:`${captcha}${Math.random()*10}`,
            form:{
                userName:'',
                password:'',
                email:'',
                phone:'',
                captcha:''
            },
            formError:{
                userName:'',
                password:'',
                email:'',
                phone:'',
                cpatcha:''
            }
        }
    },
    methods:{
        //验证码
        getSrc(e){
            var captchaSrc=captcha
            this.captchaCode=captchaSrc+e.timeStamp
        },
        //注册
        register(e){
            register(this.form).then(res=>{
                const {errors,code}=res.data;
                Object.keys(errors).forEach(k=>{
                    this.formError[k]=errors[k]
                })
                if(errors.captcha||errors.userName||errors.phone||errors.email||errors.password){
                    let captchaSrc=captcha
                    this.captchaCode=captchaSrc+e.timeStamp
                    this.form.captcha=''
                }
                // console.log(code)
                if(code=='1'){
                    this.$router.push('/login')
                }
            }).catch(err=>{
                if(err){
                    this.formError=err.data
                }
            })
        }
    }
};
</script>

<style>
.register {
  width: 300px;
  margin: 100px auto;
}
.register input{
    height: 40px;
}
</style>