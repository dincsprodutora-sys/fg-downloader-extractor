import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Check } from "lucide-react";

export const Route = createFileRoute("/planos")({
  head: () => ({
    meta: [
      { title: "Planos Premium — FG Downloader" },
      { name: "description", content: "Conheça os planos Premium do FG Downloader com downloads ilimitados e processamento em lote." },
      { property: "og:title", content: "Planos Premium — FG Downloader" },
      { property: "og:description", content: "Downloads ilimitados, lote, sem anúncios e suporte prioritário." },
      { property: "og:url", content: "/planos" },
    ],
    links: [{ rel: "canonical", href: "/planos" }],
  }),
  component: Planos,
});

const PLANS = [
  {
    name: "Mensal",
    price: "R$ 19",
    period: "/mês",
    features: ["Downloads ilimitados", "Download em lote (ZIP)", "Fila prioritária", "Sem anúncios", "Suporte Premium"],
    highlight: false,
  },
  {
    name: "Anual",
    price: "R$ 149",
    period: "/ano",
    features: ["Tudo do plano mensal", "2 meses grátis", "Acesso antecipado a novos recursos"],
    highlight: true,
  },
];

function Planos() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="container mx-auto px-4 sm:px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">
            Liberte todo o <span className="text-gradient">potencial Premium</span>
          </h1>
          <p className="mt-3 text-muted-foreground">Downloads ilimitados, processamento em lote e prioridade máxima.</p>
        </div>
        <div className="mx-auto mt-12 grid max-w-4xl gap-4 md:grid-cols-2">
          {PLANS.map((p) => (
            <div key={p.name} className={`rounded-2xl p-7 ${p.highlight ? "bg-gradient-brand shadow-glow" : "glass"}`}>
              <div className={`text-sm font-medium ${p.highlight ? "text-brand-foreground/90" : "text-muted-foreground"}`}>{p.name}</div>
              <div className="mt-2 flex items-baseline gap-1">
                <div className={`text-4xl font-semibold ${p.highlight ? "text-brand-foreground" : ""}`}>{p.price}</div>
                <div className={`text-sm ${p.highlight ? "text-brand-foreground/80" : "text-muted-foreground"}`}>{p.period}</div>
              </div>
              <ul className={`mt-6 space-y-2 text-sm ${p.highlight ? "text-brand-foreground" : "text-foreground/90"}`}>
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2"><Check className="h-4 w-4" /> {f}</li>
                ))}
              </ul>
              <Link
                to="/cadastro"
                className={`mt-8 inline-flex h-11 w-full items-center justify-center rounded-xl text-sm font-semibold ${
                  p.highlight ? "bg-background text-foreground" : "bg-gradient-brand text-brand-foreground"
                } hover:opacity-90`}
              >
                Assinar Premium
              </Link>
            </div>
          ))}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
