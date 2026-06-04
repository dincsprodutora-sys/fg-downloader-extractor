import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, AlertCircle, LogIn } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { HeroDownloader, detectPlatform, isValidUrl } from "@/components/hero-downloader";
import { PlatformPills } from "@/components/platforms";
import { useAuth } from "@/hooks/use-auth";
import { createMediaJob } from "@/lib/media.functions";

const searchSchema = z.object({ url: z.string().optional() });

export const Route = createFileRoute("/downloader")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Downloader — FG Downloader" },
      { name: "description", content: "Cole o link e baixe vídeos ou converta áudio em segundos." },
    ],
    links: [{ rel: "canonical", href: "/downloader" }],
  }),
  component: DownloaderEntry,
});

type Status = "idle" | "validating" | "creating" | "needs-auth" | "failed";

function DownloaderEntry() {
  const { url } = Route.useSearch();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const createJob = useServerFn(createMediaJob);

  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const lastUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!url) {
      setStatus("idle");
      setError(null);
      lastUrlRef.current = null;
      return;
    }
    if (lastUrlRef.current === url) return;
    lastUrlRef.current = url;

    setStatus("validating");
    if (!isValidUrl(url)) {
      setStatus("failed");
      setError("URL inválida. Cole um link http(s) válido.");
      return;
    }
    if (!detectPlatform(url)) {
      setStatus("failed");
      setError("Plataforma não suportada. Use YouTube, Instagram, TikTok, Facebook, X ou Pinterest.");
      return;
    }
    if (!user) {
      setStatus("needs-auth");
      return;
    }

    setStatus("creating");
    setError(null);
    (async () => {
      try {
        const { jobId } = await createJob({ data: { url } });
        toast.success("Processamento iniciado.");
        navigate({ to: "/downloader/$jobId", params: { jobId }, replace: true });
      } catch (e) {
        setStatus("failed");
        setError(e instanceof Error ? e.message : "Falha ao processar o conteúdo.");
      }
    })();
  }, [url, user, authLoading, createJob, navigate]);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-glow" />
        <div className="container relative mx-auto px-4 sm:px-6 py-16">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">
              <span className="text-gradient">Cole, processe e baixe</span>
            </h1>
            <p className="mt-3 text-muted-foreground">
              Suporte a YouTube, Instagram, TikTok, Facebook, X e Pinterest.
            </p>
            <div className="mt-8">
              <HeroDownloader />
            </div>
            <div className="mt-6">
              <PlatformPills />
            </div>
          </div>

          <div className="mx-auto mt-12 max-w-4xl">
            {(status === "validating" || status === "creating") && (
              <div className="glass rounded-2xl p-6 flex items-center gap-3 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                {status === "validating" ? "Validando URL..." : "Enviando para processamento..."}
              </div>
            )}

            {status === "needs-auth" && (
              <div className="glass rounded-2xl p-6 border border-primary/30 flex items-start gap-3">
                <LogIn className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold">Faça login para continuar</div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Crie uma conta gratuita para processar links e salvar seu histórico.
                  </p>
                  <div className="mt-4 flex gap-2">
                    <Link
                      to="/login"
                      search={{ redirect: `/downloader?url=${encodeURIComponent(url ?? "")}` }}
                      className="inline-flex h-9 items-center rounded-lg bg-gradient-brand px-3 text-xs font-semibold text-brand-foreground"
                    >
                      Entrar
                    </Link>
                    <Link
                      to="/cadastro"
                      className="inline-flex h-9 items-center rounded-lg bg-background/40 px-3 text-xs hover:bg-background/60"
                    >
                      Criar conta grátis
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {status === "failed" && (
              <div className="glass rounded-2xl p-6 border border-destructive/40 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold">Não foi possível processar</div>
                  <p className="mt-1 text-sm text-muted-foreground">{error}</p>
                  <button
                    onClick={() => navigate({ to: "/downloader", search: {} })}
                    className="mt-4 inline-flex h-9 items-center rounded-lg bg-background/40 px-3 text-xs hover:bg-background/60"
                  >
                    Tentar com outra URL
                  </button>
                </div>
              </div>
            )}
          </div>

          <p className="mx-auto mt-10 max-w-2xl text-center text-xs text-muted-foreground">
            Aviso de conformidade: respeite os direitos autorais. Você deve possuir autorização
            para baixar e usar o conteúdo. Utilize a plataforma apenas para fins legais.
          </p>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
