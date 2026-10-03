type SiteHeaderProps = {
  home?: boolean;
};

const socialLinks = [
  { label: "Email", href: "mailto:brynkerslake@gmail.com" },
  { label: "GitHub", href: "https://github.com/bkerslake" },
  { label: "X", href: "https://x.com/brynkerslake" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/brynkerslake" },
  { label: "Writing", href: "https://brynkerslake.substack.com" },
];

export function SiteHeader({ home = false }: SiteHeaderProps) {
  return (
    <header className="site-header">
      {home ? (
        <h1 className="site-name">Bryn Kerslake</h1>
      ) : (
        <p className="site-name">
          <a href="/">Bryn Kerslake</a>
        </p>
      )}

      <nav className="site-nav" aria-label="Primary navigation">
        <a href="/work">Work</a>
        <a href="/readings">Readings</a>
      </nav>
    </header>
  );
}

export function SocialLinks() {
  return (
    <nav className="site-nav social-nav" aria-label="Contact and social links">
      {socialLinks.map((link) => (
        <a href={link.href} key={link.label}>
          {link.label}
        </a>
      ))}
    </nav>
  );
}
