// adminPanel.tsx (обновленная версия)
"use client";
import { useMyContext } from "../../context/contextProvider/contextProvider";
import { ProductsListPage } from "../productsListPage/page";
import "./index.scss";
import React, { useEffect, useState } from "react";

const AdminPanel = () => {
  const { openSidebar, isOpen } = useMyContext();
  const [isScrolled, setIsScrolled] = useState(false);

  const onOpenSidebar = () => {
    openSidebar();
  };

  // Эффект для отслеживания скролла
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener("scroll", handleScroll);
    
    // Очистка
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {isOpen && <div className="sidebar-overlay" />}

      <nav>
        <div className={`admin-panel ${isScrolled ? "scrolled" : ""}`}>
          <div className="admin-panel__title">
            Admin Panel
          </div>
          <button className="admin-panel__menu-btn" onClick={onOpenSidebar}>
            Меню
          </button>
        </div>
      </nav>

      <main>
        <ProductsListPage />
      </main>
    </>
  );
};

export default AdminPanel;