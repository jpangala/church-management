import { useReveal } from "../lib/useReveal";

interface Props {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li";
}

export default function RevealOnView({
  children,
  delay = 0,
  className = "",
  as = "div",
}: Props) {
  const ref = useReveal<HTMLDivElement>(delay);
  const Tag = as as keyof JSX.IntrinsicElements;
  return (
    // @ts-expect-error dynamic tag
    <Tag ref={ref} data-reveal className={className}>
      {children}
    </Tag>
  );
}
