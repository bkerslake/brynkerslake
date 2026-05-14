import type { Metadata } from "next";
import Image from "next/image";
import { Tilt } from "../components/tilt";
import { books } from "./books";

export const metadata: Metadata = {
  title: "Readings | Bryn Kerslake",
  description: "Books read by Bryn Kerslake.",
};

export default function Readings() {
  return (
    <main className="readings-shell">
      <h1 className="sr-only">Readings</h1>

      <div className="book-grid">
        {books.map((book, index) => (
          <Tilt className="book-card" key={`${book.title}-${book.author}`}>
            <article>
              <div className="book-cover-wrap">
                <Image
                  className="book-cover"
                  src={book.cover}
                  alt={`${book.title} cover`}
                  fill
                  priority={index < 4}
                  sizes="(max-width: 640px) calc((100vw - 3.45rem) / 4), (max-width: 920px) calc((100vw - 5.25rem) / 4), 156px"
                  unoptimized
                />
              </div>
              <h2 className="book-title">{book.title}</h2>
              <p className="book-author">{book.author}</p>
            </article>
          </Tilt>
        ))}
      </div>
    </main>
  );
}
