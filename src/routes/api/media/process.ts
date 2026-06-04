import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import {
  authClient,
  errorResponse,
  jsonResponse,
  optionsResponse,
} from "@/lib/api/media-auth.server";

const bodySchema = z.object({ url: z.string().url().max(2048) });

export const Route = createFileRoute("/api/media/process")({
  server: {
    handlers: {
      OPTIONS: () => optionsResponse(),
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
        if (!parsed.success) {
          return errorResponse("URL inválida.", 400);
        }
        const { createMediaJob } = await import("@/lib/media.functions");
        try {
          const result = await createMediaJob({ data: { url: parsed.data.url } });
          return jsonResponse(result, 201);
        } catch (e) {
          return errorResponse(
            e instanceof Error ? e.message : "Falha ao processar.",
            500,
          );
        }
      },
    },
  },
});
