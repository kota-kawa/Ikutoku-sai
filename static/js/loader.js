// static/loader.js
(() => {
  const MIN_DURATION = 1000;           // 1 秒
  const started = performance.now();   // 描画開始時刻

  window.addEventListener('load', () => {
    const elapsed = performance.now() - started;
    const remaining = Math.max(0, MIN_DURATION - elapsed);

    setTimeout(() => {
      document.getElementById('preloader')?.classList.add('hide');
    }, remaining);
  });
})();
