import http from "node:http";
import { artists } from "./artists.js";
import { promises } from "node:fs";
// import { songs } from "./songs.json";

const app = http.createServer(async (request, response) => {
  ///// GET //////

  if (request.url === "/" && request.method === "GET") {
    //// Sæt statuskode og overskrift for responsen
    response.statusCode = 200;
    response.setHeader("Content-Type", "text/plain");
    /// Send besked som http respons
    response.end("Backend loaded - Working with HTTP Module and routing");
  } else if (request.url === "/artists" && request.method === "GET") {
    //// Sæt statuskode og overskrift for responsen
    response.statusCode = 200;
    response.setHeader("Content-Type", "application/json");
    /// Send besked som http respons
    const json = await fs.readFile(artists);
  }
});

const port = 3000;

app.listen(port, () => {
  console.log(`Serveren kører på https://localhost:${port}`);
});
