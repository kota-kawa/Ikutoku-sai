import type { Metadata } from "next";
import { headers } from "next/headers";

export function generateMetadata(): Metadata {
  const h = headers();
  const host = h.get("x-forwarded-host") || h.get("host") || "";
  const proto = h.get("x-forwarded-proto") || "http";
  const canonical = host ? `${proto}://${host}/` : "/";
  return {
    title: "第100回 宇宙祭のサイト",
    alternates: {
      canonical
    }
  };
}

export default function HomePage() {
  return (
    <>
      <style>{`
        :root {
          --page-bg: #f5f5f7;
          --txt: #1d1d1f;
          --link: #0071e3;
        }
        body {
          background: var(--page-bg);
          color: var(--txt);
          font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif;
        }
        .index-section {
          padding: 6rem 0;
        }
        .index-scroll[data-aos] {
          opacity: 0;
          transform: translateY(40px);
        }
        .index-scroll[data-aos].aos-animate {
          opacity: 1;
          transform: none;
        }
        .hero {
          position: relative;
          height: 90vh;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          text-align: center;
          overflow: hidden;
        }
        .hero-bg {
          position: absolute;
          inset: 0;
          background: url('/static/kait_landscape.webp') center/cover no-repeat;
          transition: transform 10s ease;
        }
        .hero:hover .hero-bg {
          transform: scale(1.05);
        }
        .bird {
          position: absolute;
          top: 50%;
          width: 18%;
          transform: translateY(-50%);
          animation: float 6s ease-in-out infinite;
          z-index: 1;
        }
        .bird-left {
          left: 4%;
        }
        .bird-right {
          right: 4%;
          animation-direction: reverse;
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(-50%) translateX(0);
          }
          50% {
            transform: translateY(-55%) translateX(10px);
          }
        }
        .hero .inner {
          position: relative;
          z-index: 2;
        }
        .overview {
          background: #fff;
        }
        .overview .container {
          max-width: 800px;
          margin: 0 auto;
          text-align: center;
        }
        .overview h2 {
          font-size: 2.8rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
        }
        .overview-list {
          list-style: none;
          padding: 0;
          font-size: 1.1rem;
          display: inline-block;
          text-align: left;
          margin-bottom: 2rem;
        }
        .overview-list li {
          margin-bottom: 0.8rem;
        }
        .overview .btn-white {
          display: inline-block;
          border: 2px solid #000;
          border-radius: 48px;
          padding: 0.8rem 2.8rem;
          color: #000;
          background: #fff;
          text-decoration: none;
          font-weight: 600;
          transition: background 0.3s, color 0.3s;
        }
        .overview .btn-white:hover {
          background: #000;
          color: #fff;
        }
        .module {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 3rem;
          max-width: 1200px;
          margin: 0 auto;
          padding: 4rem 2rem;
        }
        .module.reverse .img-col {
          order: 2;
        }
        @media (max-width: 768px) {
          .module.reverse .img-col,
          .module.reverse .txt-col {
            order: 0;
          }
        }
        .img-col {
          flex: 1 1 52%;
          border-radius: 24px;
          overflow: hidden;
          aspect-ratio: 9 / 6;
          object-fit: cover;
        }
        .img-col img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .txt-col {
          flex: 1 1 40%;
        }
        .txt-col h3 {
          font-size: 2rem;
          margin: 0.5rem 0 1rem;
        }
        .txt-col p {
          margin: 0 0 1.5rem;
          font-size: 1.05rem;
          line-height: 1.6;
        }
        .txt-col a {
          color: var(--link);
          font-weight: 600;
          text-decoration: none;
          position: relative;
        }
        .txt-col a::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -3px;
          width: 0;
          height: 2px;
          background: var(--link);
          transition: width 0.3s;
        }
        .txt-col a:hover::after {
          width: 100%;
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
      `}</style>

      <div id="preloader">
        <iframe src="/static/loader.html" loading="eager"></iframe>
      </div>

      <section className="hero" id="top">
        <div className="hero-bg"></div>
        <img src="/static/kait1.webp" alt="Kait Bird 1" className="bird bird-left" />
        <img src="/static/kait2.webp" alt="Kait Bird 2" className="bird bird-right" />
        <div className="inner" data-aos="zoom-in" data-aos-duration="1000">
          <img
            src="/static/top.webp"
            alt="トップ画像"
            className="img-fluid"
            style={{ width: "100%", maxWidth: "600px", height: "auto" }}
          />
        </div>
      </section>

      <section className="overview index-scroll" id="overview" data-aos="fade-up">
        <div className="container">
          <h2 className="pt-3">開催概要</h2>
          <ul className="overview-list">
            <li>
              <strong>日程：</strong>2100年12月1日（土）〜12月2日（日）
            </li>
            <li>
              <strong>時間：</strong>各日 10:00 〜 17:00
            </li>
            <li>
              <strong>住所：</strong>〒111-1111 月の裏側
            </li>
            <li>
              <strong>テーマ：</strong>「餅つき」
            </li>
          </ul>
        </div>
      </section>

      <section className="module index-scroll" id="access" data-aos="fade-up">
        <div className="img-col">
          <img src="/static/top_page/access.webp" alt="Access" />
        </div>
        <div className="txt-col">
          <h3>アクセス</h3>
          <p>宇宙船からバスで約 25 分。駐車場もあります。</p>
          <a href="/announce">交通案内 &raquo;</a>
        </div>
      </section>

      <section className="module reverse index-scroll" id="events" data-aos="fade-up">
        <div className="img-col">
          <img src="/static/top_page/mogiten.webp" alt="Events" />
        </div>
        <div className="txt-col">
          <h3>ステージ &amp; 模擬店</h3>
          <p>ライブ、研究展示、ワークショップ…100 を超える企画がキャンパス全体で展開。</p>
          <a href="/event">企画一覧 &raquo;</a>
        </div>
      </section>

      <section className="module index-scroll" id="access" data-aos="fade-up">
        <div className="img-col">
          <img src="/static/top_page/welcome.webp" alt="Access" />
        </div>
        <div className="txt-col">
          <h3>ご挨拶</h3>
          <p>宇宙祭実行委員からのご挨拶です。</p>
          <a href="/about">ご挨拶 &raquo;</a>
        </div>
      </section>

      <section className="contact index-scroll" id="contact" data-aos="fade-up">
        <div className="container">
          <div>
            <h2>お問い合わせ</h2>
            <p>ご質問・ご要望などございましたら、お気軽にお問い合わせください。</p>
            <p>協賛・取材などもこちらからよろしくお願いします。</p>
            <a href="/" className="btn-contact">
              お問い合わせはこちら &raquo;
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
