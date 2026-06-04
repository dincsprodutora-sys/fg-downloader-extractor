/**
 * Centralized download API service.
 *
 * Wraps `generateDownloadLink` and triggers the browser download. Uses
 * pt-BR error messages and basic retry for transient failures.
 */
import { generateDownloadLink } from "@/lib/media.functions";

export const downloadApi = {
  /** POST /api/media/download/:id — gera link assinado pelo gateway. */
  async getLink(id: string, formatId: string) {
    let lastErr: unknown;
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        return await generateDownloadLink({ data: { id, formatId } });
      } catch (e) {
        lastErr = e;
        const msg = e instanceof Error ? e.message : "";
        if (/não está pronto|não autorizad|inválid/i.test(msg)) throw e;
        await new Promise((r) => setTimeout(r, 400));
      }
    }
    throw lastErr instanceof Error
      ? lastErr
      : new Error("Falha ao gerar link de download.");
  },

  /** Inicia o download no navegador a partir de uma URL assinada. */
  trigger(url: string, filename?: string) {
    const a = document.createElement("a");
    a.href = url;
    if (filename) a.download = filename;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  },

  /** Conveniência: gera link e dispara o download. */
  async download(id: string, formatId: string, filename?: string) {
    const link = await this.getLink(id, formatId);
    this.trigger(link.url, filename);
    return link;
  },
};

export type DownloadApi = typeof downloadApi;
