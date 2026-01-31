"use client";

import { useEffect } from "react";

const MAIN_SCRIPT = `const __onReady = (fn) => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn);
  } else {
    fn();
  }
};
// 定数と地図初期化
        const INITIAL_CENTER = [35.486417749642015, 139.3428098153942];
        const map = L.map('map', {
          center: INITIAL_CENTER,
          zoom: 18,               // 初期ズームを 18 に
          minZoom: 5,             // 最小ズーム
          maxZoom: 19,            // 最大ズーム
          zoomControl: true,
          scrollWheelZoom: true,
          touchZoom: true
        });
      
        // 建物ピンをまとめるレイヤー
        const buildingLayer = L.layerGroup().addTo(map);
      
        // 誤タップキャンセル用フラグとフォーカスマーカー
        let cancelNextMarkerClick = false;
        let focusedMarker = null;
      
        // 詳細パネルオーバーレイ
        let detailsOverlay = null;
      
        // タイルレイヤー
        L.tileLayer(
          "https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg",
          {
            attribution: '…',
            maxNativeZoom: 18,
            maxZoom: 19,
          }
        ).addTo(map);
      
        // ユーティリティ関数
        const toRad = d => (d * Math.PI) / 180;
        const toDeg = r => (r * 180) / Math.PI;
        const EARTH_R = 6371000;
        function getScreenAngle() {
          return (
            (screen.orientation && screen.orientation.angle) ||
            window.orientation ||
            0
          );
        }
        function calcBearing(lat1, lon1, lat2, lon2) {
          const φ1 = toRad(lat1),
                φ2 = toRad(lat2),
                λ1 = toRad(lon1),
                λ2 = toRad(lon2);
          const y = Math.sin(λ2 - λ1) * Math.cos(φ2);
          const x =
            Math.cos(φ1) * Math.sin(φ2) -
            Math.sin(φ1) * Math.cos(φ2) * Math.cos(λ2 - λ1);
          return (toDeg(Math.atan2(y, x)) + 360) % 360;
        }
      
        // カスタムアイコン生成
        function createCustomIcon(url) {
          return L.divIcon({
            className: "custom-marker",
            html: \`<div class="custom-icon"><div class="icon-image" style="background-image:url('\${url}')"></div></div>\`,
            iconSize: [50, 60],
            iconAnchor: [25, 60],
          });
        }
      
        // スポット一覧
        const spots = [
          { location: [35.48604116703019, 139.34128951057255], image: "./static/map/K1号館.webp", name: "K1号館" },
          { location: [35.48650866834297, 139.34112683577234], image: "./static/map/K2号館.webp", name: "K2号館" },
          { location: [35.48565158052546, 139.34141709865116], image: "./static/map/K3号館.webp", name: "K3号館" },
          { location: [35.485683613095844, 139.3419922129912], image: "./static/map/K4号館.webp", name: "K4号館" },
          { location: [35.485597402140684, 139.34321173217694], image: "./static/map/KAITアリーナ.webp", name: "KAITアリーナ" },
          { location: [35.4860692562503, 139.34187073632998], image: "./static/map/先進研.webp", name: "先進研" },
          { location: [35.48714378031437, 139.34102852276388], image: "./static/map/バイオ棟.webp", name: "バイオ棟" },
          { location: [35.4876058212225, 139.34111663074825], image: "./static/map/自動車棟.webp", name: "自動車棟" },
          { location: [35.48768007599212, 139.34208759034047], image: "./static/map/ロボット.webp", name: "ロボット" },
          { location: [35.48638279161658, 139.34182473387625], image: "./static/map/広場.webp", name: "広場" },
          { location: [35.487920311541316, 139.3430478210974], image: "./static/map/自動車工房.webp", name: "自動車工房" },
          { location: [35.4867846462545, 139.34246309957499], image: "./static/map/KAIT工房.webp", name: "KAIT工房" },
          { location: [35.486649238937936, 139.34321411804413], image: "./static/map/KAIT広場.webp", name: "KAIT広場" },
          { location: [35.44134206079602, 139.3663787109304], image: "./static/map/厚木バスセンター.webp", name: "厚木バスセンター" },
          { location: [35.44012426180783, 139.36467281666947], image: "./static/map/本厚木駅前バス停.webp", name: "本厚木駅前バス停" },
          { location: [35.48543014113195, 139.34095161222936], image: "./static/map/神奈川工科大学前バス停.webp", name: "神奈川工科大学前バス停" },
          { location: [35.48549264919395, 139.3410855002179], image: "./static/map/本厚木駅直行バス停.webp", name: "本厚木駅直行バス停" },
        ];
      
        // フォーカス制御
        function focusMarker(marker){
          const el = marker.getElement()?.querySelector('.custom-icon');
          if (el) el.classList.add('focused');
        }
        function unfocusMarker(marker){
          const el = marker.getElement()?.querySelector('.custom-icon');
          if (el) el.classList.remove('focused');
        }
      
        // マーカーを順次ロード
        function loadMarkersSequentially(interval = 150) {
          spots.forEach((s, idx) => {
            setTimeout(() => {
              const m = L.marker(s.location, { icon: createCustomIcon(s.image) })
                .on('click', function(ev) {
                  // 空白クリック直後の誤タップ防止
                  if (cancelNextMarkerClick) {
                    cancelNextMarkerClick = false;
                    return;
                  }
                  ev.originalEvent?.preventDefault();
                  ev.originalEvent?.stopPropagation();
                  L.DomEvent.stopPropagation(ev);
      
                  showDetails({
                    image:       s.image,
                    name:        s.name,
                    description: "ここにスポットの説明",
                    address:     "住所",
                    phone:       "電話番号"
                  });
      
                  if (focusedMarker && focusedMarker !== m) {
                    unfocusMarker(focusedMarker);
                  }
                  focusMarker(m);
                  focusedMarker = m;
                });
              buildingLayer.addLayer(m);
              s.marker = m;
            }, interval * idx);
          });
        }
      
        // 詳細パネル表示
        function showDetails(c) {
          const p = document.getElementById("details-panel");
          p.innerHTML = \`
            <button class="btn-close float-end" onclick="hideDetails()"></button>
            <img src="\${c.image}" alt="\${c.name}" class="img-fluid rounded mb-3">
            <h2 class="fs-4">\${c.name}</h2>
            <p class="text-muted mb-3">\${c.description}</p>
            <div class="border-top pt-3">
              <div><strong>住所:</strong> \${c.address}</div>
              <div><strong>電話番号:</strong> \${c.phone}</div>
            </div>\`;
          p.classList.add("active");
      
          if (!detailsOverlay) {
            detailsOverlay = document.createElement("div");
            detailsOverlay.style.cssText = \`
              position:fixed; inset:0;
              z-index:1000;
              background:transparent;
              cursor:pointer;
            \`;
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
      
        // 詳細パネル非表示
        function hideDetails() {
          const p = document.getElementById("details-panel");
          p.classList.remove("active");
          if (detailsOverlay && detailsOverlay.isConnected) {
            detailsOverlay.remove();
          }
          // フォーカス解除はここでは行わない
        }
      
        // 空白クリックでフォーカス解除
        function isNearAnyMarker(clickLatLng, thresholdPx = 15) {
          const clickPt = map.latLngToContainerPoint(clickLatLng);
          let hit = false;
          buildingLayer.eachLayer(m => {
            if (hit) return;
            const mPt = map.latLngToContainerPoint(m.getLatLng());
            if (clickPt.distanceTo(mPt) < thresholdPx) hit = true;
          });
          return hit;
        }
      
        map.on('mousedown', function (ev) {
          if (!ev.originalEvent.target.closest('.custom-icon')) {
            cancelNextMarkerClick = true;
          }
        });
        map.on("click", function(ev) {
          if (!isNearAnyMarker(ev.latlng)) {
            hideDetails();
            cancelNextMarkerClick = false;
            if (focusedMarker) {
              unfocusMarker(focusedMarker);
              focusedMarker = null;
            }
          }
        });
      
        // 初回メニュー疑似クリック用フラグ
        let initialMenuSimulated = false;
      
        // ページ読み込み後
        __onReady( () => {
          loadMarkersSequentially();
      
          // 一度だけ「研究室」→「全体」を素早く疑似クリック
          setTimeout(() => {
            if (!initialMenuSimulated) {
              initialMenuSimulated = true;
              document.querySelector('.menu-bar button:nth-child(2)')?.click(); // 研究室
              document.querySelector('.menu-bar button:nth-child(1)')?.click(); // 全体
            }
          }, 500);
        });
      
        // ユーザーマーカー＆コンパスモーダル
        __onReady( () => {
          const compassModal = new bootstrap.Modal(document.getElementById('compassModal'), {
            backdrop: 'static',
            keyboard: false
          });
          compassModal.show();
      
          document.getElementById('allowCompass').addEventListener('click', () => {
            if (typeof DeviceOrientationEvent.requestPermission === 'function') {
              DeviceOrientationEvent.requestPermission()
                .then(resp => {
                  if (resp === 'granted') initCompass();
                })
                .finally(() => compassModal.hide());
            } else {
              initCompass();
              compassModal.hide();
            }
          });
      
          document.getElementById('denyCompass').addEventListener('click', () => {
            console.warn('Compass use denied by user');
            compassModal.hide();
          });
        });
      
        // コンパス初期化
        function initCompass() {
          try {
            if ('AbsoluteOrientationSensor' in window) {
              const sensor = new AbsoluteOrientationSensor({ frequency: 30 });
              sensor.addEventListener('reading', () => {
                const [x, y, z, w] = sensor.quaternion;
                const yaw = (Math.atan2(2*(w*z + x*y), 1 - 2*(y*y + z*z)) * 180) / Math.PI;
                applyHeading((yaw + 360) % 360);
              });
              sensor.start();
              return;
            }
          } catch (e) {
            console.warn('AbsoluteOrientationSensor error:', e);
          }
          const handler = ev => {
            if (ev.webkitCompassHeading != null) {
              applyHeading(ev.webkitCompassHeading);
            } else if (ev.alpha != null) {
              applyHeading((360 - ev.alpha) % 360);
            }
          };
          if (typeof DeviceOrientationEvent !== 'undefined') {
            if (DeviceOrientationEvent.requestPermission) {
              DeviceOrientationEvent.requestPermission()
                .then(r => {
                  if (r === 'granted') window.addEventListener('deviceorientation', handler, true);
                })
                .catch(console.error);
            } else {
              window.addEventListener('deviceorientationabsolute', handler, true);
              window.addEventListener('deviceorientation', handler, true);
            }
          }
        }
      
        // ユーザーマーカー描画
        let userMarker = null;
        let lastPos = null;
        let currentHeading = 0;
      
        function userHTML(heading) {
          return \`
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
                transform: rotate(\${heading}deg);
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
            </div>\`;
        }
      
        function renderUser(lat, lon, heading) {
          lastPos = [lat, lon];
          if (!userMarker) {
            userMarker = L.marker([lat, lon], {
              icon: L.divIcon({
                html: userHTML(heading),
                className: "",
                iconSize: [40, 40],
                iconAnchor: [20, 20],
              }),
            }).addTo(map);
          } else {
            userMarker.setLatLng([lat, lon]);
            userMarker.setIcon(
              L.divIcon({
                html: userHTML(heading),
                className: "",
                iconSize: [40, 40],
                iconAnchor: [20, 20],
              })
            );
          }
        }
      
        function applyHeading(raw) {
          if (raw == null) return;
          const deg = (raw + getScreenAngle()) % 360;
          currentHeading = deg;
          if (lastPos) renderUser(lastPos[0], lastPos[1], deg);
        }
      
        // GPSベアリングによる向き補完
        let lastBearingPos = null;
        function gpsBearing(lat, lon) {
          if (!lastBearingPos) {
            lastBearingPos = [lat, lon];
            return null;
          }
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
      
        // 位置情報取得
        if ('geolocation' in navigator) {
          navigator.geolocation.watchPosition(
            ({ coords: { latitude, longitude } }) => {
              const fallback = gpsBearing(latitude, longitude);
              if (fallback != null && currentHeading === 0) currentHeading = fallback;
              renderUser(latitude, longitude, currentHeading);
            },
            e => {
              if (e.code === e.TIMEOUT) {
                console.warn('位置情報の取得がタイムアウトしました。再試行します…');
              } else {
                console.error('Geolocation error', e);
              }
            },
            {
              enableHighAccuracy: true,
              maximumAge: 5000,
              timeout: 20000
            }
          );
        } else {
          alert('Geolocation API に対応していません。');
        }
      
        // 初期状態で詳細パネルを隠す
        hideDetails();
      
        // iframe 等からも参照可能に
        window.spots = spots;
        window.map   = map;`;
const AREA_SCRIPT = `// 例：囲みたいエリアの緯度経度リスト
const areaCoords = [
  //左上
  [35.487860530019944, 139.34037514269602],
  //右上
  [35.48819249093486, 139.34462376154906],
  //右下
  [35.485091223681984, 139.3459004930207],
  //左下
  [35.48510869594534, 139.3409437710255]
];

// ポリゴンを作成し、マップに追加
const areaBoundary = L.polygon(areaCoords, {
  // CSS クラス名を指定（先ほど作った .my-area-boundary が適用される）
  className: 'my-area-boundary',
  // 必要であれば塗り色を設定（CSS で制御したければ不要）
  // fill: false 
}).addTo(map);`;

export default function MapPage() {
  useEffect(() => {
    document.querySelectorAll('link[media="print"]').forEach((link) => {
      const el = link as HTMLLinkElement;
      const promote = () => {
        el.media = "all";
      };
      if (el.sheet) {
        promote();
      } else {
        el.addEventListener("load", promote, { once: true });
      }
    });

    const waitFor = (check, timeoutMs = 5000) =>
      new Promise((resolve) => {
        if (!check) {
          resolve();
          return;
        }
        if (check()) {
          resolve();
          return;
        }
        const start = Date.now();
        const timer = window.setInterval(() => {
          if (check()) {
            window.clearInterval(timer);
            resolve();
          } else if (Date.now() - start > timeoutMs) {
            window.clearInterval(timer);
            resolve();
          }
        }, 50);
      });

    const loadScript = (src, id, check) =>
      new Promise((resolve, reject) => {
        const existing = id
          ? document.getElementById(id)
          : document.querySelector(`script[src="${src}"]`);
        if (existing) {
          if (!check || check()) {
            resolve();
            return;
          }
          existing.addEventListener(
            "load",
            () => {
              resolve();
            },
            { once: true }
          );
          existing.addEventListener(
            "error",
            () => {
              resolve();
            },
            { once: true }
          );
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

    const injectInline = (id, code) => {
      if (document.getElementById(id)) return;
      const script = document.createElement('script');
      script.id = id;
      script.text = code;
      document.body.appendChild(script);
    };

    const init = async () => {
      try {
        await loadScript(
          "https://unpkg.com/leaflet@1.7.1/dist/leaflet.js",
          "leaflet-js",
          () => typeof (window).L !== "undefined"
        );
        await loadScript(
          "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js",
          "bootstrap-js",
          () => typeof (window).bootstrap !== "undefined"
        );
        await waitFor(() => typeof (window).bootstrap !== "undefined");
        injectInline("map-inline", MAIN_SCRIPT);
        injectInline("map-area", AREA_SCRIPT);
        await loadScript("./static/js/eventsData.js", "events-data");
        await loadScript("./static/js/events.js", "events-js");
      } catch {
        // ignore script failures
      }
    };

    init();
  }, []);

  return (
    <>
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
