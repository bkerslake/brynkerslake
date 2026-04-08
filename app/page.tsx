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
    href: "https://github.com/brynkerslake",
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
            "I was drawn into tech & engineering by the urge to break things. Naturally, that led me to cybersecurity. I started to learn reverse engineering sophomore year of high school, and would end up founding the capture-the-flag team idekCTF, leading us to a highest ranking of #1 globally. ",
            "As my technical work expanded beyond infosec into software, data, and AI, I became increasingly interested in the real-world contexts these systems operate in. Building consumer products pushed me to think not just about how technology works, but who it empowers, how it scales, and what incentives it creates at individual and societal levels.",
            "Since then, my interests have broadened toward understanding the world through the intersection of technology and geopolitics. As a current junior at Colby College, I study Computer Science, Economics, and Chinese, and I’m especially interested in how technical systems intersect with global decision-making.",
          ]}
        />
      </section>
    </main>
  );
}
