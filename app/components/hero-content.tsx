import { TeleprompterText } from "./teleprompter-text";

type LinkRecord = {
  href: string;
  label: string;
};

type HeroContentProps = {
  links: LinkRecord[];
  paragraphs: string[];
};

export function HeroContent({ links, paragraphs }: HeroContentProps) {
  return (
    <div className="hero-fit">
      <div className="hero-copy">
        <h1 className="hero-title">Bryn Kerslake</h1>

        <div className="hero-body">
          <TeleprompterText paragraphs={paragraphs} />

          <div className="link-row">
            {links.map((link) => (
              <a
                key={link.label}
                className="text-link"
                href={link.href}
                target="_blank"
                rel="noreferrer"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
