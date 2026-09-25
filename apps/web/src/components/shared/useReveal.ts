import { useEffect, useRef } from "react";

/**
 * Gentle scroll-reveal hook. Wires IntersectionObserver to a ref
 * and flips data-reveal="in" once the element enters the viewport.
 * Global CSS in styles/globals.css handles the actual fade-rise.
 */
export function useReveal<T extends HTMLElement>(delayMs = 0) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--reveal-delay", `${delayMs}ms`);

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset.reveal = "in";
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "-40px 0px", threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delayMs]);

  return ref;
}
