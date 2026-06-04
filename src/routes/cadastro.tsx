import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/cadastro")({
  head: () => ({
    meta: [
      { title: "Criar conta — FG Downloader" },
      { name: "description", content: "Crie sua conta gratuita no FG Downloader." },
    ],
    links: [{ rel: "canonical", href: "/cadastro" }],
  }),
  component: Cadastro,
});

const schema = z
  .object({
    fullName: z.string().trim().min(2, "Informe seu nome completo.").max(100),
    email: z.string().trim().email("E-mail inválido.").max(255),
    password: z.string().min(8, "A senha precisa ter ao menos 8 caracteres.").max(72),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, { path: ["confirm"], message: "As senhas não coincidem." });

function Cadastro() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  function set<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        fieldErrors[i.path[0] as string] = i.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: window.location.origin + "/dashboard",
        data: { full_name: parsed.data.fullName },
      },
    });
    setLoading(false);
    if (error) {
      const msg = error.message.toLowerCase().includes("registered")
        ? "Este e-mail já está cadastrado."
        : "Falha ao criar a conta. Tente novamente.";
      toast.error(msg);
      return;
    }
    toast.success("Cadastro realizado com sucesso!");
    navigate({ to: "/dashboard" });
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/dashboard",
    });
    if (result.error) {
      setGoogleLoading(false);
      toast.error("Falha ao cadastrar com Google.");
      return;
    }
    if (result.redirected) return;
    toast.success("Conta criada com Google!");
    navigate({ to: "/dashboard" });
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="container mx-auto px-4 sm:px-6 py-20">
        <div className="mx-auto max-w-md">
          <h1 className="text-3xl font-semibold tracking-tight text-center">Criar sua conta</h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">Comece grátis em segundos.</p>
          <form onSubmit={handleSubmit} className="glass mt-8 space-y-4 rounded-2xl p-6">
            <button type="button" onClick={handleGoogle} disabled={googleLoading} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-background/40 text-sm font-medium hover:bg-background/60 disabled:opacity-60">
              {googleLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <GoogleIcon />}
              Continuar com Google
            </button>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="h-px flex-1 bg-border" /> ou e-mail <div className="h-px flex-1 bg-border" />
            </div>
            <Field label="Nome completo" error={errors.fullName}>
              <input value={form.fullName} onChange={(e) => set("fullName", e.target.value)} className="mt-1 h-11 w-full rounded-xl bg-background/40 px-3 text-sm outline-none focus:bg-background/60" placeholder="Seu nome" />
            </Field>
            <Field label="E-mail" error={errors.email}>
              <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className="mt-1 h-11 w-full rounded-xl bg-background/40 px-3 text-sm outline-none focus:bg-background/60" placeholder="voce@email.com" />
            </Field>
            <Field label="Senha" error={errors.password}>
              <input type="password" value={form.password} onChange={(e) => set("password", e.target.value)} className="mt-1 h-11 w-full rounded-xl bg-background/40 px-3 text-sm outline-none focus:bg-background/60" placeholder="Mínimo 8 caracteres" />
            </Field>
            <Field label="Confirmar senha" error={errors.confirm}>
              <input type="password" value={form.confirm} onChange={(e) => set("confirm", e.target.value)} className="mt-1 h-11 w-full rounded-xl bg-background/40 px-3 text-sm outline-none focus:bg-background/60" placeholder="Repita a senha" />
            </Field>
            <button type="submit" disabled={loading} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-brand text-sm font-semibold text-brand-foreground hover:opacity-90 disabled:opacity-60">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Criar conta grátis
            </button>
            <p className="text-center text-xs text-muted-foreground">
              Já tem conta? <Link to="/login" className="text-foreground hover:underline">Entrar</Link>
            </p>
          </form>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
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
