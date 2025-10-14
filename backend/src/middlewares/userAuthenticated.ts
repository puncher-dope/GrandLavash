import jwt from 'jsonwebtoken'
import { User } from '../models/User';

export default async function userAuthenticated(req, res, next) {
    try {
        const accessToken = req.cookies.accessToken;
        if (!accessToken) {
            return res.status(401).send({ error: 'Authentication required' });
        }

        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET) as any;

        const user = await User.findById(decoded.id)
        if (!user) {
            return res.status(401).send({ error: 'User not found' });
        }
        
        req.user = {
            id: user._id,
            role: user.role
        };
        next();
    } catch (e) {
        res.status(401).send({ error: 'Invalid token' });
    }
};