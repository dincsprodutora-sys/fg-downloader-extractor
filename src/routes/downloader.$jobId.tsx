import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import {
  Loader2,
  AlertCircle,
  Play,
  Music,
  Download as DownloadIcon,
  Heart,
  CheckCircle2,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PLATFORMS } from "@/components/platforms";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import {
  getMediaJobStatus,
  generateDownloadLink,
  addFavorite,
} from "@/lib/media.functions";

export const Route = createFileRoute("/downloader/$jobId")({
  head: () => ({
    meta: [
      { title: "Processando — FG Downloader" },
      { name: "description", content: "Acompanhe o processamento do seu conteúdo." },
    ],
  }),
  component: JobPage,
});

type JobState = "validating" | "processing" | "completed" | "failed";

const STAGE_MESSAGES: Record<JobState, string> = {
  validating: "Validando URL...",
  processing: "Processando conteúdo...",
  completed: "Pronto para baixar.",
  failed: "Falha ao processar o conteúdo.",
};

const PROCESSING_TICKER = [
  "Conectando ao serviço de processamento...",
  "Obtendo informações da mídia...",
  "Preparando formatos disponíveis...",
  "Quase lá...",
];

type Format = {
  id?: string;
  kind: "video" | "audio";
  label: string;
  quality: string;
};

function JobPage() {
  const { jobId } = Route.useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const fetchJob = useServerFn(getMediaJobStatus);
  const fetchLink = useServerFn(generateDownloadLink);
  const favorite = useServerFn(addFavorite);

  const [job, setJob] = useState<any | null>(null);
  const [state, setState] = useState<JobState>("validating");
  const [error, setError] = useState<string | null>(null);
  const [tickerIdx, setTickerIdx] = useState(0);
  const [downloading, setDownloading] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Redirect unauthenticated users
  useEffect(() => {
    if (!authLoading && !user) {
      navigate({ to: "/login", search: { redirect: `/downloader/${jobId}` }, replace: true });
    }
  }, [authLoading, user, navigate, jobId]);

  // Cycle stage messages while processing
  useEffect(() => {
    if (state !== "processing") return;
    const t = setInterval(() => setTickerIdx((i) => (i + 1) % PROCESSING_TICKER.length), 1500);
    return () => clearInterval(t);
  }, [state]);

  // Poll job status every 2.5s until terminal
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    let attempts = 0;

    async function poll() {
      attempts += 1;
      try {
        const fresh = await fetchJob({ data: { id: jobId } });
        if (cancelled) return;
        setJob(fresh);
        if (fresh.status === "completed") {
          setState("completed");
          return;
        }
        if (fresh.status === "failed") {
          setState("failed");
          setError(fresh.error_message || "Falha ao processar o conteúdo.");
          return;
        }
        setState("processing");
        if (attempts > 60) {
          setState("failed");
          setError("Tempo esgotado. Tente novamente em alguns instantes.");
          return;
        }
        timerRef.current = setTimeout(poll, 2500);
      } catch (e) {
        if (cancelled) return;
        setState("failed");
        setError(e instanceof Error ? e.message : "Não foi possível consultar o status.");
      }
    }
    poll();
    return () => {
      cancelled = true;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [user, jobId, fetchJob]);

  const formats: Format[] = useMemo(
    () => (Array.isArray(job?.formats) ? (job.formats as Format[]) : []),
    [job],
  );
  const videoFormats = formats.filter((f) => f.kind === "video");
  const audioFormats = formats.filter((f) => f.kind === "audio");

  async function handleDownload(format: Format) {
    if (state !== "completed" || !job) return;
    const formatId = format.id ?? format.label;
    setDownloading(formatId);
    try {
      const link = await fetchLink({ data: { id: jobId, formatId } });
      window.open(link.url, "_blank", "noopener,noreferrer");
      toast.success(`Download de ${format.label} iniciado.`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Falha ao gerar link de download.");
    } finally {
      setDownloading(null);
    }
  }

  async function handleFavorite() {
    if (!job) return;
    try {
      await favorite({
        data: {
          url: job.url,
          title: job.title ?? undefined,
          thumbnail_url: job.thumbnail_url ?? undefined,
        },
      });
      toast.success("Adicionado aos favoritos.");
    } catch {
      toast.error("Não foi possível salvar nos favoritos.");
    }
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-glow" />
        <div className="container relative mx-auto px-4 sm:px-6 py-16 max-w-4xl">
          <StatusBanner state={state} message={state === "processing" ? PROCESSING_TICKER[tickerIdx] : STAGE_MESSAGES[state]} error={error} />

          {state === "processing" && <LoadingCard />}

          {state === "completed" && job && (
            <div className="mt-6 space-y-4">
              <MediaCard job={job} onFavorite={handleFavorite} />
              <div className="grid gap-4 md:grid-cols-2">
                <FormatList title="Formatos de vídeo" icon={Play} items={videoFormats} downloading={downloading} onPick={handleDownload} />
                <FormatList title="Formatos de áudio" icon={Music} items={audioFormats} downloading={downloading} onPick={handleDownload} />
              </div>
            </div>
          )}

          {state === "failed" && (
            <div className="mt-6">
              <Link
                to="/downloader"
                search={{}}
                className="inline-flex h-10 items-center rounded-lg bg-gradient-brand px-4 text-sm font-semibold text-brand-foreground"
              >
                Tentar com outra URL
              </Link>
            </div>
          )}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}

function StatusBanner({
  state,
  message,
  error,
}: {
  state: JobState;
  message: string;
  error: string | null;
}) {
  if (state === "failed") {
    return (
      <div className="glass rounded-2xl p-6 border border-destructive/40 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
        <div>
          <div className="font-semibold">Não foi possível processar</div>
          <p className="mt-1 text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }
  if (state === "completed") {
    return (
      <div className="glass rounded-2xl p-6 border border-primary/30 flex items-start gap-3">
        <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <div className="font-semibold">{message}</div>
      </div>
    );
  }
  return (
    <div className="glass rounded-2xl p-6 flex items-center gap-3 text-sm">
      <Loader2 className="h-4 w-4 animate-spin text-primary" />
      <span className="text-muted-foreground">{message}</span>
    </div>
  );
}

function LoadingCard() {
  return (
    <div className="glass rounded-2xl p-6 mt-6">
      <div className="grid gap-4 md:grid-cols-[240px_1fr]">
        <Skeleton className="aspect-video w-full rounded-xl" />
        <div className="space-y-3">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
          <div className="grid grid-cols-3 gap-2 mt-4">
            <Skeleton className="h-9 rounded-lg" />
            <Skeleton className="h-9 rounded-lg" />
            <Skeleton className="h-9 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

function MediaCard({ job, onFavorite }: { job: any; onFavorite: () => void }) {
  const PlatformIcon = PLATFORMS.find((p) => p.name === job.platform)?.icon;
  return (
    <div className="glass rounded-2xl p-6">
      <div className="grid gap-4 md:grid-cols-[240px_1fr]">
        <div className="relative aspect-video overflow-hidden rounded-xl bg-background/40">
          {job.thumbnail_url && (
            <img src={job.thumbnail_url} alt={job.title ?? "Mídia"} className="h-full w-full object-cover" loading="lazy" />
          )}
        </div>
        <div className="flex flex-col">
          <div className="inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/15 px-2.5 py-1 text-[11px] font-medium text-primary">
            {PlatformIcon && <PlatformIcon className="h-3 w-3" />} {job.platform ?? "Mídia"}
          </div>
          <h2 className="mt-2 text-lg font-semibold">{job.title ?? "Conteúdo de mídia"}</h2>
          {job.author && <p className="text-sm text-muted-foreground">{job.author}</p>}
          {job.duration && <p className="mt-1 text-xs text-muted-foreground">Duração: {job.duration}</p>}
          <div className="mt-auto pt-4">
            <button
              onClick={onFavorite}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-background/40 px-3 text-xs hover:bg-background/60"
            >
              <Heart className="h-3.5 w-3.5" /> Salvar nos favoritos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FormatList({
  title,
  icon: Icon,
  items,
  downloading,
  onPick,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  items: Format[];
  downloading: string | null;
  onPick: (item: Format) => void;
}) {
  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center gap-2 text-sm font-semibold mb-4">
        <Icon className="h-4 w-4 text-primary" /> {title}
      </div>
      {items.length === 0 ? (
        <p className="text-xs text-muted-foreground">Nenhum formato disponível.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((v) => {
            const id = v.id ?? v.label;
            const isLoading = downloading === id;
            return (
              <li key={id} className="flex items-center justify-between rounded-xl bg-background/40 px-4 py-3 text-sm">
                <span>{v.label}</span>
                <button
                  type="button"
                  onClick={() => onPick(v)}
                  disabled={isLoading || downloading !== null}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-brand px-3 py-1.5 text-xs font-semibold text-brand-foreground hover:opacity-90 disabled:opacity-60"
                >
                  {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <DownloadIcon className="h-3 w-3" />}
                  Baixar
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
