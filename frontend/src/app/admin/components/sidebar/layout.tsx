import { ReactNode } from "react";
import Sidebar from "./sidebar";
import './index.scss'

type HeaderLayoutProps = {
  children: ReactNode;
};

export default function HeaderLayout({ children }: HeaderLayoutProps) {
  return (
    <>
      <Sidebar />
      {children}
    </>
  );
}
