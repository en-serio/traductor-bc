export interface XliffUnit {
  id: string;
  source: string;
  notes: any[];
  target?: string;
  oldTarget?: string;
}

export interface XliffOptions {
  sourceLang?: string;
  targetLang?: string;
  original?: string;
}