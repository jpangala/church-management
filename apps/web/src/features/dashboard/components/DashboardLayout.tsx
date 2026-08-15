import Sidebar from "./Sidebar";
import AmbientBackdrop from "./AmbientBackdrop";
import type { UserRole } from "../../auth/auth.types";

interface Props {
  role: UserRole;
  children: React.ReactNode;
}

/**
 * Full-bleed dashboard chrome. Sidebar (fixed) + scrolling main column.
 * Uses min-h-[100dvh] to dodge the iOS Safari viewport jump.
 */
export default function DashboardLayout({ role, children }: Props) {
  return (
    <div className="relative min-h-[100dvh] bg-background font-jakarta text-foreground">
      <AmbientBackdrop />
      <div className="mx-auto flex min-h-[100dvh] max-w-[1440px] items-start gap-4">
        <Sidebar role={role} />
        <main className="min-w-0 flex-1 px-4 pb-16 pr-6 md:pl-2">
          {children}
        </main>
      </div>
    </div>
  );
}
