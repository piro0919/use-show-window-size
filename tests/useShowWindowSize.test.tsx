import { describe, expect, it, vi } from "vitest";
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

describe("useShowWindowSize with options", () => {
  const badge = () => document.getElementById("use-show-window-size");

  it("does not loop when style is passed inline", () => {
    const onRender = vi.fn();
    function Inline() {
      onRender();
      // Break out of a runaway loop so a regression fails instead of hanging.
      if (onRender.mock.calls.length > 50) throw new Error("render loop");
      useShowWindowSize({ style: { background: "red" } });
      return null;
    }
    render(<Inline />);
    act(() => {
      window.dispatchEvent(new Event("resize"));
    });
    // Mount plus at most one size update; an effect loop would hit React's
    // update-depth limit long before this assertion.
    expect(onRender.mock.calls.length).toBeLessThanOrEqual(3);
    expect(badge()?.style.background).toBe("red");
  });

  it("does not re-render when a resize leaves the size unchanged", () => {
    const onRender = vi.fn();
    function Counter() {
      onRender();
      useShowWindowSize();
      return null;
    }
    render(<Counter />);
    const afterMount = onRender.mock.calls.length;
    for (let i = 0; i < 5; i += 1) {
      act(() => {
        window.dispatchEvent(new Event("resize"));
      });
    }
    // React may render once more before bailing out on an identical state;
    // a fresh object per resize would render on every one of the five.
    expect(onRender.mock.calls.length).toBeLessThanOrEqual(afterMount + 1);
  });

  it("adds px to numeric length values and keeps unitless ones", () => {
    function Styled() {
      useShowWindowSize({
        style: { fontSize: 14, padding: 4, opacity: 0.5, zIndex: 10, lineHeight: 1.5 },
      });
      return null;
    }
    render(<Styled />);
    const style = badge()?.style;
    expect(style?.fontSize).toBe("14px");
    expect(style?.padding).toBe("4px");
    expect(style?.opacity).toBe("0.5");
    expect(style?.zIndex).toBe("10");
    expect(style?.lineHeight).toBe("1.5");
  });

  it("updates the badge when style changes by value", () => {
    function Styled(props: { color: string }) {
      useShowWindowSize({ style: { color: props.color } });
      return null;
    }
    const { rerender } = render(<Styled color="red" />);
    expect(badge()?.style.color).toBe("red");
    rerender(<Styled color="blue" />);
    expect(badge()?.style.color).toBe("blue");
  });

  it("keeps a single badge across instances and removes it after the last unmount", () => {
    function A() {
      useShowWindowSize({ position: "top-left" });
      return null;
    }
    function B() {
      useShowWindowSize({ position: "bottom-right" });
      return null;
    }
    const a = render(<A />);
    const b = render(<B />);
    expect(document.querySelectorAll("#use-show-window-size")).toHaveLength(1);
    // Latest mounted instance wins.
    expect(badge()?.style.bottom).toBe("0px");

    b.unmount();
    expect(badge()).not.toBeNull();
    // Falls back to the remaining instance's options.
    expect(badge()?.style.left).toBe("0px");
    expect(badge()?.style.bottom).toBe("");

    a.unmount();
    expect(badge()).toBeNull();
  });

  it("keeps the badge when one of two instances is disabled", () => {
    function Probe2(props: { disable?: boolean }) {
      useShowWindowSize(props);
      return null;
    }
    const a = render(<Probe2 />);
    const b = render(<Probe2 />);
    b.rerender(<Probe2 disable />);
    expect(badge()).not.toBeNull();
    a.unmount();
    expect(badge()).toBeNull();
    b.unmount();
  });
});
