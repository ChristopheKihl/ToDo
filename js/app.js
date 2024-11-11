const task = document.getElementById("task");
const aFaire = document.getElementById("faire");
const aValider = document.getElementById("validation");
const aTerminer = document.getElementById("terminees");
const button = document.getElementById("validate");
const checkbox = document.getElementsByClassName("form-check-input");
const information = document.getElementsByClassName("modale");

let TASKS = loadTask();


if (TASKS === null) {
    TASKS = [];
}

for (let i = 0; i < TASKS.length; i++) { // boucle récupérant les données existantes dans le LocalStorage

    ajoutTache(TASKS[i].nomTache, TASKS[i].position, 1, TASKS[i].id);

}

task.addEventListener("keypress", keypress); // Appel de la fontion sur un appui de touche
button.addEventListener("click", () => { ajoutTache(task.value, "faire", 0) });
aFaire.addEventListener("click", transfererTache);
aValider.addEventListener("click", transfererTache);
aFaire.addEventListener("click", supprimerTache);
aValider.addEventListener("click", supprimerTache);
aTerminer.addEventListener("click", supprimerTache);
tri.addEventListener("click", trier);

function ajoutTache(value, position, state, id) { // Ajoute une nouvelle tâche + formatage des données existantes
    let newLi = document.createElement("li");
    let input = document.createElement("input");
    let label = document.createElement("label");
    let poubelle = document.createElement("button");
    let image = document.createElement("i");


    input.setAttribute("type", "checkbox");
    input.classList.add("form-check-input", "mx-2", "align-middle");
    input.setAttribute("id", "checkbox");
    label.textContent = value;
    label.classList.add("align-middle", "px-2", "col-8");
    label.setAttribute("position", position); // Creation de la categorie où se trouve l'élément
    label.setAttribute("id", createId(id)); // Création d'un nouvel ID ou recupération de l'ID existant
    poubelle.setAttribute("type", "button");
    poubelle.setAttribute("id", "trash");
    poubelle.classList.add("btn", "btn-outline-danger", "my-1");
    image.setAttribute("class", "bi bi-trash3");

    if (value != "") {
        if (position != "terminees") {
            newLi.appendChild(input);
        }
        newLi.appendChild(label);     //<=|
        poubelle.appendChild(image);  // Structuration HTML de ma tâche
        newLi.appendChild(poubelle);  //<=|

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


        if (state === 0) {
            afficherMessage("Nouvelle tâche", "Votre nouvelle tâche a été ajoutée")
            return saveTask(value, label.getAttribute("position"), state, label.getAttribute("id"));
        }
        return
    }
}

function transfererTache(event) { // Transfert des tâches vers une autre catégorie
    let elementClique = event.target.nodeName;
    let id;
    let oldPosition;
    let newPosition;
    let element;

    if (elementClique === "INPUT") {
        id = event.target.nextElementSibling.getAttribute("id");
        oldPosition = event.target.nextElementSibling.getAttribute("position");
        element = event.target.parentElement;
    }

    if (elementClique === "LABEL") {
        id = event.target.getAttribute("id");
        oldPosition = event.target.getAttribute("position");
        element = event.target.parentElement;
    }

    if (elementClique === "LI") {
        id = event.target.firstChild.nextElementSibling.getAttribute("id");
        oldPosition = event.target.firstChild.nextElementSibling.getAttribute("position");
        element = event.target;
    }

    if (oldPosition === "faire") {
        TASKS.forEach(changePosition => {
            if (changePosition.id === id) {
                newPosition = "validation"
                changePosition.position = newPosition;
            }
        })

        element.firstChild.nextElementSibling.setAttribute("position", newPosition);
        aFaire.removeChild(element);
        aValider.appendChild(element);
        element.firstChild.checked = false;
        
    }

    if (oldPosition === "validation") {
        TASKS.forEach(changePosition => {
            if (changePosition.id === id) {
                newPosition = "terminees"
                changePosition.position = newPosition;
            }
        })
        element.removeChild(element.firstChild);
        aValider.removeChild(element)
        aTerminer.appendChild(element)
    }
    afficherMessage("Transfert", "Votre tâche a bien été transférée");
    return saveTask(id, newPosition, 1); //! enlever le commentaire
}

function supprimerTache(event) { // Supprime une tâche

    let elementClique = event.target.nodeName;
    let id;
    let element;
console.log(elementClique);

    if (elementClique === "I") {
        let position = event.target.parentElement.parentElement.firstChild.getAttribute("position");

        id = event.target.parentElement.parentElement.firstChild.nextElementSibling.getAttribute("id");
        element = event.target.parentElement.parentElement;

        if (position === "terminees") {
            id = event.target.parentElement.parentElement.firstChild.getAttribute("id");
        }
        
        afficherMessage("Suppression", "Votre tâche a été supprimée !!!");
    };

    if (elementClique === "BUTTON") {
        id = event.target.parentElement.firstChild.nextElementSibling.getAttribute("id");
        element = event.target.parentElement;
        afficherMessage("Suppression", "Votre tâche a été supprimée !!!");
    };


    TASKS.forEach(suppressionTask => {
        if (suppressionTask.id === id) {
            return saveTask(id, '', 2);
        };
    })
}

function createId(id) { // Créé un ID unique ou récupération d'un ID existant
    let myId = id;

    if (myId) {
        return myId;
    } else {
        TASKS.forEach(dernier => {
            myId = 1 + parseInt(dernier.id);
        });

        if (myId === undefined) {
            myId = 0;
        }
        return myId;
    }
}

function saveTask(value, position, state, id) { // Sauvegarde des données dans le LocalStorage 

    if (state === 0) { // création d'une nouvelle tâche
        let nouvelleTache = { id: id, nomTache: value, position: position };
        TASKS.push(nouvelleTache);
        localStorage.setItem("task", JSON.stringify(TASKS));
    } if (state === 1) { //modification de la position de la tâche
        TASKS.forEach(valeur => {
            if (valeur.id == value) {
                valeur.position = position;
            };
        });
        return localStorage.setItem("task", JSON.stringify(TASKS));
    }

    if (state === 2) { // supression de la tâche
        TASKS.forEach(valeur => { // suppression des clé de TASKS
            if (valeur.id == value) {
                delete valeur.id;
                delete valeur.nomTache;
                delete valeur.position;
            }
        })

        for (let i = 0; i < TASKS.length; i++) { // suppression de l'objet vide
            if (Object.keys(TASKS[i]).length === 0) {
                TASKS.splice(i, 1);
            }
        }
        localStorage.setItem("task", JSON.stringify(TASKS));
        return reload();
    }
}

function loadTask() { // Récupére les données dans le LocalStorage
    return JSON.parse(localStorage.getItem("task"));
}

function keypress(event) { //Fonction qui réagit lorsque l'on presse la touche Enter ou NumpadEnter

    if (event.code === "Enter" || event.code === "NumpadEnter") {
        return ajoutTache(task.value, "faire", 0);
    }
}

function trier(event) { // Fonction permettant le tri
    let option = parseInt(event.target.value);

    switch (option) {
        case 1:
            aFaire.parentElement.parentElement.classList.remove("d-none");
            aValider.parentElement.parentElement.classList.remove("d-none");
            aTerminer.parentElement.parentElement.classList.remove("d-none");
            localStorage.setItem("option", JSON.stringify(option));
            event.target.children[(option - 1)].setAttribute("selected", "");
            break;

        case 2:
            aFaire.parentElement.parentElement.classList.remove("d-none");
            aValider.parentElement.parentElement.classList.add("d-none");
            aTerminer.parentElement.parentElement.classList.add("d-none");
            localStorage.setItem("option", JSON.stringify(option));
            event.target.children[(option - 1)].setAttribute("selected", "");
            break;

        case 3:
            aFaire.parentElement.parentElement.classList.add("d-none");
            aValider.parentElement.parentElement.classList.remove("d-none");
            aTerminer.parentElement.parentElement.classList.add("d-none");
            localStorage.setItem("option", JSON.stringify(option));
            event.target.children[(option - 1)].setAttribute("selected", "");
            break;

        case 4:
            aFaire.parentElement.parentElement.classList.add("d-none");
            aValider.parentElement.parentElement.classList.add("d-none");
            aTerminer.parentElement.parentElement.classList.remove("d-none");
            localStorage.setItem("option", JSON.stringify(option));
            event.target.children[(option - 1)].setAttribute("selected", "");
            break;

        default:
            break;
    }
}

function reload() { // Rafraichit la page
    location.reload();
}

function afficherMessage(titre, message) { // Permet d'afficher une modale avec des informations
    information[0].classList.toggle("informations");
    information[0].firstElementChild.textContent = titre;
    information[0].firstElementChild.nextElementSibling.textContent = message;
    setTimeout(() => {
        information[0].classList.remove("informations")
    }, "6000");
}
