import { createContext, useContext, useState, type ReactNode } from "react";

interface MobileNav {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const MobileNavContext = createContext<MobileNav | null>(null);

/**
 * Open/closed state for the sidebar drawer on screens narrower than `md`.
 * DashboardLayout provides it; TopBar's menu button opens it; Sidebar renders
 * the drawer. Null outside a DashboardLayout, so TopBar hides the button there.
 */
export function MobileNavProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <MobileNavContext.Provider value={{ open, setOpen }}>
      {children}
    </MobileNavContext.Provider>
  );
}

export function useMobileNav() {
  return useContext(MobileNavContext);
}
