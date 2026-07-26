"use client";

import { useEffect } from "react";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Unhandled page error.", error);
  }, [error]);

  return (
    <main className="page-shell">
      <section className="hero">
        <div className="hero-fit">
          <div className="hero-copy">
            <h1 className="hero-title">Something broke</h1>

            <div className="hero-body">
              <div className="prose">
                <p>
                  This page failed to load
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
  );
}
