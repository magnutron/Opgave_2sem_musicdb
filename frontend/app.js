"use strict";
window.addEventListener("load", initApp);
///////////////////////////
/// Set JSON URL here ////
/////////////////////////
const dburl = "http://localhost:3000";

////////////////////////
/// Initialize App  ///
//////////////////////
async function initApp() {
  console.log("Frontend loaded");
  const artists = await getArtist(dburl);

  /////===--- THIS ALSO WORKS, BUT RACE SAYS FOROF IS BETTER FOR THIS ¯\_(ツ)
  // artists.forEach(addartist);

  /////===--- THIS ALSO WORKS, BUT IT TOO COMPLEX COMPARED TO NEXT ONE?
  // for (let index = 0; index < artists.length; index++) {
  //   const artist = artists[index];
  //   addartist(artist);
  // }

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
  const list = document.querySelector("#artist");
  let typeColor = artist.type.split(",")[0].trim().toLowerCase();

  if (artist.type.includes("/")) {
    typeColor = artist.type.split("/")[0].trim().toLowerCase();
    console.log(typeColor);
  }

  list.insertAdjacentHTML(
    "beforeend",
    /*html*/ `
        <article class="grid-item">
        <div class="${typeColor}">
        <img src="${artist.image}">
        <h2>${artist.name}</h2>
        <p>${artist.type}</p>
        </div>
        </article>
        `
  );

  console.log(typeColor);

  document.querySelector("#artist article:last-child").addEventListener("click", artistClicked);

  ///////////////////////////////////////////////////////////////////////////////////
  /// Modify and show textcontent for dialog modal when clicked, based on object ///
  /////////////////////////////////////////////////////////////////////////////////
  function artistClicked() {
    console.log(artist);
    document.querySelector("#dialog-name").textContent = `${artist.name}`;
    document.querySelector("#dialog-img").src = artist.image;
    document.querySelector("#dialog-description").textContent = `${artist.description}`;
    document.querySelector("#dialog-ability").textContent = `Abilities: ${artist.ability}`;
    document.querySelector("#dialog-type").textContent = `Type: ${artist.type}`;
    document.querySelector("#dialog-subtype").textContent = `Sub type: ${artist.subtype}`;
    document.querySelector("#dialog-weaknesses").textContent = `Weaknesses: ${artist.weaknesses}`;
    document.querySelector("#dialog-gender").textContent = `Gender: ${artist.gender}`;
    document.querySelector("#dialog-weight").textContent = `Weight: ${artist.weight}`;
    document.querySelector("#dialog-height").textContent = `Height: ${artist.height}`;
    document.querySelector("#dialog-dexindex").textContent = `Index Number: ${artist.dexindex}`;
    document.querySelector("#dialog-generation").textContent = `Generation: ${artist.generation}`;
    document.querySelector("#dialog-statsHP").textContent = `HP: ${artist.statsHP}`;
    document.querySelector("#dialog-statsAttack").textContent = `Attack: ${artist.statsAttack}`;
    document.querySelector("#dialog-statsDefence").textContent = `Defence: ${artist.statsDefence}`;
    document.querySelector("#dialog-statsSpecialAttack").textContent = `Special Attack: ${artist.statsSpecialAttack}`;
    document.querySelector("#dialog-statsSpecialDefence").textContent = `Special Defence: ${artist.statsSpecialDefence}`;
    document.querySelector("#dialog-statsSpeed").textContent = `Speed: ${artist.statsspeed}`;
    document.querySelector("#dialog-artist").showModal();
  }
}
