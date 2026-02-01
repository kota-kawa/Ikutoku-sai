// static/loader.js
(() => {
  const SHOW_AFTER_LOAD_MS = 2000; // ロード完了後に表示する時間
  const MAX_WAIT_MS = 12000; // ロードが終わらない場合の保険
  let loadFired = false;
  const preloader = document.getElementById("preloader");
  if (!preloader) return;

  const hide = () => {
    if (preloader.classList.contains("hide")) return;
    preloader.classList.add("hide");
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
