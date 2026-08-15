import { useAuth } from "../../auth/auth.context";
import DashboardLayout from "../components/DashboardLayout";
import TopBar from "../components/TopBar";
import Panel from "../components/Panel";
import StatCard from "../components/StatCard";
import Eyebrow from "../components/Eyebrow";
import IslandButton from "../components/IslandButton";
import RevealOnView from "../components/RevealOnView";
import {
  Users,
  Layers,
  Calendar,
  Sparkles,
  User,
  Document,
  Clipboard,
  Plus,
  Dots,
  ChevronRight,
} from "../components/icons";

// Mock data — replace with API queries when those modules ship.
const STATS = [
  {
    label: "Total Jemaat",
    value: "1,284",
    sub: "+38 anggota baru bulan ini",
    delta: { value: "3.0%", trend: "up" as const },
    icon: <Users width={15} height={15} />,
  },
  {
    label: "Divisi Aktif",
    value: "12",
    sub: "Semua memiliki ketua aktif",
    delta: { value: "Stabil", trend: "flat" as const },
    icon: <Layers width={15} height={15} />,
  },
  {
    label: "Booking Menunggu",
    value: "07",
    sub: "Tinjau & putuskan",
    delta: { value: "Perlu aksi", trend: "down" as const },
    icon: <Calendar width={15} height={15} />,
    accent: true,
  },
  {
    label: "Login Hari Ini",
    value: "23",
    sub: "Lintas semua peran",
    delta: { value: "12%", trend: "up" as const },
    icon: <Sparkles width={15} height={15} />,
  },
];

const ACTIVITY = [
  {
    when: "10 menit lalu",
    actor: "Sarah Lim",
    role: "Finance",
    action: "menyetujui entri pengeluaran",
    target: "Divisi Musik · Rp 1.450.000",
    tone: "approve" as const,
  },
  {
    when: "32 menit lalu",
    actor: "Andre Wijaya",
    role: "Division Leader",
    action: "membuat booking ruang",
    target: "Aula Utama · Sabtu, 21:00",
    tone: "create" as const,
  },
  {
    when: "1 jam lalu",
    actor: "Admin Gereja",
    role: "Admin",
    action: "memperbarui konten landing",
    target: "Hero · ID locale",
    tone: "update" as const,
  },
  {
    when: "2 jam lalu",
    actor: "Maria Santos",
    role: "Division Leader",
    action: "menambahkan anggota baru",
    target: "Divisi Doa · 2 anggota",
    tone: "create" as const,
  },
  {
    when: "Kemarin",
    actor: "System",
    role: "Audit",
    action: "menjalankan backup harian",
    target: "98% selesai",
    tone: "system" as const,
  },
];

const TONE = {
  approve: "bg-success/10 text-success ring-success/20",
  create: "bg-primary/10 text-primary ring-primary/20",
  update: "bg-accent/20 text-foreground/80 ring-accent/30",
  system: "bg-foreground/[0.05] text-muted-foreground ring-foreground/10",
} as const;

const MEMBERS = [
  { name: "Yosua Pangabean", role: "Division Leader · Worship", joined: "2 hari" },
  { name: "Rina Halim", role: "Finance · Treasurer", joined: "5 hari" },
  { name: "Daniel Tan", role: "Division Leader · Youth", joined: "1 mgg" },
  { name: "Grace Hartono", role: "Member · Outreach", joined: "1 mgg" },
];

const QUICK_ACTIONS = [
  { label: "Tambah Pengguna", icon: <User width={14} height={14} /> },
  { label: "Buat Divisi", icon: <Layers width={14} height={14} /> },
  { label: "Edit Landing", icon: <Document width={14} height={14} /> },
  { label: "Lihat Audit Log", icon: <Clipboard width={14} height={14} /> },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <DashboardLayout role="ADMIN">
      <TopBar
        eyebrow="Admin"
        title="Dashboard"
        caption={`${today} · Aktivitas terbaru sistem`}
        trailing={
          <IslandButton
            variant="primary"
            size="sm"
            trailingIcon={<Plus width={12} height={12} />}
          >
            Aksi Cepat
          </IslandButton>
        }
      />

      {/* HERO */}
      <RevealOnView className="mt-6">
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <Eyebrow tone="primary">Sesi Aktif</Eyebrow>
            <h1 className="mt-4 font-editorial text-[44px] leading-[1.05] tracking-[-0.025em] text-balance sm:text-[56px]">
              Selamat datang kembali,{" "}
              <span className="italic font-light text-primary/85">
                {user?.name?.split(" ")[0] ?? "Admin"}
              </span>
              .
            </h1>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground text-pretty">
              Tujuh booking menunggu persetujuan, dua entri keuangan butuh
              ditinjau, dan landing page baru selesai disinkronkan.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <IslandButton variant="primary">Tinjau Booking</IslandButton>
              <IslandButton variant="soft" trailingIcon={null}>
                Lihat Laporan Mingguan
              </IslandButton>
            </div>
          </div>

          {/* Mini health card */}
          <div className="lg:col-span-4">
            <Panel tone="champagne" inset="p-6">
              <Eyebrow tone="accent">System Health</Eyebrow>
              <div className="mt-5 grid grid-cols-3 gap-3">
                {[
                  { v: "99.9%", l: "Uptime" },
                  { v: "84ms", l: "API" },
                  { v: "OK", l: "DB" },
                ].map((m) => (
                  <div
                    key={m.l}
                    className="rounded-2xl bg-surface/80 p-3 ring-1 ring-inset ring-foreground/[0.06] shadow-inner-hairline"
                  >
                    <p className="font-editorial text-xl leading-none tracking-[-0.02em] text-foreground">
                      {m.v}
                    </p>
                    <p className="mt-1.5 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      {m.l}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-5 hairline" />
              <p className="mt-4 text-[12px] leading-relaxed text-muted-foreground">
                Backup harian terakhir 02:14 WIB. Tidak ada anomali audit
                dalam 24 jam terakhir.
              </p>
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

      {/* BENTO ROW 1 */}
      <RevealOnView delay={180} className="mt-6">
        <div className="grid gap-4 lg:grid-cols-12">
          {/* Activity feed */}
          <div className="lg:col-span-8">
            <Panel>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Eyebrow>Live Activity</Eyebrow>
                  <h2 className="mt-3 font-editorial text-2xl tracking-[-0.015em] text-foreground">
                    Riwayat Sistem
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Lima aksi terakhir lintas peran.
                  </p>
                </div>
                <button
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-foreground/[0.04] text-foreground/70 ring-1 ring-inset ring-foreground/[0.06]"
                  aria-label="More options"
                >
                  <Dots width={14} height={14} />
                </button>
              </div>

              <ul className="mt-6 divide-y divide-foreground/[0.06]">
                {ACTIVITY.map((a, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-4 py-4 first:pt-0 last:pb-0"
                  >
                    <span
                      className={`mt-1 inline-flex h-2 w-2 shrink-0 rounded-full ring-4 ${TONE[a.tone]}`}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                        <span className="font-medium text-foreground">
                          {a.actor}
                        </span>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                          {a.role}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {a.action}{" "}
                        <span className="text-foreground/85">{a.target}</span>
                      </p>
                    </div>
                    <span className="shrink-0 text-[11px] tabular-nums text-muted-foreground">
                      {a.when}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex justify-end">
                <IslandButton variant="ghost" size="sm">
                  Buka Audit Log
                </IslandButton>
              </div>
            </Panel>
          </div>

          {/* Quick actions stack */}
          <div className="flex flex-col gap-4 lg:col-span-4">
            <Panel inset="p-6">
              <Eyebrow>Quick Actions</Eyebrow>
              <h3 className="mt-3 font-editorial text-xl tracking-[-0.015em]">
                Pintasan
              </h3>
              <ul className="mt-5 space-y-2">
                {QUICK_ACTIONS.map((a) => (
                  <li key={a.label}>
                    <button className="group/qa flex w-full items-center gap-3 rounded-2xl bg-foreground/[0.03] px-3 py-2.5 text-left text-sm ring-1 ring-inset ring-foreground/[0.05] transition-all duration-500 ease-spring-out hover:bg-foreground/[0.06]">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-surface text-foreground/75 ring-1 ring-inset ring-foreground/[0.06]">
                        {a.icon}
                      </span>
                      <span className="flex-1 tracking-[-0.005em]">
                        {a.label}
                      </span>
                      <span className="opacity-0 transition-all duration-500 ease-spring-out group-hover/qa:translate-x-0.5 group-hover/qa:opacity-100">
                        <ChevronRight width={12} height={12} />
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </Panel>

            <Panel tone="espresso" inset="p-6">
              <Eyebrow tone="accent">Spotlight</Eyebrow>
              <h3 className="mt-3 font-editorial text-xl tracking-[-0.015em] text-white">
                Sinkron mingguan
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-white/65">
                Laporan ringkas otomatis dikirim setiap Senin 07:00. Akan
                dijadwalkan ulang setelah audit selesai.
              </p>
              <div className="mt-5">
                <IslandButton variant="soft" size="sm">
                  Kelola Jadwal
                </IslandButton>
              </div>
            </Panel>
          </div>
        </div>
      </RevealOnView>

      {/* BENTO ROW 2 */}
      <RevealOnView delay={220} className="mt-4">
        <div className="grid gap-4 lg:grid-cols-12">
          {/* Recent members */}
          <div className="lg:col-span-7">
            <Panel>
              <div className="flex items-center justify-between">
                <div>
                  <Eyebrow>Recently Joined</Eyebrow>
                  <h2 className="mt-3 font-editorial text-2xl tracking-[-0.015em]">
                    Anggota Baru
                  </h2>
                </div>
                <IslandButton variant="ghost" size="sm">
                  Semua anggota
                </IslandButton>
              </div>
              <ul className="mt-6 grid gap-2">
                {MEMBERS.map((m) => {
                  const initials = m.name
                    .split(" ")
                    .map((s) => s[0])
                    .slice(0, 2)
                    .join("");
                  return (
                    <li
                      key={m.name}
                      className="flex items-center gap-4 rounded-2xl bg-foreground/[0.02] px-3 py-3 ring-1 ring-inset ring-foreground/[0.05]"
                    >
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/90 font-editorial text-[13px] font-medium text-primary-foreground shadow-soft-glow">
                        {initials}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">
                          {m.name}
                        </p>
                        <p className="truncate text-[12px] text-muted-foreground">
                          {m.role}
                        </p>
                      </div>
                      <span className="shrink-0 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                        {m.joined}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </Panel>
          </div>

          {/* Storage breakdown */}
          <div className="lg:col-span-5">
            <Panel>
              <Eyebrow>Footprint</Eyebrow>
              <h2 className="mt-3 font-editorial text-2xl tracking-[-0.015em]">
                Penyimpanan
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Total terpakai 4.8 GB / 25 GB.
              </p>
              <div className="mt-6 flex h-3 overflow-hidden rounded-full bg-foreground/[0.05]">
                <span className="h-full bg-primary" style={{ width: "42%" }} />
                <span className="h-full bg-accent" style={{ width: "28%" }} />
                <span
                  className="h-full bg-success/70"
                  style={{ width: "18%" }}
                />
              </div>
              <ul className="mt-5 space-y-3">
                {[
                  { c: "bg-primary", l: "Dokumen & receipt", v: "2.0 GB" },
                  { c: "bg-accent", l: "Foto anggota & divisi", v: "1.4 GB" },
                  { c: "bg-success/70", l: "Konten landing", v: "0.9 GB" },
                  { c: "bg-foreground/[0.15]", l: "Lainnya", v: "0.5 GB" },
                ].map((row) => (
                  <li
                    key={row.l}
                    className="flex items-center gap-3 text-sm text-foreground/85"
                  >
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${row.c}`}
                      aria-hidden
                    />
                    <span className="flex-1">{row.l}</span>
                    <span className="tabular-nums text-muted-foreground">
                      {row.v}
                    </span>
                  </li>
                ))}
              </ul>
            </Panel>
          </div>
        </div>
      </RevealOnView>
    </DashboardLayout>
  );
}
