import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato — FG Downloader" },
      { name: "description", content: "Fale com a equipe do FG Downloader." },
      { property: "og:title", content: "Contato — FG Downloader" },
      { property: "og:description", content: "Fale com a equipe do FG Downloader." },
      { property: "og:url", content: "/contato" },
    ],
    links: [{ rel: "canonical", href: "/contato" }],
  }),
  component: Contato,
});

function Contato() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="container mx-auto px-4 sm:px-6 py-20">
        <div className="mx-auto max-w-xl">
          <h1 className="text-4xl font-semibold tracking-tight text-center">Fale conosco</h1>
          <p className="mt-3 text-center text-muted-foreground">Envie sua mensagem e responderemos em breve.</p>
          <form className="glass mt-10 space-y-4 rounded-2xl p-6">
            <div>
              <label className="text-sm font-medium">Nome</label>
              <input className="mt-1 h-11 w-full rounded-xl bg-background/40 px-3 text-sm outline-none" placeholder="Seu nome" />
            </div>
            <div>
              <label className="text-sm font-medium">E-mail</label>
              <input type="email" className="mt-1 h-11 w-full rounded-xl bg-background/40 px-3 text-sm outline-none" placeholder="voce@email.com" />
            </div>
            <div>
              <label className="text-sm font-medium">Mensagem</label>
              <textarea rows={5} className="mt-1 w-full rounded-xl bg-background/40 px-3 py-2 text-sm outline-none" placeholder="Como podemos ajudar?" />
            </div>
            <button type="button" className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-gradient-brand text-sm font-semibold text-brand-foreground hover:opacity-90">
              Enviar mensagem
            </button>
          </form>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
