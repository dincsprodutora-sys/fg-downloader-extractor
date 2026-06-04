import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const POSTS = [
  { title: "Como organizar referências de vídeo no seu fluxo criativo", category: "Tutoriais", date: "12 mai 2026" },
  { title: "As novidades do FG Downloader 2.0", category: "Atualizações", date: "02 mai 2026" },
  { title: "Tendências de conteúdo digital em 2026", category: "Conteúdo Digital", date: "18 abr 2026" },
  { title: "Boas práticas para criadores em redes sociais", category: "Redes Sociais", date: "05 abr 2026" },
];

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — FG Downloader" },
      { name: "description", content: "Tutoriais, novidades e tendências sobre conteúdo digital." },
      { property: "og:title", content: "Blog — FG Downloader" },
      { property: "og:description", content: "Tutoriais, novidades e tendências sobre conteúdo digital." },
      { property: "og:url", content: "/blog" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: Blog,
});

function Blog() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="container mx-auto px-4 sm:px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">Blog</h1>
          <p className="mt-3 text-muted-foreground">Tecnologia, redes sociais, conteúdo digital, tutoriais e atualizações.</p>
        </div>
        <div className="mx-auto mt-12 grid max-w-5xl gap-4 md:grid-cols-2">
          {POSTS.map((p) => (
            <article key={p.title} className="glass rounded-2xl p-6 hover:translate-y-[-2px] transition-transform">
              <div className="text-xs text-primary">{p.category}</div>
              <h2 className="mt-2 text-lg font-semibold">{p.title}</h2>
              <div className="mt-3 text-xs text-muted-foreground">{p.date}</div>
            </article>
          ))}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
