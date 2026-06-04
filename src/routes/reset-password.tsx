import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Redefinir senha — FG Downloader" },
      { name: "description", content: "Defina uma nova senha para sua conta." },
    ],
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("A senha precisa ter ao menos 8 caracteres.");
      return;
    }
    if (password !== confirm) {
      toast.error("As senhas não coincidem.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast.error("Falha ao redefinir a senha. Tente novamente.");
      return;
    }
    toast.success("Senha atualizada com sucesso!");
    navigate({ to: "/dashboard" });
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="container mx-auto px-4 sm:px-6 py-20">
        <div className="mx-auto max-w-md">
          <h1 className="text-3xl font-semibold tracking-tight text-center">Redefinir senha</h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">Escolha uma nova senha segura.</p>
          <form onSubmit={handleSubmit} className="glass mt-8 space-y-4 rounded-2xl p-6">
            <div>
              <label className="text-sm font-medium">Nova senha</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 h-11 w-full rounded-xl bg-background/40 px-3 text-sm outline-none focus:bg-background/60" placeholder="Mínimo 8 caracteres" />
            </div>
            <div>
              <label className="text-sm font-medium">Confirmar senha</label>
              <input type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} className="mt-1 h-11 w-full rounded-xl bg-background/40 px-3 text-sm outline-none focus:bg-background/60" placeholder="Repita a nova senha" />
            </div>
            <button type="submit" disabled={loading} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-brand text-sm font-semibold text-brand-foreground hover:opacity-90 disabled:opacity-60">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Salvar nova senha
            </button>
          </form>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
