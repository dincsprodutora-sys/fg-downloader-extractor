import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { History, Loader2 } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { listMediaHistory } from "@/lib/media.functions";
import { PLATFORMS } from "@/components/platforms";

export const Route = createFileRoute("/_authenticated/historico")({
  head: () => ({ meta: [{ title: "Histórico — FG Downloader" }] }),
  component: Historico,
});

function Historico() {
  const fetchHistory = useServerFn(listMediaHistory);
  const { data, isLoading } = useQuery({
    queryKey: ["media-history"],
    queryFn: () => fetchHistory(),
  });

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="container mx-auto px-4 sm:px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight">Histórico de downloads</h1>
        <p className="mt-2 text-muted-foreground">Seus downloads recentes aparecem aqui.</p>

        {isLoading ? (
          <div className="glass mt-10 rounded-2xl p-12 text-center">
            <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
          </div>
        ) : !data || data.length === 0 ? (
          <div className="glass mt-10 rounded-2xl p-12 text-center">
            <History className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-4 text-sm text-muted-foreground">Você ainda não realizou nenhum download.</p>
            <Link to="/downloader" className="mt-6 inline-flex h-10 items-center rounded-lg bg-gradient-brand px-4 text-sm font-medium text-brand-foreground">
              Fazer meu primeiro download
            </Link>
          </div>
        ) : (
          <ul className="mt-10 grid gap-3">
            {data.map((j) => {
              const Icon = PLATFORMS.find((p) => p.name === j.platform)?.icon;
              return (
                <li key={j.id} className="glass rounded-2xl p-4 flex items-center gap-4">
                  <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded-lg bg-background/40">
                    {j.thumbnail_url && <img src={j.thumbnail_url} alt="" className="h-full w-full object-cover" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      {Icon && <Icon className="h-3.5 w-3.5 text-primary" />}
                      <span className="text-xs text-muted-foreground">{j.platform ?? "—"}</span>
                      <StatusPill status={j.status} />
                    </div>
                    <div className="mt-1 truncate font-medium">{j.title ?? j.url}</div>
                    <div className="truncate text-xs text-muted-foreground">{j.url}</div>
                  </div>
                  <Link to="/downloader" search={{ url: j.url }} className="inline-flex h-9 items-center rounded-lg bg-background/40 px-3 text-xs hover:bg-background/60">
                    Reprocessar
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
      <SiteFooter />
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    pending: { label: "Pendente", cls: "bg-muted text-muted-foreground" },
    processing: { label: "Processando", cls: "bg-primary/15 text-primary" },
    completed: { label: "Concluído", cls: "bg-emerald-500/15 text-emerald-400" },
    failed: { label: "Falhou", cls: "bg-destructive/15 text-destructive" },
  };
  const v = map[status] ?? map.pending;
  return <span className={`rounded-full px-2 py-0.5 text-[10px] ${v.cls}`}>{v.label}</span>;
}
