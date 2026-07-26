import { act, render, renderHook, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PageTransition, usePageTransition } from "./page-transition";

const push = vi.fn();
const pathname = vi.fn(() => "/");
const reducedMotion = vi.fn(() => false);

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
  usePathname: () => pathname(),
}));

vi.mock("motion/react", async () => {
  const react = await import("react");

  return {
    motion: {
      div: (props: {
        animate?: { opacity?: number };
        className?: string;
      }) =>
        react.createElement("div", {
          className: props.className,
          "data-opacity": String(props.animate?.opacity),
        }),
    },
    useReducedMotion: () => reducedMotion(),
  };
});

function wrapper({ children }: { children: ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}

function coverOpacity() {
  return document
    .querySelector(".route-transition-cover")
    ?.getAttribute("data-opacity");
}

beforeEach(() => {
  vi.useFakeTimers();
  push.mockClear();
  pathname.mockReturnValue("/");
  reducedMotion.mockReturnValue(false);
  window.history.replaceState({}, "", "/");
});

afterEach(() => {
  vi.useRealTimers();
});

describe("usePageTransition", () => {
  it("throws outside of a PageTransition provider", () => {
    expect(() => renderHook(() => usePageTransition())).toThrow(
      "usePageTransition must be used within PageTransition",
    );
  });
});

describe("PageTransition", () => {
  it("renders children inside the transition shell", () => {
    render(
      <PageTransition>
        <p>content</p>
      </PageTransition>,
    );

    expect(screen.getByText("content")).toBeInTheDocument();
  });

  it("defers the router push so the cover can animate in", () => {
    const { result } = renderHook(() => usePageTransition(), { wrapper });

    act(() => {
      result.current.navigate("/work");
    });

    expect(push).not.toHaveBeenCalled();
    expect(coverOpacity()).toBe("1");

    act(() => {
      vi.advanceTimersByTime(80);
    });

    expect(push).toHaveBeenCalledWith("/work");
  });

  it("pushes immediately without covering when motion is reduced", () => {
    reducedMotion.mockReturnValue(true);
    const { result } = renderHook(() => usePageTransition(), { wrapper });

    act(() => {
      result.current.navigate("/work?tab=1#a");
    });

    expect(push).toHaveBeenCalledWith("/work?tab=1#a");
    expect(coverOpacity()).toBe("0");
  });

  it("ignores navigation to the current url", () => {
    window.history.replaceState({}, "", "/work?tab=1");
    const { result } = renderHook(() => usePageTransition(), { wrapper });

    act(() => {
      result.current.navigate("/work?tab=1");
    });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(push).not.toHaveBeenCalled();
  });

  it("hands cross-origin urls to the browser", () => {
    const assign = vi.fn();
    const { result } = renderHook(() => usePageTransition(), { wrapper });
    vi.spyOn(window, "location", "get").mockReturnValue({
      ...window.location,
      assign,
    } as unknown as Location);

    act(() => {
      result.current.navigate("https://example.com/away");
    });

    expect(assign).toHaveBeenCalledWith("https://example.com/away");
    expect(push).not.toHaveBeenCalled();
    vi.restoreAllMocks();
  });

  it("cancels a pending push when a newer navigation starts", () => {
    const { result } = renderHook(() => usePageTransition(), { wrapper });

    act(() => {
      result.current.navigate("/work");
    });
    act(() => {
      result.current.navigate("/readings");
    });
    act(() => {
      vi.advanceTimersByTime(80);
    });

    expect(push).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith("/readings");
  });

  it("reveals the new route shortly after the pathname settles", () => {
    const { result, rerender } = renderHook(() => usePageTransition(), {
      wrapper,
    });

    act(() => {
      result.current.navigate("/work");
    });
    act(() => {
      vi.advanceTimersByTime(80);
    });

    pathname.mockReturnValue("/work");
    rerender();

    expect(coverOpacity()).toBe("1");

    act(() => {
      vi.advanceTimersByTime(35);
    });

    expect(coverOpacity()).toBe("0");

    // Later renders of the same pathname no longer re-arm the reveal.
    rerender();
    act(() => {
      vi.advanceTimersByTime(35);
    });

    expect(coverOpacity()).toBe("0");
  });

  it("does not push after unmount", () => {
    const { result, unmount } = renderHook(() => usePageTransition(), {
      wrapper,
    });

    act(() => {
      result.current.navigate("/work");
    });
    unmount();
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(push).not.toHaveBeenCalled();
  });
});
