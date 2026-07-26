import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TransitionLink } from "./transition-link";

const navigate = vi.fn();
const prefetch = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ prefetch }),
}));

vi.mock("./page-transition", () => ({
  usePageTransition: () => ({ navigate }),
}));

// jsdom cannot perform real navigations; swallow the default action of clicks
// the component intentionally lets through to the browser.
function suppressNavigation(event: Event) {
  event.preventDefault();
}

beforeEach(() => {
  navigate.mockClear();
  prefetch.mockClear();
  document.addEventListener("click", suppressNavigation);
});

afterEach(() => {
  document.removeEventListener("click", suppressNavigation);
});

describe("TransitionLink", () => {
  it("prefetches same-origin routes on mount", () => {
    render(<TransitionLink href="/work?a=1#top">Work</TransitionLink>);

    expect(prefetch).toHaveBeenCalledWith("/work?a=1#top");
  });

  it("does not prefetch cross-origin hrefs", () => {
    render(<TransitionLink href="https://example.com/x">Away</TransitionLink>);

    expect(prefetch).not.toHaveBeenCalled();
  });

  it("prefetches again on focus and pointer enter, keeping caller handlers", () => {
    const onFocus = vi.fn();
    const onPointerEnter = vi.fn();
    render(
      <TransitionLink
        href="/readings"
        onFocus={onFocus}
        onPointerEnter={onPointerEnter}
      >
        Readings
      </TransitionLink>,
    );
    prefetch.mockClear();

    const link = screen.getByRole("link");
    fireEvent.focus(link);
    fireEvent.pointerEnter(link);

    expect(onFocus).toHaveBeenCalledTimes(1);
    expect(onPointerEnter).toHaveBeenCalledTimes(1);
    expect(prefetch).toHaveBeenCalledTimes(2);
  });

  it("intercepts plain left clicks and navigates through the transition", () => {
    const onClick = vi.fn();
    render(
      <TransitionLink href="/work" onClick={onClick}>
        Work
      </TransitionLink>,
    );

    fireEvent.click(screen.getByRole("link"));

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenCalledWith(`${window.location.origin}/work`);
  });

  it.each([
    ["metaKey", { metaKey: true }],
    ["ctrlKey", { ctrlKey: true }],
    ["shiftKey", { shiftKey: true }],
    ["altKey", { altKey: true }],
    ["middle click", { button: 1 }],
  ])("leaves the browser to handle %s", (_name, modifiers) => {
    render(<TransitionLink href="/work">Work</TransitionLink>);

    fireEvent.click(screen.getByRole("link"), modifiers);

    expect(navigate).not.toHaveBeenCalled();
  });

  it("does not navigate when the caller already prevented the event", () => {
    render(
      <TransitionLink
        href="/work"
        onClick={(event) => event.preventDefault()}
      >
        Work
      </TransitionLink>,
    );

    fireEvent.click(screen.getByRole("link"));

    expect(navigate).not.toHaveBeenCalled();
  });

  it("does not navigate for links opening in another target", () => {
    render(
      <TransitionLink href="/work" target="_blank">
        Work
      </TransitionLink>,
    );

    fireEvent.click(screen.getByRole("link"));

    expect(navigate).not.toHaveBeenCalled();
  });
});
