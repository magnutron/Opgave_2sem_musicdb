import http from "node:http";
import { artists } from "./artists.js";
import { songs } from "./songs.js";

const app = http.createServer((request, response) => {
  if (request.url === "/" && request.method === "GET") {
    //// Sæt statuskode og overskrift for responsen
    response.statusCode = 200;
    response.setHeader("Content-Type", "text/plain");
    /// Send besked som http respons
    response.end("Working with HTTP Module and routing");
  } else if (request.url === "/artists" && request.method === "GET") {
    //// Sæt statuskode og overskrift for responsen
    response.statusCode = 200;
    response.setHeader("Content-Type", "application/json");
    /// Send besked som http respons
    response.end(JSON.stringify(artists));
  } else if (request.url === "/songs" && request.method === "GET") {
    //// Sæt statuskode og overskrift for responsen
    response.statusCode = 200;
    response.setHeader("Content-Type", "application/json");
    /// Send besked som http respons
    response.end(JSON.stringify(songs));
  }
});

const port = 3000;

app.listen(port, () => {
  console.log(`Serveren kører på https://localhost:${port}`);
});
