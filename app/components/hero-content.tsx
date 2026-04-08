import { InteractiveSeal } from "./interactive-seal";
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

          <div className="seal-cluster" aria-hidden="true">
            <InteractiveSeal
              alt="Stylized U.S. State Department eagle"
              className="seal-chip-eagle"
              height={52}
              src="/marks/state-eagle.svg"
              width={52}
            />
            <InteractiveSeal
              alt="Stylized Welsh dragon"
              className="seal-chip-dragon"
              height={64}
              src="/marks/welsh-dragon.svg"
              width={64}
            />
          </div>

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
