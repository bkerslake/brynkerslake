import { fireEvent, render, screen } from "@testing-library/react";
import { createElement, type ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Tilt } from "./tilt";

type FakeMotionValue = { value: number; set: (next: number) => void };

const reducedMotion = vi.fn(() => false);
const motionValues: FakeMotionValue[] = [];
const transforms: { source: FakeMotionValue; outputRange: number[] }[] = [];

vi.mock("motion/react", () => ({
  motion: {
    div: ({
      children,
      className,
      onPointerMove,
      onPointerLeave,
    }: {
      children?: ReactNode;
      className?: string;
      onPointerMove?: (event: unknown) => void;
      onPointerLeave?: () => void;
    }) =>
      createElement(
        "div",
        {
          className,
          "data-testid": "motion-div",
          onPointerMove,
          onPointerLeave,
        },
        children,
      ),
  },
  useMotionValue: (initial: number) => {
    const motionValue: FakeMotionValue = {
      value: initial,
      set(next: number) {
        motionValue.value = next;
      },
    };
    motionValues.push(motionValue);
    return motionValue;
  },
  useReducedMotion: () => reducedMotion(),
  useSpring: (value: unknown) => value,
  useTransform: (
    source: FakeMotionValue,
    _inputRange: number[],
    outputRange: number[],
  ) => {
    transforms.push({ source, outputRange });
    return source;
  },
}));

// jsdom lacks PointerEvent, so drive the handler with a mouse event carrying
// the coordinates the component reads.
function pointerMove(target: Element, clientX: number, clientY: number) {
  fireEvent(
    target,
    new MouseEvent("pointermove", { bubbles: true, clientX, clientY }),
  );
}

beforeEach(() => {
  motionValues.length = 0;
  transforms.length = 0;
  reducedMotion.mockReturnValue(false);
});

describe("Tilt", () => {
  it("renders a plain container without motion handlers when motion is reduced", () => {
    reducedMotion.mockReturnValue(true);
    render(
      <Tilt className="book-card">
        <span>child</span>
      </Tilt>,
    );

    expect(screen.getByText("child")).toBeInTheDocument();
    expect(screen.queryByTestId("motion-div")).not.toBeInTheDocument();
  });

  it("maps pointer position onto normalized -0.5..0.5 motion values", () => {
    render(<Tilt className="book-card">child</Tilt>);
    const target = screen.getByTestId("motion-div");
    target.getBoundingClientRect = () =>
      ({ left: 100, top: 200, width: 200, height: 100 }) as DOMRect;

    pointerMove(target, 250, 225);

    const [x, y] = motionValues;
    expect(x.value).toBeCloseTo(0.25);
    expect(y.value).toBeCloseTo(-0.25);
  });

  it("resets motion values when the pointer leaves", () => {
    render(<Tilt className="book-card">child</Tilt>);
    const target = screen.getByTestId("motion-div");
    target.getBoundingClientRect = () =>
      ({ left: 0, top: 0, width: 100, height: 100 }) as DOMRect;

    pointerMove(target, 100, 100);
    fireEvent.pointerLeave(target);

    const [x, y] = motionValues;
    expect(x.value).toBe(0);
    expect(y.value).toBe(0);
  });

  it("uses the rotation factor to build the default rotation ranges", () => {
    render(<Tilt rotationFactor={12}>child</Tilt>);

    expect(transforms.map((transform) => transform.outputRange)).toEqual([
      [12, -12],
      [-12, 12],
    ]);
  });

  it.each(["isReverse", "isRevese"] as const)(
    "flips the rotation ranges via the %s prop",
    (prop) => {
      render(<Tilt {...{ [prop]: true }}>child</Tilt>);

      expect(transforms.map((transform) => transform.outputRange)).toEqual([
        [-8, 8],
        [8, -8],
      ]);
    },
  );
});
