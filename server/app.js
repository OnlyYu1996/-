const app=require('express')();
const bodyParser=require('body-parser');
const svgCaptcha=require('svg-captcha');
const validator=require('validator')
const session=require('express-session')
const cookieParser=require('cookie-parser')
const db=require('./db/mongodb')
const crypto=require('crypto')


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended:true
}));
app.use(cookieParser())
app.use(session({
    cookie:{
        maxAge:1000*60*3
    },
    resave:true,
    secret:"onlyyu",
    saveUninitialized:true
}))

app.get('/captcha',function(req,res){
    const cap= svgCaptcha.create({
        size:2,
        color:true
    })
    req.session.token=cap.text;
    res.type('svg')
    res.send(cap.data)
})
//注册
let index=0
app.post('/register',function(req,res){
    // console.log('register')
    let {userName,password,email,phone,captcha}=req.body
    let errors={}
    let code
    if(userName==''){
        errors.userName='用户名不能为空！'
        code='0'
    }
    if(password==''){
        errors.password='密码不能为空！'
        code='0'
    }
    if(email==''){
        errors.email='邮箱不能为空！'
        code='0'
    }
    if(!validator.isEmail(email)&&email!=''){
        errors.email='邮箱格式不正确！'
        code='0'
    }
    if(phone==''){
        errors.phone='电话号码不能为空！'
        code='0'
    }if(!validator.isMobilePhone(phone,'zh-CN')&&phone!=''){
        errors.phone='电话号码格式不正确！'
        code='0'
    }
    if(captcha==''){
        errors.captcha='验证码不能为空！'
        code='0'
    }
    // console.log(req.session.token.toLowerCase()&&captcha!='')
    if(req.session.token.toLowerCase()){
        if(!(req.session.token.toLowerCase()==captcha.toLowerCase())){
            errors.captcha='验证码错误！'
            code='0'
        }
    }
    function getNowFormatDate() {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let strDate = date.getDate();
        let hours=date.getHours();
        let minutes=date.getMinutes();
        let seconds=date.getSeconds();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        return `${year}年${month}月${strDate}日：${hours}时${minutes}分${seconds}秒`;
    }
    //信息没有空
    if(JSON.stringify(errors)=='{}'){
        db.collection('vueUser').find({$or:[
            {email},{phone},{userName}
        ]},function(err,data){
            if(err) throw err
            if(data.length==0){
                //注册信息没有重复
                let registerTime=getNowFormatDate()
                index++
                password = crypto.createHmac('md5','onlyyu').update(password).digest('hex');
                db.collection('vueUser').insert({userName,email,phone,password,index,registerTime},function(err,result){
                    if(err) throw err
                    console.log(`用户：${userName} 注册成功！`)
                    code='1'
                    res.json({errors,code})
        })
            }else {
                //注册信息重复
                data.forEach(k => {
                    if(k.userName==userName){
                        errors.userName='当前账号已注册！'
                        code='0'
                    }else if(k.email==email){
                        errors.email='当前邮箱已注册！'
                        code='0'
                    }else if(k.phone==phone){
                        errors.phone='当前手机号码已注册！'
                        code='0'
                    }
                res.json({errors,code})
                });
            }
        })
    }
        if(code==='0'){
        res.json({errors,code})
    }
})
//登陆
app.post('/login',function(req,res){
    console.log('/login')
    let {account,password,captcha}=req.body
    let errors={}
    let code=null
    if(account==''){
        errors.account="请输入登陆帐号"
        code="0"
    }
    if(password==''){
        errors.password="请输入登陆密码！"
        code='0'
    }
    if(captcha==''){
        errors.captcha='请输入验证码'

        code='0'
    }
    function dbFind(data){
        let col={}
        let user={
        }
        col[data]=account
        db.collection('vueUser').find(col,function(err,result){
            if(err) throw err
            console.log(result)
            if(result.length>0){
                if(result[0].password===password){
                    code='1'
                    user.userName=result[0].userName
                    user.phone=result[0].phone
                    user.email=result[0].email
                    user.index=result[0].index
                    user.registerTime=result[0].registerTime
                    console.log('登陆成功！')
                }else{
                    code='0'
                    errors.password='密码错误'
                }
                res.json({errors,code,user})
            }else{
                code='0'
                errors.account='帐号不存在'
                res.json({errors,code})
                console.log('登陆失败！')
            }
        })
    }
    if(JSON.stringify(errors)=='{}'){
        if(captcha.toLowerCase()==req.session.token.toLowerCase()){
            password = crypto.createHmac('md5','onlyyu').update(password).digest('hex');
            if(validator.isMobilePhone(account)){
                let phone='phone'
                dbFind(phone)
            }else if(validator.isEmail(account)){
                let email='email'
                dbFind(email)
            }else {
                let userName='userName'
                dbFind(userName)
            }
        }else{
            code='0'
            errors.captcha='验证码错误！'
        }
    }
    if(code=='0'){
        res.json({errors,code})
    }
})
app.get('/users',function(req,res){
    // const {query}=req
    let {type,limit,page,oldEmail,oldPhone,oldUserName,userName,email,phone}=req.query
    if(type=='search'){
        // let errors=[]
        // if(errors.length==0){
            db.collection('vueUser').limit(Number(limit)).skip(limit*(page-1)).find(function(err,result){
                if(err) throw err
                result.page=page
                res.send(result)
            })
        // }
    }
})
app.post('/modify',function(req,res){
    const {oldUserName,oldEmail,oldPhone,userName,phone,email}=req.body
        db.collection('vueUser').update({userName:oldUserName,email:oldEmail,phone:oldPhone},{userName,phone,email},function(err,result){
            if(err) throw err
            res.send(result)
        })
})
app.post('/delete',function(req,res){
    const {userName,phone,email}=req.body
    if(req.body instanceof Array && req.body.length!=0){
        let dele={}
        req.body.forEach(k => {
        dele.email=k
        console.log(dele)
        db.collection('vueUser').remove(dele,function(err,result){
            if(err) throw err
            res.end('200')

        })
    });
        
    }else{
        //单个用户
        db.collection('vueUser').remove({userName,phone,email},function(err,result){
            if(err) throw err
            res.send(result)
        })
    }
})
app.listen(3001)
console.log('http://localhost:3001')

