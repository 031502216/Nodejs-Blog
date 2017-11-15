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
    user : {
        type : mongoose.Schema.Types.String,
        ref : 'User'
    },
    addTime : {
        type: Date,
         default: Date.now
    },
    view : {
        type : Number,
        default : 0
    },
    description : String,
    content : String
});