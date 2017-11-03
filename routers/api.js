var express = require('express');

var User = require('../models/User');  //数据表模型

var router = express.Router();


// 统一输出格式
var responseData;

router.use(function(req, res, next){
    responseData = {
        code : 0,
        massage : ''
    }
    next();
}); 

router.post('/user/register', function(req, res, next){
    console.log( req.body );

    var username = req.body.username;
    var password = req.body.password;
    var repassword = req.body.repassword;

    if(username == ''){
        responseData.code = 1;
        responseData.massage = '用户名不得为空';
        res.json(responseData);
        return;
    }

    if(password == ''){
        responseData.code = 2;
        responseData.massage = '密码不得为空';
        res.json(responseData);
        return;
    }

    if(password != repassword){
        responseData.code = 3;
        responseData.massage = '两次输入的密码不一致';
        res.json(responseData);
        return;
    }

    // 验证用户名是否已经被注册
    User.findOne({
        username : username
    })

    if(responseData.code == 0){
        //注册成功
        
    }
    

    responseData.massage = '注册成功';
    res.json(responseData);
});

module.exports = router;