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
    <div className="container">
      <h1 className="title">use-show-window-size</h1>
      <p className="subtitle">
        React hook that overlays the current viewport size in a corner. Look at the small badge
        showing the size — try resizing this window or your dev tools panel.
      </p>

      <section className="section">
        <h2>Position</h2>
        <p>Choose which corner the badge attaches to.</p>
        <div className="controls">
          {POSITIONS.map((p) => (
            <button
              key={p}
              className={`btn ${p === position ? "active" : ""}`}
              onClick={() => setPosition(p)}
              type="button"
            >
              {p}
            </button>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>Disable</h2>
        <p>
          Toggle <code>disable</code>. Useful for{" "}
          <code>process.env.NODE_ENV === &quot;production&quot;</code>.
        </p>
        <div className="controls">
          <button
            className={`btn ${disable ? "" : "active"}`}
            onClick={() => setDisable(false)}
            type="button"
          >
            enabled
          </button>
          <button
            className={`btn ${disable ? "active" : ""}`}
            onClick={() => setDisable(true)}
            type="button"
          >
            disabled
          </button>
        </div>
      </section>

      <section className="section">
        <h2>Return value</h2>
        <p>
          The hook also returns the current size as <code>{"{ width, height }"}</code> for
          programmatic use.
        </p>
        <div className="size">
          {size.width}px × {size.height}px
        </div>
      </section>

      <a
        className="github-link"
        href="https://github.com/piro0919/use-show-window-size"
        rel="noopener noreferrer"
        target="_blank"
      >
        GitHub →
      </a>
    </div>
  );
}
