// static/js/events.js
(() => {
  const eventLayer   = L.layerGroup();
  const EARTH_RADIUS = 6371000;

  // 建物ごとにピン表示範囲を設定
  const RADIUS_CONFIG = {
    "K1号館": { minRadius: 8,  maxRadius: 15 },
    "K2号館": { minRadius: 10, maxRadius: 30 },
    "K3号館": { minRadius: 5,  maxRadius: 25 },
    // 必要に応じて他の建物を追加
  };

  // カテゴリ → CSS クラス名マップ
  const ICON_CLASSES = {
    gourmet:     'event-icon-gourmet',
    lab:         'event-icon-lab',
    circle:      'event-icon-circle',
    performance: 'event-icon-performance'
  };

  // 度→ラジアン
  function toRad(deg) { return deg * Math.PI / 180; }

  // 球面上の2点間距離
  function computeDistance([lat1, lng1], [lat2, lng2]) {
    const φ1 = toRad(lat1), φ2 = toRad(lat2);
    const Δφ = toRad(lat2 - lat1), Δλ = toRad(lng2 - lng1);
    const a = Math.sin(Δφ/2)**2 +
              Math.cos(φ1)*Math.cos(φ2)*Math.sin(Δλ/2)**2;
    return 2 * EARTH_RADIUS * Math.asin(Math.sqrt(a));
  }

  // 方向と距離だけオフセットした座標を返す
  function computeOffset([lat, lng], angleDeg, distMeters) {
    const δ  = distMeters / EARTH_RADIUS;
    const θ  = toRad(angleDeg), φ1 = toRad(lat), λ1 = toRad(lng);
    const φ2 = Math.asin(
      Math.sin(φ1)*Math.cos(δ) +
      Math.cos(φ1)*Math.sin(δ)*Math.cos(θ)
    );
    const λ2 = λ1 + Math.atan2(
      Math.sin(θ)*Math.sin(δ)*Math.cos(φ1),
      Math.cos(δ) - Math.sin(φ1)*Math.sin(φ2)
    );
    return [φ2 * 180/Math.PI, λ2 * 180/Math.PI];
  }

  // カテゴリに応じたアイコンを作成
  function createEventIcon(category) {
    const cls = ICON_CLASSES[category] || '';
    return L.divIcon({
      className: "",
      html: `
        <div class="custom-icon ${cls}">
          <div class="icon-image" style="background-image:url('./static/sunset.webp')"></div>
        </div>`,
      iconSize:   [50, 60],
      iconAnchor: [25, 60],
    });
  }

  // イベントピンを表示（前のピンは clearLayers() のみで削除）
  function showEventPins(category) {
    // 1) まず既存のピンをクリア
    eventLayer.clearLayers();

    // 2) 建物レイヤーがあれば隠す
    if (map.hasLayer(buildingLayer)) {
      map.removeLayer(buildingLayer);
    }

    // 3) 新規ピンを追加
    spots.forEach(s => {
      const evts = (s.events && s.events[category]) || [];
      if (!evts.length) return;

      // 建物ごとの範囲取得
      const cfg = RADIUS_CONFIG[s.name] || {};
      const defaultMin = 8;
      const defaultMax = Math.min(defaultMin + evts.length * 5, 60);
      const minRadius = cfg.minRadius != null ? cfg.minRadius : defaultMin;
      const maxRadius = cfg.maxRadius != null ? cfg.maxRadius : defaultMax;
      const minSpacing = 10;
      const placed = [];

      evts.forEach(evt => {
        let pos, attempt = 0;
        do {
          const angle  = Math.random() * 360;
          const radius = minRadius + Math.random() * (maxRadius - minRadius);
          pos = computeOffset(s.location, angle, radius);
          attempt++;
        } while (
          attempt < 50 &&
          placed.some(p => computeDistance(p, pos) < minSpacing)
        );
        placed.push(pos);

        const marker = L.marker(pos, {
          icon: createEventIcon(category)
        }).on('click', () => showDetails({
          image:       './static/sunset.webp',
          name:        evt.name,
          description: evt.description,
          address:     evt.venue,
          phone:       evt.contact
        }));
        eventLayer.addLayer(marker);
      });
    });

    // 4) 生成したイベントレイヤーをマップに追加（すでに追加済みでも問題なし）
    if (!map.hasLayer(eventLayer)) {
      eventLayer.addTo(map);
    }
  }

  // メニューバーのボタン設定
  document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.menu-bar button.btn-light');

    buttons.forEach(btn => {
      const txt = btn.textContent.trim();

      if (txt.includes('全体')) {
        btn.addEventListener('click', () => {
          // イベントピンをクリアして建物レイヤーを再表示
          eventLayer.clearLayers();
          if (!map.hasLayer(buildingLayer)) {
            map.addLayer(buildingLayer);
          }
        });
      }
      else if (txt.includes('研究室')) {
        btn.addEventListener('click', () => showEventPins('lab'));
      }
      else if (txt.includes('グルメ')) {
        btn.addEventListener('click', () => showEventPins('gourmet'));
      }
      else if (txt.includes('サークル')) {
        btn.addEventListener('click', () => showEventPins('circle'));
      }
      else if (txt.includes('演奏') || txt.includes('劇')) {
        btn.addEventListener('click', () => showEventPins('performance'));
      }
    });
  });
})();
