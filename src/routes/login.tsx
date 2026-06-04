import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Loader2 } from "lucide-react";

const searchSchema = z.object({ redirect: z.string().optional() });

export const Route = createFileRoute("/login")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Entrar — FG Downloader" },
      { name: "description", content: "Acesse sua conta no FG Downloader." },
    ],
    links: [{ rel: "canonical", href: "/login" }],
  }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const { redirect } = useSearch({ from: "/login" });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const redirectTo = redirect || "/dashboard";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Preencha e-mail e senha.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      const msg = error.message.toLowerCase().includes("invalid")
        ? "E-mail ou senha incorretos."
        : "Falha ao entrar. Tente novamente.";
      toast.error(msg);
      return;
    }
    toast.success("Bem-vindo de volta!");
    navigate({ to: redirectTo });
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + redirectTo,
    });
    if (result.error) {
      setGoogleLoading(false);
      toast.error("Falha ao entrar com Google.");
      return;
    }
    if (result.redirected) return;
    toast.success("Bem-vindo!");
    navigate({ to: redirectTo });
  }

  async function handleForgot() {
    if (!email) {
      toast.error("Informe seu e-mail para recuperar a senha.");
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/reset-password",
    });
    if (error) toast.error("Não foi possível enviar o e-mail. Tente novamente.");
    else toast.success("E-mail de recuperação enviado!");
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="container mx-auto px-4 sm:px-6 py-20">
        <div className="mx-auto max-w-md">
          <h1 className="text-3xl font-semibold tracking-tight text-center">Entrar na sua conta</h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">Bem-vindo de volta ao FG Downloader.</p>
          <form onSubmit={handleSubmit} className="glass mt-8 space-y-4 rounded-2xl p-6">
            <button type="button" onClick={handleGoogle} disabled={googleLoading} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-background/40 text-sm font-medium hover:bg-background/60 disabled:opacity-60">
              {googleLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <GoogleIcon />}
              Continuar com Google
            </button>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="h-px flex-1 bg-border" /> ou e-mail <div className="h-px flex-1 bg-border" />
            </div>
            <div>
              <label className="text-sm font-medium">E-mail</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 h-11 w-full rounded-xl bg-background/40 px-3 text-sm outline-none focus:bg-background/60" placeholder="voce@email.com" />
            </div>
            <div>
              <label className="text-sm font-medium">Senha</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 h-11 w-full rounded-xl bg-background/40 px-3 text-sm outline-none focus:bg-background/60" placeholder="••••••••" />
            </div>
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-muted-foreground">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-3.5 w-3.5" />
                Lembrar de mim
              </label>
              <button type="button" onClick={handleForgot} className="text-muted-foreground hover:text-foreground">
                Esqueci a senha
              </button>
            </div>
            <button type="submit" disabled={loading} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-brand text-sm font-semibold text-brand-foreground hover:opacity-90 disabled:opacity-60">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Entrar
            </button>
            <p className="text-center text-xs text-muted-foreground">
              Não tem conta? <Link to="/cadastro" className="text-foreground hover:underline">Cadastre-se</Link>
            </p>
          </form>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden>
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.6 14.6 2.7 12 2.7 6.9 2.7 2.8 6.8 2.8 12s4.1 9.3 9.2 9.3c5.3 0 8.8-3.7 8.8-9 0-.6-.1-1-.2-1.5H12z" />
    </svg>
  );
}
