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

type HeroContentProps = {
  links: LinkRecord[];
  paragraphs: string[];
};

async function copyToClipboard(value: string) {
  if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(value);
      return;
    } catch {
      // Fall back for browsers that expose clipboard but deny writeText.
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

export function HeroContent({ links, paragraphs }: HeroContentProps) {
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);
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
    await copyToClipboard(link.copyText);
    setCopiedLabel(link.label);

    if (resetTimer.current) {
      clearTimeout(resetTimer.current);
    }

    resetTimer.current = setTimeout(() => {
      setCopiedLabel(null);
    }, 1800);
  };

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
                    onClick={() => handleCopy(link)}
                    type="button"
                  >
                    <span className="copy-link-text-frame" aria-live="polite">
                      <span className="copy-link-text-sizer">{link.label}</span>
                      <AnimatePresence initial={false} mode="popLayout">
                        <motion.span
                          className="copy-link-text"
                          key={
                            copiedLabel === link.label
                              ? `${link.label}-copied`
                              : link.label
                          }
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
                          {copiedLabel === link.label ? "Copied!" : link.label}
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
