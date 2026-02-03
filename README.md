# Ikutoku-sai Web (Next.js)

Next.js implementation of the Ikutoku-sai website. Static assets live under `public/static`, and the app routes are built with the App Router in `src/app`.

## Tech Stack
- Next.js 14 (App Router)
- React 18
- TypeScript
- Node.js 20+

## Quick Start
```bash
npm install
npm run dev
```
Open `http://localhost:3000`.

## Scripts
- `npm run dev` - Start the development server.
- `npm run build` - Build for production.
- `npm run start` - Start the production server.
- `npm run lint` - Run ESLint.
- `npm test` - Run smoke tests.

## Environment Variables
Create a `.env` file (or export in your shell) with:
```
ADMIN_PASSWORD=your_admin_password
SECRET_KEY=your_secret_key
```

## Routes
Main site:
- `/`
- `/about`
- `/announce`
- `/event`

Standalone pages:
- `/map`
- `/bus_stop`
- `/parking_bycycle`
- `/parking_car`
- `/login`
- `/bingo`
- `/eeeeee` (placeholder page)

API route:
- `POST /login_submit` - Authenticates and sets a session cookie.

## Project Notes
- `public/static/**` contains all images, CSS, and JS used by the pages.
- `before_version/**` is kept only as a visual/behavioral reference and is not used by the app.

## License
MIT License - Copyright (c) 2026 Kota Kawagoe

---

<details>
<summary>日本語</summary>

## 概要
Ikutoku-sai の Web サイトを Next.js（App Router）で実装したものです。静的アセットは `public/static` にまとめています。

## 技術構成
- Next.js 14（App Router）
- React 18
- TypeScript
- Node.js 20+

## 起動手順
```bash
npm install
npm run dev
```
`http://localhost:3000` を開いてください。

## スクリプト
- `npm run dev` - 開発サーバ起動
- `npm run build` - 本番ビルド
- `npm run start` - 本番起動
- `npm run lint` - ESLint 実行
- `npm test` - スモークテスト実行

## 環境変数
`.env` を作成して以下を設定してください。
```
ADMIN_PASSWORD=your_admin_password
SECRET_KEY=your_secret_key
```

## ルート
メインサイト:
- `/`
- `/about`
- `/announce`
- `/event`

単独ページ:
- `/map`
- `/bus_stop`
- `/parking_bycycle`
- `/parking_car`
- `/login`
- `/bingo`
- `/eeeeee`（プレースホルダー）

API:
- `POST /login_submit` - 認証してセッションクッキーを設定

## 備考
- 画像/CSS/JS は `public/static/**` に集約しています。
- `before_version/**` は比較用の参照ディレクトリで、アプリからは使用していません。

## ライセンス
MIT License - Copyright (c) 2026 Kota Kawagoe

</details>
