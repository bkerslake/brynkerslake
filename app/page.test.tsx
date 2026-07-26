import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Home from "./page";

vi.mock("./components/hero-content", () => ({
  HeroContent: ({
    links,
    paragraphs,
  }: {
    links: { label: string; href?: string; copyText?: string }[];
    paragraphs: string[];
  }) => (
    <div data-testid="hero">
      <span data-testid="labels">
        {links.map((link) => link.label).join(",")}
      </span>
      <span data-testid="paragraph-count">{paragraphs.length}</span>
      <span data-testid="copy-links">
        {links
          .filter((link) => link.copyText)
          .map((link) => link.copyText)
          .join(",")}
      </span>
    </div>
  ),
}));

describe("Home page", () => {
  it("passes the profile links and bio paragraphs to the hero", () => {
    render(<Home />);

    expect(screen.getByTestId("labels")).toHaveTextContent(
      "X,LinkedIn,GitHub,Email,Writings",
    );
    expect(screen.getByTestId("paragraph-count")).toHaveTextContent("3");
    expect(screen.getByTestId("copy-links")).toHaveTextContent(
      "brynkerslake@gmail.com",
    );
  });
});
