const mongoose = require('mongoose')
const roles = require('../constants/roles')

const UserSchema = mongoose.Schema({
    login: {
        type: String,
        required:true,
        unique:true
    },
    phone: {
        type: String,
        required: true,
        unique:true
    },
    role:{
        type: Number,
        default: roles.USER
    },
    orders:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }],
    refreshToken: String
}, {timestamp: true})

const User = mongoose.model('User', UserSchema)
module.exports = User