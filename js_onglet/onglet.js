(function() {
    /*
    *function pour lors d'un click sur onglet 
    */
    window.afficherOnglet = function (a, animations) {
        if (animations === undefined) {
            animations = true
        }
        var li = a.parentNode
        var div = a.parentNode.parentNode.parentNode
        var activeTab = div.querySelector('.tab-content.active')
        var aAfficher = div.querySelector(a.getAttribute('href'))
                // vérification que l'élément contient la class active
        if(li.classList.contains('active')){
            return false //permet d'arreter la function
        }
                //retire la class de l'élément
        div.querySelector('.tabs .active').classList.remove('active')
                // ajout de la class active à l'onglet actuel
        li.classList.add('active')
            // verification de l'animation
        if (animations){
        //on ajoute la class fade sur l'element actif
            activeTab.classList.add('fade')
            activeTab.classList.remove('in')
            var transition = function () {
                // retire les class fade et active
                this.classList.remove('fade')
                this.classList.remove('active')
            // class fade active element actif
                aAfficher.classList.add('active')
                aAfficher.classList.add('fade')
            // astuce pour un system d'attente
                aAfficher.offsetWidth
            // ajout de la class in    
                aAfficher.classList.add('in')
            // on casse l'event    
                activeTab.removeEventListener('transitionend',transition)
            }
        //fin de l'animation
            activeTab.addEventListener('transitionend',transition)
        } else {
            aAfficher.classList.add('active')
            activeTab.classList.remove('active')
        }
    }
    var tabs = document.querySelectorAll('.tabs a')

    for (var i = 0; i < tabs.length; i++){
        tabs[i].addEventListener('click', function (e) {
            afficherOnglet(this)
        })
    }

    // recuperer le hash
    var hashChange = function () {
        var hash = window.location.hash
        var a = document.querySelector('a[href="' + hash + '"]')
        //ajout de la class active sur le lien href="hash"
        if(a !== null && !a.parentNode.classlist.contains('active')){
            afficherOnglet(a, false)
        }
    }
    //garder les parametres au retour
    window.addEventListener('hashchange', hashChange())
    hashChange()
})()