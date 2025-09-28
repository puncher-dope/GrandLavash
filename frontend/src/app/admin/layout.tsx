import { ReactNode } from "react";
import { ContextProvider } from "./context/contextProvider/contextProvider";
import HeaderLayout from "./components/sidebar/layout";

interface Props {
  children: ReactNode;
}

export default function AdminLayout({ children }: Props) {
  return <ContextProvider>
    <HeaderLayout>
    {children}
    </HeaderLayout>
    </ContextProvider>;
}
