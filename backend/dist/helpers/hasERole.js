"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = hasRole;
function hasRole(roles) {
    return (req, res, next) => {
        if (!req.admin || !roles.includes(req.admin.role)) {
            return res.status(403).send({ error: 'Access denied' });
        }
        next();
    };
}
