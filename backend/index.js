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
  response.json(artists);
});

app.get("/artists/:id", async (request, response) => {
  const data = await fs.readFile("artists.json");
  const artists = JSON.parse(data);
  response.send(artists.find((artist) => artist.id == request.params.id));
});

app.post("/artists", async (request, response) => {
  const data = await fs.readFile("artists.json");
  const artists = JSON.parse(data);
  const newArtist = request.body;
  newArtist.id = uuidv4();
  console.log(newArtist);
  artists.push(newArtist);
  fs.writeFile("artists.json", JSON.stringify(artists));
  response.json(artists);
});

app.put("/artists/:id", async (request, response) => {
  console.log(request.params.id);
  const data = await fs.readFile("artists.json");
  const artists = JSON.parse(data);
  const id = request.params.id;
  const newData = request.body;

  /// Target object defined as oldData
  let oldData = artists.find((artist) => artist.id == request.params.id);

  /// Find target object position
  let oldDataPosition = artists.indexOf(oldData);
  /// Replace ID of body to match requested ID
  newData.id = id;

  /// Slice n dice
  artists.splice(oldDataPosition, 1, newData);

  fs.writeFile("artists.json", JSON.stringify(artists));
  /// Display new array
  response.json(artists);
});

app.delete("/artists/:id", async (request, response) => {
  console.log(request.params.id);
  const data = await fs.readFile("artists.json");
  const artists = JSON.parse(data);
  const id = request.params.id;
  const newData = request.body;

  /// Target object defined as oldData
  let oldData = artists.find((artist) => artist.id == request.params.id);
  console.log(oldData);

  /// Find target object position
  let oldDataPosition = artists.indexOf(oldData);
  /// Replace ID of body to match requested ID
  newData.id = id;

  /// Slice n dice
  artists.splice(oldDataPosition, 1);
  console.log(artists);

  fs.writeFile("artists.json", JSON.stringify(artists));
  /// Display new array
  response.json(artists);
});

app.listen(port, () => {
  console.log(`Serveren kører på https://localhost:${port}`);
});
