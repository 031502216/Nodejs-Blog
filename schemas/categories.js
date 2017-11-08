var mongoose = require('mongoose');

//分类表的结构
module.exports = new mongoose.Schema({
    // 分类名
    name : String
});