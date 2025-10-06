import { AdminData } from "../types/adminType";

export default function mapAdmin(admin: AdminData){
    return{
        login: admin.login,
        role: admin.role,
        id: admin.id
    }
}