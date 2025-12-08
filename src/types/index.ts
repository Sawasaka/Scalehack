// 共通の型定義

// ユーザー関連
export interface User {
  id: string;
  email: string;
  name: string;
  company?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'admin' | 'manager' | 'sales' | 'viewer';

// リード（見込み顧客）
export interface Lead {
  id: string;
  companyName: string;
  contactName?: string;
  email?: string;
  phone?: string;
  industry: string;
  employeeCount?: number;
  intentScore: number; // インテントスコア (0-100)
  intentSignals: IntentSignal[];
  status: LeadStatus;
  assignedTo?: string;
  source: string;
  createdAt: Date;
  updatedAt: Date;
}

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';

// インテントシグナル
export interface IntentSignal {
  id: string;
  type: IntentSignalType;
  description: string;
  strength: 'low' | 'medium' | 'high';
  detectedAt: Date;
  source: string;
}

export type IntentSignalType = 
  | 'website_visit'
  | 'content_download'
  | 'search_activity'
  | 'competitor_research'
  | 'budget_allocation'
  | 'hiring_signal'
  | 'technology_adoption';

// キャンペーン
export interface Campaign {
  id: string;
  name: string;
  description: string;
  status: CampaignStatus;
  startDate: Date;
  endDate?: Date;
  targetLeads: number;
  contactedLeads: number;
  convertedLeads: number;
  createdAt: Date;
  updatedAt: Date;
}

export type CampaignStatus = 'draft' | 'active' | 'paused' | 'completed';

// ダッシュボード統計
export interface DashboardStats {
  totalLeads: number;
  highIntentLeads: number;
  activeConversations: number;
  conversionRate: number;
  avgIntentScore: number;
  weeklyGrowth: number;
}

// APIレスポンス
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ページネーション
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}



