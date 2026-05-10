# 言の葉 × LPIC - クラウド同期版

LPICレベル1 合格のための能動学習アプリ。Firebase + Vercel で全端末同期に対応。

## デプロイ手順(Vercel)

### 1. このフォルダ全体を GitHub にアップロード

GitHub で新しいリポジトリを作成し、このフォルダの中身をすべてアップロード(`node_modules` は不要、`.gitignore` で除外済み)。

### 2. Vercel でインポート

[Vercel](https://vercel.com/) にログインし、「Add New」→「Project」→ GitHub リポジトリをインポート。

設定は自動検出されます(変更不要):

- Framework Preset: **Vite**
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

「Deploy」をクリックすると 2-3 分で公開完了。

### 3. Firebase 認証許可ドメインに Vercel URL を追加

1. [Firebase Console](https://console.firebase.google.com/) → プロジェクト「linux-learning」
2. Authentication → Settings → 承認済みドメイン
3. ドメインの追加 → `(あなたのプロジェクト名).vercel.app` を入力

これで完了。発行された URL からアクセスし、Google でログインしてご利用ください。

## ローカル開発(任意)

```bash
npm install
npm run dev
```

ローカル起動した場合は、Firebase 認証許可ドメインに `localhost` も追加してください。

## ファイル構成

```
lpic-study/
├── package.json          # 依存関係
├── vite.config.js        # ビルド設定
├── tailwind.config.js    # Tailwind CSS 設定
├── postcss.config.js
├── index.html            # エントリポイント
├── .gitignore
├── README.md
└── src/
    ├── main.jsx          # React 起動
    ├── App.jsx           # メインアプリ(217問+記述式40問+試験対策)
    ├── firebase.js       # Firebase 初期化(Auth + Firestore)
    └── index.css         # Tailwind 基本スタイル
```

## 機能

- 28日間カリキュラム(101試験・102試験)
- 217 問の選択式問題 + 40 問の記述式(コマ問)
- 60問60分の本試験モード(タイマー付き)
- 金メダル方式(2回連続正解で出題プールから除外)
- カテゴリ別正解率の可視化
- リアルタイム同期(他端末での変更が即時反映)
- オフライン対応(復帰時に自動同期)
