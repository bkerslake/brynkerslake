import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { readingCoverPaths } from "../readings/books";
import { ReadingsPreloader } from "./readings-preloader";

type IdleWindow = {
  cancelIdleCallback?: (handle: number) => void;
  requestIdleCallback?: (
    callback: IdleRequestCallback,
    options?: IdleRequestOptions,
  ) => number;
};

const idleWindow = window as unknown as IdleWindow;

function stubImage() {
  const created: { src: string; decoding: string }[] = [];

  class FakeImage {
    src = "";
    decoding = "";

    constructor() {
      created.push(this);
    }
  }

  vi.stubGlobal("Image", FakeImage);
  window.Image = FakeImage as unknown as typeof window.Image;

  return created;
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
  delete idleWindow.requestIdleCallback;
  delete idleWindow.cancelIdleCallback;
});

describe("ReadingsPreloader", () => {
  it("renders nothing", () => {
    const { container } = render(<ReadingsPreloader />);

    expect(container).toBeEmptyDOMElement();
  });

  it("preloads every cover through requestIdleCallback when available", () => {
    const created = stubImage();
    const pending: { callback?: IdleRequestCallback } = {};
    idleWindow.requestIdleCallback = vi.fn((callback) => {
      pending.callback = callback;
      return 7;
    });
    idleWindow.cancelIdleCallback = vi.fn();

    render(<ReadingsPreloader />);

    expect(idleWindow.requestIdleCallback).toHaveBeenCalledWith(
      expect.any(Function),
      { timeout: 1800 },
    );

    pending.callback?.({} as IdleDeadline);

    expect(created.map((image) => image.src)).toEqual(readingCoverPaths);
    expect(created.every((image) => image.decoding === "async")).toBe(true);
  });

  it("cancels a pending idle callback on unmount", () => {
    stubImage();
    idleWindow.requestIdleCallback = vi.fn(() => 42);
    idleWindow.cancelIdleCallback = vi.fn();

    render(<ReadingsPreloader />).unmount();

    expect(idleWindow.cancelIdleCallback).toHaveBeenCalledWith(42);
  });

  it("falls back to a timeout when requestIdleCallback is unsupported", () => {
    vi.useFakeTimers();
    const created = stubImage();

    render(<ReadingsPreloader />);

    expect(created).toHaveLength(0);

    vi.advanceTimersByTime(250);

    expect(created.map((image) => image.src)).toEqual(readingCoverPaths);
  });

  it("clears the fallback timeout on unmount", () => {
    vi.useFakeTimers();
    const created = stubImage();

    render(<ReadingsPreloader />).unmount();
    vi.advanceTimersByTime(1000);

    expect(created).toHaveLength(0);
  });
});
