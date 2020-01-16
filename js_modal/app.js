let modal = null; // Utiliser pour savoir quel modal est ouvert

/**
 * function pour ouvrir le modal
 */
const openModal = function (e) {
    e.preventDefault()
    const target = document.querySelector(e.target.getAttribute('href'))
    //afficher le modal
    target.style.display = null
    target.removeAttribute('aria-hidden')
    target.setAttribute('aria-modal', 'true')
    // Sauvegarde la cible
    modal = target
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
    e.preventDefault()
    //masquer le modal
    modal.style.display = "none"
    modal.setAttribute('aria-hidden', 'true')
    modal.removeAttribute('aria-modal')    
    modal.removeEventListener('click', closeModal)
    modal.querySelector('.close-modal').removeEventListener('click', closeModal)
    modal.querySelector('.stop-modal').removeEventListener('click', stopPropagation)
    //Réinitialise modal
    modal = null
}

/**
 * fonction pour eviter les clicks sur le modal
 */
const stopPropagation = function (e) {
    e.stopPropagation()
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
})