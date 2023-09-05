"use strict";
window.addEventListener("load", initApp);
///////////////////////////
/// Set JSON URL here ////
/////////////////////////
const endpoint = "http://localhost:3000/artists";
let artists;

////////////////////////
/// Initialize App  ///
//////////////////////

document.querySelector("#createArtist").addEventListener("click", createArtistDialog);

async function initApp() {
  console.log("Frontend loaded");
  console.log(endpoint);
  artists = await getArtist(endpoint);

  for (const artist of artists) {
    addArtist(artist);
  }
}

//////////////////////////////
/// Fetch and parse JSON  ///
////////////////////////////
async function getArtist(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

////////////////////////////////////////////////
/// Create HTML grid items from parsed data ///
//////////////////////////////////////////////
function addArtist(artist) {
  const list = document.querySelector("#artists");

  list.insertAdjacentHTML(
    "beforeend",
    /*html*/ `
        <article class="grid-item">
        <img src="${artist.image}">
        <h2>${artist.name}</h2>
        <p>${artist.genres}</p>
        <p>Birth date: ${artist.birthdate}</p>
        <p>Active since: ${artist.activeSince}</p>
        <p>Labels: ${artist.labels}</p>
        <p>${artist.website}</p>
        <p>${artist.shortDescription}</p>
        </div>
        </article>
        `
  );

  document.querySelector("#artists article:last-child").addEventListener("click", artistClicked);

  ///////////////////////////////////////////////////////////////////////////////////
  /// Modify and show textcontent for dialog modal when clicked, based on object ///
  /////////////////////////////////////////////////////////////////////////////////
  function artistClicked(resultObject) {
    const updateForm = document.querySelector("#editArtistForm");

    updateForm.shortDescription.value = artist.shortDescription;
    updateForm.name.value = artist.name;
    updateForm.image.value = artist.image;
    updateForm.labels.value = artist.labels;
    updateForm.genres.value = artist.genres;
    updateForm.activeSince.value = artist.activeSince;
    updateForm.birthdate.value = artist.birthdate;
    updateForm.website.value = artist.website;
    document.querySelector("#dialog-artist").showModal();

    document.querySelector("#editArtistForm").addEventListener("submit", updateArtistClicked);
    document.querySelector("#cancelEdit-btn").addEventListener("click", closeDialog);
  }

  function closeDialog() {
    // Lukker dialog, fjerner formørkelse
    document.querySelector("#dialog-artist").close();
  }
}

async function updateArtistClicked(event) {
  event.preventDefault();

  const form = event.target;
  const shortDescription = form.shortDescription.value;
  const name = form.name.value;
  const image = form.image.value;
  const birthdate = form.birthdate.value;
  const activeSince = form.activeSince.value;
  const labels = form.labels.value;
  const website = form.website.value;
  const genres = form.genres.value;

  const response = await updateArtistRequest(name, birthdate, activeSince, genres, labels, website, image, shortDescription);

  // Tjekker hvis response er okay, hvis response er succesfuld ->
  if (response.ok) {
    // Opdater MoviesGrid til at displaye all film og den nye film
    updateArtistsPage();
    form.reset();
    closeDialog();
  }
}

async function updateArtistRequest(name, birthdate, activeSince, genres, labels, website, image, shortDescription) {
  // Opdaterer objekt med opdateret filminformation
  const artistToUpdate = {
    name,
    birthdate,
    activeSince,
    genres,
    labels,
    website,
    image,
    shortDescription,
  };
  const json = JSON.stringify(artistToUpdate);

  const id = artist.id;

  const response = await fetch(`${endpoint}/${id}`, {
    method: "PUT",
    body: json,
  });

  return response;
}

function createArtistDialog() {
  const updateForm = document.querySelector("#createArtistForm");

  document.querySelector("#dialog-createArtist").showModal();

  document.querySelector("#createArtistForm").addEventListener("submit", createArtistClicked);
  document.querySelector("#cancelEdit-btn").addEventListener("click", closeDialog);
}

async function createArtistClicked(event) {
  event.preventDefault();
  const form = event.target;
  const name = form.name.value;
  const birthdate = form.birthdate.value;
  const activeSince = form.activeSince.value;
  const genres = form.genres.value;
  const labels = form.labels.value;
  const website = form.website.value;
  const image = form.image.value;
  const shortDescription = form.shortDescription.value;

  const newArtist = {
    name,
    birthdate,
    activeSince,
    genres,
    labels,
    website,
    image,
    shortDescription,
  };

  const response = await createArtist(newArtist);
}

async function createArtist(newArtist) {
  const json = JSON.stringify(newArtist);

  const response = await fetch(`${endpoint}`, {
    method: "POST",
    body: json,
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    console.log("Artist added");
  }
}
