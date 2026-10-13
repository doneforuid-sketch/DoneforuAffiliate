import { ExtractedProductData } from '../types';

export const LOCAL_STORAGE_API_KEY = 'affiliate_predictor_engine_key';

export function getStoredApiKey(): string {
  try {
    return localStorage.getItem(LOCAL_STORAGE_API_KEY) || '';
  } catch {
    return '';
  }
}

export function setStoredApiKey(key: string): void {
  try {
    if (key.trim()) {
      localStorage.setItem(LOCAL_STORAGE_API_KEY, key.trim());
    } else {
      localStorage.removeItem(LOCAL_STORAGE_API_KEY);
    }
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

export function fileToBase64(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

export async function analyzeProductScreenshot(
  imageInput: File | Blob | string,
  customApiKey?: string
): Promise<ExtractedProductData> {
  let base64Data: string;
  let mimeType = 'image/png';

  if (typeof imageInput === 'string') {
    base64Data = imageInput;
    const match = imageInput.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,/);
    if (match) {
      mimeType = match[1];
    }
  } else {
    mimeType = imageInput.type || 'image/png';
    base64Data = await fileToBase64(imageInput);
  }

  const effectiveApiKey = customApiKey?.trim() || getStoredApiKey();

  // 1. Primary: Server-side AI processing (Default for visitors - zero user configuration needed)
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (effectiveApiKey) {
      headers['x-gemini-key'] = effectiveApiKey;
    }

    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        imageBase64: base64Data,
        mimeType,
      }),
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        return sanitizeExtractedData(json.data);
      }
    } else {
      const errJson = await res.json().catch(() => null);
      if (errJson?.message && !errJson?.message.includes('CONFIG_REQUIRED')) {
        throw new Error(errJson.message);
      }
      if (!effectiveApiKey && errJson?.message) {
        throw new Error(errJson.message);
      }
    }
  } catch (err: unknown) {
    const error = err as Error;
    if (!effectiveApiKey) {
      throw error;
    }
    console.warn('Server endpoint unreachable, trying client fallback...', error);
  }

  // 2. Direct fallback (Only if deployed as purely static site without backend and owner set a key)
  if (!effectiveApiKey) {
    throw new Error(
      'Sistem analitik AI belum terhubung. Silakan coba kembali sesaat lagi.'
    );
  }

  const cleanBase64 = base64Data.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');

  const promptText = `
Anda adalah AI OCR & Analis Pakar Metrik Affiliate TikTok Shop.
Tugas Anda adalah membaca tangkapan layar (screenshot) panel analitik produk affiliate TikTok Shop (seperti Tren Produk TikTok Shop, Pusat Kreator, atau Info Promosi Keranjang Kuning).

PENTING TENTANG NOTASI ANGKA DI INDONESIA / ASIA TENGGARA:
- Karakter koma (,) sering digunakan sebagai penanda desimal (contoh: "19,5K" berarti 19500; "2,6%" berarti 2.6; "21,0K" berarti 21000; "63,1K" berarti 63100).
- Huruf K = x1.000, M = x1.000.000.
- Abaikan angka tren perubahan bertanda panah (misal ▲ 4,5K), gunakan nilai metrik utama!

Kembalikan jawaban HANYA dalam JSON valid:
{
  "productName": "string (nama produk)",
  "totalOrders": number (integer murni, misal 19500),
  "totalCreators": number (integer murni, misal 21000),
  "ctrPercent": number (float murni, misal 2.6),
  "cartAdds": number (integer murni, misal 63100),
  "timePeriod": "string (opsional)",
  "platform": "TikTok Shop",
  "notes": "string (opsional)"
}
`;

  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${effectiveApiKey}`;
    const directRes = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
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
        ],
        generationConfig: {
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!directRes.ok) {
      throw new Error('Sistem analitik sedang sibuk. Silakan coba kembali dalam beberapa detik.');
    }

    const data = await directRes.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) {
      throw new Error('Teks analitik tidak terdeteksi dari screenshot. Harap unggah gambar yang lebih jelas.');
    }

    const parsed = JSON.parse(candidateText);
    return sanitizeExtractedData(parsed);
  } catch (err: unknown) {
    const error = err as Error;
    throw new Error(error.message || 'Gagal memproses screenshot analitik.');
  }
}

function sanitizeExtractedData(raw: Record<string, any>): ExtractedProductData {
  return {
    productName: String(raw.productName || 'Produk Affiliate').trim(),
    totalOrders: Math.max(0, Math.round(Number(raw.totalOrders) || 0)),
    totalCreators: Math.max(0, Math.round(Number(raw.totalCreators) || 0)),
    ctrPercent: Math.max(0, Number(raw.ctrPercent) || 0),
    cartAdds: Math.max(0, Math.round(Number(raw.cartAdds) || 0)),
    timePeriod: raw.timePeriod ? String(raw.timePeriod) : undefined,
    platform: raw.platform ? String(raw.platform) : 'TikTok Shop',
    notes: raw.notes ? String(raw.notes) : undefined,
  };
}
