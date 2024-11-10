let task = document.getElementById("task");
let aFaire = document.getElementById("faire");
let aValider = document.getElementById("validation");
let aTerminer = document.getElementById("terminees");
let button = document.getElementById("validate");
let checkbox = document.getElementsByClassName("form-check-input");

let TASKS = loadTask();

if (TASKS === null) {
    TASKS = [];
}

for (let i = 0; i < TASKS.length; i++) {

    ajoutTache(TASKS[i].nomTache, TASKS[i].position, 1, TASKS[i].id);

}

task.addEventListener("keypress", keypress)
button.addEventListener("click", () => { ajoutTache(task.value, "faire", 0) });
aFaire.addEventListener("click", transfererTache);
aValider.addEventListener("click", transfererTache);
aFaire.addEventListener("click", supprimerTache);
aValider.addEventListener("click", supprimerTache);
aTerminer.addEventListener("click", supprimerTache);

function ajoutTache(value, position, state, id) {
    let newLi = document.createElement("li");
    let input = document.createElement("input");
    let label = document.createElement("label");
    let poubelle = document.createElement("button");
    let image = document.createElement("i");


    input.setAttribute("type", "checkbox");
    input.classList.add("form-check-input", "mx-2", "align-middle");
    input.setAttribute("id", "checkbox");
    label.textContent = value;
    label.classList.add("align-middle", "px-2");
    label.setAttribute("position", position); //creation de la categorie où se trouve l'élément
    label.setAttribute("id", createId(id));
    poubelle.setAttribute("type", "button");
    poubelle.setAttribute("id", "trash");
    poubelle.classList.add("btn", "btn-outline-danger", "mx-2");
    image.setAttribute("class", "bi bi-trash3");

    if (value != "") {
        if (position != "terminees") {
            newLi.appendChild(input);
        }
        newLi.appendChild(label);
        poubelle.appendChild(image);
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

        if (state === 0) {
            return saveTask(value, label.getAttribute("position"), state, label.getAttribute("id"));
        }
    }
}

function transfererTache(event) {
    let elementClique = event.target.nodeName;
    let id;
    let oldPosition;
    let newPosition;
    let element;
    event.stopPropagation();


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

    saveTask(id, newPosition, 1);

}

function supprimerTache(event) {

    let elementClique = event.target.nodeName;
    let id;
    let element;

    if (elementClique === "I") {
        let position = event.target.parentElement.parentElement.firstChild.getAttribute("position");

        id = event.target.parentElement.parentElement.firstChild.nextElementSibling.getAttribute("id");
        element = event.target.parentElement.parentElement;

        if (position === "terminees") {
            id = event.target.parentElement.parentElement.firstChild.getAttribute("id");
        }

    };

    if (elementClique === "BUTTON") {
        id = event.target.parentElement.firstChild.nextElementSibling.getAttribute("id");
        element = event.target.parentElement;
    };

    TASKS.forEach(suppressionTask => {
        if (suppressionTask.id === id) {
            saveTask(id, '', 2);
        };

    })
}

function createId(id) {
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

function saveTask(value, position, state, id) {

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

        localStorage.setItem("task", JSON.stringify(TASKS));
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
    }

    localStorage.setItem("task", JSON.stringify(TASKS));
    location.reload();
}

function loadTask() {
    return JSON.parse(localStorage.getItem("task"));
}

function keypress(event){

    if (event.code === "Enter" || event.code ==="NumpadEnter"){
        ajoutTache(task.value, "faire", 0);
    }
}