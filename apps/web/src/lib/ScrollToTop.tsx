import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Resets window scroll to top on every pathname change.
 * Mount once inside <BrowserRouter>. SPA navigations otherwise keep
 * the previous page's scroll position, which is jarring on long lists.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}
