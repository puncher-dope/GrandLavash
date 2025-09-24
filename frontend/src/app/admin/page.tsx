"use client";
import React from "react";
import ProtectedRoute from "./protectedRoute/protectedRoute";
import AdminPanel from "./components/adminPanel/adminPanel";
import AdminLayout from "./layout";
import HeaderLayout from "./components/sidebar/layout";

const page = () => {
  return (
    <AdminLayout>
      <ProtectedRoute>
        <HeaderLayout>
        <AdminPanel />
        </HeaderLayout>
      </ProtectedRoute>
    </AdminLayout>
  );
};

export default page;
