import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { HeroDownloader } from "@/components/hero-downloader";
import { FloatingPlatforms } from "@/components/floating-platforms";
import { PlatformPills } from "@/components/platforms";
import { Check, Shield, Zap, Layers, Download, Star } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FG Downloader — Baixe vídeos e converta áudio em segundos" },
      { name: "description", content: "Plataforma rápida, segura e moderna para processar conteúdos de diversas redes sociais." },
      { property: "og:title", content: "FG Downloader" },
      { property: "og:description", content: "Baixe vídeos e converta áudio em segundos." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

const FEATURES = [
  { icon: Zap, title: "Velocidade extrema", desc: "Processamento otimizado para entregar seus arquivos em segundos." },
  { icon: Shield, title: "Seguro e privado", desc: "Não armazenamos seus arquivos. Seus dados permanecem protegidos." },
  { icon: Layers, title: "Múltiplos formatos", desc: "Escolha entre vídeo em 360p até 1080p e áudio até 320kbps." },
  { icon: Download, title: "Download em lote", desc: "Usuários Premium processam várias URLs e baixam em ZIP." },
];

const STATS = [
  { value: "12M+", label: "Downloads processados" },
  { value: "450k", label: "Usuários ativos" },
  { value: "6", label: "Redes sociais" },
  { value: "99.9%", label: "Tempo de atividade" },
];

const TESTIMONIALS = [
  { name: "Marina Souza", role: "Criadora de conteúdo", text: "Uso todos os dias para salvar referências. A interface é absurdamente bonita e rápida." },
  { name: "Rafael Lima", role: "Editor de vídeo", text: "Substituiu três ferramentas no meu fluxo. Os formatos 1080p e MP3 320kbps são essenciais." },
  { name: "Ana Beatriz", role: "Social Media", text: "O download em lote do plano Premium economiza horas da minha semana." },
];

const PRICING = [
  {
    name: "Visitante",
    price: "Grátis",
    period: "",
    features: ["Até 5 downloads por dia", "Formatos padrão", "Sem cadastro"],
    cta: "Começar agora",
    to: "/downloader" as const,
    highlight: false,
  },
  {
    name: "Free",
    price: "R$ 0",
    period: "/mês",
    features: ["Até 20 downloads por dia", "Histórico de downloads", "Favoritos"],
    cta: "Criar conta",
    to: "/cadastro" as const,
    highlight: false,
  },
  {
    name: "Premium",
    price: "R$ 19",
    period: "/mês",
    features: ["Downloads ilimitados", "Download em lote (ZIP)", "Fila prioritária", "Sem anúncios", "Suporte Premium"],
    cta: "Assinar Premium",
    to: "/planos" as const,
    highlight: true,
  },
];

const FAQ = [
  { q: "O FG Downloader é gratuito?", a: "Sim. Oferecemos um plano gratuito com limites diários e planos Premium para quem precisa de mais." },
  { q: "Quais plataformas são suportadas?", a: "YouTube, Instagram (Reels, Vídeos e Posts), TikTok, Facebook, X (Twitter) e Pinterest." },
  { q: "Vocês armazenam meus downloads?", a: "Não. Processamos sob demanda e não guardamos o conteúdo dos arquivos." },
  { q: "Posso baixar várias URLs de uma vez?", a: "Sim, usuários Premium têm acesso ao processamento em lote com download em ZIP." },
  { q: "É legal usar a plataforma?", a: "Você é responsável por respeitar direitos autorais e usar apenas para fins legais." },
];

function Home() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-glow" />
        <FloatingPlatforms />
        <div className="container relative mx-auto px-4 sm:px-6 pt-20 pb-24 sm:pt-28 sm:pb-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="animate-fade-in-up inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-slow" />
              Nova versão 2.0 — agora ainda mais rápida
            </div>
            <h1 className="animate-fade-in-up mt-6 text-4xl sm:text-6xl font-semibold tracking-tight text-balance">
              <span className="text-gradient">Baixe vídeos</span> e converta áudio em segundos
            </h1>
            <p className="animate-fade-in-up mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Plataforma rápida, segura e moderna para processar conteúdos de diversas redes sociais.
            </p>

            <div className="animate-fade-in-up mt-10">
              <HeroDownloader />
            </div>

            <div className="animate-fade-in-up mt-10">
              <PlatformPills />
            </div>
          </div>

          {/* STATS */}
          <div className="mx-auto mt-20 grid max-w-4xl grid-cols-2 gap-6 sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="glass rounded-2xl p-5 text-center">
                <div className="text-2xl sm:text-3xl font-semibold text-gradient">{s.value}</div>
                <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="container mx-auto px-4 sm:px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">Tudo o que você precisa em um só lugar</h2>
          <p className="mt-3 text-muted-foreground">Construído com foco em performance, design e experiência do usuário.</p>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="glass rounded-2xl p-6 hover:translate-y-[-2px] transition-transform">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-brand shadow-glow">
                <f.icon className="h-5 w-5 text-brand-foreground" />
              </div>
              <div className="mt-4 font-semibold">{f.title}</div>
              <div className="mt-1 text-sm text-muted-foreground">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="container mx-auto px-4 sm:px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">Amado por criadores</h2>
          <p className="mt-3 text-muted-foreground">Veja o que dizem quem já usa o FG Downloader no dia a dia.</p>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className="glass rounded-2xl p-6">
              <div className="flex gap-0.5 text-primary">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="mt-3 text-sm text-foreground/90">"{t.text}"</blockquote>
              <figcaption className="mt-4 text-sm">
                <div className="font-medium">{t.name}</div>
                <div className="text-muted-foreground text-xs">{t.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="planos" className="container mx-auto px-4 sm:px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">Planos para todos os perfis</h2>
          <p className="mt-3 text-muted-foreground">Comece grátis. Faça upgrade quando precisar de mais.</p>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {PRICING.map((p) => (
            <div
              key={p.name}
              className={`relative rounded-2xl p-6 ${p.highlight ? "bg-gradient-brand shadow-glow" : "glass"}`}
            >
              {p.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-background px-3 py-1 text-[11px] font-medium text-foreground border border-border">
                  Mais popular
                </div>
              )}
              <div className={`text-sm font-medium ${p.highlight ? "text-brand-foreground/90" : "text-muted-foreground"}`}>{p.name}</div>
              <div className="mt-2 flex items-baseline gap-1">
                <div className={`text-4xl font-semibold ${p.highlight ? "text-brand-foreground" : ""}`}>{p.price}</div>
                <div className={`text-sm ${p.highlight ? "text-brand-foreground/80" : "text-muted-foreground"}`}>{p.period}</div>
              </div>
              <ul className={`mt-6 space-y-2 text-sm ${p.highlight ? "text-brand-foreground/95" : "text-foreground/90"}`}>
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Check className="h-4 w-4 opacity-90" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to={p.to}
                className={`mt-7 inline-flex h-10 w-full items-center justify-center rounded-xl text-sm font-semibold transition-opacity ${
                  p.highlight
                    ? "bg-background text-foreground hover:opacity-90"
                    : "bg-gradient-brand text-brand-foreground hover:opacity-90"
                }`}
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="container mx-auto px-4 sm:px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">Perguntas frequentes</h2>
          <p className="mt-3 text-muted-foreground">Tudo o que você precisa saber antes de começar.</p>
        </div>
        <div className="mx-auto mt-10 max-w-3xl space-y-3">
          {FAQ.map((item) => (
            <details key={item.q} className="glass group rounded-2xl p-5 open:bg-card/70">
              <summary className="cursor-pointer list-none flex items-center justify-between gap-4 text-sm font-medium">
                {item.q}
                <span className="text-muted-foreground transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 sm:px-6 py-16">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-brand p-10 sm:p-14 text-center shadow-glow">
          <div className="absolute inset-0 bg-hero-glow opacity-30" />
          <h3 className="relative text-3xl sm:text-4xl font-semibold text-brand-foreground tracking-tight">
            Pronto para baixar mais rápido?
          </h3>
          <p className="relative mt-3 text-brand-foreground/90">
            Crie sua conta gratuita e experimente o FG Downloader em segundos.
          </p>
          <div className="relative mt-7 flex flex-wrap justify-center gap-3">
            <Link to="/cadastro" className="inline-flex h-11 items-center rounded-xl bg-background px-5 text-sm font-semibold text-foreground hover:opacity-90">
              Criar conta grátis
            </Link>
            <Link to="/planos" className="inline-flex h-11 items-center rounded-xl border border-white/30 px-5 text-sm font-semibold text-brand-foreground hover:bg-white/10">
              Ver planos
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
