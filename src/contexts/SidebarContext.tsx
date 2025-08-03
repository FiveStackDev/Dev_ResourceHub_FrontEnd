import React, { createContext, useContext, useState, useMemo } from 'react';

// Sidebar dimensions
const EXPANDED_WIDTH = 225;
const COLLAPSED_WIDTH = 75;
const MOBILE_BREAKPOINT = 768; // Updated to md breakpoint

interface SidebarContextType {
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
  isMobile: boolean;
  sidebarWidth: number;
}

const SidebarContext = createContext<SidebarContextType>({
  isOpen: true,
  toggle: () => {},
  open: () => {},
  close: () => {},
  isMobile: false,
  sidebarWidth: EXPANDED_WIDTH,
});

export const useSidebar = () => useContext(SidebarContext);

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Handle window resize effect
  React.useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < MOBILE_BREAKPOINT;
      setIsMobile(mobile);
      if (mobile) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    // Initial call
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggle = () => setIsOpen((prev) => !prev);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  // Calculate sidebar width based on state and mobile
  const sidebarWidth = isMobile ? (isOpen ? EXPANDED_WIDTH : 0) : (isOpen ? EXPANDED_WIDTH : COLLAPSED_WIDTH);

  const value = useMemo(
    () => ({ isOpen, toggle, open, close, isMobile, sidebarWidth }),
    [isOpen, isMobile, sidebarWidth],
  );

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
};
