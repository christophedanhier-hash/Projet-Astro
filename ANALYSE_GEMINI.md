# 🌌 Analyse de la Logique Métier - Projet Astro

**Version de l'analyse** : Projet Astro v3.1 (Mars 2026)
**Objectif** : Décrire formellement les entités, les algorithmes de calcul astronomique et le flux de données de l'application.

---

## 1. Modèle de Données et Entités (`PLANETS_DATA`)

Le cœur du modèle de données repose sur un tableau d'entités centralisé décrivant les caractéristiques de chaque corps céleste. L'entité fondamentale est l'**Astre** (Planète, Étoile, Comète ou Satellite naturel).

Chaque entité possède trois groupes d'attributs distincts :

*   **Attributs Paramétriques (Paramètres Orbitaux Képlériens)** :
    *   `a` : Demi-grand axe (dimension de l'orbite).
    *   `e` : Excentricité orbitale (forme de l'orbite).
    *   `period` : Période de révolution (en jours). *Note : une période négative implique une orbite rétrograde (ex: Comète de Halley).*
    *   `baseAngle` : Anomalie moyenne à l'époque J2000.
    *   `omega` : Argument du périastre (en degrés).
    *   `i` : Inclinaison orbitale par rapport à l'écliptique (en degrés).
    *   `node` : Longitude du nœud ascendant (en degrés).
*   **Attributs Physiques & Descriptifs** :
    *   `name`, `radius`, `realDist`.
    *   `info` : Dictionnaire contenant des métadonnées pour l'UI (`type`, `diam`, `mass`, `temp`).
    *   `moons` : Sous-entités (relation de composition, ex: la Terre et sa Lune, Jupiter et Io/Europe).
*   **Attributs de Rendu** :
    *   `color` : Code couleur de repli (HEX).
    *   `tex` : Chemin vers la texture locale photoréaliste.

---

## 2. Règles de Calcul et Moteur Mathématique (`astro-logic.js`)

La logique métier est strictement découplée des interfaces de rendu (2D/3D). Elle repose sur la mécanique céleste classique.

*   **Référentiel Temporel (Époque J2000)** : Tous les calculs prennent pour origine la constante `J2000` (1er Janvier 2000 à 12:00 UTC). Le temps est la variable d'entrée principale, convertie en fraction de jours écoulés (`daysSinceJ2000`).
*   **Équation de Kepler (`solveKepler`)** : La résolution de l'anomalie excentrique ($E$) depuis l'anomalie moyenne ($M$) n'ayant pas de solution algébrique simple, le projet utilise la **méthode de Newton-Raphson**. Le choix de limiter à 5 itérations garantit un ratio optimal entre temps de calcul (60 FPS exigé) et précision astronomique.
*   **Positionnement Spatial 3D (`getOrbitalPosition`)** :
    1.  Calcul de l'anomalie moyenne $M$.
    2.  Résolution de $E$ via Newton-Raphson.
    3.  Calcul des coordonnées planes $P$ et $Q$ dans le plan orbital géométrique.
    4.  Application des matrices de rotation 3D complètes (inclinaison, argument du périastre, longitude du nœud) avec **conversion automatique des degrés (fournis dans le JSON) en radians**.

---

## 3. Flux de Données et Architecture

Le flux de données suit un modèle unidirectionnel, fortement optimisé pour l'exécution dans des boucles de rendu à haute fréquence (WebGL `requestAnimationFrame`).

### A. Flux d'Interaction (Input)
1.  **Utilisateur** : Modifie la temporalité (via le calendrier `initCalendar` de `ui-utils.js` ou l'accélérateur de temps) ou la caméra (zoom/focus).
2.  **État Global** : La variable du temps simulé est mise à jour.

### B. Boucle de Mise à Jour (Update)
1.  Le moteur calcule le delta $t$ (`daysSinceJ2000`).
2.  Pour chaque entité dans `PLANETS_DATA`, la fonction `getOrbitalPosition` est appelée.
3.  Les coordonnées résultantes $(x, y, z)$ sont retournées.

### C. Boucle de Rendu (Render)
1.  **Rendu Spécifique** :
    *   *Simulateur 2D* : Écrase la coordonnée $Z$, applique une échelle, et dessine sur le `CanvasRenderingContext2D`. Gère également les lignes d'opposition et de visibilité locale.
    *   *Simulateur 3D* : Met à jour les positions des `THREE.Mesh`. Remarque architecturale : les vecteurs (`THREE.Vector3`) sont pré-alloués et modifiés par référence pour éviter le déclenchement du Garbage Collector au milieu de la frame.
2.  **Gestion des Assets (`TextureCache`)** : Le chargeur intercepte la demande de texture des astres. Si elle est en cache RAM, la réponse est synchrone (0 délai GPU). Sinon, le chargement asynchrone est lancé.

---

## 4. Stratégies "Clean Architecture" Observables

1.  **DRY (Don't Repeat Yourself)** : Extraction massive réussie avec `ui-utils.js` (gestion du calendrier, de la caméra, du contexte WebGL).
2.  **Gestion de la Mémoire** : Anticipation des crashs sur terminaux mobiles avec le `TextureCache.disposeAll()` et le listener `beforeunload` qui nettoie explicitement géométries, matériels et le `WebGLRenderer`.
3.  **Résilience Mobile (Offline First)** : Le moteur mathématique n'ayant besoin d'aucun appel API externe (éphémérides codées en dur), l'application Capacitor fonctionne parfaitement sans réseau, en accord avec l'objectif d'utilisation sur le terrain nocturne.