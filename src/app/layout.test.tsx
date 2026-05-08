import { Children, type ReactElement } from "react";
import { describe, expect, it } from "vitest";
import RootLayout from "@/app/layout";

describe("RootLayout", () => {
  it("suppresses hydration warnings for extension-mutated document attributes", () => {
    const layout = RootLayout({ children: <main /> }) as ReactElement<{
      children: ReactElement;
      suppressHydrationWarning?: boolean;
    }>;
    const body = Children.only(layout.props.children) as ReactElement<{
      suppressHydrationWarning?: boolean;
    }>;

    expect(layout.type).toBe("html");
    expect(layout.props.suppressHydrationWarning).toBe(true);
    expect(body.type).toBe("body");
    expect(body.props.suppressHydrationWarning).toBe(true);
  });
});
