import { ReactNode } from "react";
import Sidebar from "./page";
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
