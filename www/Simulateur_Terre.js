import * as THREE from 'https://esm.sh/three@0.160.0';
import { OrbitControls } from 'https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js';

// --- Configuration ---
const CONFIG = {
    tilt: 23.5 * (Math.PI / 180), // Conversion en radians
    rotationSpeed: 0.005,
    // Utilisation de la même source fiable que le simulateur 3D pour la texture
    textureUrl: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
    sunDistance: 8 // Distance de la lumière pour la visualisation
};

// --- Variables Globales ---
let scene, camera, renderer, controls;
let earthMesh, earthGroup, sunLight;
let axisHelper, markersGroup, orbitGroup;

// --- Variables Temporelles ---
let simulatedDate = new Date();
let timeSpeed = 0; // Vitesse de défilement (jours par frame)

// --- Éléments UI ---
const dateInput = document.getElementById('date-input');
const dateDisplay = document.getElementById('date-display');
const speedSlider = document.getElementById('speed-slider');
const speedDisplay = document.getElementById('speed-display');

init();
animate();

function init() {
    // 1. Scène
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050510); // Fond spatial sombre

    // 2. Caméra
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 6); // Face à la Terre

    // 3. Rendu
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);

    // 4. Contrôles (Orbit)
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 1.5;
    controls.maxDistance = 20;

    // 5. Création de la Terre
    createEarth();
    createStars();

    // 6. Lumière (Le Soleil)
    sunLight = new THREE.DirectionalLight(0xffffff, 2.5);
    sunLight.position.set(CONFIG.sunDistance, 0, 0); 
    scene.add(sunLight);

    // Représentation visuelle de l'orbite et du Soleil
    createSunVisuals();

    // Lumière ambiante faible (pour voir la face nuit légèrement)
    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);

    // Gestion du redimensionnement
    window.addEventListener('resize', onWindowResize);

    // --- Gestion de l'UI ---
    updateDateDisplay();

    speedSlider.addEventListener('input', (e) => { 
        timeSpeed = parseFloat(e.target.value);
        speedDisplay.innerText = timeSpeed === 0 ? "Pause" : timeSpeed + " j/frame";
    });

    // Boutons Zoom
    document.getElementById('zoom-in-btn').addEventListener('click', () => {
        const dist = camera.position.distanceTo(controls.target);
        const newDist = dist / 1.3;
        const direction = new THREE.Vector3().subVectors(camera.position, controls.target).normalize();
        camera.position.copy(controls.target).addScaledVector(direction, Math.max(newDist, controls.minDistance));
    });
    document.getElementById('zoom-out-btn').addEventListener('click', () => {
        const dist = camera.position.distanceTo(controls.target);
        const newDist = dist * 1.3;
        const direction = new THREE.Vector3().subVectors(camera.position, controls.target).normalize();
        camera.position.copy(controls.target).addScaledVector(direction, Math.min(newDist, controls.maxDistance));
    });

    // Toggles
    document.getElementById('toggle-markers').addEventListener('change', (e) => { markersGroup.visible = e.target.checked; });
    document.getElementById('toggle-orbit').addEventListener('change', (e) => { orbitGroup.visible = e.target.checked; });
    document.getElementById('toggle-axis').addEventListener('change', (e) => { axisHelper.visible = e.target.checked; });

    // Toggle UI
    const toggleUiBtn = document.getElementById('toggle-ui-btn');
    const uiContent = document.getElementById('ui-content');
    toggleUiBtn.addEventListener('click', () => {
        if (uiContent.style.display === 'none') {
            uiContent.style.display = 'block'; toggleUiBtn.innerText = "👁️ Masquer l'interface";
        } else {
            uiContent.style.display = 'none'; toggleUiBtn.innerText = "👁️ Afficher les contrôles";
        }
    });

    // Initialisation du Calendrier
    initCalendar();
}

function createEarth() {
    // Groupe pour gérer l'inclinaison (Tilt)
    earthGroup = new THREE.Group();
    
    // Appliquer l'inclinaison de 23.5 degrés sur l'axe Z
    earthGroup.rotation.z = CONFIG.tilt; 
    
    scene.add(earthGroup);

    // Géométrie et Matériau
    const geometry = new THREE.SphereGeometry(1, 64, 64);
    const textureLoader = new THREE.TextureLoader();
    textureLoader.setCrossOrigin('anonymous');

    const material = new THREE.MeshStandardMaterial({
        color: 0x2233ff, // Bleu par défaut (sécurité si la texture ne charge pas)
        roughness: 0.8,
        metalness: 0.1,
    });

    textureLoader.load(CONFIG.textureUrl, (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        material.map = texture;
        material.needsUpdate = true;
        material.color.setHex(0xffffff); // On remet en blanc si la texture charge bien
    }, undefined, (err) => {
        console.warn("Erreur chargement texture Terre, utilisation couleur par défaut.", err);
    });

    earthMesh = new THREE.Mesh(geometry, material);
    earthGroup.add(earthMesh);

    // Axe de rotation visuel (Ligne rouge traversant les pôles)
    const axisGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, -1.5, 0),
        new THREE.Vector3(0, 1.5, 0)
    ]);
    const axisMat = new THREE.LineBasicMaterial({ color: 0xff0000 });
    axisHelper = new THREE.Line(axisGeo, axisMat);
    earthGroup.add(axisHelper);

    // Marqueurs géographiques (Équateur, Tropiques)
    createEarthMarkers();
}

function createStars() {
    const starGeo = new THREE.BufferGeometry();
    const starPos = [];
    for(let i=0; i<2000; i++) {
        const r = 50; // Loin derrière
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        starPos.push(r*Math.sin(phi)*Math.cos(theta), r*Math.sin(phi)*Math.sin(theta), r*Math.cos(phi));
    }
    starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starPos, 3));
    scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({color: 0xffffff, size: 0.1})));
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function createSunVisuals() {
    orbitGroup = new THREE.Group();
    scene.add(orbitGroup);

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
    const orbitMat = new THREE.LineBasicMaterial({ color: 0xffcc00, transparent: true, opacity: 0.3 });
    const orbitLine = new THREE.Line(orbitGeo, orbitMat);
    orbitGroup.add(orbitLine);

    // 2. Corps du Soleil (Sphère visuelle à l'emplacement de la lumière)
    const sunMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.3, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xffff00 })
    );
    sunLight.add(sunMesh); // Le mesh suivra automatiquement la lumière
}

function createEarthMarkers() {
    markersGroup = new THREE.Group();
    earthMesh.add(markersGroup);

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
    markersGroup.add(createLatLine(0, 0x4da8da));

    // Tropiques (+/- 23.5°) (Orange #ffaa00 - Couleur solaire)
    markersGroup.add(createLatLine(23.5, 0xffaa00, true)); // Cancer
    markersGroup.add(createLatLine(-23.5, 0xffaa00, true)); // Capricorne
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
        updateDateDisplay();
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

// --- LOGIQUE CALENDRIER (Identique au Simu 3D) ---
function updateDateDisplay() {
    dateInput.value = simulatedDate.toISOString().split('T')[0];
    dateDisplay.innerText = simulatedDate.toLocaleDateString('fr-FR');
}

let calDate = new Date();
function initCalendar() {
    document.getElementById('date-input').addEventListener('click', openCalendar);
    document.getElementById('today-btn').addEventListener('click', () => {
        simulatedDate = new Date();
        updateDateDisplay();
    });
    document.getElementById('cal-prev').onclick = () => { calDate.setUTCMonth(calDate.getUTCMonth() - 1); renderCalendar(); };
    document.getElementById('cal-next').onclick = () => { calDate.setUTCMonth(calDate.getUTCMonth() + 1); renderCalendar(); };
    document.getElementById('cal-close').onclick = closeCalendar;
    document.getElementById('calendar-overlay').onclick = closeCalendar;
}

function renderCalendar() {
    const grid = document.getElementById('custom-calendar-grid'); grid.innerHTML = '';
    const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
    const daysShort = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
    
    document.getElementById('cal-month-year').innerText = `${monthNames[calDate.getUTCMonth()]} ${calDate.getUTCFullYear()}`;
    daysShort.forEach(d => { const div = document.createElement('div'); div.className = 'calendar-day-header'; div.innerText = d; grid.appendChild(div); });

    const firstDay = new Date(Date.UTC(calDate.getUTCFullYear(), calDate.getUTCMonth(), 1));
    const lastDay = new Date(Date.UTC(calDate.getUTCFullYear(), calDate.getUTCMonth() + 1, 0));
    
    for(let i=0; i<firstDay.getUTCDay(); i++) { const div = document.createElement('div'); div.className = 'calendar-day empty'; grid.appendChild(div); }

    for(let i=1; i<=lastDay.getUTCDate(); i++) {
        const div = document.createElement('div'); div.className = 'calendar-day'; div.innerText = i;
        if (i === simulatedDate.getUTCDate() && calDate.getUTCMonth() === simulatedDate.getUTCMonth() && calDate.getUTCFullYear() === simulatedDate.getUTCFullYear()) div.classList.add('selected');
        div.onclick = () => {
            simulatedDate = new Date(Date.UTC(calDate.getUTCFullYear(), calDate.getUTCMonth(), i, 12, 0, 0));
            updateDateDisplay();
            closeCalendar();
        };
        grid.appendChild(div);
    }
}

function openCalendar() { 
    calDate = new Date(simulatedDate); 
    renderCalendar(); 
    document.getElementById('custom-calendar').style.display = 'block'; 
    document.getElementById('calendar-overlay').style.display = 'block'; 
}

function closeCalendar() { 
    document.getElementById('custom-calendar').style.display = 'none'; 
    document.getElementById('calendar-overlay').style.display = 'none'; 
}