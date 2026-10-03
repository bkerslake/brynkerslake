import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work | Bryn Kerslake",
  description: "Work history for Bryn Kerslake.",
};

const workItems = [
  {
    title: "Berkman-Klein Center at Harvard University",
    description:
      "Research on agent environments and governance",
  },
  {
    title: "Suno",
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
    description:
      "Finalist, meeting people far smarter than I",
  },
  {
    title: "Delphi",
    description:
      "Experiments on scaling human connection with digital clones",
  },
  {
    title: "National Ski Patrol",
    description:
      "Field experience in emergency response and backcountry safety",
  },
];

export default function Work() {
  return (
    <main className="page index-page">
      <ul className="text-list" aria-label="Work history">
        {workItems.map((item) => (
          <li key={item.title}>
            {item.title}: {item.description}
          </li>
        ))}
      </ul>
    </main>
  );
}
