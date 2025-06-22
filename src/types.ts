export interface XliffUnit {
  id: string;
  source: string;
  notes: any[];
  target?: string;
  oldTarget?: string;
  translate: boolean;
}

export interface XliffOptions {
  sourceLang?: string;
  targetLang?: string;
  original?: string;
}