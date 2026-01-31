# Project Specifications & Guidelines

## 全体ルール (General Rules)
- フロントエンド/バックエンドは TypeScript に統一する
- アプリ基盤は Next.js（App Router）を採用し、UI と API を同一コードベースで運用する
- 現行 Flask 実装の画面/文言/動線/アニメーション/挙動/URL を完全に踏襲する
- 現在のデザインは一切変更しない（HTML/CSS/画像/アニメーションはピクセル単位で一致）
- ローカル実行は `docker compose` を唯一の入口にする
- 外部 CDN 依存（Bootstrap/AOS/Leaflet 等）は現状の読み込み元/バージョンを維持する

## 機能要件 (Functional Requirements)

### ルーティング/ページ
- `GET /`  
  - `layout` 相当のヘッダー/フッターを含むトップページ
  - `static/css/loader.css` と `static/js/loader.js` を読み込み
  - `#preloader` に `static/loader.html` を iframe で表示（最短 1.5 秒表示）
  - Hero 画像、鳥画像、開催概要、各導線、問い合わせセクションを現状のまま保持
  - `canonical` の挿入 (`/` の正規化 URL)
- `GET /about`  
  - Hero 背景 `static/KAIT_KB_ils.webp`
  - 「概要」「ご挨拶」「宇宙祭実行委員会から」の各セクションを保持
  - `VanillaTilt` によるカード効果を維持
- `GET /announce`  
  - Hero 背景 `static/SENSHIN_ils.webp`
  - ご来場注意事項/アクセス案内/Google Map 埋め込みを維持
  - `iframe` による `/bus_stop` `/parking_car` `/parking_bycycle` の埋め込みと外部リンクを維持
  - お問い合わせリンク（Google Forms）を維持
- `GET /event`  
  - Hero 背景 `static/K2_ils.webp`
  - 会場マップ iframe (`/map`) を維持
  - 施設一覧ボタンから `iframe.contentWindow.spots` を参照して `map.panTo()` + `marker.fire('click')` を行う挙動を維持
  - タイムテーブル、企画カテゴリのカード一覧を現行文言のまま保持
- `GET /map`  
  - **layout を使用しない** 単独 HTML（全画面表示）を維持
  - Leaflet によるマップ描画、建物マーカー、詳細パネル、フォーカス挙動を維持
  - `eventData` を `spots` にマージし、メニューバーでカテゴリ毎にイベントピンを描画
  - ユーザー位置（Geolocation）とコンパス（DeviceOrientation / AbsoluteOrientationSensor）を維持
  - `window.spots` と `window.map` を外部参照用に公開
  - エリア境界ポリゴン描画を維持
- `GET /bus_stop`  
  - バス停マップ（Leaflet）を維持
  - ユーザー位置の青丸表示、詳細パネル、戻るボタンを維持
- `GET /parking_car`  
  - 駐車場マップ（Leaflet）を維持
  - 複数駐車場ピン、詳細パネル、戻るボタンを維持
- `GET /parking_bycycle`  
  - 駐輪場マップ（Leaflet）を維持
  - 単一ピン、詳細パネル、戻るボタンを維持
- `GET /login`  
  - 既にログイン済みなら `/bingo` にリダイレクト
  - パスワード入力フォームとエラーメッセージ表示を維持
- `POST /login_submit`  
  - `ADMIN_PASSWORD` と照合し、成功時はセッションを付与して `/bingo` にリダイレクト
  - 失敗時はエラーメッセージ「パスワードが違います」を表示して `/login` に戻す
- `GET /bingo`  
  - 未ログインの場合 `/login` にリダイレクト
  - localStorage を用いた呼び出し番号の追加/削除/Undo/全クリアを維持
- `GET /eeeeee`  
  - `coming_soon.html` を表示（既存の見た目/文言を維持）
- `templates/kyousan.html` と `templates/Walk__Object_Service.html` は現状ルーティング無し
  - ルーティング追加は行わない（別途要望があれば対応）

### 共有レイアウト要件
- 固定ヘッダー（ロゴ pill + メニュー pill + モバイルハンバーガー）を維持
- バブルアニメーション（`.bubbles`）を維持
- フッターのスポンサー表示/外部リンクを維持
- `meta robots noindex` と favicon/Apple Touch Icon を維持
- Google Analytics (G-4TPL68169Q) を維持
- AOS の初期化設定（`once: true, offset: 120, duration: 700`）を維持

### 静的アセット/パス要件
- 既存のパス（`/static/...` と `./static/...`）が全て解決されること
- `static/` 配下の画像/JS/CSS/HTML をそのまま配置すること
- Next.js `public/static` 配下に **同名で** 配置し、URL を変えないこと

### 外部ライブラリ/依存
- Bootstrap 5.3.0（layout）
- Bootstrap 5.3.2（map系ページ）
- Bootstrap Icons 1.10.5（map系ページ）
- AOS 2.3.4
- Leaflet 1.7.1
- Google Fonts: Noto Sans JP, Poppins
- VanillaTilt 1.7.3
- Google Maps 埋め込み URL を維持

### 環境変数/設定
- `SECRET_KEY` をセッション署名に使用する
- `ADMIN_PASSWORD` を管理者ログインに使用する
- `.env` 読み込み相当の仕組みを用意する
- フロントエンド/バックエンドは TypeScript に統一する
- アプリ基盤は Next.js を採用し、UI と API を同一コードベースで運用する
- ルーティングは Next.js App Router を前提とする
- ローカル実行は `docker compose` を唯一の入口にする
- Node.js は LTS 系を前提にする（詳細バージョンは別途決定）

## コーディング規約 (Coding Conventions)
- TypeScript は `strict` を有効化する
- `any` は原則禁止（やむを得ない場合は理由をコメントで明示）
- 非同期処理は `async/await` を基本とする
- ESLint / Prettier を導入し、CI で自動チェック可能にする
- TypeScript は `strict` を有効にし、境界(入出力/外部I/O)で型を明示する
- `any` は原則禁止（やむを得ない場合は理由をコメントに残す）
- 非同期処理は `async/await` を基本とする
- ESLint と Prettier を導入し、CI で自動チェック可能にする

## 命名規則 (Naming Conventions)
- React コンポーネントは `PascalCase`
- hooks は `useXxx` 形式
- 型/インターフェースは `Xxx` で統一（`I` 接頭辞は使わない）
- ファイル/ディレクトリは `kebab-case`
- React コンポーネントは `PascalCase`
- hooks は `useXxx` 形式
- 型/インターフェースは `Xxx` で統一（接頭辞の `I` は使わない）
- ファイル/ディレクトリは `kebab-case`
## ディレクトリ構成方針 (Directory Structure Policy)
- `src/app` にページとレイアウトを配置する（App Router）
- `src/app/api` に API Routes を配置する
- `src/components` に再利用 UI を配置する
- `src/lib` に共通ロジック、`src/server` にサーバー専用ロジックを配置する
- `src/types` に型定義、`src/styles` にスタイル関連を配置する
- `public/static` 配下に現行 `static` を移植し、**URL 互換を維持**する
- `src/app` にページとレイアウトを配置する
- `src/app/api` にバックエンド(API Routes)を配置する
- `src/components` に再利用 UI を配置する
- `src/lib` に共通ロジック、`src/server` にサーバー専用ロジックを配置する
- `src/types` に型定義、`src/styles` にスタイル関連を配置する

## エラーハンドリング方針 (Error Handling Policy)
- API は JSON で統一したエラーフォーマットを返す
- 例外は握りつぶさず、適切な HTTP ステータスに変換する
- ログはサーバー側に集約し、ユーザーには必要最小限の情報のみ返す
- ログイン失敗時の文言は現行と完全一致させる
- API は JSON で統一したエラーフォーマットを返す
- 例外は握りつぶさず、適切な HTTP ステータスに変換する
- ログはサーバー側に集約し、ユーザーには必要最小限の情報のみ返す

## テスト方針 (Testing Policy)
- 重要なユーティリティ/サーバーロジックはユニットテストを用意する
- 主要 UI はコンポーネントテストを用意する
- 重要なユーザーフローは E2E テストを用意する
- ルーティング/リダイレクト/認証/地図 iframe 連携は最低限のスモークテストを用意する
- 重要なユーティリティ/サーバーロジックはユニットテストを用意する
- 主要 UI はコンポーネントテストを用意する
- 重要なユーザーフローは E2E テストを用意する
