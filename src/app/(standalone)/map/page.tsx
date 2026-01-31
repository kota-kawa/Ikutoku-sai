"use client";
// NOTE: External CDN globals (Leaflet/Bootstrap/Sensors) lack local typings; any is used for interop.

import { useEffect } from "react";

type LeafletMarker = {
  getElement: () => HTMLElement | null;
  getLatLng: () => { lat: number; lng: number };
  on: (event: string, handler: (ev: unknown) => void) => LeafletMarker;
  addTo: (layer: unknown) => LeafletMarker;
  setLatLng: (latlng: [number, number]) => void;
  setIcon: (icon: unknown) => void;
  fire: (event: string) => void;
};

type LeafletLayerGroup = {
  addTo: (map: unknown) => LeafletLayerGroup;
  addLayer: (layer: unknown) => void;
  eachLayer: (cb: (layer: LeafletMarker) => void) => void;
  removeLayer: (layer: unknown) => void;
};

type LeafletMap = {
  panTo: (loc: [number, number]) => void;
  latLngToContainerPoint: (loc: { lat: number; lng: number } | [number, number]) => {
    distanceTo: (pt: { x: number; y: number }) => number;
  };
  on: (event: string, handler: (ev: any) => void) => void;
  hasLayer: (layer: unknown) => boolean;
  removeLayer: (layer: unknown) => void;
  addLayer: (layer: unknown) => void;
};

type LeafletGlobal = {
  map: (id: string, opts: Record<string, unknown>) => LeafletMap;
  tileLayer: (url: string, opts: Record<string, unknown>) => { addTo: (map: unknown) => void };
  layerGroup: () => LeafletLayerGroup;
  divIcon: (opts: Record<string, unknown>) => unknown;
  marker: (loc: [number, number], opts: Record<string, unknown>) => LeafletMarker;
  polygon: (coords: [number, number][], opts: Record<string, unknown>) => { addTo: (map: unknown) => void };
  DomEvent: {
    stopPropagation: (ev: unknown) => void;
    disableClickPropagation: (el: HTMLElement) => void;
    disableScrollPropagation: (el: HTMLElement) => void;
  };
};

export default function MapPage() {
  useEffect(() => {
    let cancelled = false;
    let watchId: number | null = null;

    const setGeoStatus = (message: string, tone: "info" | "warn" | "error" = "warn") => {
      const el = document.getElementById("geo-status");
      if (!el) return;
      el.textContent = message;
      el.dataset.tone = tone;
      el.classList.add("show");
    };

    const clearGeoStatus = () => {
      const el = document.getElementById("geo-status");
      if (!el) return;
      el.classList.remove("show");
      el.textContent = "";
      delete el.dataset.tone;
    };

    const loadScript = (src: string) =>
      new Promise<void>((resolve, reject) => {
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
      await loadScript("https://unpkg.com/leaflet@1.7.1/dist/leaflet.js");
      await loadScript("https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js");
      if (cancelled) return;

      const w = window as Window & {
        L?: LeafletGlobal;
        map?: LeafletMap;
        spots?: { location: [number, number]; image: string; name: string; marker?: LeafletMarker }[];
        buildingLayer?: LeafletLayerGroup;
        cancelNextMarkerClick?: boolean;
        focusedMarker?: LeafletMarker | null;
        showDetails?: (c: {
          image: string;
          name: string;
          description: string;
          address: string;
          phone: string;
        }) => void;
        hideDetails?: () => void;
        focusMarker?: (marker: LeafletMarker) => void;
        unfocusMarker?: (marker: LeafletMarker) => void;
      };

      const L = w.L;
      if (!L) return;

      const INITIAL_CENTER: [number, number] = [35.486417749642015, 139.3428098153942];
      const map = L.map("map", {
        center: INITIAL_CENTER,
        zoom: 18,
        minZoom: 5,
        maxZoom: 19,
        zoomControl: true,
        scrollWheelZoom: true,
        touchZoom: true
      });

      const buildingLayer = L.layerGroup().addTo(map);
      w.cancelNextMarkerClick = false;
      w.focusedMarker = null;
      let detailsOverlay: HTMLElement | null = null;

      L.tileLayer("https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg", {
        attribution: "…",
        maxNativeZoom: 18,
        maxZoom: 19
      }).addTo(map);

      const toRad = (d: number) => (d * Math.PI) / 180;
      const toDeg = (r: number) => (r * 180) / Math.PI;
      const EARTH_R = 6371000;

      function getScreenAngle() {
        return (
          (screen.orientation && screen.orientation.angle) ||
          (window as unknown as { orientation?: number }).orientation ||
          0
        );
      }

      function calcBearing(lat1: number, lon1: number, lat2: number, lon2: number) {
        const phi1 = toRad(lat1);
        const phi2 = toRad(lat2);
        const lambda1 = toRad(lon1);
        const lambda2 = toRad(lon2);
        const y = Math.sin(lambda2 - lambda1) * Math.cos(phi2);
        const x =
          Math.cos(phi1) * Math.sin(phi2) -
          Math.sin(phi1) * Math.cos(phi2) * Math.cos(lambda2 - lambda1);
        return (toDeg(Math.atan2(y, x)) + 360) % 360;
      }

      function createCustomIcon(url: string) {
        return L.divIcon({
          className: "custom-marker",
          html: `<div class="custom-icon"><div class="icon-image" style="background-image:url('${url}')"></div></div>`,
          iconSize: [50, 60],
          iconAnchor: [25, 60]
        });
      }

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
        { location: [35.48549264919395, 139.3410855002179], image: "/static/map/本厚木駅直行バス停.webp", name: "本厚木駅直行バス停" }
      ];

      function focusMarker(marker: LeafletMarker) {
        const el = marker.getElement()?.querySelector(".custom-icon");
        if (el) el.classList.add("focused");
      }
      function unfocusMarker(marker: LeafletMarker) {
        const el = marker.getElement()?.querySelector(".custom-icon");
        if (el) el.classList.remove("focused");
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
          detailsOverlay.style.cssText = `position:fixed; inset:0; z-index:1000; background:transparent; cursor:pointer;`;
          L.DomEvent.disableClickPropagation(detailsOverlay);
          L.DomEvent.disableScrollPropagation(detailsOverlay);
          detailsOverlay.addEventListener("click", (ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            hideDetails();
            w.cancelNextMarkerClick = false;
          });
        }
        if (!detailsOverlay.isConnected) document.body.appendChild(detailsOverlay);
      }

      function hideDetails() {
        const p = document.getElementById("details-panel");
        if (!p) return;
        p.classList.remove("active");
        if (detailsOverlay && detailsOverlay.isConnected) {
          detailsOverlay.remove();
        }
      }

      function loadMarkersSequentially(interval = 150) {
        spots.forEach((s, idx) => {
          setTimeout(() => {
            const marker = L.marker(s.location, { icon: createCustomIcon(s.image) }).on("click", (ev: any) => {
              if (w.cancelNextMarkerClick) {
                w.cancelNextMarkerClick = false;
                return;
              }
              ev.originalEvent?.preventDefault();
              ev.originalEvent?.stopPropagation();
              L.DomEvent.stopPropagation(ev);

              showDetails({
                image: s.image,
                name: s.name,
                description: "ここにスポットの説明",
                address: "住所",
                phone: "電話番号"
              });

              if (w.focusedMarker && w.focusedMarker !== marker) {
                unfocusMarker(w.focusedMarker);
              }
              focusMarker(marker);
              w.focusedMarker = marker;
            });
            buildingLayer.addLayer(marker);
            s.marker = marker;
          }, interval * idx);
        });
      }

      function isNearAnyMarker(clickLatLng: { lat: number; lng: number }, thresholdPx = 15) {
        const clickPt = map.latLngToContainerPoint(clickLatLng);
        let hit = false;
        buildingLayer.eachLayer((m) => {
          if (hit) return;
          const mPt = map.latLngToContainerPoint(m.getLatLng());
          if (clickPt.distanceTo(mPt) < thresholdPx) hit = true;
        });
        return hit;
      }

      map.on("mousedown", (ev: any) => {
        if (!ev.originalEvent.target.closest(".custom-icon")) {
          w.cancelNextMarkerClick = true;
        }
      });
      map.on("click", (ev: any) => {
        if (!isNearAnyMarker(ev.latlng)) {
          hideDetails();
          w.cancelNextMarkerClick = false;
          if (w.focusedMarker) {
            unfocusMarker(w.focusedMarker);
            w.focusedMarker = null;
          }
        }
      });

      let initialMenuSimulated = false;
      loadMarkersSequentially();
      setTimeout(() => {
        if (!initialMenuSimulated) {
          initialMenuSimulated = true;
          document.querySelector<HTMLButtonElement>(".menu-bar button:nth-child(2)")?.click();
          document.querySelector<HTMLButtonElement>(".menu-bar button:nth-child(1)")?.click();
        }
      }, 500);

      const modalEl = document.getElementById("compassModal");
      if (modalEl && (window as any).bootstrap) {
        const compassModal = new (window as any).bootstrap.Modal(modalEl, {
          backdrop: "static",
          keyboard: false
        });
        compassModal.show();

        document.getElementById("allowCompass")?.addEventListener("click", () => {
          if (typeof (DeviceOrientationEvent as any).requestPermission === "function") {
            (DeviceOrientationEvent as any)
              .requestPermission()
              .then((resp: string) => {
                if (resp === "granted") initCompass();
              })
              .finally(() => compassModal.hide());
          } else {
            initCompass();
            compassModal.hide();
          }
        });

        document.getElementById("denyCompass")?.addEventListener("click", () => {
          console.warn("Compass use denied by user");
          compassModal.hide();
        });
      }

      function initCompass() {
        try {
          if ("AbsoluteOrientationSensor" in window) {
            const SensorCtor = (window as any).AbsoluteOrientationSensor as new (opts: { frequency: number }) => {
              addEventListener: (evt: string, cb: () => void) => void;
              start: () => void;
              quaternion: [number, number, number, number];
            };
            const sensor = new SensorCtor({ frequency: 30 });
            sensor.addEventListener("reading", () => {
              const [x, y, z, wq] = sensor.quaternion;
              const yaw = (Math.atan2(2 * (wq * z + x * y), 1 - 2 * (y * y + z * z)) * 180) / Math.PI;
              applyHeading((yaw + 360) % 360);
            });
            sensor.start();
            return;
          }
        } catch (e) {
          console.warn("AbsoluteOrientationSensor error:", e);
        }
        const handler = (ev: any) => {
          if (ev.webkitCompassHeading != null) {
            applyHeading(ev.webkitCompassHeading);
          } else if (ev.alpha != null) {
            applyHeading((360 - ev.alpha) % 360);
          }
        };
        if (typeof DeviceOrientationEvent !== "undefined") {
          if ((DeviceOrientationEvent as any).requestPermission) {
            (DeviceOrientationEvent as any)
              .requestPermission()
              .then((r: string) => {
                if (r === "granted") window.addEventListener("deviceorientation", handler, true);
              })
              .catch(console.error);
          } else {
            window.addEventListener("deviceorientationabsolute", handler, true);
            window.addEventListener("deviceorientation", handler, true);
          }
        }
      }

      let userMarker: LeafletMarker | null = null;
      let lastPos: [number, number] | null = null;
      let currentHeading = 0;

      function userHTML(heading: number) {
        return `
          <div style="position:relative;width:40px;height:40px">
            <div class="direction-wedge" style="
              position:absolute;
              top:-20px; left:-20px;
              width:80px; height:80px;
              background: radial-gradient(
                circle at 50% 50%,
                rgba(0,122,255,3.6) 0%,
                rgba(0,122,255,0) 80%
              );
              clip-path: polygon(50% 50%,25% 0%,75% 0%);
              transform: rotate(${heading}deg);
              transform-origin: 40px 40px;
            "></div>
            <div style="
              position:absolute;
              top:0; left:0;
              width:40px; height:40px;
              border-radius:50%;
              background: rgba(0,122,255,0.4);
              border: 2px solid rgba(0,122,255,0.6);
            "></div>
            <div style="
              position:absolute;
              top:8px; left:8px;
              width:24px; height:24px;
              border-radius:50%;
              background: #005FCC;
              border: 2px solid #fff;
            "></div>
          </div>`;
      }

      function renderUser(lat: number, lon: number, heading: number) {
        lastPos = [lat, lon];
        if (!userMarker) {
          userMarker = L.marker([lat, lon], {
            icon: L.divIcon({
              html: userHTML(heading),
              className: "",
              iconSize: [40, 40],
              iconAnchor: [20, 20]
            })
          }).addTo(map);
        } else {
          userMarker.setLatLng([lat, lon]);
          userMarker.setIcon(
            L.divIcon({
              html: userHTML(heading),
              className: "",
              iconSize: [40, 40],
              iconAnchor: [20, 20]
            })
          );
        }
      }

      function applyHeading(raw: number | null) {
        if (raw == null) return;
        const deg = (raw + getScreenAngle()) % 360;
        currentHeading = deg;
        if (lastPos) renderUser(lastPos[0], lastPos[1], deg);
      }

      let lastBearingPos: [number, number] | null = null;
      function gpsBearing(lat: number, lon: number) {
        if (!lastBearingPos) {
          lastBearingPos = [lat, lon];
          return null;
        }
        const [pl, pn] = lastBearingPos;
        const d =
          EARTH_R *
          2 *
          Math.asin(
            Math.sqrt(
              Math.sin(toRad((lat - pl) / 2)) ** 2 +
                Math.cos(toRad(pl)) *
                  Math.cos(toRad(lat)) *
                  Math.sin(toRad((lon - pn) / 2)) ** 2
            )
          );
        if (d < 2) return null;
        lastBearingPos = [lat, lon];
        return calcBearing(pl, pn, lat, lon);
      }

      const startWatch = () => {
        if (!("geolocation" in navigator)) {
          setGeoStatus("このブラウザは位置情報に対応していません。", "error");
          return;
        }
        watchId = navigator.geolocation.watchPosition(
          ({ coords: { latitude, longitude } }) => {
            clearGeoStatus();
            const fallback = gpsBearing(latitude, longitude);
            if (fallback != null && currentHeading === 0) currentHeading = fallback;
            renderUser(latitude, longitude, currentHeading);
          },
          (e) => {
            if (e.code === e.PERMISSION_DENIED) {
              setGeoStatus("位置情報の許可がブロックされています。ブラウザ設定で許可してください。", "error");
              if (watchId != null) {
                navigator.geolocation.clearWatch(watchId);
                watchId = null;
              }
              return;
            }
            if (e.code === e.TIMEOUT) {
              setGeoStatus("位置情報の取得がタイムアウトしました。", "warn");
            } else {
              setGeoStatus("位置情報を取得できませんでした。", "warn");
            }
          },
          {
            enableHighAccuracy: true,
            maximumAge: 5000,
            timeout: 20000
          }
        );
      };

      const perms = navigator.permissions?.query?.({ name: "geolocation" as PermissionName });
      if (perms) {
        perms
          .then((status) => {
            if (status.state === "denied") {
              setGeoStatus("位置情報の許可がブロックされています。ブラウザ設定で許可してください。", "error");
              return;
            }
            if (status.state === "prompt") {
              setGeoStatus("位置情報を許可すると現在地が表示されます。", "info");
            }
            startWatch();
            status.onchange = () => {
              if (status.state === "denied") {
                setGeoStatus("位置情報の許可がブロックされています。ブラウザ設定で許可してください。", "error");
                if (watchId != null) {
                  navigator.geolocation.clearWatch(watchId);
                  watchId = null;
                }
              } else if (status.state === "granted") {
                clearGeoStatus();
                if (watchId == null) startWatch();
              }
            };
          })
          .catch(() => startWatch());
      } else {
        startWatch();
      }

      hideDetails();

      w.map = map;
      w.spots = spots;
      w.buildingLayer = buildingLayer;
      w.showDetails = showDetails;
      w.hideDetails = hideDetails;
      w.focusMarker = focusMarker;
      w.unfocusMarker = unfocusMarker;

      const areaCoords: [number, number][] = [
        [35.487860530019944, 139.34037514269602],
        [35.48819249093486, 139.34462376154906],
        [35.485091223681984, 139.3459004930207],
        [35.48510869594534, 139.3409437710255]
      ];
      L.polygon(areaCoords, {
        className: "my-area-boundary"
      }).addTo(map);

      const eventData: Record<
        string,
        { building: string; name: string; description: string; venue: string; contact: string }[]
      > = {
        gourmet: [
          { building: "K1号館", name: "カフェAlpha", description: "焙煎珈琲とケーキのお店", venue: "K1号館 1F 大ホール横", contact: "046-123-4567" },
          { building: "K1号館", name: "パン屋Beta", description: "焼きたてパン各種", venue: "K1号館 正面入口前", contact: "046-987-6543" },
          { building: "K2号館", name: "ラーメンGamma", description: "あっさり醤油ラーメン", venue: "K2号館 東側", contact: "046-555-1212" },
          { building: "K1号館", name: "和菓子屋Delta", description: "季節の和菓子と抹茶セット", venue: "K1号館 2F ロビー横", contact: "046-111-0001" },
          { building: "K1号館", name: "アイスEpsilon", description: "手作りアイスクリーム各種", venue: "K1号館 1F 中央ホール", contact: "046-111-0002" },
          { building: "K1号館", name: "居酒屋Zeta", description: "地元食材を使ったおつまみ", venue: "K1号館 3F イベントホール入口", contact: "046-111-0003" },
          { building: "K1号館", name: "カレーEta", description: "スパイシーチキンカレー", venue: "K1号館 B1F フードコート", contact: "046-111-0004" },
          { building: "K1号館", name: "寿司Theta", description: "新鮮な地魚を使った寿司", venue: "K1号館 4F テラス", contact: "046-111-0005" }
        ],
        lab: [
          { building: "K1号館", name: "AI研究室見学", description: "最先端AI技術の展示", venue: "K1号館 1F 情報棟", contact: "046-222-0001" },
          { building: "K2号館", name: "ロボ研公開", description: "自律移動ロボットのデモ", venue: "K2号館 2F 実験室", contact: "046-222-0002" }
        ],
        circle: [
          { building: "K3号館", name: "バスケ部トライアウト", description: "初心者歓迎！", venue: "K3号館 体育館", contact: "046-333-0001" },
          { building: "K4号館", name: "吹奏楽部演奏会", description: "クラシック&ポップス演奏", venue: "K4号館 ロビー", contact: "046-333-0002" }
        ],
        performance: [
          { building: "KAITアリーナ", name: "演劇部公演『青春劇場』", description: "若き日の物語を演じます", venue: "KAITアリーナ メインステージ", contact: "046-444-0001" },
          { building: "広場", name: "軽音楽部ライブ", description: "バンド演奏ライブ", venue: "広場 ステージ", contact: "046-444-0002" }
        ]
      };

      Object.entries(eventData).forEach(([category, arr]) => {
        arr.forEach((evt) => {
          const spot = spots.find((s) => s.name === evt.building);
          if (!spot) {
            console.warn(`イベントの紐付け先が見つかりません: ${evt.building}`);
            return;
          }
          (spot as any).events = (spot as any).events || {};
          (spot as any).events[category] = (spot as any).events[category] || [];
          (spot as any).events[category].push({
            name: evt.name,
            description: evt.description,
            venue: evt.venue,
            contact: evt.contact
          });
        });
      });

      const eventLayer = L.layerGroup().addTo(map);
      const RADIUS_CONFIG: Record<string, { minRadius: number; maxRadius: number }> = {
        "K1号館": { minRadius: 8, maxRadius: 15 },
        "K2号館": { minRadius: 10, maxRadius: 30 },
        "K3号館": { minRadius: 5, maxRadius: 25 }
      };
      const ICON_CLASSES: Record<string, string> = {
        gourmet: "event-icon-gourmet",
        lab: "event-icon-lab",
        circle: "event-icon-circle",
        performance: "event-icon-performance"
      };

      const toRadSmall = (deg: number) => (deg * Math.PI) / 180;
      const computeDistance = ([lat1, lng1]: [number, number], [lat2, lng2]: [number, number]) => {
        const phi1 = toRadSmall(lat1);
        const phi2 = toRadSmall(lat2);
        const dPhi = toRadSmall(lat2 - lat1);
        const dLambda = toRadSmall(lng2 - lng1);
        const a =
          Math.sin(dPhi / 2) ** 2 +
          Math.cos(phi1) * Math.cos(phi2) * Math.sin(dLambda / 2) ** 2;
        return 2 * EARTH_R * Math.asin(Math.sqrt(a));
      };

      const computeOffset = ([lat, lng]: [number, number], angleDeg: number, distMeters: number) => {
        const delta = distMeters / EARTH_R;
        const theta = toRadSmall(angleDeg);
        const phi1 = toRadSmall(lat);
        const lambda1 = toRadSmall(lng);
        const phi2 = Math.asin(
          Math.sin(phi1) * Math.cos(delta) +
            Math.cos(phi1) * Math.sin(delta) * Math.cos(theta)
        );
        const lambda2 =
          lambda1 +
          Math.atan2(
            Math.sin(theta) * Math.sin(delta) * Math.cos(phi1),
            Math.cos(delta) - Math.sin(phi1) * Math.sin(phi2)
          );
        return [(phi2 * 180) / Math.PI, (lambda2 * 180) / Math.PI] as [number, number];
      };

      const createEventIcon = (category: string) => {
        const cls = ICON_CLASSES[category] ?? "";
        return L.divIcon({
          className: "",
          html: `
            <div class="custom-icon ${cls}">
              <div class="icon-image" style="background-image:url('/static/sunset.webp')"></div>
            </div>`,
          iconSize: [50, 60],
          iconAnchor: [25, 60]
        });
      };

      const resetEventLayer = () => {
        eventLayer.eachLayer((layer) => {
          try {
            eventLayer.removeLayer(layer);
          } catch {
            // ignore
          }
        });
      };

      const showEventPins = (category: string) => {
        resetEventLayer();
        if (map.hasLayer(buildingLayer)) map.removeLayer(buildingLayer);

        spots.forEach((s) => {
          const evts = ((s as any).events && (s as any).events[category]) || [];
          if (!evts.length) return;

          const cfg = RADIUS_CONFIG[s.name] || {};
          const minR = cfg.minRadius ?? 8;
          const maxR = cfg.maxRadius ?? Math.min(minR + evts.length * 5, 60);
          const minSpace = 10;
          const placedPos: [number, number][] = [];

          evts.forEach((evt: any) => {
            let pos: [number, number];
            let tries = 0;
            do {
              const angle = Math.random() * 360;
              const radius = minR + Math.random() * (maxR - minR);
              pos = computeOffset(s.location, angle, radius);
              tries += 1;
            } while (tries < 50 && placedPos.some((p) => computeDistance(p, pos) < minSpace));
            placedPos.push(pos);

            const em = L.marker(pos, { icon: createEventIcon(category) }).on("click", (ev: any) => {
              if (w.cancelNextMarkerClick) {
                w.cancelNextMarkerClick = false;
                return;
              }
              ev.originalEvent?.preventDefault();
              ev.originalEvent?.stopPropagation();
              L.DomEvent.stopPropagation(ev);

              showDetails({
                image: "/static/sunset.webp",
                name: evt.name,
                description: evt.description,
                address: evt.venue,
                phone: evt.contact
              });

              if (w.focusedMarker && w.focusedMarker !== em) {
                unfocusMarker(w.focusedMarker);
              }
              focusMarker(em);
              w.focusedMarker = em;
            });
            eventLayer.addLayer(em);
          });
        });
      };

      let initialMenuClickHandled = false;
      document.querySelectorAll<HTMLButtonElement>(".menu-bar button.btn-light").forEach((btn) => {
        const label = btn.textContent?.trim() || "";
        let handler: (() => void) | null = null;

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
        }
        if (!handler) return;
        btn.addEventListener("click", () => {
          handler?.();
          if (!initialMenuClickHandled) {
            initialMenuClickHandled = true;
            handler?.();
          }
        });
      });
    };

    init();

    return () => {
      cancelled = true;
      if (watchId != null && "geolocation" in navigator) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --brand-green: #0e530c;
          --brand-blue: #1c5bd1;
          --panel-bg: rgba(255, 255, 255, 0.92);
          --panel-shadow: 0 18px 40px rgba(15, 23, 42, 0.18);
          --panel-border: rgba(15, 23, 42, 0.12);
          --ink: #1f2a3a;
          --muted: #6b7280;
        }

        html,
        body {
          margin: 0;
          height: 100%;
          font-family: "Noto Sans JP", "Hiragino Kaku Gothic ProN", "Yu Gothic", sans-serif;
          overflow: hidden;
          background: #0b1320;
          color: var(--ink);
        }

        #map {
          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100vh;
        }

        .menu-bar {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          width: clamp(260px, 90%, 640px);
          z-index: 1000;
          display: flex;
          gap: 0.5rem;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          padding: 0.6rem 0.8rem;
          border-radius: 999px;
          background: var(--panel-bg);
          border: 1px solid var(--panel-border);
          box-shadow: var(--panel-shadow);
          backdrop-filter: blur(10px);
        }
        .menu-bar::-webkit-scrollbar {
          display: none;
        }

        .menu-bar button {
          flex: 1 0 auto;
          white-space: nowrap;
        }
        .menu-bar .btn {
          border-radius: 999px;
          font-weight: 600;
          color: var(--ink);
          background: rgba(15, 23, 42, 0.04);
          border: 1px solid rgba(15, 23, 42, 0.08);
          transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
        }
        .menu-bar .btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 16px rgba(15, 23, 42, 0.16);
          background: rgba(28, 91, 209, 0.1);
        }

        .details-panel {
          position: fixed;
          top: 0;
          left: -400px;
          width: 400px;
          max-width: 90%;
          height: 100%;
          overflow-y: auto;
          transition: left 0.3s ease;
          z-index: 1001;
          background: var(--panel-bg);
          border-right: 1px solid var(--panel-border);
          box-shadow: var(--panel-shadow);
        }
        .details-panel.active {
          left: 0;
        }

        @media (max-width: 768px) {
          .custom-icon {
            width: 40px;
            height: 40px;
          }
          .custom-icon::after {
            bottom: -9px;
            border-left: 8px solid transparent;
            border-right: 8px solid transparent;
            border-top: 12px solid rgb(14, 83, 12);
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
            gap: 0.4rem;
            width: clamp(240px, 94%, 560px);
          }
        }

        .leaflet-marker-icon {
          pointer-events: none;
        }

        .leaflet-marker-icon .custom-icon,
        .leaflet-marker-icon .custom-icon * {
          pointer-events: auto;
        }

        .leaflet-marker-icon.custom-marker {
          pointer-events: none !important;
        }
        .leaflet-marker-icon.custom-marker .custom-icon {
          pointer-events: auto !important;
        }

        .custom-icon.focused {
          width: 60px;
          height: 60px;
          border-color: rgb(14, 83, 12);
        }
        .custom-icon.focused::after {
          bottom: -15px;
          border-top-width: 18px;
          border-top-color: rgb(14, 83, 12);
        }
        .custom-icon.focused .icon-image {
          width: 90%;
          height: 90%;
        }

        #back-btn {
          position: fixed !important;
          top: max(1rem, env(safe-area-inset-top)) !important;
          left: max(1rem, env(safe-area-inset-left)) !important;
          z-index: 2000 !important;
          display: inline-flex !important;
          align-items: center;
          gap: 0.4rem;
          height: 55px;
          padding: 0.4rem 0.8rem;
          border: 1px solid rgba(255, 255, 255, 0.55);
          border-radius: 999px;
          background: rgba(15, 23, 42, 0.5);
          color: #f8fafc;
          backdrop-filter: blur(12px);
          text-decoration: none;
          font-weight: bold;
          font-size: 0.9rem;
          transition: background-color 0.25s ease, color 0.25s ease, transform 0.2s ease;
        }
        #back-btn i {
          font-size: 1.2rem;
          line-height: 1;
        }
        #back-btn span {
          line-height: 1;
        }
        #back-btn:hover {
          background: rgba(28, 91, 209, 0.6);
          color: #fff;
          transform: translateX(-3px);
        }
        #back-btn:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(28, 91, 209, 0.35);
        }

        .geo-status {
          position: fixed;
          top: max(1rem, env(safe-area-inset-top));
          right: max(1rem, env(safe-area-inset-right));
          z-index: 2000;
          padding: 0.45rem 0.9rem;
          border-radius: 999px;
          font-size: 0.85rem;
          font-weight: 600;
          color: #f8fafc;
          background: rgba(15, 23, 42, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: var(--panel-shadow);
          backdrop-filter: blur(10px);
          opacity: 0;
          transform: translateY(-6px);
          transition: opacity 0.2s ease, transform 0.2s ease;
          pointer-events: none;
        }
        .geo-status.show {
          opacity: 1;
          transform: translateY(0);
        }
        .geo-status[data-tone="info"] {
          background: rgba(28, 91, 209, 0.85);
        }
        .geo-status[data-tone="error"] {
          background: rgba(127, 29, 29, 0.85);
        }

        .my-area-boundary {
          stroke: #36ffe4;
          stroke-width: 3;
          stroke-dasharray: 8, 4;
          fill-opacity: 0;
          pointer-events: none;
        }
      `}} />

      <a id="back-btn" href="/" className="position-fixed">
        <i className="bi bi-arrow-left"></i>
        <span>戻る</span>
      </a>

      <div id="geo-status" className="geo-status" role="status" aria-live="polite"></div>

      <div id="map"></div>

      <div id="details-panel" className="details-panel bg-white shadow p-3">
        <button
          className="btn-close float-end"
          onClick={() => (window as Window & { hideDetails?: () => void }).hideDetails?.()}
        ></button>
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
              <h5 className="modal-title" id="compassModalLabel">
                コンパスの使用許可
              </h5>
            </div>
            <div className="modal-body">
              地図上に向きを表示するにはコンパスの使用を許可してください。
            </div>
            <div className="modal-footer">
              <button type="button" id="denyCompass" className="btn btn-secondary" data-bs-dismiss="modal">
                許可しない
              </button>
              <button type="button" id="allowCompass" className="btn btn-primary">
                許可する
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
