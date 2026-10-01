import type { CSSProperties } from "react";

export type ShowWindowSizePosition = "top-right" | "top-left" | "bottom-right" | "bottom-left";

export type OverlayOptions = {
  position: ShowWindowSizePosition;
  style?: CSSProperties;
};

export const ELEMENT_ID = "use-show-window-size";

const BASE_STYLE: Record<string, string> = {
  background: "#fff",
  color: "#000",
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  fontSize: "12px",
  padding: "2px 6px",
  position: "fixed",
  zIndex: "2147483647",
  pointerEvents: "none",
};

const POSITION_STYLE: Record<ShowWindowSizePosition, Record<string, string>> = {
  "top-right": { top: "0", right: "0" },
  "top-left": { top: "0", left: "0" },
  "bottom-right": { bottom: "0", right: "0" },
  "bottom-left": { bottom: "0", left: "0" },
};

// Properties React leaves unitless when given a number. Every other numeric
// value gets "px", matching how React renders a `style` prop.
const UNITLESS = new Set([
  "animationIterationCount",
  "aspectRatio",
  "borderImageOutset",
  "borderImageSlice",
  "borderImageWidth",
  "boxFlex",
  "boxFlexGroup",
  "boxOrdinalGroup",
  "columnCount",
  "columns",
  "flex",
  "flexGrow",
  "flexPositive",
  "flexShrink",
  "flexNegative",
  "flexOrder",
  "fontWeight",
  "gridArea",
  "gridColumn",
  "gridColumnEnd",
  "gridColumnSpan",
  "gridColumnStart",
  "gridRow",
  "gridRowEnd",
  "gridRowSpan",
  "gridRowStart",
  "lineClamp",
  "lineHeight",
  "opacity",
  "order",
  "orphans",
  "scale",
  "tabSize",
  "widows",
  "zIndex",
  "zoom",
  "fillOpacity",
  "floodOpacity",
  "stopOpacity",
  "strokeDasharray",
  "strokeDashoffset",
  "strokeMiterlimit",
  "strokeOpacity",
  "strokeWidth",
]);

function isUnitless(name: string): boolean {
  if (UNITLESS.has(name)) return true;
  // Vendor-prefixed forms such as WebkitLineClamp or msFlexOrder.
  const unprefixed = name.replace(/^(Webkit|Moz|ms|O)(?=[A-Z])/, "");
  if (unprefixed === name) return false;
  return UNITLESS.has(unprefixed.charAt(0).toLowerCase() + unprefixed.slice(1));
}

/** Converts one React style value to the string the DOM expects, or null to skip it. */
export function toCssValue(name: string, value: unknown): string | null {
  if (value == null || typeof value === "boolean" || value === "") return null;
  if (typeof value === "number") {
    if (value === 0 || name.startsWith("--") || isUnitless(name)) return String(value);
    return `${value}px`;
  }
  return String(value).trim();
}

function applyStyle(node: HTMLElement, style: Record<string, unknown>): void {
  for (const [name, raw] of Object.entries(style)) {
    const value = toCssValue(name, raw);
    if (value === null) continue;
    if (name.startsWith("--")) {
      node.style.setProperty(name, value);
    } else {
      (node.style as unknown as Record<string, string>)[name] = value;
    }
  }
}

function readSize() {
  return {
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
  };
}

// One badge per page, shared by every mounted hook. Each instance holds a
// claim; the badge exists while at least one claim does, and shows the
// options of the claim that was mounted or changed most recently.
type Claim = { options: OverlayOptions; seq: number };

const claims = new Map<symbol, Claim>();
let node: HTMLDivElement | null = null;
let seq = 0;

function renderText(): void {
  if (!node) return;
  const { width, height } = readSize();
  node.textContent = `${width}px × ${height}px`;
}

function applyLatest(): void {
  if (!node) return;
  let latest: Claim | undefined;
  for (const claim of claims.values()) {
    if (!latest || claim.seq > latest.seq) latest = claim;
  }
  if (!latest) return;
  node.style.cssText = "";
  applyStyle(node, BASE_STYLE);
  applyStyle(node, POSITION_STYLE[latest.options.position]);
  if (latest.options.style) applyStyle(node, latest.options.style as Record<string, unknown>);
}

export function claimOverlay(token: symbol, options: OverlayOptions): void {
  claims.set(token, { options, seq: ++seq });
  if (!node) {
    // A node left behind by another copy of this package (or an older
    // version) would otherwise show up as a second badge.
    document.getElementById(ELEMENT_ID)?.remove();
    node = document.createElement("div");
    node.id = ELEMENT_ID;
    document.body.appendChild(node);
    window.addEventListener("resize", renderText);
    renderText();
  }
  applyLatest();
}

export function updateOverlay(token: symbol, options: OverlayOptions): void {
  const claim = claims.get(token);
  if (!claim) return;
  claim.options = options;
  claim.seq = ++seq;
  applyLatest();
}

export function releaseOverlay(token: symbol): void {
  if (!claims.delete(token)) return;
  if (claims.size > 0) {
    applyLatest();
    return;
  }
  window.removeEventListener("resize", renderText);
  node?.remove();
  node = null;
}
