// MainSidebar/page.tsx
'use client'
import "./index.scss";
import useOpenSidebar from "@/app/lib/api/store/useOpenSidebar";
import { RefObject, useMemo, useRef } from "react";
import { useClickOutside } from "@/app/lib/api/store/hooks/useClickOutSide";
import { useRouter } from "next/navigation";
import { useLocalStore } from "@/app/lib/api/store/useLocalStorage";
import Link from "next/link";

const MainSidebar = () => {
  const {isOpen, closeSidebar} = useOpenSidebar()
  const mainSidebarRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const {userName, userPhone} = useLocalStore()

  useClickOutside(mainSidebarRef as RefObject<HTMLDivElement>)

  const onLogin = () => {
    router.push('/?user-auth=login')
    closeSidebar()
  };


  const categories = useMemo(() => [
  { name: "Все товары", href: "/?category=все", emoji: "🍽️" },
    { name: "Напитки", href: "/?category=напитки", emoji: "🥤" },
    { name: "Бургеры", href: "/?category=бургеры", emoji: "🍔" },
    { name: "Гиро", href: "/?category=гиро", emoji: "🌯" },
    { name: "Шаурма", href: "/?category=шаурма", emoji: "🥙" },
    { name: "Закуски", href: "/?category=закуски", emoji: "🍟" },
    { name: "Соусы", href: "/?category=соусы", emoji: "🧴" },
    { name: "Хот-доги", href: "/?category=хот-дог", emoji: "🌭" }
], []);
  return (
    <div className={`sidebar ${isOpen ? "sidebar__active" : ""}`}
    ref={mainSidebarRef}
    >
      {/* header */}
      <div className="sidebar__header">
        <h1 className="sidebar__logo">
          Привет{userName ? `, ${userName}` : ''}! 👋
        </h1>
        {userPhone && (
          <p className="sidebar__logo-sub">📱 {userPhone}</p>
        )}
      </div>

      {/* content */}
      <div className="sidebar__content">
        <div className="sidebar__category-block">
          <h2>Выберите категорию</h2>
          <ul className="sidebar__category-list">
            {categories.map((category) => (
              <li key={category.name}>
                <Link 
                  className="sidebar__Link" 
                  href={category.href} 
                  onClick={closeSidebar}
                >
                  <span className="sidebar__emoji">
                    {category.emoji}
                  </span>
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Футер */}
      <div className="sidebar__footer">
        <button className="sidebar__login-btn" onClick={onLogin}>
          {userName ? 'Сменить аккаунт' : 'Войти в аккаунт'}
        </button>
      </div>
    </div>
  );
};

export default MainSidebar;