"use client";

import { useEffect, useLayoutEffect, useState, type CSSProperties } from "react";
import {
  claimOverlay,
  releaseOverlay,
  updateOverlay,
  type ShowWindowSizePosition,
} from "./overlay";

export type { ShowWindowSizePosition };

export type UseShowWindowSizeOptions = {
  disable?: boolean;
  position?: ShowWindowSizePosition;
  /** Merged into the badge's inline style. Numbers follow React's rules:
   *  `fontSize: 14` becomes `14px`, unitless properties such as `opacity`
   *  stay as-is. An inline object is fine; it is compared by value. */
  style?: CSSProperties;
};

export type WindowSize = {
  width: number;
  height: number;
};

// useLayoutEffect so the badge picks up new options before paint; falls back
// to useEffect on the server, where React 18 warns about layout effects.
const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

function readSize(): WindowSize {
  return {
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
  };
}

export function useShowWindowSize(options: UseShowWindowSizeOptions = {}): WindowSize {
  const { disable = false, position = "top-right", style } = options;
  const [size, setSize] = useState<WindowSize>({ width: 0, height: 0 });
  const [token] = useState(() => Symbol("use-show-window-size"));

  // Compare style by value, so `style={{ ... }}` written inline does not
  // count as a change on every render.
  const styleKey = style ? JSON.stringify(style) : "";

  useEffect(() => {
    if (disable) return;
    const update = () => {
      const next = readSize();
      setSize((prev) => (prev.width === next.width && prev.height === next.height ? prev : next));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [disable]);

  // Claim the shared badge for as long as this instance is enabled.
  useIsomorphicLayoutEffect(() => {
    if (disable) return;
    claimOverlay(token, { position: "top-right" });
    return () => releaseOverlay(token);
  }, [disable, token]);

  // Push this instance's options to the badge whenever they change by value.
  // Declared after the claim so it runs once the claim exists.
  useIsomorphicLayoutEffect(() => {
    if (disable) return;
    updateOverlay(token, {
      position,
      style: styleKey ? (JSON.parse(styleKey) as CSSProperties) : undefined,
    });
  }, [disable, token, position, styleKey]);

  return size;
}
