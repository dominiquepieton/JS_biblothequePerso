let modal = null; // Utiliser pour savoir quel modal est ouvert
const focusableSelector = 'button, a, input, textarea' //element qui peut avoir un focus
let focusables = [] // tableau reçevant les elements avec le focus
let previousElement = null

/**
 * function pour ouvrir le modal
 */
const openModal = function (e) {
    e.preventDefault()
    modal = document.querySelector(e.target.getAttribute('href'))
    // entrer les elements dans le tableau focusables
    focusables = Array.from(modal.querySelectorAll(focusableSelector))
    // trouver le premier element qui a le focus
    previousElement = document.querySelector(':focus') 
    //afficher le modal
    modal.style.display = null
    focusables[0].focus() // met le premier element en focus
    modal.removeAttribute('aria-hidden')
    modal.setAttribute('aria-modal', 'true')
    // Fermeture du modal
    modal.addEventListener('click', closeModal)
    modal.querySelector('.close-modal').addEventListener('click', closeModal)
    modal.querySelector('.stop-modal').addEventListener('click', stopPropagation)
}

/*
 *Fonction pour la fermeture du modal 
 */
const closeModal = function (e) {
    if (modal === null) return
    // redonner le focus au dernier element lors de la fermeture
    if (previousElement !== null) previousElement.focus()
    e.preventDefault()
    modal.setAttribute('aria-hidden', 'true')
    modal.removeAttribute('aria-modal')    
    modal.removeEventListener('click', closeModal)
    modal.querySelector('.close-modal').removeEventListener('click', closeModal)
    modal.querySelector('.stop-modal').removeEventListener('click', stopPropagation)
        //masquer le modal avec un temps donné
    const hideModal = function () {
        modal.style.display = "none"
        modal.removeEventListener('animationend', hideModal)
        modal = null
    }
    modal.addEventListener('animationend',hideModal)
}

/**
 * fonction pour eviter les clicks sur le modal
 */
const stopPropagation = function (e) {
    e.stopPropagation()
}

/* gestion du focus dans le modal */
const focusInModal = function (e) {
    e.preventDefault()
    //recherche l'index de l'element focus
    let index = focusables.findIndex(f => f === modal.querySelector(':focus'))
    // permettre de remonter 
    if (e.shiftKey === true){
        index--
    } else {
    // increment l'index
    index++
    }
    // verification si on est pas a la fin du tableau pour le réinitialiser
    if (index >= focusables.length){
        index = 0
    }
    // verification si on sort pas du tableau
    if (index < 0){
        index = focusables.length -1
    }
    focusables[index].focus() // rendre l'element automatiquement focus
}

/* Selection de l'element pour ouvrir le modal */
document.querySelectorAll('.open-modal').forEach(a => {
    a.addEventListener('click', openModal)
})

/* Ecouter la touche du clavier */
window.addEventListener('keydown', function (e){ 
    // fermeture du modal avec le clavier
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e)
    }
    if (e.key === "Tab" && modal !== null) {
        focusInModal(e)
    }
})