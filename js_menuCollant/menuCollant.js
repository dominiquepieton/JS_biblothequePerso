/**
 * function qui s'auto-appelle
 * pour créer le systeme collant
 */
(function(){

    //calcule de la position
    var scrollY = function () {
        var supportPageOffset = window.pageXOffset !== undefined;
        var isCSS1Compat = ((document.compatMode || "") === "CSS1Compat");
        return supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop;
    }

    // function reutilisable
        window.makeSticky = function (element){
        var rect = element.getBoundingClientRect()
        var offset = parseInt(element.getAttribute('data-offset') || 0, 10)
        if (element.getAttribute('data-constraint')){
            var constraint = document.querySelector(element.getAttribute('data-constraint'))
        } else {
            var constraint = document.body
        }
        //calcul de l'element
        var constrainRect = constraint.getBoundingClientRect()
        var constraintBottom = constrainRect.top + scrollY() + constrainRect.height - offset - rect.height
        var top = rect.top + scrollY()
        var fakeElement = document.createElement('div')
        fakeElement.style.width = rect.width + "px"
        fakeElement.style.height = rect.height + "px"
    
                    // Function
        /*
        * function pour écoute le scroll avec l'eventListener
        */
        var onScroll = function(){
            //connaitre la position du menu
            if (scrollY() > constraintBottom && element.style.position != 'absolute'){
                //enleve le fixed
                element.style.position = 'absolute'
                element.style.bottom = '0'
                element.style.top = 'auto'

            } else if (scrollY() > top - offset && scrollY() < constraintBottom && element.style.position != 'fixed') {
                element.classList.add('fixed')
                element.style.position = 'fixed'
                element.style.top = offset + "px"
                element.style.bottom = 'auto'
                element.style.width = rect.width + "px"
                // ajout du faux element
                element.parentNode.insertBefore(fakeElement, element)
            
            } else if (scrollY() < top - offset && element.style.position != 'static') {
                element.classList.remove('fixed')
                element.style.position = 'static'
                // retire le faux element
                if (element.parentNode.contains(fakeElement)){
                    element.parentNode.removeChild(fakeElement)
                }
                //element.parentNode.removeChild(fakeElement)
            }
        }
    
        /**
         * function pour redimensionner
         */
        var onResize = function () {
            element.style.width = "auto"
            element.classList.remove('fixed')
            element.style.position = "static"
            fakeElement.style.display = "none"
            rect = element.getBoundingClientRect()
            constrainRect = constraint.getBoundingClientRect()
            constraintBottom = constrainRect.top + scrollY() + constrainRect.height - offset - rect.height
            top = rect.top + scrollY()
            fakeElement.style.width = rect.width + "px"
            fakeElement.style.height = rect.height + "px"
            fakeElement.style.display = "block"
            onScroll()
        }

        // Listener
        window.addEventListener('scroll', onScroll)
        window.addEventListener('resize', onResize)
    }

        // selection de tous les elements à fixer
    var elements = document.querySelectorAll('[data-fixed]')
    for (var i = 0; i < elements.length; i++) {
        makeSticky(elements[i])
    }     

})()

makeSticky(document.querySelector('#main2'));