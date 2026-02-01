"use client";
// NOTE: External CDN globals (Leaflet/Bootstrap) lack local typings; any is used for interop.

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
  eachLayer: (cb: (layer: LeafletMarker) => void) => void;
};

type LeafletMap = {
  latLngToContainerPoint: (loc: { lat: number; lng: number }) => {
    distanceTo: (pt: { x: number; y: number }) => number;
  };
  on: (event: string, handler: (ev: any) => void) => void;
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
  DomEvent: {
    stopPropagation: (ev: unknown) => void;
    disableClickPropagation: (el: HTMLElement) => void;
    disableScrollPropagation: (el: HTMLElement) => void;
  };
};

export default function ParkingCarPage() {
  useEffect(() => {
    let cancelled = false;

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

      const w = window as Window & { L?: LeafletGlobal; hideDetails?: () => void };
      const L = w.L;
      if (!L) return;

      const INITIAL_CENTER: [number, number] = [35.486165310060194, 139.34302919958378];
      const map = L.map("map", {
        center: INITIAL_CENTER,
        zoom: 16,
        minZoom: 5,
        maxZoom: 19,
        zoomControl: true,
        scrollWheelZoom: true,
        touchZoom: true
      });
      const AERIAL_TILE = "https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg";
      const FALLBACK_TILE = "https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png";
      const tileLayer = L.tileLayer(AERIAL_TILE, {
        maxNativeZoom: 18,
        maxZoom: 19
      });
      tileLayer.on("tileerror", (ev: any) => {
        if (!ev || !ev.tile || !ev.coords) return;
        if (ev.tile.dataset && ev.tile.dataset.fallbackApplied) return;
        const fallback = FALLBACK_TILE
          .replace("{z}", String(ev.coords.z))
          .replace("{x}", String(ev.coords.x))
          .replace("{y}", String(ev.coords.y));
        if (ev.tile.dataset) ev.tile.dataset.fallbackApplied = "1";
        ev.tile.src = fallback;
      });
      tileLayer.addTo(map);

      const buildingLayer = L.layerGroup().addTo(map);
      let cancelNextMarkerClick = false;
      let focusedMarker: LeafletMarker | null = null;
      let detailsOverlay: HTMLElement | null = null;

      function createCustomIcon(url: string) {
        return L.divIcon({
          className: "custom-marker",
          html: `<div class="custom-icon"><div class="icon-image" style="background-image:url('${url}')"></div></div>`,
          iconSize: [50, 60],
          iconAnchor: [25, 60]
        });
      }

      const spots = [
        { location: [35.48402482516073, 139.3441465845487], image: "./static/map/K1号館.webp", name: "第5駐車場" },
        { location: [35.487879545085335, 139.3449945710562], image: "./static/map/K2号館.webp", name: "第4駐車場" },
        { location: [35.48467343169672, 139.34452250228026], image: "./static/map/K1号館.webp", name: "第3駐車場" },
        { location: [35.484507444099464, 139.3439967893472], image: "./static/map/K2号館.webp", name: "第2駐車場" },
        { location: [35.48515392000944, 139.3444474004515], image: "./static/map/K1号館.webp", name: "第1駐車場" },
        { location: [35.48829012798111, 139.34496238457064], image: "./static/map/K2号館.webp", name: "専用駐車場" },
        { location: [35.48761839674466, 139.34031035571286], image: "./static/map/K2号館.webp", name: "タイムズ厚木下荻野" }
      ];

      function focusMarker(m: LeafletMarker) {
        m.getElement()?.querySelector(".custom-icon")?.classList.add("focused");
      }
      function unfocusMarker(m: LeafletMarker) {
        m.getElement()?.querySelector(".custom-icon")?.classList.remove("focused");
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
            position: "fixed",
            inset: "0",
            zIndex: "1000",
            background: "transparent",
            cursor: "pointer"
          });
          L.DomEvent.disableClickPropagation(detailsOverlay);
          L.DomEvent.disableScrollPropagation(detailsOverlay);
          detailsOverlay.addEventListener("click", (ev) => {
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

      w.hideDetails = hideDetails;

      function loadMarkers() {
        spots.forEach((s) => {
          const marker = L.marker(s.location, { icon: createCustomIcon(s.image) }).on("click", (ev: any) => {
            if (cancelNextMarkerClick) {
              cancelNextMarkerClick = false;
              return;
            }
            ev.originalEvent.preventDefault();
            ev.originalEvent.stopPropagation();
            L.DomEvent.stopPropagation(ev);

            showDetails({ image: s.image, name: s.name, description: "ここにスポットの説明", address: "住所", phone: "電話番号" });
            if (focusedMarker && focusedMarker !== marker) unfocusMarker(focusedMarker);
            focusMarker(marker);
            focusedMarker = marker;
          });
          buildingLayer.addLayer(marker);
          s.marker = marker;
        });
      }

      function isNearAnyMarker(latlng: { lat: number; lng: number }, thresholdPx = 15) {
        const clickPt = map.latLngToContainerPoint(latlng);
        let hit = false;
        buildingLayer.eachLayer((m) => {
          if (hit) return;
          const mPt = map.latLngToContainerPoint(m.getLatLng());
          if (clickPt.distanceTo(mPt) < thresholdPx) hit = true;
        });
        return hit;
      }

      map.on("mousedown", (ev: any) => {
        if (!ev.originalEvent.target.closest(".custom-icon")) cancelNextMarkerClick = true;
      });
      map.on("click", (ev: any) => {
        if (!isNearAnyMarker(ev.latlng)) {
          hideDetails();
          cancelNextMarkerClick = false;
          if (focusedMarker) {
            unfocusMarker(focusedMarker);
            focusedMarker = null;
          }
        }
      });

      let userMarker: LeafletMarker | null = null;
      function userHTML() {
        return `
          <div style="
            width:24px;height:24px;border-radius:50%;
            background:#007AFF;border:3px solid #fff;
            box-shadow:0 0 0 4px rgba(0,122,255,.3);
          "></div>`;
      }
      function renderUser(lat: number, lon: number) {
        const icon = L.divIcon({ html: userHTML(), iconSize: [24, 24], iconAnchor: [12, 12], className: "user-location-icon" });
        if (!userMarker) {
          userMarker = L.marker([lat, lon], { icon }).addTo(map);
        } else {
          userMarker.setLatLng([lat, lon]);
          userMarker.setIcon(icon);
        }
      }
      if ("geolocation" in navigator) {
        navigator.geolocation.watchPosition(
          ({ coords: { latitude, longitude } }) => renderUser(latitude, longitude),
          (e) => console.warn("Geolocation error", e),
          { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 }
        );
      }

      loadMarkers();
      hideDetails();
    };

    init();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --brand-green: rgb(14, 83, 12);
        }
        html,
        body {
          margin: 0;
          height: 100%;
          font-family: Arial, Helvetica, sans-serif;
          overflow: hidden;
        }
        #map {
          width: 100vw;
          height: 100vh;
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
            border-top: 12px solid var(--brand-green);
          }
          .details-panel {
            width: 100%;
            left: 100%;
          }
          .details-panel.active {
            left: 0;
          }
        }
        @media (orientation: landscape) and (max-height: 500px) {
          .details-panel {
            width: 70%;
            left: 100%;
            height: 100%;
          }
          .details-panel.active {
            left: 30%;
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
          border-color: var(--brand-green);
        }
        .custom-icon.focused::after {
          bottom: -15px;
          border-top-width: 18px;
          border-top-color: var(--brand-green);
        }
        .custom-icon.focused .icon-image {
          width: 90%;
          height: 90%;
        }

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
          font-weight: bold;
          font-size: 0.9rem;
          text-decoration: none;
          transition: background-color 0.25s, color 0.25s, transform 0.2s;
        }
        #back-btn:hover {
          background: rgba(43, 236, 172, 0.4);
          color: #fff;
          transform: translateX(-3px);
        }
        #back-btn:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(18, 45, 202, 0.4);
        }

        .user-location-icon {
          background: transparent !important;
          border: none !important;
        }
      `}} />

      <a id="back-btn" href="/" className="position-fixed">
        <i className="bi bi-arrow-left"></i>
        <span>戻る</span>
      </a>

      <div id="map"></div>

      <div id="details-panel" className="details-panel bg-white shadow p-3">
        <button className="btn-close float-end"></button>
      </div>
    </>
  );
}
