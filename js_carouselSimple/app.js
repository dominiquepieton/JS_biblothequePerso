class Carousel {
    /**
     * This callback is displayed as part of the Requester class.
     * @callback moveCallback
     * @param {number} index
     * 
     */

    /**
     * 
     * @param {HTMLElement} element 
     * @param {Object} options
     * @param {Object} options.slidesToScroll Nombre d'elements à faire defiler
     * @param {Object} options.slidesVisibles Nombre d'elements visible dans un slide
     * @param {boolean} options.loop bouclage possible en de carousel  
     */
    constructor (element, options = {}) {
        this.element = element
        this.options = Object.assign({}, {
            slidesToScroll: 1,
            slidesVisibles: 1,
            loop: false
        }, options)

        let children = [].slice.call(element.children)
        // savoir si on est sur mobile
        this.isMobile = false
        //variable de sauvegarde
        this.currentSlide = 0
        this.moveCallbacks = []

        // Modification du DOM
        this.root = this.createDivWithClass('carousel')
        this.container = this.createDivWithClass('carousel-container')
        this.root.setAttribute('tabindex', '0') 
        this.root.appendChild(this.container)
        this.element.appendChild(this.root)
        //on rentre les enfants dans l'element
        this.items = children.map((child) => {
            let item = this.createDivWithClass('carousel-item')
            item.appendChild(child)
            this.container.appendChild(item)
            return item
        })
        this.setStyle()
        this.createNavigation()
        // Evenements
        this.moveCallbacks.forEach(cb => cb(0))
        this.onWindowResize()
        window.addEventListener('resize', this.onWindowResize.bind(this))
        this.root.addEventListener('keyup', e => {
            if(e.key === 'ArrowRight' || e.key === 'Right'){
                this.next()
            } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
                this.prev ()
            }
        })
    }

    /**
     * Applique les bonnes dimensions aux élément du carousel
     */
    setStyle () {
        // calcule de l'espace des elements
        let ratio = this.items.length / this.slidesVisibles
        this.container.style.width = (ratio * 100) + "%"
        //on l'applique aux items
        this.items.forEach(item => item.style.width = ((100 / this.slidesVisibles) / ratio) + "%")
    }

    /**
     * creation des boutons pour l'avant et l'arriere  
     */
    createNavigation () {
        let nextButton = this.createDivWithClass('carousel-next')
        let prevButton = this.createDivWithClass('carousel-prev')
        this.root.appendChild(nextButton)
        this.root.appendChild(prevButton)
        nextButton.addEventListener('click', this.next.bind(this))
        prevButton.addEventListener('click', this.prev.bind(this))
        if (this.options.loop === true){
            return
        }
        this.onMove(index => {
            if(index === 0){
                prevButton.classList.add('prev-hidden')
            } else {
                prevButton.classList.remove('prev-hidden')
            }    
            if (this.items[this.currentSlide + this.slidesVisibles] === undefined){
                nextButton.classList.add('next-hidden')
            } else {
                nextButton.classList.remove('next-hidden')
            }
        })       
    }

    next (){
        this.goToItem(this.currentSlide + this.slidesToScroll)
    }

    prev() {
        this.goToItem(this.currentSlide - this.slidesToScroll)
    }

    /**
     * Deplace le carousel vers l'element ciblé
     *  
     */
    goToItem (index) {
        //si index inferieur a zero on revient en arriere
        if (index < 0){
            if(this.options.loop) {
               rindex = this.items.length - this.slidesVisibles
            } else {
                return
            }
        } else if (index >= this.items.length || (this.items[this.currentSlide + this.slidesVisibles] === undefined && index > this.currentSlide)) {
            if(this.options.loop) {
                index =  0
            } else {
                return
            }
        }
        let translateX = index * -100 / this.items.length
        this.container.style.transform = 'translate3d(' + translateX + '%,0,0)'
        this.currentSlide = index
        this.moveCallbacks.forEach(cb => cb(index))
    }


    /**
    *
    * @param {moveCallback} cb 
    * 
    */
    onMove (cb) {
        this.moveCallbacks.push(cb)
    }

    /**
     * création pour la la partie responsive
     */
    onWindowResize() {
        let mobile = window.innerWidth < 800
        if (mobile !== this.isMobile) {
            this.isMobile = mobile
            this.setStyle()
            this.moveCallbacks.forEach(cb => cb(this.currentSlide))
        }
    }

    /**
     * @param (string) className
     * @returns {HTMLElement}
     */
    createDivWithClass (className) {
        let div = document.createElement('div')
        div.setAttribute('class', className)
        return div
    }

    /**
     * @returns {number}
     */
    get slidesToScroll(){
        return this.isMobile ? 1 : this.options.slidesToScroll
     }

     /**
     * @returns {number}
     */
     get slidesVisibles(){
        return this.isMobile ? 1 : this.options.slidesVisibles
     }
}

document.addEventListener('DOMContentLoaded', function () {
    new Carousel(document.querySelector('#carousel1'), {
        slidesToScroll:1,
        slidesVisibles:1,
        loop: false
    })    
})