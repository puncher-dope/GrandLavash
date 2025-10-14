import React, { ReactNode } from "react";
import MainSidebar from "./mainSidebar";

type MainSidebarLayoutProps = {
    children: ReactNode
}

const MainSidebarLayout = ({ children }: MainSidebarLayoutProps) => {
  return (
    <>
      <MainSidebar />
      {children}
    </>
  );
};

export default MainSidebarLayout;
