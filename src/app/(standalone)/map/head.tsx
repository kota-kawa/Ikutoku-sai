export default function Head() {
  return (
    <>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>統合マップ</title>
      <link rel="icon" href="./static/favicon.ico" type="image/x-icon" />
      <link rel="icon" href="./static/favicon.png" type="image/png" />
      <link rel="shortcut icon" href="./static/favicon.ico" />
      <link rel="preconnect" href="https://server.arcgisonline.com" />
      <link rel="dns-prefetch" href="https://server.arcgisonline.com" />
      <link rel="preload" as="image" href="./static/map/K1号館.webp" />
      <link rel="preload" as="image" href="./static/map/K2号館.webp" />
      <link rel="stylesheet" href="./static/css/map_icons.css" />
      {/* @ts-expect-error align with before_version onload attribute */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
        media="print"
        onLoad="this.media='all'"
      />
      <noscript>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
      </noscript>
      {/* @ts-expect-error align with before_version onload attribute */}
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
        media="print"
        onLoad="this.media='all'"
      />
      <noscript>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
        />
      </noscript>
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css"
        rel="stylesheet"
      />
    </>
  );
}
