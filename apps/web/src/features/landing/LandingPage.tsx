import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function LandingPage() {
  const { t, i18n } = useTranslation();

  const toggleLocale = (): void => {
    void i18n.changeLanguage(i18n.language === "id" ? "en" : "id");
  };

  return (
    <div className="min-h-full">
      <header className="border-b border-border bg-surface">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-md bg-primary" aria-hidden />
            <span className="font-display text-xl text-primary">
              GKI Bogor Baru
            </span>
          </div>
          <nav className="flex items-center gap-6 text-sm">
            <a href="#about" className="hover:text-primary">
              {t("nav.profile")}
            </a>
            <a href="#divisions" className="hover:text-primary">
              {t("nav.divisions")}
            </a>
            <a href="#timelinße" className="hover:text-primary">
              {t("nav.timeline")}
            </a>
            <button
              onClick={toggleLocale}
              className="rounded border border-border px-2 py-1 text-xs uppercase"
            >
              {i18n.language === "id" ? "ID | EN" : "EN | ID"}
            </button>
            <Link
              to="/login"
              className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:opacity-90"
            >
              {t("nav.login")} ▸
            </Link>
          </nav>
        </div>
      </header>

      <section className="bg-background py-24 text-center">
        <div className="container">
          <h1 className="font-display text-5xl text-primary">
            {t("landing.hero.title")}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {t("landing.hero.tagline")}
          </p>
          <a
            href="#about"
            className="mt-8 inline-block rounded-md border border-accent px-6 py-3 font-medium text-primary hover:bg-accent hover:text-accent-foreground"
          >
            {t("landing.hero.cta")} ↓
          </a>
        </div>
      </section>

      <section id="about" className="border-t border-border bg-surface py-20">
        <div className="container">
          <h2 className="font-display text-3xl text-primary">Profil Gereja</h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            (Konten profil gereja akan diisi dari Landing CMS — Sprint 5.)
          </p>
        </div>
      </section>

      <section id="divisions" className="bg-background py-20">
        <div className="container">
          <h2 className="font-display text-3xl text-primary">
            Divisi Pelayanan
          </h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            (Kartu divisi akan diisi dari API — Sprint 5.)
          </p>
        </div>
      </section>

      <section
        id="timeline"
        className="border-t border-border bg-surface py-20"
      >
        <div className="container">
          <h2 className="font-display text-3xl text-primary">
            {t("landing.timeline.title")}
          </h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            (Timeline kegiatan akan diisi dari API — Sprint 5.)
          </p>
        </div>
      </section>

      <footer className="border-t border-border bg-primary py-8 text-primary-foreground">
        <div className="container text-sm">
          <p>Gereja GKI Bogor Baru · Jl. Contoh No. 1</p>
          <p className="mt-2 opacity-70">© 2026 · Church Management System</p>
        </div>
      </footer>
    </div>
  );
}
