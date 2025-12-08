'use client';

import { useState, useRef, useEffect } from 'react';

type Status = 'called' | 'not_approached' | 'unavailable';
type NextAction = 'recall' | 'done' | 'call';

interface Company {
  id: string;
  name: string;
  status: Status;
  nextAction: NextAction;
  memo: string;
  prefecture: string;
  industry: string;
  revenue: string;
  service: string;
  employees: string;
  hasDeptPhone: boolean;
  intent: string;
  address: string;
  founded: string;
  capital: string;
  website: string;
  departments: { name: string; phone: string; address: string }[];
  keyPersons: { name: string; role: string; department: string; linkedin: boolean; twitter: boolean; updatedAt: string }[];
}

const mockCompanies: Company[] = [
  { id: '1', name: '株式会社サイバーエージェント', status: 'called', nextAction: 'recall', memo: '来週再度連絡予定', prefecture: '東京都', industry: 'IT・通信', revenue: '5000億円以上', service: '広告・メディア', employees: '1000人以上', hasDeptPhone: true, intent: 'high', address: '東京都渋谷区宇田川町40-1', founded: '1998年', capital: '72億円', website: 'cyberagent.co.jp', departments: [{ name: '新規事業推進部', phone: '03-1234-5678', address: '東京都渋谷区宇田川町40-1' }, { name: '営業本部', phone: '03-9876-5432', address: '東京都渋谷区宇田川町40-1' }, { name: '東日本営業部', phone: '03-1111-2222', address: '東京都渋谷区宇田川町40-1' }], keyPersons: [{ name: '斉藤裕介', role: '部長', department: '経営管理部', linkedin: true, twitter: false, updatedAt: '2024/08/20' }, { name: '浅野祐樹', role: '代表取締役社長', department: '経営', linkedin: true, twitter: true, updatedAt: '2024/08/20' }, { name: '小林遼子', role: '社外取締役', department: '経営', linkedin: true, twitter: false, updatedAt: '2024/07/15' }] },
  { id: '2', name: '株式会社リクルート', status: 'not_approached', nextAction: 'call', memo: '', prefecture: '東京都', industry: 'IT・通信', revenue: '1兆円以上', service: 'HRテック', employees: '1000人以上', hasDeptPhone: true, intent: 'high', address: '東京都千代田区丸の内1-9-2', founded: '1963年', capital: '100億円', website: 'recruit.co.jp', departments: [{ name: '人材事業部', phone: '03-2222-3333', address: '東京都千代田区丸の内1-9-2' }, { name: 'マーケティング部', phone: '03-4444-5555', address: '東京都千代田区丸の内1-9-2' }], keyPersons: [{ name: '田中一郎', role: '執行役員', department: '人材事業部', linkedin: true, twitter: true, updatedAt: '2024/08/15' }, { name: '山本花子', role: '部長', department: 'マーケティング部', linkedin: true, twitter: false, updatedAt: '2024/08/10' }] },
  { id: '3', name: 'freee株式会社', status: 'called', nextAction: 'done', memo: '商談成立', prefecture: '東京都', industry: 'IT・通信', revenue: '100-500億円', service: 'SaaS', employees: '500-1000人', hasDeptPhone: true, intent: 'high', address: '東京都品川区大崎1-2-2', founded: '2012年', capital: '161億円', website: 'freee.co.jp', departments: [{ name: 'セールス部', phone: '03-6630-6000', address: '東京都品川区大崎1-2-2' }], keyPersons: [{ name: '佐々木大輔', role: 'CEO', department: '経営', linkedin: true, twitter: true, updatedAt: '2024/08/18' }] },
  { id: '4', name: '株式会社マネーフォワード', status: 'not_approached', nextAction: 'call', memo: '優先度高', prefecture: '東京都', industry: 'IT・通信', revenue: '100-500億円', service: 'フィンテック', employees: '500-1000人', hasDeptPhone: true, intent: 'high', address: '東京都港区芝浦3-1-21', founded: '2012年', capital: '50億円', website: 'moneyforward.com', departments: [{ name: 'ビジネス開発部', phone: '03-6453-9160', address: '東京都港区芝浦3-1-21' }], keyPersons: [{ name: '辻庸介', role: 'CEO', department: '経営', linkedin: true, twitter: true, updatedAt: '2024/08/12' }] },
  { id: '5', name: 'Sansan株式会社', status: 'unavailable', nextAction: 'recall', memo: '担当者不在', prefecture: '東京都', industry: 'IT・通信', revenue: '100-500億円', service: 'SaaS', employees: '500-1000人', hasDeptPhone: false, intent: 'high', address: '東京都渋谷区桜丘町1-1', founded: '2007年', capital: '64億円', website: 'sansan.com', departments: [{ name: '営業部', phone: '03-6758-0033', address: '東京都渋谷区桜丘町1-1' }], keyPersons: [{ name: '寺田親弘', role: 'CEO', department: '経営', linkedin: true, twitter: false, updatedAt: '2024/08/05' }] },
  { id: '6', name: '株式会社ラクス', status: 'called', nextAction: 'recall', memo: '資料送付済み', prefecture: '東京都', industry: 'IT・通信', revenue: '100-500億円', service: 'SaaS', employees: '500-1000人', hasDeptPhone: true, intent: 'high', address: '東京都渋谷区千駄ヶ谷5-27-5', founded: '2000年', capital: '3億円', website: 'rakus.co.jp', departments: [{ name: 'クラウド事業部', phone: '03-5308-7000', address: '東京都渋谷区千駄ヶ谷5-27-5' }], keyPersons: [{ name: '中村崇則', role: 'CEO', department: '経営', linkedin: false, twitter: false, updatedAt: '2024/07/20' }] },
  { id: '7', name: 'ベルフェイス株式会社', status: 'not_approached', nextAction: 'call', memo: '', prefecture: '東京都', industry: 'IT・通信', revenue: '10-50億円', service: 'セールステック', employees: '100-500人', hasDeptPhone: false, intent: 'high', address: '東京都渋谷区渋谷2-24-12', founded: '2015年', capital: '10億円', website: 'bell-face.com', departments: [{ name: '営業部', phone: '03-6451-1871', address: '東京都渋谷区渋谷2-24-12' }], keyPersons: [{ name: '中島一明', role: 'CEO', department: '経営', linkedin: true, twitter: true, updatedAt: '2024/08/01' }] },
  { id: '8', name: '株式会社プレイド', status: 'called', nextAction: 'done', memo: '契約締結', prefecture: '東京都', industry: 'IT・通信', revenue: '50-100億円', service: 'マーケティング', employees: '100-500人', hasDeptPhone: true, intent: 'high', address: '東京都中央区銀座6-10-1', founded: '2011年', capital: '30億円', website: 'plaid.co.jp', departments: [{ name: 'カスタマーサクセス部', phone: '03-6263-0411', address: '東京都中央区銀座6-10-1' }], keyPersons: [{ name: '倉橋健太', role: 'CEO', department: '経営', linkedin: true, twitter: false, updatedAt: '2024/08/08' }] },
  { id: '9', name: 'HERP株式会社', status: 'not_approached', nextAction: 'call', memo: '新規開拓候補', prefecture: '東京都', industry: 'IT・通信', revenue: '10-50億円', service: 'HRテック', employees: '50-100人', hasDeptPhone: false, intent: 'mid', address: '東京都品川区西五反田7-22-17', founded: '2017年', capital: '5億円', website: 'herp.co.jp', departments: [{ name: 'セールス部', phone: '03-6417-4755', address: '東京都品川区西五反田7-22-17' }], keyPersons: [{ name: '庄田一郎', role: 'CEO', department: '経営', linkedin: true, twitter: true, updatedAt: '2024/07/25' }] },
  { id: '10', name: '株式会社SmartHR', status: 'called', nextAction: 'recall', memo: '検討中とのこと', prefecture: '東京都', industry: 'IT・通信', revenue: '100-500億円', service: 'HRテック', employees: '500-1000人', hasDeptPhone: true, intent: 'mid', address: '東京都港区六本木3-2-1', founded: '2013年', capital: '80億円', website: 'smarthr.jp', departments: [{ name: 'エンタープライズ営業部', phone: '03-6869-2626', address: '東京都港区六本木3-2-1' }, { name: 'SMB営業部', phone: '03-6869-2627', address: '東京都港区六本木3-2-1' }], keyPersons: [{ name: '宮田昇始', role: 'CEO', department: '経営', linkedin: true, twitter: true, updatedAt: '2024/08/19' }, { name: '芹澤雅人', role: 'COO', department: '経営', linkedin: true, twitter: false, updatedAt: '2024/08/10' }] },
];

const memos = ['', '要フォロー', '検討中', '来月再連絡', '資料送付済', ''];
for (let i = 11; i <= 50; i++) {
  mockCompanies.push({
    id: String(i),
    name: `テスト企業${i}株式会社`,
    status: ['called', 'not_approached', 'unavailable'][i % 3] as Status,
    nextAction: ['recall', 'done', 'call'][i % 3] as NextAction,
    memo: memos[i % memos.length],
    prefecture: '東京都',
    industry: 'IT・通信',
    revenue: '10-50億円',
    service: 'SaaS',
    employees: '100-500人',
    hasDeptPhone: i % 2 === 0,
    intent: ['high', 'mid', 'low'][i % 3],
    address: '東京都渋谷区1-1-1',
    founded: '2020年',
    capital: '1億円',
    website: 'example.com',
    departments: [{ name: '営業部', phone: '03-0000-0000', address: '東京都渋谷区1-1-1' }],
    keyPersons: [{ name: '山田太郎', role: '部長', department: '営業部', linkedin: true, twitter: false, updatedAt: '2024/08/01' }],
  });
}

// フィルターオプションデータ
const filterOptions: Record<string, { type: 'select' | 'checkbox' | 'range'; options?: string[]; range?: { min: number; max: number; unit: string } }> = {
  location: {
    type: 'select',
    options: ['北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県', '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県', '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県', '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県', '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県', '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県', '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'],
  },
  employees: {
    type: 'range',
    range: { min: 1, max: 10000, unit: '人' },
  },
  industry: {
    type: 'checkbox',
    options: ['IT・通信', '製造業', '金融', '不動産', '小売・卸売', '建設', '医療・福祉', 'サービス業', '教育', '物流・運輸', 'エネルギー', '広告・メディア'],
  },
  service: {
    type: 'checkbox',
    options: ['SaaS', 'HRテック', 'フィンテック', 'マーケティング', 'セールステック', '広告・メディア', 'EC', 'コンサルティング', 'システム開発', 'AI・機械学習'],
  },
  revenue: {
    type: 'select',
    options: ['1億円未満', '1-10億円', '10-50億円', '50-100億円', '100-500億円', '500-1000億円', '1000-5000億円', '5000億円以上', '1兆円以上'],
  },
  usedService: {
    type: 'checkbox',
    options: ['Salesforce', 'HubSpot', 'Marketo', 'Sansan', 'freee', 'マネーフォワード', 'SmartHR', 'Slack', 'Zoom', 'Google Workspace', 'Microsoft 365', 'AWS', 'Notion'],
  },
  department: {
    type: 'checkbox',
    options: ['営業', '人事', '経理', '総務', 'マーケティング', '経営企画', '情報システム', '開発', 'カスタマーサクセス', '広報', '法務', '購買'],
  },
  deptPhone: {
    type: 'checkbox',
    options: ['営業', '人事', '経理', '総務', 'マーケティング', '経営企画', '情報システム', '開発'],
  },
  signal: {
    type: 'checkbox',
    options: ['High', 'Mid', 'Low'],
  },
};

const initialFilterItems = [
  { id: 'location', label: '所在地' },
  { id: 'employees', label: '従業員数' },
  { id: 'industry', label: '業種' },
  { id: 'service', label: '提供サービス分野' },
  { id: 'revenue', label: '売上' },
  { id: 'usedService', label: '利用サービス' },
  { id: 'department', label: '部署' },
  { id: 'deptPhone', label: '部署番号' },
  { id: 'signal', label: 'シグナル' },
];

export default function Home() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'search' | 'filter'>('search');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [detailTab, setDetailTab] = useState<'info' | 'org' | 'person' | 'script'>('info');
  const [selectedFilters, setSelectedFilters] = useState<string[]>(['industry', 'revenue', 'service']);
  const [expandedFilter, setExpandedFilter] = useState<string | null>(null);
  const [filterSelections, setFilterSelections] = useState<Record<string, string[]>>({});
  const [employeeRange, setEmployeeRange] = useState({ min: 100, max: 1000 });
  
  // シグナルくん
  const [characterPos, setCharacterPos] = useState({ x: 1250, y: 600 });
  const [isDragging, setIsDragging] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isBubbleOpen, setIsBubbleOpen] = useState(true);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'signal', message: string}[]>([
    { role: 'signal', message: 'こんにちは！シグナルくんだよ🚀 何でも相談してね！' }
  ]);
  const dragOffset = useRef({ x: 0, y: 0 });

  // ライブ通知フィード
  const [currentNotification, setCurrentNotification] = useState(0);
  const liveNotifications = [
    { type: 'call_start', name: '田中さん', message: 'CALLを開始しました', icon: '📞', color: 'cyan' },
    { type: 'appointment', name: '佐藤さん', message: 'アポ獲得！', icon: '🎉', color: 'emerald' },
    { type: 'achievement', name: '山田さん', message: 'CALL数30件達成', icon: '🏆', color: 'amber' },
    { type: 'call_start', name: '鈴木さん', message: 'CALLを開始しました', icon: '📞', color: 'cyan' },
    { type: 'appointment', name: '高橋さん', message: 'アポ獲得！', icon: '🎉', color: 'emerald' },
    { type: 'call_start', name: '伊藤さん', message: 'CALLを開始しました', icon: '📞', color: 'cyan' },
    { type: 'achievement', name: '渡辺さん', message: 'CALL数50件達成', icon: '🏆', color: 'amber' },
    { type: 'appointment', name: '中村さん', message: 'アポ獲得！', icon: '🎉', color: 'emerald' },
    { type: 'call_start', name: '小林さん', message: 'CALLを開始しました', icon: '📞', color: 'cyan' },
    { type: 'achievement', name: '加藤さん', message: 'CALL数100件達成', icon: '🔥', color: 'rose' },
  ];

  // 10秒ごとに通知を切り替え
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNotification(prev => (prev + 1) % liveNotifications.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [liveNotifications.length]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragOffset.current = {
      x: e.clientX - characterPos.x,
      y: e.clientY - characterPos.y,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setCharacterPos({
          x: e.clientX - dragOffset.current.x,
          y: e.clientY - dragOffset.current.y,
        });
      }
    };
    const handleMouseUp = () => setIsDragging(false);
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const toggleFilter = (id: string) => {
    setExpandedFilter(prev => prev === id ? null : id);
  };

  const toggleFilterOption = (filterId: string, option: string) => {
    setFilterSelections(prev => {
      const current = prev[filterId] || [];
      const updated = current.includes(option) 
        ? current.filter(o => o !== option)
        : [...current, option];
      return { ...prev, [filterId]: updated };
    });
  };

  const hasActiveFilter = (filterId: string) => {
    return (filterSelections[filterId]?.length || 0) > 0;
  };

  const sendMessage = () => {
    if (!chatMessage.trim()) return;
    setChatHistory(prev => [...prev, { role: 'user', message: chatMessage }]);
    const userMsg = chatMessage;
    setChatMessage('');
    
    // シグナルくんの返答（モック）
    setTimeout(() => {
      const responses = [
        `「${userMsg}」について調べてみるね！📊`,
        'いい質問だね！インテントデータを分析中...🔍',
        'なるほど！そのターゲット企業、シグナル高めだよ！🎯',
        'Scale Signalにお任せ！最適なアプローチ方法を提案するよ💡',
        'その企業、最近Web行動が活発だよ！チャンスかも🚀',
      ];
      setChatHistory(prev => [...prev, { 
        role: 'signal', 
        message: responses[Math.floor(Math.random() * responses.length)]
      }]);
    }, 1000);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    setSelectedIds(selectedIds.length === mockCompanies.length ? [] : mockCompanies.map(c => c.id));
  };

  const getStatusBadge = (status: Status) => {
    switch (status) {
      case 'called':
        return <span className="px-3 py-1.5 text-xs rounded-lg bg-transparent text-emerald-400 font-bold border-2 border-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.3)]">CALL済</span>;
      case 'not_approached':
        return <span className="px-3 py-1.5 text-xs rounded-lg bg-transparent text-slate-400 font-bold border-2 border-slate-500">未アプローチ</span>;
      case 'unavailable':
        return <span className="px-3 py-1.5 text-xs rounded-lg bg-transparent text-rose-400 font-bold border-2 border-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.3)]">不可</span>;
    }
  };

  const getNextActionBadge = (action: NextAction) => {
    switch (action) {
      case 'call':
        return <span className="px-2.5 py-1 text-[10px] rounded-full bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.3)]">CALL</span>;
      case 'recall':
        return <span className="px-2.5 py-1 text-[10px] rounded-full bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.3)]">再CALL</span>;
      case 'done':
        return <span className="px-2.5 py-1 text-[10px] rounded-full bg-slate-800 text-slate-500 font-bold border border-slate-700">完了</span>;
    }
  };

  const getIntentBadge = (intent: string) => {
    switch (intent) {
      case 'high':
        return (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]" />
            <span className="text-sm font-bold text-rose-400">High</span>
          </div>
        );
      case 'mid':
        return (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.6)]" />
            <span className="text-sm font-bold text-amber-400">Mid</span>
          </div>
        );
      case 'low':
        return (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-slate-500 border border-slate-400" />
            <span className="text-sm text-slate-400">Low</span>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-[#030308] text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,#1e1b4b_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,#0f172a_0%,transparent_50%)]" />
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:100px_100px]" />
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-purple-600/20 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyan-500/20 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-rose-500/10 rounded-full blur-[200px]" />
      </div>

      {/* Left Panel */}
      <aside className="relative w-[280px] flex flex-col flex-shrink-0 m-4 mr-0 rounded-2xl border border-cyan-500/30 bg-[#050508] overflow-hidden">
        {/* 装飾ライン - 4辺グラデーション */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-400 to-purple-500" />
        <div className="absolute top-0 right-0 w-[2px] h-full bg-gradient-to-b from-purple-500 to-cyan-400" />
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-purple-500 to-cyan-400" />
        <div className="absolute top-0 left-0 w-[2px] h-full bg-gradient-to-b from-cyan-400 to-purple-500" />
        
        {/* 内側コンテナ - 装飾ラインからの余白確保 */}
        <div className="flex flex-col flex-1 overflow-hidden ml-2 mr-2 mt-2 mb-2">
        
        {/* ① LOGO SECTION */}
        <div className="px-4 pt-4 pb-4">
          <p className="text-[10px] text-cyan-400/50 tracking-[0.3em] mb-3 font-mono">▸ POWERED BY SCALEHACK</p>
          <h1 className="text-[1.8rem] font-black italic tracking-tight leading-none mb-3">
            <span className="bg-gradient-to-r from-cyan-200 via-cyan-400 to-cyan-200 bg-clip-text text-transparent">Scale Signal</span>
          </h1>
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-white/40 tracking-[0.15em]">&nbsp;&nbsp;SCALEHACK</span>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              <span className="text-[11px] text-emerald-400">稼働中</span>
            </div>
          </div>
        </div>

        {/* ② SECTION TITLE */}
        <div className="px-4 pt-2 pb-3">
          <p className="text-[10px] text-cyan-400/50 tracking-[0.3em] mb-2 font-mono">▸ TARGET PARAMETERS</p>
          <h2 className="text-lg font-bold text-white">絞り込み</h2>
          <div className="h-px bg-gradient-to-r from-cyan-500/40 to-transparent mt-2" />
        </div>

        {/* ③ FILTER LIST */}
        <div className="flex-1 overflow-y-auto px-3 pb-3">
          {initialFilterItems.map((item) => {
            const isExpanded = expandedFilter === item.id;
            const hasFilter = hasActiveFilter(item.id);
            const option = filterOptions[item.id];
            const selections = filterSelections[item.id] || [];
            
            return (
              <div key={item.id} className="mb-2">
                {/* フィルター項目ヘッダー */}
                <div 
                  onClick={() => toggleFilter(item.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all border ${
                    isExpanded
                      ? 'bg-cyan-500/15 border-cyan-400/60' 
                      : hasFilter
                        ? 'bg-cyan-500/10 border-cyan-400/40'
                        : 'bg-[#0a0a12] border-cyan-500/20 hover:border-cyan-500/40'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    hasFilter 
                      ? 'border-cyan-400 bg-cyan-400' 
                      : 'border-white/30'
                  }`}>
                    {hasFilter && (
                      <svg className="w-2.5 h-2.5 text-black" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className={`flex-1 text-sm ${hasFilter || isExpanded ? 'text-white font-medium' : 'text-white/60'}`}>{item.label}</span>
                  <svg className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180 text-cyan-400' : 'text-white/25'}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </div>
                
                {/* 展開されたオプション - ゴリゴリサイバーパンク */}
                {isExpanded && option && (
                  <div className="relative mt-2 p-4 rounded-xl bg-[#05050a] border-2 border-cyan-400/60 shadow-[0_0_30px_rgba(6,182,212,0.3),inset_0_0_20px_rgba(6,182,212,0.05)]">
                    {/* コーナーアクセント */}
                    <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-cyan-400 rounded-tl-lg" />
                    <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-purple-500 rounded-tr-lg" />
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-purple-500 rounded-bl-lg" />
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-cyan-400 rounded-br-lg" />
                    
                    {/* セレクト型（都道府県、売上） */}
                    {option.type === 'select' && (
                      <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                        {option.options?.map((opt, idx) => (
                          <div
                            key={opt}
                            onClick={(e) => { e.stopPropagation(); toggleFilterOption(item.id, opt); }}
                            className={`group relative flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition-all duration-300 overflow-hidden ${
                              selections.includes(opt)
                                ? 'bg-gradient-to-r from-cyan-500/30 to-purple-500/20 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                                : 'hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-transparent'
                            }`}
                            style={{ animationDelay: `${idx * 30}ms` }}
                          >
                            {/* 左側のネオンバー */}
                            <div className={`absolute left-0 top-0 w-1 h-full transition-all duration-300 ${
                              selections.includes(opt) 
                                ? 'bg-gradient-to-b from-cyan-400 to-purple-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]' 
                                : 'bg-transparent group-hover:bg-cyan-500/50'
                            }`} />
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-300 ${
                              selections.includes(opt) 
                                ? 'bg-cyan-400 border-cyan-300 shadow-[0_0_15px_rgba(6,182,212,1),0_0_30px_rgba(6,182,212,0.5)]' 
                                : 'border-cyan-500/50 group-hover:border-cyan-400 group-hover:shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                            }`}>
                              {selections.includes(opt) && (
                                <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                            <span className={`text-sm font-medium transition-all duration-300 ${
                              selections.includes(opt) 
                                ? 'text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]' 
                                : 'text-white/70 group-hover:text-cyan-400'
                            }`}>{opt}</span>
                            {selections.includes(opt) && (
                              <span className="ml-auto text-[10px] text-cyan-400 font-mono animate-pulse">▶ ACTIVE</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* チェックボックス型（業種、サービスなど） */}
                    {option.type === 'checkbox' && (
                      <div className="grid grid-cols-2 gap-2">
                        {option.options?.map((opt, idx) => (
                          <div
                            key={opt}
                            onClick={(e) => { e.stopPropagation(); toggleFilterOption(item.id, opt); }}
                            className={`group relative flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-300 overflow-hidden ${
                              selections.includes(opt)
                                ? 'bg-gradient-to-r from-cyan-500/30 to-purple-500/20 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                                : 'hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-transparent'
                            }`}
                            style={{ animationDelay: `${idx * 30}ms` }}
                          >
                            {/* 左側のネオンバー */}
                            <div className={`absolute left-0 top-0 w-0.5 h-full transition-all duration-300 ${
                              selections.includes(opt) 
                                ? 'bg-gradient-to-b from-cyan-400 to-purple-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]' 
                                : 'bg-transparent group-hover:bg-cyan-500/50'
                            }`} />
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                              selections.includes(opt) 
                                ? 'bg-cyan-400 border-cyan-300 shadow-[0_0_15px_rgba(6,182,212,1),0_0_30px_rgba(6,182,212,0.5)]' 
                                : 'border-cyan-500/50 group-hover:border-cyan-400 group-hover:shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                            }`}>
                              {selections.includes(opt) && (
                                <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                            <span className={`text-xs font-medium truncate transition-all duration-300 ${
                              selections.includes(opt) 
                                ? 'text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]' 
                                : 'text-white/70 group-hover:text-cyan-400'
                            }`}>{opt}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* レンジ型（従業員数） - ゴリゴリサイバーパンク */}
                    {option.type === 'range' && (
                      <div className="space-y-5">
                        <div className="relative text-center p-4 rounded-xl bg-gradient-to-r from-cyan-500/20 via-purple-500/10 to-cyan-500/20 border border-cyan-400/40 shadow-[inset_0_0_20px_rgba(6,182,212,0.1)]">
                          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(6,182,212,0.1),transparent)] animate-pulse" />
                          <div className="relative flex items-center justify-center gap-3">
                            <span className="text-3xl font-black bg-gradient-to-r from-cyan-300 via-cyan-400 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(6,182,212,0.8)]">{employeeRange.min.toLocaleString()}</span>
                            <span className="text-2xl text-purple-400 animate-pulse">⟷</span>
                            <span className="text-3xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(168,85,247,0.8)]">{employeeRange.max.toLocaleString()}</span>
                          </div>
                          <span className="text-xs text-cyan-400/80 font-mono tracking-wider mt-1 block">[ EMPLOYEE RANGE ]</span>
                        </div>
                        <div className="relative h-4 bg-[#0a0a14] rounded-full border-2 border-cyan-500/50 overflow-hidden shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
                          <div 
                            className="absolute h-full bg-gradient-to-r from-cyan-400 via-cyan-500 to-purple-500 shadow-[0_0_20px_rgba(6,182,212,0.8)]"
                            style={{ 
                              left: `${(employeeRange.min / (option.range?.max || 10000)) * 100}%`,
                              right: `${100 - (employeeRange.max / (option.range?.max || 10000)) * 100}%`
                            }}
                          >
                            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)] animate-pulse" />
                          </div>
                          <input
                            type="range"
                            min={option.range?.min || 1}
                            max={option.range?.max || 10000}
                            value={employeeRange.min}
                            onChange={(e) => setEmployeeRange(prev => ({ ...prev, min: Math.min(Number(e.target.value), prev.max - 100) }))}
                            onClick={(e) => e.stopPropagation()}
                            className="absolute w-full h-full opacity-0 cursor-pointer"
                          />
                          <input
                            type="range"
                            min={option.range?.min || 1}
                            max={option.range?.max || 10000}
                            value={employeeRange.max}
                            onChange={(e) => setEmployeeRange(prev => ({ ...prev, max: Math.max(Number(e.target.value), prev.min + 100) }))}
                            onClick={(e) => e.stopPropagation()}
                            className="absolute w-full h-full opacity-0 cursor-pointer"
                          />
                        </div>
                        <div className="flex justify-between text-[10px] text-cyan-400 font-mono font-bold">
                          <span className="px-2 py-1 bg-cyan-500/20 rounded border border-cyan-500/30">MIN: {option.range?.min?.toLocaleString()}</span>
                          <span className="px-2 py-1 bg-purple-500/20 rounded border border-purple-500/30">MAX: {option.range?.max?.toLocaleString()}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ④ COUNT DISPLAY */}
        <div className="px-4 pt-2 pb-4">
          <p className="text-[10px] text-cyan-400/50 tracking-[0.2em] mb-3">COUNT DISPLAY</p>
          <div className="text-center">
            <span className="text-6xl font-black bg-gradient-to-b from-cyan-200 via-cyan-400 to-cyan-500 bg-clip-text text-transparent">1,598</span>
            <span className="text-xl text-white/30 ml-1">件</span>
          </div>
        </div>

        {/* ⑤ ACTION BUTTONS */}
        <div className="px-4 pb-4">
          <p className="text-[10px] text-cyan-400/50 tracking-[0.2em] mb-3">ACTION BUTTONS</p>
          <button className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-cyan-500 text-sm font-bold text-black shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center justify-center gap-2 mb-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <span>検索する</span>
          </button>
          <button 
            onClick={() => {
              setFilterSelections({});
              setEmployeeRange({ min: 100, max: 1000 });
              setExpandedFilter(null);
            }}
            className="w-full py-3 rounded-2xl border border-cyan-500/30 text-sm text-white/50 hover:text-cyan-400 hover:border-cyan-400 transition-all"
          >
            リセット
          </button>
        </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col overflow-hidden relative transition-all p-3 ${selectedCompany ? 'mr-[850px]' : ''}`}>
        {/* Header Bar - ライブ通知フィード */}
        <div className="mb-4 px-6 py-4 rounded-xl border-2 border-cyan-500/50 backdrop-blur-xl bg-black/40 shadow-[0_0_20px_rgba(6,182,212,0.1)] overflow-hidden">
          {/* ライブインジケーター */}
          <div className="flex items-center gap-4">
            {/* LIVE バッジ */}
            <div className="flex items-center gap-2 px-4 py-2 bg-rose-500/20 border border-rose-500/50 rounded-xl">
              <div className="w-3 h-3 rounded-full bg-rose-500 animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.8)]" />
              <span className="text-rose-400 font-black text-sm tracking-wider">LIVE</span>
            </div>
            
            {/* 通知コンテンツ */}
            <div className="flex-1 relative h-12 overflow-hidden">
              {liveNotifications.map((notification, idx) => (
                <div 
                  key={idx}
                  className={`absolute inset-0 flex items-center gap-4 transition-all duration-500 ${
                    idx === currentNotification 
                      ? 'opacity-100 translate-y-0' 
                      : idx < currentNotification || (currentNotification === 0 && idx === liveNotifications.length - 1)
                        ? 'opacity-0 -translate-y-full'
                        : 'opacity-0 translate-y-full'
                  }`}
                >
                  {/* アイコン */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${
                    notification.color === 'cyan' ? 'bg-cyan-500/20 border border-cyan-500/50' :
                    notification.color === 'emerald' ? 'bg-emerald-500/20 border border-emerald-500/50' :
                    notification.color === 'amber' ? 'bg-amber-500/20 border border-amber-500/50' :
                    'bg-rose-500/20 border border-rose-500/50'
                  }`}>
                    {notification.icon}
                  </div>
                  
                  {/* テキスト */}
                  <div className="flex items-center gap-3">
                    <span className={`text-xl font-black ${
                      notification.color === 'cyan' ? 'text-cyan-400' :
                      notification.color === 'emerald' ? 'text-emerald-400' :
                      notification.color === 'amber' ? 'text-amber-400' :
                      'text-rose-400'
                    }`}>
                      {notification.name}
                    </span>
                    <span className="text-lg text-white/90 font-medium">
                      {notification.message}
                    </span>
                  </div>
                  
                  {/* 時刻 */}
                  <div className="ml-auto flex items-center gap-2 text-white/40 text-sm">
                    <span>たった今</span>
                    <div className={`w-2 h-2 rounded-full animate-ping ${
                      notification.color === 'cyan' ? 'bg-cyan-400' :
                      notification.color === 'emerald' ? 'bg-emerald-400' :
                      notification.color === 'amber' ? 'bg-amber-400' :
                      'bg-rose-400'
                    }`} />
                  </div>
                </div>
              ))}
            </div>
            
            {/* ドットインジケーター */}
            <div className="flex items-center gap-1.5">
              {liveNotifications.slice(0, 5).map((_, idx) => (
                <div 
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    idx === currentNotification % 5 
                      ? 'bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]' 
                      : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Table - シアン枠線 */}
        <div className="flex-1 overflow-auto rounded-xl border-2 border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
          <table className="w-full">
            <thead className="sticky top-0 bg-[#0a0a15] border-b-2 border-cyan-500/30">
              <tr>
                <th className="px-4 py-4 text-left w-10 border-r border-cyan-500/20">
                  <div className="w-5 h-5 rounded border-2 border-cyan-500/40 flex items-center justify-center cursor-pointer hover:border-cyan-400 transition-colors" onClick={toggleAll}>
                    {selectedIds.length === mockCompanies.length && <div className="w-2.5 h-2.5 rounded-sm bg-cyan-400" />}
                  </div>
                </th>
                <th className="px-4 py-4 text-left border-r border-cyan-500/20">
                  <span className="text-sm text-cyan-400 font-bold">企業名</span>
                </th>
                <th className="px-4 py-4 text-left w-28 border-r border-cyan-500/20">
                  <span className="text-sm text-white/70 font-medium">Status</span>
                  <span className="block text-[10px] text-white/40">(ステータス)</span>
                </th>
                <th className="px-4 py-4 text-left w-24 border-r border-cyan-500/20">
                  <span className="text-sm text-white/70 font-medium">Next</span>
                  <span className="block text-[10px] text-white/40">(次アクション)</span>
                </th>
                <th className="px-4 py-4 text-left w-28 border-r border-cyan-500/20">
                  <span className="text-sm text-white/70 font-medium">メモ</span>
                </th>
                <th className="px-4 py-4 text-left w-16 border-r border-cyan-500/20">
                  <span className="text-sm text-white/70 font-medium">地域</span>
                </th>
                <th className="px-4 py-4 text-left w-20 border-r border-cyan-500/20">
                  <span className="text-sm text-white/70 font-medium">業種</span>
                </th>
                <th className="px-4 py-4 text-left w-24 border-r border-cyan-500/20">
                  <span className="text-sm text-white/70 font-medium">売上</span>
                </th>
                <th className="px-4 py-4 text-left w-28 border-r border-cyan-500/20">
                  <span className="text-sm text-white/70 font-medium">サービス</span>
                </th>
                <th className="px-4 py-4 text-center w-14 border-r border-cyan-500/20">
                  <span className="text-sm text-white/70 font-medium">部署</span>
                </th>
                <th className="px-4 py-4 text-left w-24">
                  <span className="text-sm text-white/70 font-medium">Signal</span>
                  <span className="block text-[10px] text-white/40">(シグナル)</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-[#050510]">
              {mockCompanies.map((company, idx) => (
                <tr key={company.id} className={`border-b border-cyan-500/10 transition-all cursor-pointer ${selectedCompany?.id === company.id ? 'bg-cyan-500/15' : selectedIds.includes(company.id) ? 'bg-purple-500/10' : 'hover:bg-cyan-500/5'}`}>
                  <td className="px-4 py-3.5 border-r border-cyan-500/10" onClick={() => toggleSelect(company.id)}>
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${selectedIds.includes(company.id) ? 'border-cyan-400 bg-cyan-400/20' : 'border-cyan-500/30 hover:border-cyan-400'}`}>
                      {selectedIds.includes(company.id) && <div className="w-2.5 h-2.5 rounded-sm bg-cyan-400" />}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 border-r border-cyan-500/10" onClick={() => setSelectedCompany(company)}>
                    <span className="text-sm font-medium text-white/90 hover:text-cyan-400 transition-colors">{company.name}</span>
                  </td>
                  <td className="px-4 py-3.5 border-r border-cyan-500/10">{getStatusBadge(company.status)}</td>
                  <td className="px-4 py-3.5 border-r border-cyan-500/10">{getNextActionBadge(company.nextAction)}</td>
                  <td className="px-4 py-3.5 border-r border-cyan-500/10">{company.memo ? <span className="text-xs text-white/60 truncate block max-w-[100px]">{company.memo}</span> : <span className="text-xs text-white/20">-</span>}</td>
                  <td className="px-4 py-3.5 text-sm text-white/60 border-r border-cyan-500/10">{company.prefecture.replace('都', '')}</td>
                  <td className="px-4 py-3.5 text-sm text-white/60 border-r border-cyan-500/10">{company.industry.split('・')[0]}</td>
                  <td className="px-4 py-3.5 text-sm text-white/50 border-r border-cyan-500/10">{company.revenue}</td>
                  <td className="px-4 py-3.5 border-r border-cyan-500/10"><span className="text-xs px-2 py-1 rounded bg-cyan-500/10 text-cyan-400/80 border border-cyan-500/20">{company.service}</span></td>
                  <td className="px-4 py-3.5 text-center border-r border-cyan-500/10">{company.hasDeptPhone ? <span className="text-cyan-400 text-xl">●</span> : <span className="text-white/20 text-xl">○</span>}</td>
                  <td className="px-4 py-3.5">{getIntentBadge(company.intent)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>


      {/* Detail Panel - ゴリゴリサイバーパンク */}
      {selectedCompany && (
        <div className="fixed right-0 top-0 bottom-0 w-[850px] flex flex-col z-50 animate-[slideInRight_0.3s_ease-out]">
          {/* ネオン枠線コンテナ */}
          <div className="relative flex-1 flex flex-col bg-[#0a0a10] border-l-2 border-cyan-500/50 overflow-hidden shadow-[0_0_40px_rgba(6,182,212,0.2)]">
            {/* 左側ネオンライン */}
            <div className="absolute top-0 left-0 w-[3px] h-full bg-gradient-to-b from-cyan-400 via-purple-500 to-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.8)]" />
            
            {/* ① ヘッダーセクション */}
            <div className="relative p-6 border-b border-cyan-500/30">
              {/* 企業名 */}
              <h2 className="text-2xl font-black text-white mb-4 leading-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">{selectedCompany.name}</h2>
              
              {/* タグ */}
              <div className="flex gap-2">
                <span className="px-4 py-1.5 text-xs font-bold text-cyan-300 bg-cyan-500/15 border border-cyan-400/40 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.2)]">{selectedCompany.industry.split('・')[0]}</span>
                <span className="px-4 py-1.5 text-xs font-bold text-cyan-300 bg-cyan-500/15 border border-cyan-400/40 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.2)]">{selectedCompany.prefecture.replace('都', '').replace('府', '').replace('県', '')}</span>
              </div>
            </div>
            
            {/* 閉じるボタン - 右上固定 */}
            <button 
              onClick={() => setSelectedCompany(null)} 
              className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center text-white/50 hover:text-white bg-black/50 hover:bg-cyan-500/30 rounded-lg border border-white/20 hover:border-cyan-500/50 transition-all z-20"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            {/* ② タブナビゲーション */}
            <div className="flex border-b border-cyan-500/30 bg-black/30">
              {[
                { id: 'info', label: '企業情報' },
                { id: 'org', label: '組織図' },
                { id: 'person', label: '人物情報' },
                { id: 'script', label: 'SCRIPT' },
              ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setDetailTab(tab.id as 'info' | 'org' | 'person' | 'script')} 
                  className={`flex-1 py-5 text-sm font-bold transition-all ${
                    detailTab === tab.id 
                      ? 'text-cyan-400' 
                      : 'text-white/40 hover:text-white/70'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* ③ コンテンツエリア */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* 企業情報タブ - サイバーパンク */}
              {detailTab === 'info' && (
                <div className="space-y-4">
                  {/* メイン情報カード */}
                  <div className="relative rounded-2xl bg-[#05050a] border-2 border-cyan-500/40 overflow-hidden">
                    {/* 上部グラデーションライン */}
                    <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500" />
                    
                    {/* セクションヘッダー */}
                    <div className="px-5 py-4 border-b border-cyan-500/20 bg-gradient-to-r from-cyan-500/5 to-transparent">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/30 to-purple-500/30 flex items-center justify-center border border-cyan-500/40">
                          <span className="text-xl">📊</span>
                        </div>
                        <div>
                          <span className="text-base font-black text-white">COMPANY DATA</span>
                          <span className="text-[10px] text-cyan-400/60 font-mono block tracking-wider">企業情報</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* データリスト */}
                    <div className="p-4">
                      {[
                        { label: '業種', value: selectedCompany.industry, icon: '🏢' },
                        { label: 'サービス', value: selectedCompany.service, icon: '💼' },
                        { label: '売上', value: selectedCompany.revenue, icon: '💰' },
                        { label: '従業員数', value: selectedCompany.employees, icon: '👥' },
                        { label: '設立', value: selectedCompany.founded, icon: '📅' },
                        { label: '資本金', value: selectedCompany.capital, icon: '🏦' },
                      ].map((item, idx) => (
                        <div 
                          key={idx} 
                          className="group flex items-center gap-4 py-4 border-b border-cyan-500/10 last:border-0 hover:bg-cyan-500/5 px-3 -mx-3 rounded-lg transition-all"
                        >
                          <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 group-hover:border-cyan-400/50 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all">
                            <span className="text-lg">{item.icon}</span>
                          </div>
                          <div className="flex-1">
                            <span className="text-[10px] text-cyan-400/60 font-mono block mb-0.5 tracking-wider">{item.label.toUpperCase()}</span>
                            <span className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">{item.value}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* 所在地カード */}
                  <div className="relative rounded-2xl bg-[#05050a] border-2 border-cyan-500/40 p-5 overflow-hidden group hover:border-cyan-400/60 transition-all">
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-all" />
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500/30 to-orange-500/30 flex items-center justify-center border border-rose-500/40 group-hover:shadow-[0_0_20px_rgba(244,63,94,0.3)] transition-all">
                        <span className="text-2xl">📍</span>
                      </div>
                      <div className="flex-1">
                        <span className="text-[10px] text-rose-400/60 font-mono block mb-1 tracking-wider">LOCATION</span>
                        <span className="text-lg font-bold text-white">{selectedCompany.address}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Webサイトカード */}
                  <a 
                    href={`https://${selectedCompany.website}`} 
            target="_blank"
            rel="noopener noreferrer"
                    className="relative block rounded-2xl bg-[#05050a] border-2 border-cyan-500/40 p-5 overflow-hidden group hover:border-cyan-400/60 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)] transition-all"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-all" />
                    <div className="relative flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/30 to-blue-500/30 flex items-center justify-center border border-cyan-500/40 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all">
                        <span className="text-2xl">🌐</span>
                      </div>
                      <div className="flex-1">
                        <span className="text-[10px] text-cyan-400/60 font-mono block mb-1 tracking-wider">WEBSITE</span>
                        <span className="text-lg font-bold text-cyan-400 group-hover:text-cyan-300 transition-colors">{selectedCompany.website}</span>
                      </div>
                      <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30 group-hover:bg-cyan-500/30 group-hover:border-cyan-400 transition-all">
                        <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                      </div>
                    </div>
                  </a>

                  {/* Scale Insight - AIサマリーセクション */}
                <div className="relative group rounded-2xl bg-gradient-to-br from-[#0a0a15] to-[#05050a] border-2 border-purple-500/40 overflow-hidden hover:border-purple-400/70 transition-all duration-300">
                  {/* 上部グラデーションライン */}
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500" />
                  
                  {/* ヘッダー */}
                  <div className="p-5 border-b border-purple-500/30">
                    <div className="flex items-center gap-3">
                      {/* シグナルくんアイコン */}
                      <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-500 shadow-[0_0_20px_rgba(6,182,212,0.5)] flex items-center justify-center border-2 border-white/30">
                        {/* 顔 */}
                        <div className="relative">
                          {/* 目 */}
                          <div className="flex gap-1.5 mb-0.5">
                            <div className="w-2 h-2 bg-white rounded-full relative">
                              <div className="absolute w-1 h-1 bg-black rounded-full top-0.5 left-0.5" />
                            </div>
                            <div className="w-2 h-2 bg-white rounded-full relative">
                              <div className="absolute w-1 h-1 bg-black rounded-full top-0.5 left-0.5" />
                            </div>
                          </div>
                          {/* 口 */}
                          <div className="w-2.5 mx-auto h-1 border-b-2 border-white rounded-full" />
                        </div>
                        {/* アンテナ */}
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                          <div className="w-0.5 h-2 bg-gradient-to-t from-purple-500 to-cyan-400" />
                          <div className="w-2 h-2 rounded-full bg-cyan-400 -mt-0.5 -ml-0.5 shadow-[0_0_8px_rgba(6,182,212,1)]" />
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-purple-400 font-bold tracking-wider">SCALE INSIGHT</span>
                        <span className="text-[10px] text-white/30 ml-2">powered by SCALEHACK AI</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* サマリーコンテンツ */}
                  <div className="p-5">
                    <p className="text-white/80 text-sm leading-relaxed">
                      {selectedCompany.name}は、{selectedCompany.industry}分野で事業を展開する企業です。
                      従業員数{selectedCompany.employees}名規模で、{selectedCompany.prefecture}に本社を構えています。
                      主力サービスは{selectedCompany.service}であり、{selectedCompany.revenue}の売上規模を持つ成長企業です。
                      デジタルトランスフォーメーション推進に積極的で、新規サービス導入への関心が高い傾向があります。
                    </p>
                    
                    {/* AIタグ */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      <span className="px-3 py-1 text-[10px] font-bold text-purple-300 bg-purple-500/20 border border-purple-500/40 rounded-full">DX推進中</span>
                      <span className="px-3 py-1 text-[10px] font-bold text-cyan-300 bg-cyan-500/20 border border-cyan-500/40 rounded-full">成長企業</span>
                      <span className="px-3 py-1 text-[10px] font-bold text-pink-300 bg-pink-500/20 border border-pink-500/40 rounded-full">新規導入意欲高</span>
                    </div>
                  </div>
                  
                  {/* フッター */}
                  <div className="px-5 py-3 bg-purple-500/10 border-t border-purple-500/20 flex items-center justify-between">
                    <span className="text-[10px] text-white/30 font-mono">Last updated: 2024/12/07</span>
                    <div className="flex items-center gap-1 text-purple-400">
                      <span className="text-[10px] font-mono">AI Confidence:</span>
                      <span className="text-xs font-bold">92%</span>
                    </div>
                  </div>
                </div>
                </div>
              )}

              {/* 組織図タブ - サイバーパンク */}
              {detailTab === 'org' && (
                <div className="space-y-4">
                  {/* 検索ボックス */}
                  <div className="relative mb-2">
                    <input 
                      type="text" 
                      placeholder="部署名で検索..." 
                      className="w-full bg-[#08080f] border-2 border-cyan-500/30 rounded-xl py-4 pl-5 pr-12 text-sm text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 transition-all"
                    />
                    <svg className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400 pointer-events-none" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </div>
                  
                  {/* 部署カードリスト */}
                  {selectedCompany.departments.map((dept, idx) => (
                    <div 
                      key={idx} 
                      className="relative rounded-2xl bg-[#05050a] border-2 border-cyan-500/40 overflow-hidden group hover:border-cyan-400/70 hover:shadow-[0_0_25px_rgba(6,182,212,0.15)] transition-all"
                    >
                      {/* 上部グラデーションライン */}
                      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500" />
                      
                      {/* ヘッダー */}
                      <div className="px-5 py-4 border-b border-cyan-500/20 bg-gradient-to-r from-cyan-500/5 to-transparent">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/30 to-purple-500/30 flex items-center justify-center border border-cyan-500/40 group-hover:border-cyan-400 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all">
                            <span className="text-2xl">🏢</span>
                          </div>
                          <div>
                            <span className="text-lg font-black text-white group-hover:text-cyan-400 transition-colors block">{dept.name}</span>
                            <span className="text-[10px] text-cyan-400/60 font-mono tracking-wider">DEPARTMENT</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* コンテンツ */}
                      <div className="p-4 space-y-3">
                        {/* 電話番号 */}
                        <div className="p-4 rounded-xl bg-[#08080f] border border-emerald-500/20 group-hover:border-emerald-500/40 transition-all">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center border border-emerald-500/40 flex-shrink-0">
                              <span className="text-emerald-400 text-lg">📞</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-[10px] text-emerald-400/60 font-mono block mb-0.5 tracking-wider">TEL</span>
                              <span className="font-mono text-lg font-bold text-white tracking-wider">{dept.phone}</span>
                            </div>
                            <button className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/40 hover:bg-emerald-500/30 transition-all flex-shrink-0">
                              COPY
                            </button>
                          </div>
                        </div>
                        
                        {/* 所在地 */}
                        <div className="flex items-center gap-4 p-3 rounded-xl bg-[#08080f] border border-rose-500/20">
                          <div className="w-8 h-8 rounded-lg bg-rose-500/20 flex items-center justify-center border border-rose-500/40">
                            <span className="text-rose-400">📍</span>
                          </div>
                          <div className="flex-1">
                            <span className="text-[10px] text-rose-400/60 font-mono block mb-0.5 tracking-wider">LOCATION</span>
                            <span className="text-sm text-white/80">{dept.address}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 人物情報タブ - サイバーパンク */}
              {detailTab === 'person' && (
                <div className="space-y-5">
                  {/* 検索ボックス */}
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl opacity-0 group-focus-within:opacity-30 blur transition-all" />
                    <input 
                      type="text" 
                      placeholder="氏名や役職で検索..." 
                      className="relative w-full bg-[#05050a] border-2 border-purple-500/40 rounded-xl pl-4 pr-12 py-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-purple-400 focus:shadow-[0_0_25px_rgba(168,85,247,0.3)] transition-all"
                    />
                    <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400 pointer-events-none" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </div>
                  
                  {/* 人物カード */}
                  {selectedCompany.keyPersons.map((person, idx) => (
                    <div 
                      key={idx} 
                      className="relative group bg-[#05050a] rounded-2xl p-6 border-2 border-purple-500/30 hover:border-purple-400/70 transition-all duration-300 overflow-hidden"
                    >
                      {/* 背景グロー */}
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      {/* 左側のネオンバー */}
                      <div className="absolute left-0 top-4 bottom-4 w-1 bg-gradient-to-b from-purple-400 via-pink-500 to-purple-400 rounded-full opacity-0 group-hover:opacity-100 shadow-[0_0_15px_rgba(168,85,247,0.8)] transition-all" />
                      
                      {/* ヘッダー：名前と認証バッジ */}
                      <div className="relative flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center border-2 border-purple-500/40 group-hover:border-purple-400 group-hover:shadow-[0_0_25px_rgba(168,85,247,0.4)] transition-all">
                          <span className="text-3xl">👤</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-xl font-black text-white group-hover:text-purple-300 transition-colors">{person.name}</span>
                            <span className="w-6 h-6 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.6)] animate-pulse">
                              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                            </span>
                          </div>
                          <span className="text-[10px] text-purple-400/60 font-mono tracking-wider">KEY PERSON</span>
                        </div>
                      </div>
                      
                      {/* 部署・役職 */}
                      <div className="relative mb-4 p-4 rounded-xl bg-[#08080f] border border-purple-500/20">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center border border-purple-500/40">
                            <span className="text-purple-400 text-lg">💼</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-purple-400/60 font-mono block mb-1">POSITION</span>
                            <span className="text-base font-bold text-white">{person.department}　<span className="text-purple-300">{person.role}</span></span>
                          </div>
                        </div>
                      </div>
                      
                      {/* SNS & 更新日 */}
                      <div className="relative flex items-center gap-3">
                        {person.linkedin && (
                          <button className="w-12 h-12 bg-[#0077b5]/20 rounded-xl flex items-center justify-center text-[#0077b5] font-bold border-2 border-[#0077b5]/40 hover:bg-[#0077b5]/30 hover:border-[#0077b5] hover:shadow-[0_0_20px_rgba(0,119,181,0.4)] transition-all">
                            <span className="text-lg">in</span>
                          </button>
                        )}
                        {person.twitter && (
                          <button className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white/70 font-bold border-2 border-white/20 hover:bg-white/20 hover:border-white/40 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all">
                            <span className="text-lg">𝕏</span>
                          </button>
                        )}
                        <div className="ml-auto flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/30">
                          <span className="text-purple-400">🔄</span>
                          <span className="text-xs text-purple-300 font-mono">{person.updatedAt}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* SCRIPTタブ - サイバーパンク */}
              {detailTab === 'script' && (
                <div className="space-y-5">
                  {/* ステータスカード */}
                  <div className="relative rounded-2xl bg-[#05050a] border-2 border-emerald-500/40 overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-400 via-cyan-500 to-emerald-400" />
                    <div className="p-5">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/40">
                          <span className="text-xl">📊</span>
                        </div>
                        <span className="text-xs text-emerald-400 font-mono tracking-widest">STATUS</span>
                      </div>
                      <div className="flex gap-3">
                        <span className={`px-4 py-2 rounded-xl text-sm font-bold border-2 ${
                          selectedCompany.status === 'called' 
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
                            : 'bg-white/5 text-white/30 border-white/10'
                        }`}>CALL済</span>
                        <span className={`px-4 py-2 rounded-xl text-sm font-bold border-2 ${
                          selectedCompany.status === 'not_approached' 
                            ? 'bg-slate-500/20 text-slate-300 border-slate-400 shadow-[0_0_15px_rgba(148,163,184,0.3)]' 
                            : 'bg-white/5 text-white/30 border-white/10'
                        }`}>未アプローチ</span>
                        <span className={`px-4 py-2 rounded-xl text-sm font-bold border-2 ${
                          selectedCompany.status === 'unavailable' 
                            ? 'bg-rose-500/20 text-rose-400 border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.3)]' 
                            : 'bg-white/5 text-white/30 border-white/10'
                        }`}>不可</span>
                      </div>
                    </div>
                  </div>

                  {/* ネクストアクションカード */}
                  <div className="relative rounded-2xl bg-[#05050a] border-2 border-orange-500/40 overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-orange-400 via-yellow-500 to-orange-400" />
                    <div className="p-5">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center border border-orange-500/40">
                          <span className="text-xl">🎯</span>
                        </div>
                        <span className="text-xs text-orange-400 font-mono tracking-widest">NEXT ACTION</span>
                      </div>
                      <div className="flex gap-3">
                        <span className={`px-4 py-2 rounded-xl text-sm font-bold border-2 ${
                          selectedCompany.nextAction === 'call' 
                            ? 'bg-cyan-500/20 text-cyan-400 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]' 
                            : 'bg-white/5 text-white/30 border-white/10'
                        }`}>CALL</span>
                        <span className={`px-4 py-2 rounded-xl text-sm font-bold border-2 ${
                          selectedCompany.nextAction === 'recall' 
                            ? 'bg-orange-500/20 text-orange-400 border-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.3)]' 
                            : 'bg-white/5 text-white/30 border-white/10'
                        }`}>再CALL</span>
                        <span className={`px-4 py-2 rounded-xl text-sm font-bold border-2 ${
                          selectedCompany.nextAction === 'done' 
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
                            : 'bg-white/5 text-white/30 border-white/10'
                        }`}>完了</span>
                      </div>
                    </div>
                  </div>

                  {/* SCALE SCRIPTカード */}
                  <div className="relative rounded-2xl bg-gradient-to-br from-[#0a0a15] to-[#05050a] border-2 border-purple-500/40 overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500" />
                    
                    {/* ヘッダー */}
                    <div className="p-5 border-b border-purple-500/30">
                      <div className="flex items-center gap-3">
                        {/* シグナルくんアイコン */}
                        <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-500 shadow-[0_0_20px_rgba(6,182,212,0.5)] flex items-center justify-center border-2 border-white/30">
                          <div className="relative">
                            <div className="flex gap-1.5 mb-0.5">
                              <div className="w-2 h-2 bg-white rounded-full relative">
                                <div className="absolute w-1 h-1 bg-black rounded-full top-0.5 left-0.5" />
                              </div>
                              <div className="w-2 h-2 bg-white rounded-full relative">
                                <div className="absolute w-1 h-1 bg-black rounded-full top-0.5 left-0.5" />
                              </div>
                            </div>
                            <div className="w-2.5 mx-auto h-1 border-b-2 border-white rounded-full" />
                          </div>
                          <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                            <div className="w-0.5 h-2 bg-gradient-to-t from-purple-500 to-cyan-400" />
                            <div className="w-2 h-2 rounded-full bg-cyan-400 -mt-0.5 -ml-0.5 shadow-[0_0_8px_rgba(6,182,212,1)]" />
                          </div>
                        </div>
                        <div>
                          <span className="text-sm text-purple-400 font-bold tracking-wider">SCALE SCRIPT</span>
                          <span className="text-[10px] text-white/30 ml-2">powered by SCALEHACK AI</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* スクリプトコンテンツ */}
                    <div className="p-5 space-y-4">
                      {/* 導入トーク */}
                      <div className="p-4 rounded-xl bg-[#08080f] border border-cyan-500/30">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-cyan-400">💬</span>
                          <span className="text-xs text-cyan-400 font-mono tracking-wider">INTRODUCTION</span>
                        </div>
                        <p className="text-white/80 text-sm leading-relaxed">
                          「お世話になっております。株式会社Scalehackの〇〇と申します。{selectedCompany.name}様の新規事業の開拓について、現在無償でインテントセールスのSaaSサービスを100社様限定でご提供させていただいている背景でご連絡いたしました。」
                        </p>
                      </div>
                      
                      {/* 質問リスト */}
                      <div className="p-4 rounded-xl bg-[#08080f] border border-purple-500/30">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-purple-400">❓</span>
                          <span className="text-xs text-purple-400 font-mono tracking-wider">QUESTION LIST</span>
                        </div>
                        <ul className="space-y-3 text-white/80 text-sm">
                          <li className="flex items-start gap-3 p-2 rounded-lg hover:bg-purple-500/10 transition-colors">
                            <span className="text-cyan-400 font-bold">Q1.</span>
                            <span>{selectedCompany.keyPersons[0]?.name}様は現在、営業部門の責任者として営業戦略や新規開拓を担われている認識でお間違いないでしょうか？</span>
                          </li>
                          <li className="flex items-start gap-3 p-2 rounded-lg hover:bg-purple-500/10 transition-colors">
                            <span className="text-cyan-400 font-bold">Q2.</span>
                            <span>現在、営業人材は充足されていますか？それとも不足を感じていらっしゃいますか？</span>
                          </li>
                          <li className="flex items-start gap-3 p-2 rounded-lg hover:bg-purple-500/10 transition-colors">
                            <span className="text-cyan-400 font-bold">Q3.</span>
                            <span>インサイドセールスは現在行われていますか？</span>
                          </li>
                          <li className="flex items-start gap-3 p-2 rounded-lg hover:bg-purple-500/10 transition-colors">
                            <span className="text-cyan-400 font-bold">Q4.</span>
                            <span>現在ご利用中の営業支援ツールなどはございますか？</span>
                          </li>
                          <li className="flex items-start gap-3 p-2 rounded-lg hover:bg-purple-500/10 transition-colors">
                            <span className="text-cyan-400 font-bold">Q5.</span>
                            <span>どのようなことができる場合に、もう少しお話を聞いてみたいと思われますか？</span>
                          </li>
                        </ul>
                      </div>
                      
                      {/* クロージング */}
                      <div className="p-4 rounded-xl bg-[#08080f] border border-pink-500/30">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-pink-400">🤝</span>
                          <span className="text-xs text-pink-400 font-mono tracking-wider">CLOSING</span>
                        </div>
                        <p className="text-white/80 text-sm leading-relaxed">
                          「もしよろしければ、必ずお役に立てるご提案をお持ちしますので、15分程度のお時間を来週か再来週でいただくことはできますでしょうか？」
                        </p>
                      </div>
                    </div>
                    
                    {/* フッター */}
                    <div className="px-5 py-3 bg-purple-500/10 border-t border-purple-500/20 flex items-center justify-between">
                      <span className="text-[10px] text-white/30 font-mono">Generated by SCALEHACK AI</span>
                      <div className="flex items-center gap-1 text-purple-400">
                        <span className="text-[10px] font-mono">Success Rate:</span>
                        <span className="text-xs font-bold">87%</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* シグナルくん - ドラッグ可能なキャラクター */}
      <div
        className={`fixed z-[100] select-none transition-transform ${isDragging ? 'cursor-grabbing scale-110' : ''}`}
        style={{ left: characterPos.x, top: characterPos.y }}
      >
        {/* チャットウィンドウ - サイバーパンク */}
        {isChatOpen && (
          <div className="absolute -top-[420px] -left-72 w-[380px] animate-[slideUp_0.4s_ease-out]">
            {/* 外側グロー */}
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-2xl blur-md opacity-50" />
            
            <div className="relative bg-[#0a0a15]/95 backdrop-blur-xl rounded-2xl overflow-hidden border-2 border-cyan-400/40 shadow-[0_0_40px_rgba(6,182,212,0.3)]">
              {/* スキャンライン */}
              <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(6,182,212,0.02)_2px,rgba(6,182,212,0.02)_4px)] pointer-events-none" />
              
              {/* 上部ネオンボーダー */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 shadow-[0_0_15px_rgba(6,182,212,0.8)]" />
              
              {/* ヘッダー */}
              <div className="relative flex items-center justify-between px-5 py-4 border-b border-cyan-500/30">
                <span className="text-white font-bold text-sm tracking-wide">Scale Signal AI Assistant</span>
                <button 
                  onClick={() => setIsChatOpen(false)} 
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-pink-500/30 flex items-center justify-center text-white/50 hover:text-pink-400 transition-all border border-white/10 hover:border-pink-500/50"
                >
                  <span className="text-sm">✕</span>
                </button>
              </div>
              
              {/* メッセージエリア */}
              <div className="h-72 overflow-y-auto px-4 py-4 space-y-4">
                {/* 上部スペーサー */}
                <div className="h-6" />
                {chatHistory.map((chat, idx) => (
                  <div key={idx} className={`flex items-start gap-3 ${chat.role === 'user' ? 'flex-row-reverse' : ''} animate-[fadeIn_0.3s_ease-out]`}>
                    {/* アバター */}
                    {chat.role === 'signal' ? (
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                        <div className="flex gap-0.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        </div>
                      </div>
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-slate-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm">👤</span>
                      </div>
                    )}
                    {/* メッセージバブル */}
                    <div className={`max-w-[70%] px-4 py-3 text-sm leading-relaxed rounded-2xl ${
                      chat.role === 'user' 
                        ? 'bg-slate-700/80 text-white rounded-tr-sm border border-slate-600/50' 
                        : 'bg-[#1a1a2e] text-white rounded-tl-sm border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.1)]'
                    }`}>
                      {chat.message}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* 入力エリア */}
              <div className="p-4 border-t border-cyan-500/30 bg-black/30">
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="何でも聞いてね..."
                      className="w-full px-4 h-12 rounded-xl bg-[#0a0a15] border-2 border-cyan-500/30 text-sm text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 transition-all"
                    />
                  </div>
                  <button 
                    onClick={sendMessage} 
                    className="w-12 h-12 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] hover:scale-105 transition-all"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* フッター */}
              <div className="px-4 py-2 bg-black/50 border-t border-cyan-500/20 text-center">
                <span className="text-[10px] text-white/40">Powered by </span>
                <span className="text-[10px] text-cyan-400 font-bold">Scale Signal</span>
              </div>
            </div>
          </div>
        )}

        <div className="relative cursor-grab" onMouseDown={handleMouseDown}>
          {/* 光るオーラ */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full blur-xl opacity-50 animate-pulse" style={{ width: 100, height: 100, left: -10, top: -10 }} />
          
          {/* キャラクター本体 */}
          <div 
            onClick={() => !isDragging && setIsChatOpen(!isChatOpen)}
            className="relative w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-500 shadow-[0_0_30px_rgba(6,182,212,0.6)] flex items-center justify-center border-4 border-white/30 cursor-pointer hover:scale-105 transition-transform"
          >
            {/* 顔 */}
            <div className="relative">
              {/* 目 */}
              <div className="flex gap-3 mb-1">
                <div className="w-3 h-3 bg-white rounded-full relative">
                  <div className="absolute w-1.5 h-1.5 bg-black rounded-full top-0.5 left-0.5" />
                </div>
                <div className="w-3 h-3 bg-white rounded-full relative">
                  <div className="absolute w-1.5 h-1.5 bg-black rounded-full top-0.5 left-0.5" />
                </div>
              </div>
              {/* 口 */}
              <div className={`w-4 mx-auto ${isChatOpen ? 'h-2 bg-white rounded-full' : 'h-2 border-b-2 border-white rounded-full'}`} />
            </div>
          </div>

          {/* アンテナ */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2">
            <div className="w-1 h-4 bg-gradient-to-t from-purple-500 to-cyan-400" />
            <div className="w-3 h-3 rounded-full bg-cyan-400 -mt-1 -ml-1 animate-ping absolute top-0" />
            <div className="w-3 h-3 rounded-full bg-cyan-400 -mt-1 -ml-1 shadow-[0_0_10px_rgba(6,182,212,1)]" />
          </div>

          {/* 通知バッジ */}
          {!isChatOpen && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center text-xs font-bold text-white animate-bounce shadow-[0_0_10px_rgba(236,72,153,0.8)]">
              ?
            </div>
          )}
        </div>

        {/* シグナルとは 説明吹き出し - サイバーパンク */}
        {!isChatOpen && isBubbleOpen && (
          <div className="absolute -top-56 -left-72 w-80 animate-[fadeIn_0.5s_ease-out]">
            {/* 外側グロー */}
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-2xl blur-md opacity-60 animate-pulse" />
            
            <div className="relative bg-black/95 backdrop-blur-xl rounded-2xl overflow-hidden border-2 border-cyan-400/60 shadow-[0_0_50px_rgba(6,182,212,0.4),inset_0_0_30px_rgba(6,182,212,0.1)]">
              {/* スキャンライン効果 */}
              <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(6,182,212,0.03)_2px,rgba(6,182,212,0.03)_4px)] pointer-events-none" />
              
              {/* 上部ネオンボーダー */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 shadow-[0_0_20px_rgba(6,182,212,1)]" />
              
              {/* 閉じるボタン */}
              <button 
                onClick={(e) => { e.stopPropagation(); setIsBubbleOpen(false); }}
                className="absolute top-2 right-2 w-6 h-6 rounded-lg bg-white/10 hover:bg-pink-500/30 flex items-center justify-center text-white/50 hover:text-pink-400 transition-all z-10 border border-white/20 hover:border-pink-500/50"
              >
                <span className="text-xs">✕</span>
              </button>
              
              {/* コーナーアクセント */}
              <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
              <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.8)]" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
              
              <div className="relative p-5">
                {/* タイトル */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/30 to-purple-500/30 flex items-center justify-center border border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                    <span className="text-lg">⚡</span>
                  </div>
                  <div>
                    <span className="text-cyan-400 font-black text-sm tracking-wider drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]">SCALE SIGNAL</span>
                    <span className="text-white/60 text-xs ml-1">とは?</span>
                  </div>
                </div>
                
                {/* 説明文 */}
                <div className="space-y-3 text-xs leading-relaxed">
                  <p className="text-white/90">
                    インテントセールスとは異なり、貴社サービスと
                    <span className="text-cyan-400 font-bold px-1 py-0.5 bg-cyan-500/20 rounded mx-0.5">業種</span>
                    <span className="text-cyan-400 font-bold px-1 py-0.5 bg-cyan-500/20 rounded mx-0.5">売上</span>や
                    <span className="text-cyan-400 font-bold px-1 py-0.5 bg-cyan-500/20 rounded mx-0.5">従業員数</span>
                    などとの関連性をもとに独自アルゴリズムでスコア算出
                  </p>
                  <p className="text-white/70">
                    <span className="text-purple-400 font-bold px-1 py-0.5 bg-purple-500/20 rounded mx-0.5">部署番号</span>や
                    <span className="text-purple-400 font-bold px-1 py-0.5 bg-purple-500/20 rounded mx-0.5">人物データ</span>
                    の有無も加味して、成功確率の高さを表すよ！
                  </p>
                </div>
                
                {/* クリック誘導 - ネオンスタイル */}
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsChatOpen(true); setIsBubbleOpen(false); }}
                  className="mt-4 pt-3 border-t border-cyan-500/30 flex items-center justify-center gap-2 w-full hover:bg-cyan-500/10 transition-all rounded-b-lg cursor-pointer"
                >
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span className="text-[11px] text-cyan-400 font-bold tracking-wider">CLICK TO CHAT</span>
                  <span className="text-cyan-400">💬</span>
                </button>
              </div>
              
              {/* 吹き出しの三角 - ネオン */}
              <div className="absolute -bottom-3 right-12 w-6 h-6 bg-black border-r-2 border-b-2 border-cyan-400/60 transform rotate-45 shadow-[2px_2px_10px_rgba(6,182,212,0.5)]" />
            </div>
          </div>
        )}
        
        {/* 閉じている時の「SCALE SIGNALとは」ボタン */}
        {!isChatOpen && !isBubbleOpen && (
          <button
            onClick={(e) => { e.stopPropagation(); setIsBubbleOpen(true); }}
            className="absolute -top-12 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/90 border-2 border-cyan-400/50 rounded-full text-cyan-400 text-xs font-bold tracking-wider hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all whitespace-nowrap"
          >
            <span className="mr-1">⚡</span>SCALE SIGNALとは?
          </button>
        )}
      </div>
    </div>
  );
}
