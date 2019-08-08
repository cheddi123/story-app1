const mongoose = require('mongoose');

const CommentSchema =  new mongoose.Schema({
    commentBody :{type:String,required:true},
    id:{type:mongoose.Schema.Types.ObjectId,ref:"user"},
    username:{type:String} ,
    createdAt:{type:Date,default:Date.now , }

})

module.exports = mongoose.model("comment",CommentSchema)