import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import {
  authClient,
  errorResponse,
  jsonResponse,
  optionsResponse,
} from "@/lib/api/media-auth.server";

const bodySchema = z.object({
  url: z.string().url().max(2048),
  title: z.string().max(255).optional(),
  thumbnail_url: z.string().url().max(2048).optional(),
});

function detectPlatform(url: string): string | null {
  const u = url.toLowerCase();
  if (u.includes("youtu")) return "YouTube";
  if (u.includes("instagram")) return "Instagram";
  if (u.includes("tiktok")) return "TikTok";
  if (u.includes("facebook") || u.includes("fb.watch")) return "Facebook";
  if (u.includes("twitter") || u.includes("x.com")) return "X (Twitter)";
  if (u.includes("pinterest") || u.includes("pin.it")) return "Pinterest";
  return null;
}

export const Route = createFileRoute("/api/media/favorites")({
  server: {
    handlers: {
      OPTIONS: () => optionsResponse(),
      GET: async ({ request }) => {
        const ctx = await authClient(request);
        if (ctx instanceof Response) return ctx;
        const { data, error } = await ctx.supabase
          .from("favorites")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) return errorResponse(error.message, 500);
        return jsonResponse(data ?? []);
      },
      POST: async ({ request }) => {
        const ctx = await authClient(request);
        if (ctx instanceof Response) return ctx;
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return errorResponse("Corpo da requisição inválido.", 400);
        }
        const parsed = bodySchema.safeParse(body);
        if (!parsed.success) return errorResponse("Dados inválidos.", 400);
        const { error } = await ctx.supabase.from("favorites").insert({
          user_id: ctx.userId,
          url: parsed.data.url,
          platform: detectPlatform(parsed.data.url),
          title: parsed.data.title ?? null,
          thumbnail_url: parsed.data.thumbnail_url ?? null,
        });
        if (error && !error.message.includes("duplicate")) {
          return errorResponse(error.message, 500);
        }
        return jsonResponse({ ok: true }, 201);
      },
    },
  },
});
