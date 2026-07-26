"use client";

import { useState } from "react";
import { useTimeout } from "../lib/use-timeout";
import { BlurSwapText } from "./blur-swap-text";
import { ExternalLink } from "./external-link";

type ExternalLinkRecord = {
  href: string;
  label: string;
};

type CopyLink = {
  copyText: string;
  label: string;
};

type LinkRecord = CopyLink | ExternalLinkRecord;

type HeroContentProps = {
  links: LinkRecord[];
  paragraphs: string[];
};

const COPIED_RESET_MS = 1800;

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
  const resetTimer = useTimeout();

  const handleCopy = async (link: CopyLink) => {
    await copyToClipboard(link.copyText);
    setCopiedLabel(link.label);

    resetTimer.start(() => {
      setCopiedLabel(null);
    }, COPIED_RESET_MS);
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
                    <BlurSwapText
                      aria-live="polite"
                      classPrefix="copy-link"
                      sizerText={link.label}
                      swapKey={
                        copiedLabel === link.label
                          ? `${link.label}-copied`
                          : link.label
                      }
                    >
                      {copiedLabel === link.label ? "Copied!" : link.label}
                    </BlurSwapText>
                  </button>
                </div>
              ) : (
                <ExternalLink
                  key={link.label}
                  className="text-link"
                  href={link.href}
                >
                  {link.label}
                </ExternalLink>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
