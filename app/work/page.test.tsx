import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Work, { metadata } from "./page";

describe("Work page", () => {
  it("exposes page metadata", () => {
    expect(metadata.title).toBe("Work | Bryn Kerslake");
    expect(metadata.description).toBe("Work history for Bryn Kerslake.");
  });

  it("renders a section per work item with a description", () => {
    const { container } = render(<Work />);

    const items = container.querySelectorAll(".work-item");
    expect(items.length).toBeGreaterThan(0);
    items.forEach((item) => {
      expect(item.querySelector(".work-title")?.textContent).toBeTruthy();
      expect(item.querySelector(".work-description")?.textContent).toBeTruthy();
    });
  });

  it("opens linked employers in a new tab safely", () => {
    render(<Work />);

    screen.getAllByRole("link").forEach((link) => {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noreferrer");
      expect(link.getAttribute("href")).toMatch(/^https:\/\//);
    });
  });

  it("renders unlinked entries as plain text", () => {
    render(<Work />);

    expect(
      screen.getByRole("heading", { level: 2, name: "Theia" }).querySelector("a"),
    ).toBeNull();
  });
});
