let task = document.getElementById("task");
let aFaire = document.getElementById("faire");
let aValider = document.getElementById("validation")
let aTerminer = document.getElementById("terminees");
let button = document.getElementById("validate");
let checkbox = document.getElementsByClassName("form-check-input");


button.addEventListener("click", ajoutTache);
aFaire.addEventListener("click", transfererTache);
aValider.addEventListener("click", transfererTache);
aFaire.addEventListener("click", supprimerTache);
aValider.addEventListener("click", supprimerTache);
aTerminer.addEventListener("click", supprimerTache);


function ajoutTache() {
    let value = task.value;
    let newLi = document.createElement("li");
    let input = document.createElement("input");
    let label = document.createElement("label");
    let poubelle = document.createElement("button");
    let image = document.createElement("i");

    input.setAttribute("type", "checkbox");
    input.classList.add("form-check-input", "mx-2", "align-middle")
    input.setAttribute("id", "checkbox");
    label.textContent = value;
    label.classList.add("align-middle", "px-2");
    label.setAttribute("position", "faire"); //creation de la position où se trouve l'élément
    poubelle.setAttribute("type", "button");
    poubelle.setAttribute("id", "trash");
    poubelle.setAttribute("onclick", "supprimerTache()");
    poubelle.classList.add("btn", "btn-outline-danger", "mx-2");
    image.setAttribute("class", "bi bi-trash3");


    newLi.appendChild(input);
    newLi.appendChild(label);
    poubelle.appendChild(image);
    newLi.appendChild(poubelle);
    aFaire.appendChild(newLi);
    task.value = "";
}

function transfererTache(event) {


    let elementActif = event.target.nodeName;
    let elementParent = event.target.parentElement.id;

    if (elementParent === "") {
        elementParent = event.target.parentElement.parentElement.id;
    }

    if (elementParent === 'faire') { // de l'étape A FAIRE vers l'étape A VALIDER
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
    if (elementParent === 'validation') { //de l'étape A VALIDER vers l'étape TERMINEES
        if (elementActif === "INPUT" || elementActif === "LABEL") {
            let parent = event.target.parentElement;
            let transfert = aValider.removeChild(parent);
            return faireTransfert(transfert, elementParent);
        } if (elementActif === "LI") {

            let parent = event.target;
            let transfert = aValider.removeChild(parent);
            return faireTransfert(transfert, elementParent);
        }
    }
}

function faireTransfert(termine, source) {
    let destination;

    if (source === "faire") {
        destination = document.getElementById("validation");
    }
    if (source === "validation") {
        destination = document.getElementById("terminees");
        let suppr = termine.firstChild;
        termine.removeChild(suppr);
    }
    destination.appendChild(termine);
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

function save() {
    //TODO  FAIRE CETTE FONCTION

}