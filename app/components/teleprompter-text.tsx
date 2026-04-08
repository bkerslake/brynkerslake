"use client";

import { useEffect, useState } from "react";

type TeleprompterTextProps = {
  paragraphs: string[];
};

type ParagraphWord = {
  index: number;
  text: string;
};

type ParagraphRecord = {
  text: string;
  words: ParagraphWord[];
};

function getWordDuration(word: string) {
  const stripped = word.replace(/[^A-Za-z0-9-]/g, "");
  const baseDuration = 155;
  const perCharacter = Math.min(stripped.length, 12) * 24;
  const commaPause = /,/.test(word) ? 195 : 0;
  const clausePause = /[;:]/.test(word) ? 175 : 0;
  const sentencePause = /[.!?]/.test(word) ? 360 : 0;
  const dashPause = /[-]/.test(word) ? 65 : 0;

  return (
    baseDuration +
    perCharacter +
    commaPause +
    clausePause +
    sentencePause +
    dashPause
  );
}

export function TeleprompterText({ paragraphs }: TeleprompterTextProps) {
  const [content] = useState(() => {
    let nextIndex = 0;
    const records: ParagraphRecord[] = paragraphs.map((paragraph) => {
      const words = paragraph.split(/\s+/).map((word) => {
        const result = {
          index: nextIndex,
          text: word,
        };

        nextIndex += 1;
        return result;
      });

      return {
        text: paragraph,
        words,
      };
    });

    return {
      flatWords: records.flatMap((record) => record.words.map((word) => word.text)),
      records,
    };
  });

  const [activeWordIndex, setActiveWordIndex] = useState(-1);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (mediaQuery.matches || content.flatWords.length === 0) {
      return;
    }

    let currentIndex = 0;
    let timeoutId = window.setTimeout(runStep, 520);

    // Word timing is weighted by length and punctuation to mimic natural reading pace.
    function runStep() {
      setActiveWordIndex(currentIndex);
      currentIndex += 1;

      if (currentIndex >= content.flatWords.length) {
        timeoutId = window.setTimeout(() => {
          setActiveWordIndex(-1);
        }, 320);
        return;
      }

      timeoutId = window.setTimeout(
        runStep,
        getWordDuration(content.flatWords[currentIndex - 1]),
      );
    }

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [content]);

  return (
    <div className="prose teleprompter-prose">
      {content.records.map((paragraph) => (
        <p key={paragraph.text}>
          <span className="sr-only">{paragraph.text}</span>
          <span aria-hidden>
            {paragraph.words.map((word, localIndex) => (
              <span key={`${word.text}-${word.index}`} className="teleprompter-token">
                <span
                  className={
                    word.index === activeWordIndex
                      ? "teleprompter-word is-active"
                      : "teleprompter-word"
                  }
                >
                  {word.text}
                </span>
                {localIndex < paragraph.words.length - 1 ? " " : ""}
              </span>
            ))}
          </span>
        </p>
      ))}
    </div>
  );
}
