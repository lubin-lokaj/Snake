// Fonction pour générer un nombre entier aléatoire
// Math.random() donne un nombre aléatoire entre 0 et 1
// (max - min + 1) -> calcul la plage. On va multiplier le nombre décimal générer par cette plage pour avoir un résultat qui rentre dans les clous
// On utilise Math.floor() pour arrondir (vers le bas), pour être sûr d'avoir un entier
// On additionne min à la fin pour s'assurer que le plage comment à min, pas à 0

// Exemple : min = 5, max = 10
//  max - min + 1 = 10 - 5 + 1 = 6
//  Math.floor(Math.random() * 6) = 0,1,2,3,4,5  -->  + 5 = 5,6,7,8,9,10
function nombreAleatoire(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Classe représentant une pomme dans le jeu
class Pomme {
    constructor() {
        this.position = []; // Position de la pomme sur la grille [x, y]
    }

    generer(serpent) {
        let x, y;
        do {
            // Génération aléatoire des coordonnées
            x = nombreAleatoire(0, 19);
            y = nombreAleatoire(0, 19);

            // On vérifie que la pomme n'apparaisse pas sur le serpent
            // serpent.corps contient toutes les cases occupées par le serpent
        } while (serpent.corps.some(c => c[0] === x && c[1] === y));

        this.position = [x, y];
    }
}

// Classe représentant le serpent
class Serpent {
    constructor(longueurInitiale, tailleGrille) {
        this.tailleGrille = tailleGrille; // taille de la grille
        this.corps = []; // tableau des cases occupées par le serpent

        // Initialisation du serpent horizontalement en haut à gauche
        for (let i = 0; i < longueurInitiale; i++) {
            this.corps.push([i, 0]); // [x, y]
        }

        this.direction = "droite"; // direction initiale
        this.growNextMove = false; // indique si le serpent doit grandir au prochain déplacement
    }

    // Retourne true si la pomme a été mangée
    avancer(pomme) {
        // Récupérer la tête actuelle
        let tete = this.corps[this.corps.length - 1];

        // Copier la tête pour créer la nouvelle position
        let nouvelleTete = [...tete];

        // Déterminer la nouvelle position selon la direction
        if (this.direction === "droite") nouvelleTete[0] += 1;
        else if (this.direction === "gauche") nouvelleTete[0] -= 1;
        else if (this.direction === "haut") nouvelleTete[1] -= 1;
        else if (this.direction === "bas") nouvelleTete[1] += 1;

        // Ajouter la nouvelle tête au corps
        this.corps.push(nouvelleTete);

        // Vérifier si le serpent mange la pomme
        let aMange = false;
        if (nouvelleTete[0] === pomme.position[0] && nouvelleTete[1] === pomme.position[1]) {
            this.growNextMove = true; // On va grandir, donc on ne retire pas la queue
            aMange = true;
        }

        // Retirer la dernière case si le serpent ne doit pas grandir
        if (!this.growNextMove) {
            this.corps.shift(); // queue retirée pour maintenir la longueur
        } else {
            // Si on a mangé, on garde la queue cette fois-ci
            this.growNextMove = false; // réinitialisation du flag pour le prochain tick
        }

        return aMange; // permet de gérer le score et régénérer la pomme dans le jeu
    }

    // Changer la direction
    changerDirection(nouvelleDirection) {
        const opposés = {
            droite: "gauche",
            gauche: "droite",
            haut: "bas",
            bas: "haut"
        };
        if (nouvelleDirection !== opposés[this.direction]) {
            this.direction = nouvelleDirection;
        }
    }

    // Vérifie si le serpent s'est mordu ou sort de la grille
    estMort() {
        const tete = this.corps[this.corps.length - 1];
        const [x, y] = tete;

        // Collision avec les murs
        if (x < 0 || x >= this.tailleGrille || y < 0 || y >= this.tailleGrille) return true;

        // Collision avec lui-même
        for (let i = 0; i < this.corps.length - 1; i++) {
            if (this.corps[i][0] === x && this.corps[i][1] === y) return true;
        }

        return false;
    }
}

class Jeu {
    constructor() {
        this.tailleGrille = 20;
        this.serpent = new Serpent(3, this.tailleGrille);
        this.pomme = new Pomme();
        this.pomme.generer(this.serpent);
        this.score = 0;
        this.vitesse = 200;
        this.intervalle = null;

        // Récupérer la grille dans le DOM
        this.zoneGrille = document.querySelector(".grille");

        // Générer 400 cases (20x20)
        for (let i = 0; i < this.tailleGrille * this.tailleGrille; i++) {
            const div = document.createElement("div");
            div.classList.add("case");
            this.zoneGrille.appendChild(div);
        }

        this.cases = Array.from(this.zoneGrille.children); // maintenant toutes les cases existent

        // Ajouter les écouteurs de touches
        document.addEventListener("keydown", (e) => this.touche(e));
    }

    // Méthode pour démarrer le jeu
    demarrer() {
        if (!this.intervalle) {
            this.intervalle = setInterval(() => this.bouger(), this.vitesse);
        }
    }

    // Méthode pour mettre en pause
    pause() {
        clearInterval(this.intervalle);
        this.intervalle = null;
    }

    // Méthode pour reset le jeu
    reset() {
        this.pause();
        this.serpent = new Serpent(3, this.tailleGrille);
        this.pomme.generer(this.serpent);
        this.score = 0;
        this.afficher();
    }

    // Méthode appelée à chaque "tick" pour faire avancer le serpent
    bouger() {
        const aMange = this.serpent.avancer(this.pomme);

        if (this.serpent.estMort()) {
            alert("Game Over ! Score : " + this.score);
            this.reset();
            return;
        }

        if (aMange) {
            this.score++;
            this.pomme.generer(this.serpent);
        }

        // Mettre à jour l'affichage du score
        document.getElementById("score").textContent = this.score;

        this.afficher();
    }

    // Gestion des touches
    touche(e) {
        if (e.key === "ArrowUp") this.serpent.changerDirection("haut");
        else if (e.key === "ArrowDown") this.serpent.changerDirection("bas");
        else if (e.key === "ArrowLeft") this.serpent.changerDirection("gauche");
        else if (e.key === "ArrowRight") this.serpent.changerDirection("droite");
    }

    // Méthode pour afficher le serpent et la pomme
    afficher() {
        // Tout nettoyer
        this.cases.forEach(c => c.style.backgroundColor = "#333");

        // Dessiner le serpent
        this.serpent.corps.forEach(([x, y]) => {
            const index = y * this.tailleGrille + x;
            if (this.cases[index]) this.cases[index].style.backgroundColor = "green";
        });

        // Dessiner la pomme
        const [px, py] = this.pomme.position;
        const indexPomme = py * this.tailleGrille + px;
        if (this.cases[indexPomme]) this.cases[indexPomme].style.backgroundColor = "red";
    }
}

// Créer le jeu
const jeu = new Jeu();

// Gestion des boutons
document.getElementById("start").addEventListener("click", () => jeu.demarrer());
document.getElementById("stop").addEventListener("click", () => jeu.pause());
document.getElementById("reset").addEventListener("click", () => jeu.reset());

// Afficher la grille initiale
jeu.afficher();
