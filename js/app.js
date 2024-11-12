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

//TODO Faire la fonction qui permet de revenir en arrière (fonction Back)
//TODO Faire la fontion qui va me permettre de reconstruire la tache (faire > valider > terminée OU terminée > valider > faire)


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
    let imageTrash = document.createElement("i");
    let back = document.createElement("button");
    let imageBack = document.createElement("i");

    input.setAttribute("type", "checkbox");
    input.classList.add("form-check-input", "mx-2", "align-middle");
    input.setAttribute("id", "checkbox");
    label.textContent = value;
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

    if (value != "") {
        if (position != "terminees") {
            newLi.appendChild(input);
        }

        newLi.appendChild(label);

        if (position != "faire") {          // <==  |
            back.appendChild(imageBack);    //      |
            newLi.appendChild(back);        //      |
        }                                   //      |

        poubelle.appendChild(imageTrash);   // Structuration HTML de ma tâche
        newLi.appendChild(poubelle);        //<=|   |

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

        if (state === 0) { // Création d'une nouvelle tâche 
            afficherMessage("Nouvelle tâche", "Votre nouvelle tâche a été ajoutée");
            let nouvelleTache = { id: id, nomTache: value, position: position };
            TASKS.push(nouvelleTache);
            return saveTask();
        };
        // if (state === 1) { //modification de la position de la tâche
        //     TASKS.forEach(valeur => {
        //         if (valeur.id == value) {
        //             valeur.position = position;
        //         };
        //     });
        // }
    }
}

function transfererTache(event) { // Transfert des tâches vers une autre catégorie
    let elementClique = event.target.nodeName;
    let id;
    let oldPosition;
    let newPosition;
    let element;
    let back = document.createElement("button");

    console.log(elementClique);
    console.log(event.target.parentElement);



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


        // TASKS.forEach(changePosition => { //!! Enlver les commentaires
        //     if (changePosition.id === id) {
        //         newPosition = "validation"
        //         changePosition.position = newPosition;
        //     }
        // })

        // element.firstChild.nextElementSibling.setAttribute("position", newPosition);
        // aFaire.removeChild(element);
        // aValider.appendChild(element);
        // element.firstChild.checked = false;
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

    //return saveTask(); // ! Enlever le commentaire 
}

function supprimerTache(event) { // Supprime une tâche

    //     let elementClique = event.target.nodeName; // ! Enlver les commentaires
    //     let id;
    //     let element;

    //     if (elementClique === "I") {
    //         let position = event.target.parentElement.parentElement.firstChild.nextElementSibling.getAttribute("position");

    //         id = event.target.parentElement.parentElement.firstChild.nextElementSibling.getAttribute("id");
    //         element = event.target.parentElement.parentElement;

    //         if (position === null) {
    //             id = event.target.parentElement.parentElement.firstChild.getAttribute("id");
    //         }
    //         afficherMessage("Suppression", "Votre tâche a été supprimée !!!");
    //     };

    //     if (elementClique === "BUTTON") {
    //         id = event.target.parentElement.firstChild.nextElementSibling.getAttribute("id");
    //         element = event.target.parentElement;
    //         afficherMessage("Suppression", "Votre tâche a été supprimée !!!");
    //     };

    //     TASKS.forEach(valeur => { // suppression des clé de TASKS
    //         if (valeur.id == id) {
    //             delete valeur.id;
    //             delete valeur.nomTache;
    //             delete valeur.position;
    //         }
    //     });

    //     for (let i = 0; i < TASKS.length; i++) { // suppression de l'objet vide
    //         if (Object.keys(TASKS[i]).length === 0) {
    //             TASKS.splice(i, 1);
    //         }
    //     };

    //     if (elementClique === "I" || elementClique === "BUTTON") {
    //         location.reload();
    //     }

    //     return saveTask();
}

function createId(id) { // Créé un ID unique ou récupération d'un ID existant

    if (id) {
        return id;
    } else {
        TASKS.forEach(dernier => {
            id = 1 + parseInt(dernier.id);
        });

        if (id == undefined) {
            id = 0;
        }
        return id;
    }
}

function saveTask() { // Sauvegarde des données dans le LocalStorage 

    localStorage.setItem("task", JSON.stringify(TASKS));
    // return reload();
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

    aFaire.parentElement.parentElement.classList.remove("animation");
    aValider.parentElement.parentElement.classList.remove("animation");
    aTerminer.parentElement.parentElement.classList.remove("animation");

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

function afficherMessage(titre, message) { // Permet d'afficher une modale avec des informations
    information[0].classList.toggle("informations");
    information[0].firstElementChild.textContent = titre;
    information[0].firstElementChild.nextElementSibling.textContent = message;
    setTimeout(() => {
        information[0].classList.remove("informations");
    }, "6000");
}