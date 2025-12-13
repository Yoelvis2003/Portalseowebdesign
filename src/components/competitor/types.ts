export interface DomainData {
  domain: string;
  traffic: number;
  keywords: number;
  trafficChange: number;
  keywordsChange: number;
  topKeywords: KeywordDetail[];
  color: string;
  lbRank?: number;
  linkingDomains?: number;
  trafficValue?: number;
  urlDistribution?: URLDistribution[];
}

export interface KeywordDetail {
  keyword: string;
  position: number;
  volume: number;
  traffic: number;
  url: string;
  change: number;
  competition: 'low' | 'medium' | 'high';
  competitorDomain?: string;
  trend: number[];
}

export interface URLDistribution {
  url: string;
  name?: string;
  traffic: number;
  percentage: number;
  keywords: number;
  topKeyword: string;
  topKeywordVolume: number;
  trend: number[];
  color: string;
}

export type TimeRange = '3m' | '6m' | '12m';
export type SortField = 'keyword' | 'position' | 'volume' | 'traffic';
export type SortDirection = 'asc' | 'desc';
export type ViewTab = 'keyword' | 'url';

export interface TrafficEvolution {
  month: string;
  visitas: number;
  tendencia: number;
}

export interface CompetitorSuggestion {
  domain: string;
  traffic: number;
  keywords: number;
  color: string;
}
