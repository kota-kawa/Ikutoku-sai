export default function ComingSoonPage() {
  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          font-family: "Poppins", sans-serif;
          color: #ffffff;
        }

        .container {
          text-align: center;
          padding: 0 20px;
        }

        .title {
          font-size: 4rem;
          font-weight: 600;
          margin-bottom: 1rem;
          text-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .subtitle {
          font-size: 1.25rem;
          font-weight: 300;
          opacity: 0.8;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 0.8;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>

      <div className="container">
        <h1 className="title">COMING SOON</h1>
        <p className="subtitle">新しいウェブサイトを準備中です。もうしばらくお待ちください！</p>
      </div>
    </>
  );
}
