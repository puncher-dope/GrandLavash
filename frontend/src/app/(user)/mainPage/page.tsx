"use client";
import useOpenSidebar from "@/app/lib/api/store/useOpenSidebar";
import React, { useEffect, useState } from "react";
import "./index.scss";
import { useSearchParams } from "next/navigation";
import LoginModalPage from "../loginModal/page";
import ProductModalPage from "../productModalPage/page";

const MainPage = () => {
  const { isOpen, openSidebar } = useOpenSidebar();
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
    console.log("hello");
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

const searchParams = useSearchParams()
const loginPageParams = searchParams.get('user-auth')



  return (
    <>
      {isOpen && <div className="sidebar-overlay" />}

      <nav>
        <div className={`user-panel ${isScrolled ? "scrolled" : ""}`}>
          <div className="user-panel__title">Grand Lavash</div>
          <button className="user-panel__menu-btn" onClick={onOpenSidebar}>
            Меню
          </button>
        </div>
      </nav>

      <main>
        {loginPageParams === 'login' ? (<LoginModalPage/>) : (<ProductModalPage/>)}
      </main>
    </>
  );
};

export default MainPage;
