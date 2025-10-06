// MainSidebar/page.tsx
'use client'
import "./index.scss";
import useOpenSidebar from "@/app/lib/api/store/useOpenSidebar";
import { RefObject, useRef } from "react";
import { useClickOutside } from "@/app/lib/api/store/hooks/useClickOutSide";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/lib/api/store/useUser";

const MainSidebar = () => {
  const {isOpen, closeSidebar} = useOpenSidebar()
  const mainSidebarRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const {user} = useUser()

  useClickOutside(mainSidebarRef as RefObject<HTMLDivElement>)

  const onLogin = () => {
    router.push('/?user-auth=login')
    closeSidebar()
  };

  return (
    <div className={`sidebar ${isOpen ? "sidebar__active" : ""}`}
    ref={mainSidebarRef}
    >
      <h1 className="sidebar__logo">Привет {user?.login}!</h1>

      <div className="sidebar__category-block">
        <h2>Категории</h2>
        {/* Здесь будут категории */}
      </div>

      <button className="sidebar__login-btn" onClick={onLogin}>
        Войти в аккаунт
      </button>
    </div>
  );
};

export default MainSidebar;