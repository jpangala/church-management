import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import TopBar from "../components/TopBar";
import PageHeader from "../components/PageHeader";
import Toolbar from "../components/Toolbar";
import DataTable, { type Column } from "../components/DataTable";
import EmptyState from "../components/EmptyState";
import Pagination from "../components/Pagination";
import BulkActionBar from "../components/BulkActionBar";
import IslandButton from "../components/IslandButton";
import RevealOnView from "../components/RevealOnView";
import {
  Plus,
  Users as UsersIcon,
  Mail,
  Pencil,
  Trash,
  Check,
} from "../components/icons";

type Role = "ADMIN" | "FINANCE" | "DIVISION_LEADER";

interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  division?: string;
  status: "active" | "invited" | "disabled";
  lastSeen: string; // human label
  lastSeenSort: number; // sortable ms-ago
}

// --- Mocked dataset — swap with TanStack Query against /api/users later. ---
const ALL_USERS: User[] = [
  {
    id: "u1",
    name: "Admin Gereja",
    email: "admin@church.local",
    role: "ADMIN",
    status: "active",
    lastSeen: "Baru saja",
    lastSeenSort: 1,
  },
  {
    id: "u2",
    name: "Sarah Lim",
    email: "sarah.lim@church.local",
    role: "FINANCE",
    status: "active",
    lastSeen: "12 menit",
    lastSeenSort: 12,
  },
  {
    id: "u3",
    name: "Yosua Pangabean",
    email: "yosua@church.local",
    role: "DIVISION_LEADER",
    division: "Musik",
    status: "active",
    lastSeen: "1 jam",
    lastSeenSort: 60,
  },
  {
    id: "u4",
    name: "Ratna Sari",
    email: "ratna.s@church.local",
    role: "DIVISION_LEADER",
    division: "Doa",
    status: "active",
    lastSeen: "2 jam",
    lastSeenSort: 120,
  },
  {
    id: "u5",
    name: "Daniel Pratama",
    email: "daniel.p@church.local",
    role: "DIVISION_LEADER",
    division: "Pemuda",
    status: "invited",
    lastSeen: "—",
    lastSeenSort: 999999,
  },
  {
    id: "u6",
    name: "Andre Wijaya",
    email: "andre.w@church.local",
    role: "DIVISION_LEADER",
    division: "Media",
    status: "active",
    lastSeen: "Kemarin",
    lastSeenSort: 1440,
  },
  {
    id: "u7",
    name: "Grace Hartono",
    email: "grace.h@church.local",
    role: "FINANCE",
    status: "disabled",
    lastSeen: "2 minggu",
    lastSeenSort: 20160,
  },
  {
    id: "u8",
    name: "Maria Santos",
    email: "maria.s@church.local",
    role: "DIVISION_LEADER",
    division: "Diakonia",
    status: "active",
    lastSeen: "3 jam",
    lastSeenSort: 180,
  },
  {
    id: "u9",
    name: "Rina Halim",
    email: "rina.h@church.local",
    role: "FINANCE",
    status: "active",
    lastSeen: "4 jam",
    lastSeenSort: 240,
  },
  {
    id: "u10",
    name: "Mira Saputra",
    email: "mira.s@church.local",
    role: "DIVISION_LEADER",
    division: "Sekretariat",
    status: "invited",
    lastSeen: "—",
    lastSeenSort: 999999,
  },
  {
    id: "u11",
    name: "Daniel Tan",
    email: "daniel.t@church.local",
    role: "DIVISION_LEADER",
    division: "Pemuda Remaja",
    status: "active",
    lastSeen: "5 hari",
    lastSeenSort: 7200,
  },
  {
    id: "u12",
    name: "Eva Kusuma",
    email: "eva.k@church.local",
    role: "ADMIN",
    status: "active",
    lastSeen: "30 menit",
    lastSeenSort: 30,
  },
];

const ROLE_LABEL: Record<Role, string> = {
  ADMIN: "Admin",
  FINANCE: "Finance",
  DIVISION_LEADER: "Division Leader",
};

const STATUS_TONE = {
  active: "bg-success/10 text-success ring-success/20",
  invited: "bg-accent/20 text-foreground/80 ring-accent/30",
  disabled: "bg-foreground/[0.05] text-muted-foreground ring-foreground/10",
} as const;

const STATUS_LABEL = {
  active: "Aktif",
  invited: "Diundang",
  disabled: "Nonaktif",
} as const;

const PAGE_SIZE = 8;

export default function UsersListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string | number>>(new Set());

  // Filter + search pipeline
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ALL_USERS.filter((u) => {
      if (roleFilter !== "all" && u.role !== roleFilter) return false;
      if (!q) return true;
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.division ?? "").toLowerCase().includes(q)
      );
    });
  }, [search, roleFilter]);

  const paged = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page],
  );

  const counts = useMemo(
    () => ({
      all: ALL_USERS.length,
      ADMIN: ALL_USERS.filter((u) => u.role === "ADMIN").length,
      FINANCE: ALL_USERS.filter((u) => u.role === "FINANCE").length,
      DIVISION_LEADER: ALL_USERS.filter((u) => u.role === "DIVISION_LEADER")
        .length,
    }),
    [],
  );

  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  // --- Column definitions ---
  const columns: Column<User>[] = [
    {
      key: "name",
      header: "Nama",
      sortable: true,
      accessor: (r) => r.name,
      render: (r) => {
        const initials = r.name
          .split(" ")
          .map((s) => s[0])
          .slice(0, 2)
          .join("");
        return (
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/85 text-[11px] font-medium text-primary-foreground shadow-soft-glow">
              {initials}
            </span>
            <div className="min-w-0">
              <p className="truncate font-medium text-foreground">{r.name}</p>
              <p className="truncate text-[12px] text-muted-foreground">
                {r.email}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      key: "role",
      header: "Peran",
      sortable: true,
      accessor: (r) => r.role,
      render: (r) => (
        <span className="inline-flex items-center rounded-full bg-primary/[0.08] px-2.5 py-1 text-[11px] font-medium text-primary ring-1 ring-inset ring-primary/15">
          {ROLE_LABEL[r.role]}
        </span>
      ),
    },
    {
      key: "division",
      header: "Divisi",
      render: (r) =>
        r.division ? (
          <span className="text-foreground/80">{r.division}</span>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      accessor: (r) => r.status,
      render: (r) => (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] ring-1 ring-inset ${STATUS_TONE[r.status]}`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {STATUS_LABEL[r.status]}
        </span>
      ),
    },
    {
      key: "lastSeen",
      header: "Aktivitas",
      align: "right",
      sortable: true,
      accessor: (r) => r.lastSeenSort,
      render: (r) => (
        <span className="font-mono text-[12px] tabular-nums text-muted-foreground">
          {r.lastSeen}
        </span>
      ),
    },
  ];

  return (
    <DashboardLayout role="ADMIN">
      <TopBar
        eyebrow="Admin"
        title="Users"
        caption={`${today} · ${ALL_USERS.length} total · ${ALL_USERS.filter((u) => u.status === "active").length} aktif`}
        trailing={
          <IslandButton
            variant="primary"
            size="sm"
            trailingIcon={<Plus width={12} height={12} />}
            onClick={() => navigate("/admin/users/new")}
          >
            Tambah Pengguna
          </IslandButton>
        }
      />

      <RevealOnView>
        <PageHeader
          eyebrow="Manajemen Akses"
          title="Pengguna sistem"
          description="Kelola pengguna, peran, dan akses lintas modul. Setiap pengguna terikat ke satu peran utama dan, untuk Division Leader, ke satu divisi yang dipimpin."
          actions={
            <>
              <IslandButton variant="soft" size="sm" trailingIcon={null}>
                Export CSV
              </IslandButton>
              <IslandButton
                variant="primary"
                size="sm"
                trailingIcon={<Plus width={12} height={12} />}
                onClick={() => navigate("/admin/users/new")}
              >
                Tambah Pengguna
              </IslandButton>
            </>
          }
        />
      </RevealOnView>

      <RevealOnView delay={120}>
        <Toolbar
          searchValue={search}
          onSearchChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          searchPlaceholder="Cari nama, email, atau divisi…"
          activeFilter={roleFilter}
          onFilterChange={(k) => {
            setRoleFilter(k);
            setPage(1);
          }}
          filters={[
            { key: "all", label: "Semua", count: counts.all },
            { key: "ADMIN", label: "Admin", count: counts.ADMIN },
            { key: "FINANCE", label: "Finance", count: counts.FINANCE },
            {
              key: "DIVISION_LEADER",
              label: "Division Leader",
              count: counts.DIVISION_LEADER,
            },
          ]}
        />
      </RevealOnView>

      <RevealOnView delay={180}>
        <DataTable
          columns={columns}
          rows={paged}
          selectable
          selectedIds={selected}
          onSelectionChange={setSelected}
          rowAction={(row) => navigate(`/admin/users/${row.id}`)}
          emptyState={
            <EmptyState
              icon={<UsersIcon width={22} height={22} />}
              title="Belum ada pengguna yang cocok"
              description="Coba ubah kata kunci atau bersihkan filter peran untuk melihat semua pengguna."
              action={
                <IslandButton
                  variant="soft"
                  size="sm"
                  trailingIcon={null}
                  onClick={() => {
                    setSearch("");
                    setRoleFilter("all");
                  }}
                >
                  Reset Filter
                </IslandButton>
              }
            />
          }
        />

        {filtered.length > 0 && (
          <Pagination
            page={page}
            pageSize={PAGE_SIZE}
            total={filtered.length}
            onPageChange={setPage}
          />
        )}
      </RevealOnView>

      <BulkActionBar
        count={selected.size}
        onClear={() => setSelected(new Set())}
      >
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full bg-white/[0.08] px-3 py-1.5 text-[12px] font-medium ring-1 ring-inset ring-white/10 transition-colors hover:bg-white/[0.12]"
        >
          <Mail width={12} height={12} /> Kirim Undangan
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full bg-white/[0.08] px-3 py-1.5 text-[12px] font-medium ring-1 ring-inset ring-white/10 transition-colors hover:bg-white/[0.12]"
        >
          <Pencil width={12} height={12} /> Ubah Peran
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full bg-white/[0.08] px-3 py-1.5 text-[12px] font-medium ring-1 ring-inset ring-white/10 transition-colors hover:bg-white/[0.12]"
        >
          <Check width={12} height={12} /> Aktifkan
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full bg-destructive/30 px-3 py-1.5 text-[12px] font-medium ring-1 ring-inset ring-destructive/40 transition-colors hover:bg-destructive/40"
        >
          <Trash width={12} height={12} /> Hapus
        </button>
      </BulkActionBar>
    </DashboardLayout>
  );
}
