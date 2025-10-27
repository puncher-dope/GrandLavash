"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapAdmin = mapAdmin;
exports.mapUser = mapUser;
function mapAdmin(admin) {
    return {
        login: admin.login,
        role: admin.role,
        id: admin.id
    };
}
function mapUser(admin) {
    return {
        login: admin.login,
        role: admin.role,
        id: admin.id
    };
}
