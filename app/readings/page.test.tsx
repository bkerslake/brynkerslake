import { render, screen } from "@testing-library/react";
import { createElement, type ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { books } from "./books";
import Readings, { metadata } from "./page";

vi.mock("../components/tilt", () => ({
  Tilt: ({ children, className }: { children: ReactNode; className?: string }) =>
    createElement("div", { className }, children),
}));

vi.mock("next/image", () => ({
  default: ({ alt, src, priority }: { alt: string; src: string; priority?: boolean }) =>
    createElement("img", { alt, src, "data-priority": String(Boolean(priority)) }),
}));

describe("Readings page", () => {
  it("exposes page metadata", () => {
    expect(metadata.title).toBe("Readings | Bryn Kerslake");
    expect(metadata.description).toBe("Books read by Bryn Kerslake.");
  });

  it("renders a card per book with title, author and cover", () => {
    render(<Readings />);

    books.forEach((book) => {
      expect(
        screen.getByRole("heading", { level: 2, name: book.title }),
      ).toBeInTheDocument();
      const cover = screen.getByAltText(`${book.title} cover`);
      expect(cover).toHaveAttribute("src", book.cover);
    });
    expect(screen.getAllByRole("img")).toHaveLength(books.length);
  });

  it("prioritizes only the first row of covers", () => {
    render(<Readings />);

    const priorities = screen
      .getAllByRole("img")
      .map((image) => image.getAttribute("data-priority"));

    expect(priorities.slice(0, 4)).toEqual(["true", "true", "true", "true"]);
    expect(priorities.slice(4).every((value) => value === "false")).toBe(true);
  });
});
