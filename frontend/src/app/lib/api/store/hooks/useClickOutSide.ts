import { useEffect, RefObject } from "react";
import useOpenSidebar from "../useOpenSidebar";

export const useClickOutside = (ref: RefObject<HTMLElement>) => {
  const { isOpen, closeSidebar } = useOpenSidebar();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref === null) return;
      if (ref.current && !ref.current.contains(event.target as Node)) {
        closeSidebar();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, closeSidebar, ref]);
};
