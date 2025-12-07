# Intent Sales Platform（インテントセールス）

Scalehack × インテントセールス モック版

## 概要

AIとデータドリブンで実現する、最適なタイミングでの営業アプローチプラットフォーム。

### Scalehackの強み
- **4,000社以上の支援実績** - 豊富な実績に基づいた確かなノウハウ
- **国内最大級の営業人材DB** - 実績ある営業プロフェッショナルが揃うネットワーク
- **データドリブン営業** - AIとデータ分析で最適なアプローチを実現
- **営業代行サポート** - 人材提供から実行支援までワンストップ

## 技術スタック

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Font**: Noto Sans JP（日本語）、Inter（英語）
- **Icons**: Lucide React

## ディレクトリ構造

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # ルートレイアウト
│   ├── page.tsx            # ランディングページ
│   └── globals.css         # グローバルスタイル
├── components/
│   ├── ui/                 # 汎用UIコンポーネント
│   │   ├── Button.tsx
│   │   └── Card.tsx
│   ├── layout/             # レイアウトコンポーネント
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   └── features/           # 機能別コンポーネント
├── lib/                    # ユーティリティ関数
│   └── utils.ts
├── types/                  # 型定義
│   └── index.ts
├── constants/              # 定数
│   └── index.ts
└── hooks/                  # カスタムフック
```

## 開発方法

### インストール

```bash
npm install
```

### 開発サーバー起動

```bash
npm run dev
```

http://localhost:3000 で確認できます。

### ビルド

```bash
npm run build
```

### 本番モード起動

```bash
npm run start
```

## 今後の開発予定

### Phase 1: モック版（今週〜来週金曜）
- [x] プロジェクト初期設定
- [x] ランディングページ
- [ ] ダッシュボード画面
- [ ] リード管理画面
- [ ] インテント分析画面

### Phase 2: 機能実装
- [ ] ユーザー認証
- [ ] リードデータ管理
- [ ] インテントスコア計算ロジック
- [ ] レポート機能

### Phase 3: 本番リリース
- [ ] API連携
- [ ] データベース構築
- [ ] セキュリティ強化

## 成果物（来週金曜の面談用）

1. **モック版アプリケーション** - 本リポジトリ
2. **要件定義書** - `/docs/requirements.md`（作成予定）
3. **ER図** - `/docs/er-diagram.md`（作成予定）

## 参考リンク

- [Scalehack公式サイト](https://scalehack.co.jp/)
- [Next.js ドキュメント](https://nextjs.org/docs)
- [Tailwind CSS ドキュメント](https://tailwindcss.com/docs)

---

© 2024 Scalehack Inc.
