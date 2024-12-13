
// JE PRÉCISE QU'IL FAUT BIEN CLIQUER SUR INTRO.HTML EN PREMIER POUR PROFITER DE L'EXPERIENCE COMPLÈTE 
// ( ça rendais mieux de faire un deuxième fichier html que de tous mettre sur la même page)


const canvas = document.getElementById('c');
const c = canvas.getContext('2d');

canvas.height = 700;
canvas.width = 800;

//font
c.font = '40px Impact'


let NbreViesJoueur = 1

// sélection des éléments html 

const score = document.querySelector('.score')
const vies = document.querySelector('.vies')
const button = document.querySelector('.button')

const musique = new Audio('./intro/effets son/maxwell-theme.mp3')
const miaouDOULEU = new Audio ('./intro/effets son/meowrgh.mp3')
const LeJoueurEstTouche = new Audio ('intro/effets son/sfx_taunt.mp3')
const LeJoueurAPerduIlEstNul = new Audio ('./intro/effets son/sad-meow-song.mp3')


// variables globales (points de vies et le score)
let scoreP = 0
let PointsDeVIes = 3






// taille du canvas et couleur de fond
c.fillStyle = 'white';
c.fillRect(0, 0, canvas.width, canvas.height);

// variable contenant un objet qui permet d'accéder a l'état des touches
const keys = {
    a: { pressed: false },
    d: { pressed: false },
    w: { pressed: false },
    s: { pressed: false },
    e: { pressed: false },
};


// classe Ennemi
class Ennemi {
    constructor(position, velocity) {
        this.position = position;
        this.velocity = velocity;
        this.height = 50;
        this.width = 50;
        this.ImageWidth = 512,
        this.ImageHeight = 512,
        this.Image = new Image()
        this.Image.src = 'intro/images/chat pas content.png'
    }
    // permet de dessiner l'ennemi
    drawEnnemi() {
        
        c.drawImage(this.Image,0,0,this.ImageWidth,this.ImageHeight,this.position.x,this.position.y,50,50);
    }
    // update la position de l'ennemi
    update() {
        this.drawEnnemi();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        // is la position en x de l'ennemi est inferieure ou égale a 0 ou que le poition en x de l'ennemi plus sa largeur est plus grande ou égale 
        // a la largeur du canvas  la vélocité en x de l'ennemi est réduite a -1
        if (this.position.x <= 0 || this.position.x + this.width >= canvas.width) {
            this.velocity.x *= -1;
        }
        // même chose que en haut mais avec la position y 
        if (this.position.y <= 0 || this.position.y + this.height >= canvas.height) {
            this.velocity.y *= -1;
        }
    }
}

// classe joueur 
class Joueur {
    constructor({ position, velocity }) {
        this.position = position; // Position initiale du joueur
        this.velocity = velocity; // Vitesse ou mouvement du joueur
        this.width = 70;          // Largeur d'affichage sur le canvas
        this.height = 70;         // Hauteur d'affichage sur le canvas
        this.invincible = false;  // permet de savoir si le joueur a été touché pour le rendre invincible pour un bref instant
        this.invincibleTimer = 0  // permet de donner un temps limité a l'invincibilité
        
        // Dimensions de chaque frame de la sprite sheet
        this.frameWidth = 133.5;  // Largeur d'une case (la largeur de l'image / 4)
        this.frameHeight = 199.75; // Hauteur d'une case (la hauteur de l'image/ 4)

        this.frameIndex = 0;       // Index de la frame actuelle (colonne)
        this.animationRow = 0;     // Ligne d'animation actuelle (direction)
        this.frameCounter = 0;     // Compteur pour ajuster la vitesse d'animation
        this.frameSpeed = 10;      // Vitesse de changement de frame (plus élevé = plus lent)

              
        this.attackbox = {
            x: this.position.x, // permet de définir la position de l'attackbox ( dans le jeu elle est dessiné a la position x et y du 
            // joueur donc en haut a gauche)
            y: this.position.y,
            width: 70, 
            height: this.height,
        },

        this.Lastkey = null;
    


        // Sprite sheet du joueur 
        this.Image = new Image();
        this.Image.src = 'intro/images/personnage_spritesheet.png'; 

       
    }

    draw() {
        // permet de dessiner le joueur sur le canvas grâce a draw Image, ( j'utilise la version avec 9 arguments pour animer la sprite sheet)
        c.drawImage(
            this.Image,                                
            this.frameIndex * this.frameWidth,        
            this.animationRow * this.frameHeight,     // Ligne actuelle
            this.frameWidth,                          // Largeur d'une frame
            this.frameHeight,                         // Hauteur d'une frame
            this.position.x,                          // Position sur le canvas
            this.position.y,
            this.width,                               // Largeur affichée sur le canvas
            this.height                               // Hauteur affichée sur le canvas
        );
              
        // dessiner l'attack box si la touche e est pressé
        if (keys.e.pressed) {
            c.fillStyle = 'orange';
            c.fillRect(this.attackbox.x, this.attackbox.y, this.attackbox.width, this.attackbox.height);
        }
    


    }
        // permet d'update la position du joueur et de l'attackbox en fonction des touches appuyée 
    update() {
        //Cela vérifie si la touche pressée est w ou s . Si la condition est vraie, la valeur 70 
        //est assignée à this.attackbox.width et this.attackbox.height. c'est un ami programmeur qui m'a montré l'opérateur '?')
        //je l'utilise parce que je trouve la sythaxe jolie :) 
        this.draw();
        this.attackbox.width = this.Lastkey === 'w' || this.Lastkey === 's' ? 70 : 70;
        this.attackbox.height = this.Lastkey === 'w' || this.Lastkey === 's' ? 70 : 70;
        
        if (this.Lastkey === 'd') {
            this.attackbox.x = this.position.x + this.width; 
            this.attackbox.y = this.position.y;
        } else if (this.Lastkey === 'a') {
            this.attackbox.x = this.position.x - this.attackbox.width; 
            this.attackbox.y = this.position.y;
        } else if (this.Lastkey === 'w') {
            this.attackbox.x = this.position.x;
            this.attackbox.y = this.position.y - this.attackbox.height; 
        } else if (this.Lastkey === 's') {
            this.attackbox.x = this.position.x;
            this.attackbox.y = this.position.y + this.height;
        }

        // Incrémenter le compteur pour animer
        this.frameCounter++;
        if (this.frameCounter >= this.frameSpeed) {
            this.frameIndex = (this.frameIndex + 1) % 4; // Boucle entre 0 et 3 (4 colonnes)
            this.frameCounter = 0;
        }

        // Gérer les directions et définir la ligne d'animation
        if (keys.d.pressed && this.position.x + this.width < canvas.width) {
            this.velocity.x = 5;
            this.Lastkey = 'd';
            this.animationRow = 3; 
        } else if (keys.a.pressed && this.position.x > 0) {
            this.velocity.x = -5;
            this.Lastkey = 'a';
            this.animationRow = 2; 
        } else {
            this.velocity.x = 0;
        }

        if (keys.w.pressed && this.position.y > 0) {
            this.velocity.y = -5;
            this.Lastkey = 'w';
            this.animationRow = 1; 
        } else if (keys.s.pressed && this.position.y + this.height < canvas.height) {
            this.velocity.y = 5;
            this.Lastkey = 's';
            this.animationRow = 0; 
        } else {
            this.velocity.y = 0;
        }

        // Mettre à jour la position
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}


// les addEventListenr 
window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = true;
            Player.Lastkey = 'd';
            break;
        case 'a':
            keys.a.pressed = true;
            Player.Lastkey = 'a';
            break;
        case 'w':
            keys.w.pressed = true;
            Player.Lastkey = 'w';
            break;
        case 's':
            keys.s.pressed = true;
            Player.Lastkey = 's';
            break;
        case 'e':
            keys.e.pressed = true;
            break;
    }
});

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;
        case 'w':
            keys.w.pressed = false;
            break;
        case 's':
            keys.s.pressed = false;
            break;
        case 'e':
            keys.e.pressed = false;
            break;
    }
});

// ennemis 
let ennemis = [
    new Ennemi(
        { x: Math.random() * 600, y: Math.random() * 600 }, 
        { x: 2, y: 2 }
    )
];


// fonction annimer 
function animate() {
    window.requestAnimationFrame(animate);

    c.fillStyle = 'white';
    c.fillRect(0, 0, canvas.width, canvas.height);

    Player.update();

    ennemis.forEach((ennemi, index) => {
        ennemi.update();


        // permet de détecter l'invincibilité et si le joueur a été touché
        if (!Player.invincible && detectCollisionPlayer(ennemi)) {
            // Active l'invincibilité et définit un timer pour la durée
            Player.invincible = true;
            Player.invincibleTimer = 2000; 
            Player.position = { x: 350, y: 350 };
            Player.velocity = { x: 0, y: 0 };
            LeJoueurEstTouche.play()

    
            
            vies.textContent = 'vies :' +PointsDeVIes;
            // Mise à jour des vies
            PointsDeVIes -= 1;
            vies.textContent = 'vies :' +PointsDeVIes;

            // Vérifie si le joueur a perdu
            if (PointsDeVIes < 0) {
                musique.pause()
                LeJoueurAPerduIlEstNul.play()
                alert('les chats ont détruit votre village :3 ');
                resetGame();
            }

           

            // Fin de l'invincibilité après 2 secondes
            setTimeout(() => {
                Player.invincible = false;
            }, Player.invincibleTimer);
        }

        if (keys.e.pressed && detectCollision(Player, ennemi)) {
            // Enlever l'ennemi et ajouter du score
            ennemis.splice(index, 1);
            scoreP += 30;
            score.textContent = 'score:' + scoreP;
            
            miaouDOULEU.play()

            // Réinitialiser les ennemis
            ennemis.push(
                new Ennemi(
                    { x: Math.random() * 700, y: Math.random() * 700 },
                    { x: Math.random() * 4 - 2, y: Math.random() * 4 - 2 }
                ),
                new Ennemi(
                    { x: Math.random() * 700, y: Math.random() * 700 },
                    { x: Math.random() * 4 - 2, y: Math.random() * 4 - 2 }
                )
            );
        }
    });
}

// Fonction pour réinitialiser l'état du jeu. je sait que reload la page en entier c'est pas le plus optimal :(
function resetGame() {
    PointsDeVIes = 3;
    vies.textContent = PointsDeVIes;
    keys.a.pressed = false;
    keys.d.pressed = false;
    keys.s.pressed = false;
    keys.w.pressed = false;
    keys.e.pressed = false;
    location.reload();
}


// toutes les fonction pour détecter les collision 
function detectCollisionPlayer(ennemi) {
    return (
        Player.position.x < ennemi.position.x + ennemi.width &&
        Player.position.x + 50 > ennemi.position.x &&
        Player.position.y < ennemi.position.y + ennemi.height &&
        Player.position.y + 50 > ennemi.position.y
    );
}

function detectCollision(player, ennemi) {
    return (
        player.attackbox.x < ennemi.position.x + ennemi.width &&
        player.attackbox.x + player.attackbox.width > ennemi.position.x &&
        player.attackbox.y < ennemi.position.y + ennemi.height &&
        player.attackbox.y + player.attackbox.height > ennemi.position.y
    );
}

button.addEventListener('click', () => {
    animate();
    musique.play()
});



const Player = new Joueur({
    position: { x: 350, y: 350 },
    velocity: { x: 0, y: 0 },
});


// franchement c'est vraiment un super jeu j'espère avoir 101% tellement il est bien :3 
