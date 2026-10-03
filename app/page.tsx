import { SiteHeader, SocialLinks } from "./components/site-header";

export default function Home() {
  return (
    <main className="page home-page">
      <SiteHeader home />

      <div className="prose">
        <p>
          I&apos;m a student at Colby College studying Computer Science,
          Economics, and Chinese. My primary interests sit at the intersection
          of technology and geopolitics.
        </p>
        <p>
          I&apos;ve spent time working at startups and conducting research on AI
          policy &amp; safety, and studying the semiconductor supply chain in
          Taiwan.
        </p>
        <p>
          Apart from the above, I&apos;m a ski patroller, avid backcountry skier,
          and amateur cyclist.
        </p>
      </div>

      <SocialLinks />
    </main>
  );
}
