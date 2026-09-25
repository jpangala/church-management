import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "./auth.context";
import type { UserRole } from "./auth.types";

const ROLE_HOME: Record<UserRole, string> = {
  ADMIN: "/admin",
  FINANCE: "/finance",
  DIVISION_LEADER: "/division",
};

export default function LoginPage() {
  const { t, i18n } = useTranslation();
  const { user, isLoading, login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && user) {
      navigate(ROLE_HOME[user.role], { replace: true });
    }
  }, [user, isLoading, navigate]);

  const toggleLocale = (): void => {
    void i18n.changeLanguage(i18n.language === "id" ? "en" : "id");
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsPending(true);
    try {
      const authedUser = await login(email, password);
      navigate(ROLE_HOME[authedUser.role], { replace: true });
    } catch {
      setError(t("auth.login.error"));
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="min-h-full bg-background">
      <header className="border-b border-border bg-surface">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-md bg-primary" aria-hidden />
            <span className="font-display text-xl text-primary">
              Gereja XYZ
            </span>
          </div>
          <button
            onClick={toggleLocale}
            className="rounded border border-border px-2 py-1 text-xs uppercase"
          >
            {i18n.language === "id" ? "ID | EN" : "EN | ID"}
          </button>
        </div>
      </header>

      <main className="flex items-center justify-center py-20">
        <div className="w-full max-w-sm rounded-lg border border-border bg-surface p-8 shadow-sm">
          <h1 className="font-display text-2xl text-primary">
            {t("auth.login.title")}
          </h1>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="text-sm text-muted-foreground" htmlFor="email">
                {t("auth.login.email")}
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label
                className="text-sm text-muted-foreground"
                htmlFor="password"
              >
                {t("auth.login.password")}
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
            >
              {isPending ? t("auth.login.submitting") : t("auth.login.submit")}
            </button>

            <p className="text-xs text-muted-foreground">
              {t("auth.login.forgot")}
            </p>
          </form>
        </div>
      </main>

      <div className="container pb-12 text-sm">
        <Link to="/" className="text-muted-foreground hover:text-primary">
          ← Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
