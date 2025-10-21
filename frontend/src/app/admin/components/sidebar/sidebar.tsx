"use client";
import "./index.scss";
import { useRouter } from "next/navigation";
import { useMyContext } from "../../context/contextProvider/contextProvider";
import Link from "next/link";

export default function Sidebar() {
  const navigation = useRouter();
  const { logout, isOpen, sidebarRef, name, closeSidebar } = useMyContext();

  const onLogOut = async () => {
    await logout();
    navigation.replace("/admin/auth/login");
  };

  return (
    <div
      className={`sidebar ${isOpen ? "sidebar__active" : ""}`}
      ref={sidebarRef}
    >
      <h1 className="sidebar__logo">Hello, {name}</h1>

      <div className="sidebar__category-block">
        <h2>Выберите категорию товара</h2>
        <ul className="sidebar__category-list">
          <li>
            <Link className="sidebar__Link" href={"/admin?category=все"} onClick={closeSidebar}>
              Все товары
            </Link>
          </li>
          <li>
            <Link className="sidebar__Link" href={"/admin?category=напитки"} onClick={closeSidebar}>
              Напитки
            </Link>
          </li>
          <li>
            <Link className="sidebar__Link" href={"/admin?category=бургеры"} onClick={closeSidebar}>
              Бургеры
            </Link>
          </li>
          <li>
            <Link className="sidebar__Link" href={"/admin?category=гиро"} onClick={closeSidebar}>
              Гиро
            </Link>
          </li>
          <li>
            <Link className="sidebar__Link" href={"/admin?category=шаурма"} onClick={closeSidebar}>
              Шаурма
            </Link>
          </li>
          <li>
            <Link className="sidebar__Link" href={"/admin?category=закуски"} onClick={closeSidebar}>
              Закуски
            </Link>
          </li>
          <li>
            <Link className="sidebar__Link" href={"/admin?category=соусы"} onClick={closeSidebar}>
              Соусы
            </Link>
          </li>
          <li>
            <Link className="sidebar__Link" href={"/admin?category=хот-дог"} onClick={closeSidebar}>
              Хот-доги
            </Link>
          </li>
        </ul>
      </div>

      <button className="sidebar__logout-btn" onClick={onLogOut}>
        Выйти
      </button>
    </div>
  );
}
