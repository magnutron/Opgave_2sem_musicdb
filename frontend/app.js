"use strict";
window.addEventListener("load", initApp);
///////////////////////////
/// Set JSON URL here ////
/////////////////////////
const endpoint = "http://localhost:3000/artists";
let artists;
let selectedArtist;
let favoriteArtists = [];
let favoritePosition;

////////////////////////
/// Initialize App  ///
//////////////////////

document.querySelector("#btn-createArtist").addEventListener("click", createArtistDialog);

function initApp() {
  console.log("Frontend loaded");
  refreshArtists();
}

async function refreshArtists() {
  console.log("Updating grid");
  document.querySelector("#artists").innerHTML = "";
  artists = await getArtists(endpoint);

  for (const artist of artists) {
    listArtist(artist);
  }
}

async function getArtists(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

function listArtist(artist) {
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
        <div class="grid-buttons">
        <button class="btn-delete" type=button>🗑️</button>
        <button class="btn-favorite" type=button>⭐</button>
        <button class="btn-edit" type=button>✏️</button>
        </div>
        </article>
        `
  );

  if (favoriteArtists.find((favoriteArtist) => favoriteArtist == artist)) {
    //// Apply button class if artist exists in localStorage.. But what about copies? Perhaps if statement for artistFavorited
    console.log(favoriteArtist);
  }

  document.querySelector("#artists article:last-child .btn-edit").addEventListener("click", () => editArtistDialog(artist));
  document.querySelector("#artists article:last-child .btn-delete").addEventListener("click", () => deleteArtistDialog(artist.id));
  document.querySelector("#artists article:last-child .btn-favorite").addEventListener("click", () => artistFavorited(artist));
}

function artistFavorited(artistToFavorite) {
  /// Target object defined as oldData
  let oldData = artists.find((artist) => artist.id == artistToFavorite.id);
  console.log(oldData);

  /// Find target object position
  let favoritePosition = artists.indexOf(oldData);
  /// Replace ID of body to match requested ID

  favoriteArtists.push(artists[favoritePosition]);
  localStorage.setItem("favoriteArtists", favoriteArtists);
  console.log("Local storage:", localStorage.favoriteArtists);
}

function editArtistDialog(artist) {
  const editDialog = document.querySelector("#dialog-editArtist");
  const updateForm = document.querySelector("#form-editArtist");

  updateForm.shortDescription.value = artist.shortDescription;
  updateForm.name.value = artist.name;
  updateForm.image.value = artist.image;
  updateForm.labels.value = artist.labels;
  updateForm.genres.value = artist.genres;
  updateForm.activeSince.value = artist.activeSince;
  updateForm.birthdate.value = artist.birthdate;
  updateForm.website.value = artist.website;
  selectedArtist = artist;
  editDialog.showModal();

  document.querySelector("#form-editArtist").addEventListener("submit", updateArtistClicked);
  document.querySelector("#btn-editCancel").addEventListener("click", () => closeDialog(editDialog));
}

function closeDialog(dialog) {
  // Lukker dialog, fjerner formørkelse
  dialog.close();
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

  updateArtistRequest(name, birthdate, activeSince, genres, labels, website, image, shortDescription);

  async function updateArtistRequest(name, birthdate, activeSince, genres, labels, website, image, shortDescription) {
    // Opdaterer objekt med opdateret artistinfo
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

    const response = await fetch(`${endpoint}/${selectedArtist.id}`, {
      method: "PUT",
      body: json,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Tjekker hvis response er okay, hvis response er succesfuld ->
    if (response.ok) {
      // Opdater MoviesGrid til at displaye all film og den nye film
      console.log("Artist updated");
      refreshArtists();
      form.reset();
      closeDialog();
    }
  }
}

function createArtistDialog() {
  const createDialog = document.querySelector("#dialog-createArtist");

  createDialog.showModal();

  document.querySelector("#form-createArtist").addEventListener("submit", createArtistClicked);
  document.querySelector("#btn-createArtistDecline").addEventListener("click", () => closeDialog(createDialog));
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

  if (response.ok) {
    console.log("Artist added");
  }
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
}

function deleteArtistDialog(id) {
  const deleteDialog = document.querySelector("#dialog-deleteArtist");
  deleteDialog.showModal();
  console.log(id);

  document.querySelector("#form-deleteArtist").addEventListener("submit", () => deleteArtist(id));
  document.querySelector("#btn-deleteDecline").addEventListener("click", () => closeDialog(deleteDialog));
}

async function deleteArtist(id) {
  const response = await fetch(`${endpoint}/${id}`, {
    method: "DELETE",
  });

  return response;
}
