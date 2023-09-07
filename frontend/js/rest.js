const endpoint = "http://localhost:3000/artists";

async function getArtists() {
    console.log(endpoint)
    const response = await fetch(endpoint);
    const data = await response.json();
    return data;
}

async function updateArtistRequest(name, birthdate, activeSince, genres, labels, website, image, shortDescription, id) {
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
    id,
    };
    const json = JSON.stringify(artistToUpdate);

    const response = await fetch(`${endpoint}/${id}`, 
    {
        method: "PUT",
        body: json,
        headers: {
            "Content-Type": "application/json",
        },
    }
    )
    return response;
};

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

  async function deleteArtist(id) {
    const response = await fetch(`${endpoint}/${id}`, {
      method: "DELETE",
    });
  
    return response;
  }

export {getArtists, updateArtistRequest, createArtist, deleteArtist}