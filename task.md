# Current Task Context

## 今回やること・目的 (Goal/Objective)
before_version のデザイン/動作を TS + Next.js 実装で**完全一致**させるため、ページ別のズレを洗い出し、差分を解消できる要件と作業項目を明確化する。

## やること (Must)
- before_version を基準に、各ページ（/ /about /announce /event /map /bus_stop /parking_car /parking_bycycle /login /bingo /eeeeee）の**見た目・動作差分**を確認し、修正点を列挙する。
- 共通レイアウト（ヘッダー/フッター/バブル/AOS/Bootstrap/GA/フォント）の**一致チェックリスト**を作成する。
- ルートごとの HTML/CSS/JS 仕様（文言・数値・アニメ・リンク・埋め込み URL）を完全一致させる。
- 認証フロー（/login → /login_submit → /bingo）の挙動・エラーメッセージを一致させる。
- `public/static` のアセット欠損・パスずれを修正する（before_version と完全同一）。

## やらないこと (Non-goals)
- before_version に存在しない新機能/新ページの追加
- `before_version/**` の変更・削除
- UI/UX の改善提案やリデザイン
- 依存ライブラリの更新・置き換え
- 既存の文言・数値・配色の調整

## 受け入れ基準 (Acceptance Criteria)
- before_version と**視覚的に完全一致**（レイアウト/余白/色/フォント/アニメ/画像/背景）
- before_version と**動作が完全一致**（メニュー開閉、プリローダー、AOS、地図操作、施設ボタン連動、ログイン制御、ビンゴ操作）
- ルーティングとリンク先が完全一致
- スタティックアセットのパスが完全一致
- 主要ブレークポイント（992/768/576/横長小画面）で一致

## 影響範囲 (Impact/Scope)

- **触るファイル**:
  - `spec.md`
  - `task.md`
  - `src/app/(site)/**`
  - `src/app/(standalone)/**`
  - `src/components/**`
  - `public/static/**`
  - `src/server/**`

- **壊しちゃいけない挙動**:
  - `/login` 認証フローと `ADMIN_PASSWORD` チェック
  - `/bingo` の localStorage 操作
  - `/map` の Leaflet 表示・ピン/詳細パネル・コンパス許可モーダル
  - `/event` 施設ボタン連動（iframe 経由）
  - 共通ヘッダー/フッター/バブル/プリローダー
