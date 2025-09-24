module.exports = function mapAdmin(admin){
    return{
        login: admin.login,
        role: admin.role,
        id: admin._id
    }
}