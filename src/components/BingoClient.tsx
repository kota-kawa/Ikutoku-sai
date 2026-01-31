"use client";

import { useEffect } from "react";

export default function BingoClient() {
  useEffect(() => {
    const STORAGE_KEY = "bingoCalled";
    let called: number[] = [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      called = raw ? (JSON.parse(raw) as number[]) : [];
    } catch {
      called = [];
    }

    const input = document.getElementById("numInput") as HTMLInputElement | null;
    const addBtn = document.getElementById("addBtn") as HTMLButtonElement | null;
    const undoBtn = document.getElementById("undoBtn") as HTMLButtonElement | null;
    const clearBtn = document.getElementById("clearBtn") as HTMLButtonElement | null;
    const cols = {
      B: document.getElementById("colB"),
      I: document.getElementById("colI"),
      N: document.getElementById("colN"),
      G: document.getElementById("colG"),
      O: document.getElementById("colO")
    };

    const save = () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(called));
    };

    const render = () => {
      Object.values(cols).forEach((col) => {
        if (col) col.innerHTML = "";
      });
      called
        .slice()
        .sort((a, b) => a - b)
        .forEach((num) => {
          const colKey = num <= 15 ? "B" : num <= 30 ? "I" : num <= 45 ? "N" : num <= 60 ? "G" : "O";
          const tile = document.createElement("div");
          tile.className = "tile";
          tile.textContent = String(num);
          tile.addEventListener("click", () => {
            if (confirm(`${num} を削除しますか？`)) {
              called = called.filter((x) => x !== num);
              save();
              render();
            }
          });
          cols[colKey]?.appendChild(tile);
        });
    };

    addBtn?.addEventListener("click", () => {
      const val = parseInt(input?.value || "", 10);
      if (!val || val < 1 || val > 75) {
        alert("1から75までの数字を入力してください");
        return;
      }
      if (called.includes(val)) {
        alert("すでに追加済みです");
        return;
      }
      called.push(val);
      save();
      render();
      if (input) {
        input.value = "";
        input.focus();
      }
    });

    undoBtn?.addEventListener("click", () => {
      if (!called.length) return;
      const last = called[called.length - 1];
      if (!confirm(`${last} を取り消してよろしいですか？`)) return;
      called.pop();
      save();
      render();
      alert(`${last} の追加を取り消しました`);
    });

    clearBtn?.addEventListener("click", () => {
      if (called.length && confirm("全ての数字をクリアしますか？")) {
        called = [];
        save();
        render();
      }
    });

    input?.addEventListener("keyup", (e) => {
      if (e.key === "Enter") addBtn?.click();
    });

    render();
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }

        body {
          margin: 0;
          padding: 0;
          font-family: sans-serif;
          background: linear-gradient(135deg, #f0f8ff, #ffe4e1);
          display: flex;
          flex-direction: column;
          height: 100vh;
        }
        header {
          padding: 1rem;
          background: #333;
          color: #fff;
          text-align: center;
          font-size: 1.5rem;
        }

        .controls {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem;
        }
        .controls input[type="number"] {
          width: 6rem;
          font-size: 1.2rem;
          text-align: center;
          border-radius: 0.3rem;
          border: 2px solid #666;
        }
        .controls button {
          font-size: 1.1rem;
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 0.3rem;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .controls button:hover {
          transform: scale(1.1);
        }
        .controls button:active {
          transform: scale(0.95);
        }

        .grid {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: stretch;
          padding: 1rem;
          gap: 1rem;
          overflow-x: auto;
        }
        .column {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: rgba(255, 255, 255, 0.6);
          border-radius: 0.5rem;
          padding: 0.5rem;
        }
        .column h2 {
          text-align: center;
          margin: 0 0 0.5rem;
          font-size: 2rem;
          letter-spacing: 0.5rem;
        }

        .tiles {
          flex: 1;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.5rem;
          justify-items: center;
        }
        .tile {
          width: 4rem;
          height: 4rem;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 1.5rem;
          color: #fff;
          border-radius: 0.5rem;
          cursor: pointer;
          animation: pop-in 0.3s ease-out;
          position: relative;
        }
        .tile::after {
          content: "×";
          position: absolute;
          top: -0.5rem;
          right: -0.5rem;
          background: rgba(0, 0, 0, 0.5);
          border-radius: 50%;
          width: 1.2rem;
          height: 1.2rem;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 1rem;
        }

        .B .tile {
          background: #3498db;
        }
        .I .tile {
          background: #2ecc71;
        }
        .N .tile {
          background: #e67e22;
        }
        .G .tile {
          background: #9b59b6;
        }
        .O .tile {
          background: #e74c3c;
        }

        @keyframes pop-in {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}} />

      <header>ビンゴナンバーリスト</header>

      <div className="controls">
        <input id="numInput" type="number" min="1" max="75" placeholder="1-75" />
        <button id="addBtn" style={{ background: "#3498db", color: "#fff" }}>
          追加
        </button>
        <button id="undoBtn" style={{ background: "#f39c12", color: "#fff" }}>
          Undo
        </button>
        <button id="clearBtn" style={{ background: "#c0392b", color: "#fff" }}>
          全クリア
        </button>
      </div>

      <div className="grid">
        <div className="column B">
          <h2>B</h2>
          <div className="tiles" id="colB"></div>
        </div>
        <div className="column I">
          <h2>I</h2>
          <div className="tiles" id="colI"></div>
        </div>
        <div className="column N">
          <h2>N</h2>
          <div className="tiles" id="colN"></div>
        </div>
        <div className="column G">
          <h2>G</h2>
          <div className="tiles" id="colG"></div>
        </div>
        <div className="column O">
          <h2>O</h2>
          <div className="tiles" id="colO"></div>
        </div>
      </div>
    </>
  );
}
