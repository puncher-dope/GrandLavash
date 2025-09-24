"use client";
import { useMyContext } from "../../context/contextProvider";
import "./index.scss";

import React from "react";

const AdminPanel = () => {
  console.log("admin panel");

  const { openSidebar, isOpen } = useMyContext()

  const onOpenSidebar = () => {
    openSidebar()
  }


  return (
    <>
    
    {isOpen && <div className="sidebar-overlay" />}

    <header>
      <div className="admin-panel">
        <div className="admin-panel__title">Admin Panel</div>
        <button className="admin-panel__menu-btn" onClick={onOpenSidebar}>☰ Меню</button>
      </div>
    </header>



    <main>

    </main>
    </>
  );
};

export default AdminPanel;
