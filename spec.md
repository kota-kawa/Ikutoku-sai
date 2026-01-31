# Project Specifications & Guidelines

## 全体ルール (General Rules)
- before_version を唯一の正として、**見た目・動作を完全一致**させる。文言/数値/色/余白/アニメーション/遷移/リンク先/画像/順序/DOM構造を改変しない。
- `before_version/**` は参照専用。**変更も削除もしない**。
- 同名の class/id/属性/DOM 階層は挙動依存があるため**原則そのまま**。必要がある場合のみ、同等の構造・イベント伝播を維持する。
- ルーティングは before_version の Flask 実装と同一にする（末尾スラッシュ無し）。
- `/map`・`/bus_stop`・`/parking_car`・`/parking_bycycle`・`/login`・`/bingo`・`/eeeeee` は **standalone** であり、共通ヘッダー/フッター/バブル演出を表示しない。
- `/` `/about` `/announce` `/event` は **共通レイアウト適用**（ヘッダー/フッター/バブル/AOS/Bootstrap/GA）を必須とする。
- 画像・CSS・JS は **/public/static/…** に配置し、参照パスは **`/static/...`** を維持する（相対パス化しない）。
- **日本語文言・句読点・全角/半角の揺れも含めて完全一致**（例: 2100年、11月2日等の表記ゆらぎも維持）。
- レスポンシブのブレークポイントと挙動を一致させる（max-width 992/768/576、横長小画面の特例など）。

## 機能要件 (Functional Requirements)

### ルーティング/ページ
- `/` : トップページ（index）
- `/about` : ご挨拶・概要
- `/announce` : ご案内・アクセス
- `/event` : 企画紹介
- `/map` : 統合マップ（Leaflet）
- `/bus_stop` : バス停マップ
- `/parking_car` : 駐車場マップ
- `/parking_bycycle` : 駐輪場マップ
- `/login` : 管理者ログイン
- `/login_submit` : POST 認証
- `/bingo` : ビンゴ運営ページ（要ログイン）
- `/eeeeee` : Coming Soon
- **非対象**: `Walk__Object_Service.html` / `kyousan.html` はルートが無いため非公開（将来の追加は別タスク）。

### 共有レイアウト要件（/ /about /announce /event）
**Head/Meta**
- `<html lang="ja">`
- `<meta charset="utf-8">` / `<meta name="viewport" content="width=device-width, initial-scale=1">`
- `<meta name="robots" content="noindex">`
- `<title>` はページごとに上書き（デフォルトは「お祭り」）
- Favicon:
  - `/static/favicon.ico` (icon + shortcut)
  - `/static/favicon.png` (png)
  - `/static/apple-touch-icon.png` (apple-touch-icon 180x180)
- Google Analytics: `G-4TPL68169Q` を `gtag` で初期化
- 外部CSS:
  - Bootstrap 5.3.0 CSS
  - Noto Sans JP (400,700)
  - AOS 2.3.4 CSS

**共通スタイル**
- `html, body { scroll-behavior: smooth; overflow-x: hidden; margin:0; padding:0; }`
- `:root` 変数:
  - `--kait-green: #32CD32` / `--kait-purple: #8A2BE2`
  - `--dark-overlay: rgba(0,0,0,0.6)`
  - `--pill-border: #e8eff2`
  - `--menu-bg: rgba(142,185,195,0.9)`
- `body`:
  - `font-family: 'Noto Sans JP', sans-serif;`
  - `background: linear-gradient(120deg, #f8f9fa 0%, #eef2f7 50%, #e3e8f0 100%);`
  - `color: #343a40; overflow-x: hidden;`

**ヘッダー（カスタムピル）**
- `.custom-header` 固定配置（top:2%、中央寄せ、z-index:1000）
- ロゴピル:
  - 画像 `/static/favicon.png` サイズ 2rem
  - テキスト「宇宙祭」
- メニュー:
  - デスクトップ: `.menu-pill` (線形グラデ + pill) 内にリンク4つ
  - リンク順: `/about`「ご挨拶」, `/announce`「アクセス」, `/event`「企画一覧」, `/map`「MAP」
- モバイル（max-width 992px）:
  - `.menu-pill` 非表示、`.burger` 表示
  - `.burger` クリックで `active` クラス付与
  - `.mobile-menu` に `open` クラスで表示
  - `document` クリックで外部タップ時に閉じる

**バブル演出**
- `.bubbles` を `position: fixed;` で全画面覆う
- JS で 30 個生成
  - サイズ: 10〜30px
  - left: 0〜100%
  - duration: 6〜12秒
  - delay: 0〜5秒

**フッター**
- 背景 `#212529` / 文字 `#adb5bd` / padding `1rem 0`
- 文言: `© 2100 月の裏側実行委員会 | ビンゴ(運営用) | 月の開発を考えている方へ |`（末尾の区切りも維持）
- ビンゴリンク: `/bingo`
- 外部リンク: `https://op.kait.jp/top/admission/`（新規タブ）
- 協賛セクション:
  - 見出し: `月への貢献`、色 `#387fc5`、font-size 2.5rem
  - ロゴ 6枚（`/static/AD/ad1.webp`〜`ad6.webp`）
  - 3カラム（33.333% - gap）/ 高さ180px
  - モバイル(<=576): 1カラム、画像幅80%

**共通JS**
- Bootstrap 5.3.0 bundle JS
- AOS 2.3.4 JS → `AOS.init({ once: true, offset: 120, duration: 700 })`

### 静的アセット/パス要件
- `before_version/static` の内容を **全て** `/public/static` に複製
- **パスは完全一致**（例: `/static/top_page/access.webp`）
- `map/big/*` を含む全ファイルを保持（未使用でも欠損させない）

### 外部ライブラリ/依存
- Bootstrap 5.3.0 (CSS/JS)
- Bootstrap Icons 1.10.5（announce/event/map/bus/parking）
- AOS 2.3.4
- Leaflet 1.7.1
- Google Fonts: Noto Sans JP / Poppins (coming soon)
- Google Analytics (gtag) ID: `G-4TPL68169Q`

### 環境変数/設定
- `SECRET_KEY`: セッション署名用（未設定時は開発用デフォルト可）
- `ADMIN_PASSWORD`: 管理者パスワード
- 認証:
  - `/login` でログイン済みなら `/bingo` へリダイレクト
  - `/bingo` は未ログイン時 `/login` へ
  - `/login_submit` は POST のみ（GET は 405）
  - 成功時: セッション有効化（長期、目安 30日）
  - 失敗時: `/login` に戻りエラー表示

### ページ仕様（詳細）

#### `/` (トップ)
- `<title>`: `第100回 宇宙祭のサイト`
- `canonical` を `/` に設定
- **プリローダー**
  - `#preloader` に `iframe` で `/static/loader.html` を表示
  - `iframe` は `loading="eager"` を指定
  - `loader.css` と `loader.js` を読み込み
  - `loader.js` は **最低 1.5秒** 表示後に `#preloader.hide` を付与
  - `loader.css` で `#preloader` は黒背景・全画面固定
- **Hero**
  - 高さ 90vh
  - 背景: `/static/kait_landscape.webp`（hoverで scale 1.05）
  - 左右の鳥画像: `/static/kait1.webp`, `/static/kait2.webp`
  - 中央トップ画像: `/static/top.webp` （最大幅 600px）
- **開催概要**
  - 日程: `2100年12月1日（土）〜12月2日（日）`
  - 時間: `各日 10:00 〜 17:00`
  - 住所: `〒111-1111 月の裏側`
  - テーマ: `「餅つき」`
- **Feature Modules**
  - アクセス: 画像 `/static/top_page/access.webp` → `/announce`
  - ステージ&模擬店: `/static/top_page/mogiten.webp` → `/event`
  - ご挨拶: `/static/top_page/welcome.webp` → `/about`
- **お問い合わせ**
  - ボタン: `/`、テキスト「お問い合わせはこちら »」
  - スマホ(<=768)ボタン幅70%、PC(>=769)45%
- **ページ専用CSS**
  - `body` は `-apple-system` 系フォントで上書き
  - `.module` + `.reverse` の並び替え（<=768で解除）
  - `img-col` は `aspect-ratio: 9 / 6; object-fit: cover;`
- **AOS**
  - Hero 内 `data-aos="zoom-in" data-aos-duration="1000"`
  - `overview`/`module`/`contact` は `data-aos="fade-up"`

#### `/about`
- `<title>`: `宇宙祭 | 概要`
- Hero 背景: `/static/KAIT_KB_ils.webp`
- セクション順: 「概要」→「ご挨拶」→「宇宙祭実行委員会から」
- **概要本文**（gradient-text--purple、文字太字、左寄せ）
  - `宇宙祭とは、月の裏側で行われる学園祭の名称です。宇宙祭では毎年、多数のイベントを行っています。学内は様々な模擬...す。またステージイベント・スタンプラリー・ビンゴが行われます。宇宙祭は、本学生や地域の方々との交流の場としても親しまれています。`
- **ご挨拶カード**（5件、順序維持）
  1) `月の裏側 学長　アーモ・カーモ` / `第100回の宇宙祭の開催おめでとうございます。今年の宇宙祭は ... 宇宙使途たちの活躍とともに、その姿をご覧いただければ幸いです。`
  2) `月の裏側 学生部長　サーダ・コーダ` / `皆様、月の裏側の宇宙祭へ、ようこそ ... 宇宙祭として羽ばたいていくことを願っています。`
  3) `月の裏側執行部 会長　イーダ・ニーダ` / `本日は、第100回宇宙祭にお越しいただきありがとうございます。 ... 良い思い出になることを祈念いたします。`
  4) `月の裏側イベント局 局長　サーコ・キーコ` / `本日は第100回宇宙祭にお越しいただきありがとうございます。 ... 感謝とお礼を申し上げます。`
  5) `Web開発　川越　航太` / `宇宙祭のサイトを見に来てくれてありがとうございます。このサイトのデザインや使いやすさは、日本の学園祭のサイトの中でトップだと自負していますが、いかかでしょうか？特に、MAPは他の宇宙祭にはない試みです。`
- **テーマ本文**
  - `歴史を受け継ぎ、新たな歴史を創る」というテーマのもと、私たちは100周年を迎えました。「継承」という言葉には、過去の経験を大切にしながら、未来を切り拓く思いが込められています。`
- CSS のグラデーション定義・色（`#ff11003` を含む）も含めて一致させる
- **AOS**
  - Hero: `data-aos="fade-down"`
  - 各 `apple-section`: `data-aos="fade-up"`
  - `greeting-item` は `data-aos-delay` を `loop.index * 60` で付与

#### `/announce`
- `<title>`: `宇宙祭 | ご案内・アクセス`
- Hero 背景: `/static/SENSHIN_ils.webp`（fixed + zoom）
- 「ご来場の方へ」リスト文言を完全一致
- Google Map 埋め込み URL を完全一致
- キャンパス所在地: `月の裏側 / 〒111-1111 月の裏側`
- 電車アクセス SVG（animateMotion・駅名表示）
- バスアクセス:
  - 2つのルート文言
  - 時刻表リンク: `https://www.kait.jp/about/bus_timetable.pdf`
  - バス用 SVG（右→左）
  - `/bus_stop` iframe + 「全画面でマップを表示」
- お車:
  - 注意文言（`！！` 含む）
  - `/parking_car` iframe + ボタン
- 自転車:
  - `/parking_bycycle` iframe + ボタン
- お問い合わせボタン: `https://forms.gle/hDtaJVNBFxGamAJ4A`
- **map-container--small**: `padding-top: 35%`、`@media (max-width:576px)` で `56.25%` に戻す
- **AOS**
  - Hero: `data-aos="fade-down"`
  - セクション各所: `data-aos="fade-up"` / `data-aos-delay="100"` などを一致

#### `/event`
- `<title>`: `宇宙祭 | 企画紹介`
- Hero 背景: `/static/K2_ils.webp`（scroll、fixed しない）
- 会場マップ iframe: `/map`（width 90%, max 1400, height 600）
- 施設一覧ボタン（16件）
  - `data-facility` 値と表示ラベルを完全一致
- タイムテーブル表（時間/ステージ/ビンゴ/展示）
- 企画一覧:
  - ナビ: ビンゴ/ステージ/縁日/模擬店/研究室公開/講義室展示
  - 各カードのタイトル/ハッシュタグ/本文/場所
  - カード画像: `/static/sunset.webp`
- **JS 連携**
  - iframe load 後、`spots` から該当施設を探し `map.panTo` + `marker.fire('click')`

#### `/map`
- **Standalone**: ヘッダー/フッターなし、全画面 Leaflet
- Head/Meta（map.html と同等）:
  - `<meta charset="UTF-8">` / `<meta name="viewport" content="width=device-width, initial-scale=1">`
  - favicon: `./static/favicon.ico`, `./static/favicon.png`
  - `preconnect`/`dns-prefetch` to `https://server.arcgisonline.com`
  - `preload` image: `./static/map/K1号館.webp`, `./static/map/K2号館.webp`
  - Leaflet/Bootstrap CSS は `media="print" onload="this.media='all'"` で遅延読込
- 初期位置: `center [35.486417749642015, 139.3428098153942]`, zoom 18 (min 5 / max 19)
- タイル: `https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg`
- カスタムマーカー + `map_icons.css` を使用
- **spots 配列**（座標/名称/画像）を完全一致（18件）
- **詳細パネル**
  - 左からスライド / mobile で全幅
  - 閉じるボタン + オーバーレイで閉じる
- **フォーカス**
  - `focused` クラスでサイズ/矢印変更
- **誤タップ防止**
  - `cancelNextMarkerClick` / `isNearAnyMarker` を使用
- **メニューバー**
  - 下部固定、横スクロール
  - ボタン: `全体 / 研究室 / グルメ / サークル / 演奏・劇`
  - 初回ロードで「研究室→全体」を擬似クリック（500ms 後）
- **イベントピン**
  - `/static/js/eventsData.js` + `/static/js/events.js`
  - カテゴリ: `gourmet / lab / circle / performance`
  - ピン画像: `/static/sunset.webp`
  - カテゴリごとの色（map_icons.css の class）
  - RADIUS_CONFIG: K1(min8,max15) / K2(min10,max30) / K3(min5,max25)
  - 初回クリックは同じ処理を2回実行（events.js の初回フラグ）
  - Leaflet `DomUtil.remove` と `Marker._removeIcon` に安全パッチを当てる
  - イベントデータ（eventsData.js）:
    - gourmet:
      - カフェAlpha（焙煎珈琲とケーキのお店 / K1号館 1F 大ホール横 / 046-123-4567）
      - パン屋Beta（焼きたてパン各種 / K1号館 正面入口前 / 046-987-6543）
      - ラーメンGamma（あっさり醤油ラーメン / K2号館 東側 / 046-555-1212）
      - 和菓子屋Delta（季節の和菓子と抹茶セット / K1号館 2F ロビー横 / 046-111-0001）
      - アイスEpsilon（手作りアイスクリーム各種 / K1号館 1F 中央ホール / 046-111-0002）
      - 居酒屋Zeta（地元食材を使ったおつまみ / K1号館 3F イベントホール入口 / 046-111-0003）
      - カレーEta（スパイシーチキンカレー / K1号館 B1F フードコート / 046-111-0004）
      - 寿司Theta（新鮮な地魚を使った寿司 / K1号館 4F テラス / 046-111-0005）
    - lab:
      - AI研究室見学（最先端AI技術の展示 / K1号館 1F 情報棟 / 046-222-0001）
      - ロボ研公開（自律移動ロボットのデモ / K2号館 2F 実験室 / 046-222-0002）
    - circle:
      - バスケ部トライアウト（初心者歓迎！ / K3号館 体育館 / 046-333-0001）
      - 吹奏楽部演奏会（クラシック&ポップス演奏 / K4号館 ロビー / 046-333-0002）
    - performance:
      - 演劇部公演『青春劇場』（若き日の物語を演じます / KAITアリーナ メインステージ / 046-444-0001）
      - 軽音楽部ライブ（バンド演奏ライブ / 広場 ステージ / 046-444-0002）
- **コンパス許可モーダル**
  - 初回にモーダル表示、許可で `DeviceOrientation` / `AbsoluteOrientationSensor` を使用
- **ユーザー位置**
  - Geolocation watchPosition
  - 青丸 + 方向ウエッジ（コンパス有効時）
- **戻るボタン**
  - `#back-btn` で `/` に戻る、装飾・hover を一致
- **エリア境界**
  - `areaCoords` のポリゴン + `.my-area-boundary` スタイル

#### `/bus_stop`
- Standalone フルスクリーン地図
 - Head/Meta: charset/viewport、favicon `./static/favicon.ico`、preconnect/dns-prefetch、Leaflet/Bootstrap CSS 遅延読込
- 初期位置: `[35.440597935921396,139.36547942874043]`, zoom 16
- spots: 
  - `厚木バスセンター` / `[35.441361570995085,139.36637359539466]`
  - `本厚木駅 北口バス停 ` / `[35.44012517248984,139.36459832308577]`
- 詳細パネル/フォーカス/誤タップ防止/戻るボタン/ユーザー位置（青丸のみ）
 - `@media (orientation: landscape) and (max-height:500px)` で詳細パネル幅 70% に変更

#### `/parking_car`
- Standalone フルスクリーン地図
 - Head/Meta: charset/viewport、favicon `./static/favicon.ico`、preconnect/dns-prefetch、Leaflet/Bootstrap CSS 遅延読込
- 初期位置: `[35.486165310060194,139.34302919958378]`, zoom 16
- spots:
  - 第5駐車場 / `[35.48402482516073,139.3441465845487]`
  - 第4駐車場 / `[35.487879545085335,139.3449945710562]`
  - 第3駐車場 / `[35.48467343169672,139.34452250228026]`
  - 第2駐車場 / `[35.484507444099464,139.3439967893472]`
  - 第1駐車場 / `[35.48515392000944,139.3444474004515]`
  - 専用駐車場 / `[35.48829012798111,139.34496238457064]`
  - タイムズ厚木下荻野 / `[35.48761839674466,139.34031035571286]`
- 詳細パネル/フォーカス/誤タップ防止/戻るボタン/ユーザー位置（青丸のみ）
 - `@media (orientation: landscape) and (max-height:500px)` で詳細パネル幅 70% に変更

#### `/parking_bycycle`
- Standalone フルスクリーン地図
 - Head/Meta: charset/viewport、favicon `./static/favicon.ico`、preconnect/dns-prefetch、Leaflet/Bootstrap CSS 遅延読込
- 初期位置: `[35.48543078370346,139.342897008065]`, zoom 18
- spots: `駐輪場` / `[35.48543078370346,139.342897008065]`
- 詳細パネル/フォーカス/誤タップ防止/戻るボタン/ユーザー位置（青丸のみ）
 - `@media (orientation: landscape) and (max-height:500px)` で詳細パネル幅 70% に変更

#### `/login`
- Standalone
- 背景グラデーションアニメーション + 浮遊サークル
- ガラスモルフィズムのログインボックス
- フォーム: `POST /login_submit`、`password` フィールド、`required`、`autofocus`
- エラー時: 「パスワードが違います」表示
- ボタン ripple エフェクト

#### `/bingo`
- Standalone
- LocalStorage key: `bingoCalled`
- UI: 5列（B/I/N/G/O）、各列 3xN グリッド
- 追加: 1〜75 の数字のみ、重複不可
- タイルクリックで削除確認ダイアログ
- Undo: 最後の数字を取り消し確認 + alert
- 全クリア: confirm の後に削除
- Enter キーで追加

#### `/eeeeee`
- Standalone（Coming Soon）
- フォント: Poppins
- 背景: 135deg グラデ `#667eea → #764ba2`
- `COMING SOON` + サブメッセージ（pulse アニメ）

## コーディング規約 (Coding Conventions)
- TS + Next.js App Router を前提（既存構成を維持）
- DOM 操作/外部スクリプトが必要な箇所は `"use client"` で実装
- inline CSS/JS は **before_version と同内容**（`dangerouslySetInnerHTML` 許容）
- 既存 class/id 名は変更しない（CSS/JS 依存）

## 命名規則 (Naming Conventions)
- ID は before_version を厳守: `burgerBtn`, `mobileMenu`, `preloader`, `details-panel`, `back-btn` など
- class 名は同一を維持: `custom-header`, `menu-pill`, `bubble`, `module`, `category-section` など

## ディレクトリ構成方針 (Directory Structure Policy)
- `/public/static/**` に before_version の静的アセットをミラー
- `/src/app/(site)/**` に共通レイアウトページ
- `/src/app/(standalone)/**` に standalone ページ
- `/before_version/**` は参照のみで変更しない

## エラーハンドリング方針 (Error Handling Policy)
- 外部スクリプト読み込み失敗は UI を壊さない（try/catch）
- Geolocation/Compass の失敗は console warn（致命的エラーにしない）
- `/login_submit` の GET は 405 を返す

## テスト方針 (Testing Policy)
- 目視一致検証（before_version との比較）
- 各ページで以下を確認:
  - レスポンシブ（992/768/576/横長小画面）
  - ヘッダー/フッター/バブル/プリローダーの挙動
  - `/event` の施設ボタンが `/map` の該当スポットへ移動
  - `/map` のメニュー切替・詳細パネル・コンパス許可モーダル
  - `/login`→`/bingo` の認証フロー
  - `/bingo` の保存/削除/Undo/クリア
- **タブ表示**: `.tab-content .tab-pane { display: block !important; }` で全展開
- **AOS**
  - Hero: `data-aos="fade-down"`
  - `#timetable`: `data-aos="fade-up" data-aos-delay="100"`
  - `#list`: `data-aos="fade-up" data-aos-delay="200"`
