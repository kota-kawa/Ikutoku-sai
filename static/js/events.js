// static/js/events.js  ― エラー回避版
(() => {
  /** ************************************************************
   * 0. Leaflet バグ対策パッチ
   *    - DomUtil.remove で parentNode が null のときは無視
   *    - Marker._removeIcon にも try-catch を追加
   ************************************************************ */
  (function patchLeaflet() {
    if (!window.L || !L.DomUtil) return;

    /* DomUtil.remove を安全化 */
    const origRemove = L.DomUtil.remove;
    L.DomUtil.remove = function (el) {
      if (!el || !el.parentNode) return el;      // ← 親が無ければ何もしない
      return origRemove.call(this, el);
    };

    /* _removeIcon 内部で throw されても握りつぶす */
    const mProto       = L.Marker.prototype;
    const origRmIcon   = mProto._removeIcon;
    mProto._removeIcon = function () {
      try { origRmIcon.call(this); } catch { /* no-op */ }
    };
  })();

  /** ************************************************************
   * 1. 変数定義
   ************************************************************ */
  // map / spots / buildingLayer はインライン <script> で定義済み
  const eventLayer   = L.layerGroup().addTo(map);   // イベント用レイヤー
  const EARTH_RADIUS = 6371000;

  const RADIUS_CONFIG = {
    "K1号館": { minRadius: 8,  maxRadius: 15 },
    "K2号館": { minRadius: 10, maxRadius: 30 },
    "K3号館": { minRadius: 5,  maxRadius: 25 },
  };

  const ICON_CLASSES = {
    gourmet:     "event-icon-gourmet",
    lab:         "event-icon-lab",
    circle:      "event-icon-circle",
    performance: "event-icon-performance",
  };

  /** ************************************************************
   * 2. ユーティリティ
   ************************************************************ */
  const toRad = (deg) => (deg * Math.PI) / 180;

  function computeDistance([lat1, lng1], [lat2, lng2]) {
    const φ1 = toRad(lat1), φ2 = toRad(lat2);
    const Δφ = toRad(lat2 - lat1), Δλ = toRad(lng2 - lng1);
    const a  = Math.sin(Δφ/2)**2 +
               Math.cos(φ1)*Math.cos(φ2)*Math.sin(Δλ/2)**2;
    return 2 * EARTH_RADIUS * Math.asin(Math.sqrt(a));
  }

  function computeOffset([lat, lng], angleDeg, distMeters) {
    const δ = distMeters / EARTH_RADIUS;
    const θ = toRad(angleDeg), φ1 = toRad(lat), λ1 = toRad(lng);
    const φ2 = Math.asin(
      Math.sin(φ1)*Math.cos(δ) +
      Math.cos(φ1)*Math.sin(δ)*Math.cos(θ)
    );
    const λ2 = λ1 + Math.atan2(
      Math.sin(θ)*Math.sin(δ)*Math.cos(φ1),
      Math.cos(δ) - Math.sin(φ1)*Math.sin(φ2)
    );
    return [(φ2*180)/Math.PI, (λ2*180)/Math.PI];
  }

  function createEventIcon(category) {
    const cls = ICON_CLASSES[category] ?? "";
    return L.divIcon({
      className: "",
      html: `
        <div class="custom-icon ${cls}">
          <div class="icon-image"
               style="background-image:url('./static/sunset.webp')"></div>
        </div>`,
      iconSize:   [50, 60],
      iconAnchor: [25, 60],
    });
  }

  /** ************************************************************
   * 3. レイヤーのリセット（安全版）
   ************************************************************ */
  function resetEventLayer() {
    // 旧 clearLayers() だと稀に DOM が壊れてエラーになるため手動で除去
    eventLayer.eachLayer((l) => {
      try { eventLayer.removeLayer(l); } catch {/* ignore */}
    });
  }

  /** ************************************************************
   * 4. イベントピン描画
   ************************************************************ */
  function showEventPins(category) {
    resetEventLayer();

    if (map.hasLayer(buildingLayer)) map.removeLayer(buildingLayer);

    spots.forEach((s) => {
      const evts = (s.events && s.events[category]) || [];
      if (!evts.length) return;

      const cfg       = RADIUS_CONFIG[s.name] || {};
      const minR      = cfg.minRadius ?? 8;
      const maxR      = cfg.maxRadius ?? Math.min(minR + evts.length * 5, 60);
      const minSpace  = 10;
      const placedPos = [];

      evts.forEach((evt) => {
        let pos, tries = 0;
        do {
          const angle  = Math.random() * 360;
          const radius = minR + Math.random() * (maxR - minR);
          pos          = computeOffset(s.location, angle, radius);
          tries++;
        } while (
          tries < 50 &&
          placedPos.some((p) => computeDistance(p, pos) < minSpace)
        );
        placedPos.push(pos);

        L.marker(pos, { icon: createEventIcon(category) })
        .on("click", (ev) => {
          L.DomEvent.stopPropagation(ev);              // ← 追加
          showDetails({
            image: "./static/sunset.webp",
            name:  evt.name,
            description: evt.description,
            address: evt.venue,
            phone: evt.contact,
          });
        })
        .addTo(eventLayer);
      });
    });
  }

  /** ************************************************************
   * 5. メニューバーのボタン
   ************************************************************ */
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".menu-bar button.btn-light").forEach((btn) => {
      const label = btn.textContent.trim();

      if (label.includes("全体")) {
        btn.addEventListener("click", () => {
          resetEventLayer();
          if (!map.hasLayer(buildingLayer)) map.addLayer(buildingLayer);
        });
      } else if (label.includes("研究室")) {
        btn.addEventListener("click", () => showEventPins("lab"));
      } else if (label.includes("グルメ")) {
        btn.addEventListener("click", () => showEventPins("gourmet"));
      } else if (label.includes("サークル")) {
        btn.addEventListener("click", () => showEventPins("circle"));
      } else if (label.includes("演奏") || label.includes("劇")) {
        btn.addEventListener("click", () => showEventPins("performance"));
      }
    });
  });
})();
