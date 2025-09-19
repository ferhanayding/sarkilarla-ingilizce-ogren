export type LyricLine = {
  t: string | null;
  en: string;
  tr: string;
  ph: string;
};

export type SongType = {
  slug: string;
  title: string;
  artist: string;
  youtube_id: string;
  lines: LyricLine[];
  tags?: string[];
  hasTimestamps?: boolean;
};
export type SongLite = {
  id: string;
  slug: string;
  title: string;
  artist: string;
  youtube_id?: string;
  tags?: string[];
  created_at?: string;
  hasTimestamps?: boolean;
};
