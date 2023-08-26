const formImg = document.querySelector(".form-image");
const all = document.querySelector(".all");
const object = document.querySelector(".object");
const tenement = document.querySelector(".tenement");
const hotel = document.querySelector(".hotel");
const modal = document.querySelector(".modal");
const modalAdd = document.querySelector(".modal-add");
localStorage.getItem("token");
let idWorks = [];
let titleWorks = [];
let imageUrlWorks = [];
let categoryWorks = [];
let numberofWorks = 0;
let typeClass = "all";

//fonction pour récupérer les travaux de l'utilisateur et stockage des données par des variables
async function fetchWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  const json = await response.json();
  Object.entries(json).forEach(([key, value]) => {
    //création d'une variable pour stocker les id des travaux
    idWorks.push(value.id);
    //création d'une variable pour stocker les titres des travaux
    titleWorks.push(value.title);
    //création d'une variable pour stocker les url des travaux
    imageUrlWorks.push(value.imageUrl);
    //création d'une variable pour stocker les catégories des travaux
    categoryWorks.push(value.categoryId);
    numberofWorks++;
  });
}

async function fetchWorksModal() {
  let photos = document.querySelector(".photos");
  const response = await fetch("http://localhost:5678/api/works");
  const json = await response.json();
  Object.entries(json).forEach(([key, value]) => {
    let figure = document.createElement("figure");
    let img = document.createElement("img");
    let figcaption = document.createElement("figcaption");
    let trash = document.createElement("i");
    trash.classList.add("fas", "fa-trash-alt", "fa-2xs");
    trash.id = value.id;
    img.src = value.imageUrl;
    img.alt = value.title;
    figcaption.textContent = "éditer";
    figure.appendChild(trash);
    figure.appendChild(img);
    figure.appendChild(figcaption);
    photos.appendChild(figure);
  });
}

fetchWorksModal();

//fonction pour trouver id d'une categorie
function findIdCategory(category) {
  let idCategory = 0;
  switch (category) {
    case "object":
      idCategory = 1;
      break;
    case "tenement":
      idCategory = 2;
      break;
    case "hotel":
      idCategory = 3;
      break;
  }
  return idCategory;
}

async function highlightCategory(type) {
  type.style.backgroundColor = "#1D6154";
  type.style.color = "white";
  if (typeClass !== type.classList[1]) {
    document.querySelector(`.${typeClass}`).style.backgroundColor = "white";
    document.querySelector(`.${typeClass}`).style.color = "#1D6154";
  }
  //mémoriser la classe du type sélectionné
  typeClass = type.classList[1];
}

//fonction pour afficher les travaux avec comme paramètre la ou les catégories à afficher

async function displayCategory(...category) {
  // suppresion de la gallerie
  document.querySelector(".gallery").remove();
  // création d'une nouvelle gallerie
  let newGallery = document.createElement("div");
  newGallery.classList.add("gallery");
  document.querySelector("#portfolio").appendChild(newGallery);
  // boucle pour afficher les travaux
  for (let i = 0; i < numberofWorks; i++) {
    // afficher tous les travaux si aucun paramètre n'est passé
    if (category.length === 0) {
      let figure = document.createElement("figure");
      let img = document.createElement("img");
      let figcaption = document.createElement("figcaption");
      img.src = imageUrlWorks[i];
      img.alt = titleWorks[i];
      figcaption.textContent = titleWorks[i];
      figure.appendChild(img);
      figure.appendChild(figcaption);
      newGallery.appendChild(figure);
    } else {
      // afficher les travaux selon la ou les catégories passées en paramètre
      if (categoryWorks[i] === category[0]) {
        let figure = document.createElement("figure");
        let img = document.createElement("img");
        let figcaption = document.createElement("figcaption");
        img.src = imageUrlWorks[i];
        img.alt = titleWorks[i];
        figcaption.textContent = titleWorks[i];
        figure.appendChild(img);
        figure.appendChild(figcaption);
        newGallery.appendChild(figure);
      }
    }
  }
  changePhotosModal(...category);
}

//appel de la fonction pour afficher tous les travaux
fetchWorks().then(() => displayCategory());

object.addEventListener("click", () => {
  displayCategory(1);
  //colorer la catégorie sélectionnée
  highlightCategory(object);
});

tenement.addEventListener("click", () => {
  displayCategory(2);
  highlightCategory(tenement);
});

hotel.addEventListener("click", () => {
  displayCategory(3);
  highlightCategory(hotel);
});

all.addEventListener("click", () => {
  displayCategory();
  highlightCategory(all);
});

async function modificationUser() {
  //ajout d'un event listener sur icone fontawesome pen to square
  let modifications = document.querySelectorAll(
    ".fa-pen-to-square, .modification"
  );
  modifications.forEach((modification) => {
    modification.addEventListener("click", () => {
      //afficher modal
      modal.showModal();
      modal.style.display = "flex";
      deleteWork();
      deleteAllWorks();
    });
  });
}

//vérifier si l'utilisateur est connecté
if (localStorage.getItem("token")) {
  //si oui, afficher logout au lieu de login
  let login = document.querySelector(".login");
  login.textContent = "logout";
  login.href = "index.html";
  //afficher modifier au lieu de project-filter
  let projectFilter = document.querySelector(".project-filter");
  projectFilter.remove();
  let modifier = document.createElement("p");
  modifier.classList.add("modification");
  modifier.textContent = "Modifier";
  let portfolio = document.querySelector("#portfolio");
  portfolio.insertBefore(modifier, portfolio.childNodes[2]);
  //aficher avant modifier l'icone fontawesome pen to square
  let pen = document.createElement("i");
  pen.classList.add("fas", "fa-pen-to-square");
  portfolio.insertBefore(pen, portfolio.childNodes[2]);
  //ajout d'un lien avec texte modifier et icone fontawesome à la figure dans la section presentation
  let introduction = document.querySelector("#introduction figure");
  let modification = document.createElement("p");
  modification.classList.add("modification");
  modification.textContent = "Modifier";
  introduction.appendChild(modification);
  let pen2 = document.createElement("i");
  pen2.classList.add("fas", "fa-pen-to-square");
  introduction.appendChild(pen2);
  //ajout d'un event listener sur le bouton logout
  login.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.reload();
  });
  //appel de la fonction pour modifier un travail
  modificationUser();

  //si oui, montrer div edit
  let edit = document.querySelector(".edit");
  edit.style.display = "flex";
  let header = document.querySelector(".header");
  header.style.marginTop = "90px";
}

modal.addEventListener("click", (e) => {
  const modalDimensions = modal.getBoundingClientRect();
  if (
    e.clientX < modalDimensions.left ||
    e.clientX > modalDimensions.right ||
    e.clientY < modalDimensions.top ||
    e.clientY > modalDimensions.bottom
  ) {
    modal.close();
    modal.style.display = "none";
  }
});

//ajout d'un event listener en dehors de la modal add
modalAdd.addEventListener("click", (e) => {
  const modalDimensions = document
    .querySelector(".modal-add")
    .getBoundingClientRect();
  if (
    e.clientX < modalDimensions.left ||
    e.clientX > modalDimensions.right ||
    e.clientY < modalDimensions.top ||
    e.clientY > modalDimensions.bottom
  ) {
    document.querySelector(".modal-add").close();
    modalAdd.style.display = "none";
  }
});

//ajout d'un event listener sur la croix de la modal
document.querySelector(".close1").addEventListener("click", () => {
  document.querySelector(".modal").close();
  modal.style.display = "none";
});

//ajout d'un event listener sur la croix de la modal add
document.querySelector(".close2").addEventListener("click", () => {
  document.querySelector(".modal-add").close();
});

//ajout d'un event listener sur la flèche de la modal add
document.querySelector(".back").addEventListener("click", () => {
  document.querySelector(".modal-add").close();
  modalAdd.style.display = "none";
  modal.showModal();
  modal.style.display = "flex";
});

//ajout d'un event listener sur le bouton ajouter
document.querySelector(".add").addEventListener("click", async () => {
  //cacher modal
  modal.close();
  modal.style.display = "none";
  //afficher modal add
  document.querySelector(".modal-add").showModal();
  modalAdd.style.display = "flex";
  addEventListenerToLoading();
});

// fonction pour supprimer un travail
async function deleteWork() {
  let i = 0;
  document.querySelectorAll(".fa-trash-alt").forEach((trash) => {
    i++;
    trash.addEventListener("click", async () => {
      const response = await fetch(
        `http://localhost:5678/api/works/${trash.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
        // supprimer le travail dans le DOM
      );
      // supprimer le travail dans le DOM
      if (document.querySelectorAll(".gallery figure")[i - 1]) {
        document.querySelectorAll(".gallery figure")[i - 1].remove();
      }
      // fermer la modal
      document.querySelector(".modal").close();
      modal.style.display = "none";
    });
  });
}

// fonction pour supprimer tous les travaux
async function deleteAllWorks() {
  document.querySelector(".delete").addEventListener("click", async () => {
    // récpérer tous les id des travaux
    const response = await fetch("http://localhost:5678/api/works");
    const json = await response.json();
    Object.entries(json).forEach(async ([key, value]) => {
      // supprimer le travail dans la base de données
      const response = await fetch(
        `http://localhost:5678/api/works/${value.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            id: value.id,
          }),
        }
      );
    });
  });
}

formImg.addEventListener("submit", async (e) => {
  e.preventDefault();
  let error;
  let file = document.querySelector("#image").files[0];
  let limit = 4000000;
  if (
    file === undefined ||
    document.querySelector("#title").value === "" ||
    document.querySelector("#category").value === ""
  ) {
    // afficher message d'erreur en rouge en dessous du formulaire
    error = document.createElement("p");
    error.textContent = "Veuillez remplir tous les champs";
    error.style.color = "red";
    document.querySelector(".modal-add").appendChild(error);
    // supprimer message d'erreur s'il existe
    let precedentError = document.querySelector(".modal-add p");
    if (precedentError) {
      precedentError.remove();
    }
  } else {
    let size = file.size / 1024;
    // supprimer message d'erreur s'il existe
    let precedentError = document.querySelector(".modal-add p");
    if (precedentError) {
      precedentError.remove();
    }
    // cas où le fichier est trop lourd
    if (size > limit) {
      // afficher message d'erreur en rouge en dessous du formulaire
      error = document.createElement("p");
      error.textContent = "Le fichier est trop lourd";
      error.style.color = "red";
      document.querySelector(".modal-add").appendChild(error);
    }
    // cas où le fichier n'est pas un png ou jpg
    if (file.type !== "image/png" && file.type !== "image/jpeg") {
      // afficher message d'erreur en rouge en dessous du formulaire
      error = document.createElement("p");
      error.textContent = "Le fichier doit être un png ou jpg";
      error.style.color = "red";
      document.querySelector(".modal-add").appendChild(error);
    } else {
      const file = document.querySelector("#image").files[0];
      const formData = new FormData();
      let imageUrl = file;
      formData.append("image", file);
      let title = document.querySelector("#title").value;
      formData.append("title", title);
      let category = document.querySelector("#category").value;
      let categoryId = findIdCategory(category);
      formData.append("category", categoryId);
      const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });
      const json = await response.json();
      document.querySelector(".modal-add").close();
      modalAdd.style.display = "none";
      window.location.reload();
    }
  }

  //afficher paragraphe requirement si le champ image est vide
  if (document.querySelector("#image").value === "") {
    let typeFile = document.createElement("p");
    typeFile.textContent = "jpg, png : 4mo max";
    typeFile.classList.add("requirement");
    document.querySelector(".photo-to-add").appendChild(typeFile);
  }
});

//fonction pour changer photos du modal en fonction de ce qu'affiche la gallerie
async function changePhotosModal(...category) {
  //suppression des photos du modal
  document.querySelector(".photos").remove();
  //création d'une nouvelle div pour les photos du modal
  let newPhotos = document.createElement("div");
  newPhotos.classList.add("photos");
  // insert before hr
  document
    .querySelector(".modal")
    .insertBefore(newPhotos, document.querySelector("hr"));
  // boucle pour afficher les photos du modal
  for (let i = 0; i < numberofWorks; i++) {
    // afficher tous les travaux si aucun paramètre n'est passé
    if (category.length === 0) {
      let figure = document.createElement("figure");
      let img = document.createElement("img");
      let figcaption = document.createElement("figcaption");
      let trash = document.createElement("i");
      trash.classList.add("fas", "fa-trash-alt");
      trash.id = idWorks[i];
      img.src = imageUrlWorks[i];
      img.alt = titleWorks[i];
      figcaption.textContent = "éditer";
      figure.appendChild(trash);
      figure.appendChild(img);
      figure.appendChild(figcaption);
      newPhotos.appendChild(figure);
    } else {
      // afficher les travaux selon la ou les catégories passées en paramètre
      for (let j = 0; j < category.length; j++) {
        if (categoryWorks[i] === category[j]) {
          let figure = document.createElement("figure");
          let img = document.createElement("img");
          let figcaption = document.createElement("figcaption");
          let trash = document.createElement("i");
          trash.classList.add("fas", "fa-trash-alt");
          trash.id = idWorks[i];
          img.src = imageUrlWorks[i];
          img.alt = titleWorks[i];
          figcaption.textContent = "éditer";
          figure.appendChild(trash);
          figure.appendChild(img);
          figure.appendChild(figcaption);
          newPhotos.appendChild(figure);
        }
      }
    }
  }
  deleteWork();
}

async function addEventListenerToLoading() {
  document.getElementById("image").addEventListener("change", (e) => {
    //afficher image à la place de l'icone fontawesome, du label et du texte si ils existent
    if (document.querySelector(".requirement")) {
      document.querySelector(".fa-image").style.display = "none";
      document.querySelector(".photo-to-add input").style.display = "none";
      document.querySelector(".requirement").style.display = "none";
      document.querySelector(".form-info--label").style.color = "#E8F1F6";
      document.querySelector(".form-info--label").style.backgroundColor =
        "#E8F1F6";
    }
    if (document.querySelector(".chosen-image")) {
      document.querySelector(".chosen-image").remove();
    }
    //afficher l'image choisie
    let img = document.createElement("img");
    img.src = URL.createObjectURL(e.target.files[0]);
    img.alt = "image";
    let formLabel = document.querySelector(".form-info--label");
    formLabel.insertBefore(img, formLabel.childNodes[1]);
    //ajouter classe
    img.classList.add("chosen-image");
  });
}
