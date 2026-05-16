import { describe, expect, it } from "vitest";
import { render, act } from "@testing-library/react";
import { useShowWindowSize } from "../src";

function Probe(props: { disable?: boolean }) {
  useShowWindowSize(props);
  return null;
}

describe("useShowWindowSize", () => {
  it("creates and removes the overlay element", () => {
    const { unmount } = render(<Probe />);
    expect(document.getElementById("use-show-window-size")).not.toBeNull();
    unmount();
    expect(document.getElementById("use-show-window-size")).toBeNull();
  });

  it("does nothing when disabled", () => {
    render(<Probe disable />);
    expect(document.getElementById("use-show-window-size")).toBeNull();
  });

  it("renders the current size as text", () => {
    Object.defineProperty(document.documentElement, "clientWidth", {
      configurable: true,
      value: 1280,
    });
    Object.defineProperty(document.documentElement, "clientHeight", {
      configurable: true,
      value: 720,
    });
    render(<Probe />);
    expect(document.getElementById("use-show-window-size")?.textContent).toBe("1280px × 720px");
  });

  it("updates text on resize", () => {
    Object.defineProperty(document.documentElement, "clientWidth", {
      configurable: true,
      value: 800,
    });
    Object.defineProperty(document.documentElement, "clientHeight", {
      configurable: true,
      value: 600,
    });
    render(<Probe />);
    expect(document.getElementById("use-show-window-size")?.textContent).toBe("800px × 600px");

    Object.defineProperty(document.documentElement, "clientWidth", {
      configurable: true,
      value: 1024,
    });
    Object.defineProperty(document.documentElement, "clientHeight", {
      configurable: true,
      value: 768,
    });
    act(() => {
      window.dispatchEvent(new Event("resize"));
    });
    expect(document.getElementById("use-show-window-size")?.textContent).toBe("1024px × 768px");
  });
});
