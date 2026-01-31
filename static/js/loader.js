// static/loader.js
(() => {
  const SHOW_AFTER_LOAD_MS = 2000; // ロード完了後に表示する時間
  const MAX_WAIT_MS = 12000; // ロードが終わらない場合の保険
  let loadFired = false;
  const preloader = document.getElementById("preloader");
  if (preloader) {
    preloader.style.position = "fixed";
    preloader.style.inset = "0";
    preloader.style.zIndex = "9999";
    preloader.style.background = "#000";
    preloader.style.display = "flex";
    preloader.style.overflow = "hidden";
    preloader.style.opacity = "1";
    preloader.style.visibility = "visible";
    const frame = preloader.querySelector("iframe");
    if (frame) {
      frame.style.border = "none";
      frame.style.width = "100vw";
      frame.style.height = "100vh";
      frame.style.pointerEvents = "none";
    }
  }

  const hide = () => {
    if (!preloader || preloader.classList.contains("hide")) return;
    preloader.classList.add("hide");
    preloader.style.transition = "opacity .6s ease";
    preloader.style.opacity = "0";
    window.setTimeout(() => {
      if (!preloader) return;
      preloader.style.visibility = "hidden";
      preloader.style.pointerEvents = "none";
    }, 650);
  };

  const onLoad = () => {
    if (loadFired) return;
    loadFired = true;
    window.setTimeout(hide, SHOW_AFTER_LOAD_MS);
  };

  if (document.readyState === "complete") {
    onLoad();
  } else {
    window.addEventListener("load", onLoad, { once: true });
  }

  window.setTimeout(() => {
    if (!loadFired) hide();
  }, MAX_WAIT_MS);
})();
