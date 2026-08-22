"use client";

import { useState } from "react";
import { useShowWindowSize, type ShowWindowSizePosition } from "@/hooks/useShowWindowSize";

const POSITIONS: ShowWindowSizePosition[] = [
  "top-right",
  "top-left",
  "bottom-right",
  "bottom-left",
];

export default function Home() {
  const [position, setPosition] = useState<ShowWindowSizePosition>("top-right");
  const [disable, setDisable] = useState(false);
  const size = useShowWindowSize({ position, disable });

  return (
    /* ページそのものを寸法を測る面にする。縁に目盛りを引き、
       いまの大きさを中央に大きく出す。窓を動かすと全部が動く */
    <main className="stage">
      <div className="ruler ruler-top" />
      <div className="ruler ruler-left" />

      <div className="readout">
        <span className="readout-num">{size.width}</span>
        <span className="readout-x">×</span>
        <span className="readout-num">{size.height}</span>
      </div>

      <h1 className="name">use-show-window-size</h1>
      <p className="lead">
        React hook that overlays the current viewport size in a corner. The badge in the corner is
        the hook. Everything else on this page is just the same numbers, larger.
      </p>

      <div className="row">
        <span className="row-label">position</span>
        {POSITIONS.map((p) => (
          <button
            className={`chip ${p === position ? "on" : ""}`}
            key={p}
            onClick={() => setPosition(p)}
            type="button"
          >
            {p}
          </button>
        ))}
      </div>

      <div className="row">
        <span className="row-label">disable</span>
        <button
          className={`chip ${disable ? "" : "on"}`}
          onClick={() => setDisable(false)}
          type="button"
        >
          false
        </button>
        <button
          className={`chip ${disable ? "on" : ""}`}
          onClick={() => setDisable(true)}
          type="button"
        >
          true
        </button>
      </div>

      <div className="foot">
        <code className="install">npm i use-show-window-size</code>
        <a
          className="github-link"
          href="https://github.com/piro0919/use-show-window-size"
          rel="noopener noreferrer"
          target="_blank"
        >
          GitHub →
        </a>
      </div>
    </main>
  );
}
