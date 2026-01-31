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
    <>
      <style jsx global>{`
        .hero {
          position: relative;
          height: 50vh;
          text-align: center;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .hero-bg {
          position: absolute;
          inset: 0;
          background-image: url('/static/K2_ils.webp');
          background-position: center;
          background-size: cover;
          background-repeat: no-repeat;
          background-attachment: scroll;
          z-index: 0;
        }
        .hero .inner {
          position: relative;
          z-index: 2;
        }

        .card {
          transition: transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94),
            box-shadow 0.35s;
          border: none;
          border-radius: 1rem;
          overflow: hidden;
        }
        .card:hover {
          transform: translateY(-6px) scale(1.02);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
        }

        #map iframe {
          width: 90%;
          max-width: 1400px;
          height: 600px;
          border: none;
          display: block;
          margin: 0 auto;
        }

        .nav-pills .nav-link {
          border-radius: 2rem;
          padding: 0.6rem 1.2rem;
          margin: 0 0.3rem;
          background-color: #f1f1f1;
          color: #343a40;
          transition: background-color 0.3s, color 0.3s;
        }
        .nav-pills .nav-link:hover {
          background-color: #e0e0e0;
        }
        .nav-pills .nav-link.active,
        .nav-pills .nav-link:focus {
          background-color: #343a40;
          color: #fff;
        }

        .category-section {
          padding: 2rem 1rem;
          border-radius: 1rem;
          margin-bottom: 2.5rem;
        }
        .category-section:nth-of-type(odd) {
          background-color: #f8f9fa;
        }
        .category-title {
          font-size: 1.75rem;
          font-weight: 600;
          text-align: center;
          margin-bottom: 1.5rem;
          position: relative;
        }
        .category-title::after {
          content: '';
          display: block;
          width: 60px;
          height: 4px;
          background-color: #343a40;
          margin: 0.5rem auto 0;
          border-radius: 2px;
        }

        .tab-content .tab-pane {
          display: block !important;
          opacity: 1 !important;
          visibility: visible !important;
          margin-bottom: 2rem;
        }

        .card-img-top {
          object-fit: cover;
          height: 180px;
        }
      `}</style>

      <section className="hero">
        <div className="hero-bg"></div>
        <div className="inner text-center" data-aos="fade-down">
          <h1 className="display-4 fw-bold">企画紹介</h1>
          <p className="lead mb-0">見どころ満載のプログラム</p>
        </div>
      </section>

      <main className="container my-5 pt-4">
        <section id="map" className="py-5 bg-light">
          <h2 className="mb-4">会場マップ</h2>
          <iframe src="/map" allowFullScreen title="宇宙祭 会場マップ"></iframe>
        </section>

        <section id="facilities" className="container mb-5">
          <h2 className="mb-4">施設一覧</h2>
          <div className="facility-menu d-flex flex-wrap gap-2 justify-content-center">
            <button className="btn btn-outline-secondary" data-facility="K1号館">① A1号館</button>
            <button className="btn btn-outline-secondary" data-facility="K2号館">② A2号館</button>
            <button className="btn btn-outline-secondary" data-facility="K3号館">③ B3号館</button>
            <button className="btn btn-outline-secondary" data-facility="K4号館">④ B4号館</button>
            <button className="btn btn-outline-secondary" data-facility="C2号館">⑤ C2号館</button>
            <button className="btn btn-outline-secondary" data-facility="C5号館">⑥ C5号館</button>
            <button className="btn btn-outline-secondary" data-facility="C6号館">⑦ C6号館</button>
            <button className="btn btn-outline-secondary" data-facility="E1号館">⑧ D1号館</button>
            <button className="btn btn-outline-secondary" data-facility="E2号館">⑨ D2号館</button>
            <button className="btn btn-outline-secondary" data-facility="E6号館">⑩ D6号館</button>
            <button className="btn btn-outline-secondary" data-facility="宇宙広場">⑪ 宇宙広場</button>
            <button className="btn btn-outline-secondary" data-facility="宇宙 TOWN">⑫ 宇宙 TOWN</button>
            <button className="btn btn-outline-secondary" data-facility="宇宙工房">⑬ 宇宙工房</button>
            <button className="btn btn-outline-secondary" data-facility="先進技術研究所">⑭ 先進技術研究所</button>
            <button className="btn btn-outline-secondary" data-facility="中央緑地">⑮ 中央緑地</button>
            <button className="btn btn-outline-secondary" data-facility="宇宙アリーナ">⑯ 宇宙アリーナ</button>
          </div>
        </section>

        <section id="timetable" className="mb-5" data-aos="fade-up" data-aos-delay="100">
          <h2 className="mb-4">タイムテーブル</h2>
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
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
        </section>

        <section id="list" className="container mb-5" data-aos="fade-up" data-aos-delay="200">
          <h2 className="mb-4 text-center">企画一覧</h2>

          <ul className="nav nav-pills justify-content-center mb-5">
            <li className="nav-item"><a className="nav-link" href="#panel-bingo">ビンゴ</a></li>
            <li className="nav-item"><a className="nav-link" href="#panel-stage">ステージ</a></li>
            <li className="nav-item"><a className="nav-link" href="#panel-festival">縁日</a></li>
            <li className="nav-item"><a className="nav-link" href="#panel-food">模擬店</a></li>
            <li className="nav-item"><a className="nav-link" href="#panel-lab">研究室公開</a></li>
            <li className="nav-item"><a className="nav-link" href="#panel-exhibit">講義室展示</a></li>
          </ul>

          <div id="panel-bingo" className="category-section">
            <h3 className="category-title">ビンゴ</h3>
            <div className="row g-4 justify-content-center">
              <div className="col-sm-6 col-md-4 col-lg-3">
                <div className="card h-100 shadow-sm">
                  <img src="/static/sunset.webp" className="card-img-top" alt="ビンゴ大会" />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">ビンゴ大会</h5>
                    <p className="text-muted small mb-1">#ビンゴ #ゲーム</p>
                    <p className="card-text small flex-grow-1">
                      12月1日(土), 11月2日(日) 15:00開始。<br />
                      豪華景品が当たる！<br />
                      ※参加にはビンゴカード（総合受付配布）が必要。
                    </p>
                    <p className="small mt-auto mb-0"><i className="bi bi-geo-alt-fill"></i> 宇宙アリーナ</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div id="panel-stage" className="category-section">
            <h3 className="category-title">ステージイベント</h3>
            <div className="row g-4 justify-content-center">
              <div className="col-sm-6 col-md-4 col-lg-3">
                <div className="card h-100 shadow-sm">
                  <img src="/static/sunset.webp" className="card-img-top" alt="なにかしらのトークショー" />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">なにかしらのトークショー</h5>
                    <p className="text-muted small mb-1">#トークショー</p>
                    <p className="card-text small flex-grow-1">
                      なにかしらのトークショー。<br />
                      ※有料／11月2日(土)のみ開催。
                    </p>
                    <p className="small mt-auto mb-0"><i className="bi bi-geo-alt-fill"></i> 宇宙アリーナ</p>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-md-4 col-lg-3">
                <div className="card h-100 shadow-sm">
                  <img src="/static/sunset.webp" className="card-img-top" alt="Rock in 宇宙" />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">Rock in 宇宙</h5>
                    <p className="text-muted small mb-1">#ライブ #バンド</p>
                    <p className="card-text small flex-grow-1">
                      文化祭Live バンド演奏。<br />
                      11月3日(日)のみ／入退場自由！
                    </p>
                    <p className="small mt-auto mb-0"><i className="bi bi-geo-alt-fill"></i> K3号館1階 3102教室</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div id="panel-festival" className="category-section">
            <h3 className="category-title">縁日</h3>
            <div className="row g-4 justify-content-center">
              <div className="col-sm-6 col-md-4 col-lg-3">
                <div className="card h-100 shadow-sm">
                  <img src="/static/sunset.webp" className="card-img-top" alt="コルク射的" />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">コルク射的</h5>
                    <p className="text-muted small mb-1">#縁日 #射的</p>
                    <p className="card-text small flex-grow-1">コルクを打ち出して的を倒そう！景品あり。</p>
                    <p className="small mt-auto mb-0"><i className="bi bi-geo-alt-fill"></i> 中央緑地</p>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-md-4 col-lg-3">
                <div className="card h-100 shadow-sm">
                  <img src="/static/sunset.webp" className="card-img-top" alt="輪投げチャレンジ" />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">輪投げチャレンジ</h5>
                    <p className="text-muted small mb-1">#縁日 #輪投げ</p>
                    <p className="card-text small flex-grow-1">輪を棒に多く入れよう。投げ方次第で高得点！</p>
                    <p className="small mt-auto mb-0"><i className="bi bi-geo-alt-fill"></i> 中央緑地</p>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-md-4 col-lg-3">
                <div className="card h-100 shadow-sm">
                  <img src="/static/sunset.webp" className="card-img-top" alt="ヨーヨー釣り" />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">ヨーヨー釣り</h5>
                    <p className="text-muted small mb-1">#縁日 #ヨーヨー</p>
                    <p className="card-text small flex-grow-1">おもちゃの釣り竿でヨーヨーをゲットしよう！</p>
                    <p className="small mt-auto mb-0"><i className="bi bi-geo-alt-fill"></i> 中央緑地</p>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-md-4 col-lg-3">
                <div className="card h-100 shadow-sm">
                  <img src="/static/sunset.webp" className="card-img-top" alt="くるくるガチャ" />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">くるくるガチャ</h5>
                    <p className="text-muted small mb-1">#縁日 #ガチャ</p>
                    <p className="card-text small flex-grow-1">１人１回回せるよ。何が出るかお楽しみに！</p>
                    <p className="small mt-auto mb-0"><i className="bi bi-geo-alt-fill"></i> 中央緑地</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div id="panel-food" className="category-section">
            <h3 className="category-title">模擬店</h3>
            <div className="row g-4 justify-content-center">
              <div className="col-sm-6 col-md-4 col-lg-3">
                <div className="card h-100 shadow-sm">
                  <img src="/static/sunset.webp" className="card-img-top" alt="とろけるわたあめ" />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">とろけるわたあめ</h5>
                    <p className="text-muted small mb-1">#模擬店 #スイーツ</p>
                    <p className="card-text small flex-grow-1">木村研究室提供。ふわふわ甘いわたあめ、2サイズあり！</p>
                    <p className="small mt-auto mb-0"><i className="bi bi-geo-alt-fill"></i> 中央緑地</p>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-md-4 col-lg-3">
                <div className="card h-100 shadow-sm">
                  <img src="/static/sunset.webp" className="card-img-top" alt="揚げパン" />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">揚げパン</h5>
                    <p className="text-muted small mb-1">#模擬店 #スイーツ</p>
                    <p className="card-text small flex-grow-1">Pia’s bakery。懐かしの揚げパンを香ばしく揚げたてで！</p>
                    <p className="small mt-auto mb-0"><i className="bi bi-geo-alt-fill"></i> 中央緑地</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div id="panel-lab" className="category-section">
            <h3 className="category-title">研究室公開</h3>
            <div className="row g-4 justify-content-center">
              <div className="col-sm-8 col-md-6 col-lg-4">
                <div className="card h-100 shadow-sm">
                  <img src="/static/sunset.webp" className="card-img-top" alt="月の砂研究室" />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">月の砂研究室</h5>
                    <p className="text-muted small mb-1">#研究室公開 #クイズ</p>
                    <p className="card-text small flex-grow-1">C2号館2階全体でQRクイズラリー開催中！ぜひ挑戦を。</p>
                    <p className="small mt-auto mb-0"><i className="bi bi-geo-alt-fill"></i> C2号館2階</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div id="panel-exhibit" className="category-section">
            <h3 className="category-title">講義室展示</h3>
            <div className="row g-4 justify-content-center">
              <div className="col-sm-6 col-md-4 col-lg-3">
                <div className="card h-100 shadow-sm">
                  <img src="/static/sunset.webp" className="card-img-top" alt="宇宙 VR体験" />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">宇宙 VR体験</h5>
                    <p className="text-muted small mb-1">#講義室展示 #VR</p>
                    <p className="card-text small flex-grow-1">VRゴーグルで驚きの没入体験を！老若男女楽しめます。</p>
                    <p className="small mt-auto mb-0"><i className="bi bi-geo-alt-fill"></i> A3号館3階 3306教室</p>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-md-4 col-lg-3">
                <div className="card h-100 shadow-sm">
                  <img src="/static/sunset.webp" className="card-img-top" alt="自作プラネタリウム" />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">自作プラネタリウム</h5>
                    <p className="text-muted small mb-1">#講義室展示 #プラネタリウム</p>
                    <p className="card-text small flex-grow-1">天文部による自作プラネタリウム。夜空を再現します！</p>
                    <p className="small mt-auto mb-0"><i className="bi bi-geo-alt-fill"></i> A3号館3階 3307教室</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
