// Initialisation des variables utile
let balls = [];
let bricks = [];
let curLevel;
let racket;
let gameRefresh;
let playfieldWidth;
let playfieldheight;
let ballSize;

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
    gameRefresh = setInterval(drawBalls, 10);
    // met en mémoire la taille de la balle utile pour un bonus en ajout d'un bouton
    //ballSize = $('.ball:first').width();
    //setInterval(addBall,5000);
    // level
    
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
 * function créer un balle et la place
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
    return bricks.filter( function (f){
        return f.top + 34 > e.top && f.left <= e.left && f.left + 100 >= e.left + ballSize; 
    });
}

/**
 * touche brique
 */
function touchBrick(e, nearBricks){
    if (nearBricks.length > 0){
        // suprimer la brique
        $('.brick[data-id="' + nearBricks[0].id + '"]').remove();
        bricks.splice(bricks.indexOf(nearBricks[0]), 1);
        e.vSpeed = -e.vSpeed;
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
                        addBall();
                    }
                });
        });
    });
}

/**
 * affichage du level
 */
function showCurrentLevel(){
    $('.lblCurrentLevel').text('Niveau' + (curLevel + 1))
                         .css('opacity', 1)
                         .animate({ opacity: 0}, 3000);
}

/**
 * mouvement de la raquette
 */
function drawRacket (e) {
    racket.left = Math.min(playfieldWidth - racket.width, Math.max(2, e.offsetX));
    $('.racket').css('left', racket.left + 'px');
}