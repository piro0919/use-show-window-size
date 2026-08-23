import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { cwd } from "node:process";
import { ImageResponse } from "next/og";

export const alt = "use-show-window-size";

export const size = { width: 1200, height: 630 };

export const contentType = "image/png";

const TITLE = "use-show-window-size";
const DESCRIPTION = "React hook that shows the current window size while you develop.";

export default async function Image() {
  /* 見出しの書体はサイトと同じ JetBrains Mono。使う文字だけに絞ったものを
     同梱している。文言を変えたら assets/README.md の手順で作り直す */
  const font = await readFile(join(cwd(), "assets/JetBrainsMono-800-subset.ttf"));

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        padding: "0 80px",
        background: "#0b0b0f",
        color: "#ffffff",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: 600,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 68,
            fontWeight: 700,
            letterSpacing: -1,
          }}
        >
          {TITLE}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 32,
            marginTop: 28,
            lineHeight: 1.4,
            color: "#a1a1aa",
          }}
        >
          {DESCRIPTION}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 26,
            marginTop: 48,
            color: "#71717a",
          }}
        >
          kkweb.io
        </div>
      </div>

      {/* 何をするパッケージなのかを右に置く。名前と説明だけだと、
          9件が同じ絵になってタイムラインで見分けが付かない */}
      <div
        style={{
          alignItems: "center",
          display: "flex",
          flex: 1,
          justifyContent: "center",
        }}
      >
        <div
          style={{
            background: "#15151c",
            border: "1px solid #26262f",
            borderRadius: 16,
            display: "flex",
            flexDirection: "column",
            height: 230,
            position: "relative",
            width: 340,
          }}
        >
          <div
            style={{
              alignItems: "center",
              borderBottom: "1px solid #26262f",
              display: "flex",
              gap: 8,
              height: 40,
              padding: "0 16px",
            }}
          >
            {["#3f3f46", "#3f3f46", "#3f3f46"].map((c, i) => (
              <div
                key={i}
                style={{
                  background: c,
                  borderRadius: 999,
                  height: 10,
                  width: 10,
                }}
              />
            ))}
          </div>
          {/* 隅に出る、いまの寸法の札 */}
          <div
            style={{
              background: "#8b5cf6",
              borderRadius: 8,
              bottom: 16,
              color: "#0b0b0f",
              display: "flex",
              fontSize: 22,
              fontWeight: 700,
              padding: "8px 14px",
              position: "absolute",
              right: 16,
            }}
          >
            1200 × 630
          </div>
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [{ data: font, name: "JetBrains Mono", style: "normal", weight: 800 }],
    },
  );
}
