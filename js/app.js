const task = document.getElementById("task");
const aFaire = document.getElementById("faire");
const aValider = document.getElementById("validation");
const aTerminer = document.getElementById("terminees");
const button = document.getElementById("validate");
const information = document.getElementsByClassName("modale");

let TASKS = loadTask();

if (TASKS === null) {
    TASKS = [];
}

for (let i = 0; i < TASKS.length; i++) {  // boucle récupérant les données existantes dans le LocalStorage
    ajoutTache(TASKS[i].nomTache, TASKS[i].position, 1, TASKS[i].id);
}

task.addEventListener("keypress", keypress); // Appel de la fontion sur un appui de touche
button.addEventListener("click", () => { ajoutTache(task.value, "faire", 0); });
aFaire.addEventListener("click", transfererTache);
aValider.addEventListener("click", transfererTache);
aTerminer.addEventListener("click", transfererTache);
aFaire.addEventListener("click", supprimerTache);
aValider.addEventListener("click", supprimerTache);
aTerminer.addEventListener("click", supprimerTache);
tri.addEventListener("change", trier);

function ajoutTache(nomTache, position, state, id) { // Ajoute une nouvelle tâche + formatage des données existantes
    let newLi = document.createElement("li");
    let input = document.createElement("input");
    let label = document.createElement("label");
    let poubelle = document.createElement("button");
    let imageTrash = document.createElement("i");
    let back = document.createElement("button");
    let imageBack = document.createElement("i");

    input.setAttribute("type", "checkbox");
    input.classList.add("form-check-input", "mx-2", "align-middle");
    input.setAttribute("id", "checkbox");
    label.textContent = nomTache;
    label.classList.add("align-middle", "px-2", "col-9");
    label.setAttribute("position", position); // Creation de la categorie où se trouve l'élément
    label.setAttribute("id", createId(id)); // Création d'un nouvel ID ou recupération de l'ID existant
    id = label.getAttribute("id");
    back.setAttribute("type", "button");
    back.setAttribute("id", "back");
    back.classList.add("btn", "btn-outline-success", "my-1", "me-1");
    imageBack.setAttribute("class", "bi bi-skip-backward");
    poubelle.setAttribute("type", "button");
    poubelle.setAttribute("id", "trash");
    poubelle.classList.add("btn", "btn-outline-danger", "my-1");
    imageTrash.setAttribute("class", "bi bi-trash3");

    if (nomTache != "") {
        if (position != "terminees") {
            newLi.appendChild(input);
        }
        newLi.appendChild(label);
        if (position != "faire") {
            back.appendChild(imageBack);
            newLi.appendChild(back);
        }
        poubelle.appendChild(imageTrash);
        newLi.appendChild(poubelle);
        if (position === "faire") {
            aFaire.appendChild(newLi);
        }
        if (position === "validation") {
            aValider.appendChild(newLi);
        }
        if (position === "terminees") {
            aTerminer.appendChild(newLi);
        }

        task.value = "";

        if (state === 0) {// Création d'une nouvelle tâche
            afficherMessage("Nouvelle tâche", "Votre nouvelle tâche a été ajoutée");
            let nouvelleTache = { id: id, nomTache: nomTache, position: position };
            TASKS.push(nouvelleTache);
        }
        return saveTask();
    }
}

function transfererTache(event) { // Transfert des tâches vers une autre catégorie
    let elementClique = event.target.nodeName;
    let elementParent;
    let id;
    let position;
    let nomTache;
    let idTarget;

    event.stopPropagation();

    if (elementClique === "INPUT" || elementClique === "LABEL") {
        elementParent = event.target.parentElement;
    };

    if (elementClique === "LI") {
        elementParent = event.target;
    };

    if (elementClique === "I" && event.target.parentElement.id === "back") {
        elementParent = event.target.parentElement.parentElement;
        idTarget = event.target.parentElement.id;
    }

    if (elementClique === "BUTTON" && event.target.id === "back") {
        elementParent = event.target.parentElement;
        idTarget = event.target.id;
    }

    if (event.target.parentElement.id !== "trash" && event.target.id !== "trash") {
        id = elementParent.firstChild.nextElementSibling.getAttribute("id");
        nomTache = elementParent.firstChild.nextElementSibling.innerText;
        position = elementParent.firstChild.nextElementSibling.getAttribute("position");
    }

    if (nomTache === "") {
        id = elementParent.firstChild.getAttribute("id");
        nomTache = elementParent.firstChild.innerText;
        position = elementParent.firstChild.getAttribute("position");
    }

    if (elementClique === "INPUT" || elementClique === "LABEL" || elementClique === "LI") {
        switch (position) {
            case "faire":
                position = "validation"
                aFaire.removeChild(elementParent);
                break;
            case "validation":
                position = "terminees"
                aValider.removeChild(elementParent);
                break;
        }
        afficherMessage("Transfert", "Votre tâche a bien été transférée");
    }
    console.log(event.target.nodeName);
    console.log(elementClique);


    if ((elementClique === "I" || elementClique === "BUTTON") && idTarget === "back") {
        switch (position) {
            case "validation":
                position = "faire";
                aValider.removeChild(elementParent);
                break;
            case "terminees":
                position = "validation";
                aTerminer.removeChild(elementParent);
                break;
        }
        afficherMessage("Transfert", "Votre tâche a bien été transférée");
    }

    TASKS.forEach(valeur => {
        if (valeur.id == id) {
            valeur.position = position;
        };
    })
    return ajoutTache(nomTache, position, '', id);
}

function supprimerTache(event) { // Supprime une tâche
    let elementClique = event.target.nodeName;
    let elementParent;
    let id;
    let position;

    console.log(elementClique);
    console.log(event.target.parentElement.id);


    if (elementClique === "I" && event.target.parentElement.id === "trash") {
        elementParent = event.target.parentElement.parentElement;
        id = elementParent.getElementsByTagName("label")[0].getAttribute("id");
        position = elementParent.getElementsByTagName("label")[0].getAttribute("position");
        afficherMessage("Suppression", "Votre tâche a été supprimée !!!");
    }

    switch (position) {
        case "faire":
            aFaire.removeChild(elementParent);
            break;

        case "validation":
            aValider.removeChild(elementParent);
            break;

        case "terminees":
            aTerminer.removeChild(elementParent);
            break;
    }


    for (let i = 0; i < TASKS.length; i++) { // suppression de l'objet vide
        if (TASKS[i].id === id) {
            TASKS.splice(i, 1);
        }
        saveTask();
    }
}

function createId(id) {// Créé un ID unique ou récupération d'un ID existant

    if (id) {
        return id;
    } else {
        TASKS.forEach((dernier) => {
            id = 1 + parseInt(dernier.id);
        });

        if (id == undefined) {
            id = 0;
        }
        return id;
    }
}

function saveTask() {// Sauvegarde des données dans le LocalStorage

    localStorage.setItem("task", JSON.stringify(TASKS));
}

function loadTask() {// Récupére les données dans le LocalStorage
    return JSON.parse(localStorage.getItem("task"));
}

function keypress(event) {//Fonction qui réagit lorsque l'on presse la touche Enter ou NumpadEnter

    if (event.code === "Enter" || event.code === "NumpadEnter") {
        return ajoutTache(task.value, "faire", 0);
    }
}

function trier(event) { // Fonction permettant le tri
    let option = parseInt(event.target.value);
    let tableauGeneral = document.getElementById("tableauGeneral");
    let tableauDonnees = document.getElementById("tableauDonnees");

    aFaire.parentElement.parentElement.classList.remove("animation");
    aValider.parentElement.parentElement.classList.remove("animation");
    aTerminer.parentElement.parentElement.classList.remove("animation");

    aFaire.parentElement.parentElement.classList.add("d-none");
    aValider.parentElement.parentElement.classList.add("d-none");
    aTerminer.parentElement.parentElement.classList.add("d-none");

    switch (option) {
        case 0:
            aFaire.parentElement.parentElement.classList.remove("d-none");
            aValider.parentElement.parentElement.classList.remove("d-none");
            aTerminer.parentElement.parentElement.classList.remove("d-none");
            tableauGeneral.classList.add("d-none");
            tableauDonnees.classList.add("d-none");
            break;
        case 1: //option Tous
            tableauGeneral.classList.remove("d-none");
            tableauDonnees.classList.remove("d-none");
            affichageTableau("tout");
            break;

        case 2: //option A faire
            tableauGeneral.classList.remove("d-none");
            tableauDonnees.classList.remove("d-none");
            affichageTableau("faire");
            break;

        case 3://option A valider
            tableauGeneral.classList.remove("d-none");
            tableauDonnees.classList.remove("d-none");
            affichageTableau("validation");
            break;

        case 4://option Terminées
            tableauGeneral.classList.remove("d-none");
            tableauDonnees.classList.remove("d-none");
            affichageTableau("terminees");
            break;

        default:
            break;
    }
}

function affichageTableau(position) {
    let sectionParent = document.createElement("section");
    let articleParent = document.createElement("article");
    let sectionTache = document.createElement("section");
    let articleTache = document.createElement("article");
    let articleCategorie = document.createElement("article");
    let tableauDonnees = document.getElementById("tableauDonnees");
    let element;

    sectionParent.classList.add("row", "pt-2");
    articleParent.classList.add("col-8", "text-center", "m-auto", "bg-white", "bg-gradient", "fs-6");
    sectionTache.classList.add("row", "border-3", "border-bottom", "border-black", "p-1");
    articleTache.setAttribute("id", "articleTache");
    articleTache.classList.add("col-6", "text-black-50", "border-3", "border-end");
    articleCategorie.classList.add("col-6", "text-black-50");
    articleCategorie.setAttribute("id", "articleCategorie");

    sectionParent.appendChild(articleParent);
    articleParent.appendChild(sectionTache);
    sectionTache.appendChild(articleTache);
    sectionTache.appendChild(articleCategorie);

    let long = tableauDonnees.childNodes.length;

    for (let i = 0; i < long; i++) {
        console.log("longueur tab", tableauDonnees.childNodes.length);
        console.log("element a suppr", tableauDonnees.firstChild);

        tableauDonnees.removeChild(tableauDonnees.firstChild);
        console.log("valeur de i", i);
    }


    TASKS.forEach((valeur) => {
        if (valeur.position === position || position === "tout") {
            element = sectionParent.cloneNode(true);
            element.firstChild.firstChild.firstChild.textContent = valeur.nomTache;
            element.firstChild.firstChild.firstChild.nextElementSibling.textContent = valeur.position;
            tableauDonnees.appendChild(element);
        }
    });
    element = "";
}

function afficherMessage(titre, message) {// Permet d'afficher une modale avec des informations
    information[0].classList.add("informations");
    information[0].firstElementChild.textContent = titre;
    information[0].firstElementChild.nextElementSibling.textContent = message;
    setTimeout(() => {
        information[0].classList.remove("informations");
    }, "2500");
}
