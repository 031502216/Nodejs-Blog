var express = require('express');
var router = express.Router();
//数据表模型
var User = require('../models/User');  
var Category = require('../models/Category');

router.get('/', function(req, res, next){
    var userInfo = {};
    User.findOne({username : req.cookies.name}, function(err, docs){
        // console.log(docs);
        if(docs){
            // console.log(docs.isAdmin);
            userInfo = {
                "isAdmin" : docs.isAdmin
            };
        }
        
        Category.find().then(function(category){
            
            // console.log(category);  //显示查询到的分类
            res.render('main/index', {
                name : req.cookies.name,
                isAdmin : userInfo.isAdmin,
                categories : category
            }  );  //name为渲染index需要的数据
        })
        // console.log(JSON.stringify(userInfo));
        
        // req.info.isAdmin = docs.isAdmin;
        // console.log("userInfo.isAdmin = " + userInfo.isAdmin);
        

    });
    

});

module.exports = router;