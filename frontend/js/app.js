"use strict";
window.addEventListener("load", initApp);

import { getArtists, updateArtistRequest, createArtist, deleteArtist } from "./rest.js";

let artists;
let selectedArtist;
let favoriteArtists;
let savedFavorites = JSON.parse(localStorage.getItem("favorites"));
let sortedArtists;
let sortValue;

if (savedFavorites) {
  favoriteArtists = savedFavorites;
} else {
  favoriteArtists = [];
}

function initApp() {
  console.log("Frontend loaded");
  document.querySelector("#btn-createArtist").addEventListener("click", createArtistDialog);
  document.querySelector("#select-sort").addEventListener("change", (event) => sortBy(event.target.value));
  document.querySelector("#btn-filterFavorites").addEventListener("click", filterByFavorites);
  document.querySelector("#btn-filterAll").addEventListener("click", refreshArtists);
  refreshArtists();
}

async function refreshArtists() {
  console.log("Updating grid");
  document.querySelector("#artists").innerHTML = "";
  artists = await getArtists();

  for (const artist of artists) {
    listArtist(artist);
  }
}

function sortBy(sortValue) {
  sortedArtists = artists.sort((a, b) => a[sortValue].localeCompare(b[sortValue]));
  document.querySelector("#artists").innerHTML = "";
  for (const sortedArtist of sortedArtists) {
    listArtist(sortedArtist);
  }
}

function filterByFavorites() {
  favoriteArtists = JSON.parse(localStorage.getItem("favorites"));
  console.log(savedFavorites);
  console.log(favoriteArtists);
  console.log(artists);

  artists = artists.filter(artist => favoriteArtists.some(sortedItem => sortedItem.id === artist.id));

  document.querySelector("#artists").innerHTML = "";

  for (const artist of artists) {

    listArtist(artist);
  }
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

  document.querySelector("#artists article:last-child .btn-edit").addEventListener("click", () => editArtistDialog(artist));
  document.querySelector("#artists article:last-child .btn-delete").addEventListener("click", () => deleteArtistDialog(artist.id));
  document.querySelector("#artists article:last-child .btn-favorite").addEventListener("click", () => artistFavorited(artist, favBtn));

  const favBtn = document.querySelector("#artists article:last-child .btn-favorite");
  let favoriteString = JSON.stringify(favoriteArtists);
  if (favoriteString.includes(artist.id)) {
    favBtn.classList.add("favorited");
  }
}

function artistFavorited(artistToFavorite, favBtn) {
  let favoritePosition;

  /// Should probably be ID based to avoid issues after edited object.
  let body = {
    id: artistToFavorite.id,
  };

  console.log(body);

  if (localStorage.getItem("favorites") == null) {
    favoriteArtists.push(body);
    localStorage.setItem("favorites", JSON.stringify(favoriteArtists));
    favBtn.classList.add("favorited");
  } else {
    // Check if the artist ID exists in the favoriteArtists array
    const artistExists = favoriteArtists.some((favoriteArtist) => favoriteArtist.id === artistToFavorite.id);

    let retString = localStorage.getItem("favorites");
    let retArray = JSON.parse(retString);
    favoriteArtists = retArray;
    if (!artistExists) {
      favoriteArtists.push(body);
      localStorage.setItem("favorites", JSON.stringify(favoriteArtists));
      favBtn.classList.add("favorited");
    } else if (artistExists) {
      // console.log("Cannot add because artist is already favorited");
      favBtn.classList.remove("favorited");
      favoritePosition = favoriteArtists.indexOf(artistToFavorite);
      favoriteArtists.splice(favoritePosition, 1);
      localStorage.setItem("favorites", JSON.stringify(favoriteArtists));
    }
  }
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

  const response = updateArtistRequest(name, birthdate, activeSince, genres, labels, website, image, shortDescription)

    if (response.ok) {
      console.log("Artist updated");
      refreshArtists();
      form.reset();
      closeDialog();
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

function deleteArtistDialog(id) {
  const deleteDialog = document.querySelector("#dialog-deleteArtist");
  deleteDialog.showModal();
  console.log(id);

  document.querySelector("#form-deleteArtist").addEventListener("submit", () => deleteArtist(id));
  document.querySelector("#btn-deleteDecline").addEventListener("click", () => closeDialog(deleteDialog));
}
