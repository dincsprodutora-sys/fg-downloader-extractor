import { createFileRoute } from "@tanstack/react-router";
import {
  authClient,
  errorResponse,
  jsonResponse,
  optionsResponse,
} from "@/lib/api/media-auth.server";

export const Route = createFileRoute("/api/media/history")({
  server: {
    handlers: {
      OPTIONS: () => optionsResponse(),
      GET: async ({ request }) => {
        const ctx = await authClient(request);
        if (ctx instanceof Response) return ctx;
        const { data, error } = await ctx.supabase
          .from("media_jobs")
          .select("id, url, platform, status, title, thumbnail_url, created_at")
          .order("created_at", { ascending: false })
          .limit(100);
        if (error) return errorResponse(error.message, 500);
        return jsonResponse(data ?? []);
      },
    },
  },
});
