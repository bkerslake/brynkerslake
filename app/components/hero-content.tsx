"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

type ExternalLink = {
  href: string;
  label: string;
};

type CopyLink = {
  copyText: string;
  label: string;
};

type LinkRecord = CopyLink | ExternalLink;

type CopyState = {
  label: string;
  status: "copied" | "failed";
};

type HeroContentProps = {
  links: LinkRecord[];
  paragraphs: string[];
};

async function copyToClipboard(value: string) {
  if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(value);
      return;
    } catch (error) {
      // Fall back for browsers that expose clipboard but deny writeText.
      console.warn("Clipboard write failed, falling back to execCommand.", error);
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);

  try {
    textarea.select();

    if (!document.execCommand("copy")) {
      throw new Error("The browser rejected the copy command.");
    }
  } finally {
    document.body.removeChild(textarea);
  }
}

export function HeroContent({ links, paragraphs }: HeroContentProps) {
  const [copyState, setCopyState] = useState<CopyState | null>(null);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    return () => {
      if (resetTimer.current) {
        clearTimeout(resetTimer.current);
      }
    };
  }, []);

  const handleCopy = async (link: CopyLink) => {
    let status: CopyState["status"] = "copied";

    try {
      await copyToClipboard(link.copyText);
    } catch (error) {
      console.error(`Unable to copy ${link.label} to the clipboard.`, error);
      status = "failed";
    }

    setCopyState({ label: link.label, status });

    if (resetTimer.current) {
      clearTimeout(resetTimer.current);
    }

    resetTimer.current = setTimeout(() => {
      setCopyState(null);
    }, 1800);
  };

  const statusFor = (label: string) =>
    copyState?.label === label ? copyState.status : null;

  return (
    <div className="hero-fit">
      <div className="hero-copy">
        <h1 className="hero-title">Bryn Kerslake</h1>

        <div className="hero-body">
          <div className="prose">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="link-row">
            {links.map((link) =>
              "copyText" in link ? (
                <div className="copy-link-wrap" key={link.label}>
                  <button
                    aria-label={`Copy ${link.copyText} to clipboard`}
                    className="text-link copy-link"
                    onClick={() => {
                      void handleCopy(link);
                    }}
                    type="button"
                  >
                    <span className="copy-link-text-frame" aria-live="polite">
                      <span className="copy-link-text-sizer">{link.label}</span>
                      <AnimatePresence initial={false} mode="popLayout">
                        <motion.span
                          className="copy-link-text"
                          key={`${link.label}-${statusFor(link.label) ?? "idle"}`}
                          initial={
                            shouldReduceMotion
                              ? { opacity: 0 }
                              : {
                                  opacity: 0,
                                  filter: "blur(6px)",
                                  y: 9,
                                }
                          }
                          animate={
                            shouldReduceMotion
                              ? { opacity: 1 }
                              : {
                                  opacity: 1,
                                  filter: "blur(0px)",
                                  y: 0,
                                }
                          }
                          exit={
                            shouldReduceMotion
                              ? { opacity: 0 }
                              : {
                                  opacity: 0,
                                  filter: "blur(6px)",
                                  y: -9,
                                }
                          }
                          transition={{
                            duration: 0.18,
                            ease: "easeOut",
                          }}
                        >
                          {statusFor(link.label) === "copied"
                            ? "Copied!"
                            : statusFor(link.label) === "failed"
                              ? "Copy failed"
                              : link.label}
                        </motion.span>
                      </AnimatePresence>
                    </span>
                  </button>
                </div>
              ) : (
                <a
                  key={link.label}
                  className="text-link"
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {link.label}
                </a>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
