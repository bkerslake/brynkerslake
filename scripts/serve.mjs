import { readFile } from "node:fs/promises";
import { createServer } from "node:http";

const args = process.argv.slice(2);
const portIndex = args.indexOf("--port");
const port = Number(portIndex === -1 ? process.env.PORT ?? 3000 : args[portIndex + 1]);
const root = new URL(args.includes("--production") ? "../dist/" : "../public/", import.meta.url);
const routes = new Map([
  ["/", ["index.html", "text/html; charset=utf-8"]],
  ["/work", ["work.html", "text/html; charset=utf-8"]],
  ["/readings", ["readings.html", "text/html; charset=utf-8"]],
  ["/styles.css", ["styles.css", "text/css; charset=utf-8"]],
  ["/icon.svg", ["icon.svg", "image/svg+xml"]],
]);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("Choose a port between 1 and 65535.");
}

const server = createServer(async (request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" });
    response.end();
    return;
  }

  const url = new URL(request.url, "http://localhost");
  const cleanPath = url.pathname.replace(/\.html$/, "").replace(/\/$/, "") || "/";
  const canonicalPath = cleanPath === "/index" ? "/" : cleanPath;
  const route = routes.get(canonicalPath);

  if (!route) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end(request.method === "HEAD" ? undefined : "Not found");
    return;
  }

  if (url.pathname !== canonicalPath) {
    response.writeHead(308, { Location: canonicalPath + url.search });
    response.end();
    return;
  }

  try {
    const content = await readFile(new URL(route[0], root));
    response.writeHead(200, { "Content-Type": route[1], "Cache-Control": "no-store" });
    response.end(request.method === "HEAD" ? undefined : content);
  } catch (error) {
    console.error(error.message);
    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end(request.method === "HEAD" ? undefined : "Unable to read site file. Run npm run build before npm start.");
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Preview: http://localhost:${port}`);
});
