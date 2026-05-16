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

## License

MIT
