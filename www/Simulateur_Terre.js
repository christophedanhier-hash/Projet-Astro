import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// --- Configuration ---
const CONFIG = {
    tilt: 23.5 * (Math.PI / 180), // Conversion en radians
    rotationSpeed: 0.005,
    texturePath: 'assets/textures/earth_daymap.jpg' // Assure-toi d'avoir cette texture ou change le chemin
};

// --- Variables Globales ---
let scene, camera, renderer, controls;
let earthMesh, earthGroup, sunLight;
let axisHelper;

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
    sunLight.position.set(5, 0, 0); 
    scene.add(sunLight);

    // Lumière ambiante faible (pour voir la face nuit légèrement)
    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);

    // 7. Helpers (Visuels)
    // Grille écliptique (Plan horizontal)
    const gridHelper = new THREE.GridHelper(10, 10, 0x444444, 0x222222);
    scene.add(gridHelper);

    // Gestion du redimensionnement
    window.addEventListener('resize', onWindowResize);
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
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    // Rotation de la Terre sur elle-même (Cycle Jour/Nuit)
    if (earthMesh) {
        earthMesh.rotation.y += CONFIG.rotationSpeed;
    }

    controls.update();
    renderer.render(scene, camera);
    updateUI();
}

function updateUI() {
    // Ici nous calculerons plus tard l'angle du soleil pour déterminer la saison
    // Pour l'instant, c'est statique.
    const sunAngleDisplay = document.getElementById('sun-angle');
    if(sunAngleDisplay) {
        // Exemple simple : position de la lumière
        sunAngleDisplay.innerText = "Soleil à l'Est (Fixe)";
    }
}