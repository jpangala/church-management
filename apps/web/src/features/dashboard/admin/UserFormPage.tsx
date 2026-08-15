import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import TopBar from "../components/TopBar";
import PageHeader from "../components/PageHeader";
import FormShell from "../components/FormShell";
import FormSection from "../components/FormSection";
import FormActionBar from "../components/FormActionBar";
import Field from "../components/Field";
import { TextInput, Textarea, Select, Switch } from "../components/inputs";
import RadioCardGroup from "../components/RadioCardGroup";
import IslandButton from "../components/IslandButton";
import RevealOnView from "../components/RevealOnView";
import {
  Check,
  Mail,
  Phone,
  User as UserIcon,
  Layers,
  ChartLine,
} from "../components/icons";

interface FormState {
  name: string;
  email: string;
  phone: string;
  locale: "id" | "en";
  role: "ADMIN" | "FINANCE" | "DIVISION_LEADER";
  division: string;
  isActive: boolean;
  sendInvite: boolean;
  notifyOnBooking: boolean;
  notes: string;
}

const INITIAL: FormState = {
  name: "",
  email: "",
  phone: "",
  locale: "id",
  role: "DIVISION_LEADER",
  division: "musik",
  isActive: true,
  sendInvite: true,
  notifyOnBooking: false,
  notes: "",
};

const DIVISION_OPTIONS = [
  { value: "musik", label: "Musik & Worship" },
  { value: "doa", label: "Doa & Konseling" },
  { value: "pemuda", label: "Pemuda & Remaja" },
  { value: "media", label: "Media & Publikasi" },
  { value: "diakonia", label: "Pelayanan Diakonia" },
  { value: "sekretariat", label: "Sekretariat" },
];

export default function UserFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id) && id !== "new";

  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((s) => ({ ...s, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) next.name = "Nama wajib diisi.";
    if (!form.email.trim()) next.email = "Email wajib diisi.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = "Format email tidak valid.";
    if (form.role === "DIVISION_LEADER" && !form.division)
      next.division = "Division Leader harus terikat ke divisi.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setIsSaving(true);
    // TODO: POST /api/users (or PATCH /api/users/:id when isEdit)
    await new Promise((r) => setTimeout(r, 700));
    setSavedAt(new Date().toLocaleTimeString("id-ID"));
    setIsSaving(false);
  }

  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <DashboardLayout role="ADMIN">
      <TopBar
        eyebrow="Admin · Users"
        title={isEdit ? "Edit Pengguna" : "Tambah Pengguna"}
        caption={`${today} · ${isEdit ? "Mengubah profil" : "Buat akun baru"}`}
      />

      <form onSubmit={handleSubmit}>
        <RevealOnView>
          <PageHeader
            backTo={{ to: "/admin/users", label: "Kembali ke daftar pengguna" }}
            eyebrow={isEdit ? "Edit Profil" : "Pengguna Baru"}
            title={isEdit ? "Ubah profil pengguna" : "Undang pengguna baru"}
            description={
              isEdit
                ? "Perbarui informasi profil, peran, dan preferensi notifikasi. Perubahan tersimpan setelah Anda menekan Simpan."
                : "Lengkapi data identitas dan tentukan peran. Pengguna akan menerima email undangan untuk membuat password."
            }
            meta={
              <div className="inline-flex items-center gap-2 rounded-full bg-foreground/[0.04] px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-muted-foreground ring-1 ring-inset ring-foreground/[0.06]">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                Perubahan disimpan otomatis sebagai draft
              </div>
            }
          />
        </RevealOnView>

        <RevealOnView delay={120}>
          <FormShell>
            <FormSection
              eyebrow="Identitas"
              title="Profil dasar"
              description="Informasi yang ditampilkan di seluruh aplikasi — pada audit log, header sesi, dan halaman divisi."
            >
              <Field
                label="Nama lengkap"
                required
                error={errors.name}
                description="Akan ditampilkan pada audit log dan halaman publik."
              >
                {(id) => (
                  <TextInput
                    id={id}
                    placeholder="Yosua Pangabean"
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    invalid={Boolean(errors.name)}
                    required
                  />
                )}
              </Field>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Email"
                  required
                  error={errors.email}
                  description="Digunakan untuk login dan notifikasi sistem."
                >
                  {(id) => (
                    <TextInput
                      id={id}
                      type="email"
                      placeholder="nama@church.local"
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                      leading={<Mail width={14} height={14} />}
                      invalid={Boolean(errors.email)}
                      required
                    />
                  )}
                </Field>
                <Field label="Telepon" description="WhatsApp / SMS untuk reset password.">
                  {(id) => (
                    <TextInput
                      id={id}
                      type="tel"
                      placeholder="+62 812-3456-7890"
                      value={form.phone}
                      onChange={(e) => set("phone", e.target.value)}
                      leading={<Phone width={14} height={14} />}
                    />
                  )}
                </Field>
              </div>

              <Field
                label="Bahasa preferensi"
                description="Bahasa default antarmuka untuk pengguna ini."
              >
                {(id) => (
                  <Select
                    id={id}
                    value={form.locale}
                    onChange={(e) => set("locale", e.target.value as "id" | "en")}
                    options={[
                      { value: "id", label: "Bahasa Indonesia" },
                      { value: "en", label: "English" },
                    ]}
                  />
                )}
              </Field>
            </FormSection>

            <FormSection
              eyebrow="Akses"
              title="Peran & kepemilikan"
              description="Setiap pengguna terikat ke satu peran utama. Division Leader juga perlu memilih divisi yang dipimpin."
              aside={
                <div className="rounded-2xl bg-foreground/[0.03] p-4 ring-1 ring-inset ring-foreground/[0.05]">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                    Catatan
                  </p>
                  <p className="mt-2 text-[12px] leading-relaxed text-foreground/80">
                    Hanya Admin yang dapat mengubah peran. Perubahan peran akan
                    tercatat di audit log.
                  </p>
                </div>
              }
            >
              <Field label="Peran utama" required>
                {() => (
                  <RadioCardGroup
                    name="role"
                    value={form.role}
                    onChange={(v) => set("role", v as FormState["role"])}
                    columns={3}
                    options={[
                      {
                        value: "ADMIN",
                        label: "Admin",
                        description: "Akses penuh sistem dan audit log.",
                        icon: <UserIcon width={16} height={16} />,
                      },
                      {
                        value: "FINANCE",
                        label: "Finance",
                        description: "Kelola kas, anggaran, dan persetujuan.",
                        icon: <ChartLine width={16} height={16} />,
                      },
                      {
                        value: "DIVISION_LEADER",
                        label: "Division Leader",
                        description: "Kelola anggota, proyek, dan booking divisi.",
                        icon: <Layers width={16} height={16} />,
                      },
                    ]}
                  />
                )}
              </Field>

              {form.role === "DIVISION_LEADER" && (
                <Field
                  label="Divisi yang dipimpin"
                  required
                  error={errors.division}
                  description="Hanya satu Division Leader per divisi."
                >
                  {(id) => (
                    <Select
                      id={id}
                      value={form.division}
                      onChange={(e) => set("division", e.target.value)}
                      options={DIVISION_OPTIONS}
                      invalid={Boolean(errors.division)}
                    />
                  )}
                </Field>
              )}

              <Switch
                checked={form.isActive}
                onChange={(v) => set("isActive", v)}
                label="Akun aktif"
                description="Akun nonaktif tidak bisa login namun datanya tetap ada di sistem."
              />
            </FormSection>

            <FormSection
              eyebrow="Notifikasi"
              title="Onboarding & alert"
              description="Atur cara pengguna pertama kali masuk dan jenis pemberitahuan yang diterima."
            >
              <Switch
                checked={form.sendInvite}
                onChange={(v) => set("sendInvite", v)}
                label="Kirim email undangan"
                description="Pengguna akan menerima tautan untuk mengatur password dalam 7 hari."
              />
              <Switch
                checked={form.notifyOnBooking}
                onChange={(v) => set("notifyOnBooking", v)}
                label="Notifikasi booking ruangan"
                description="Email saat ada booking baru yang menunggu approval Anda."
              />
            </FormSection>

            <FormSection
              eyebrow="Catatan"
              title="Catatan internal"
              description="Catatan untuk Admin lain. Tidak terlihat oleh pengguna."
            >
              <Field label="Catatan">
                {(id) => (
                  <Textarea
                    id={id}
                    rows={5}
                    placeholder="Mis. ketua harian, kontak darurat, atau preferensi koordinasi…"
                    value={form.notes}
                    onChange={(e) => set("notes", e.target.value)}
                  />
                )}
              </Field>
            </FormSection>
          </FormShell>
        </RevealOnView>

        <FormActionBar
          status={
            savedAt ? (
              <span className="inline-flex items-center gap-2 text-success">
                <Check width={12} height={12} /> Disimpan pukul {savedAt}
              </span>
            ) : isEdit ? (
              "Perubahan belum disimpan."
            ) : (
              "Lengkapi semua kolom wajib sebelum menyimpan."
            )
          }
        >
          <IslandButton
            type="button"
            variant="ghost"
            size="sm"
            trailingIcon={null}
            onClick={() => navigate("/admin/users")}
          >
            Batal
          </IslandButton>
          <IslandButton
            type="submit"
            variant="primary"
            size="sm"
            disabled={isSaving}
            trailingIcon={<Check width={12} height={12} />}
          >
            {isSaving
              ? "Menyimpan…"
              : isEdit
                ? "Simpan Perubahan"
                : "Buat Pengguna"}
          </IslandButton>
        </FormActionBar>
      </form>
    </DashboardLayout>
  );
}
