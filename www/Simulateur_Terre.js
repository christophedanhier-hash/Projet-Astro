import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// --- Configuration ---
const CONFIG = {
    tilt: 23.5 * (Math.PI / 180), // Conversion en radians
    rotationSpeed: 0.005,
    texturePath: 'assets/textures/earth_daymap.jpg', // Assure-toi d'avoir cette texture ou change le chemin
    sunDistance: 8 // Distance de la lumière pour la visualisation
};

// --- Variables Globales ---
let scene, camera, renderer, controls;
let earthMesh, earthGroup, sunLight;
let axisHelper;

// --- Variables Temporelles ---
let simulatedDate = new Date();
let timeSpeed = 0; // Vitesse de défilement (jours par frame)

init();
animate();

function init() {
    // 1. Scène
    const container = document.getElementById('scene-container');
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050510); // Fond spatial sombre

    // 2. Caméra
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 5); // Face à la Terre

    // 3. Rendu
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // 4. Contrôles (Orbit)
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 1.5;
    controls.maxDistance = 10;

    // 5. Création de la Terre
    createEarth();

    // 6. Lumière (Le Soleil)
    // Pour l'instant, lumière fixe venant de la droite (X+)
    sunLight = new THREE.DirectionalLight(0xffffff, 2.5);
    sunLight.position.set(CONFIG.sunDistance, 0, 0); 
    scene.add(sunLight);

    // AJOUT : Représentation visuelle de l'orbite et du Soleil
    createSunVisuals();

    // Lumière ambiante faible (pour voir la face nuit légèrement)
    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);

    // 7. Helpers (Visuels)
    // Grille écliptique (Plan horizontal)
    const gridHelper = new THREE.GridHelper(10, 10, 0x444444, 0x222222);
    scene.add(gridHelper);

    // Gestion du redimensionnement
    window.addEventListener('resize', onWindowResize);

    // --- Gestion de l'UI ---
    const dateInput = document.getElementById('date-input');
    const speedSlider = document.getElementById('speed-slider');
    const speedVal = document.getElementById('speed-val');

    // Initialisation date
    if (dateInput) dateInput.value = simulatedDate.toISOString().split('T')[0];

    if (dateInput) dateInput.addEventListener('change', (e) => { simulatedDate = new Date(e.target.value); });
    if (speedSlider) {
        speedSlider.addEventListener('input', (e) => { 
            timeSpeed = parseFloat(e.target.value);
            if (speedVal) speedVal.innerText = timeSpeed === 0 ? "Pause" : timeSpeed + " j/frame";
        });
    }
}

function createEarth() {
    // Groupe pour gérer l'inclinaison (Tilt)
    earthGroup = new THREE.Group();
    
    // Appliquer l'inclinaison de 23.5 degrés sur l'axe Z
    // La Terre penche vers la droite ou la gauche selon la saison, ici on fixe l'axe.
    earthGroup.rotation.z = CONFIG.tilt; 
    
    scene.add(earthGroup);

    // Géométrie et Matériau
    const geometry = new THREE.SphereGeometry(1, 64, 64);
    
    // Chargement texture (avec fallback couleur si pas d'image)
    const textureLoader = new THREE.TextureLoader();
    const material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.8,
        metalness: 0.1,
    });

    // Essai de chargement de texture
    textureLoader.load(CONFIG.texturePath, (texture) => {
        material.map = texture;
        material.needsUpdate = true;
    }, undefined, (err) => {
        console.warn("Texture Terre non trouvée, utilisation mode filaire/couleur.", err);
        material.wireframe = false;
        material.color.setHex(0x2233ff); // Terre bleue par défaut
    });

    earthMesh = new THREE.Mesh(geometry, material);
    earthGroup.add(earthMesh);

    // Axe de rotation visuel (Ligne rouge traversant les pôles)
    // On l'ajoute au groupe pour qu'il soit aussi incliné
    const axisGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, -1.5, 0),
        new THREE.Vector3(0, 1.5, 0)
    ]);
    const axisMat = new THREE.LineBasicMaterial({ color: 0xff0000 });
    axisHelper = new THREE.Line(axisGeo, axisMat);
    earthGroup.add(axisHelper);

    // AJOUT : Marqueurs géographiques (Équateur, Tropiques)
    createEarthMarkers();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function createSunVisuals() {
    // 1. Ligne de l'orbite (Écliptique)
    const orbitGeo = new THREE.BufferGeometry();
    const points = [];
    const steps = 128;
    for (let i = 0; i <= steps; i++) {
        const theta = (i / steps) * Math.PI * 2;
        points.push(new THREE.Vector3(
            Math.cos(theta) * CONFIG.sunDistance,
            0,
            Math.sin(theta) * CONFIG.sunDistance
        ));
    }
    orbitGeo.setFromPoints(points);
    // Jaune pâle transparent pour ne pas surcharger la vue
    const orbitMat = new THREE.LineBasicMaterial({ color: 0xffcc00, transparent: true, opacity: 0.3 });
    const orbitLine = new THREE.Line(orbitGeo, orbitMat);
    scene.add(orbitLine);

    // 2. Corps du Soleil (Sphère visuelle à l'emplacement de la lumière)
    const sunMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.3, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xffff00 })
    );
    sunLight.add(sunMesh); // Le mesh suivra automatiquement la lumière
}

function createEarthMarkers() {
    const rad = 1.01; // Légèrement au-dessus de la surface pour éviter le z-fighting
    
    // Fonction utilitaire pour créer un cercle de latitude
    function createLatLine(latDeg, color, isDashed = false) {
        const latRad = latDeg * (Math.PI / 180);
        const r = Math.cos(latRad) * rad;
        const y = Math.sin(latRad) * rad;
        
        const points = [];
        const segments = 64;
        for(let i=0; i<=segments; i++) {
            const theta = (i/segments) * Math.PI * 2;
            points.push(new THREE.Vector3(Math.cos(theta)*r, y, Math.sin(theta)*r));
        }
        const geo = new THREE.BufferGeometry().setFromPoints(points);
        const mat = isDashed 
            ? new THREE.LineDashedMaterial({ color: color, dashSize: 0.1, gapSize: 0.05, transparent: true, opacity: 0.8 })
            : new THREE.LineBasicMaterial({ color: color, transparent: true, opacity: 0.6 });
        
        const line = new THREE.Line(geo, mat);
        if (isDashed) line.computeLineDistances();
        return line;
    }

    // Équateur (Cyan #4da8da - Couleur UI principale)
    earthMesh.add(createLatLine(0, 0x4da8da));

    // Tropiques (+/- 23.5°) (Orange #ffaa00 - Couleur solaire)
    earthMesh.add(createLatLine(23.5, 0xffaa00, true)); // Cancer
    earthMesh.add(createLatLine(-23.5, 0xffaa00, true)); // Capricorne
}

function getSunPosition(date) {
    // Calcul simplifié de la position du Soleil sur l'écliptique
    const start = new Date(Date.UTC(2000, 0, 1, 12, 0, 0));
    const days = (date - start) / 86400000;
    
    const L = (280.460 + 0.9856474 * days) % 360;
    const g = (357.528 + 0.9856003 * days) % 360;
    const radG = g * (Math.PI / 180);
    const lambda = L + 1.915 * Math.sin(radG) + 0.020 * Math.sin(2 * radG);
    const radLambda = lambda * (Math.PI / 180);

    const x = Math.cos(radLambda) * CONFIG.sunDistance;
    const z = Math.sin(radLambda) * CONFIG.sunDistance;

    return { x, z, lambda: lambda % 360 };
}

function animate() {
    requestAnimationFrame(animate);

    // Avancement du temps
    if (timeSpeed > 0) {
        simulatedDate.setTime(simulatedDate.getTime() + (timeSpeed * 86400000));
        const dInput = document.getElementById('date-input');
        if (dInput) dInput.value = simulatedDate.toISOString().split('T')[0];
    }

    // Rotation de la Terre sur elle-même (Cycle Jour/Nuit)
    if (earthMesh) {
        earthMesh.rotation.y += CONFIG.rotationSpeed;
    }

    // Mise à jour position Soleil
    const sunPos = getSunPosition(simulatedDate);
    sunLight.position.set(sunPos.x, 0, -sunPos.z);

    controls.update();
    renderer.render(scene, camera);
    updateUI(sunPos.lambda);
}

function updateUI(lambda) {
    const sunAngleDisplay = document.getElementById('sun-angle');
    const saisonDisplay = document.getElementById('saison-display');
    
    // Détermination de la saison (Approximation Hémisphère Nord)
    let saison = "";
    if (lambda >= 330 || lambda < 60) saison = "Hiver ❄️ / Printemps 🌱";
    else if (lambda >= 60 && lambda < 150) saison = "Printemps 🌱 / Été ☀️";
    else if (lambda >= 150 && lambda < 240) saison = "Été ☀️ / Automne 🍂";
    else saison = "Automne 🍂 / Hiver ❄️";

    if(saisonDisplay) saisonDisplay.innerText = saison;
    if(sunAngleDisplay) sunAngleDisplay.innerText = `Long. Écliptique : ${Math.round(lambda)}°`;
}