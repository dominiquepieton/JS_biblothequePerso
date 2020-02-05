// Initialisation des variables globale
let balls = [];
let bricks = [];
let curLevel;
let racket;
let gameRefresh;
let playfieldWidth;
let playfieldheight;
let ballSize;
let playerScore = 0;
let bestScore = 0;

$(document).ready(init);

/**
 * ajoute dans l'element du jeu
 */
function init(){
    curLevel = 0;
    //initialisation de la balle
    playfieldWidth = $('.playfield').width();
    playfieldheight = $('.playfield').height();
    drawPlayfield();
    racket = { width: $('.racket').width(), top: $('.racket').offset().top - $('.playfield').offset().top };
    //deplacement
    $(window).on('mousemove', drawRacket);
    //Sauvegarde du meilleur score
    bestScore = localStorage.getItem('CB_bestScore') || 0;
    $('.lblBestScore').text('Meilleur score :' + bestScore);
    showPlayerScore();
}

/**
 * créer aléatoirement le nom de l'id
 */
function createId(){
    let code = "";
    for (let $compteur = 0; $compteur < 8; $compteur++){
        code += String.fromCharCode(65 + Math.random() * 26);
        return code;
    }
}

/**
 * function créer un balle et la placer
 */
function addBall() {
    let idBall = createId();
    //condition pour avoir que 10 balles
    if (balls.length < 10) {
        // Selection de l'element pour positionner la balle
        // prepend permet de passer l'element créer comme premier enfant
        $('.playfield').prepend('<div class="ball" data-id="' + idBall + '"></div>');
        ballSize = $('.ball:first').width();
        balls.push({
            id: idBall,
            left:Math.random() * (playfieldWidth - ballSize),
            top:($('.brickLine').length * 34) + ballSize,
            hSpeed: Math.random() > .5 ? 2 : -2,
            vSpeed: 2 
        });
    }
}

/**
 * lancer la partie
 */
function stargame(){
    cleanMessage();
    addBall();
    gameRefresh = setInterval(drawBalls, 10);
}

/**
 * déplacement de la balle
 */
function moveBall(e) {
    e.left += e.hSpeed;
    e.top += e.vSpeed;
    $('.ball[data-id="' + e.id + '"]')
            .css({
                left: e.left + 'px',
                top: e.top + 'px'
            });

}

/**
 * gestion positionnement de la balle par rapport a la balle
 */
function getNearBrick(e){
    e.newDirection = undefined;
    return bricks.filter( function (f){
        if (e.vSpeed < 0 && f.top + 30 > e.top && f.top < e.top && (f.left <= e.left && f.left + 100 >= e.left + ballSize)){
            e.newDirection = { hSpeed: e.hSpeed,
                               vSpeed: -e.vSpeed 
                             };
        } else if (e.vSpeed > 0 && e.top > f.top && e.top < f.top + 30 && (f.left <= e.left && f.left + 100 >= e.left + ballSize)){
            e.newDirection = {hSpeed: e.hSpeed,
                              vSpeed: -e.vSpeed
                             };
        } else if (e.hSpeed > 0 && e.left > f.left && e.left < f.left + 100 && (f.top <= e.top && f.top + 30 >= e.top + ballSize)){
            e.newDirection = { hSpeed: -e.hSpeed,
                               vSpeed: e.vSpeed 
                             };
        } else if (e.hSpeed < 0 && e.left < f.left && e.left > f.left + 100 && (f.top <= e.top && f.top + 30 >= e.top + ballSize)){
            e.newDirection = { hSpeed: -e.hSpeed,
                               vSpeed: e.vSpeed 
                             };
        }
        return e.newDirection != undefined;
    });
}

/**
 * touche brique
 */
function touchBrick(e, nearBricks){
    if (nearBricks.length > 0){
        // calcul de point quand la casse est supprimer
        let points = 250 * (curLevel + 1);
        playerScore += points;
        showPlayerScore();
        showBrickScore(nearBricks[0], points);
        // supprimer la brique
        $('.brick[data-id="' + nearBricks[0].id + '"]').remove();
        bricks.splice(bricks.indexOf(nearBricks[0]), 1);
        if (e.newDirection != undefined){
            e.hSpeed = e.newDirection.hSpeed;
            e.vSpeed = e.newDirection.vSpeed;
        }
    }
}

/**
 * gere les rebond sur les côtés
 */
function checkBorders(e){
    if (e.left < 0){
        e.hSpeed = -e.hSpeed;
    }
    if (e.top < 0){
        e.vSpeed = -e.vSpeed;
    }
    if (e.left > playfieldWidth - ballSize){
        e.hSpeed = -e.hSpeed;
    }
    if (e.top > playfieldheight - ballSize){
        e.vSpeed = -e.vSpeed;
    }
}

/**
 * gere le rebond sur la raquette
 */
function checkRacket(e){
    if (e.top > racket.top){
        $('.ball[data-id="' + e.id + '"]').remove();
        balls.splice(balls.indexOf(e), 1);
    }
    if (e.top + ballSize >= racket.top){
        if (e.left >= racket.left && e.left <= racket.left + racket.width - ballSize){
            e.vSpeed = -e.vSpeed;
        }
    }
}

/**
 * gestion des mouvements dans l'aire de jeu
 */
function drawBalls(){
    balls.forEach(function (e){
        let nearBricks; 
        moveBall(e);
        nearBricks = getNearBrick(e);
        touchBrick(e, nearBricks);
        checkBorders(e);
        checkRacket(e);        
    });
}

/**
 * création des lignes du jeu 
 */
function drawPlayfield() {
    showCurrentLevel();
    levels[curLevel].forEach(function (e, i){
        let line = $('<div class="brickLine"></div>');
            e.forEach (function (f, j) {
                bricks.push({
                    id: i + '-' + j,
                    top: i * 34,
                    left: j * 104
                            });
                line.append('<div class="brick  ' + f + 'Brick" data-id="' + i + '-' + j + '"></div>'); 
            });
        $('.playfield').prepend(line);    
    
        bricks.forEach(function (e, i){
            $('.brick[data-id="' + e.id + '"]').animate({ top: e.top + 'px'}, 500);
        });

        bricks.forEach(function (e, i){
            $('.brick[data-id="' + e.id + '"]')
                .animate({
                    left: e.left + 'px'
                },
                1000,function (){
                    if(i == bricks.length - 1){
                        showGamePanel();
                    }
                });
        });
    });
}

/**
 * mouvement de la raquette
 */
function drawRacket (e) {
    if (gameRefresh != undefined){
        racket.left = Math.min(playfieldWidth - racket.width, Math.max(2, e.offsetX));
        $('.racket').css('left', racket.left + 'px');
    }
}

/**
 * 
 */

                                /* affichage message */


/**
 * affichage du level
 */
function showCurrentLevel(){
    $('.lblCurrentLevel').text('Niveau' + (curLevel + 1))
                         .css('opacity', 1)
                         .animate({ opacity: 0}, 3000);
}


/**
 * function message au debut du jeu 
 */
function gameMessage(title, messageText, messageButton, buttonFunction){
    $('body').append('<div class="messageBox"><label class="lblMessageTitle">' 
        + title + '</label><label class="lblMessage">'
        + messageText + '</label><button class="btnMessage"> '
        + messageButton + '</button></div>');
    
    $('.btnMessage').on ('click', buttonFunction);
}

/**
 * texte pour le message accueil
 */
function showGamePanel(){
    gameMessage("Casse-Briques","Un petit jeu de raquette simple, mais trop plaisant...",
                "Cliquez pour Jouer", stargame);
}

/**
 * efface le message d'accueil
 */
function cleanMessage() {
    $('.btnMessage').off();
    $('.messageBox').remove();
}

/**
 * affiche le score quand la brique est enlevée
 */
function showBrickScore(theBrick, thePoints){
    playerScore += thePoints;
    $('.playfield')
        .append('<label class="lblBrickScore" data-id="' + theBrick.id + '">'
        + thePoints + '</label>');
    $('.lblBrickScore[data-id="' + theBrick.id + '"]')
        .css({ top: (theBrick.top + 10) + 'px',
               left: (theBrick.left + 36) + 'px'
            });
    $('.lblBrickScore[data-id="' + theBrick.id + '"]')
        .animate({ top: (theBrick.top - 20) + 'px',
                   opacity: 0 },
                   1000,
                   function (){
                       $(this).remove();
                   });
}

/**
 * affiche le score totale
 */
function showPlayerScore(){
    $('.lblPlayerScore').text('Score :' + playerScore);
}






/*
function bonusGame(){
    setInterval(addBall,5000);
}*/