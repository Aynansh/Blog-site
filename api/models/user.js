const mongoose=require('mongoose');
const {model}=mongoose;
const {Schema}=mongoose;

const userschema=new Schema({
   username : {type: String, required:true, min:4, unique:true},
   password : {type: String, required:true},
});

const usermodel=model('User',userschema);

module.exports=usermodel;