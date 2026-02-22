# 🌌 Guide de l'Utilisateur - Projet Astro

Bienvenue dans votre suite d'outils d'exploration astronomique. Ce guide vous aidera à tirer le meilleur parti des différents simulateurs.

---

## 🏠 1. Page d'Accueil
La page principale (`index.html`) est votre centre de commande. Elle vous permet d'accéder rapidement aux trois simulateurs et à votre journal d'observation.

---

## 🔭 2. Simulateur 2D (Système Solaire)
Idéal pour une vue d'ensemble précise et l'étude des configurations planétaires.

### Navigation
- **Zoom** : Utilisez la molette de la souris, les boutons **🔍+ / 🔍-** ou pincez l'écran sur tablette/smartphone.
- **Sélection** : Cliquez sur un astre pour afficher sa fiche technique.
- **Suivi** : Utilisez le menu "Chercher un astre" pour verrouiller la vue sur une planète ou une lune.

### Fonctions Spéciales
- **Mode Nuit** : Active un filtre rouge pour préserver votre vision nocturne lors de vos observations réelles.
- **Indicateurs Astronomiques** : 
    - **Opposition** : Une ligne pointillée blanche apparaît quand une planète est alignée avec la Terre et le Soleil (moment idéal pour l'observation).
    - **Élongation** : Indique le meilleur moment pour observer Mercure et Vénus.
    - **Visibilité** : Le menu contextuel (tooltip) indique si l'astre est actuellement au-dessus de l'horizon à Sombreffe (Belgique).

---

## 🌌 3. Simulateur 3D (Immersion & Galaxie)
Une expérience immersive pour visualiser les orbites dans l'espace et notre position dans la Voie Lactée.

### Navigation
- **Rotation** : Clic gauche (ou un doigt) et glisser.
- **Panoramique** : Clic droit (ou deux doigts) et glisser.
- **Traînées (Trails)** : Les planètes laissent une trace de leur passage pour visualiser la forme réelle de leurs orbites elliptiques.

### Vue Galactique
- Cliquez sur **"Révéler la Galaxie"** pour dézoomer massivement et voir le Système Solaire au sein du Bras d'Orion dans la Voie Lactée.
- La transition est fluide et permet de comprendre l'échelle immense de notre galaxie.

---

## 🌑 4. Exploration Lunaire 3D
Outil dédié à l'étude du système Terre-Lune et des phénomènes d'alignement.

### Étude des Phases
- **Slider de Phase** : Déplacez manuellement le Soleil pour observer le cycle lunaire (Nouvelle Lune, Quartiers, Pleine Lune).
- **Auto-alignement** : Aligne instantanément le Soleil pour créer une Pleine Lune ou une Nouvelle Lune parfaite.
- **Suivi Temps Réel** : Le Soleil se synchronise sur la position de la Terre pour simuler l'évolution naturelle des phases.

### Phénomènes Physiques
- **Syzygie** : L'outil détecte l'alignement Terre-Lune-Soleil. En cas de conjonction parfaite, une **éclipse lunaire** est simulée (la Lune s'assombrit et devient rouge).
- **Force Gravitationnelle** : Activez la ligne bleue pour visualiser le lien invisible qui maintient la Lune en orbite.
- **Sites Lunaires** : Cliquez sur les marqueurs jaunes pour identifier les mers lunaires (ex: Mer de la Tranquillité).

---

## 📓 5. Carnet d'Observation
Un espace personnel pour consigner vos découvertes.
- Notez la date, la cible et les conditions météo.
- Prévu pour intégrer vos futures astrophotographies ou croquis réalisés à l'oculaire.

---

## ✨ 6. Astuces pour préparer une soirée réelle
Utilisez ces outils comme un véritable assistant de préparation :

- **Anticiper les cibles** : Utilisez le simulateur 2D pour repérer les planètes en **Opposition** (marquées par une ligne blanche). C'est le moment où elles sont au plus près de la Terre et visibles toute la nuit.
- **Vérifier la visibilité** : Avant de sortir le télescope, consultez l'infobulle (tooltip) en 2D ou 3D pour confirmer que l'astre est bien **"Visible dans le ciel"** (au-dessus de l'horizon à Sombreffe).
- **Planifier avec la Lune** : 
    - Pour observer les cratères, utilisez le simulateur lunaire pour trouver les soirs de **Quartier** et visez le "terminateur" (la limite jour/nuit).
    - Pour le ciel profond (galaxies, nébuleuses), privilégiez les nuits de **Nouvelle Lune** pour éviter la pollution lumineuse naturelle.
- **Préserver l'œil** : Une fois sur le terrain, activez le **Mode Nuit** (bouton 🔴) sur votre tablette ou smartphone pour ne pas être ébloui et garder votre vision nocturne intacte.
- **S'orienter** : Utilisez la vue 3D pour comprendre l'inclinaison des orbites et mieux anticiper la trajectoire des planètes le long de l'écliptique dans le ciel réel.

---

## 🛠️ 7. Conseils Techniques
- **Performance** : Les simulateurs utilisent WebGL (3D) et Canvas (2D). Pour une fluidité maximale, fermez les onglets inutiles de votre navigateur.
- **Mises à jour** : Le projet évolue régulièrement. N'hésitez pas à vider le cache de votre navigateur si une nouvelle fonctionnalité ne semble pas apparaître.

*(c) 2026 - Astro.TofDan.be*