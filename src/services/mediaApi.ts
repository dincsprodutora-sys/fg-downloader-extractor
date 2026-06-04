/**
 * Centralized media API service layer.
 *
 * Thin client-side facade over the TanStack server functions in
 * `src/lib/media.functions.ts`. Components should import from here so that
 * the transport (server fn RPC today, plain `/api/media/*` REST tomorrow)
 * remains swappable. All errors surface as Error instances with pt-BR
 * messages from the backend.
 */
import {
  createMediaJob,
  getMediaJobStatus,
  getMediaFormats,
  getMediaMetadata,
  generateDownloadLink,
  listMediaHistory,
  listFavorites,
  addFavorite,
  removeFavorite,
} from "@/lib/media.functions";

async function withRetry<T>(fn: () => Promise<T>, retries = 2): Promise<T> {
  let lastErr: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (e) {
      lastErr = e;
      const msg = e instanceof Error ? e.message : "";
      // Don't retry on validation/auth errors
      if (/inválida|não autorizad|obrigatóri|não suportad/i.test(msg)) throw e;
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, 400 * (attempt + 1)));
      }
    }
  }
  throw lastErr instanceof Error
    ? lastErr
    : new Error("Falha ao contatar o servidor.");
}

export const mediaApi = {
  /** POST /api/media/process — cria um novo job de processamento. */
  process: (url: string) =>
    withRetry(() => createMediaJob({ data: { url } })),

  /** GET /api/media/status/:id — consulta o status atual do job. */
  status: (id: string) =>
    withRetry(() => getMediaJobStatus({ data: { id } })),

  /** GET /api/media/metadata/:id — metadados do conteúdo. */
  metadata: (id: string) =>
    withRetry(() => getMediaMetadata({ data: { id } })),

  /** GET /api/media/formats/:id — formatos disponíveis. */
  formats: (id: string) =>
    withRetry(() => getMediaFormats({ data: { id } })),

  /** GET /api/media/history — histórico do usuário. */
  history: () => withRetry(() => listMediaHistory()),

  /** GET /api/media/favorites — favoritos do usuário. */
  favorites: () => withRetry(() => listFavorites()),

  /** POST /api/media/favorites — adicionar favorito. */
  addFavorite: (payload: { url: string; title?: string; thumbnail_url?: string }) =>
    withRetry(() => addFavorite({ data: payload })),

  /** DELETE favorito por id. */
  removeFavorite: (id: string) =>
    withRetry(() => removeFavorite({ data: { id } })),
};

export type MediaApi = typeof mediaApi;
