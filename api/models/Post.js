const mongoose=require('mongoose');
const {model}=mongoose;
const {Schema}=mongoose;

const postschema=new Schema({
    title:String,
    summary:String,
    content:String,
    cover:String,
    author:{type:Schema.Types.ObjectId, ref:'User'},
},{
    timestamps:true,
});

const postmodel=model('Post',postschema);

module.exports=postmodel;