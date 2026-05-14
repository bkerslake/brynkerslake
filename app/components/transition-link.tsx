"use client";

import { useRouter } from "next/navigation";
import type { ComponentProps, MouseEvent } from "react";
import { useCallback, useEffect } from "react";
import { usePageTransition } from "./page-transition";

type TransitionLinkProps = Omit<ComponentProps<"a">, "href"> & {
  href: string;
};

export function TransitionLink({
  href,
  onClick,
  onFocus,
  onPointerEnter,
  ...props
}: TransitionLinkProps) {
  const { navigate } = usePageTransition();
  const router = useRouter();

  const prefetch = useCallback(() => {
    const url = new URL(href, window.location.href);

    if (url.origin === window.location.origin) {
      router.prefetch(`${url.pathname}${url.search}${url.hash}`);
    }
  }, [href, router]);

  useEffect(() => {
    prefetch();
  }, [prefetch]);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);

    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.altKey ||
      event.ctrlKey ||
      event.shiftKey
    ) {
      return;
    }

    const target = event.currentTarget.target;

    if (target && target !== "_self") {
      return;
    }

    event.preventDefault();
    navigate(event.currentTarget.href);
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      onFocus={(event) => {
        onFocus?.(event);
        prefetch();
      }}
      onPointerEnter={(event) => {
        onPointerEnter?.(event);
        prefetch();
      }}
      {...props}
    />
  );
}
