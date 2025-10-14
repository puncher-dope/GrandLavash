// MainPage/page.tsx
"use client";
import useOpenSidebar from "@/app/lib/api/store/useOpenSidebar";
import React, { useEffect, useState } from "react";
import "./index.scss";
import { useSearchParams } from "next/navigation";
import LoginModalPage from "../../loginModal/loginModal";
import { ProductsListPageContent } from "../productListPageContent/productListPage";
import { useUser } from "@/app/lib/api/store/useUser";
import { useAutoRefresh } from "@/app/lib/api/store/hooks/userAutoRefresh";

const MainPage = () => {
  const { isOpen, openSidebar } = useOpenSidebar();
  const [isScrolled, setIsScrolled] = useState(false);
  const { checkAuth, user } = useUser();

  useAutoRefresh();

  const onOpenSidebar = () => {
    openSidebar();
  };


  useEffect(() => {
    if (!user) {
      checkAuth();
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 20);
    };

    window.addEventListener("scroll", handleScroll);
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
        {loginPageParams === 'login' ? (<LoginModalPage/>) : (<ProductsListPageContent/>)}
      </main>
    </>
  );
};

export default MainPage;