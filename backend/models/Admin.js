const mongoose = require('mongoose')
const roles = require('../constants/roles')

const AdminSchema = mongoose.Schema({
    login: {
        type: String,
        required:true,
        unique:true
    },
    password: {
        type: String,
        required: true,
        unique:true
    },
    role:{
        type: Number,
        default: roles.ADMIN
    },
    refreshToken: String
}, {timestamp: true})

const Admin = mongoose.model('Admin', AdminSchema)
module.exports = Admin