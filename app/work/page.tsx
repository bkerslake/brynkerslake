import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work | Bryn Kerslake",
  description: "Work history for Bryn Kerslake.",
};

type WorkItem = {
  title: string;
  description: string;
  href?: string;
};

const workItems: WorkItem[] = [
  {
    title: "Berkman-Klein Center at Harvard University",
    href: "https://cyber.harvard.edu/",
    description:
      "Research on agent environments and governance",
  },
  {
    title: "Suno",
    href: "https://suno.com/",
    description:
      "Building the world's most musical transformer models",
  },
  { 
  title: "Theia",
  description:
    "Research on agent simulations for geopolitical crises",
  },
  {
    title: "Neo Scholars",
    href: "https://neo.com/scholars",
    description:
      "Finalist, meeting people far smarter than I",
  },
  {
    title: "Delphi",
    href: "https://www.delphi.ai/",
    description:
      "Experimenting with scaling human connection with digital clones",
  },
  {
    title: "National Ski Patrol",
    href: "https://nsp.org/",
    description:
      "Field experience in emergency response and backcountry safety",
  },
];

export default function Work() {
  return (
    <main className="work-shell">
      <h1 className="sr-only">Work</h1>

      <div className="work-list" aria-label="Work history">
        {workItems.map((item) => (
          <section className="work-item" key={item.title}>
            <h2 className="work-title">
              {item.href ? (
                <a
                  className="work-title-link"
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {item.title}
                </a>
              ) : (
                item.title
              )}
            </h2>
            <p className="work-description">{item.description}</p>
          </section>
        ))}
      </div>
    </main>
  );
}
