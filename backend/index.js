import express from "express";
import { promises } from "node:fs";
import fs from "fs/promises";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";

const port = 3000;

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (request, response) => {
  response.end("Backend loaded - Working with HTTP Module and routing");
});

app.get("/artists", async (request, response) => {
  const data = await fs.readFile("artists.json");
  const artists = JSON.parse(data);
  console.log(artists);
  response.json(artists);
});

app.get("/artists/:id", async (request, response) => {
  const data = await fs.readFile("artists.json");
  const artists = JSON.parse(data);
  console.log(request.params.id);
  response.send(artists.find((artist) => artist.id == request.params.id));
});

app.post("/artists", async (request, response) => {
  const data = await fs.readFile("artists.json");
  const artists = JSON.parse(data);
  const newArtist = request.body;
  newArtist.id = uuidv4();
  artists.push(newArtist);
  fs.writeFile("artists.json", JSON.stringify(artists));
  response.json(artists);
});

app.listen(port, () => {
  console.log(`Serveren kører på https://localhost:${port}`);
});
