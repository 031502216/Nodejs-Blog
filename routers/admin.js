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

    var page = req.query.page || 1 ;
    var limit = 5;

    Category.count().then(function(count){

        var pages = Math.ceil(count / limit);
        page  = Math.max(page, 1);
        page = Math.min(pages, page);
        var skip = (page - 1) * limit;

        //降序排列
        Category.find().sort({_id:-1}).limit(limit).skip(skip).then(function(categories){

            res.render('admin/category_index', {
                name : req.cookies.name,
                categories : categories,
                count : count,
                pages : pages,
                page : page,
                limit : limit
            });
        })    

    })
    
});


//分类添加页面展示,响应添加分类页面的请求
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


//修改分类
router.get('/category/edit', function(req, res){
    var id  = req.query.id || '';

    Category.findOne({_id : id}).then(function(Category){
        res.render('admin/category_edit',{
            name : req.cookies.name,
            Category : Category
        });
    });
});

//存储分类
router.post('/category/edit', function(req, res){
    var id = req.query.id || '';
    var name = req.body.name || '';
    var flag = 0;

    Category.findOne({_id : id}).then(function(category){
        //输入的类名为空
        if(name == ''){
            flag = 1;
            res.render('admin/error',{
                name : req.cookies.name,
                message : '没有输入分类名称',
                url : '/admin/category'
            });
            
        }

        if(!category){
            flag = 1;
            res.render('admin/error',{
                name : req.cookies.name,
                message : '分类信息不存在',
                url : '/admin/category'
            });
            
        }else{
            //分类信息没有任何修改
            if( name == category.name){
                flag = 1;
                res.render('admin/success',{
                    name : req.cookies.name,
                    message : '分类修改成功',
                    url : '/admin/category'
                });
                
            }
        }
        
    });
    console.log('flag = ' + flag);
    if(flag != 1)
    {
        Category.findOne({
                _id : {$ne : id},  //_id 不等于 id
                name : name
            }).then(function(sameCategory){
            if (sameCategory) {
            res.render('admin/error',{
                    name : req.cookies.name,
                    message : '分类已经存在',
                    url : '/admin/category'
                })
                return;
            } else {
                // 更新数据
                return Category.update({_id : id},{name : name});
            }
        }).then(function(docs){
            console.log('分类信息修改成功');
            res.render('admin/success', {
                name : req.cookies.name,
                message: '分类信息修改成功',
                url:'/admin/category'
            })
        });
    }
    
});

//删除分类
router.get('/category/delete', function(req, res){
    var id = req.query.id || '';

    Category.remove({
        _id : id
    }).then(function(){
        res.render('admin/success',{
            name : req.body.name,
            message : '分类删除成功',
            url : '/admin/category'
        });
    });
});



module.exports = router;