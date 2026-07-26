"use client";

import { useEffect } from "react";
import "./globals.css";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("Unhandled application error.", error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <main className="page-shell">
          <section className="hero">
            <div className="hero-fit">
              <div className="hero-copy">
                <h1 className="hero-title">Something broke</h1>

                <div className="hero-body">
                  <div className="prose">
                    <p>
                      The site failed to load
                      {error.digest ? ` (reference ${error.digest})` : ""}.
                    </p>
                  </div>

                  <div className="link-row">
                    <button className="text-link" onClick={reset} type="button">
                      Try again
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}
