import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useAuth } from "@/hooks/use-auth";
import { Download, Heart, History, Crown } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — FG Downloader" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { user } = useAuth();
  const name = (user?.user_metadata?.full_name as string) || user?.email?.split("@")[0] || "Usuário";

  const cards = [
    { to: "/downloader" as const, icon: Download, title: "Baixar agora", desc: "Cole um link e processe em segundos." },
    { to: "/historico" as const, icon: History, title: "Histórico", desc: "Veja seus downloads recentes." },
    { to: "/favoritos" as const, icon: Heart, title: "Favoritos", desc: "Acesse seus links salvos." },
    { to: "/planos" as const, icon: Crown, title: "Planos Premium", desc: "Desbloqueie downloads ilimitados." },
  ];

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="container mx-auto px-4 sm:px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight">Olá, <span className="text-gradient">{name}</span> 👋</h1>
        <p className="mt-2 text-muted-foreground">Bem-vindo ao seu painel.</p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <Link key={c.to} to={c.to} className="glass rounded-2xl p-6 transition-transform hover:scale-[1.02]">
              <c.icon className="h-6 w-6 text-primary" />
              <div className="mt-4 font-semibold">{c.title}</div>
              <div className="mt-1 text-sm text-muted-foreground">{c.desc}</div>
            </Link>
          ))}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
