// ユーティリティ関数

import { INTENT_SCORE_THRESHOLDS } from '@/constants';

/**
 * クラス名を結合するユーティリティ
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * 日付をフォーマットする
 */
export function formatDate(date: Date | string, format: 'short' | 'long' | 'relative' = 'short'): string {
  const d = new Date(date);
  
  if (format === 'relative') {
    return formatRelativeDate(d);
  }
  
  const options: Intl.DateTimeFormatOptions = format === 'long' 
    ? { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }
    : { year: 'numeric', month: 'short', day: 'numeric' };
  
  return d.toLocaleDateString('ja-JP', options);
}

/**
 * 相対日付をフォーマットする
 */
function formatRelativeDate(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffSecs < 60) return 'たった今';
  if (diffMins < 60) return `${diffMins}分前`;
  if (diffHours < 24) return `${diffHours}時間前`;
  if (diffDays < 7) return `${diffDays}日前`;
  
  return formatDate(date, 'short');
}

/**
 * 数値をフォーマットする（カンマ区切り）
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('ja-JP');
}

/**
 * パーセンテージをフォーマットする
 */
export function formatPercent(num: number, decimals: number = 1): string {
  return `${num.toFixed(decimals)}%`;
}

/**
 * インテントスコアのレベルを取得
 */
export function getIntentScoreLevel(score: number): 'low' | 'medium' | 'high' {
  if (score >= INTENT_SCORE_THRESHOLDS.HIGH) return 'high';
  if (score >= INTENT_SCORE_THRESHOLDS.MEDIUM) return 'medium';
  return 'low';
}

/**
 * インテントスコアの色を取得
 */
export function getIntentScoreColor(score: number): string {
  const level = getIntentScoreLevel(score);
  switch (level) {
    case 'high':
      return 'text-green-600 bg-green-100';
    case 'medium':
      return 'text-yellow-600 bg-yellow-100';
    case 'low':
      return 'text-gray-600 bg-gray-100';
  }
}

/**
 * インテントスコアのラベルを取得
 */
export function getIntentScoreLabel(score: number): string {
  const level = getIntentScoreLevel(score);
  switch (level) {
    case 'high':
      return '高';
    case 'medium':
      return '中';
    case 'low':
      return '低';
  }
}

/**
 * 文字列を短縮する
 */
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

/**
 * 配列をシャッフルする
 */
export function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * 遅延を作成する
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * UUIDを生成する
 */
export function generateId(): string {
  return crypto.randomUUID();
}


