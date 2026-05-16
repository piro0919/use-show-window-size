"use client";

import { useEffect, useState, type CSSProperties } from "react";

export type ShowWindowSizePosition = "top-right" | "top-left" | "bottom-right" | "bottom-left";

export type UseShowWindowSizeOptions = {
  disable?: boolean;
  position?: ShowWindowSizePosition;
  style?: CSSProperties;
};

export type WindowSize = {
  width: number;
  height: number;
};

const ELEMENT_ID = "use-show-window-size";

const POSITION_STYLE: Record<ShowWindowSizePosition, Partial<CSSStyleDeclaration>> = {
  "top-right": { top: "0", right: "0" },
  "top-left": { top: "0", left: "0" },
  "bottom-right": { bottom: "0", right: "0" },
  "bottom-left": { bottom: "0", left: "0" },
};

function readSize(): WindowSize {
  if (typeof document === "undefined") return { width: 0, height: 0 };
  return {
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
  };
}

export function useShowWindowSize(options: UseShowWindowSizeOptions = {}): WindowSize {
  const { disable = false, position = "top-right", style } = options;
  const [size, setSize] = useState<WindowSize>({ width: 0, height: 0 });

  useEffect(() => {
    if (disable || typeof document === "undefined") return;

    document.getElementById(ELEMENT_ID)?.remove();

    const node = document.createElement("div");
    node.id = ELEMENT_ID;
    node.style.background = "#fff";
    node.style.color = "#000";
    node.style.fontFamily = "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
    node.style.fontSize = "12px";
    node.style.padding = "2px 6px";
    node.style.position = "fixed";
    node.style.zIndex = "2147483647";
    node.style.pointerEvents = "none";
    Object.assign(node.style, POSITION_STYLE[position]);
    if (style) Object.assign(node.style, style);

    document.body.appendChild(node);

    const update = () => {
      const next = readSize();
      setSize(next);
      node.textContent = `${next.width}px × ${next.height}px`;
    };

    update();
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("resize", update);
      node.remove();
    };
  }, [disable, position, style]);

  return size;
}
