# use-show-window-size

> React hook that overlays the current viewport size for development.

[![npm](https://img.shields.io/npm/v/use-show-window-size.svg)](https://www.npmjs.com/package/use-show-window-size)
[![license](https://img.shields.io/npm/l/use-show-window-size.svg)](./LICENSE)

Drops a small fixed badge in a corner of your page showing `<width>px × <height>px`. Handy while building responsive layouts. Dependency-free; updates on `resize`.

🌐 **Demo:** <https://use-show-window-size.kkweb.io>

## Install

```bash
npm install use-show-window-size
```

Requires React 18 or 19.

## Usage

```tsx
"use client";

import { useShowWindowSize } from "use-show-window-size";

export function DevLayout({ children }: { children: React.ReactNode }) {
  useShowWindowSize({
    disable: process.env.NODE_ENV === "production",
    position: "bottom-right",
  });

  return <>{children}</>;
}
```

The hook also returns the current size:

```tsx
const { width, height } = useShowWindowSize();
```

## API

| Option     | Type                                                           | Default       | Description                                   |
| ---------- | -------------------------------------------------------------- | ------------- | --------------------------------------------- |
| `disable`  | `boolean`                                                      | `false`       | Skip mounting / updating.                     |
| `position` | `"top-right" \| "top-left" \| "bottom-right" \| "bottom-left"` | `"top-right"` | Which corner the badge attaches to.           |
| `style`    | `CSSProperties`                                                | —             | Merged into the badge element's inline style. |

Returns `{ width: number; height: number }`.

### `style`

Pass it inline if you like — it is compared by value, so `style={{ ... }}` does not re-run anything on each render. Numbers follow React's rules: `fontSize: 14` becomes `14px`, while unitless properties such as `opacity`, `zIndex` and `lineHeight` are left as-is.

### Several instances

There is only ever one badge on the page. It appears when the first enabled hook mounts and is removed when the last one unmounts or is disabled. When more than one is mounted, the badge uses the `position` and `style` of the instance that mounted or changed its options most recently; if that one unmounts, the badge falls back to the next most recent.

## License

MIT
