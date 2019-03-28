const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const Schema = mongoose.Schema

const UserSchema = new Schema({
    role:{
        type:String,
        default:'user'
    },
    openid:[String],
    unionID:String
})