import type { ComponentProps } from "react";

type ExternalLinkProps = ComponentProps<"a"> & {
  href: string;
};

export function ExternalLink(props: ExternalLinkProps) {
  return <a target="_blank" rel="noreferrer" {...props} />;
}
