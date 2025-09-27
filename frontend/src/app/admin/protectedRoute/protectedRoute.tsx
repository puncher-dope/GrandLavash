"use client";
import { Spin } from "antd";
import { useMyContext } from "../context/contextProvider/contextProvider";
import { IProtectedRouter } from "./models";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children }: IProtectedRouter) => {
  const { router, isLoading } = useMyContext();
  const navigation = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);


  useEffect(() => {
    const timer = setTimeout(() => {
      setIsChecking(false)
    }, 500)

    return () => clearTimeout(timer)
  },[])


  useEffect(() => {
     if(!router && !isLoading && !isChecking && pathname !== '/admin/login') {
      navigation.replace("/admin/login");
      console.log('Редирект на логин')
    }
  },[router, isLoading, navigation, isChecking, pathname])


  if(!router){
    return <Spin/>
  }

  return router ? children : null 
};

export default ProtectedRoute;
