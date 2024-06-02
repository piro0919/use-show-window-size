import { useEffect, useState } from "react";
import { useEventListener } from "usehooks-ts";

export type ShowWindowSizeParams = {
  disable?: boolean;
  style?: Partial<CSSStyleDeclaration>;
};

export default function useShowWindowSize({
  disable = false,
  style = {},
}: ShowWindowSizeParams): void {
  const [block, setBlock] = useState<HTMLDivElement>();
  const [windowSize, setWindowSize] = useState({ height: 0, width: 0 });

  useEffect(() => {
    if (block || disable) {
      return;
    }

    const prevBlock = document.getElementById("use-show-window-size");

    if (prevBlock) {
      // Strict Mode 対策
      prevBlock.remove();
    }

    const newBlock = document.body.appendChild(document.createElement("div"));

    newBlock.id = "use-show-window-size";
    newBlock.style.background = "#fff";
    newBlock.style.color = "#000";
    newBlock.style.fontFamily = "arial, sans-serif";
    newBlock.style.fontSize = "12px";
    newBlock.style.padding = "2px 4px";
    newBlock.style.position = "fixed";
    newBlock.style.right = "0px";
    newBlock.style.top = "0px";
    newBlock.style.zIndex = "9999";

    Object.keys(style).forEach((key) => {
      // @ts-ignore
      newBlock.style[key] = style[key];
    });

    setBlock(newBlock);
  }, [block, disable, style]);

  useEffect(() => {
    if (disable) {
      return;
    }

    const height = document.documentElement.clientHeight;
    const width = document.documentElement.clientWidth;

    setWindowSize({ height, width });
  }, [disable]);

  useEventListener("resize", () => {
    if (disable) {
      return;
    }

    const height = document.documentElement.clientHeight;
    const width = document.documentElement.clientWidth;

    setWindowSize({ height, width });
  });

  useEffect(() => {
    if (!block || disable) {
      return;
    }

    const { height, width } = windowSize;

    block.innerHTML = `${width}px × ${height}px`;
  }, [block, disable, windowSize]);
}
