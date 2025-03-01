//Ceci est une fonction fetch pour l'API (works)
async function getWorks() {
    const url = "http://localhost:5678/api/works";
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
  
      const json = await response.json();
      for (let i = 0; i < json.length; i++) {
        setdiv(json[i]);
      }
    } catch (error) {
      console.error(error.message);
    }
}

getWorks();


//Envoi des images vers la div class gallery
function setdiv(data) {
    const div = document.createElement("div");
    div.innerHTML = `<img src=${data.imageUrl} alt=${data.title}>
                        <figcaption>${data.title}</figcaption>`;

    document.querySelector(".gallery").append(div);
}


//Ceci est une fonction fetch pour l'API (categories = Filtres)
async function getCategories() {
    const url = "http://localhost:5678/api/categories";
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
  
      const json = await response.json();
      console.log(json);
      for (let i = 0; i < json.length; i++) {
        setFilter(json[i]);
      } 
    } catch (error) {
      console.error(error.message);
    }
}
getCategories();

//Création de bouton de filtres dans la div-container (pas encore interactif)
function setFilter(data) {
    const div = document.createElement("div");
    div.innerHTML = `${data.name}`;
    document.querySelector(".div-container").append(div);
} 