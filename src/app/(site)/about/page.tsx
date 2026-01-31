"use client";

import { useEffect } from "react";

export default function AboutPage() {
  useEffect(() => {
    const loadScript = (src: string, id: string) =>
      new Promise<void>((resolve, reject) => {
        if (document.getElementById(id)) {
          resolve();
          return;
        }
        const script = document.createElement("script");
        script.id = id;
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load ${src}`));
        document.body.appendChild(script);
      });

    const init = async () => {
      try {
        await loadScript(
          "https://cdn.jsdelivr.net/npm/vanilla-tilt@1.7.3/dist/vanilla-tilt.min.js",
          "vanilla-tilt"
        );
        const w = window as Window & {
          VanillaTilt?: { init: (els: NodeListOf<Element>, opts: unknown) => void };
        };
        w.VanillaTilt?.init(document.querySelectorAll(".greeting-item"), {
          max: 8,
          speed: 400,
          glare: true,
          "max-glare": 0.25
        });
      } catch {
        // ignore script load errors
      }
    };

    init();
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --grad-main: linear-gradient(90deg, #0071e3 0%, #af52de 45%, #ff7f44 90%);
          --grad-greeting-title: linear-gradient(90deg, #a7bde4 0%, #454b97 50%, #62c4ad 100%);
          --grad-greeting-item: linear-gradient(90deg, #078eae 0%, #9763ab 50%, #ca5984 100%);
          --txt-main: #1d1d1f;
          --txt-sub: #555;
          --glass-bg: rgba(255, 255, 255, 0.55);
          --glass-bg-dark: rgba(28, 28, 30, 0.55);
        }

        .gradient-text--purple {
          background: linear-gradient(
            to right,
            #6a0dad,
            #ff11003
          );
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          font-size: 1.05rem;
          line-height: 1.75;
          max-width: 720px;
          margin-inline: auto;
          text-align: left;
          font-weight: bold;
        }

        .hero {
          position: relative;
          min-height: 50vh;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .hero-bg {
          position: absolute;
          inset: 0;
          background: url('/static/KAIT_KB_ils.webp') center/cover no-repeat;
          transform: scale(1.1);
          z-index: 0;
          will-change: transform;
          pointer-events: none;
        }
        @media (prefers-reduced-motion: no-preference) {
          .hero-bg {
            animation: bgZoom 25s ease-in-out infinite;
          }
        }
        @keyframes bgZoom {
          0% {
            transform: scale(1.05);
          }
          50% {
            transform: scale(1.15);
          }
          100% {
            transform: scale(1.05);
          }
        }
        .hero .inner {
          position: relative;
          z-index: 1;
        }
        .hero .lead {
          color: #fff !important;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.35);
        }

        .apple-section {
          padding: clamp(4rem, 8vw, 7rem) 1rem;
          max-width: 940px;
          margin-inline: auto;
        }
        .apple-section:not(:last-of-type) {
          border-bottom: 1px solid #e5e5e5;
        }
        .apple-title {
          font: 700 clamp(2.25rem, 4vw, 3rem) / 1.2 system-ui;
          text-align: center;
          margin-bottom: 2.5rem;
          background: var(--grad-main);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-size: 250% 100%;
          animation: gradShift 12s ease infinite;
        }
        @keyframes gradShift {
          50% {
            background-position: 100% 50%;
          }
        }
        .apple-copy {
          font-size: 1.05rem;
          line-height: 1.75;
          font-weight: bold;
          color: var(--txt-main);
          max-width: 720px;
          margin-inline: auto;
          text-align: left;
        }
        .apple-copy + .apple-copy {
          margin-top: 1.2rem;
        }
        @media (prefers-color-scheme: dark) {
          .apple-copy {
            color: #e5e5ea;
          }
        }

        .greeting-list {
          display: flex;
          flex-direction: column;
          gap: 3rem;
        }
        .greeting-item {
          position: relative;
          border-radius: 1.5rem;
          padding: clamp(1.8rem, 4vw, 2.4rem);
          background: #2b2b2b !important;
          backdrop-filter: blur(18px);
          border: 2px solid transparent;
          background-clip: padding-box, border-box;
          overflow: hidden;
          transition: 0.4s transform, 0.4s box-shadow;
          background-image: var(--glass-bg), var(--grad-main);
          color: var(--txt-main);
        }
        .greeting-item::before {
          content: none;
        }
        .greeting-item:hover {
          transform: translateY(-6px) scale(1.02);
          box-shadow: 0 24px 46px rgba(0, 0, 0, 0.18);
        }

        .greeting-name {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.7rem;
          line-height: 1.3;
          background: var(--grad-greeting-title);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .greeting-item .apple-copy {
          background: var(--grad-greeting-item);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        @media (prefers-color-scheme: dark) {
          .greeting-item {
            background: var(--glass-bg-dark);
            background-image: var(--glass-bg-dark), var(--grad-greeting-item);
          }
        }
      `}} />

      <section className="hero">
        <div className="hero-bg"></div>
        <div className="inner text-center" data-aos="fade-down">
          <h1 className="display-4 fw-bold">ご挨拶と概要</h1>
          <p className="lead mb-3">宇宙の学園祭の開催にあたり</p>
        </div>
      </section>

      <main>
        <section id="overview" className="apple-section" data-aos="fade-up">
          <h2 className="apple-title">概要</h2>
          <p className="gradient-text--purple">
            宇宙祭とは、月の裏側で行われる学園祭の名称です。宇宙祭では毎年、多数のイベントを行っています。学内は様々な模擬...す。またステージイベント・スタンプラリー・ビンゴが行われます。宇宙祭は、本学生や地域の方々との交流の場としても親しまれています。
          </p>
        </section>

        <section id="greetings" className="apple-section" data-aos="fade-up">
          <h2 className="apple-title">ご挨拶</h2>

          <div className="greeting-list">
            <article className="greeting-item" data-aos="fade-up" data-aos-delay="60">
              <h3 className="greeting-name">月の裏側 学長　アーモ・カーモ</h3>
              <p className="apple-copy">第100回の宇宙祭の開催おめでとうございます。今年の宇宙祭は ... 宇宙使途たちの活躍とともに、その姿をご覧いただければ幸いです。</p>
            </article>
            <article className="greeting-item" data-aos="fade-up" data-aos-delay="120">
              <h3 className="greeting-name">月の裏側 学生部長　サーダ・コーダ</h3>
              <p className="apple-copy">皆様、月の裏側の宇宙祭へ、ようこそ ... 宇宙祭として羽ばたいていくことを願っています。</p>
            </article>
            <article className="greeting-item" data-aos="fade-up" data-aos-delay="180">
              <h3 className="greeting-name">月の裏側執行部 会長　イーダ・ニーダ</h3>
              <p className="apple-copy">本日は、第100回宇宙祭にお越しいただきありがとうございます。 ... 良い思い出になることを祈念いたします。</p>
            </article>
            <article className="greeting-item" data-aos="fade-up" data-aos-delay="240">
              <h3 className="greeting-name">月の裏側イベント局 局長　サーコ・キーコ</h3>
              <p className="apple-copy">本日は第100回宇宙祭にお越しいただきありがとうございます。 ... 感謝とお礼を申し上げます。</p>
            </article>
            <article className="greeting-item" data-aos="fade-up" data-aos-delay="300">
              <h3 className="greeting-name">Web開発　川越　航太</h3>
              <p className="apple-copy">宇宙祭のサイトを見に来てくれてありがとうございます。このサイトのデザインや使いやすさは、日本の学園祭のサイトの中でトップだと自負していますが、いかかでしょうか？特に、MAPは他の宇宙祭にはない試みです。</p>
            </article>
          </div>
        </section>

        <section id="theme" className="apple-section" data-aos="fade-up">
          <h2 className="apple-title">宇宙祭実行委員会から</h2>
          <p className="gradient-text--purple">
            <strong>テーマについて</strong>
            <br />
            歴史を受け継ぎ、新たな歴史を創る」というテーマのもと、私たちは100周年を迎えました。「継承」という言葉には、過去の経験を大切にしながら、未来を切り拓く思いが込められています。
          </p>
        </section>
      </main>
    </>
  );
}
