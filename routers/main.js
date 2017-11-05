var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next){
    res.render('main/index', {
        name : req.cookies.name
    });  //name为渲染index需要的数据
});

module.exports = router;