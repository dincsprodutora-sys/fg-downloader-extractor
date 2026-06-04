import { createFileRoute } from "@tanstack/react-router";
import {
  authClient,
  errorResponse,
  jsonResponse,
  optionsResponse,
} from "@/lib/api/media-auth.server";

export const Route = createFileRoute("/api/media/status/$jobId")({
  server: {
    handlers: {
      OPTIONS: () => optionsResponse(),
      GET: async ({ request, params }) => {
        const ctx = await authClient(request);
        if (ctx instanceof Response) return ctx;
        const { data, error } = await ctx.supabase
          .from("media_jobs")
          .select("*")
          .eq("id", params.jobId)
          .maybeSingle();
        if (error) return errorResponse(error.message, 500);
        if (!data) return errorResponse("Job não encontrado.", 404);
        // Trigger background sync if external job still processing
        if (data.external_job_id && data.status === "processing") {
          try {
            const gateway = await import("@/lib/media-gateway.server");
            if (gateway.isGatewayConfigured()) {
              const remote = await gateway.gatewayGetJob(data.external_job_id);
              const patch: any = { status: remote.status };
              if (remote.status === "completed") {
                patch.title = remote.title ?? null;
                patch.author = remote.author ?? null;
                patch.duration = remote.duration ?? null;
                patch.thumbnail_url = remote.thumbnail_url ?? null;
                if (remote.formats) patch.formats = remote.formats;
              }
              if (remote.status === "failed") {
                patch.error_message = remote.error ?? "Falha ao processar.";
              }
              await ctx.supabase.from("media_jobs").update(patch).eq("id", data.id);
              return jsonResponse({ ...data, ...patch });
            }
          } catch {
            /* ignore — return latest persisted state */
          }
        }
        return jsonResponse(data);
      },
    },
  },
});
