import { exec } from 'child_process';
import util from 'util';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const execPromise = util.promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class YtDlpService {
  /**
   * Executa o comando yt-dlp e retorna o JSON de saída
   * @param {string} url 
   * @param {string[]} args 
   * @returns {Promise<Object>}
   */
  async _execYtDlp(url, args = []) {
    try {
      // Verifica se o binário local existe (baixado via postinstall no Render)
      // Caso contrário, tenta usar o comando global 'yt-dlp'
const localBinary = path.join(process.cwd(), 'bin', 'yt-dlp');

const binary = fs.existsSync(localBinary)
  ? localBinary
  : 'yt-dlp';

      const command = `${binary} --extractor-args "youtube:player_client=android" ${args.join(' ')} "${url}"`;;
      const { stdout } = await execPromise(command, { maxBuffer: 20 * 1024 * 1024 });
      return JSON.parse(stdout);
    } catch (error) {
      console.error('Erro ao executar yt-dlp:', error);
      throw new Error(`Falha ao processar mídia: ${error.message}`);
    }
  }

  async getMetadata(url) {
    const data = await this._execYtDlp(url, ['-J', '--no-playlist', '--flat-playlist']);
    
    return {
      title: data.title || 'Sem título',
      uploader: data.uploader || data.channel || 'Desconhecido',
      duration: data.duration || 0,
      thumbnail: data.thumbnail || (data.thumbnails && data.thumbnails.length > 0 ? data.thumbnails[data.thumbnails.length - 1].url : null),
      extractor: data.extractor || 'generic'
    };
  }

  async getFormats(url) {
    const data = await this._execYtDlp(url, ['-J', '--no-playlist']);
    
    if (!data.formats) return [];

    // Mapeamos os formatos para o padrão esperado pelo frontend
    return data.formats
      .filter(f => f.url) // Apenas formatos com URL direta
      .map(f => ({
        id: f.format_id,
        kind: f.vcodec !== 'none' ? 'video' : 'audio',
        label: f.format_note || f.resolution || (f.vcodec !== 'none' ? `${f.height}p` : `${f.abr}kbps`),
        quality: f.height ? `${f.height}p` : (f.abr ? `${f.abr}kbps` : 'N/A'),
        ext: f.ext,
        filesize: f.filesize || f.filesize_approx || null
      }))
      .sort((a, b) => {
        // Ordena por tipo (video primeiro) e depois por qualidade (altura ou bitrate)
        if (a.kind !== b.kind) return a.kind === 'video' ? -1 : 1;
        return parseInt(b.quality) - parseInt(a.quality);
      });
  }

  async getDownloadUrl(url, formatId) {
    // Para obter a URL real de um formato específico, podemos usar --get-url
    // Mas o JSON (-J) já contém as URLs diretas na maioria dos casos.
    // Vamos buscar o formato específico no JSON para garantir consistência.
    const data = await this._execYtDlp(url, ['-J', '--no-playlist']);
    
    const format = data.formats.find(f => f.format_id === formatId);
    
    if (!format) {
      throw new Error(`Formato ${formatId} não encontrado`);
    }

    return {
      url: format.url,
      filename: `${data.title || 'download'}.${format.ext}`,
      expires_at: new Date(Date.now() + 3600 * 1000).toISOString() // Estimativa de 1h
    };
  }
}

export default new YtDlpService();
