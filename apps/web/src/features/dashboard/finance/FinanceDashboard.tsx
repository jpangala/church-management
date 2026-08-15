import { useAuth } from "../../auth/auth.context";
import DashboardLayout from "../components/DashboardLayout";
import TopBar from "../components/TopBar";
import Panel from "../components/Panel";
import StatCard from "../components/StatCard";
import Eyebrow from "../components/Eyebrow";
import IslandButton from "../components/IslandButton";
import RevealOnView from "../components/RevealOnView";
import {
  ArrowUp,
  ArrowDown,
  Sparkles,
  ChartLine,
  Plus,
  Tag,
} from "../components/icons";

// Mock — replaced by /api/finance/* queries in Sprint 3.
const STATS = [
  {
    label: "Income · Bulan ini",
    value: "Rp 84.2M",
    sub: "Persembahan + donasi terikat",
    delta: { value: "12.4%", trend: "up" as const },
    icon: <ArrowUp width={14} height={14} />,
  },
  {
    label: "Expense · Bulan ini",
    value: "Rp 61.8M",
    sub: "Lintas 8 divisi · 47 entri",
    delta: { value: "4.1%", trend: "up" as const },
    icon: <ArrowDown width={14} height={14} />,
  },
  {
    label: "Net Balance",
    value: "Rp 22.4M",
    sub: "Surplus diteruskan ke reserve",
    delta: { value: "Sehat", trend: "up" as const },
    icon: <Sparkles width={14} height={14} />,
    accent: true,
  },
  {
    label: "Persetujuan Pending",
    value: "04",
    sub: "Rp 8.9M total nilai",
    delta: { value: "2 baru", trend: "down" as const },
    icon: <ChartLine width={14} height={14} />,
  },
];

// 12 bulan terakhir — synthetic shape
const MONTHS = [
  { m: "Jul", in: 62, out: 51 },
  { m: "Agu", in: 58, out: 49 },
  { m: "Sep", in: 67, out: 55 },
  { m: "Okt", in: 71, out: 58 },
  { m: "Nov", in: 65, out: 53 },
  { m: "Des", in: 89, out: 72 },
  { m: "Jan", in: 74, out: 58 },
  { m: "Feb", in: 68, out: 54 },
  { m: "Mar", in: 76, out: 59 },
  { m: "Apr", in: 78, out: 60 },
  { m: "Mei", in: 81, out: 62 },
  { m: "Jun", in: 84, out: 62 },
];

const TRANSACTIONS = [
  {
    id: "TXN-1421",
    when: "Hari ini · 09:14",
    label: "Persembahan minggu II",
    division: "Bendahara",
    amount: "+ Rp 18.2M",
    type: "in" as const,
  },
  {
    id: "TXN-1420",
    when: "Hari ini · 08:01",
    label: "Sewa sound system",
    division: "Divisi Musik",
    amount: "- Rp 2.8M",
    type: "out" as const,
  },
  {
    id: "TXN-1419",
    when: "Kemarin",
    label: "Donasi pembangunan",
    division: "Bendahara",
    amount: "+ Rp 12.0M",
    type: "in" as const,
  },
  {
    id: "TXN-1418",
    when: "Kemarin",
    label: "Konsumsi rapat ketua",
    division: "Sekretariat",
    amount: "- Rp 0.6M",
    type: "out" as const,
  },
  {
    id: "TXN-1417",
    when: "2 hari lalu",
    label: "Cetak buletin Juni",
    division: "Media",
    amount: "- Rp 1.4M",
    type: "out" as const,
  },
];

const BUDGETS = [
  { name: "Musik & Worship", used: 62, total: 100, color: "bg-primary" },
  { name: "Pelayanan Diakonia", used: 78, total: 100, color: "bg-accent" },
  { name: "Pemuda & Remaja", used: 41, total: 100, color: "bg-success/70" },
  { name: "Media & Publikasi", used: 88, total: 100, color: "bg-warning" },
  { name: "Doa & Konseling", used: 24, total: 100, color: "bg-primary/70" },
];

// --- Inline SVG chart (no library) ---
function IncomeExpenseChart() {
  const max = Math.max(...MONTHS.flatMap((d) => [d.in, d.out]));
  const W = 720;
  const H = 220;
  const padX = 24;
  const padY = 20;
  const bandW = (W - padX * 2) / MONTHS.length;
  const barW = Math.min(14, bandW * 0.32);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label="Income vs expense, 12 bulan terakhir"
      className="h-56 w-full"
    >
      <defs>
        <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(213,51%,30%)" />
          <stop offset="100%" stopColor="hsl(213,51%,18%)" />
        </linearGradient>
        <linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(41,52%,68%)" />
          <stop offset="100%" stopColor="hsl(41,46%,52%)" />
        </linearGradient>
      </defs>

      {/* Horizontal grid */}
      {[0, 0.25, 0.5, 0.75, 1].map((t) => (
        <line
          key={t}
          x1={padX}
          x2={W - padX}
          y1={padY + (H - padY * 2) * t}
          y2={padY + (H - padY * 2) * t}
          stroke="hsl(213,30%,30%)"
          strokeOpacity={t === 1 ? 0.18 : 0.06}
          strokeWidth={1}
          strokeDasharray={t === 1 ? "0" : "2 4"}
        />
      ))}

      {MONTHS.map((d, i) => {
        const xCenter = padX + bandW * i + bandW / 2;
        const hIn = ((H - padY * 2) * d.in) / max;
        const hOut = ((H - padY * 2) * d.out) / max;
        const yIn = H - padY - hIn;
        const yOut = H - padY - hOut;
        return (
          <g key={d.m}>
            {/* Expense (bg, slightly behind) */}
            <rect
              x={xCenter - barW - 1}
              y={yOut}
              width={barW}
              height={hOut}
              rx={3}
              fill="url(#expenseFill)"
              opacity={0.95}
            />
            {/* Income (fg) */}
            <rect
              x={xCenter + 1}
              y={yIn}
              width={barW}
              height={hIn}
              rx={3}
              fill="url(#incomeFill)"
            />
            <text
              x={xCenter}
              y={H - 4}
              textAnchor="middle"
              fontSize="10"
              fill="hsl(213,15%,42%)"
              fontFamily="Plus Jakarta Sans, sans-serif"
              letterSpacing="0.04em"
            >
              {d.m}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function FinanceDashboard() {
  const { user } = useAuth();
  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <DashboardLayout role="FINANCE">
      <TopBar
        eyebrow="Finance"
        title="Dashboard"
        caption={`${today} · Ringkasan kas`}
        trailing={
          <IslandButton
            variant="primary"
            size="sm"
            trailingIcon={<Plus width={12} height={12} />}
          >
            Entri Baru
          </IslandButton>
        }
      />

      {/* HERO */}
      <RevealOnView className="mt-6">
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Eyebrow tone="primary">Closing periode · Juni</Eyebrow>
            <h1 className="mt-4 font-editorial text-[44px] leading-[1.05] tracking-[-0.025em] text-balance sm:text-[56px]">
              Kas berjalan,{" "}
              <span className="italic font-light text-primary/85">
                {user?.name?.split(" ")[0] ?? "Bendahara"}
              </span>
              .
            </h1>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground text-pretty">
              Surplus bulan ini Rp 22.4M. Empat entri pengeluaran menunggu
              persetujuan dengan nilai gabungan Rp 8.9M.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <IslandButton variant="primary">Setujui Antrian</IslandButton>
              <IslandButton variant="soft" trailingIcon={null}>
                Tutup buku bulan ini
              </IslandButton>
            </div>
          </div>

          {/* Reserve card */}
          <div className="lg:col-span-5">
            <Panel tone="espresso" inset="p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Eyebrow tone="accent">Reserve · Endowment</Eyebrow>
                  <p className="mt-5 font-editorial text-5xl font-light leading-none tracking-[-0.02em] text-white">
                    Rp 312M
                  </p>
                  <p className="mt-3 text-[13px] leading-relaxed text-white/65">
                    Cadangan terlindungi, target 6 bulan operasi. Tercapai 74%.
                  </p>
                </div>
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.08] text-white/85 ring-1 ring-inset ring-white/10">
                  <Sparkles width={15} height={15} />
                </span>
              </div>
              <div className="mt-6 flex h-2 overflow-hidden rounded-full bg-white/[0.08]">
                <span
                  className="block h-full bg-accent"
                  style={{ width: "74%" }}
                />
              </div>
              <div className="mt-5 flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-white/55">
                <span>Target Rp 420M</span>
                <span>74% · +2.1% MoM</span>
              </div>
            </Panel>
          </div>
        </div>
      </RevealOnView>

      {/* KPI ROW */}
      <RevealOnView delay={120} className="mt-10">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {STATS.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>
      </RevealOnView>

      {/* CHART + TRANSACTIONS */}
      <RevealOnView delay={180} className="mt-6">
        <div className="grid gap-4 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <Panel>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <Eyebrow>12 Bulan Terakhir</Eyebrow>
                  <h2 className="mt-3 font-editorial text-2xl tracking-[-0.015em]">
                    Income vs Expense
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Tren stabil, Desember puncak musiman karena Natal.
                  </p>
                </div>
                <div className="flex items-center gap-4 text-[12px]">
                  <span className="inline-flex items-center gap-2 text-foreground/85">
                    <span className="h-2 w-3 rounded-sm bg-primary" />
                    Income
                  </span>
                  <span className="inline-flex items-center gap-2 text-foreground/85">
                    <span className="h-2 w-3 rounded-sm bg-accent" />
                    Expense
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <IncomeExpenseChart />
              </div>

              <div className="mt-2 grid grid-cols-3 gap-3 border-t border-foreground/[0.05] pt-5">
                {[
                  { l: "Income YTD", v: "Rp 482M" },
                  { l: "Expense YTD", v: "Rp 364M" },
                  { l: "Surplus YTD", v: "Rp 118M" },
                ].map((m) => (
                  <div key={m.l}>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                      {m.l}
                    </p>
                    <p className="mt-1 font-editorial text-xl tracking-[-0.015em] text-foreground">
                      {m.v}
                    </p>
                  </div>
                ))}
              </div>
            </Panel>
          </div>

          <div className="lg:col-span-4">
            <Panel>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Eyebrow>Transaksi</Eyebrow>
                  <h2 className="mt-3 font-editorial text-2xl tracking-[-0.015em]">
                    Terbaru
                  </h2>
                </div>
                <IslandButton variant="ghost" size="sm">
                  Semua
                </IslandButton>
              </div>
              <ul className="mt-6 space-y-3">
                {TRANSACTIONS.map((t) => (
                  <li
                    key={t.id}
                    className="flex items-center gap-3 rounded-2xl bg-foreground/[0.02] px-3 py-3 ring-1 ring-inset ring-foreground/[0.05]"
                  >
                    <span
                      className={`inline-flex h-9 w-9 items-center justify-center rounded-full ring-1 ring-inset ${
                        t.type === "in"
                          ? "bg-success/10 text-success ring-success/20"
                          : "bg-destructive/10 text-destructive ring-destructive/20"
                      }`}
                    >
                      {t.type === "in" ? (
                        <ArrowUp width={14} height={14} />
                      ) : (
                        <ArrowDown width={14} height={14} />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-medium text-foreground">
                        {t.label}
                      </p>
                      <p className="truncate text-[11px] text-muted-foreground">
                        {t.division} · {t.when}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 font-mono text-[12px] tabular-nums ${
                        t.type === "in" ? "text-success" : "text-destructive"
                      }`}
                    >
                      {t.amount}
                    </span>
                  </li>
                ))}
              </ul>
            </Panel>
          </div>
        </div>
      </RevealOnView>

      {/* BUDGET BY DIVISION */}
      <RevealOnView delay={220} className="mt-4">
        <Panel>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Eyebrow>Anggaran</Eyebrow>
              <h2 className="mt-3 font-editorial text-2xl tracking-[-0.015em]">
                Budget per Divisi
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Realisasi vs alokasi bulan berjalan.
              </p>
            </div>
            <IslandButton
              variant="ghost"
              size="sm"
              trailingIcon={<Tag width={12} height={12} />}
            >
              Atur Kategori
            </IslandButton>
          </div>

          <ul className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {BUDGETS.map((b) => (
              <li
                key={b.name}
                className="rounded-[1.25rem] bg-foreground/[0.025] p-[5px] ring-1 ring-inset ring-foreground/[0.05]"
              >
                <div className="rounded-[calc(1.25rem-5px)] bg-surface p-4 shadow-inner-hairline">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[13px] font-medium text-foreground">
                      {b.name}
                    </p>
                    <span
                      className={`text-[11px] font-medium tabular-nums ${
                        b.used > 85
                          ? "text-destructive"
                          : b.used > 65
                            ? "text-warning"
                            : "text-success"
                      }`}
                    >
                      {b.used}%
                    </span>
                  </div>
                  <div className="mt-3 flex h-1.5 overflow-hidden rounded-full bg-foreground/[0.05]">
                    <span
                      className={`block h-full ${b.color}`}
                      style={{ width: `${b.used}%` }}
                    />
                  </div>
                  <p className="mt-3 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    Rp {(b.used * 0.18).toFixed(1)}M / Rp{" "}
                    {(b.total * 0.18).toFixed(1)}M
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </RevealOnView>
    </DashboardLayout>
  );
}
