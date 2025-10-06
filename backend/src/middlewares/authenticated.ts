import jwt from 'jsonwebtoken'
import {Admin} from '../models/Admin'
import { AdminData } from '../types/adminType';

export default async function authenticated (req, res, next){
    try {
        const accessToken = req.cookies.accessToken;
        if (!accessToken) {
            return res.status(401).send({ error: 'Authentication required' });
        }


        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET) as AdminData


        const admin = await Admin.findById(decoded.id)
        if (!admin) {
            return res.status(401).send({ error: 'Admin not found' });
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