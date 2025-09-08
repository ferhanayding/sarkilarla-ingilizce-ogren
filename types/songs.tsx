
export type LyricLine = {
  t: string | null; // satırın başladığı saniye (örn: 12.5)
  en: string; // İngilizce orijinal
  tr: string; // Türkçe anlamı (elle)
  ph: string; // Türkçe okunuş (fenotip) (elle)
};

export type Song = {
  slug: string; // /song/[slug]
  title: string; // şarkı adı
  artist: string; // sanatçı
  youtubeId: string; // YouTube video ID (örn: "kXYiU_JCYtU")
  lines: LyricLine[]; // zamanlı satırlar
  tags?: string[]; // arama için opsiyonel etiketler
};