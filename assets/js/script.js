const formImg = document.querySelector(".form-image");
const modal = document.querySelector(".modal");
const modalAdd = document.querySelector(".modal-add");
localStorage.getItem("token");
let works;
let categories;

//fonction pour récupérer les travaux de l'utilisateur et stockage des données par des variables
async function fetchWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  works = await response.json();
  // récupérer la liste des categories
  const response2 = await fetch("http://localhost:5678/api/categories");
  categories = await response2.json();
  // création des filtres puis affichage des travaux dans la gallerie
  createFilters();
  displayGallery();
  addEventListenerToFilters();
}

// fonction pour créer les filtres
async function createFilters() {
  // création d'une liste pour les filtres
  let list = document.createElement("ul");
  list.classList.add("project-filter");
  //insertion de la liste avant la gallerie
  document
    .querySelector("#portfolio")
    .insertBefore(list, document.querySelector(".gallery"));
  // création du filtre all
  let li = document.createElement("li");
  li.classList.add("type", "all", "highlight");
  li.textContent = "Tous";
  list.appendChild(li);
  // boucle de création de tous les filtres dans l'API
  for (let i = 0; i < categories.length; i++) {
    let li = document.createElement("li");
    li.classList.add("type");
    li.textContent = categories[i].name;
    list.appendChild(li);
  }
}

async function highlightCategory(type) {
  //trouver l'élément avec la classe highlight
  let highlight = document.querySelector(".highlight");
  //supprimer la classe highlight
  highlight.classList.remove("highlight");
  //ajouter la classe highlight à l'élément cliqué
  type.classList.add("highlight");
}

async function displayGallery() {
  //suppression des travaux de la gallerie si ils existent
  document.querySelectorAll(".gallery figure").forEach((figure) => {
    figure.remove();
  });
  let gallery = document.querySelector(".gallery");
  // boucle pour afficher les travaux
  for (let i = 0; i < works.length; i++) {
    // afficher tous les travaux
    let figure = document.createElement("figure");
    let img = document.createElement("img");
    let figcaption = document.createElement("figcaption");
    img.src = works[i].imageUrl;
    img.alt = works[i].title;
    figcaption.textContent = works[i].title;
    figure.appendChild(img);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  }
  changePhotosModal();
}

//appel de la fonction pour afficher tous les travaux
fetchWorks().then(() => {
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
});

/*fonction pour les event listeners sur les filtres*/
async function addEventListenerToFilters() {
  document.querySelectorAll(".type").forEach((type) => {
    type.addEventListener("click", () => {
      if (type.textContent === "Tous") {
        //afficher tous les travaux
        displayGallery();
        //colorer le filtre tous
        highlightCategory(type);
      } else {
        //afficher les travaux selon la catégorie sélectionnée
        displayCategory(type.textContent);
        //colorer la catégorie sélectionnée
        highlightCategory(type);
      }
    });
  });
}

//fonction pour afficher les travaux selon la catégorie sélectionnée
async function displayCategory(category) {
  //suppression des travaux de la gallerie
  document.querySelectorAll(".gallery figure").forEach((figure) => {
    figure.remove();
  });
  // boucle pour afficher les travaux
  for (let i = 0; i < works.length; i++) {
    //compare la catégorie du travail avec la catégorie sélectionnée
    if (category == works[i].category.name) {
      let figure = document.createElement("figure");
      let img = document.createElement("img");
      let figcaption = document.createElement("figcaption");
      img.src = works[i].imageUrl;
      img.alt = works[i].title;
      figcaption.textContent = works[i].title;
      figure.appendChild(img);
      figure.appendChild(figcaption);
      document.querySelector(".gallery").appendChild(figure);
    }
  }
}

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
  // vérifier si le bouton est avec la classe green
  if (document.querySelector(".validation-add").classList.contains("green")) {
    const file = document.querySelector("#image").files[0];
    const formData = new FormData();
    formData.append("image", file);
    let title = document.querySelector("#title").value;
    formData.append("title", title);
    let category = document.querySelector("#category").value;
    //fonction pour l'id de la catégorie
    let categoryId = findIdCategory(category);
    formData.append("category", category);
    console.log(file, title, categoryId);
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
    displayGallery();
  }
});

//fonction pour changer photos du modal en fonction de ce qu'affiche la gallerie
async function changePhotosModal() {
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
  for (let i = 0; i < works.length; i++) {
    let figure = document.createElement("figure");
    let img = document.createElement("img");
    let figcaption = document.createElement("figcaption");
    let trash = document.createElement("i");
    trash.classList.add("fas", "fa-trash-alt");
    trash.id = works[i].id;
    img.src = works[i].imageUrl;
    img.alt = works[i].title;
    figcaption.textContent = "éditer";
    figure.appendChild(trash);
    figure.appendChild(img);
    figure.appendChild(figcaption);
    newPhotos.appendChild(figure);
  }
  deleteWork();
}

//fonction pour trouver l'id de la catégorie
async function findIdCategory(category) {
  for (let i = 0; i < categories.length; i++) {
    if (category === categories[i].name) {
      return categories[i].id;
    }
  }
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

//fonction au changement du formulaire pour mettre en vert le bouton submit
document.querySelector(".form-image").addEventListener("change", () => {
  let file = document.querySelector("#image").files[0];
  let limit = 4000000;
  let size = file.size / 1024;
  if (
    //si tous les champs sont remplis et que le fichier est valide et que a taille est inférieure à 4mo
    file !== undefined &&
    document.querySelector("#title").value !== "" &&
    document.querySelector("#category").value !== "" &&
    size < limit &&
    (file.type === "image/png" || file.type === "image/jpeg")
  ) {
    //changer couleur du bouton submit
    document.querySelector(".validation-add").style.backgroundColor = "#1D6154";
    document.querySelector(".validation-add").classList.add("green");
  } else {
    document.querySelector(".validation-add").style.backgroundColor = "#A7A7A7";
    document.querySelector(".validation-add").classList.remove("green");
  }
});
