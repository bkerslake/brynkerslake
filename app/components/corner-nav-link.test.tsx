import { render, screen } from "@testing-library/react";
import { createElement, type ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CornerNavLink } from "./corner-nav-link";

const pathname = vi.fn(() => "/");
const reducedMotion = vi.fn(() => false);
const animations: { initial: object; animate: object; exit: object }[] = [];

vi.mock("next/navigation", () => ({
  usePathname: () => pathname(),
}));

vi.mock("motion/react", () => ({
  AnimatePresence: ({ children }: { children: ReactNode }) => children,
  motion: {
    span: ({
      children,
      className,
      initial,
      animate,
      exit,
    }: {
      children?: ReactNode;
      className?: string;
      initial: object;
      animate: object;
      exit: object;
    }) => {
      animations.push({ initial, animate, exit });
      return createElement("span", { className }, children);
    },
  },
  useReducedMotion: () => reducedMotion(),
}));

vi.mock("./transition-link", () => ({
  TransitionLink: ({
    children,
    href,
    ...props
  }: {
    children?: ReactNode;
    href: string;
  }) => createElement("a", { href, ...props }, children),
}));

beforeEach(() => {
  pathname.mockReturnValue("/");
  reducedMotion.mockReturnValue(false);
  animations.length = 0;
});

describe("CornerNavLink", () => {
  it("links to readings and work from the home page", () => {
    render(<CornerNavLink />);

    expect(screen.getByRole("link", { name: "Go to Readings" })).toHaveAttribute(
      "href",
      "/readings",
    );
    expect(screen.getByRole("link", { name: "Go to Work" })).toHaveAttribute(
      "href",
      "/work",
    );
  });

  it("turns the left link into Home on the readings page", () => {
    pathname.mockReturnValue("/readings");
    render(<CornerNavLink />);

    const home = screen.getByRole("link", { name: "Go to Home" });
    expect(home).toHaveAttribute("href", "/");
    expect(home).toHaveClass("corner-link-left");
    expect(screen.getByRole("link", { name: "Go to Work" })).toHaveAttribute(
      "href",
      "/work",
    );
  });

  it("animates the label with a blurred slide by default", () => {
    render(<CornerNavLink />);

    expect(animations[0]).toEqual({
      initial: { opacity: 0, filter: "blur(6px)", y: 9 },
      animate: { opacity: 1, filter: "blur(0px)", y: 0 },
      exit: { opacity: 0, filter: "blur(6px)", y: -9 },
    });
  });

  it("animates opacity only when motion is reduced", () => {
    reducedMotion.mockReturnValue(true);
    render(<CornerNavLink />);

    expect(animations[0]).toEqual({
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    });
  });

  it("turns the right link into Home on the work page", () => {
    pathname.mockReturnValue("/work");
    render(<CornerNavLink />);

    const home = screen.getByRole("link", { name: "Go to Home" });
    expect(home).toHaveAttribute("href", "/");
    expect(home).toHaveClass("corner-link-right");
    expect(
      screen.getByRole("link", { name: "Go to Readings" }),
    ).toHaveAttribute("href", "/readings");
  });
});
