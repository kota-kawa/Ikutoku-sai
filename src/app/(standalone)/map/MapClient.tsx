"use client";

import { useEffect } from "react";

type LeafletMarker = {
  getElement: () => HTMLElement | null;
  getLatLng: () => { lat: number; lng: number };
  on: (event: string, handler: (ev: any) => void) => LeafletMarker;
  addTo: (layer: unknown) => LeafletMarker;
  setLatLng: (latlng: [number, number]) => void;
  setIcon: (icon: unknown) => void;
};

type LeafletLayerGroup = {
  addTo: (map: unknown) => LeafletLayerGroup;
  addLayer: (layer: unknown) => void;
  removeLayer: (layer: unknown) => void;
  eachLayer: (cb: (layer: LeafletMarker) => void) => void;
  hasLayer: (layer: unknown) => boolean;
};

type LeafletMap = {
  latLngToContainerPoint: (loc: { lat: number; lng: number }) => {
    distanceTo: (pt: { x: number; y: number }) => number;
  };
  on: (event: string, handler: (ev: any) => void) => void;
  latLngToLayerPoint: (loc: { lat: number; lng: number }) => { x: number; y: number };
  hasLayer: (layer: unknown) => boolean;
  addLayer: (layer: unknown) => void;
  removeLayer: (layer: unknown) => void;
};

type LeafletGlobal = {
  map: (id: string, opts: Record<string, unknown>) => LeafletMap;
  tileLayer: (url: string, opts: Record<string, unknown>) => {
    addTo: (map: unknown) => void;
    on: (event: string, handler: (ev: any) => void) => void;
  };
  layerGroup: () => LeafletLayerGroup;
  divIcon: (opts: Record<string, unknown>) => unknown;
  marker: (loc: [number, number], opts: Record<string, unknown>) => LeafletMarker;
  polygon: (coords: [number, number][], opts: Record<string, unknown>) => { addTo: (map: unknown) => void };
  DomEvent: {
    stopPropagation: (ev: unknown) => void;
    disableClickPropagation: (el: HTMLElement) => void;
    disableScrollPropagation: (el: HTMLElement) => void;
  };
  DomUtil: {
    remove: (el: HTMLElement) => void;
  };
  Marker: {
    prototype: {
      _removeIcon: () => void;
    };
  };
};

// --- Event Data Definition ---
const eventData = {
  gourmet: [
    { building: "K1号館", name: "カフェAlpha",       description: "焙煎珈琲とケーキのお店",       venue: "K1号館 1F 大ホール横",             contact: "046-123-4567" },
    { building: "K1号館", name: "パン屋Beta",         description: "焼きたてパン各種",             venue: "K1号館 正面入口前",               contact: "046-987-6543" },
    { building: "K2号館", name: "ラーメンGamma",      description: "あっさり醤油ラーメン",         venue: "K2号館 東側",                     contact: "046-555-1212" },
    { building: "K1号館", name: "和菓子屋Delta",      description: "季節の和菓子と抹茶セット",     venue: "K1号館 2F ロビー横",              contact: "046-111-0001" },
    { building: "K1号館", name: "アイスEpsilon",      description: "手作りアイスクリーム各種",     venue: "K1号館 1F 中央ホール",            contact: "046-111-0002" },
    { building: "K1号館", name: "居酒屋Zeta",         description: "地元食材を使ったおつまみ",     venue: "K1号館 3F イベントホール入口",    contact: "046-111-0003" },
    { building: "K1号館", name: "カレーEta",          description: "スパイシーチキンカレー",       venue: "K1号館 B1F フードコート",          contact: "046-111-0004" },
    { building: "K1号館", name: "寿司Theta",          description: "新鮮な地魚を使った寿司",       venue: "K1号館 4F テラス",                contact: "046-111-0005" }
  ],
  lab: [
    { building: "K1号館",     name: "AI研究室見学",      description: "最先端AI技術の展示",         venue: "K1号館 1F 情報棟",                contact: "046-222-0001" },
    { building: "K2号館",     name: "ロボ研公開",        description: "自律移動ロボットのデモ",       venue: "K2号館 2F 実験室",                contact: "046-222-0002" }
  ],
  circle: [
    { building: "K3号館",     name: "バスケ部トライアウト", description: "初心者歓迎！",               venue: "K3号館 体育館",                  contact: "046-333-0001" },
    { building: "K4号館",     name: "吹奏楽部演奏会",     description: "クラシック&ポップス演奏",     venue: "K4号館 ロビー",                  contact: "046-333-0002" }
  ],
  performance: [
    { building: "KAITアリーナ", name: "演劇部公演『青春劇場』", description: "若き日の物語を演じます",   venue: "KAITアリーナ メインステージ",    contact: "046-444-0001" },
    { building: "広場",          name: "軽音楽部ライブ",       description: "バンド演奏ライブ",         venue: "広場 ステージ",                  contact: "046-444-0002" }
  ]
};

const RADIUS_CONFIG: Record<string, { minRadius: number; maxRadius: number }> = {
  "K1号館": { minRadius: 8,  maxRadius: 15 },
  "K2号館": { minRadius: 10, maxRadius: 30 },
  "K3号館": { minRadius: 5,  maxRadius: 25 },
};

const ICON_CLASSES: Record<string, string> = {
  gourmet:     "event-icon-gourmet",
  lab:         "event-icon-lab",
  circle:      "event-icon-circle",
  performance: "event-icon-performance",
};

export default function MapClient() {
  useEffect(() => {
    let cancelled = false;

    // Helper to promote print media stylesheets
    document.querySelectorAll('link[media="print"]').forEach((link) => {
      const el = link as HTMLLinkElement;
      const promote = () => { el.media = "all"; };
      if (el.sheet) { promote(); } else { el.addEventListener("load", promote, { once: true }); }
    });

    const loadScript = (src: string) => new Promise<void>((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load ${src}`));
        document.body.appendChild(script);
      });

    const init = async () => {
      try {
        await loadScript("https://unpkg.com/leaflet@1.7.1/dist/leaflet.js");
        await loadScript("https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js");
      } catch (e) {
        console.warn("Script load error", e);
      }

      if (cancelled) return;

      const w = window as any;
      const L = w.L as LeafletGlobal;
      if (!L) return;

      // --- Leaflet Patches ---
      if (L.DomUtil) {
        const origRemove = L.DomUtil.remove;
        L.DomUtil.remove = function (el: HTMLElement) {
          if (!el || !el.parentNode) return;
          return origRemove.call(this, el);
        };
        const mProto = L.Marker.prototype;
        const origRmIcon = mProto._removeIcon;
        mProto._removeIcon = function () {
          try { origRmIcon.call(this); } catch { /* no-op */ }
        };
      }

      // --- Main Map Logic ---
      const INITIAL_CENTER: [number, number] = [35.486417749642015, 139.3428098153942];
      const map = L.map('map', {
        center: INITIAL_CENTER,
        zoom: 18,
        minZoom: 5,
        maxZoom: 19,
        zoomControl: true,
        scrollWheelZoom: true,
        touchZoom: true
      });

      const buildingLayer = L.layerGroup().addTo(map);
      const eventLayer = L.layerGroup().addTo(map);

      let cancelNextMarkerClick = false;
      let focusedMarker: LeafletMarker | null = null;
      let detailsOverlay: HTMLElement | null = null;

      const AERIAL_TILE = "https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg";
      const FALLBACK_TILE = "https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png";
      const tileLayer = L.tileLayer(AERIAL_TILE, {
        maxNativeZoom: 18,
        maxZoom: 19,
      });
      tileLayer.on("tileerror", (ev: any) => {
        if (!ev || !ev.tile || !ev.coords) return;
        if (ev.tile.dataset && ev.tile.dataset.fallbackApplied) return;
        const fallback = FALLBACK_TILE
          .replace("{z}", ev.coords.z)
          .replace("{x}", ev.coords.x)
          .replace("{y}", ev.coords.y);
        if (ev.tile.dataset) ev.tile.dataset.fallbackApplied = "1";
        ev.tile.src = fallback;
      });
      tileLayer.addTo(map);

      // --- Spots Data ---
      const spots = [
        { location: [35.48604116703019, 139.34128951057255], image: "/static/map/K1号館.webp", name: "K1号館" },
        { location: [35.48650866834297, 139.34112683577234], image: "/static/map/K2号館.webp", name: "K2号館" },
        { location: [35.48565158052546, 139.34141709865116], image: "/static/map/K3号館.webp", name: "K3号館" },
        { location: [35.485683613095844, 139.3419922129912], image: "/static/map/K4号館.webp", name: "K4号館" },
        { location: [35.485597402140684, 139.34321173217694], image: "/static/map/KAITアリーナ.webp", name: "KAITアリーナ" },
        { location: [35.4860692562503, 139.34187073632998], image: "/static/map/先進研.webp", name: "先進研" },
        { location: [35.48714378031437, 139.34102852276388], image: "/static/map/バイオ棟.webp", name: "バイオ棟" },
        { location: [35.4876058212225, 139.34111663074825], image: "/static/map/自動車棟.webp", name: "自動車棟" },
        { location: [35.48768007599212, 139.34208759034047], image: "/static/map/ロボット.webp", name: "ロボット" },
        { location: [35.48638279161658, 139.34182473387625], image: "/static/map/広場.webp", name: "広場" },
        { location: [35.487920311541316, 139.3430478210974], image: "/static/map/自動車工房.webp", name: "自動車工房" },
        { location: [35.4867846462545, 139.34246309957499], image: "/static/map/KAIT工房.webp", name: "KAIT工房" },
        { location: [35.486649238937936, 139.34321411804413], image: "/static/map/KAIT広場.webp", name: "KAIT広場" },
        { location: [35.44134206079602, 139.3663787109304], image: "/static/map/厚木バスセンター.webp", name: "厚木バスセンター" },
        { location: [35.44012426180783, 139.36467281666947], image: "/static/map/本厚木駅前バス停.webp", name: "本厚木駅前バス停" },
        { location: [35.48543014113195, 139.34095161222936], image: "/static/map/神奈川工科大学前バス停.webp", name: "神奈川工科大学前バス停" },
        { location: [35.48549264919395, 139.3410855002179], image: "/static/map/本厚木駅直行バス停.webp", name: "本厚木駅直行バス停" },
      ];

      // Merge event data into spots
      Object.entries(eventData).forEach(([category, arr]) => {
        arr.forEach(evt => {
          const spot: any = spots.find(s => s.name === evt.building);
          if (!spot) {
            console.warn(`Event target not found: ${evt.building}`);
            return;
          }
          if (!spot.events) spot.events = {};
          if (!spot.events[category]) spot.events[category] = [];
          spot.events[category].push({
            name: evt.name,
            description: evt.description,
            venue: evt.venue,
            contact: evt.contact
          });
        });
      });

      // --- Utilities ---
      const toRad = (d: number) => (d * Math.PI) / 180;
      const toDeg = (r: number) => (r * 180) / Math.PI;
      const EARTH_R = 6371000;

      function getScreenAngle() {
        return (
          (screen.orientation && screen.orientation.angle) ||
          (window as any).orientation ||
          0
        );
      }

      function calcBearing(lat1: number, lon1: number, lat2: number, lon2: number) {
        const φ1 = toRad(lat1), φ2 = toRad(lat2), λ1 = toRad(lon1), λ2 = toRad(lon2);
        const y = Math.sin(λ2 - λ1) * Math.cos(φ2);
        const x =
          Math.cos(φ1) * Math.sin(φ2) -
          Math.sin(φ1) * Math.cos(φ2) * Math.cos(λ2 - λ1);
        return (toDeg(Math.atan2(y, x)) + 360) % 360;
      }

      function computeDistance([lat1, lng1]: [number, number], [lat2, lng2]: [number, number]) {
        const φ1 = toRad(lat1), φ2 = toRad(lat2);
        const Δφ = toRad(lat2 - lat1), Δλ = toRad(lng2 - lng1);
        const a  = Math.sin(Δφ/2)**2 + Math.cos(φ1)*Math.cos(φ2)*Math.sin(Δλ/2)**2;
        return 2 * EARTH_R * Math.asin(Math.sqrt(a));
      }
    
      function computeOffset([lat, lng]: [number, number], angleDeg: number, distMeters: number): [number, number] {
        const δ = distMeters / EARTH_R;
        const θ = toRad(angleDeg), φ1 = toRad(lat), λ1 = toRad(lng);
        const φ2 = Math.asin(Math.sin(φ1)*Math.cos(δ) + Math.cos(φ1)*Math.sin(δ)*Math.cos(θ));
        const λ2 = λ1 + Math.atan2(Math.sin(θ)*Math.sin(δ)*Math.cos(φ1), Math.cos(δ) - Math.sin(φ1)*Math.sin(φ2));
        return [(φ2*180)/Math.PI, (λ2*180)/Math.PI];
      }

      function createCustomIcon(url: string) {
        return L.divIcon({
          className: "custom-marker",
          html: `<div class="custom-icon"><div class="icon-image" style="background-image:url('${url}')"></div></div>`,
          iconSize: [50, 60],
          iconAnchor: [25, 60],
        });
      }

      function createEventIcon(category: string) {
        const cls = ICON_CLASSES[category] ?? "";
        return L.divIcon({
          className: "",
          html: `
            <div class="custom-icon ${cls}">
              <div class="icon-image"
                   style="background-image:url('/static/sunset.webp')"></div>
            </div>`,
          iconSize:   [50, 60],
          iconAnchor: [25, 60],
        });
      }

      // --- Interaction Functions ---
      function focusMarker(marker: LeafletMarker){
        const el = marker.getElement()?.querySelector('.custom-icon');
        if (el) el.classList.add('focused');
      }
      function unfocusMarker(marker: LeafletMarker){
        const el = marker.getElement()?.querySelector('.custom-icon');
        if (el) el.classList.remove('focused');
      }

      function showDetails(c: { image: string; name: string; description: string; address: string; phone: string }) {
        const p = document.getElementById("details-panel");
        if (!p) return;
        p.innerHTML = `
          <button class="btn-close float-end" onclick="hideDetails()"></button>
          <img src="${c.image}" alt="${c.name}" class="img-fluid rounded mb-3">
          <h2 class="fs-4">${c.name}</h2>
          <p class="text-muted mb-3">${c.description}</p>
          <div class="border-top pt-3">
            <div><strong>住所:</strong> ${c.address}</div>
            <div><strong>電話番号:</strong> ${c.phone}</div>
          </div>`;
        p.classList.add("active");

        if (!detailsOverlay) {
          detailsOverlay = document.createElement("div");
          Object.assign(detailsOverlay.style, {
            position: "fixed", inset: "0", zIndex: "1000",
            background: "transparent", cursor: "pointer"
          });
          L.DomEvent.disableClickPropagation(detailsOverlay);
          L.DomEvent.disableScrollPropagation(detailsOverlay);
          detailsOverlay.addEventListener("click", function(ev) {
            ev.preventDefault();
            ev.stopPropagation();
            hideDetails();
            cancelNextMarkerClick = false;
          });
        }
        if (!detailsOverlay.isConnected) document.body.appendChild(detailsOverlay);
      }

      function hideDetails() {
        document.getElementById("details-panel")?.classList.remove("active");
        if (detailsOverlay?.isConnected) detailsOverlay.remove();
      }
      (window as any).hideDetails = hideDetails;

      function loadMarkersSequentially(interval = 150) {
        spots.forEach((s, idx) => {
          setTimeout(() => {
            const m = L.marker(s.location as [number, number], { icon: createCustomIcon(s.image) })
              .on('click', function(ev: any) {
                if (cancelNextMarkerClick) { cancelNextMarkerClick = false; return; }
                ev.originalEvent?.preventDefault(); ev.originalEvent?.stopPropagation();
                L.DomEvent.stopPropagation(ev);

                showDetails({
                  image: s.image, name: s.name,
                  description: "ここにスポットの説明",
                  address: "住所", phone: "電話番号"
                });

                if (focusedMarker && focusedMarker !== m) unfocusMarker(focusedMarker);
                focusMarker(m); focusedMarker = m;
              });
            buildingLayer.addLayer(m);
            (s as any).marker = m;
          }, interval * idx);
        });
      }

      // --- Event Pins Logic ---
      function resetEventLayer() {
        eventLayer.eachLayer((l) => {
          try { eventLayer.removeLayer(l); } catch { /* ignore */ }
        });
      }

      function showEventPins(category: string) {
        resetEventLayer();
        if (map.hasLayer(buildingLayer)) map.removeLayer(buildingLayer);

        spots.forEach((s: any) => {
          const evts = (s.events && s.events[category]) || [];
          if (!evts.length) return;

          const cfg = RADIUS_CONFIG[s.name] || {};
          const minR = cfg.minRadius ?? 8;
          const maxR = cfg.maxRadius ?? Math.min(minR + evts.length * 5, 60);
          const minSpace = 10;
          const placedPos: [number, number][] = [];

          evts.forEach((evt: any) => {
            let pos: [number, number] = [0, 0], tries = 0;
            do {
              const angle = Math.random() * 360;
              const radius = minR + Math.random() * (maxR - minR);
              pos = computeOffset(s.location, angle, radius);
              tries++;
            } while (
              tries < 50 &&
              placedPos.some((p) => computeDistance(p, pos) < minSpace)
            );
            placedPos.push(pos);

            const em = L.marker(pos, { icon: createEventIcon(category) })
              .on("click", function(ev: any) {
                if (cancelNextMarkerClick) { cancelNextMarkerClick = false; return; }
                ev.originalEvent?.preventDefault(); ev.originalEvent?.stopPropagation();
                L.DomEvent.stopPropagation(ev);

                showDetails({
                  image: "/static/sunset.webp",
                  name: evt.name, description: evt.description,
                  address: evt.venue, phone: evt.contact,
                });

                if (focusedMarker && focusedMarker !== em) unfocusMarker(focusedMarker);
                focusMarker(em); focusedMarker = em;
              })
              .addTo(eventLayer);
          });
        });
      }

      // --- Map Events ---
      function isNearAnyMarker(clickLatLng: { lat: number; lng: number }, thresholdPx = 15) {
        const clickPt = map.latLngToContainerPoint(clickLatLng);
        let hit = false;
        buildingLayer.eachLayer(m => {
          if (hit) return;
          const mPt = map.latLngToContainerPoint(m.getLatLng());
          if (clickPt.distanceTo(mPt) < thresholdPx) hit = true;
        });
        return hit;
      }

      map.on('mousedown', function (ev: any) {
        if (!ev.originalEvent.target.closest('.custom-icon')) cancelNextMarkerClick = true;
      });
      map.on("click", function(ev: any) {
        if (!isNearAnyMarker(ev.latlng)) {
          hideDetails();
          cancelNextMarkerClick = false;
          if (focusedMarker) { unfocusMarker(focusedMarker); focusedMarker = null; }
        }
      });

      // Area Polygon
      const areaCoords: [number, number][] =
        [
          [35.487860530019944, 139.34037514269602],
          [35.48819249093486, 139.34462376154906],
          [35.485091223681984, 139.3459004930207],
          [35.48510869594534, 139.3409437710255]
        ];
      L.polygon(areaCoords, { className: 'my-area-boundary' }).addTo(map);

      // --- Init Flow ---
      loadMarkersSequentially();

      // Setup Menu Handlers
      const btns = document.querySelectorAll(".menu-bar button.btn-light");
      btns.forEach((btn) => {
        const label = btn.textContent?.trim() || "";
        let handler: () => void;

        if (label.includes("全体")) {
          handler = () => {
            resetEventLayer();
            if (!map.hasLayer(buildingLayer)) map.addLayer(buildingLayer);
          };
        } else if (label.includes("研究室")) {
          handler = () => showEventPins("lab");
        } else if (label.includes("グルメ")) {
          handler = () => showEventPins("gourmet");
        } else if (label.includes("サークル")) {
          handler = () => showEventPins("circle");
        } else if (label.includes("演奏") || label.includes("劇")) {
          handler = () => showEventPins("performance");
        } else {
          return;
        }

        btn.addEventListener("click", () => handler());
      });

      // Simulate initial clicks
      setTimeout(() => {
        const labBtn = document.querySelectorAll('.menu-bar button')[1] as HTMLElement;
        const allBtn = document.querySelectorAll('.menu-bar button')[0] as HTMLElement;
        if (labBtn) labBtn.click();
        if (allBtn) allBtn.click();
      }, 500);

      // --- Compass Logic ---
      const bs = (window as any).bootstrap;
      if (bs) {
        const compassModal = new bs.Modal(document.getElementById('compassModal'), {
          backdrop: 'static', keyboard: false
        });
        compassModal.show();
        document.getElementById('allowCompass')?.addEventListener('click', () => {
          if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
            (DeviceOrientationEvent as any).requestPermission()
              .then((resp: string) => { if (resp === 'granted') initCompass(); })
              .finally(() => compassModal.hide());
          } else {
            initCompass(); compassModal.hide();
          }
        });
        document.getElementById('denyCompass')?.addEventListener('click', () => {
          compassModal.hide();
        });
      }

      let currentHeading = 0;
      let userMarker: LeafletMarker | null = null;
      let lastPos: [number, number] | null = null;

      function userHTML(heading: number) {
        return `
          <div style="position:relative;width:40px;height:40px">
            <div class="direction-wedge" style="
              position:absolute; top:-20px; left:-20px;
              width:80px; height:80px;
              background: radial-gradient(circle at 50% 50%, rgba(0,122,255,3.6) 0%, rgba(0,122,255,0) 80%);
              clip-path: polygon(50% 50%,25% 0%,75% 0%);
              transform: rotate(${heading}deg); transform-origin: 40px 40px;
            "></div>
            <div style="
              position:absolute; top:0; left:0; width:40px; height:40px;
              border-radius:50%; background: rgba(0,122,255,0.4); border: 2px solid rgba(0,122,255,0.6);
            "></div>
            <div style="
              position:absolute; top:8px; left:8px; width:24px; height:24px;
              border-radius:50%; background: #005FCC; border: 2px solid #fff;
            "></div>
          </div>`;
      }

      function renderUser(lat: number, lon: number, heading: number) {
        lastPos = [lat, lon];
        if (!userMarker) {
          userMarker = L.marker([lat, lon], {
            icon: L.divIcon({ html: userHTML(heading), className: "", iconSize: [40, 40], iconAnchor: [20, 20] }),
          }).addTo(map);
        } else {
          userMarker.setLatLng([lat, lon]);
          userMarker.setIcon(L.divIcon({ html: userHTML(heading), className: "", iconSize: [40, 40], iconAnchor: [20, 20] }));
        }
      }

      function applyHeading(raw: number | null) {
        if (raw == null) return;
        const deg = (raw + getScreenAngle()) % 360;
        currentHeading = deg;
        if (lastPos) renderUser(lastPos[0], lastPos[1], deg);
      }

      function initCompass() {
        try {
          if ('AbsoluteOrientationSensor' in window) {
            const AbsoluteOrientationSensor = (window as any).AbsoluteOrientationSensor;
            const sensor = new AbsoluteOrientationSensor({ frequency: 30 });
            sensor.addEventListener('reading', () => {
              const [x, y, z, w] = sensor.quaternion;
              const yaw = (Math.atan2(2*(w*z + x*y), 1 - 2*(y*y + z*z)) * 180) / Math.PI;
              applyHeading((yaw + 360) % 360);
            });
            sensor.start();
            return;
          }
        } catch (e) { console.warn('AbsoluteOrientationSensor error:', e); }
        const handler = (ev: any) => {
          if (ev.webkitCompassHeading != null) { applyHeading(ev.webkitCompassHeading); }
          else if (ev.alpha != null) { applyHeading((360 - ev.alpha) % 360); }
        };
        if (typeof DeviceOrientationEvent !== 'undefined') {
          if ((DeviceOrientationEvent as any).requestPermission) {
            (DeviceOrientationEvent as any).requestPermission()
              .then((r: string) => { if (r === 'granted') window.addEventListener('deviceorientation', handler, true); })
              .catch(console.error);
          } else {
            window.addEventListener('deviceorientationabsolute', handler, true);
            window.addEventListener('deviceorientation', handler, true);
          }
        }
      }

      let lastBearingPos: [number, number] | null = null;
      function gpsBearing(lat: number, lon: number) {
        if (!lastBearingPos) { lastBearingPos = [lat, lon]; return null; }
        const [pl, pn] = lastBearingPos;
        const d = EARTH_R * 2 * Math.asin(
          Math.sqrt(
            Math.sin(toRad((lat - pl) / 2))**2 +
            Math.cos(toRad(pl)) * Math.cos(toRad(lat)) * Math.sin(toRad((lon - pn) / 2))**2
          )
        );
        if (d < 2) return null;
        lastBearingPos = [lat, lon];
        return calcBearing(pl, pn, lat, lon);
      }

      if ('geolocation' in navigator) {
        navigator.geolocation.watchPosition(
          ({ coords: { latitude, longitude } }) => {
            const fallback = gpsBearing(latitude, longitude);
            if (fallback != null && currentHeading === 0) currentHeading = fallback;
            renderUser(latitude, longitude, currentHeading);
          },
          e => { if (e.code !== 1) console.warn("Geolocation warning", e); },
          { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 }
        );
      } else { alert('Geolocation API に対応していません。'); }

      // Expose for external control (iframe etc)
      w.spots = spots;
      w.map = map;
    };

    init();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      {/* External CSS Dependencies */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
      />
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
      />
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css"
      />
      <link
        rel="stylesheet"
        href="/static/css/map_icons.css"
      />

      <style
        dangerouslySetInnerHTML={{
          __html: `
:root { --brand-green: rgb(14,83,12);  }   

    html, body {
      margin: 0;
      height: 100%;
      font-family: Arial, Helvetica, sans-serif;
      overflow: hidden;            /* モバイルで余計なスクロールを防止 */
    }

    #map {
      width: 100vw;
      height: 100vh;
    }

    /* メニューバー */
    .menu-bar {
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      width: clamp(260px, 90%, 640px);
      z-index: 1000;
      display: flex;
      gap: .5rem;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;       /* Firefox */
    }
    .menu-bar::-webkit-scrollbar { display: none; }  /* Chrome/Safari */

    .menu-bar button {
      flex: 1 0 auto;
      white-space: nowrap;
    }




    /* 詳細パネル */
    .details-panel {
      position: fixed;
      top: 0; left: -400px;
      width: 400px; max-width: 90%;
      height: 100%;
      overflow-y: auto;
      transition: left .3s ease;
      z-index: 1001;
    }
    .details-panel.active {
      left: 0;
    }

    /* モバイル用調整 (≤768px) */
    @media (max-width: 768px) {
      .custom-icon {
        width: 40px; height: 40px;
      }
      .custom-icon::after {
        bottom: -9px;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-top: 12px solid rgb(14,83,12);;
      }
      .details-panel {
        width: 100%;
        left: 100%;
      }
      .details-panel.active {
        left: 0;
      }
      .menu-bar {
        bottom: 10px;
        gap: .4rem;
      }
    }


    /* Leaflet が生成するアイコンの外枠（透明矩形）はクリックを透過させる */
.leaflet-marker-icon{
  pointer-events:none;           /* 透過領域はイベント無効 */
}

/* 実際の円形ピンとその子要素だけクリックを受け付ける */
.leaflet-marker-icon .custom-icon,
.leaflet-marker-icon .custom-icon *{
  pointer-events:auto;           /* 円内部を有効化 */
}


/* カスタムマーカーにイベント制御を追加 */
.leaflet-marker-icon.custom-marker {
  pointer-events: none !important;
}
.leaflet-marker-icon.custom-marker .custom-icon {
  pointer-events: auto !important;
}

    /* スポットマーカーのフォーカス時 */
    .custom-icon.focused {
      width: 60px;
      height: 60px;
      border-color: rgb(14,83,12);           /* 金色の枠で強調 */
    }
    .custom-icon.focused::after {
      bottom: -15px;                    /* 矢印の位置を少し下へ */
      border-top-width: 18px;           /* 矢印を少し大きく */
      border-top-color: rgb(14,83,12);        /* 矢印の色も金色に */
    }
    .custom-icon.focused .icon-image {
      width: 90%;
      height: 90%;
    }

/* 戻るボタン */
#back-btn {
  position: fixed !important;
  top: 1.5rem !important;
  left: 5rem !important;
  z-index: 2000 !important;

  display: inline-flex !important;
  align-items: center;
  gap: 0.4rem;
  height: 55px;
  
  padding: 0.4rem 0.8rem;
  border: 2px solid rgba(42, 235, 225, 0.9);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.5);
  color: rgba(182, 24, 230, 0.9);
  text-decoration: none;
  font-weight: bold;
  font-size: 0.9rem;

  transition: background-color 0.25s ease,
              color 0.25s ease,
              transform 0.2s ease;
}
#back-btn i {
  font-size: 1.2rem;
  line-height: 1;
}
#back-btn span {
  line-height: 1;
}

/* ホバー・フォーカス */
#back-btn:hover {
  background: rgba(43, 236, 172, 0.4);
  color: #fff;
  transform: translateX(-3px);
}
#back-btn:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(18, 45, 202, 0.4);
}
  `
        }}
      />

      <style
        dangerouslySetInnerHTML={{
          __html: `
/* 特定のエリアを囲む */
.my-area-boundary {
  /* 線の色 */
  stroke: #36ffe4;
  /* 線の太さ */
  stroke-width: 3;
  /* 破線にしたい場合 */
  stroke-dasharray: 8, 4;
  /* 塗りつぶしなし */
  fill-opacity: 0;
  /* マウス操作を無効化したい場合 */
  pointer-events: none;
}
`
        }}
      />

      <a id="back-btn" href="/" className="position-fixed">
        <i className="bi bi-arrow-left"></i>
        <span>戻る</span>
      </a>

      <div id="map"></div>

      <div id="details-panel" className="details-panel bg-white shadow p-3">
        <button className="btn-close float-end"></button>
      </div>

      <div className="menu-bar bg-white shadow rounded-pill p-2 d-flex gap-2 align-items-center">
        <button className="btn btn-light">🏠 全体</button>
        <button className="btn btn-light">🔍 研究室</button>
        <button className="btn btn-light">🍴 グルメ</button>
        <button className="btn btn-light">🛍️ サークル</button>
        <button className="btn btn-light">📄 演奏・劇</button>
      </div>

      <div
        className="modal fade"
        id="compassModal"
        tabIndex={-1}
        aria-labelledby="compassModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="compassModalLabel">コンパスの使用許可</h5>
            </div>
            <div className="modal-body">
              地図上に向きを表示するにはコンパスの使用を許可してください。
            </div>
            <div className="modal-footer">
              <button type="button" id="denyCompass" className="btn btn-secondary" data-bs-dismiss="modal">許可しない</button>
              <button type="button" id="allowCompass" className="btn btn-primary">許可する</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}