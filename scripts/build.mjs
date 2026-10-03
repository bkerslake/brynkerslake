import { copyFile, mkdir, rm } from "node:fs/promises";

const source = new URL("../public/", import.meta.url);
const output = new URL("../dist/", import.meta.url);
const files = ["index.html", "work.html", "readings.html", "styles.css", "icon.svg"];

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await Promise.all(
  files.map((file) => copyFile(new URL(file, source), new URL(file, output))),
);

console.log("Built static HTML site in dist/.");
