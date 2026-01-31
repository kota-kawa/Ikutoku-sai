"use client";

import { useEffect } from "react";

export default function LoginForm({ showError }: { showError: boolean }) {
  useEffect(() => {
    const btn = document.querySelector<HTMLButtonElement>(".login-box button");
    if (!btn) return;
    const handler = (e: MouseEvent) => {
      const circle = document.createElement("span");
      circle.classList.add("ripple");
      btn.appendChild(circle);

      const d = Math.max(btn.clientWidth, btn.clientHeight);
      circle.style.width = circle.style.height = `${d}px`;
      const rect = btn.getBoundingClientRect();
      circle.style.left = `${e.clientX - rect.left - d / 2}px`;
      circle.style.top = `${e.clientY - rect.top - d / 2}px`;

      circle.addEventListener("animationend", () => circle.remove());
    };
    btn.addEventListener("click", handler);
    return () => {
      btn.removeEventListener("click", handler);
    };
  }, []);

  return (
    <>
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        html,
        body {
          height: 100%;
          overflow: hidden;
          font-family: "Segoe UI", sans-serif;
        }

        .bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(270deg, #ff7e5f, #feb47b, #86a8e7, #91eae4);
          background-size: 800% 800%;
          animation: gradientBG 15s ease infinite;
        }
        @keyframes gradientBG {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .circle {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          animation: drift 20s ease-in-out infinite;
        }
        .circle1 {
          width: 250px;
          height: 250px;
          top: 10%;
          left: 15%;
          animation-duration: 22s;
        }
        .circle2 {
          width: 180px;
          height: 180px;
          top: 70%;
          left: 10%;
          animation-duration: 18s;
        }
        .circle3 {
          width: 200px;
          height: 200px;
          top: 40%;
          left: 80%;
          animation-duration: 24s;
        }
        @keyframes drift {
          0% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(20px, 30px);
          }
          100% {
            transform: translate(0, 0);
          }
        }

        .form-container {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
        }

        .login-box {
          background: rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.6);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.25);
          padding: 2rem;
          border-radius: 1rem;
          width: 340px;
          text-align: center;
        }
        .login-box h2 {
          color: #333;
          margin-bottom: 1.5rem;
          font-size: 1.6rem;
          text-shadow: 0 1px 2px rgba(255, 255, 255, 0.7);
        }
        .login-box .error {
          color: #e74c3c;
          margin-bottom: 1rem;
          font-weight: bold;
        }

        .login-box input {
          width: 100%;
          padding: 0.75rem;
          margin-bottom: 1rem;
          border: none;
          border-radius: 0.5rem;
          background: rgba(255, 255, 255, 0.6);
          color: #333;
          font-size: 1rem;
          outline: none;
          transition: background 0.3s, transform 0.3s;
        }
        .login-box input::placeholder {
          color: #666;
        }
        .login-box input:focus {
          background: rgba(255, 255, 255, 0.8);
          transform: scale(1.02);
        }

        .login-box button {
          position: relative;
          overflow: hidden;
          width: 100%;
          padding: 0.75rem;
          border: none;
          border-radius: 0.5rem;
          background: #333;
          color: #fff;
          font-size: 1rem;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .login-box button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
        }
        .login-box span.ripple {
          position: absolute;
          border-radius: 50%;
          transform: scale(0);
          animation: ripple 0.6s linear;
          background: rgba(255, 255, 255, 0.3);
        }
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `}</style>

      <div className="bg"></div>
      <div className="circle circle1"></div>
      <div className="circle circle2"></div>
      <div className="circle circle3"></div>

      <div className="form-container">
        <form className="login-box" action="/login_submit" method="post">
          <h2>管理者ログイン</h2>
          {showError ? <div className="error">パスワードが違います</div> : null}
          <input type="password" name="password" placeholder="パスワード" required autoFocus />
          <button type="submit">ログイン</button>
        </form>
      </div>
    </>
  );
}
