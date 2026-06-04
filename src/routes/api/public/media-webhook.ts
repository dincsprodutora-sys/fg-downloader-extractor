/**
 * Webhook receiver — called by the external media processing service to
 * notify status transitions (processing / completed / failed). Signature is
 * verified against MEDIA_WEBHOOK_SECRET when configured.
 *
 * Expected payload:
 * {
 *   "job_id": "<gateway job id>",         // external id (matches media_jobs.external_job_id)
 *   "status": "processing" | "completed" | "failed",
 *   "title"?: string,
 *   "author"?: string,
 *   "duration"?: string,
 *   "thumbnail_url"?: string,
 *   "formats"?: Format[],
 *   "error"?: string
 * }
 */
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/media-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const rawBody = await request.text();
        const sig =
          request.headers.get("x-webhook-signature") ??
          request.headers.get("x-signature");

        const gateway = await import("@/lib/media-gateway.server");
        const valid = await gateway.verifyWebhookSignature(rawBody, sig);
        if (!valid) {
          return new Response("Invalid signature", { status: 401 });
        }

        let payload: any;
        try {
          payload = JSON.parse(rawBody);
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }

        const externalId = payload?.job_id;
        const status = payload?.status;
        if (!externalId || !["processing", "completed", "failed"].includes(status)) {
          return new Response("Bad payload", { status: 400 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const patch: any = { status };
        if (status === "completed") {
          patch.title = payload.title ?? null;
          patch.author = payload.author ?? null;
          patch.duration = payload.duration ?? null;
          patch.thumbnail_url = payload.thumbnail_url ?? null;
          if (payload.formats) patch.formats = payload.formats;
        }
        if (status === "failed") {
          patch.error_message = payload.error ?? "Falha ao processar.";
        }

        const { error } = await supabaseAdmin
          .from("media_jobs")
          .update(patch)
          .eq("external_job_id", externalId);
        if (error) {
          return new Response(error.message, { status: 500 });
        }
        return new Response("ok", { status: 200 });
      },
    },
  },
});
