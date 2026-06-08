# OSS Culture Festival Site Template

> 🎉 **これは、誰でも自由に使える・自由に変更できる、オープンソース（MIT License）の文化祭サイトです。**
> 学校祭・文化祭・学園祭の公式サイトを、すぐに公開できる形でまるごと用意しています。

**An open-source (MIT-licensed) website template for school / culture / university festivals.**
Anyone is free to use it, fork it, modify it, and publish it as their own festival's official site — no permission needed.

このリポジトリには、トップページ・概要・アクセス・企画紹介・地図・運営用ビンゴページなど、文化祭サイトに必要な画面が一式そろっています。`git clone` すればそのまま動くサンプルサイトが立ち上がるので、文字や画像、地図、企画データを自分たちの文化祭に合わせて置き換えるだけで公開できます。

What you can do with this project:

- ✅ **Use it freely** — run it as-is or as the base for your own festival site
- ✅ **Fork & modify** — change the design, text, pages, and data however you like
- ✅ **Redistribute** — share your own version, even commercially (MIT License)
- ✅ **No sign-up, no license fee, no attribution gymnastics** — just keep the MIT notice

The current Ikutoku-sai / 宇宙祭 website is included as the first working sample. Replace the festival config, images, map data, and event data to adapt this template for your own festival. Static assets live under `public/static`, and the app routes are built with the App Router in `src/app`.

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

## Customize for Your Festival
This is an OSS starter template for culture festival websites. Anyone can fork it
or use it as a template, keep the included sample running, and gradually replace
the data for their own school festival.

The current Ikutoku-sai sample implementation is the default example. To reuse it
for another festival, start by editing:

```
src/config/festival.ts
```

The most common replacements are collected there:

```ts
export const festivalConfig = {
  festivalName: "宇宙祭",
  festivalTitle: "第100回 宇宙祭のサイト",
  siteDescription: "宇宙祭の公式ウェブサイトです。",
  organizerName: "月の裏側実行委員会",
  venueName: "月の裏側",
  venueAddress: "〒111-1111 月の裏側",
  schoolShortName: "KAIT",
  googleAnalyticsId: "G-4TPL68169Q",
  footerYear: "2100",
  footerExternalLink: {
    label: "月の開発を考えている方へ",
    href: "https://op.kait.jp/top/admission/",
  },
  sponsorsTitle: "月への貢献",
} as const;
```

For example, to make a site for `〇〇祭`, change it like this:

```ts
festivalName: "〇〇祭",
festivalTitle: "第42回 〇〇祭のサイト",
siteDescription: "〇〇祭の公式ウェブサイトです。",
organizerName: "〇〇祭実行委員会",
venueName: "〇〇大学",
venueAddress: "〒000-0000 〇〇県〇〇市〇〇 1-2-3",
schoolShortName: "〇〇大",
googleAnalyticsId: "",
footerYear: "2026",
footerExternalLink: {
  label: "〇〇大学について",
  href: "https://example.com/",
},
sponsorsTitle: "ご協賛",
```

After changing the config, check these pages:

- `/` - browser title, overview address, greeting link text
- `/about` - festival name, venue name, organizer heading
- `/announce` - access page title, venue name, address, bus route labels
- `/event` - page title and map iframe label
- `/map` - map page description metadata
- Common header/footer - logo text, copyright, footer link, sponsors heading

### Google Analytics
If you do not use Google Analytics, set:

```ts
googleAnalyticsId: "",
```

When this value is empty, the GA script is not rendered. If you use GA, put your
own measurement ID here instead of the sample `G-4TPL68169Q`.

### What Still Uses the Sample Data
The current sample pages, images, map pins, event cards, routes, and bingo page
are intentionally left in place so the site works immediately after cloning.
After the basic config is changed, replace these files as needed:

- Images and icons: `public/static/**`
- Top page images: `public/static/top_page/**`
- Sponsor logos: `public/static/AD/**`
- Map spot images: `public/static/map/**`
- Event cards and timetable: `src/app/(site)/event/EventClient.tsx`
- Map pins and event pin data: `src/app/(standalone)/map/MapClient.tsx`
- Bus stop, parking, and bicycle parking maps:
  `src/app/(standalone)/bus_stop`,
  `src/app/(standalone)/parking_car`,
  `src/app/(standalone)/parking_bycycle`

- `schoolShortName` is used by sample map labels such as `KAITアリーナ`,
  `KAIT工房`, and `KAIT広場`.
- File names such as `kait_landscape.webp` and `KAITアリーナ.webp` are sample
  asset names. They can stay while prototyping, then be renamed or replaced when
  you update the corresponding code references.

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
**これは、誰でも自由に使えて、自由に変更できる、オープンソース（MIT License）の文化祭サイトです。**
学校祭・文化祭・学園祭の公式サイトに必要なトップページ、概要、アクセス、企画紹介、地図、運営用ビンゴページを、Next.js（App Router）で実装しています。

このプロジェクトでできること:

- ✅ **自由に使う** — そのまま、または自分たちの文化祭サイトのベースとして利用できます
- ✅ **自由に変更する** — デザイン・文章・ページ・データを好きなように作り変えられます
- ✅ **再配布する** — 改変版を公開してもOK（MIT License。商用利用も可能）
- ✅ **申請・利用料・面倒な手続きは不要** — MIT のライセンス表記だけ残せば自由に使えます

現在の Ikutoku-sai / 宇宙祭 の内容は、clone直後に動く最初のサンプルとして残しています。`src/config/festival.ts` や画像・地図・企画データを置き換えることで、自分たちの文化祭サイトとして使えます。静的アセットは `public/static` にまとめています。

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

## 自分の文化祭向けに置き換える
このリポジトリは、特定の学校だけでなく、どの文化祭でも使えるOSSテンプレートとして育てることを前提にしています。
現在の実装は、最初のサンプルとして Ikutoku-sai / 宇宙祭 の内容を残しています。
別の文化祭サイトとして使う場合は、まず次のファイルだけを編集してください。

```
src/config/festival.ts
```

よく置き換える固有情報はここに集約しています。

```ts
export const festivalConfig = {
  festivalName: "宇宙祭",
  festivalTitle: "第100回 宇宙祭のサイト",
  siteDescription: "宇宙祭の公式ウェブサイトです。",
  organizerName: "月の裏側実行委員会",
  venueName: "月の裏側",
  venueAddress: "〒111-1111 月の裏側",
  schoolShortName: "KAIT",
  googleAnalyticsId: "G-4TPL68169Q",
  footerYear: "2100",
  footerExternalLink: {
    label: "月の開発を考えている方へ",
    href: "https://op.kait.jp/top/admission/",
  },
  sponsorsTitle: "月への貢献",
} as const;
```

たとえば `〇〇祭` にする場合は、次のように変更します。

```ts
festivalName: "〇〇祭",
festivalTitle: "第42回 〇〇祭のサイト",
siteDescription: "〇〇祭の公式ウェブサイトです。",
organizerName: "〇〇祭実行委員会",
venueName: "〇〇大学",
venueAddress: "〒000-0000 〇〇県〇〇市〇〇 1-2-3",
schoolShortName: "〇〇大",
googleAnalyticsId: "",
footerYear: "2026",
footerExternalLink: {
  label: "〇〇大学について",
  href: "https://example.com/",
},
sponsorsTitle: "ご協賛",
```

変更後は、以下を確認してください。

- `/` - ブラウザタイトル、開催概要の住所、ご挨拶リンクの文言
- `/about` - 祭名、会場名、実行委員会名
- `/announce` - ページタイトル、会場名、住所、バス経路の表示
- `/event` - ページタイトル、会場マップ iframe のラベル
- `/map` - 地図ページの説明メタ情報
- 共通ヘッダー/フッター - ロゴ横のサイト名、著作権表示、外部リンク、協賛見出し

### Google Analytics を使わない場合
Google Analytics を使わない場合は、次のように空文字にしてください。

```ts
googleAnalyticsId: "",
```

空文字にすると GA の script は出力されません。使う場合は、サンプルの
`G-4TPL68169Q` を自分の測定 ID に置き換えてください。

### サンプルとして残っているもの
ページ構成、画像、地図ピン、企画カード、ビンゴページなどは、clone 直後に
動くサンプルとして現在の内容を残しています。基本設定を変更したあと、必要に
応じて次を差し替えてください。

- 画像とアイコン: `public/static/**`
- トップページ画像: `public/static/top_page/**`
- 協賛ロゴ: `public/static/AD/**`
- 地図スポット画像: `public/static/map/**`
- 企画カードとタイムテーブル: `src/app/(site)/event/EventClient.tsx`
- 地図ピンとイベントピン: `src/app/(standalone)/map/MapClient.tsx`
- バス停、駐車場、駐輪場マップ:
  `src/app/(standalone)/bus_stop`,
  `src/app/(standalone)/parking_car`,
  `src/app/(standalone)/parking_bycycle`

`schoolShortName` は、地図上の `KAITアリーナ`、`KAIT工房`、`KAIT広場` のような
サンプル施設名に反映されます。

`kait_landscape.webp` や `KAITアリーナ.webp` のような画像ファイル名は、サンプル
資産名として残しています。プロトタイプ中はそのままでも動きます。本番向けには
画像を差し替え、対応するコード上の参照も合わせて変更してください。

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
