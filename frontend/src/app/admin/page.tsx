"use client";
import React from "react";
import ProtectedRoute from "./protectedRoute/protectedRoute";
import AdminPanel from "./components/adminPanel/adminPanel";
import AdminLayout from "./layout";
import SidebarLayout from "./components/sidebar/layout";

const page = () => {
  return (
    <AdminLayout>
      <ProtectedRoute>
        <SidebarLayout>
        <AdminPanel />
        </SidebarLayout>
      </ProtectedRoute>
    </AdminLayout>
  );
};

export default page;
