"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { CheckAuthType, MyContextType, refreshTokenType } from "./models";
import { request } from "@/app/lib/api/store/hooks/request";
import { CHECK_AUTH,  LOGOUT_ADMIN, REFRESH_AUTH } from "@/app/lib/api/constants/api";

const MyContext = createContext<MyContextType | undefined>(undefined);


export const useMyContext = (): MyContextType => {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error("useMyContext должен использоваться в MyProvider");
  }
  return context;
};



export const ContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentRouter, setCurrentRouter] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const [name, setName] = useState<string | undefined>()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        closeSidebar();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden'; 
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);


const checkAuth = useCallback(async (): Promise<string | boolean> => {
  try {
    setIsLoading(true);
    const { data } = await request<CheckAuthType>(CHECK_AUTH, "GET");

    if (data?.authenticated) {
      setCurrentRouter(true);
      setName(data.admin.login)
      return true;
    }

    if (data?.shouldRefresh) {
      try {
        const { data: refreshTokenData } = await request<refreshTokenType>(REFRESH_AUTH, "POST");
        
        if (refreshTokenData?.message === 'Tokens refreshed successfully') {
          const { data: newAuthData } = await request<CheckAuthType>(CHECK_AUTH, "GET");
          
          if (newAuthData?.authenticated) {
            setCurrentRouter(true);
            setName(newAuthData.admin.login)
            return true;
          }
        }
      } catch (refreshError) {
        console.log('Refresh failed:', refreshError);
      }
    }

    setCurrentRouter(false);
    setName('')
    return false;

  } catch (error) {
    console.error('CheckAuth error:', error);
    setName('')
    setCurrentRouter(false);
    return error instanceof Error ? error.message : "Неизвестная ошибка";
  } finally {
    setIsLoading(false);
  }
}, []);

    useEffect(() => {
      checkAuth()
    }, [checkAuth])

    const logout = useCallback(async () => {
      try{
        await request(LOGOUT_ADMIN, 'POST')
      }catch(reason){
        return reason instanceof Error ? reason.message : "Неизвестная ошибка";
      }finally{
        setCurrentRouter(false)
      }
    },[])

    const openSidebar = () => setIsOpen(true)
    const closeSidebar = () => setIsOpen(false)
    const toggleSidebar = () => setIsOpen(prev => !prev)


  const MyContextValue: MyContextType = {
    router: currentRouter,
    isLoading,
    isOpen,
    openSidebar,
    closeSidebar,
    toggleSidebar,
    checkAuth,
    logout,
    name,
    sidebarRef 
  };
  return (
    <MyContext.Provider value={MyContextValue}>{children}</MyContext.Provider>
  );
};
