var express = require('express');
var router = express.Router();
//数据表模型
var User = require('../models/User');  
var Category = require('../models/Category');
var Content = require('../models/Content');

var data;
router.use(function(req, res, next){
    //通用数据
    data = {
        name : req.cookies.name,
    };

    Category.find().then(function(categories){
        data.categories = categories;
    })
    next();

})

router.get('/', function(req, res, next){

    
    data.page = req.query.page || 1 ;
    data.limit = 5;
    Content.count().then(function(count){

        data.count = count;
        data.pages = Math.ceil(data.count / data.limit);
        data.page  = Math.max(data.page, 1);
        data.page = Math.min(data.pages, data.page);
        data.skip = (data.page - 1) * data.limit;


        var userInfo = {};
        User.findOne({username : req.cookies.name}, function(err, docs){
            
            if(docs){
                
                userInfo = {
                    "isAdmin" : docs.isAdmin
                };
    
                data.userInfo = userInfo;
            }
    
        });
    
        //populate('category') 关联一个category分类的数据库
        Content.find().sort({_id:-1}).limit(data.limit).skip(data.skip).populate('category').then(function(contents){
            data.contents = contents;
    
            res.render('main/index', data);  //name为渲染index需要的数据

        });  
    });


});

module.exports = router;