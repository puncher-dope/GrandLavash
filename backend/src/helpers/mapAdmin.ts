import { AdminData } from "../types/adminType";

export function mapAdmin(admin: AdminData){
    return{
        login: admin.login,
        role: admin.role,
        id: admin.id
    }
}
export function mapUser(admin: AdminData){
    return{
        login: admin.login,
        role: admin.role,
        id: admin.id
    }
}