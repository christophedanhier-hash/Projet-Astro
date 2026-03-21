# 🔭 Analyse Fonctionnelle - Projet Astro

**Version du document** : 1.0 (Mars 2026)
**Objectif** : Décrire les fonctionnalités, les acteurs, les cas d'utilisation et les règles de gestion du point de vue de l'utilisateur de l'application "Projet Astro".

---

## 1. Acteurs et Objectifs

L'application s'adresse à un acteur principal :

*   **L'Observateur Amateur / Curieux du Ciel** : Un utilisateur souhaitant explorer le système solaire, comprendre les mouvements célestes et planifier des sessions d'observation astronomique avec ou sans instrument.

Ses objectifs principaux sont :
*   Savoir où se trouvent les planètes dans le ciel à un instant T.
*   Préparer une soirée d'observation en identifiant les cibles visibles et intéressantes.
*   Comprendre des concepts astronomiques (saisons, orbites, phases lunaires).
*   Accéder à des informations de base sur les corps célestes.

---

## 2. Périmètre Fonctionnel et Cas d'Utilisation

### 2.1. Cas d'Utilisation Principaux

| Cas d'Utilisation                               | Acteur                      | Description                                                                                                                              |
| ------------------------------------------------ | --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **Visualiser le Système Solaire**                | Observateur Amateur         | Afficher une représentation 2D ou 3D du système solaire avec les positions des astres.                                                   |
| **Voyager dans le Temps**                        | Observateur Amateur         | Changer la date de simulation (passé/futur) et la vitesse d'écoulement du temps pour observer la dynamique des orbites.                  |
| **Identifier et Suivre un Astre**                | Observateur Amateur         | Sélectionner un astre via un menu ou un clic pour centrer la vue sur lui et afficher ses informations.                                  |
| **Préparer une Soirée d'Observation**            | Observateur Amateur         | Utiliser les outils (visibilité locale, mode nuit, détection d'oppositions) pour planifier une session d'observation efficace.          |
| **Comprendre les Saisons Terrestres**            | Observateur Amateur         | Utiliser le simulateur Terre pour visualiser l'impact de l'inclinaison de l'axe sur l'ensoleillement et les saisons.                    |
| **Étudier les Phases de la Lune**                | Observateur Amateur         | Utiliser le module lunaire pour voir la phase actuelle de la Lune et comprendre les alignements Terre-Lune-Soleil (syzygies).          |
| **Consulter l'Application sans Réseau**          | Observateur Amateur         | Lancer et utiliser toutes les fonctionnalités de l'application sur un appareil mobile sans connexion internet.                         |

### 2.2. Liste des Fonctionnalités

*   **F1. Simulation Temporelle** : Permet de définir une date et une heure, et d'accélérer/ralentir le temps.
*   **F2. Rendu 2D & 3D** : Offre deux perspectives (vue de dessus et vue immersive).
*   **F3. Navigation par Caméra** : Inclut le zoom, la recherche et le suivi de cible.
*   **F4. Fiches d'Information** : Affiche un panneau avec les données physiques d'un astre sélectionné.
*   **F5. Calcul de Visibilité Locale** : Indique si un astre est au-dessus de l'horizon pour un lieu donné.
*   **F6. Détection de Phénomènes** : Signale visuellement les oppositions et les élongations maximales.
*   **F7. Mode Nuit** : Applique un filtre rouge à l'interface pour préserver la vision nocturne.
*   **F8. Options d'Affichage** : Permet d'afficher/masquer des aides visuelles (grille écliptique, ceintures d'astéroïdes).
*   **F9. Simulation Terre** : Module dédié à la visualisation des saisons et de l'inclinaison axiale.
*   **F10. Simulation Lune** : Module dédié aux phases lunaires.
*   **F11. Mode Hors-ligne** : Assure un fonctionnement complet sans connexion internet.

---

## 3. Entités et Données Manipulées

L'entité centrale du point de vue fonctionnel est l'**Astre**. Chaque astre est défini par un ensemble de données qui permettent de répondre aux besoins de l'utilisateur.

*   **Données d'Identification** : `name` (pour l'affichage et la recherche).
*   **Données Orbitales** : `a`, `e`, `period`, `baseAngle`, `omega`, `i`, `node`. Ces données sont la source de vérité pour la fonctionnalité **F1. Simulation Temporelle**. Elles ne sont pas directement visibles par l'utilisateur mais conditionnent la position de l'astre.
*   **Données Descriptives** : `info` (type, diamètre, masse, température). Elles sont affichées dans la fonctionnalité **F4. Fiches d'Information**.
*   **Données de Rendu** : `radius`, `color`, `tex`. Elles sont utilisées par la fonctionnalité **F2. Rendu 2D & 3D** pour représenter visuellement l'astre.
*   **Relations Structurelles** : `moons`. Permet de lier un satellite à sa planète (ex: la Lune à la Terre), fonctionnalité visible dans les simulateurs.

---

## 4. Règles de Gestion Fonctionnelles

Ce sont les principes qui gouvernent le comportement de l'application.

*   **RG-01 : Exactitude Positionnelle** - La position de tout astre doit être calculée selon les lois de la mécanique céleste (lois de Kepler) pour toute date fournie par l'utilisateur. Cette règle est fondamentale pour la crédibilité de la simulation.
*   **RG-02 : Référentiel Héliocentrique** - Par défaut, toutes les positions orbitales sont calculées par rapport au Soleil, qui est le centre du repère.
*   **RG-03 : Visibilité Géographique** - La visibilité d'un astre ("Visible" / "Sous l'horizon") doit être calculée par rapport à un point fixe sur Terre (Sombreffe, Belgique).
*   **RG-04 : Détection d'Alignement** - Un phénomène d'**opposition** est signalé si l'alignement Soleil-Terre-Planète externe est détecté. Une **élongation maximale** est signalée si l'angle Soleil-Terre-Planète interne est maximal.
*   **RG-05 : Autonomie des Données** - L'application ne doit effectuer aucun appel réseau pour obtenir des données orbitales ou des ressources graphiques. Toutes les données nécessaires aux calculs et à l'affichage doivent être embarquées.

---

## 5. Flux de Données Fonctionnel (Exemple : "Voir où sera Mars demain")

1.  **Input Utilisateur** : L'utilisateur interagit avec le widget "Calendrier" (**F1**) et sélectionne la date de demain.
2.  **Déclenchement du Calcul** : L'application détecte le changement de date.
3.  **Application des Règles** :
    *   Le moteur de calcul utilise la nouvelle date et les données orbitales de Mars (issues de l'entité **Astre**) pour appliquer la règle **RG-01**.
    *   La nouvelle position 3D de Mars est déterminée.
    *   Simultanément, la position de la Terre est recalculée.
    *   La règle **RG-03** est appliquée pour déterminer si, depuis Sombreffe, Mars est visible.
    *   La règle **RG-04** est appliquée pour vérifier si un alignement spécial (opposition) se produit.
4.  **Output / Mise à Jour de l'UI** :
    *   L'objet représentant Mars est déplacé à sa nouvelle position dans la vue 2D/3D (**F2**).
    *   Si l'utilisateur survole Mars, l'infobulle de visibilité (**F5**) est mise à jour.
    *   Si une opposition est détectée, un indicateur visuel apparaît (**F6**).

