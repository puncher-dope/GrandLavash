"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = authenticated;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Admin_1 = require("../models/Admin");
async function authenticated(req, res, next) {
    try {
        const accessToken = req.cookies.accessToken;
        if (!accessToken) {
            return res.status(401).send({ error: 'Authentication required' });
        }
        const decoded = jsonwebtoken_1.default.verify(accessToken, process.env.JWT_SECRET);
        const admin = await Admin_1.Admin.findById(decoded.id);
        if (!admin) {
            return res.status(401).send({ error: 'Admin not found' });
        }
        req.admin = {
            id: admin._id,
            role: admin.role
        };
        next();
    }
    catch (e) {
        res.status(401).send({ error: 'Invalid token' });
    }
}
;
