import { HeroContent } from "./components/hero-content";

const links = [
  {
    label: "X",
    href: "https://x.com/brynkerslake",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/brynkerslake",
  },
  {
    label: "GitHub",
    href: "https://github.com/bkerslake",
  },
  {
    label: "Email",
    copyText: "brynkerslake@gmail.com",
  },
  {
    label: "Writings",
    href: "https://brynkerslake.substack.com",
  },
];

export default function Home() {
  return (
    <main className="page-shell">
      <section className="hero">
        <HeroContent
          links={links}
          paragraphs={[
            "I'm a student at Colby College studying Computer Science, Economics, and Chinese. My primary interests sit at the intersection of technology and geopolitics.",
            "I've spent time working at startups, conducting research on AI policy & safety, and honing my Chinese language skills in Taiwan.",
            "Apart from the above, I'm a ski patroller, avid backcountry skier, and amateur cyclist.",
          ]}
        />
      </section>
    </main>
  );
}
