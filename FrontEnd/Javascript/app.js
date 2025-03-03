//Ceci est une fonction fetch pour l'API (works)
async function getWorks(filter) {
    document.querySelector(".gallery").innerHTML = "";
    const url = "http://localhost:5678/api/works";
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
  
    const json = await response.json();
      if(filter) {
        const filtered = json.filter((data) => data.categoryId === filter);
        for (let i = 0; i < filtered.length; i++) {
        setFigure(filtered[i]);
      }
    } else {
        for (let i = 0; i < json.length; i++) {
        setFigure(json[i]);
      }
    }
    } catch (error) {
      console.error(error.message);
    }
}
getWorks();

//Envoi des images vers la div class gallery
function setFigure(data) {
    const figure = document.createElement("figure");
    figure.innerHTML = `<img src=${data.imageUrl} alt=${data.title}>
                        <figcaption>${data.title}</figcaption>`;

    document.querySelector(".gallery").append(figure);
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

//Création de bouton de filtres dans la div-container
function setFilter(data) {
    const div = document.createElement("div");
    div.className = data.id;
    div.addEventListener("click", () => getWorks(data.id));

    div.innerHTML = `${data.name}`;
    document.querySelector(".div-container").append(div);
} 
//Active le bouton "TOUS" dans la barre de filtres
document.querySelector(".tous").addEventListener("click", () => getWorks());

function displayAdminMode() {
  if (sessionStorage.authToken) {
    console.log("ok");
    const editBanner = document.createElement('div');
    editBanner.className = "edit";
    editBanner.innerHTML = '<p><i class="fa-regular fa-pen-to-square"></i>Mode édition</p>';
    document.body.prepend(editBanner);
  }
}
displayAdminMode();