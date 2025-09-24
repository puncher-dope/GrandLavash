'use client'
import './index.scss'
import { useRouter } from "next/navigation"
import { useMyContext } from "../../context/contextProvider"

export default function Sidebar(){
    const navigation = useRouter()
    const { logout, isOpen, sidebarRef, name} = useMyContext()


    const onLogOut = async () =>{
       await logout();
       navigation.replace('/admin/login')
    }

    return(
        <div className={`sidebar ${isOpen ? 'sidebar__active' : ''}`} ref={sidebarRef}>
            <h1 className="sidebar__logo">Hello, {name}</h1>
            <button className="sidebar__logout-btn" onClick={onLogOut}>Выйти</button>
        </div>
    )
}