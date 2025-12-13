import type { DomainData, KeywordDetail, URLDistribution, TrafficEvolution } from './types';

// Validación de dominio
export const isValidDomain = (domain: string): boolean => {
  if (!domain || typeof domain !== 'string') return false;
  
  // Sanitizar entrada
  const sanitized = domain.trim().toLowerCase();
  
  // Regex para validar dominio
  const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i;
  
  return domainRegex.test(sanitized);
};

// Sanitizar entrada de texto
export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

// Generar datos de tendencia para sparkline
export const generateTrendData = (base: number, length: number = 30): number[] => {
  const data: number[] = [];
  let value = base;
  
  for (let i = 0; i < length; i++) {
    value = Math.max(0, value + (Math.random() - 0.5) * (base * 0.2));
    data.push(Math.round(value));
  }
  
  return data;
};

// Generar evolución de tráfico
export const generateTrafficEvolution = (domain: string): TrafficEvolution[] => {
  const months = [
    'Sep 23', 'Oct 23', 'Nov 23', 'Dic 23', 
    'Ene 24', 'Feb 24', 'Mar 24', 'Abr 24', 
    'May 24', 'Jun 24', 'Jul 24', 'Ago 24', 
    'Sep 24', 'Oct 24', 'Nov 24', 'Dic 24', 
    'Ene 25', 'Feb 25', 'Mar 25'
  ];
  
  return months.map((month, index) => {
    const baseValue = 5000;
    const growth = index * 1000;
    const variation = Math.sin(index * 0.3) * 2000;
    const visitas = Math.max(1000, Math.floor(baseValue + growth + variation));
    
    return {
      month,
      visitas,
      tendencia: Math.floor(visitas * 0.8 + Math.random() * visitas * 0.4)
    };
  });
};

// Generar distribución de URLs
export const generateURLDistribution = (domain: string): URLDistribution[] => {
  const urls = [
    { path: '/', name: 'Inicio' },
    { path: '/blog/diccionario-seo', name: 'Diccionario SEO' },
    { path: '/blog/que-es-bing', name: 'Qué es Bing' },
    { path: '/blog/answer-the-public', name: 'Answer the Public' },
    { path: '/master-seo', name: 'Master SEO' },
    { path: '/cursos', name: 'Cursos' },
    { path: '/admision', name: 'Admisión' },
    { path: '/biblioteca', name: 'Biblioteca' }
  ];

  const colors = [
    '#3b82f6', '#10b981', '#f59e0b', '#ec4899', 
    '#8b5cf6', '#06b6d4', '#ef4444', '#84cc16'
  ];
  
  let totalTraffic = 0;
  const data = urls.map((url, index) => {
    const traffic = Math.floor(Math.random() * 2000) + 500;
    totalTraffic += traffic;
    return {
      url: url.path,
      name: url.name,
      traffic,
      keywords: Math.floor(Math.random() * 20) + 3,
      topKeyword: `keyword ${index + 1}`,
      topKeywordVolume: Math.floor(Math.random() * 50000) + 5000,
      trend: generateTrendData(traffic, 30),
      color: colors[index],
      percentage: 0
    };
  });

  // Calcular porcentajes
  data.forEach(item => {
    item.percentage = (item.traffic / totalTraffic) * 100;
  });

  return data.sort((a, b) => b.traffic - a.traffic);
};

// Generar keywords para dominio
export const generateKeywordsForDomain = (domain: string): KeywordDetail[] => {
  const keywords = [
    'universidad informática',
    'carreras tecnología',
    'admisión universitaria',
    'cursos programación',
    'ingeniería software',
    'ciencia de datos',
    'inteligencia artificial',
    'investigación tecnológica',
    'posgrado informática',
    'biblioteca digital'
  ];

  const competitions: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];

  return keywords.map((kw) => ({
    keyword: kw,
    position: Math.floor(Math.random() * 30) + 1,
    volume: Math.floor(Math.random() * 300000) + 5000,
    traffic: Math.floor(Math.random() * 8000) + 500,
    url: `/${kw.split(' ')[0]}`,
    change: Math.floor(Math.random() * 11) - 5,
    competition: competitions[Math.floor(Math.random() * competitions.length)],
    trend: generateTrendData(Math.floor(Math.random() * 8000) + 500, 30)
  }));
};

// Formatear números
export const formatNumber = (num: number): string => {
  return num.toLocaleString('es-ES');
};

// Formatear porcentaje
export const formatPercentage = (num: number): string => {
  return `${num >= 0 ? '+' : ''}${num.toFixed(1)}%`;
};

// Debounce para búsquedas
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
