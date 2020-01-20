************** Création d'un carousel pagination en Javascript, HTML, CSS  **************
                           *************************


Ce carrousel est responsive grâce à la fonction onWindowResize
On peut utiliser le clavier pour le diriger avec la méthode avec keyup,
on utilise les touches flèches de gauche et de droite mais avant appuyer sur la touche tab.

                                ******************************

Il a été construit avec un Class qui utilise des options :
    - option slidesToScroll : c'est le nombre d'images scrollable à la fois.

    - option slidesVisibles : c'est le nombre d'images visible.

    - option loop : permet de boucler si cette option est mise à True.

    - option pagination : permet d'afficher une pagination ou pas selon votre choix.

                                ******************************
Par défaut les options sont :

        * slidesToScroll est à 1.

        * slidesVisibles est à 1.

        * loop est à false.

        * pagination est à true.

                                ****************************** 
pour utiliser le carousel dans votre site, il faut les fichiers : les lignes html du carrousel
                                                                  le css pour styliser le carousel, vous pouvez le modifier
                                                                  le Javascript en bas du fichier
                                ******************************   
EXEMPLE POUR LA CRÉATION D'UN CAROUSEL :

        document.addEventListener('DOMContentLoaded', function () {
            new Carousel(document.querySelector('#carousel1'), {
                slidesToScroll:1,
                slidesVisibles:1,
                loop: false,
                pagination: true
            })
        })

Dans cette création d'événement on peut déclarer autant de carousel que l'on veut....