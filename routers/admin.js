var express = require('express');
var router = express.Router();
var User = require('../models/User.js');



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
    res.render('/category_index', {
        name : req.cookies.name,
    })
});


module.exports = router;