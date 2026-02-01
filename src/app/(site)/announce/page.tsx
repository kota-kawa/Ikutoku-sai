import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "宇宙祭 | ご案内・アクセス",
};

export default function AnnouncePage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
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
          background: url('/static/SENSHIN_ils.webp') center/cover no-repeat fixed;
          z-index: 0;
          animation: zoomBackground 20s ease-in-out infinite;
        }

        .hero .inner {
          position: relative;
          z-index: 2;
        }

        @keyframes zoomBackground {
          0% {
            transform: scale(1);
          }

          50% {
            transform: scale(1.05);
          }

          100% {
            transform: scale(1);
          }
        }

        :root {
          --accent: #0077c8;
          --bus-color: #7a22e6;
          --card-bg: #ffffff;
          --shadow: rgba(0, 0, 0, 0.1);
          --detail-heading: #8d6e63;
          --text: #2c3e50;
        }

        .custom-container {
          max-width: 960px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .station-map {
          width: 100%;
          height: auto;
          display: block;
          overflow: visible;
        }

        .station-map path {
          stroke: var(--accent);
          stroke-width: 6;
          stroke-linecap: round;
          fill: none;
        }

        .station-map circle.train {
          fill: var(--accent);
        }

        .station-map circle.station {
          fill: #fff;
          stroke: var(--accent);
          stroke-width: 4;
          transition: none;
          cursor: default;
        }

        .station-label {
          font-size: 0.9rem;
          fill: var(--text);
          text-anchor: middle;
          user-select: none;
        }

        @media (max-width: 576px) {
          .station-map {
            overflow: visible;
          }

          .station-label {
            font-size: 1.5rem;
          }
        }

        .bus-map .station-map path,
        .bus-map .station-map circle.train {
          stroke: var(--bus-color);
          fill: var(--bus-color);
        }

        .map-container {
          position: relative;
          width: 100%;
          max-width: 600px;
          padding-top: 56.25%;
          margin: 0 auto 2rem;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 12px var(--shadow);
        }

        .map-container iframe {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          border: 0;
        }

        .map-container--small {
          padding-top: 35%;
          position: relative;
          z-index: 2;
        }

        @media (max-width: 576px) {
          .map-container--small {
            padding-top: 56.25%;
            margin-top: 1.5rem;
          }
        }

        .details-sections {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .detail-section {
          background: var(--card-bg);
          border-left: 6px solid var(--accent);
          border-radius: 8px;
          padding: 1.25rem 1.5rem;
          box-shadow: 0 4px 12px var(--shadow);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .detail-section:hover {
          transform: translateY(-4px);
          box-shadow: 0 6px 16px var(--shadow);
        }

        .detail-section h2 {
          font-size: 1.2rem;
          margin-bottom: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--detail-heading);
        }

        .detail-section h2 .icon {
          font-size: 1.25rem;
        }

        .detail-section ul,
        .detail-section p {
          font-size: 0.95rem;
          line-height: 1.6;
          margin: 0;
        }

        .detail-section ul {
          list-style: none;
          padding: 0;
        }

        .detail-section ul li {
          position: relative;
          padding-left: 1.2rem;
          margin-bottom: 0.5rem;
        }

        .detail-section ul li::before {
          content: '▶';
          position: absolute;
          left: 0;
          top: 0;
          color: var(--accent);
        }

        .campus-address {
          text-align: center;
          margin: 1.5rem auto 2rem;
          font-size: 0.95rem;
          color: var(--text);
          line-height: 1.5;
        }

        .down-arrow {
          text-align: center;
          margin: 1rem 0;
          font-size: 4rem;
          color: var(--accent);
          animation: bounce 2s infinite;
        }

        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(8px);
          }
        }

        .timetable-link {
          text-align: left;
          margin-top: 1rem;
        }

        .timetable-link a {
          display: inline-block;
          padding: 0.4rem 0.8rem;
          border: 2px solid var(--bus-color);
          border-radius: 4px;
          font-size: 0.9rem;
          color: var(--bus-color);
          text-decoration: none;
          transition: background 0.2s, color 0.2s;
        }

        .timetable-link a:hover {
          background: var(--bus-color);
          color: #fff;
        }

        .contact {
          padding: 4rem 0;
        }
        .contact .container {
          display: flex;
          justify-content: center;
        }
        .contact h2 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          text-align: center;
          width: 100%;
        }
        .contact p {
          font-size: 1.1rem;
          margin-bottom: 1.5rem;
          text-align: center;
          width: 100%;
        }
        .contact .btn-contact {
          display: block;
          margin: 0 auto;
          padding: 0.8rem 2.4rem;
          background: #0071e3;
          color: #fff;
          border-radius: 9999px;
          font-weight: 600;
          text-decoration: none;
          transition: background 0.3s, transform 0.2s;
        }
        .contact .btn-contact:hover {
          background: #005bb5;
          transform: translateY(-2px);
        }
        @media (max-width: 768px) {
          .contact .btn-contact {
            width: 70%;
          }
          .overview .btn-white {
            display: inline-block;
            margin-bottom: 1.5rem;
          }
        }
        @media (min-width: 769px) {
          .contact .btn-contact {
            width: 45%;
          }
        }
      `}} />

      <section className="hero">
        <div className="hero-bg"></div>
        <div className="inner text-center" data-aos="fade-down">
          <h1 className="display-4 fw-bold">ご案内 &amp; アクセス</h1>
          <p className="lead mb-0">安心・安全にお楽しみいただくために</p>
        </div>
      </section>

      <main className="my-5 pt-4">
        <div className="custom-container">
          <section className="mb-5" data-aos="fade-up">
            <h2 className="mb-4">ご来場の方へ</h2>
            <div className="card p-4">
              <ul className="list-unstyled mb-0">
                <li className="mb-2">
                  <i className="bi bi-exclamation-circle-fill me-2 text-danger"></i>
                  飲酒は固くお断りいたします。
                </li>
                <li className="mb-2">
                  <i className="bi bi-exclamation-circle-fill me-2 text-danger"></i>
                  ドローン等の無許可飛行は禁止です。
                </li>
                <li className="mb-2">
                  <i className="bi bi-exclamation-circle-fill me-2 text-danger"></i>
                  ゴミは分別のうえ所定の回収場所へ。
                </li>
                <li className="mb-2">
                  <i className="bi bi-exclamation-circle-fill me-2 text-danger"></i>
                  ペットの同伴は原則ご遠慮ください。
                </li>
                <li className="mb-2">
                  <i className="bi bi-exclamation-circle-fill me-2 text-danger"></i>
                  体調不良の際はスタッフまでお申し出ください。
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-5" data-aos="fade-up" data-aos-delay="100">
            <h2 className="mb-4">アクセス</h2>

            <div className="map-container">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1645.518200533677!2d139.3412656387554!3d35.48609589316269!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x601901b75d52e4bb%3A0x25daee3f56616714!2z56We5aWI5bed5bel56eR5aSn5a2m!5e1!3m2!1sja!2sjp!4v1747791487505!5m2!1sja!2sjp"
                width="600"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            <div className="campus-address" data-aos="fade-up">
              <p>
                月の裏側
                <br />
                〒111-1111 月の裏側
              </p>
            </div>

            <div className="details-sections">
              <section className="detail-section">
                <h2>
                  <span className="icon">🚃</span>電車でお越しの方
                </h2>
                <p>主要駅からの目安時間</p>
                <ul>
                  <li>新宿-[小田急線]-本厚木　（約52分）</li>
                  <li>横浜-[相模鉄道]-海老名-[小田急線]-本厚木　（約45分）　</li>
                  <li>八王子-[JR横浜線]-町田-[小田急線]-本厚木　（約52分）</li>
                  <li>小田原-[小田急線]-本厚木　（約40分）</li>
                  <br />
                </ul>
                <p>↓ 本厚木駅からはバスを使います。</p>
                <svg
                  className="station-map"
                  viewBox="0 0 600 120"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                >
                  <path id="track-2" d="M40 60 L560 60" />
                  <circle className="train" r="8">
                    <animateMotion dur="6s" repeatCount="indefinite" keyPoints="0;1;0" keyTimes="0;0.5;1">
                      <mpath xlinkHref="#track-2" />
                    </animateMotion>
                  </circle>
                  <circle className="station" cx="120" cy="60" r="12" />
                  <text className="station-label" x="120" y="85">
                    <tspan x="120" dy="10">愛甲石田</tspan>
                  </text>
                  <circle className="station" cx="300" cy="60" r="12" />
                  <text className="station-label" x="300" y="95">本厚木</text>
                  <circle className="station" cx="480" cy="60" r="12" />
                  <text className="station-label" x="480" y="95">厚木</text>
                </svg>
              </section>

              <div className="down-arrow" data-aos="fade-up">
                <i className="bi bi-arrow-down-circle-fill"></i>
              </div>

              <section className="detail-section">
                <h2>
                  <span className="icon">🚌</span>バスでお越しの方
                </h2>
                <p>本厚木駅よりバスを利用する場合、2つのルートがあります。</p>
                <ul>
                  <li>「本厚木」駅 北口 ①番乗り場<br />「あつぎ郷土博物館」行き、「月の裏側経由・鳶尾団地」行き　→　「月の裏側前」下車</li>
                  <li>「厚木バスセンター」①-②番乗り場<br />「月の裏側」行き　→　終点で下車</li>
                </ul>
                <p className="timetable-link">
                  <a href="https://www.kait.jp/about/bus_timetable.pdf" target="_blank" rel="noopener">
                    🕒 バス時刻表を見る
                  </a>
                </p>

                <div className="bus-map">
                  <svg
                    className="station-map"
                    viewBox="0 0 600 120"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                  >
                    <path id="bus-track" d="M560 60 L40 60" />
                    <circle className="train" r="8">
                      <animateMotion dur="6s" repeatCount="indefinite" keyPoints="0;1;0" keyTimes="0;0.5;1">
                        <mpath xlinkHref="#bus-track" />
                      </animateMotion>
                    </circle>
                    <circle className="station" cx="480" cy="60" r="12" />
                    <text className="station-label" x="480" y="95">月の裏側</text>
                    <circle className="station" cx="300" cy="60" r="12" />
                    <text className="station-label" x="300" y="95">
                      <tspan x="300" dy="0">各停留所</tspan>
                      <tspan x="300" dy="1.3em">（一般路線バス）</tspan>
                    </text>
                    <circle className="station" cx="120" cy="60" r="12" />
                    <text className="station-label" x="120" y="85">
                      <tspan x="120" dy="10">本厚木駅前</tspan>
                      <tspan x="120" dy="1.3em">or 厚木バスセンター</tspan>
                    </text>
                  </svg>
                </div>

                <div className="map-container map-container--small" data-aos="fade-up">
                  <iframe
                    src="/bus_stop"
                    width="600"
                    height="450"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
                <div className="text-center mt-5" data-aos="fade-up">
                  <a href="/bus_stop" className="btn btn-outline-primary" target="_blank" rel="noopener">
                    全画面でマップを表示
                  </a>
                </div>
              </section>

              <section className="detail-section">
                <h2>
                  <span className="icon">🚗</span>お車でお越しの方
                </h2>
                <p>！！駐車場は混み合いますので、公共交通機関をおすすめします。！！</p>
                <p>（大学指定ではない駐車場はご遠慮ください。）</p>
                <ul>
                  <li>東名高速道路「厚木IC」より約15分</li>
                  <li>自動車約260台を収容できるスペースを確保しています。（無料）</li>
                </ul>
                <div className="map-container map-container--small" data-aos="fade-up">
                  <iframe
                    src="/parking_car"
                    width="600"
                    height="450"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
                <div className="text-center mt-2" data-aos="fade-up">
                  <a href="/parking_car" className="btn btn-outline-primary" target="_blank" rel="noopener">
                    全画面でマップを表示
                  </a>
                </div>
              </section>

              <section className="detail-section">
                <h2>
                  <span className="icon">🚲</span>自転車でお越しの方
                </h2>
                <p>自転車1,000台の収容が可能です（無料）。</p>

                <div className="map-container map-container--small" data-aos="fade-up">
                  <iframe
                    src="/parking_bycycle"
                    width="600"
                    height="450"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
                <div className="text-center mt-2" data-aos="fade-up">
                  <a href="/parking_bycycle" className="btn btn-outline-primary" target="_blank" rel="noopener">
                    全画面でマップを表示
                  </a>
                </div>
              </section>
            </div>
          </section>

          <section className="contact index-scroll" id="contact" data-aos="fade-up">
            <div className="container">
              <div>
                <h2>お問い合わせ</h2>
                <p>ご質問・ご要望などございましたら、お気軽にお問い合わせください。</p>
                <a href="https://forms.gle/hDtaJVNBFxGamAJ4A" className="btn-contact">
                  お問い合わせはこちら &raquo;
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
