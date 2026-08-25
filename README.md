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
- 235 問の選択式問題 + 46 問の記述式(コマ問)
- 本試験モード(60問・90分・本番と同じ配分。タイマー付き)
- 金メダル方式(2回連続正解で出題プールから除外)
- 間隔反復(SM-2 を28日試験向けに調整。選択式・記述式の両方が対象)
- 重み付きインターリーブ出題(出題比重 × 弱点度で抽出し、分野を混ぜて出題)
- リーチ管理(4回以上落とした問題を別枠で優先出題)
- カテゴリ別正解率の可視化
- リアルタイム同期(他端末での変更が即時反映)
- オフライン対応(復帰時に自動同期)

## 学習メソッド

道場(ダッシュボード)の「学習メソッド」に常時掲示している6原則で回す。

1. **想起優先** — 読む前に解く。解説は答えを出したあとに読む。
2. **分散学習** — まず「今日の復習」(間隔反復の期日分)を消化してから新しい Day に進む。
3. **インターリーブ** — 同じ分野を続けず混ぜて出題し、紛らわしい選択肢の判別力を鍛える。
4. **重み付き出題** — 公式の出題比重(weight)が高い項目と、正解率の低い問題を厚く配分する。
5. **リーチ管理** — 4回以上落とした問題は別枠で先に潰す。
6. **本番シミュレーション** — 週1回は本試験モードを通しで受ける。

## 試験情報(2026年8月時点)

| 項目 | 内容 |
| --- | --- |
| 現行バージョン | Version 5.0(101-500 / 102-500) |
| 出題数・時間 | 各試験 60問 / 90分 |
| 合格ライン | 800点満点中 500点 |
| 出題形式 | 選択式 + 記述式(コマ問。全体の約3-4割) |
| 受験方法 | ピアソンVUE テストセンター / OnVUE オンライン監督試験 |
| 認定の有効期間 | 5年 |

LPI は出題範囲を3年ごとに小改訂、6年ごとに全面改訂する方針のため、受験前に
[LPI 公式の LPIC-1 ページ](https://www.lpi.org/our-certifications/lpic-1-overview/)で
最新の出題範囲を必ず確認すること。問題データは Version 5.0 の範囲のまま、
現行ディストリの実装(deb822 形式の APT ソース、dnf5、Wayland 既定、
systemd-resolved、nftables、netplan など)を問う設問を追加してある。
