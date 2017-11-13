var mongoose = require('mongoose');

//内容表的结构
module.exports = new mongoose.Schema({
    //关联字段,分类信息的id
    category :{
        //类型
        type : mongoose.Schema.Types.ObjectId,
        //引用
        ref: 'Category'
    }, 
    title : String,
    description : String,
    content : String
});