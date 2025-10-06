import { create } from "zustand";

type OpenSidebarType = {
    isOpen: boolean,
    openSidebar: () => void
    closeSidebar: () => void
}

const useOpenSidebar = create<OpenSidebarType>((set) => ({
    isOpen: false,


    
    openSidebar: () => set({isOpen: true}),
    closeSidebar: () => set({isOpen: false})
}))

export default useOpenSidebar;
