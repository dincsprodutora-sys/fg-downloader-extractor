import { createFileRoute } from "@tanstack/react-router";
import {
  authClient,
  errorResponse,
  jsonResponse,
  optionsResponse,
} from "@/lib/api/media-auth.server";

export const Route = createFileRoute("/api/media/formats/$jobId")({
  server: {
    handlers: {
      OPTIONS: () => optionsResponse(),
      GET: async ({ request, params }) => {
        const ctx = await authClient(request);
        if (ctx instanceof Response) return ctx;
        const { data, error } = await ctx.supabase
          .from("media_jobs")
          .select("formats")
          .eq("id", params.jobId)
          .maybeSingle();
        if (error) return errorResponse(error.message, 500);
        if (!data) return errorResponse("Job não encontrado.", 404);
        return jsonResponse(data.formats ?? []);
      },
    },
  },
});
