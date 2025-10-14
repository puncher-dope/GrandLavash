import { ReactNode } from "react";
import Sidebar from "./sidebar";
import './index.scss'

type SidebarLayoutProps = {
  children: ReactNode;
};

export default function SidebarLayout({ children }: SidebarLayoutProps) {
  return (
    <>
      <Sidebar />
      {children}
    </>
  );
}
