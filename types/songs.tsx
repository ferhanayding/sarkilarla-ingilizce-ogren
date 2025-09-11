
export type LyricLine = {
  t: string | null; // satırın başladığı saniye (örn: 12.5)
  en: string; // İngilizce orijinal
  tr: string; // Türkçe anlamı (elle)
  ph: string; // Türkçe okunuş (fenotip) (elle)
};

export type SongType = {
  slug: string; // /song/[slug]
  title: string; // şarkı adı
  artist: string; // sanatçı
  youtube_id: string; // YouTube video ID (örn: "kXYiU_JCYtU")
  lines: LyricLine[]; // zamanlı satırlar
  tags?: string[]; // arama için opsiyonel etiketler
};
export type SongLite = {
  id: string; slug: string; title: string; artist: string;
  youtube_id?: string; tags?: string[]; created_at?: string;
};

