"use client";
import useShowWindowSize from "@/hooks/useShowWindowSize";
import { ReactNode } from "react";

export type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps): JSX.Element {
  useShowWindowSize({
    // disable: process.env.NODE_ENV === "production",
  });

  return <>{children}</>;
}
