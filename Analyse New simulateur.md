Analyse des Paramètres Orbitaux pour Simulation Astronomique
Ce document présente l'extraction et l'analyse des données techniques issues du diagramme orbital pour l'implémentation d'un moteur de simulation astronomique.
1. Constantes Fondamentales et Géométrie de l'Orbite
L'orbite terrestre est modélisée comme une ellipse dont le Soleil occupe l'un des foyers. Les valeurs extraites sont les suivantes :
Paramètre
Valeur extraite
Description technique
Aphélie
1,017 ua
Distance maximale entre la Terre et le Soleil.
Périhélie
0,983 ua
Distance minimale entre la Terre et le Soleil.
Obliquité (δ)
23,45°
Inclinaison de l'axe de rotation par rapport à la perpendiculaire au plan de l'écliptique.
Excentricité (e)
~ 0,017
Calculée via (Aphélie - Périhélie) / (Aphélie + Périhélie).

Note : La distance moyenne (demi-grand axe) est de 1,000 ua.
2. Événements Saisonniers et Positions Clés
Pour la simulation, les quatre points cardinaux de l'orbite sont définis par la position de l'axe de rotation terrestre relativement au flux solaire :
Solstice d'été (Hémisphère Nord) : La Terre est à l'Aphélie (distance max). L'hémisphère Sud connaît son hiver. L'inclinaison est maximale vers le Soleil pour le Nord.
Solstice d'hiver (Hémisphère Nord) : La Terre est au Périhélie (distance min). L'hémisphère Sud connaît son été.
Équinoxes (Printemps/Automne) : L'angle de déclinaison solaire est nul (δ = 0). La durée du jour est égale à celle de la nuit sur toute la planète.
3. Logique pour le Programme de Simulation
Pour coder cette simulation, les étapes suivantes sont recommandées :
// Variables de configuration
float semiMajorAxis = 1.0; 
float eccentricity = 0.017;
float axialTilt = 23.45;

// Calcul de la distance r en fonction de l'anomalie vraie (theta)
// r = a * (1 - e^2) / (1 + e * cos(theta))


Le sens de rotation de la Terre sur son orbite (révolution) et sur elle-même (rotation) s'effectue dans le sens inverse des aiguilles d'une montre (prograde) lorsqu'on regarde depuis le pôle Nord céleste.
