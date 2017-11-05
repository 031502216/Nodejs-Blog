var express = require('express');
var router = express.Router();
//数据表模型
var User = require('../models/User');  

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
        
        // console.log(JSON.stringify(userInfo));
        
        // req.info.isAdmin = docs.isAdmin;
        // console.log("userInfo.isAdmin = " + userInfo.isAdmin);
        res.render('main/index', {
            name : req.cookies.name,
            isAdmin : userInfo.isAdmin
        }  );  //name为渲染index需要的数据

    });
    

});

module.exports = router;