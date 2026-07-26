import { render, screen } from "@testing-library/react";
import { createElement, type ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import RootLayout, { metadata } from "./layout";

vi.mock("next/font/local", () => ({
  default: () => ({ variable: "font-variable", className: "font-class" }),
}));

vi.mock("./components/page-transition", () => ({
  PageTransition: ({ children }: { children: ReactNode }) =>
    createElement("div", { "data-testid": "page-transition" }, children),
}));

vi.mock("./components/corner-nav-link", () => ({
  CornerNavLink: () => createElement("nav", { "data-testid": "corner-nav" }),
}));

vi.mock("./components/readings-preloader", () => ({
  ReadingsPreloader: () =>
    createElement("div", { "data-testid": "readings-preloader" }),
}));

describe("RootLayout", () => {
  it("exposes site metadata", () => {
    expect(metadata.title).toBe("Bryn Kerslake");
    expect(metadata.description).toBe("A personal site for Bryn Kerslake.");
  });

  it("wraps children in the page transition next to the corner nav", () => {
    render(
      <RootLayout>
        <main>page</main>
      </RootLayout>,
      { container: document.documentElement },
    );

    const transition = screen.getByTestId("page-transition");
    expect(transition).toContainElement(screen.getByTestId("corner-nav"));
    expect(transition).toContainElement(screen.getByText("page"));
    expect(screen.getByTestId("readings-preloader")).toBeInTheDocument();
  });

  it("applies the local font variable to the body", () => {
    render(<RootLayout>page</RootLayout>, {
      container: document.documentElement,
    });

    expect(document.querySelector("body.font-variable")).not.toBeNull();
    expect(document.querySelector("html[lang='en']")).not.toBeNull();
  });
});
