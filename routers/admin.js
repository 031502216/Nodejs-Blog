var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Category = require('../models/Category');
var Content = require('../models/Content');



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

//修改储存分类
router.post('/category/edit', function(req, res){
    var id = req.query.id || '';
    var name = req.body.name || '';


    Category.findOne({_id : id}).then(function(category){
        //输入的类名为空
        if(name == ''){
            res.render('admin/error',{
                name : req.cookies.name,
                message : '分类名不能为空',
                url : '/admin/category'
            });
        }

        if(!category){
            res.render('admin/error',{
                name : req.cookies.name,
                message : '分类信息不存在',
                url : '/admin/category'
            });
            
        }else if( name == category.name){
            //分类信息没有任何修改
            res.render('admin/success',{
                name : req.cookies.name,
                message : '分类修改成功',
                url : '/admin/category'
            });
            return;
        
        }else if(name != ''){
            Category.findOne({
                    _id : {$ne : id},  //_id 不等于 id
                    name : name
                }).then(function(sameCategory){
                //如果没有找到
        
                if (sameCategory) {
                res.render('admin/error',{
                        name : req.cookies.name,
                        message : '分类已经存在',
                        url : '/admin/category'
                    })
                    return;
                }  else  {
                    res.render('admin/success', {
                        name : req.cookies.name,
                        message: '分类信息修改成功',
                        url:'/admin/category'
                    })
                    // 更新数据
                    return Category.update({_id : id},{name : name});
                }
            });
        }
        
    });

    
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

//展示内容
router.get('/content', function(req, res){

    var page = req.query.page || 1 ;
    var limit = 5;

    Content.count().then(function(count){

        var pages = Math.ceil(count / limit);
        page  = Math.max(page, 1);
        page = Math.min(pages, page);
        var skip = (page - 1) * limit;

        //populate('category') 关联一个category分类的数据库
        Content.find().sort({_id:-1}).limit(limit).skip(skip).populate('category').then(function(contents){

            
            res.render('admin/content_index', {
                name : req.cookies.name,
                contents : contents,
                count : count,
                pages : pages,
                page : page,
                limit : limit
            });
        })    

    })
    
});
    
    
//分类添加页面展示,响应添加分类页面的请求
router.get('/content/add', function(req, res){

    Category.find().sort({_id:-1}).then(function(categories){
        console.log(categories);
        res.render('admin/content_add', {
                name : req.cookies.name,
                categories : categories
            })
    });
    
});

//内容添加
router.post('/content/add', function(req, res){
    if(req.body.title == ''){
        res.render('admin/error', {
            name : req.cookies.name,
            message : '内容标题不能为空'
        })
        return;
    }
    if(req.body.description == ''){
        res.render('admin/error', {
            name : req.cookies.name,
            message : '内容描述不能为空'
        })
        return;
    }
    if(req.body.content == ''){
        res.render('admin/error', {
            name : req.cookies.name,
            message : '内容不能为空'
        })
        return;
    }

    // 保存到数据库
    new Content ({
        category:req.body.category,
        title:req.body.title,
        user:req.cookies.name,
        description:req.body.description,
        content:req.body.content
    }).save().then(function(){
        res.render('admin/success',{
            name : req.cookies.name,
            message : '内容添加成功',
            url : '/admin/content'
        });
    })

})

//内容修改展示
router.get('/content/edit', function(req, res){
    var id = req.query.id || '';
    var name = req.body.name || '';

    
    Category.find().sort({_id : -1}).then(function(categories){
        var categories = categories;

        Content.findOne({_id : id}).populate('category').then(function(content){
            // console.log(content);
            if(!content){
                res.render('admin/error' ,{
                    name : req.cookies.name,
                    message : '查询的内容不存在',
                    url : '/admin/content'
                })
            }else{
                res.render('admin/content_edit',{
                    name : req.cookies.name,
                    content : content,
                    categories : categories
                })
            }
            
        })

    })

    
    

});

//内容修改提交
router.post('/content/edit', function(req, res){
    var id = req.query.id || '';

    console.log("postid = "+id);

    console.log(req.body);

    if(req.body.category == ''){
        res.render('admin/error',{
            name : req.cookies.name,
            message : '分类不能为空'
        })
        return;
    }
    else if(req.body.title == ''){
        res.render('admin/error',{
            name : req.cookies.name,
            message : '标题不能为空',
            url:'/admin/content/edit?id=' + id
        })
        return;
    }
    else if(req.body.description == ''){
        res.render('admin/error',{
            name : req.cookies.name,
            message : '描述不能为空'
        })
        return;
    }else if(req.body.content == ''){
        res.render('admin/error',{
            name : req.cookies.name,
            message : '内容不能为空'
        })
        return;
    }

    
    Content.update({_id : id}, {
        category:req.body.category,
        title:req.body.title,
        description:req.body.description,
        content:req.body.content
    }).then(function(){
        res.render('admin/success',{
            name : req.cookies.name,
            message : '修改成功',
            url : '/admin/content'
        })
        return;
    })

});

//删除内容
router.get('/content/delete', function(req, res){
    var id = req.query.id || '';

    Content.remove({
        _id : id
    }).then(function(){
        res.render('admin/success',{
            name : req.body.name,
            message : '内容删除成功',
            url : '/admin/content'
        });
    });
});


module.exports = router;