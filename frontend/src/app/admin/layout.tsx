import { ReactNode } from "react";
import { ContextProvider } from "./context/contextProvider";

interface Props {
  children: ReactNode;
}

export default function AdminLayout({ children }: Props) {
  return <ContextProvider>
    {children}
    </ContextProvider>;
}
