import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { listFavorites, removeFavorite } from "@/lib/media.functions";
import { PLATFORMS } from "@/components/platforms";

export const Route = createFileRoute("/_authenticated/favoritos")({
  head: () => ({ meta: [{ title: "Favoritos — FG Downloader" }] }),
  component: Favoritos,
});

function Favoritos() {
  const fetchFavs = useServerFn(listFavorites);
  const removeFn = useServerFn(removeFavorite);
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["favorites"], queryFn: () => fetchFavs() });

  const remove = useMutation({
    mutationFn: (id: string) => removeFn({ data: { id } }),
    onSuccess: () => {
      toast.success("Removido dos favoritos.");
      qc.invalidateQueries({ queryKey: ["favorites"] });
    },
    onError: () => toast.error("Não foi possível remover."),
  });

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="container mx-auto px-4 sm:px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight">Links favoritos</h1>
        <p className="mt-2 text-muted-foreground">Salve links para acessar rapidamente depois.</p>

        {isLoading ? (
          <div className="glass mt-10 rounded-2xl p-12 text-center">
            <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
          </div>
        ) : !data || data.length === 0 ? (
          <div className="glass mt-10 rounded-2xl p-12 text-center">
            <Heart className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-4 text-sm text-muted-foreground">Nenhum favorito por enquanto.</p>
            <Link to="/downloader" className="mt-6 inline-flex h-10 items-center rounded-lg bg-gradient-brand px-4 text-sm font-medium text-brand-foreground">
              Explorar o downloader
            </Link>
          </div>
        ) : (
          <ul className="mt-10 grid gap-3">
            {data.map((f) => {
              const Icon = PLATFORMS.find((p) => p.name === f.platform)?.icon;
              return (
                <li key={f.id} className="glass rounded-2xl p-4 flex items-center gap-4">
                  <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded-lg bg-background/40">
                    {f.thumbnail_url && <img src={f.thumbnail_url} alt="" className="h-full w-full object-cover" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      {Icon && <Icon className="h-3.5 w-3.5 text-primary" />}
                      <span className="text-xs text-muted-foreground">{f.platform ?? "—"}</span>
                    </div>
                    <div className="mt-1 truncate font-medium">{f.title ?? f.url}</div>
                    <div className="truncate text-xs text-muted-foreground">{f.url}</div>
                  </div>
                  <Link to="/downloader" search={{ url: f.url }} className="inline-flex h-9 items-center rounded-lg bg-background/40 px-3 text-xs hover:bg-background/60">
                    Baixar
                  </Link>
                  <button onClick={() => remove.mutate(f.id)} className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-background/40 text-muted-foreground hover:text-destructive hover:bg-background/60">
                    <Trash2 className="h-4 w-4" />
                  </button>
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
