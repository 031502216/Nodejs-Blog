var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Category = require('../models/Category');



router.get('/', function(req, res){
    res.render('admin/index',{
        name : req.cookies.name
    });
});

router.get('/user', function(req, res){
    var page = req.query.page || 1 ;
    var limit = 10;

    User.count().then(function(count){

        var pages = Math.ceil(count / limit);
        page  = Math.max(page, 1);
        page = Math.min(pages, page);
        var skip = (page - 1) * limit;

        User.find().limit(limit).skip(skip).then(function(users){
            //输出users信息
            console.log(users);

            res.render('admin/user_index', {
                name : req.cookies.name,
                users : users,
                count : count,
                pages : pages,
                page : page,
                limit : limit
            });
        })    

    })
});

router.get('/category', function(req, res){
    res.render('admin/category_index', {
        name : req.cookies.name,
    })
});


//分类添加页面展示
router.get('/category/add', function(req, res){
    res.render('admin/category_add', {
        name : req.cookies.name,
    })
});

//接收添加页面的数据
router.post('/category/add', function(req, res){

    //输出post请求
    console.log('name = ' + req.body.name);

    var name = req.body.name || '';

    //分类名不能为空
    if (name == '') {
        res.render('admin/error',{
            name : req.cookies.name,
            message : '分类名不能为空'
        });
        return;
    }

    //验证数据库中是否已经存在此分类
    Category.findOne({name : name}).then(function(docs){
        if (docs) {
            res.render('admin/error',{
                name : req.cookies.name,
                message : '分类已经存在',
                url: '/admin/category/add'
            });
            return;

        } else {
            var category = new Category({
                name : name
            });

            category.save(function(err){
                if(err){
                    return handleError(err);
                }
                else{
                    res.render('admin/success', {
                        name : req.cookies.name,
                        message: '分类保存成功',
                        url: '/admin/category/add'
                      });
                }
            });

        }
    })

});



module.exports = router;