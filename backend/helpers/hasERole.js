module.exports = function (roles){
    return (req, res, next) => {
        if(!req.admin || !roles.includes(req.admin.role)){
            return res.status(403).send({error: 'Access denied'})
        }

        next()
    }
}