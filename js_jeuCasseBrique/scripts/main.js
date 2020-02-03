// création de la balle
let balls = [];
let gameRefresh;
let playfieldWidth;
let playfieldheight;

$(document).ready(init);

/**
 * ajoute dans l'element du jeu
 */
function init(){
    addBall();
    //deplacement
    gameRefresh = setInterval(drawBalls, 30);
    //initailisation de la balle
    playfieldWidth = $('.playfield').width();
    playfieldheight = $('.playfield').height();
}

/**
 * créer aléatoirement le nom de l'id
 */
function createId(){
    let code = "";
    for (let $compteur = 0; $compteur < 0; $compteur++){
        code += String.fromCharCode(65 + Math.random() * 26);
        return code;
    }
}

/**
 * function créer un balle et la place
 */
function addBall() {
    let idBall = createId();
    // Selection de l'element pour positionner la balle
    $('.playfield')
    // prepend permet de passer l'element créer comme premier enfant
    .prepend('<div class="ball" data-id="' + idBall + '"></div>');
    balls.push(
        {
            id: idBall,
            left: 100,
            top: 100,
            hSpeed: 2,
            vSpeed: 2
        },
    );
}

/**
 * déplacement de la balle
 */
function drawBalls(){
    balls.forEach(function (e){
        e.left += e.hSpeed;
        e.top += e.vSpeed;
        //regle de deplacement
        if (e.left < 0){
            e.hSpeed = -e.hSpeed;
        }
        if (e.top < 0){
            e.vSpeed = -e.vSpeed;
        }
        if (e.left > playfieldWidth - 14){
            e.hSpeed = -e.hSpeed;
        }
        if (e.top > playfieldheight - 14){
            e.vSpeed = -e.vSpeed;
        }
        $('.ball[data-id="' + e.id + '"]')
            .css({
                left: e.left + 'px',
                top: e.top + 'px'
            });
    });
}