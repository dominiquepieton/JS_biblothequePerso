// Acces à l'api
const api = 'https://restcountries.eu/rest/v2/all';

// array des données de l'api
const arrayPays = [];

// Mise des données de l'api dans le tableau
fetch(api)
    .then(blob => blob.json())
    //ont met les données dans le tableau 
    .then(data => arrayPays.push(...data))

// function pour voir ce que l'on a tape match ou pas
function matchData(wordPays, arrayPays) {
    return arrayPays.filter(place => {
        //utilisation du regex pour verifier ce que l'on a écrit, 'gi'-> globale
        const regex = new RegExp(wordPays, 'gi');
        // on retourne ce que l'on a ecrit dans la recherche
        return place.name.match(regex);
    });
}

// fonction pour les suggestion lorsque l'on ecrit
function displayMatches(){
    const matchArray = matchData(this.value, arrayPays);
    const response = matchArray.map(place => {
        // on choissit dans le json ce que l'on veut afficher
        return ` <li>
                    <span>${place.name}</span>
                    <span>${place.capital}</span>
                    <span class="population" >${place.population}</span>
                </li> `;
    }).join('');
    suggestion.innerHTML = response;
}



// selection l'input de recherche
const searchInput = document.querySelector('.search');
// ce que l'on va montrer comme resultat
const suggestion = document.querySelector('.suggestions');

// ajout d'evement dans l'input
searchInput.addEventListener('keyup', displayMatches);