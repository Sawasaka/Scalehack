// アプリケーション定数

export const APP_NAME = 'Intent Sales Platform';
export const APP_NAME_JP = 'インテントセールス';
export const COMPANY_NAME = 'Scalehack';
export const COMPANY_NAME_JP = 'スケールハック';

// ナビゲーション
export const NAV_ITEMS = [
  { label: 'ダッシュボード', href: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'リード管理', href: '/leads', icon: 'Users' },
  { label: 'インテント分析', href: '/intent', icon: 'TrendingUp' },
  { label: 'キャンペーン', href: '/campaigns', icon: 'Megaphone' },
  { label: 'レポート', href: '/reports', icon: 'BarChart3' },
  { label: '設定', href: '/settings', icon: 'Settings' },
] as const;

// リードステータス
export const LEAD_STATUS_LABELS: Record<string, string> = {
  new: '新規',
  contacted: '接触済み',
  qualified: '見込み確定',
  proposal: '提案中',
  negotiation: '交渉中',
  won: '成約',
  lost: '失注',
};

export const LEAD_STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-100 text-blue-800',
  contacted: 'bg-yellow-100 text-yellow-800',
  qualified: 'bg-purple-100 text-purple-800',
  proposal: 'bg-indigo-100 text-indigo-800',
  negotiation: 'bg-orange-100 text-orange-800',
  won: 'bg-green-100 text-green-800',
  lost: 'bg-gray-100 text-gray-800',
};

// インテントシグナルタイプ
export const INTENT_SIGNAL_LABELS: Record<string, string> = {
  website_visit: 'Webサイト訪問',
  content_download: 'コンテンツダウンロード',
  search_activity: '検索活動',
  competitor_research: '競合調査',
  budget_allocation: '予算検討',
  hiring_signal: '採用シグナル',
  technology_adoption: 'テクノロジー導入',
};

export const INTENT_SIGNAL_ICONS: Record<string, string> = {
  website_visit: 'Globe',
  content_download: 'Download',
  search_activity: 'Search',
  competitor_research: 'Users',
  budget_allocation: 'DollarSign',
  hiring_signal: 'UserPlus',
  technology_adoption: 'Cpu',
};

// インテントスコアの閾値
export const INTENT_SCORE_THRESHOLDS = {
  LOW: 30,
  MEDIUM: 60,
  HIGH: 80,
} as const;

// 業種リスト
export const INDUSTRIES = [
  { value: 'it', label: 'IT・通信' },
  { value: 'manufacturing', label: '製造業' },
  { value: 'finance', label: '金融・保険' },
  { value: 'retail', label: '小売・流通' },
  { value: 'healthcare', label: '医療・ヘルスケア' },
  { value: 'education', label: '教育' },
  { value: 'consulting', label: 'コンサルティング' },
  { value: 'media', label: 'メディア・広告' },
  { value: 'real_estate', label: '不動産' },
  { value: 'other', label: 'その他' },
] as const;

// 従業員数カテゴリ
export const EMPLOYEE_COUNT_RANGES = [
  { value: '1-10', label: '1〜10名' },
  { value: '11-50', label: '11〜50名' },
  { value: '51-100', label: '51〜100名' },
  { value: '101-500', label: '101〜500名' },
  { value: '501-1000', label: '501〜1000名' },
  { value: '1001+', label: '1001名以上' },
] as const;

// Scalehackの強み
export const SCALEHACK_STRENGTHS = [
  {
    title: '4,000社以上の支援実績',
    description: '豊富な実績に基づいた確かなノウハウ',
    icon: 'Building2',
  },
  {
    title: '国内最大級の営業人材DB',
    description: '実績ある営業プロフェッショナルが揃うネットワーク',
    icon: 'Users',
  },
  {
    title: 'データドリブン営業',
    description: 'AIとデータ分析で最適なアプローチを実現',
    icon: 'LineChart',
  },
  {
    title: '営業代行サポート',
    description: '人材提供から実行支援までワンストップ',
    icon: 'Handshake',
  },
] as const;

// フッターリンク
export const FOOTER_LINKS = {
  product: [
    { label: '機能一覧', href: '/features' },
    { label: '料金プラン', href: '/pricing' },
    { label: '導入事例', href: '/case-studies' },
    { label: 'API連携', href: '/integrations' },
  ],
  company: [
    { label: '会社概要', href: '/about' },
    { label: 'ニュース', href: '/news' },
    { label: '採用情報', href: '/careers' },
    { label: 'お問い合わせ', href: '/contact' },
  ],
  support: [
    { label: 'ヘルプセンター', href: '/help' },
    { label: 'よくある質問', href: '/faq' },
    { label: 'プライバシーポリシー', href: '/privacy' },
    { label: '利用規約', href: '/terms' },
  ],
} as const;



