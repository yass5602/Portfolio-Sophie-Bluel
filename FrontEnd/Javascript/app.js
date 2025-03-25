//Ceci est une fonction fetch pour l'API (works)
async function getWorks(filter) {
    document.querySelector(".gallery").innerHTML = "";
    document.querySelector(".modal-gallery").innerHTML = "";

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
        setModalFigure(filtered[i]);
      }
    } else {
        for (let i = 0; i < json.length; i++) {
        setFigure(json[i]);
        setModalFigure(json[i]);
      }
    }
    
    //Delete
    const trashCans = document.querySelectorAll(".fa-trash-can");
    trashCans.forEach((e) =>
      e.addEventListener("click", (event) => deleteWork(event))
    );
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
function setModalFigure(data) {
  const figure = document.createElement("figure");
  figure.innerHTML = `<div class ="image-container">
                        <img src=${data.imageUrl} alt=${data.title}>
                        <figcaption>${data.title}</figcaption>
                        <i id =${data.id} class="fa-solid fa-trash-can overlay-icon"></i>
                        </div>`;

  document.querySelector(".modal-gallery").append(figure);
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
    div.addEventListener("click", () => {
        // Retirer la classe active-filter de tous les boutons
        document.querySelectorAll('.div-container > *').forEach(button => {
            button.classList.remove('active-filter');
        });
        // Ajouter la classe active-filter au bouton cliqué
        div.classList.add('active-filter');
        // Appeler getWorks avec le filtre
        getWorks(data.id);
    });

    div.innerHTML = `${data.name}`;
    document.querySelector(".div-container").append(div);
} 

//Active le bouton "TOUS" dans la barre de filtres
document.querySelector(".tous").addEventListener("click", () => {
    // Retirer la classe active-filter de tous les boutons
    document.querySelectorAll('.div-container > *').forEach(button => {
        button.classList.remove('active-filter');
    });
    // Ajouter la classe active-filter au bouton "Tous"
    document.querySelector(".tous").classList.add('active-filter');
    // Appeler getWorks sans filtre
    getWorks();
});

function displayAdminMode() {
  if (sessionStorage.authToken) {
    document.querySelector(".js-modal-2").style.display = "block";
    document.querySelector(".gallery").style.margin = "30px 0 0 0";
    document.querySelector(".div-container").style.visibility = "hidden";
    
    // Créer et afficher la barre d'édition
    const editBanner = document.createElement('div');
    editBanner.className = "edit";
    editBanner.innerHTML = 
    '<p><a href="#modal1" class="js-modal"><i class="fa-regular fa-pen-to-square"></i>Mode édition</a></p>';
    document.body.prepend(editBanner);
    editBanner.style.display = "flex"; // Afficher la barre en mode édition

    const login = document.querySelector(".login a");
    login.textContent = "logout";
    
    login.addEventListener("click", function(e) {
      e.preventDefault();
      sessionStorage.removeItem("authToken");
      window.location.reload();
    });
  }
}
displayAdminMode();

let modal = null;
const focusableSelector = "button, a, input, textarea"
let focusables = []

const openModal = function (e) {
  e.preventDefault();
  modal = document.querySelector(e.target.getAttribute("href"));
  focusables = Array.from(modal.querySelectorAll(focusableSelector));
  focusables[0].focus();
  modal.style.display = null;
  modal.removeAttribute("aria-hidden");
  modal.setAttribute("aria-modal", "true");
  modal
    .querySelectorAll(".js-modal-close")
    .forEach((e) => e.addEventListener("click", closeModal));
  modal
  .querySelector(".js-modal-stop")
  .addEventListener("click", stopPropagation);
};

const closeModal = function (e) {
  if (modal === null) return;
  e.preventDefault();
  modal.style.display ="none";
  modal.setAttribute("aria-hidden", "true");
  modal.removeAttribute("aria-modal");
  modal.removeEventListener("click", closeModal);
  modal
  .querySelector(".js-modal-close")
  .removeEventListener("click", closeModal);
  modal
  .querySelector(".js-modal-stop")
  .removeEventListener("click", stopPropagation);  
  modal = null;
};

const stopPropagation = function (e) {
  e.stopPropagation();
};

const focusInModal = function(e) {
  e.preventDefault();
  let index = focusables.findIndex((f) => f === modal.querySelector(":focus"));
  if (e.shiftKey === true) {
    index--;
  }
  else {
    index++;
  }
  if (index >= focusables.length) {
    index = 0;
  }
  if (index < 0) {
    index = focusables.length - 1;
  }
  focusables[index].focus();
};

window.addEventListener("keydown", function(e) {
  if (e.key === "Escape" || e.key === "Esc") {
    closeModal(e);
  }
  if (e.key === "Tab" && modal !== null) {
    focusInModal(e);
  }
});

document.querySelectorAll(".js-modal").forEach((a) => {
  a.addEventListener('click', openModal);  
});

//Delete Function

async function deleteWork(event) {
  event.stopPropagation();
  const id = event.srcElement.id;
  const deleteApi = `http://localhost:5678/api/works/${id}`;
  const token = sessionStorage.authToken;

  try {
    const response = await fetch(deleteApi, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur lors de la suppression (status: ${response.status})`);
    }

    // Mise à jour de la galerie après suppression dans l'API
    await getWorks();  // Rafraîchit les données directement depuis l'API pour assurer la cohérence
    
    // Suppression dynamique des éléments du DOM
    document
      .querySelector(`.gallery figure img[src$="${id}"]`)
      ?.closest("figure")
      .remove();

    document
      .querySelector(`.modal-gallery .overlay-icon[id="${id}"]`)
      ?.closest("figure")
      .remove();

  } catch (error) {
    console.error(error.message);
    const errorBox = document.createElement("div");
    errorBox.className = "error-login";
    errorBox.innerHTML = "Erreur lors de la suppression. Veuillez réessayer.";
    document.querySelector(".modal-button-container").prepend(errorBox);
  }
}

//Toggle function
const addPhotoButton = document.querySelector(".add-photo-button");
const backButton = document.querySelector(".js-modal-back");

addPhotoButton.addEventListener("click", toggleModal);
backButton.addEventListener("click", toggleModal);

function toggleModal() {
  const galleryModal = document.querySelector(".gallery-modal");
  const addModal = document.querySelector(".add-modal");

  if (
    galleryModal.style.display === "block" ||
    galleryModal.style.display === ""
  ) {
    galleryModal.style.display = "none";
    addModal.style.display = "block";
  } else {
    galleryModal.style.display = "block";
    addModal.style.display = "none";
    
    // Réinitialisation du formulaire
    document.getElementById("picture-form").reset();
    document.getElementById("photo-container").innerHTML = "";
    document.querySelectorAll(".picture-loaded").forEach((e) => (e.style.display = "block"));
    
    // Réinitialisation des variables
    titleValue = "";
    file = null;
    
    // Retirer la classe active du bouton
    submitButton.classList.remove("active");
  }
}

//Add photo input
let img = document.createElement("img");
let file;

document.querySelector("#file").style.display = "none";
document.getElementById("file").addEventListener("change", function (event) {
  file =event.target.files[0]; // Assigner le fichier à une variable globale
  if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
    const reader = new FileReader();
    reader.onload = function(e) {
      img.src = e.target.result;
      img.alt = "Uploaded Photo";
      document.getElementById("photo-container").appendChild(img);
    };
    reader.readAsDataURL(file);
    document
      .querySelectorAll(".picture-loaded")
      .forEach((e) => (e.style.display = "none"));
  } else {
    alert("Séléctionnez une image au format JPG ou PNG");
  }
});

//Handle picture submit
const titleInput = document.getElementById("title");
let titleValue = "";
const submitButton = document.querySelector(".submit-button");

let selectedValue = "1";

document.getElementById("category").addEventListener("change", function() {
  selectedValue = this.value;
  checkFormValidity();
});

titleInput.addEventListener("input", function () {
  titleValue = titleInput.value;
  checkFormValidity();
});

// Fonction pour vérifier si tous les champs sont remplis
function checkFormValidity() {
  const hasImage = document.querySelector("#photo-container").firstChild;
  if (hasImage && titleValue.trim() && selectedValue) {
    submitButton.classList.add("active");
  } else {
    submitButton.classList.remove("active");
  }
}

// Vérifier l'état initial du formulaire
checkFormValidity();

const addPictureForm = document.getElementById("picture-form");

// Fonction pour supprimer les messages d'erreur existants
function removeExistingErrors() {
  const existingErrors = document.querySelectorAll('.error-message');
  existingErrors.forEach(error => error.remove());
}

addPictureForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  removeExistingErrors();

  const hasImage = document.querySelector("#photo-container").firstChild;
  let hasError = false;

  // Validation de l'image
  if (!hasImage) {
    const errorMessage = document.createElement("div");
    errorMessage.className = "error-message";
    errorMessage.innerHTML = "Veuillez sélectionner une image";
    document.querySelector("#file-section").appendChild(errorMessage);
    hasError = true;
  }

  // Validation du titre
  if (!titleValue.trim()) {
    const errorMessage = document.createElement("div");
    errorMessage.className = "error-message";
    errorMessage.innerHTML = "Veuillez renseigner un titre";
    titleInput.parentNode.appendChild(errorMessage);
    hasError = true;
  }

  // Validation de la catégorie
  if (!selectedValue) {
    const errorMessage = document.createElement("div");
    errorMessage.className = "error-message";
    errorMessage.innerHTML = "Veuillez sélectionner une catégorie";
    document.getElementById("category").parentNode.appendChild(errorMessage);
    hasError = true;
  }

  // Si des erreurs ont été détectées, on arrête l'envoi
  if (hasError) {
    return;
  }

  //Création nouvel objet FormData
  const formData = new FormData();

  //Ajout du fichier au FormData
  formData.append("image", file);
  formData.append("title", titleValue);
  formData.append("category", selectedValue);

  const token = sessionStorage.authToken;

  if(!token) {
    console.error("Token d'authentification manquant");
    return;
  }

  try {
    let response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: formData,
    });

    if (response.status === 201) { 
      let result = await response.json();
      
      // Mise à jour de la galerie avec les données actualisées de l'API
      await getWorks();

      // Message de confirmation
      alert("Votre image a bien été ajoutée !");

      // Réinitialisation du formulaire
      document.getElementById("picture-form").reset();
      document.getElementById("photo-container").innerHTML = "";
      document.querySelectorAll(".picture-loaded").forEach((e) => (e.style.display = "block"));
      
      // Retour à la galerie
      toggleModal();
    } else {
      throw new Error("Erreur lors de l'ajout de l'image");
    }
  } catch (error) {
    const errorMessage = document.createElement("div");
    errorMessage.className = "error-message";
    errorMessage.innerHTML = "Une erreur est survenue lors de l'ajout de l'image";
    document.querySelector(".modal-button-container").prepend(errorMessage);
  }
});

