import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '50mb' }));

// Healthcheck & config info
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    hasServerKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// ZERO-STORAGE in-memory screenshot analyzer
app.post('/api/analyze', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/png' } = req.body;
    const clientKey = req.headers['x-gemini-key'] as string | undefined;
    const apiKey = (clientKey && clientKey.trim()) ? clientKey.trim() : process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(400).json({
        error: 'CONFIG_REQUIRED',
        message: 'Koneksi AI Engine belum diaktifkan. Silakan hubungi admin atau pemilik website.',
      });
    }

    if (!imageBase64) {
      return res.status(400).json({
        error: 'IMAGE_REQUIRED',
        message: 'File gambar tangkapan layar wajib diunggah.',
      });
    }

    // Initialize AI Client
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');

    const promptText = `
Anda adalah AI OCR & Analis Pakar Metrik Affiliate TikTok Shop.
Tugas Anda adalah membaca tangkapan layar (screenshot) panel analitik produk affiliate TikTok Shop (seperti Tren Produk TikTok Shop, Pusat Kreator, atau Info Promosi Keranjang Kuning).

PENTING TENTANG NOTASI ANGKA DI INDONESIA / ASIA TENGGARA:
- Karakter koma (,) sering digunakan sebagai penanda desimal (contoh: "19,5K" berarti 19500; "2,6%" berarti 2.6; "21,0K" berarti 21000; "63,1K" berarti 63100).
- Huruf K = x1.000 (ribu), M = x1.000.000 (juta).
- Abaikan angka tren bertanda panah (misal ▲ 4,5K atau ▲ 11,7K), ambil angka metrik utamanya!

Ekstrak informasi berikut secara akurat:
1. productName: Nama produk yang tampak di bagian atas / info produk (contoh: "Wired Earphone").
2. totalOrders: Total pesanan (dalam angka bulat, misal 19,5K -> 19500).
3. totalCreators: Jumlah kreator yang mempromosikan produk ini (angka bulat, misal 21,0K -> 21000).
4. ctrPercent: Click-Through Rate (CTR) dalam persentase angka murni tanpa simbol % (contoh: jika 2,6%, isi 2.6).
5. cartAdds: Jumlah pembeli yang menambahkan produk ke keranjang belanja (angka bulat, misal 63,1K -> 63100).
6. timePeriod: Rentang waktu analitik jika ada (contoh: "7 hari terakhir (3 Okt - 9 Okt 2026)").
7. platform: Deteksi platform ("TikTok Shop").
8. notes: Catatan singkat jika ada angka yang buram atau keterangan tambahan.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data: cleanBase64,
            },
          },
          {
            text: promptText,
          },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            productName: {
              type: Type.STRING,
              description: 'Nama produk yang tertera pada tangkapan layar',
            },
            totalOrders: {
              type: Type.NUMBER,
              description: 'Total pesanan dalam bentuk integer murni (misal 19500)',
            },
            totalCreators: {
              type: Type.NUMBER,
              description: 'Jumlah kreator dalam bentuk integer murni (misal 21000)',
            },
            ctrPercent: {
              type: Type.NUMBER,
              description: 'Nilai persentase CTR dalam format desimal float (misal 2.6)',
            },
            cartAdds: {
              type: Type.NUMBER,
              description: 'Jumlah pembeli yang menambahkan ke keranjang dalam integer murni (misal 63100)',
            },
            timePeriod: {
              type: Type.STRING,
              description: 'Rentang waktu analisis data',
            },
            platform: {
              type: Type.STRING,
              description: 'Platform affiliate yang terdeteksi',
            },
            notes: {
              type: Type.STRING,
              description: 'Catatan tambahan analisis',
            },
          },
          required: ['productName', 'totalOrders', 'totalCreators', 'ctrPercent', 'cartAdds'],
        },
      },
    });

    const text = response.text;
    if (!text) {
      return res.status(500).json({
        error: 'EMPTY_RESPONSE',
        message: 'Sistem analitik tidak dapat membaca teks dari gambar yang diberikan.',
      });
    }

    const parsedData = JSON.parse(text);
    return res.json({
      success: true,
      data: parsedData,
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Error analyzing image:', error);
    let errorMsg = 'Terjadi kendala saat membaca screenshot. Pastikan gambar jelas dan coba kembali.';
    if (error.message?.includes('RESOURCE_EXHAUSTED')) {
      errorMsg = 'Layanan analitik sedang mengalami lonjakan traffic. Silakan coba kembali dalam beberapa saat.';
    }
    return res.status(500).json({
      error: 'ANALYSIS_FAILED',
      message: errorMsg,
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Affiliate Predictor AI server running at http://0.0.0.0:${port}`);
  });
}

startServer();
