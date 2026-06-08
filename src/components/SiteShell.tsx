// Client-side effects are required to avoid hydration mismatches from inline scripts.
"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { festivalConfig } from "../config/festival";

export default function SiteShell({ children }: { children: ReactNode }) {
  useEffect(() => {
    const loadScript = (src: string, id?: string) =>
      new Promise<void>((resolve, reject) => {
        if (id && document.getElementById(id)) {
          resolve();
          return;
        }
        if (!id && document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }
        const script = document.createElement("script");
        if (id) script.id = id;
        script.src = src;
        script.async = false;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load ${src}`));
        document.body.appendChild(script);
      });

    const init = async () => {
      try {
        await loadScript(
          "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js",
          "bootstrap-js"
        );
        await loadScript("https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.js", "aos-js");
        const w = window as Window & { AOS?: { init: (opts: unknown) => void } };
        w.AOS?.init({ once: true, offset: 120, duration: 700 });
      } catch {
        // ignore third-party script failures
      }
    };

    init();

    const burger = document.getElementById("burgerBtn");
    const mobile = document.getElementById("mobileMenu");
    const onBurgerClick = () => {
      burger?.classList.toggle("active");
      mobile?.classList.toggle("open");
    };
    burger?.addEventListener("click", onBurgerClick);

    const onDocClick = (e: MouseEvent) => {
      if (!mobile) return;
      if (
        mobile.classList.contains("open") &&
        !mobile.contains(e.target as Node) &&
        !burger?.contains(e.target as Node)
      ) {
        burger?.click();
      }
    };
    document.addEventListener("click", onDocClick);

    const container = document.querySelector(".bubbles");
    if (container && !container.querySelector(".bubble")) {
      const count = 30;
      for (let i = 0; i < count; i += 1) {
        const b = document.createElement("div");
        b.classList.add("bubble");
        const size = 10 + Math.random() * 20;
        b.style.width = `${size}px`;
        b.style.height = `${size}px`;
        b.style.left = `${Math.random() * 100}%`;
        const duration = 6 + Math.random() * 6;
        b.style.animationDuration = `${duration}s`;
        b.style.animationDelay = `${Math.random() * 5}s`;
        container.appendChild(b);
      }
    }

    const navbar = document.querySelector(".navbar");
    const onScroll = () => {
      if (!navbar) return;
      navbar.classList.toggle("scrolled", window.scrollY > 60);
    };
    window.addEventListener("scroll", onScroll);

    return () => {
      burger?.removeEventListener("click", onBurgerClick);
      document.removeEventListener("click", onDocClick);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
    /* まずデフォルト余白をリセット */
    html,
    body {
      scroll-behavior: smooth;

  overflow-x: hidden;
  /* 必要なら margin や padding のリセットも */
  margin: 0;
  padding: 0;
    }

    :root {
      --kait-green: #32CD32;
      --kait-purple: #8A2BE2;
      --dark-overlay: rgba(0, 0, 0, 0.6);
      --pill-border: #e8eff2;
      --menu-bg: rgba(142, 185, 195, 0.9);
    }

    body {
      font-family: 'Noto Sans JP', sans-serif;
      background: linear-gradient(120deg, #f8f9fa 0%, #eef2f7 50%, #e3e8f0 100%);
      color: #343a40;
      overflow-x: hidden;

    }
  `
        }}
      />

      <style
        dangerouslySetInnerHTML={{
          __html: `
    /* --- 既存 footer --- */
    footer {
      background: #212529;
      color: #adb5bd;
      padding: 1rem 0;
    }

    /* ----- ご協賛 見出し ----- */
    footer .sponsors-section {
      margin-bottom: 2rem;
    }

    footer .sponsors-title {
      text-align: center;
      font-size: 2.5rem;
      font-weight: 500;
      color: #387fc5;
      margin-bottom: 0.75rem;
    }

    /* --- 協賛ロゴセクション --- */
    footer .sponsors {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
      /* フッター本文との間隔 */
    }

    footer .sponsor-item {
      /* 横３列：gap を考慮して 33.333% − (gap×割合) */
      flex: 0 1 calc(33.333% - 1rem);
      max-width: calc(33.333% - 1rem);
      height: 180px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #fff;
      /* 白背景にしたい場合 */
      padding: 0.5rem;
      border-radius: 0.25rem;
      box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    footer .sponsor-item img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }


    /* スマホ表示（目安：576px以下）で１列表示 */
    @media (max-width: 576px) {

      /* ロゴアイテムを1列にして、高さは自動に */
      footer .sponsor-item {
        flex: 1 1 100% !important;
        max-width: 100% !important;
        height: auto !important;
        /* 固定高さを解除 */
        overflow: visible;
        /* はみ出しを隠さない */
        margin-bottom: 1rem;
        /* ロゴ間に余白を追加 */
      }

      /* 画像も縦横自動調整 */
      footer .sponsor-item img {
        width: 80%;
        /* 見切れない程度に縮小 */
        height: auto;
        object-fit: contain;
        display: block;
        margin: 0 auto;
        /* 中央寄せ */
      }

      /* 必要なら .sponsors 自体も縦並びに */
      footer .sponsors {
        flex-direction: column;
        align-items: center;
      }
    }
  `
        }}
      />

      <style
        dangerouslySetInnerHTML={{
          __html: `
    /* 泡コンテナ */
    .bubbles {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      overflow: hidden;
      z-index: 2000;
      /* 背景に配置 */
    }

    .bubble {
      position: absolute;
      bottom: -50px;
      background: rgba(173, 216, 230, 0.7);
      /* 薄い水色 */
      border-radius: 50%;
      opacity: 0.8;
      animation: rise 8s infinite ease-in;
    }

    @keyframes rise {
      0% {
        transform: translateY(0) scale(0.5);
        opacity: 0.8;
      }

      80% {
        opacity: 0.4;
      }

      100% {
        transform: translateY(-120vh) scale(1);
        opacity: 0;
      }
    }

    .bubble:nth-child(1) {
      width: 15px;
      height: 15px;
      left: 10%;
      animation-duration: 7s;
      animation-delay: 0s;
    }

    .bubble:nth-child(2) {
      width: 20px;
      height: 20px;
      left: 25%;
      animation-duration: 9s;
      animation-delay: 2s;
    }

    .bubble:nth-child(3) {
      width: 12px;
      height: 12px;
      left: 40%;
      animation-duration: 6s;
      animation-delay: 1s;
    }

    .bubble:nth-child(4) {
      width: 18px;
      height: 18px;
      left: 55%;
      animation-duration: 8s;
      animation-delay: 3s;
    }

    .bubble:nth-child(5) {
      width: 22px;
      height: 22px;
      left: 70%;
      animation-duration: 10s;
      animation-delay: 4s;
    }

    .bubble:nth-child(6) {
      width: 14px;
      height: 14px;
      left: 85%;
      animation-duration: 7.5s;
      animation-delay: 2.5s;
    }

    /* 必要に応じて8〜20個程度まで増やしてください */
  `
        }}
      />

      <style
        dangerouslySetInnerHTML={{
          __html: `
    /* リセット */
    html,
    body {
      margin: 0;
      padding: 0;
    }

    :root {
      /* pill の共通枠線 */
      --pill-border: #e8eff2;
      /* メニュー背景：favicon に合わせたブルーのグラデーション */
      --menu-bg-from: rgba(141, 204, 251, 0.9);
      /* #8DCCFB */
      --menu-bg-to: rgba(5, 83, 215, 0.9);
      /* #0553D7 */
      /* ホバー時の白透過 */
      --hover-bg: rgba(255, 255, 255, 0.25);
    }


    /* 古いBootstrapナビは隠す */
    .navbar,
    #navMenu {
      display: none !important;
    }

    .mobile-menu {
      display: none;
    }

    /* ヘッダー全体 */
    .custom-header {
      position: fixed;
      top: 2%;
      left: 0;
      width: 100%;
      display: flex;
      justify-content: center;
      pointer-events: none;
      z-index: 1000;
    }

    .header-inner {
      display: flex;
      align-items: center;
      gap: 2.5rem;
      padding: 0.6rem 0;
      /* 縦幅 */
      pointer-events: auto;
    }

    /* ロゴpill */
    .logo-pill {
      display: flex;
      align-items: center;
      gap: .8rem;
      background: #fff;
      border: 4px solid var(--pill-border);
      border-radius: 40px;
      padding: .1rem 1.6rem;
      text-decoration: none;
    }

    .logo-pill img {
      width: 2rem;
      height: 2rem;
    }

    .logo-pill span {
      font-family: 'Noto Sans JP', sans-serif;
      font-weight: 700;
      font-size: 1.25rem;
      color: #2a4d6e;
    }

    /* メニューpill */
    .menu-pill {
      display: flex;
      align-items: center;
      gap: 2rem;
      background: linear-gradient(90deg,
          var(--menu-bg-from),
          var(--menu-bg-to));
      border: 4px solid var(--pill-border);
      border-radius: 40px;
      padding: .1rem 2.2rem;
      list-style: none;
      margin: 0;
    }

    .menu-pill a {
      display: inline-block;
      font-family: 'Noto Sans JP', sans-serif;
      font-weight: 700;
      font-size: 1.2rem;
      color: #fff;
      text-decoration: none;
      padding: .25rem .5rem;
      border-radius: 8px;
      transition: background-color .2s;
    }

    .menu-pill a:hover {
      background-color: var(--hover-bg);
    }

    /* モバイル対応 */
    .burger {
      display: none;
    }

    @media (max-width: 992px) {
      .menu-pill {
        display: none;
      }

      .burger {
        display: flex;
        flex-direction: column;
        gap: 5px;
        background: linear-gradient(90deg,
            var(--menu-bg-from),
            var(--menu-bg-to));
        border: 4px solid var(--pill-border);
        border-radius: 30px;
        padding: .6rem .9rem;
        cursor: pointer;
      }

      .burger span {
        width: 24px;
        height: 2px;
        background: #fff;
        border-radius: 1px;
        transition: .3s;
      }

      .burger.active span:nth-child(1) {
        transform: translateY(6px) rotate(45deg);
      }

      .burger.active span:nth-child(2) {
        opacity: 0;
      }

      .burger.active span:nth-child(3) {
        transform: translateY(-6px) rotate(-45deg);
      }

      .mobile-menu {
        position: absolute;
        top: calc(100% + .8rem);
        right: 0;
        display: none;
        flex-direction: column;
        gap: 1rem;
        background: linear-gradient(90deg,
            var(--menu-bg-from),
            var(--menu-bg-to));
        border: 4px solid var(--pill-border);
        border-radius: 20px;
        padding: 1rem 1.5rem;
        margin-right: 5%;
      }

      .mobile-menu.open {
        display: flex;
      }

      .mobile-menu a {
        font-family: 'Noto Sans JP', sans-serif;
        font-weight: 700;
        font-size: 1.15rem;
        color: #fff;
        text-decoration: none;
        padding: .2rem .4rem;
        border-radius: 6px;
        transition: background-color .2s;
      }

      .mobile-menu a:hover {
        background-color: var(--hover-bg);
      }
    }
  `
        }}
      />

      <div className="bubbles"></div>

      <nav className="custom-header">
        <div className="header-inner">
          <a href="/" className="logo-pill">
            <img src="/static/favicon.png" alt={`${festivalConfig.festivalName}ロゴ`} />
            <span>{festivalConfig.festivalName}</span>
          </a>

          <ul className="menu-pill">
            <li>
              <a href="/about">ご挨拶</a>
            </li>
            <li>
              <a href="/announce">アクセス</a>
            </li>
            <li>
              <a href="/event">企画一覧</a>
            </li>
            <li>
              <a href="/map">MAP</a>
            </li>
          </ul>

          <button className="burger" id="burgerBtn" aria-label="メニュー">
            <span></span>
            <span></span>
            <span></span>
          </button>
          <div className="mobile-menu" id="mobileMenu">
            <a href="/about">ご挨拶</a>
            <a href="/announce">アクセス</a>
            <a href="/event">企画一覧</a>
            <a href="/map">MAP</a>
          </div>
        </div>
      </nav>

      <main className="">{children}</main>

      <footer className="text-center">
        <div className="container">
          <small>
            © {festivalConfig.footerYear} {festivalConfig.organizerName}&nbsp;|&nbsp;
            <a href="/bingo" className="text-decoration-none text-light">
              ビンゴ(運営用)
            </a>
            &nbsp;|&nbsp;
            <a
              href={festivalConfig.footerExternalLink.href}
              className="text-decoration-none text-light"
              target="_blank"
            >
              {festivalConfig.footerExternalLink.label}
            </a>
            &nbsp;|&nbsp;
          </small>

          <div className="sponsors-section">
            <h2 className="sponsors-title">{festivalConfig.sponsorsTitle}</h2>

            <div className="sponsors">
              <a
                href="https://example.com/sponsor1"
                className="sponsor-item"
                target="_blank"
                rel="noopener"
              >
                <img src="/static/AD/ad1.webp" alt="Sponsor 1" loading="lazy" />
              </a>
              <a
                href="https://example.com/sponsor2"
                className="sponsor-item"
                target="_blank"
                rel="noopener"
              >
                <img src="/static/AD/ad2.webp" alt="Sponsor 2" loading="lazy" />
              </a>
              <a
                href="https://example.com/sponsor3"
                className="sponsor-item"
                target="_blank"
                rel="noopener"
              >
                <img src="/static/AD/ad3.webp" alt="Sponsor 3" loading="lazy" />
              </a>
              <a
                href="https://example.com/sponsor4"
                className="sponsor-item"
                target="_blank"
                rel="noopener"
              >
                <img src="/static/AD/ad4.webp" alt="Sponsor 4" loading="lazy" />
              </a>
              <a
                href="https://example.com/sponsor5"
                className="sponsor-item"
                target="_blank"
                rel="noopener"
              >
                <img src="/static/AD/ad5.webp" alt="Sponsor 5" loading="lazy" />
              </a>
              <a
                href="https://example.com/sponsor6"
                className="sponsor-item"
                target="_blank"
                rel="noopener"
              >
                <img src="/static/AD/ad6.webp" alt="Sponsor 6" loading="lazy" />
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* scripts moved to client effects to avoid hydration mismatch */}
    </>
  );
}
