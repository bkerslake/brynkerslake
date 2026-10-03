import type { Metadata } from "next";
import { books } from "./books";

export const metadata: Metadata = {
  title: "Readings | Bryn Kerslake",
  description: "Books read by Bryn Kerslake.",
};

export default function Readings() {
  return (
    <main className="page index-page">
      <ul className="text-list reading-list" aria-label="Books read">
        {books.map((book) => (
          <li key={`${book.title}-${book.author}`}>
            <cite>{book.title}</cite>, {book.author}
          </li>
        ))}
      </ul>
    </main>
  );
}
