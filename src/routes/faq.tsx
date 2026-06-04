import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const FAQ = [
  { q: "O FG Downloader é gratuito?", a: "Sim. Há um plano gratuito com limites diários e planos Premium." },
  { q: "Quais plataformas são suportadas?", a: "YouTube, Instagram, TikTok, Facebook, X (Twitter) e Pinterest." },
  { q: "Vocês armazenam os arquivos?", a: "Não. O processamento é sob demanda e não guardamos o conteúdo." },
  { q: "Posso baixar várias URLs ao mesmo tempo?", a: "Sim, usuários Premium têm acesso ao download em lote." },
  { q: "Como funciona o suporte?", a: "Usuários Premium têm canal de suporte prioritário com resposta em até 24h." },
  { q: "Posso cancelar quando quiser?", a: "Sim, o cancelamento é feito diretamente pelo painel do usuário." },
];

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Perguntas frequentes — FG Downloader" },
      { name: "description", content: "Respostas para as principais dúvidas sobre o FG Downloader." },
      { property: "og:title", content: "FAQ — FG Downloader" },
      { property: "og:description", content: "Tire suas dúvidas sobre o FG Downloader." },
      { property: "og:url", content: "/faq" },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
  }),
  component: Faq,
});

function Faq() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="container mx-auto px-4 sm:px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">Perguntas frequentes</h1>
          <p className="mt-3 text-muted-foreground">Tudo o que você precisa saber em um só lugar.</p>
        </div>
        <div className="mx-auto mt-10 max-w-3xl space-y-3">
          {FAQ.map((item) => (
            <details key={item.q} className="glass group rounded-2xl p-5">
              <summary className="cursor-pointer list-none flex items-center justify-between gap-4 text-sm font-medium">
                {item.q}
                <span className="text-muted-foreground transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">{item.a}</p>
            </details>
          ))}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
