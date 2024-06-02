# use-show-window-size

use-show-window-size shows window size during development.

## Features

- TypeScript support
- SSR support

## Installation

`npm i --save use-show-window-size`

## Example

Example

## Usage

### Next.js

```tsx
"use client";
import useShowWindowSize from "@/hooks/useShowWindowSize";
import { ReactNode } from "react";

export type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps): JSX.Element {
  useShowWindowSize({
    disable: process.env.NODE_ENV === "production",
  });

  return <>{children}</>;
}
```

### Arguments

| Argument |             Type              | Optional |
| -------- | :---------------------------: | :------: |
| disable  |            Boolean            |    ✓     |
| style    | Partial\<CSSStyleDeclaration> |    ✓     |

### Return

`void`
