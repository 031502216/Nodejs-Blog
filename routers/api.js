var express = require('express');

var User = require('../models/User');  //数据表模型

var router = express.Router();


// 统一输出格式
var responseData;

router.use(function(req, res, next){
    responseData = {
        code : 0,
        message : ''
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
        responseData.message = '用户名不得为空';
        res.json(responseData);
        return;
    }

    if(password == ''){
        responseData.code = 2;
        responseData.message = '密码不得为空';
        res.json(responseData);
        return;
    }

    if(password != repassword){
        responseData.code = 3;
        responseData.message = '两次输入的密码不一致';
        res.json(responseData);
        return;
    }

    // 验证用户名是否已经被注册
    User.findOne({
        username : username
    }).then(function(userInfo){
        if(userInfo){
            responseData.code = 4;
            responseData.message = '用户名已经被注册';
            res.json(responseData);
            return;
        }

        // 保存注册信息到到数据库，这里操作的是抽象模型
        var user = new User({
            username : username,
            password : password
        });
        user.save(function(err){
            if(err){
                return handleError(err);
            }
            else{
                responseData.message = '注册成功';
                res.json(responseData);
            }
        })
    });
});


module.exports = router;