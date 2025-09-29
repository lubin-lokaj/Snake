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


// Class représentant une pomme dans le jeu
class Pomme {
    constructor(){
        this.position = [] // Position de la pomme sur la grille
    }

    generer() {
        // Génération aléatoire des coordonnées
        let x = nombreAleatoire(0, 19)
        let y = nombreAleatoire(0, 19)

        // Les coordonnées générés aléatoirement sont définis comme étant ceux de la pomme
        this.position = [x, y]
    }
}