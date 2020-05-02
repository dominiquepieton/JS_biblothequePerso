// Game constructor
function Game(titre, genre, support) {
    this.titre = titre;
    this.genre = genre;
    this.support = support;
}

// UI constructor
function UI(){

}

// Ajout du jeu dans la liste
UI.prototype.addGameToList = function(game){
    const list = document.getElementById('game-list');
    // creer l'element tr
    const row = document.createElement('tr');
    //creer le contenu du tr
    row.innerHTML = `<td>${game.titre}</td>
                    <td>${game.genre}</td>
                    <td>${game.support}</td>
                    <td><a href="#" class="delete">X</a></td>`;
    list.appendChild(row);
}

// Nettoyer les champs du formulaire après validation
UI.prototype.clearFields = function(){
    document.getElementById('titre').value = '';
    document.getElementById('genre').value = '';
    document.getElementById('support').value = '';
}

// Effacer la ligne de jeu de la liste
UI.prototype.deleteGame = function(target){
    if(target.className === 'delete'){
        target.parentElement.parentElement.remove();
    }
}


// Montrer l'alerte
UI.prototype.showAlert = function(message, className) {
    //creer la div
    const div = document.createElement('div');
    // Ajoute une classe
    div.className = `alert ${className}`;
    // Ajout du message
    div.appendChild(document.createTextNode(message));
    // prendre le parent pour pouvoir le placer
    const container = document.querySelector('.container');
    // prendre le formulaire
    const form = document.querySelector('#game-form');
    // Insèrer l'alerte
    container.insertBefore(div, form);
    // faire disparaitre le message après 4s
    setTimeout(function(){
        document.querySelector('.alert').remove();
    }, 4000);  
}

// event pour ajouter le jeu / erreur / succès
document.getElementById('game-form').addEventListener('submit', function(e){
    // on prend toutes les valeurs
    const titre = document.getElementById('titre').value,
            genre = document.getElementById('genre').value,
            support = document.getElementById('support').value;
    // instancie un game
    const game = new Game(titre, genre, support);
    // intancie un nouvel ui
    const ui = new UI();

    // Validation
    if(titre === '' || genre === '' || support === ''){
        ui.showAlert('Remplissez les champs!', 'error');
    } else {
        // Ajout de game dans le tableau
        ui.addGameToList(game);
        // success
        ui.showAlert('Jeu ajouté', 'success');
        // clear les champs
        ui.clearFields();
    }
    e.preventDefault();
});

// Évenement pour delete les lignes
document.getElementById('game-list').addEventListener('click', function(e){
    // instancier UI
    const ui = new UI();
    // Effacer le jeu
    ui.deleteGame(e.target);
    // Message de succès
    ui.showAlert('le jeu a étè enlevè avec succès!', 'success');


    e.preventDefault();
});