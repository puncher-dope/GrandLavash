const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

module.exports = async(req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;
        if (!accessToken) {
            return res.status(401).send({ error: 'Authentication required' });
        }


        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);


        const admin = await Admin.findById(decoded.id)
        if (!admin) {
            return res.status(401).send({ error: 'User not found' });
        }
        req.admin = {
            id: admin._id,
            role: admin.role
        };
        next();
    } catch (e) {
        res.status(401).send({ error: 'Invalid token' });
    }
};