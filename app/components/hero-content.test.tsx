import { act, fireEvent, render, screen } from "@testing-library/react";
import { createElement, type ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { HeroContent } from "./hero-content";

const reducedMotion = vi.fn(() => false);
const animations: { initial: object; animate: object; exit: object }[] = [];

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

const paragraphs = ["First paragraph.", "Second paragraph."];
const links = [
  { label: "GitHub", href: "https://github.com/bkerslake" },
  { label: "Email", copyText: "brynkerslake@gmail.com" },
];

function setClipboard(clipboard: Clipboard | undefined) {
  Object.defineProperty(window.navigator, "clipboard", {
    configurable: true,
    value: clipboard,
  });
}

function setExecCommand(execCommand: () => boolean) {
  Object.defineProperty(document, "execCommand", {
    configurable: true,
    value: execCommand,
  });
}

async function clickCopy() {
  await act(async () => {
    fireEvent.click(
      screen.getByRole("button", {
        name: "Copy brynkerslake@gmail.com to clipboard",
      }),
    );
  });
}

beforeEach(() => {
  reducedMotion.mockReturnValue(false);
  animations.length = 0;
});

afterEach(() => {
  setClipboard(undefined);
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe("HeroContent", () => {
  it("renders the title, paragraphs and external links", () => {
    render(<HeroContent links={links} paragraphs={paragraphs} />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Bryn Kerslake" }),
    ).toBeInTheDocument();
    paragraphs.forEach((paragraph) => {
      expect(screen.getByText(paragraph)).toBeInTheDocument();
    });

    const github = screen.getByRole("link", { name: "GitHub" });
    expect(github).toHaveAttribute("href", "https://github.com/bkerslake");
    expect(github).toHaveAttribute("target", "_blank");
    expect(github).toHaveAttribute("rel", "noreferrer");
  });

  it("copies via the clipboard API and shows temporary feedback", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    setClipboard({ writeText } as unknown as Clipboard);
    render(<HeroContent links={links} paragraphs={paragraphs} />);

    await clickCopy();

    expect(writeText).toHaveBeenCalledWith("brynkerslake@gmail.com");
    expect(screen.getByText("Copied!")).toBeInTheDocument();
  });

  it("resets the feedback after the timeout elapses", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    setClipboard({
      writeText: vi.fn().mockResolvedValue(undefined),
    } as unknown as Clipboard);
    render(<HeroContent links={links} paragraphs={paragraphs} />);

    await clickCopy();
    expect(screen.getByText("Copied!")).toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(1800);
    });

    expect(screen.queryByText("Copied!")).not.toBeInTheDocument();
  });

  it("falls back to a hidden textarea when the clipboard API is unavailable", async () => {
    const execCommand = vi.fn().mockReturnValue(true);
    setExecCommand(execCommand);
    render(<HeroContent links={links} paragraphs={paragraphs} />);

    await clickCopy();

    expect(execCommand).toHaveBeenCalledWith("copy");
    expect(document.querySelector("textarea")).toBeNull();
    expect(screen.getByText("Copied!")).toBeInTheDocument();
  });

  it("falls back to a hidden textarea when writeText rejects", async () => {
    const execCommand = vi.fn().mockReturnValue(true);
    setExecCommand(execCommand);
    setClipboard({
      writeText: vi.fn().mockRejectedValue(new Error("denied")),
    } as unknown as Clipboard);
    render(<HeroContent links={links} paragraphs={paragraphs} />);

    await clickCopy();

    expect(execCommand).toHaveBeenCalledWith("copy");
    expect(screen.getByText("Copied!")).toBeInTheDocument();
  });

  it("animates the copy label with a blurred slide by default", () => {
    render(<HeroContent links={links} paragraphs={paragraphs} />);

    expect(animations[0]).toEqual({
      initial: { opacity: 0, filter: "blur(6px)", y: 9 },
      animate: { opacity: 1, filter: "blur(0px)", y: 0 },
      exit: { opacity: 0, filter: "blur(6px)", y: -9 },
    });
  });

  it("animates opacity only when motion is reduced", () => {
    reducedMotion.mockReturnValue(true);
    render(<HeroContent links={links} paragraphs={paragraphs} />);

    expect(animations[0]).toEqual({
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    });
  });

  it("clears the reset timer on unmount", async () => {
    setClipboard({
      writeText: vi.fn().mockResolvedValue(undefined),
    } as unknown as Clipboard);
    const clearTimeoutSpy = vi.spyOn(globalThis, "clearTimeout");
    const { unmount } = render(
      <HeroContent links={links} paragraphs={paragraphs} />,
    );

    await clickCopy();
    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
});
