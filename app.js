//引入express模块
var express = require('express');
//引入body-parser - node.js 中间件，用于处理 JSON, Raw, Text 和 URL 编码的数据
var bodyParser = require('body-parser');
//引用swig模块
var swig = require('swig');
//引入数据库模块
var mongoose = require('mongoose');
//创建app应用  =>  nodejs  http.createServer();
var app = express();

//托管静态文件
//自动读取public目录下的css，js，img等静态文件
//当url访问到/public开头，直接返回对应__dirname+'/public'下的文件
app.use('/public', express.static(__dirname + '/public'));

//使用swig渲染html文件
app.engine('html', swig.renderFile);
//设置模板文件存放的目录
app.set('views', __dirname + '/views');
//设置默认页面扩展名
app.set('view engine', 'html'); 
//关闭swig模板缓存
swig.setDefaults({cache: false}); 

//处理application/x-www-form-urlencoded格式请求体解析
app.use(bodyParser.urlencoded({ extended: true }));

//暂时用不到
// app.get('/', function(req, res, next){
//     /**
//      * 读取views下的指定文件，解析并返回给客户端
//      * 第一个参数是表示模板的文件，即views/index.html
//      * 第二个参数是传递给模板使用的参数
//      */
//     res.render('index');
// })

// 分为 前台、后台、API三个模块
app.use('/', require('./routers/main'));
app.use('/api', require('./routers/api'));
app.use('/admin', require('./routers/admin'));



// 监听http请求
mongoose.Promise = global.Promise; 
mongoose.connect('mongodb://localhost:27017/blog',{useMongoClient: true}, function(err){
    if(err){
        console.log('数据库连接失败');
    }
    else{
        console.log('连接成功');
        //连接成功以后监听端口
        app.listen(8888,function(){
            console.log('8888端口正在监听');
        });
    }
})
