const email = document.getElementById("email");
const password = document.getElementById("password");
const form = document.querySelector("form");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  //fonction pour vérifier les champs du formulaire
  let check = checkInput();
  if (check) {
    const response = fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // récupérer les valeurs des champs du formulaire
        email: email.value,
        password: password.value,
      }),
    });
    //fonction pour vérifier la réponse du serveur
    checkResponse(response);
  }
});

async function checkInput() {
  const emailValue = email.value.trim();
  const passwordValue = password.value.trim();

  if (emailValue === "" || passwordValue === "") {
    // appel de la fonction pour afficher le message d'erreur
    displayError();
    return false;
  } //protéger les champs avec caractère valide pour l'email et le mot de passe
  else if (
    !emailValue.match(
      /^([a-zA-Z0-9._-]+)@([a-zA-Z0-9._-]+)\.([a-zA-Z]{2,6})$/
    ) ||
    !passwordValue.match(/^[a-zA-Z0-9._-]{6,}$/)
  ) {
    displayError();
    return false;
  } else {
    return true;
  }
}

async function displayError() {
  // afficher une div avec le message d'erreur à la fin du main
  //cas si il y a déjà un message d'erreur
  if (document.querySelector(".error")) {
    document.querySelector(".error").remove();
  }
  const main = document.querySelector("main");
  const p = document.createElement("p");
  p.classList.add("error");
  main.appendChild(p);
  p.textContent = "Erreur dans l’identifiant ou le mot de passe";
}

async function checkResponse(response) {
  // vérifier promiseResult de la réponse du serveur
  const promiseResult = await response;
  if (promiseResult.status === 200) {
    window.location.href = "index.html";
    // récupérer le token
    const data = await promiseResult.json();
    localStorage.setItem("token", data.token);
  } else {
    displayError();
  }
}
