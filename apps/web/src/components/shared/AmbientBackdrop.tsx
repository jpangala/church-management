/**
 * Soft radial mesh — fixed under the dashboard. Champagne + sage orbs that
 * drift very slowly. Adds atmospheric depth without distracting from data.
 */
export default function AmbientBackdrop() {
  return (
    <>
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div
          aria-hidden
          className="absolute -left-32 top-[-12rem] h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle_at_center,hsl(41,53%,72%,0.28),transparent_60%)] animate-drift-orb"
        />
        <div
          aria-hidden
          className="absolute right-[-8rem] top-[18rem] h-[42rem] w-[42rem] rounded-full bg-[radial-gradient(circle_at_center,hsl(213,40%,55%,0.18),transparent_65%)] animate-drift-orb"
          style={{ animationDelay: "-7s" }}
        />
        <div
          aria-hidden
          className="absolute bottom-[-14rem] left-[12rem] h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle_at_center,hsl(140,28%,55%,0.14),transparent_60%)] animate-drift-orb"
          style={{ animationDelay: "-3s" }}
        />
      </div>
      <div className="grain-overlay" aria-hidden />
    </>
  );
}
