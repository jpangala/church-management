import { useAuth } from "../../auth/auth.context";
import DashboardLayout from "../components/DashboardLayout";
import TopBar from "../components/TopBar";
import Panel from "../components/Panel";
import StatCard from "../components/StatCard";
import Eyebrow from "../components/Eyebrow";
import IslandButton from "../components/IslandButton";
import RevealOnView from "../components/RevealOnView";
import {
  User,
  Folder,
  Calendar,
  Sparkles,
  Plus,
  ChevronRight,
  Dots,
} from "../components/icons";

// Mock — replace with /api/divisions/me + /api/bookings + /api/projects later.
const STATS = [
  {
    label: "Anggota Aktif",
    value: "32",
    sub: "2 anggota baru minggu ini",
    delta: { value: "6%", trend: "up" as const },
    icon: <User width={14} height={14} />,
  },
  {
    label: "Proyek Berjalan",
    value: "05",
    sub: "1 akan selesai minggu depan",
    delta: { value: "ONGOING", trend: "flat" as const },
    icon: <Folder width={14} height={14} />,
  },
  {
    label: "Booking Menunggu",
    value: "03",
    sub: "Tunggu approval Admin",
    delta: { value: "PENDING", trend: "down" as const },
    icon: <Calendar width={14} height={14} />,
    accent: true,
  },
  {
    label: "Event Mendatang",
    value: "07",
    sub: "14 hari ke depan",
    delta: { value: "Jadwal padat", trend: "up" as const },
    icon: <Sparkles width={14} height={14} />,
  },
];

const PROJECTS = [
  {
    title: "Konser Paduan Suara Natal",
    status: "ONGOING" as const,
    progress: 64,
    range: "Mei – Des 2026",
    tag: "Musik",
    members: 18,
  },
  {
    title: "Rekrutmen Sukarelawan Q3",
    status: "PLANNED" as const,
    progress: 12,
    range: "Jul – Sep 2026",
    tag: "SDM",
    members: 6,
  },
  {
    title: "Retret Pemuda Bromo",
    status: "ONGOING" as const,
    progress: 82,
    range: "Apr – Jul 2026",
    tag: "Pemuda",
    members: 24,
  },
  {
    title: "Bakti Sosial Banten",
    status: "DONE" as const,
    progress: 100,
    range: "Selesai Mei 2026",
    tag: "Diakonia",
    members: 12,
  },
];

const STATUS_TONE = {
  PLANNED: "bg-foreground/[0.05] text-muted-foreground ring-foreground/[0.1]",
  ONGOING: "bg-primary/10 text-primary ring-primary/20",
  DONE: "bg-success/10 text-success ring-success/20",
} as const;

const BOOKINGS = [
  {
    when: "Sab, 21 Jun · 18:00 – 21:00",
    purpose: "Latihan paduan suara Natal",
    room: "Aula Utama",
    status: "PENDING" as const,
  },
  {
    when: "Ming, 22 Jun · 09:00 – 11:00",
    purpose: "Doa pagi pemuda",
    room: "Ruang Doa A",
    status: "APPROVED" as const,
  },
  {
    when: "Sel, 24 Jun · 19:30 – 21:30",
    purpose: "Workshop dokumentasi",
    room: "Studio Media",
    status: "PENDING" as const,
  },
  {
    when: "Kam, 26 Jun · 17:00 – 19:00",
    purpose: "Rapat ketua divisi",
    room: "Ruang Sekretariat",
    status: "APPROVED" as const,
  },
];

const BOOKING_TONE = {
  PENDING: "bg-warning/15 text-warning ring-warning/30",
  APPROVED: "bg-success/10 text-success ring-success/20",
  REJECTED: "bg-destructive/10 text-destructive ring-destructive/20",
  CANCELLED: "bg-foreground/[0.05] text-muted-foreground ring-foreground/10",
} as const;

const TEAM = [
  { name: "Yosua Pangabean", role: "Ketua Divisi" },
  { name: "Ratna Sari", role: "Wakil Ketua" },
  { name: "Daniel Pratama", role: "Koordinator Latihan" },
  { name: "Mira Saputra", role: "Sekretaris" },
  { name: "Andre Wijaya", role: "Anggota" },
  { name: "Grace Hartono", role: "Anggota" },
];

export default function DivisionDashboard() {
  const { user } = useAuth();
  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <DashboardLayout role="DIVISION_LEADER">
      <TopBar
        eyebrow="Division"
        title="Dashboard"
        caption={`${today} · Divisi Musik & Worship`}
        trailing={
          <IslandButton
            variant="primary"
            size="sm"
            trailingIcon={<Plus width={12} height={12} />}
          >
            Buat Booking
          </IslandButton>
        }
      />

      {/* HERO */}
      <RevealOnView className="mt-6">
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Eyebrow tone="primary">Divisi Musik · Periode aktif</Eyebrow>
            <h1 className="mt-4 font-editorial text-[44px] leading-[1.05] tracking-[-0.025em] text-balance sm:text-[56px]">
              Pagi yang penuh nada,{" "}
              <span className="italic font-light text-primary/85">
                {user?.name?.split(" ")[0] ?? "Ketua"}
              </span>
              .
            </h1>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground text-pretty">
              Tiga booking ruangan menunggu persetujuan dan satu proyek Natal
              mendekati 65% progress. Tim siap rapat malam ini.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <IslandButton variant="primary">
                Lihat Booking Pending
              </IslandButton>
              <IslandButton variant="soft" trailingIcon={null}>
                Tambah Anggota
              </IslandButton>
            </div>
          </div>

          {/* Next event card */}
          <div className="lg:col-span-5">
            <Panel tone="champagne" inset="p-6">
              <Eyebrow tone="accent">Event Berikutnya</Eyebrow>
              <p className="mt-5 font-editorial text-[28px] leading-tight tracking-[-0.015em] text-foreground">
                Latihan paduan suara Natal
              </p>
              <div className="mt-4 hairline" />
              <ul className="mt-4 space-y-2.5 text-[13px] text-foreground/85">
                <li className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Tanggal</span>
                  <span className="tabular-nums">Sab, 21 Jun 2026</span>
                </li>
                <li className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Waktu</span>
                  <span className="tabular-nums">18:00 — 21:00 WIB</span>
                </li>
                <li className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Ruangan</span>
                  <span>Aula Utama</span>
                </li>
                <li className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Status</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-warning/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-warning ring-1 ring-inset ring-warning/30">
                    Menunggu
                  </span>
                </li>
              </ul>
              <div className="mt-5 flex justify-end">
                <IslandButton variant="soft" size="sm">
                  Lihat detail
                </IslandButton>
              </div>
            </Panel>
          </div>
        </div>
      </RevealOnView>

      {/* KPIs */}
      <RevealOnView delay={120} className="mt-10">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {STATS.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>
      </RevealOnView>

      {/* PROJECT BOARD */}
      <RevealOnView delay={180} className="mt-6">
        <Panel>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Eyebrow>Project Rail</Eyebrow>
              <h2 className="mt-3 font-editorial text-2xl tracking-[-0.015em]">
                Proyek divisi
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Geser untuk melihat semua. Status hidup, progress real-time.
              </p>
            </div>
            <IslandButton variant="ghost" size="sm">
              Semua proyek
            </IslandButton>
          </div>

          <ul className="-mx-2 mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-2 pb-2">
            {PROJECTS.map((p, i) => (
              <li key={p.title} className="snap-start shrink-0 basis-[19rem]">
                <div className="rounded-[1.5rem] bg-foreground/[0.035] p-[5px] ring-1 ring-inset ring-foreground/[0.05] shadow-soft-lift transition-transform duration-700 ease-spring-soft hover:-translate-y-1">
                  <div className="rounded-[calc(1.5rem-5px)] bg-surface p-5 shadow-inner-hairline">
                    <div className="flex items-start justify-between gap-3">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.2em] ring-1 ring-inset ${STATUS_TONE[p.status]}`}
                      >
                        {p.status}
                      </span>
                      <button
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-foreground/[0.04] text-foreground/70 ring-1 ring-inset ring-foreground/[0.06]"
                        aria-label="More"
                      >
                        <Dots width={12} height={12} />
                      </button>
                    </div>

                    <h3 className="mt-5 font-editorial text-[20px] leading-[1.15] tracking-[-0.015em] text-foreground">
                      {p.title}
                    </h3>
                    <p className="mt-1.5 text-[12px] text-muted-foreground">
                      {p.range} · {p.tag}
                    </p>

                    {/* Progress */}
                    <div className="mt-5">
                      <div className="flex items-baseline justify-between">
                        <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                          Progress
                        </span>
                        <span className="font-editorial text-base tabular-nums tracking-[-0.015em] text-foreground">
                          {p.progress}%
                        </span>
                      </div>
                      <div className="mt-2 flex h-1.5 overflow-hidden rounded-full bg-foreground/[0.05]">
                        <span
                          className="block h-full bg-primary"
                          style={{ width: `${p.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Avatars */}
                    <div className="mt-5 flex items-center justify-between">
                      <div className="flex -space-x-2">
                        {Array.from({ length: Math.min(p.members, 4) }).map(
                          (_, k) => (
                            <span
                              key={k}
                              className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/85 text-[10px] font-medium text-primary-foreground ring-2 ring-surface"
                              style={{
                                background: `hsl(${(i * 73 + k * 41) % 360}, 38%, 38%)`,
                              }}
                            >
                              {String.fromCharCode(65 + ((k + i) % 26))}
                            </span>
                          ),
                        )}
                        {p.members > 4 && (
                          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-foreground/[0.08] text-[10px] font-medium text-foreground/70 ring-2 ring-surface">
                            +{p.members - 4}
                          </span>
                        )}
                      </div>
                      <button className="inline-flex items-center gap-1 text-[12px] font-medium text-foreground/80 transition-colors hover:text-primary">
                        Detail
                        <ChevronRight width={11} height={11} />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </RevealOnView>

      {/* BOOKINGS + TEAM */}
      <RevealOnView delay={220} className="mt-4">
        <div className="grid gap-4 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Panel>
              <div className="flex items-end justify-between gap-3">
                <div>
                  <Eyebrow>Bookings</Eyebrow>
                  <h2 className="mt-3 font-editorial text-2xl tracking-[-0.015em]">
                    Antrian Ruangan
                  </h2>
                </div>
                <IslandButton variant="ghost" size="sm">
                  Kalender penuh
                </IslandButton>
              </div>
              <ul className="mt-6 divide-y divide-foreground/[0.06]">
                {BOOKINGS.map((b, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
                  >
                    <div className="hidden sm:flex flex-col items-center rounded-2xl bg-foreground/[0.04] px-3 py-2 ring-1 ring-inset ring-foreground/[0.05]">
                      <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                        {b.when.split(",")[0]}
                      </span>
                      <span className="font-editorial text-lg leading-none tracking-[-0.015em]">
                        {b.when.match(/\d+/)?.[0]}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {b.purpose}
                      </p>
                      <p className="truncate text-[12px] text-muted-foreground">
                        {b.when} · {b.room}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] ring-1 ring-inset ${BOOKING_TONE[b.status]}`}
                    >
                      {b.status}
                    </span>
                  </li>
                ))}
              </ul>
            </Panel>
          </div>

          {/* Team */}
          <div className="lg:col-span-5">
            <Panel>
              <div className="flex items-end justify-between gap-3">
                <div>
                  <Eyebrow>Tim</Eyebrow>
                  <h2 className="mt-3 font-editorial text-2xl tracking-[-0.015em]">
                    Anggota Inti
                  </h2>
                </div>
                <IslandButton variant="ghost" size="sm">
                  Semua
                </IslandButton>
              </div>
              <ul className="mt-6 grid grid-cols-2 gap-3">
                {TEAM.map((m) => {
                  const initials = m.name
                    .split(" ")
                    .map((s) => s[0])
                    .slice(0, 2)
                    .join("");
                  return (
                    <li
                      key={m.name}
                      className="flex items-center gap-3 rounded-2xl bg-foreground/[0.03] p-2.5 ring-1 ring-inset ring-foreground/[0.05]"
                    >
                      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/85 text-[12px] font-medium text-primary-foreground shadow-soft-glow">
                        {initials}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-[12px] font-medium text-foreground">
                          {m.name}
                        </p>
                        <p className="truncate text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                          {m.role}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Panel>
          </div>
        </div>
      </RevealOnView>
    </DashboardLayout>
  );
}
