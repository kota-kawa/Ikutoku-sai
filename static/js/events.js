// static/js/events.js
(() => {
    const eventLayer = L.layerGroup();
    const EARTH_RADIUS = 6371000;
  
    // カテゴリ → CSS クラス名マップ
    const ICON_CLASSES = {
      gourmet:     'event-icon-gourmet',
      lab:         'event-icon-lab',
      circle:      'event-icon-circle',
      performance: 'event-icon-performance'
    };
  
    function toRad(deg) { return deg * Math.PI / 180; }
    function computeDistance([lat1, lng1], [lat2, lng2]) {
      const φ1 = toRad(lat1), φ2 = toRad(lat2);
      const Δφ = toRad(lat2 - lat1), Δλ = toRad(lng2 - lng1);
      const a = Math.sin(Δφ/2)**2 +
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
      return [φ2*180/Math.PI, λ2*180/Math.PI];
    }
  
    // カテゴリごとのアイコンを作成
    function createEventIcon(category) {
      const cls = ICON_CLASSES[category] || '';
      return L.divIcon({
        className: "",
        html: `
          <div class="custom-icon ${cls}">
            <div class="icon-image" style="background-image:url('./static/sunset.webp')"></div>
          </div>`,
        iconSize: [50, 60],
        iconAnchor: [25, 60],
      });
    }
  
    // ランダム非重複配置でイベントピンを表示
    function showEventPins(category) {
      eventLayer.clearLayers();
      spots.forEach(s => {
        const evts = (s.events && s.events[category]) || [];
        const n = evts.length;
        if (n === 0) return;
  
        const minRadius   = 8;
        const maxRadius   = Math.min(8 + n * 5, 60);
        const minSpacing  = 10;
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
      map.addLayer(eventLayer);
    }
  
    // メニューのボタンテキストでカテゴリを判別して登録
    document.addEventListener('DOMContentLoaded', () => {
      const btns       = Array.from(document.querySelectorAll('.menu-bar button.btn-light'));
      const homeBtn    = btns.find(b => b.textContent.includes('全体'));
      const labBtn     = btns.find(b => b.textContent.includes('研究室'));
      const gourmetBtn = btns.find(b => b.textContent.includes('グルメ'));
      const circleBtn  = btns.find(b => b.textContent.includes('サークル'));
      const perfBtn    = btns.find(b => b.textContent.includes('演奏'));
  
      if (homeBtn) {
        homeBtn.addEventListener('click', () => {
          map.removeLayer(eventLayer);
          map.addLayer(buildingLayer);
        });
      }
      if (labBtn) {
        labBtn.addEventListener('click', () => {
          map.removeLayer(buildingLayer);
          showEventPins('lab');
        });
      }
      if (gourmetBtn) {
        gourmetBtn.addEventListener('click', () => {
          map.removeLayer(buildingLayer);
          showEventPins('gourmet');
        });
      }
      if (circleBtn) {
        circleBtn.addEventListener('click', () => {
          map.removeLayer(buildingLayer);
          showEventPins('circle');
        });
      }
      if (perfBtn) {
        perfBtn.addEventListener('click', () => {
          map.removeLayer(buildingLayer);
          showEventPins('performance');
        });
      }
    });
  })();
  