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
  const [detailTab, setDetailTab] = useState<'info' | 'org' | 'person'>('info');
  const [selectedFilters, setSelectedFilters] = useState<string[]>(['industry', 'revenue', 'service']);
  
  // シグナルくん
  const [characterPos, setCharacterPos] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'signal', message: string}[]>([
    { role: 'signal', message: 'こんにちは！シグナルくんだよ🚀 何でも相談してね！' }
  ]);
  const dragOffset = useRef({ x: 0, y: 0 });

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
    setSelectedFilters(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
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
        return <span className="px-2.5 py-1 text-[10px] rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.3)]">CALL済</span>;
      case 'not_approached':
        return <span className="px-2.5 py-1 text-[10px] rounded-full bg-slate-500/20 text-slate-400 font-bold border border-slate-500/30">未アプローチ</span>;
      case 'unavailable':
        return <span className="px-2.5 py-1 text-[10px] rounded-full bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.3)]">不可</span>;
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
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 shadow-[0_0_12px_rgba(244,63,94,0.8)] animate-pulse" />
            <span className="text-xs font-bold text-rose-400">High</span>
          </div>
        );
      case 'mid':
        return (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_12px_rgba(6,182,212,0.8)]" />
            <span className="text-xs font-bold text-cyan-400">Mid</span>
          </div>
        );
      case 'low':
        return (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-600" />
            <span className="text-xs text-slate-500">Low</span>
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
      <aside className="relative w-80 border-r border-cyan-500/20 flex flex-col flex-shrink-0 bg-gradient-to-b from-[#0a0a12] via-[#080810] to-[#050508]">
        {/* Animated Side Border */}
        <div className="absolute inset-y-0 right-0 w-[2px] bg-gradient-to-b from-cyan-500 via-purple-500 to-pink-500 opacity-50" />
        
        {/* Service Name - BIG & BOLD */}
        <div className="relative px-6 py-8 border-b border-white/10 overflow-hidden">
          {/* Background Glow */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-cyan-500/30 rounded-full blur-[60px] animate-pulse" />
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-[50px] animate-pulse" />
          
          <div className="relative">
            <p className="text-xs font-bold text-cyan-400/80 tracking-[0.3em] mb-2 animate-pulse">SCALEHACK</p>
            <h1 className="text-4xl font-black tracking-tight leading-none">
              <span className="block text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">Scale</span>
              <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(6,182,212,0.5)] animate-pulse">Signal</span>
            </h1>
            <div className="flex items-center gap-2 mt-3">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs text-emerald-400 font-mono">LIVE</span>
            </div>
          </div>
        </div>

        {/* Section Title */}
        <div className="mx-5 my-4 px-4 py-3 rounded-lg bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20">
          <h2 className="text-base font-bold text-cyan-400">⚡ 絞り込み</h2>
        </div>

        {/* Filter Items */}
        <div className="flex-1 overflow-y-auto px-5 py-3">
          {initialFilterItems.map((item) => {
            const isSelected = selectedFilters.includes(item.id);
            return (
              <div 
                key={item.id} 
                onClick={() => toggleFilter(item.id)}
                className={`group flex items-center gap-4 px-4 py-4 rounded-xl cursor-pointer transition-all duration-300 border ${isSelected ? 'bg-cyan-500/10 border-cyan-500/30' : 'border-transparent hover:bg-white/5 hover:border-white/10'}`}
              >
                {/* Circle Indicator */}
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${isSelected ? 'border-cyan-400 bg-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.8)]' : 'border-white/30 group-hover:border-white/50'}`}>
                  {isSelected && (
                    <svg className="w-2.5 h-2.5 text-black" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                
                <span className={`flex-1 text-base font-medium transition-all duration-300 ${isSelected ? 'text-white' : 'text-white/60 group-hover:text-white/80'}`}>{item.label}</span>
                
                <svg className={`w-5 h-5 transition-all duration-300 ${isSelected ? 'text-cyan-400' : 'text-white/20 group-hover:text-white/40'}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-white/10 bg-gradient-to-t from-black/50 to-transparent">
          <div className="flex items-center justify-between mb-5 px-1">
            <span className="text-sm text-white/50 font-medium">対象企業</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">1,598</span>
              <span className="text-base text-white/50">件</span>
            </div>
          </div>
          <button className="w-full h-10 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-sm font-bold text-white shadow-[0_4px_30px_rgba(6,182,212,0.4)] hover:shadow-[0_4px_40px_rgba(6,182,212,0.6)] hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2">
            <span>🔍</span>
            <span>検索する</span>
          </button>
          <button className="w-full mt-2 h-10 rounded-xl border border-white/20 text-sm font-bold text-white/50 hover:text-white hover:bg-white/5 transition-all">
            条件をクリア
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col overflow-hidden relative transition-all ${selectedCompany ? 'mr-[800px]' : ''}`}>
        <div className="px-6 py-4 border-b border-white/10 backdrop-blur-xl bg-black/20 flex items-center justify-between gap-6">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">1,598</span>
            <span className="text-sm text-white/40">件</span>
          </div>
          <div className="flex-1 max-w-md">
            <div className="relative flex items-center">
              <svg className="absolute left-3 w-4 h-4 text-white/40 pointer-events-none" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input 
                type="text" 
                placeholder="企業名で検索..." 
                className="w-full py-2.5 pr-4 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/40 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all" 
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
          </div>
          <button className="p-2.5 rounded-xl hover:bg-white/5 border border-white/10 transition-all group">
            <svg className="w-5 h-5 text-white/30 group-hover:text-cyan-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </button>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full">
            <thead className="sticky top-0 backdrop-blur-xl bg-[#030308]/90 border-b border-white/10">
              <tr>
                <th className="px-4 py-4 text-left w-10"><div className="w-5 h-5 rounded-md border-2 border-white/20 flex items-center justify-center cursor-pointer hover:border-cyan-400 transition-colors" onClick={toggleAll}>{selectedIds.length === mockCompanies.length && <div className="w-2.5 h-2.5 rounded-sm bg-gradient-to-r from-cyan-400 to-purple-500" />}</div></th>
                <th className="px-4 py-4 text-left text-xs text-cyan-400/80 font-bold uppercase tracking-wider">企業名</th>
                <th className="px-4 py-4 text-left text-xs text-cyan-400/80 font-bold uppercase tracking-wider w-24">Status</th>
                <th className="px-4 py-4 text-left text-xs text-cyan-400/80 font-bold uppercase tracking-wider w-20">Next</th>
                <th className="px-4 py-4 text-left text-xs text-cyan-400/80 font-bold uppercase tracking-wider w-28">メモ</th>
                <th className="px-4 py-4 text-left text-xs text-cyan-400/80 font-bold uppercase tracking-wider w-16">地域</th>
                <th className="px-4 py-4 text-left text-xs text-cyan-400/80 font-bold uppercase tracking-wider w-20">業種</th>
                <th className="px-4 py-4 text-left text-xs text-cyan-400/80 font-bold uppercase tracking-wider w-24">売上</th>
                <th className="px-4 py-4 text-left text-xs text-cyan-400/80 font-bold uppercase tracking-wider w-28">サービス</th>
                <th className="px-4 py-4 text-center text-xs text-cyan-400/80 font-bold uppercase tracking-wider w-12">部署</th>
                <th className="px-4 py-4 text-left text-xs text-cyan-400/80 font-bold uppercase tracking-wider w-16">Signal</th>
              </tr>
            </thead>
            <tbody>
              {mockCompanies.map((company, idx) => (
                <tr key={company.id} className={`border-b border-white/5 transition-all cursor-pointer ${selectedCompany?.id === company.id ? 'bg-cyan-500/10 shadow-[inset_0_0_30px_rgba(6,182,212,0.1)]' : selectedIds.includes(company.id) ? 'bg-purple-500/10' : 'hover:bg-white/[0.03]'}`} style={{ animationDelay: `${idx * 20}ms` }}>
                  <td className="px-4 py-3" onClick={() => toggleSelect(company.id)}>
                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${selectedIds.includes(company.id) ? 'border-cyan-400 bg-cyan-400/20 shadow-[0_0_10px_rgba(6,182,212,0.5)]' : 'border-white/20 hover:border-white/40'}`}>
                      {selectedIds.includes(company.id) && <div className="w-2.5 h-2.5 rounded-sm bg-gradient-to-r from-cyan-400 to-purple-500" />}
                    </div>
                  </td>
                  <td className="px-4 py-3" onClick={() => setSelectedCompany(company)}>
                    <span className="text-sm font-medium text-white/90 hover:text-cyan-400 transition-colors">{company.name}</span>
                  </td>
                  <td className="px-4 py-3">{getStatusBadge(company.status)}</td>
                  <td className="px-4 py-3">{getNextActionBadge(company.nextAction)}</td>
                  <td className="px-4 py-3">{company.memo ? <span className="text-xs text-white/50 truncate block max-w-[100px]">{company.memo}</span> : <span className="text-xs text-white/20">-</span>}</td>
                  <td className="px-4 py-3 text-xs text-white/50">{company.prefecture}</td>
                  <td className="px-4 py-3 text-xs text-white/50">{company.industry}</td>
                  <td className="px-4 py-3 text-xs text-white/40">{company.revenue}</td>
                  <td className="px-4 py-3"><span className="text-xs px-2 py-1 rounded-full bg-white/5 text-white/50 border border-white/10">{company.service}</span></td>
                  <td className="px-4 py-3 text-center">{company.hasDeptPhone ? <span className="text-cyan-400 text-lg">●</span> : <span className="text-white/20 text-lg">○</span>}</td>
                  <td className="px-4 py-3">{getIntentBadge(company.intent)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Panel */}
      {selectedCompany && (
        <div className="fixed right-0 top-0 h-full w-[800px] bg-[#0d0d12] border-l border-white/10 flex flex-col z-50 shadow-2xl">
          <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-cyan-500/50 via-purple-500/50 to-pink-500/50" />
          
          <div className="p-6 border-b border-white/10">
            <div className="flex items-start justify-between mb-5">
              <div className="flex-1 pr-4">
                <h2 className="text-2xl font-black bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent mb-2">{selectedCompany.name}</h2>
                <p className="text-sm text-white/40">{selectedCompany.industry} ・ {selectedCompany.prefecture}</p>
              </div>
              <button onClick={() => setSelectedCompany(null)} className="p-2.5 hover:bg-white/10 rounded-xl border border-white/10 transition-all group">
                <svg className="w-5 h-5 text-white/40 group-hover:text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="flex gap-2">
              <button onClick={() => setDetailTab('info')} className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${detailTab === 'info' ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.5)]' : 'bg-white/5 text-white/50 hover:text-white border border-white/10'}`}>企業情報</button>
              <button onClick={() => setDetailTab('org')} className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${detailTab === 'org' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.5)]' : 'bg-white/5 text-white/50 hover:text-white border border-white/10'}`}>組織図</button>
              <button onClick={() => setDetailTab('person')} className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${detailTab === 'person' ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-[0_0_20px_rgba(236,72,153,0.5)]' : 'bg-white/5 text-white/50 hover:text-white border border-white/10'}`}>人物情報</button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {detailTab === 'info' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: '業種', value: selectedCompany.industry },
                    { label: 'サービス', value: selectedCompany.service },
                    { label: '売上', value: selectedCompany.revenue },
                    { label: '従業員数', value: selectedCompany.employees },
                    { label: '設立', value: selectedCompany.founded },
                    { label: '資本金', value: selectedCompany.capital },
                  ].map((item, idx) => (
                    <div key={idx} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-cyan-500/30 transition-colors">
                      <div className="text-[10px] text-cyan-400/60 font-bold uppercase tracking-wider mb-1">{item.label}</div>
                      <div className="text-sm text-white/90 font-medium">{item.value}</div>
                    </div>
                  ))}
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="text-[10px] text-cyan-400/60 font-bold uppercase tracking-wider mb-1">所在地</div>
                  <div className="text-sm text-white/90">{selectedCompany.address}</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="text-[10px] text-cyan-400/60 font-bold uppercase tracking-wider mb-1">Website</div>
                  <a href={`https://${selectedCompany.website}`} className="text-sm text-cyan-400 hover:underline">{selectedCompany.website}</a>
                </div>
              </div>
            )}

            {detailTab === 'org' && (
              <div className="space-y-4">
                <input type="text" placeholder="🔍 部署名などを入力..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 focus:shadow-[0_0_20px_rgba(168,85,247,0.2)]" />
                {selectedCompany.departments.map((dept, idx) => (
                  <div key={idx} className="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-purple-500/30 transition-all group">
                    <div className="font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">{dept.name}</div>
                    <div className="flex items-center gap-3 text-sm mb-2">
                      <span className="text-purple-400">📞</span>
                      <span className="font-mono text-cyan-400 text-lg">{dept.phone}</span>
                    </div>
                    <div className="text-xs text-white/40">{dept.address}</div>
                  </div>
                ))}
              </div>
            )}

            {detailTab === 'person' && (
              <div className="space-y-4">
                <input type="text" placeholder="🔍 氏名や役職などを入力..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-pink-500/50 focus:shadow-[0_0_20px_rgba(236,72,153,0.2)]" />
                {selectedCompany.keyPersons.map((person, idx) => (
                  <div key={idx} className="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-pink-500/30 transition-all group">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-lg font-bold text-white group-hover:text-pink-400 transition-colors">{person.name}</span>
                      <span className="w-5 h-5 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      </span>
                    </div>
                    <div className="text-sm text-white/50 mb-3">{person.department}　{person.role}</div>
                    <div className="flex items-center gap-3 mb-3">
                      {person.linkedin && <span className="px-3 py-1.5 bg-[#0077b5]/20 rounded-lg text-[#0077b5] text-xs font-bold border border-[#0077b5]/30">LinkedIn</span>}
                      {person.twitter && <span className="px-3 py-1.5 bg-white/10 rounded-lg text-white/60 text-xs font-bold border border-white/20">𝕏</span>}
                    </div>
                    <div className="text-[10px] text-white/30">🔄 {person.updatedAt}に登録</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-6 border-t border-white/10">
            <button className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-sm font-black text-white shadow-[0_0_30px_rgba(6,182,212,0.5)] hover:shadow-[0_0_50px_rgba(168,85,247,0.8)] transition-all hover:-translate-y-0.5">
              🚀 アプローチを開始
            </button>
          </div>
        </div>
      )}

      {/* シグナルくん - ドラッグ可能なキャラクター */}
      <div
        className={`fixed z-[100] select-none transition-transform ${isDragging ? 'cursor-grabbing scale-110' : ''}`}
        style={{ left: characterPos.x, top: characterPos.y }}
      >
        {/* チャットウィンドウ - モダン&アーティスティック */}
        {isChatOpen && (
          <div className="absolute bottom-28 left-1/2 -translate-x-1/2 w-96 animate-[slideUp_0.4s_ease-out]">
            {/* グロー効果 */}
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-3xl blur-lg opacity-40 animate-pulse" />
            
            <div className="relative bg-black/80 backdrop-blur-2xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
              {/* 装飾ライン */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500" />
              
              {/* 閉じるボタン */}
              <div className="absolute top-3 right-3 z-10">
                <button onClick={() => setIsChatOpen(false)} className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/50 hover:text-white transition-all hover:rotate-90 duration-300">
                  ✕
                </button>
              </div>
              
              {/* メッセージエリア */}
              <div className="h-80 overflow-y-auto px-4 py-6 space-y-5 scrollbar-thin">
                {chatHistory.map((chat, idx) => (
                  <div key={idx} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'} animate-[fadeIn_0.3s_ease-out]`}>
                    <div className={`max-w-[75%] px-5 py-3 text-sm leading-relaxed ${
                      chat.role === 'user' 
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-3xl rounded-br-lg' 
                        : 'bg-white/90 text-gray-800 rounded-3xl rounded-bl-lg shadow-md'
                    }`}>
                      {chat.message}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* 入力エリア */}
              <div className="p-4 border-t border-white/5 bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="何でも聞いてね..."
                      className="w-full px-5 h-14 rounded-2xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/30 focus:bg-white/10 transition-all"
                    />
                  </div>
                  <button 
                    onClick={sendMessage} 
                    className="w-12 h-12 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 flex items-center justify-center text-white shadow-[0_4px_20px_rgba(6,182,212,0.4)] hover:shadow-[0_4px_30px_rgba(6,182,212,0.6)] hover:scale-105 transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                  </button>
                </div>
                <p className="text-[10px] text-white/30 text-center mt-3">Powered by Scale Signal AI ✨</p>
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

        {/* 吹き出し */}
        {!isChatOpen && (
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 whitespace-nowrap">
            <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-xs text-white font-bold shadow-lg">
              クリックして相談 💬
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
