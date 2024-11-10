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

// console.log(TASKS);


for (let i = 0; i < TASKS.length; i++) {

    ajoutTache(TASKS[i].nomTache, TASKS[i].position, 1, TASKS[i].id);

}


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
    label.setAttribute("position", position);
    label.setAttribute("id", id) //creation de la categorie où se trouve l'élément
    poubelle.setAttribute("type", "button");
    poubelle.setAttribute("id", "trash");
    poubelle.classList.add("btn", "btn-outline-danger", "mx-2");
    image.setAttribute("class", "bi bi-trash3");

    if (position != "terminees"){
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
        return saveTask(value, label.getAttribute("position"), state);
    }
}

function transfererTache(event) {
    let elementActif = event.target.nodeName;
    let elementParent = event.target.parentElement.id;


    if (elementParent === "") {
        elementParent = event.target.parentElement.parentElement.id;
    }

    if (elementParent === "faire") {
        // de l'étape A FAIRE vers l'étape A VALIDER
        if (elementActif === "INPUT" || elementActif === "LABEL") {
            let parent = event.target.parentElement;
            let transfert = aFaire.removeChild(parent);

            return faireTransfert(transfert, elementParent);
        }
        if (elementActif === "LI") {
            let parent = event.target;
            let transfert = aFaire.removeChild(parent);

            return faireTransfert(transfert, elementParent);
        }
    }
    if (elementParent === "validation") {
        //de l'étape A VALIDER vers l'étape TERMINEES
        if (elementActif === "INPUT" || elementActif === "LABEL") {
            let parent = event.target.parentElement;
            let transfert = aValider.removeChild(parent);

            return faireTransfert(transfert, elementParent);
        }
        if (elementActif === "LI") {
            let parent = event.target;
            let transfert = aValider.removeChild(parent);

            return faireTransfert(transfert, elementParent);
        }
    }
}

function faireTransfert(termine, source) {
    let destination;
    let value;
    let position;

    if (source === "faire") {
        destination = document.getElementById("validation");
        let destinationId = destination.getAttribute("id");


        if (event.target.nodeName === "LABEL") {
            event.target.setAttribute("position", destinationId);
        }
        if (event.target.nodeName === "INPUT") {
            event.target.nextElementSibling.setAttribute("position", destinationId);
        }
        value = termine.firstChild.nextElementSibling.getAttribute("id");
        position = termine.firstChild.nextElementSibling.getAttribute("position");
    }

    if (source === "validation") {
        destination = document.getElementById("terminees");
        let destinationId = destination.getAttribute("id");


        if (event.target.nodeName === "LABEL") {
            event.target.setAttribute("position", destinationId);
        }
        if (event.target.nodeName === "INPUT") {
            event.target.nextElementSibling.setAttribute("position", destinationId);
        }
        value = termine.firstChild.nextElementSibling.getAttribute("id");
        position = termine.firstChild.nextElementSibling.getAttribute("position");

        let suppr = termine.firstChild;
        termine.removeChild(suppr);
    }
    destination.appendChild(termine);
    saveTask(value, position, 1);
}

function supprimerTache(event) {
    let elementParent = event.target.parentElement.parentElement.id;

    if (elementParent === "") {
        elementParent = event.target.parentElement.parentElement.parentElement.id;
    }

    if (elementParent === "faire") {
        if (event.target.nodeName === "I") {
            elementParent = event.target.parentElement.parentElement;
            aFaire.removeChild(elementParent);
        }
        if (event.target.nodeName === "BUTTON") {
            elementParent = event.target.parentElement;
            aFaire.removeChild(elementParent);
        }
    }

    if (elementParent === "validation") {
        if (event.target.nodeName === "I") {
            elementParent = event.target.parentElement.parentElement;
            aValider.removeChild(elementParent);
        }
        if (event.target.nodeName === "BUTTON") {
            elementParent = event.target.parentElement;
            aValider.removeChild(elementParent);
        }
    }

    if (elementParent === "terminees") {
        if (event.target.nodeName === "I") {
            elementParent = event.target.parentElement.parentElement;
            aTerminer.removeChild(elementParent);
        }
        if (event.target.nodeName === "BUTTON") {
            elementParent = event.target.parentElement;
            aTerminer.removeChild(elementParent);
        }
    }
}


function saveTask(value, position, state) {


    let lastId;

    TASKS.forEach(dernier => {
        lastId = dernier.id + 1
    });
    

    if (state === 0) {
        let nouvelleTache = { id: lastId, nomTache: value, position: position };
        TASKS.push(nouvelleTache);
        localStorage.setItem("task", JSON.stringify(TASKS));

    } if (state === 1 ) {
        TASKS.forEach(valeur => {
            if (valeur.id == value) {
                valeur.position = position;
            };
        });
        // localStorage.setItem("task", JSON.stringify(TASKS)); //! NE PAS OUBLIER D'ENLEVER LE COMMENTAIRE


    }

}

function loadTask() {
    return JSON.parse(localStorage.getItem("task"));
}
