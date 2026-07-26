import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { books, readingCoverPaths } from "./books";

describe("books", () => {
  it("exposes non-empty title, author and cover for every entry", () => {
    expect(books.length).toBeGreaterThan(0);

    for (const book of books) {
      expect(book.title.trim()).not.toBe("");
      expect(book.author.trim()).not.toBe("");
      expect(book.cover).toMatch(/^\/books\/.+\.(jpg|jpeg|png|webp)$/);
    }
  });

  it("has no duplicate title/author pairs used as React keys", () => {
    const keys = books.map((book) => `${book.title}-${book.author}`);

    expect(new Set(keys).size).toBe(books.length);
  });

  it("points every cover at a file shipped in public/", () => {
    const missing = books
      .map((book) => book.cover)
      .filter((cover) => !existsSync(join(process.cwd(), "public", cover)));

    expect(missing).toEqual([]);
  });
});

describe("readingCoverPaths", () => {
  it("mirrors the cover of every book in order", () => {
    expect(readingCoverPaths).toEqual(books.map((book) => book.cover));
  });
});
