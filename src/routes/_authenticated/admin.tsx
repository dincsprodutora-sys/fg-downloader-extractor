import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Shield } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Painel Administrativo — FG Downloader" }] }),
  component: Admin,
});

function Admin() {
  const stats = [
    { label: "Usuários totais", value: "—" },
    { label: "Downloads hoje", value: "—" },
    { label: "Assinaturas ativas", value: "—" },
    { label: "Receita do mês", value: "—" },
  ];
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="container mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-center gap-3">
          <Shield className="h-7 w-7 text-primary" />
          <h1 className="text-3xl font-semibold tracking-tight">Painel administrativo</h1>
        </div>
        <p className="mt-2 text-muted-foreground">Métricas e gestão da plataforma.</p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="glass rounded-2xl p-6">
              <div className="text-2xl font-semibold text-gradient">{s.value}</div>
              <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
