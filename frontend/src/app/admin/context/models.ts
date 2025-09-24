import { RefObject } from "react";

export type MyContextType ={
    router: string | boolean,
    isLoading: boolean,
    isOpen:boolean
    openSidebar: () => void,
    closeSidebar: () => void,
    toggleSidebar: () => void,
    checkAuth: () => Promise<boolean | string>
    logout: () => Promise<string | undefined>,
    name:string | undefined,
    sidebarRef: RefObject<HTMLDivElement | null>; 
}

export type CheckAuthType = {
    authenticated:boolean,
    admin:{
        id:string,
        login:string,
        role:number,
    },
    shouldRefresh?: boolean,
    message?: string
}

export type refreshTokenType = {
    message: string
}