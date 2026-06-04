import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import {
  authClient,
  errorResponse,
  jsonResponse,
  optionsResponse,
} from "@/lib/api/media-auth.server";

const bodySchema = z.object({ formatId: z.string().min(1).max(128) });

export const Route = createFileRoute("/api/media/download/$jobId")({
  server: {
    handlers: {
      OPTIONS: () => optionsResponse(),
      POST: async ({ request, params }) => {
        const ctx = await authClient(request);
        if (ctx instanceof Response) return ctx;
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return errorResponse("Corpo inválido.", 400);
        }
        const parsed = bodySchema.safeParse(body);
        if (!parsed.success) return errorResponse("formatId obrigatório.", 400);

        const { data: job, error } = await ctx.supabase
          .from("media_jobs")
          .select("id, external_job_id, status")
          .eq("id", params.jobId)
          .maybeSingle();
        if (error) return errorResponse(error.message, 500);
        if (!job) return errorResponse("Job não encontrado.", 404);
        if (job.status !== "completed")
          return errorResponse("O conteúdo ainda não está pronto.", 409);

        const gateway = await import("@/lib/media-gateway.server");
        if (!gateway.isGatewayConfigured() || !job.external_job_id) {
          return errorResponse(
            "Integração de download ainda não está disponível.",
            503,
          );
        }
        try {
          const link = await gateway.gatewayGenerateDownloadLink(
            job.external_job_id,
            parsed.data.formatId,
          );
          await ctx.supabase
            .from("media_jobs")
            .update({
              download_url: link.url,
              download_expires_at: link.expires_at ?? null,
            })
            .eq("id", job.id);
          return jsonResponse(link);
        } catch (e) {
          return errorResponse(
            e instanceof Error ? e.message : "Falha ao gerar link.",
            502,
          );
        }
      },
    },
  },
});
