"use client";

import { useEffect } from "react";

export default function EventPage() {
  useEffect(() => {
    const iframe = document.querySelector<HTMLIFrameElement>("#map iframe");
    if (!iframe) return;

    const onLoad = () => {
      const win = iframe.contentWindow as (Window & {
        spots?: { name: string; marker?: { fire: (evt: string) => void }; location: [number, number] }[];
        map?: { panTo: (loc: [number, number]) => void };
      }) | null;

      if (!win) return;

      document.querySelectorAll<HTMLButtonElement>("#facilities [data-facility]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const name = btn.dataset.facility;
          if (!name || !win.spots || !win.map) return;
          const spot = win.spots.find((s) => s.name === name);
          if (spot && spot.marker) {
            win.map.panTo(spot.location);
            spot.marker.fire("click");
          }
        });
      });
    };

    iframe.addEventListener("load", onLoad);
    return () => {
      iframe.removeEventListener("load", onLoad);
    };
  }, []);

  return (
    <div className="event-page">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .event-page {
          --event-accent: var(--kait-green);
          --event-accent-2: var(--kait-purple);
          --event-ink: #1e2a3a;
          --event-muted: #556274;
          --event-surface: rgba(255, 255, 255, 0.9);
          --event-shadow: 0 18px 40px rgba(15, 23, 42, 0.16);
          --event-soft-shadow: 0 12px 24px rgba(15, 23, 42, 0.12);
        }

        .event-page .hero {
          position: relative;
          min-height: 55vh;
          height: 55vh;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          margin-top: -2rem;
        }
        .event-page .hero-bg {
          position: absolute;
          inset: 0;
          background-image: url('/static/K2_ils.webp');
          background-position: center;
          background-size: cover;
          background-repeat: no-repeat;
          filter: saturate(1.05);
          transform: scale(1.03);
          z-index: 0;
        }
        .event-page .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, rgba(7, 11, 25, 0.72), rgba(15, 52, 96, 0.35));
          z-index: 1;
        }
        .event-page .hero .inner {
          position: relative;
          z-index: 2;
          padding-top: 4.5rem;
          text-shadow: 0 6px 18px rgba(0, 0, 0, 0.45);
        }
        .event-page .hero .lead {
          color: rgba(255, 255, 255, 0.92);
        }

        .event-page .event-main {
          padding-top: 2.5rem;
          padding-bottom: 4rem;
        }

        .event-page .section-block {
          margin-bottom: 4rem;
        }

        .event-page .section-title {
          position: relative;
          display: inline-block;
          margin-bottom: 2.2rem;
          font-weight: 700;
          color: var(--event-ink);
          font-size: clamp(1.8rem, 2.5vw, 2.3rem);
        }
        .event-page .section-title::after {
          content: '';
          display: block;
          width: 64px;
          height: 4px;
          background: linear-gradient(90deg, var(--event-accent), var(--event-accent-2));
          margin: 0.6rem auto 0;
          border-radius: 999px;
        }

        .event-page #map {
          text-align: center;
        }
        .event-page .map-frame {
          display: flex;
          justify-content: center;
          margin-bottom: 1.8rem;
        }
        .event-page #map iframe {
          width: 100%;
          max-width: 1200px;
          height: clamp(320px, 55vw, 560px);
          border-radius: 1.2rem;
          border: none;
          box-shadow: var(--event-shadow);
          background: #000;
        }

        .event-page .facility-menu {
          display: flex;
          flex-wrap: wrap;
          gap: 0.65rem;
          justify-content: center;
        }
        .event-page .facility-btn {
          border-radius: 999px;
          padding: 0.5rem 1.1rem;
          border: 1px solid rgba(31, 41, 55, 0.15);
          background: #fff;
          color: var(--event-ink);
          font-weight: 600;
          font-size: 0.95rem;
          transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease, color 0.2s ease;
        }
        .event-page .facility-btn:hover,
        .event-page .facility-btn:focus {
          background: linear-gradient(90deg, rgba(50, 205, 50, 0.95), rgba(138, 43, 226, 0.9));
          color: #fff;
          border-color: transparent;
          transform: translateY(-2px);
          box-shadow: 0 10px 18px rgba(50, 205, 50, 0.25);
        }

        .event-page .timetable-card {
          background: var(--event-surface);
          border-radius: 1.2rem;
          box-shadow: var(--event-soft-shadow);
          border: 1px solid rgba(15, 23, 42, 0.08);
          padding: 0.5rem;
        }
        .event-page .timetable-card .table {
          margin-bottom: 0;
        }
        .event-page .table thead th {
          background: #1f2937;
          color: #fff;
          border: none;
          padding: 1rem;
        }
        .event-page .table td {
          padding: 0.9rem 1rem;
          color: var(--event-ink);
        }

        .event-page .sticky-nav-container {
          position: sticky;
          top: 96px;
          z-index: 50;
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(10px);
          padding: 0.8rem 1rem;
          margin-bottom: 2.8rem;
          border-radius: 1.2rem;
          box-shadow: var(--event-soft-shadow);
          border: 1px solid rgba(15, 23, 42, 0.06);
        }
        .event-page .sticky-nav-container .nav {
          gap: 0.4rem;
          flex-wrap: wrap;
          justify-content: center;
        }
        .event-page .nav-pills .nav-link {
          border-radius: 999px;
          padding: 0.5rem 1.2rem;
          background: rgba(31, 41, 55, 0.05);
          color: #1f2a3a;
          font-weight: 600;
          transition: background-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
        }
        .event-page .nav-pills .nav-link:hover {
          background: rgba(31, 41, 55, 0.12);
          transform: translateY(-1px);
        }

        .event-page .category-section {
          scroll-margin-top: 160px;
          background: var(--event-surface);
          border-radius: 1.4rem;
          padding: 2.2rem 1.6rem;
          margin-bottom: 2.6rem;
          box-shadow: var(--event-soft-shadow);
          border: 1px solid rgba(15, 23, 42, 0.06);
        }
        .event-page .category-header {
          margin-bottom: 1.6rem;
          padding-left: 1rem;
          border-left: 5px solid var(--event-accent-2);
          font-weight: 700;
          font-size: 1.5rem;
          color: var(--event-ink);
        }

        .event-page .event-card {
          border: none;
          border-radius: 1.1rem;
          overflow: hidden;
          background: #fff;
          box-shadow: 0 6px 18px rgba(15, 23, 42, 0.08);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .event-page .event-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 18px 32px rgba(15, 23, 42, 0.16);
        }
        .event-page .event-card .card-img-top {
          height: 200px;
          object-fit: cover;
        }
        .event-page .event-card .card-title {
          font-weight: 700;
          color: var(--event-ink);
        }
        .event-page .event-card .card-text {
          color: var(--event-muted);
        }
        .event-page .event-location {
          font-size: 0.85rem;
          color: #4b5563;
          background: rgba(31, 41, 55, 0.08);
          padding: 0.35rem 0.7rem;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
        }

        @media (max-width: 992px) {
          .event-page .hero {
            min-height: 50vh;
          }
          .event-page .sticky-nav-container {
            top: 78px;
          }
        }

        @media (max-width: 768px) {
          .event-page .hero {
            min-height: 45vh;
          }
          .event-page .hero .inner {
            padding-top: 5.5rem;
          }
          .event-page .sticky-nav-container {
            position: static;
          }
          .event-page .sticky-nav-container .nav {
            flex-wrap: nowrap;
            overflow-x: auto;
            justify-content: flex-start;
            padding-bottom: 0.4rem;
          }
          .event-page .sticky-nav-container .nav::-webkit-scrollbar {
            height: 6px;
          }
          .event-page .sticky-nav-container .nav::-webkit-scrollbar-thumb {
            background: rgba(31, 41, 55, 0.2);
            border-radius: 999px;
          }
        }

        @media (max-width: 576px) {
          .event-page .category-section {
            padding: 1.8rem 1.2rem;
          }
          .event-page .event-card .card-img-top {
            height: 180px;
          }
        }
      `,
        }}
      />

      <section className="hero">
        <div className="hero-bg"></div>
        <div className="hero-overlay"></div>
        <div className="inner text-center" data-aos="fade-down">
          <h1 className="display-4 fw-bold">企画紹介</h1>
          <p className="lead mb-0">見どころ満載のプログラム</p>
        </div>
      </section>

      <main className="container event-main">
        <section id="map" className="section-block" data-aos="fade-up">
          <h2 className="section-title">会場マップ</h2>
          <div className="map-frame">
            <iframe src="/map" allowFullScreen title="宇宙祭 会場マップ"></iframe>
          </div>

          <div id="facilities" className="facility-menu">
            <button className="btn facility-btn" data-facility="K1号館">① A1号館</button>
            <button className="btn facility-btn" data-facility="K2号館">② A2号館</button>
            <button className="btn facility-btn" data-facility="K3号館">③ B3号館</button>
            <button className="btn facility-btn" data-facility="K4号館">④ B4号館</button>
            <button className="btn facility-btn" data-facility="C2号館">⑤ C2号館</button>
            <button className="btn facility-btn" data-facility="C5号館">⑥ C5号館</button>
            <button className="btn facility-btn" data-facility="C6号館">⑦ C6号館</button>
            <button className="btn facility-btn" data-facility="E1号館">⑧ D1号館</button>
            <button className="btn facility-btn" data-facility="E2号館">⑨ D2号館</button>
            <button className="btn facility-btn" data-facility="E6号館">⑩ D6号館</button>
            <button className="btn facility-btn" data-facility="宇宙広場">⑪ 宇宙広場</button>
            <button className="btn facility-btn" data-facility="宇宙 TOWN">⑫ 宇宙 TOWN</button>
            <button className="btn facility-btn" data-facility="宇宙工房">⑬ 宇宙工房</button>
            <button className="btn facility-btn" data-facility="先進技術研究所">⑭ 先進技術研究所</button>
            <button className="btn facility-btn" data-facility="中央緑地">⑮ 中央緑地</button>
            <button className="btn facility-btn" data-facility="宇宙アリーナ">⑯ 宇宙アリーナ</button>
          </div>
        </section>

        <section id="timetable" className="section-block" data-aos="fade-up" data-aos-delay="100">
          <div className="text-center">
            <h2 className="section-title">タイムテーブル</h2>
          </div>
          <div className="timetable-card">
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>時間</th>
                    <th>ステージ</th>
                    <th>ビンゴ</th>
                    <th>展示</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>10:00</td>
                    <td>オープニングセレモニー</td>
                    <td>-</td>
                    <td>研究室公開</td>
                  </tr>
                  <tr>
                    <td>12:00</td>
                    <td>ゲストトークショー</td>
                    <td>-</td>
                    <td>模擬店ピーク</td>
                  </tr>
                  <tr>
                    <td>14:00</td>
                    <td>ライブ演奏</td>
                    <td>ビンゴ受付開始</td>
                    <td>学生作品展示</td>
                  </tr>
                  <tr>
                    <td>15:00</td>
                    <td>ダンスパフォーマンス</td>
                    <td>ビンゴ大会</td>
                    <td>—</td>
                  </tr>
                  <tr>
                    <td>16:30</td>
                    <td>エンディング</td>
                    <td>-</td>
                    <td>-</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section id="list" className="section-block" data-aos="fade-up" data-aos-delay="200">
          <div className="text-center mb-4">
            <h2 className="section-title">企画一覧</h2>
          </div>

          <div className="sticky-nav-container">
            <ul className="nav nav-pills justify-content-center">
              <li className="nav-item"><a className="nav-link" href="#panel-bingo">ビンゴ</a></li>
              <li className="nav-item"><a className="nav-link" href="#panel-stage">ステージ</a></li>
              <li className="nav-item"><a className="nav-link" href="#panel-festival">縁日</a></li>
              <li className="nav-item"><a className="nav-link" href="#panel-food">模擬店</a></li>
              <li className="nav-item"><a className="nav-link" href="#panel-lab">研究室公開</a></li>
              <li className="nav-item"><a className="nav-link" href="#panel-exhibit">講義室展示</a></li>
            </ul>
          </div>

          <div id="panel-bingo" className="category-section">
            <h3 className="category-header">ビンゴ</h3>
            <div className="row g-4 justify-content-center">
              <div className="col-sm-6 col-md-4 col-lg-3">
                <div className="card event-card h-100">
                  <img src="/static/sunset.webp" className="card-img-top" alt="ビンゴ大会" />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">ビンゴ大会</h5>
                    <p className="text-muted small mb-1">#ビンゴ #ゲーム</p>
                    <p className="card-text small flex-grow-1">
                      12月1日(土), 11月2日(日) 15:00開始。<br />
                      豪華景品が当たる！<br />
                      ※参加にはビンゴカード（総合受付配布）が必要。
                    </p>
                    <span className="event-location mt-auto">
                      <i className="bi bi-geo-alt-fill"></i> 宇宙アリーナ
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div id="panel-stage" className="category-section">
            <h3 className="category-header">ステージイベント</h3>
            <div className="row g-4 justify-content-center">
              <div className="col-sm-6 col-md-4 col-lg-3">
                <div className="card event-card h-100">
                  <img src="/static/sunset.webp" className="card-img-top" alt="なにかしらのトークショー" />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">なにかしらのトークショー</h5>
                    <p className="text-muted small mb-1">#トークショー</p>
                    <p className="card-text small flex-grow-1">
                      なにかしらのトークショー。<br />
                      ※有料／11月2日(土)のみ開催。
                    </p>
                    <span className="event-location mt-auto">
                      <i className="bi bi-geo-alt-fill"></i> 宇宙アリーナ
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-md-4 col-lg-3">
                <div className="card event-card h-100">
                  <img src="/static/sunset.webp" className="card-img-top" alt="Rock in 宇宙" />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">Rock in 宇宙</h5>
                    <p className="text-muted small mb-1">#ライブ #バンド</p>
                    <p className="card-text small flex-grow-1">
                      文化祭Live バンド演奏。<br />
                      11月3日(日)のみ／入退場自由！
                    </p>
                    <span className="event-location mt-auto">
                      <i className="bi bi-geo-alt-fill"></i> K3号館1階 3102教室
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div id="panel-festival" className="category-section">
            <h3 className="category-header">縁日</h3>
            <div className="row g-4 justify-content-center">
              <div className="col-sm-6 col-md-4 col-lg-3">
                <div className="card event-card h-100">
                  <img src="/static/sunset.webp" className="card-img-top" alt="コルク射的" />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">コルク射的</h5>
                    <p className="text-muted small mb-1">#縁日 #射的</p>
                    <p className="card-text small flex-grow-1">コルクを打ち出して的を倒そう！景品あり。</p>
                    <span className="event-location mt-auto">
                      <i className="bi bi-geo-alt-fill"></i> 中央緑地
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-md-4 col-lg-3">
                <div className="card event-card h-100">
                  <img src="/static/sunset.webp" className="card-img-top" alt="輪投げチャレンジ" />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">輪投げチャレンジ</h5>
                    <p className="text-muted small mb-1">#縁日 #輪投げ</p>
                    <p className="card-text small flex-grow-1">輪を棒に多く入れよう。投げ方次第で高得点！</p>
                    <span className="event-location mt-auto">
                      <i className="bi bi-geo-alt-fill"></i> 中央緑地
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-md-4 col-lg-3">
                <div className="card event-card h-100">
                  <img src="/static/sunset.webp" className="card-img-top" alt="ヨーヨー釣り" />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">ヨーヨー釣り</h5>
                    <p className="text-muted small mb-1">#縁日 #ヨーヨー</p>
                    <p className="card-text small flex-grow-1">おもちゃの釣り竿でヨーヨーをゲットしよう！</p>
                    <span className="event-location mt-auto">
                      <i className="bi bi-geo-alt-fill"></i> 中央緑地
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-md-4 col-lg-3">
                <div className="card event-card h-100">
                  <img src="/static/sunset.webp" className="card-img-top" alt="くるくるガチャ" />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">くるくるガチャ</h5>
                    <p className="text-muted small mb-1">#縁日 #ガチャ</p>
                    <p className="card-text small flex-grow-1">１人１回回せるよ。何が出るかお楽しみに！</p>
                    <span className="event-location mt-auto">
                      <i className="bi bi-geo-alt-fill"></i> 中央緑地
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div id="panel-food" className="category-section">
            <h3 className="category-header">模擬店</h3>
            <div className="row g-4 justify-content-center">
              <div className="col-sm-6 col-md-4 col-lg-3">
                <div className="card event-card h-100">
                  <img src="/static/sunset.webp" className="card-img-top" alt="とろけるわたあめ" />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">とろけるわたあめ</h5>
                    <p className="text-muted small mb-1">#模擬店 #スイーツ</p>
                    <p className="card-text small flex-grow-1">木村研究室提供。ふわふわ甘いわたあめ、2サイズあり！</p>
                    <span className="event-location mt-auto">
                      <i className="bi bi-geo-alt-fill"></i> 中央緑地
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-md-4 col-lg-3">
                <div className="card event-card h-100">
                  <img src="/static/sunset.webp" className="card-img-top" alt="揚げパン" />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">揚げパン</h5>
                    <p className="text-muted small mb-1">#模擬店 #スイーツ</p>
                    <p className="card-text small flex-grow-1">Pia’s bakery。懐かしの揚げパンを香ばしく揚げたてで！</p>
                    <span className="event-location mt-auto">
                      <i className="bi bi-geo-alt-fill"></i> 中央緑地
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div id="panel-lab" className="category-section">
            <h3 className="category-header">研究室公開</h3>
            <div className="row g-4 justify-content-center">
              <div className="col-sm-8 col-md-6 col-lg-4">
                <div className="card event-card h-100">
                  <img src="/static/sunset.webp" className="card-img-top" alt="月の砂研究室" />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">月の砂研究室</h5>
                    <p className="text-muted small mb-1">#研究室公開 #クイズ</p>
                    <p className="card-text small flex-grow-1">C2号館2階全体でQRクイズラリー開催中！ぜひ挑戦を。</p>
                    <span className="event-location mt-auto">
                      <i className="bi bi-geo-alt-fill"></i> C2号館2階
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div id="panel-exhibit" className="category-section">
            <h3 className="category-header">講義室展示</h3>
            <div className="row g-4 justify-content-center">
              <div className="col-sm-6 col-md-4 col-lg-3">
                <div className="card event-card h-100">
                  <img src="/static/sunset.webp" className="card-img-top" alt="宇宙 VR体験" />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">宇宙 VR体験</h5>
                    <p className="text-muted small mb-1">#講義室展示 #VR</p>
                    <p className="card-text small flex-grow-1">VRゴーグルで驚きの没入体験を！老若男女楽しめます。</p>
                    <span className="event-location mt-auto">
                      <i className="bi bi-geo-alt-fill"></i> A3号館3階 3306教室
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-md-4 col-lg-3">
                <div className="card event-card h-100">
                  <img src="/static/sunset.webp" className="card-img-top" alt="自作プラネタリウム" />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">自作プラネタリウム</h5>
                    <p className="text-muted small mb-1">#講義室展示 #プラネタリウム</p>
                    <p className="card-text small flex-grow-1">天文部による自作プラネタリウム。夜空を再現します！</p>
                    <span className="event-location mt-auto">
                      <i className="bi bi-geo-alt-fill"></i> A3号館3階 3307教室
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
