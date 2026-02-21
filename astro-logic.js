export const J2000 = new Date('2000-01-01T12:00:00Z');

export function getOrbitalPosition(a, e, period, baseAngle, omega, daysSinceJ2000) {
    let M = baseAngle + (daysSinceJ2000 / period) * Math.PI * 2;
    let angle = M + 2 * e * Math.sin(M); 
    const c = a * e, b = a * Math.sqrt(1 - e*e);
    let localX = -c + a * Math.cos(angle), localY = b * Math.sin(angle);
    return {
        x: localX * Math.cos(omega) - localY * Math.sin(omega),
        y: localX * Math.sin(omega) + localY * Math.cos(omega)
    };
}

export const PLANETS_DATA = [
    { name: "Soleil", color: "#ffcc00", radius: 25, a: 0, e: 0, period: 1, baseAngle: 0, omega: 0, realDist: "0 UA", tex: null,
      info: { type: "Étoile", diam: "1 392 700 km", mass: "333 000 x Terre", temp: "~5 500 °C" } },
    { name: "Mercure", color: "#b0b0b0", radius: 3, a: 50, e: 0.205, period: 88, baseAngle: 4.4, omega: 0.5, realDist: "0.39 UA", tex: 'mercurymap.jpg',
      info: { type: "Planète tellurique", diam: "4 879 km", mass: "0,055 x Terre", temp: "-173 à 427 °C" } },
    { name: "Vénus", color: "#e3bb76", radius: 6, a: 85, e: 0.007, period: 224.7, baseAngle: 3.17, omega: 1.3, realDist: "0.72 UA", tex: 'venusmap.jpg',
      info: { type: "Planète tellurique", diam: "12 104 km", mass: "0,815 x Terre", temp: "~462 °C" } },
    { name: "Terre", color: "#4b90d1", radius: 7, a: 130, e: 0.017, period: 365.25, baseAngle: 1.75, omega: 0, realDist: "1.00 UA", tex: 'earth_atmos_2048.jpg',
      info: { type: "Planète tellurique", diam: "12 742 km", mass: "1 x Terre", temp: "~15 °C" },
      moons: [{ name: "Lune", radius: 1.5, dist: 14, period: 27.3, baseAngle: 0, color: "#aaaaaa", tex: 'moon_1024.jpg', info: { type: "Satellite naturel", diam: "3 474 km", mass: "0,012 x Terre", temp: "-173 à 127 °C" } }] },
    { name: "Mars", color: "#c1440e", radius: 4, a: 180, e: 0.094, period: 687, baseAngle: 6.20, omega: 5.0, realDist: "1.52 UA", tex: 'mars_1k_color.jpg',
      info: { type: "Planète tellurique", diam: "6 779 km", mass: "0,107 x Terre", temp: "~ -63 °C" } },
    { name: "Jupiter", color: "#d39c7e", radius: 16, a: 320, e: 0.049, period: 4332, baseAngle: 0.59, omega: 0.2, realDist: "5.20 UA", tex: 'jupitermap.jpg',
      info: { type: "Géante gazeuse", diam: "139 820 km", mass: "318 x Terre", temp: "-110 °C" },
      moons: [{ name: "Io", radius: 1.2, dist: 22, period: 1.7, baseAngle: 1, color: "#ffffaa", info: { type: "Satellite volcanique", diam: "3 642 km", mass: "0,015 x Terre", temp: "-130 °C" } },
              { name: "Europe", radius: 1, dist: 28, period: 3.5, baseAngle: 2, color: "#aaddff", info: { type: "Satellite glacé", diam: "3 121 km", mass: "0,008 x Terre", temp: "-160 °C" } }] },
    { name: "Saturne", color: "#e6d5a8", radius: 13, a: 460, e: 0.057, period: 10759, baseAngle: 0.87, omega: 1.6, realDist: "9.58 UA", tex: 'saturnmap.jpg',
      info: { type: "Géante gazeuse", diam: "116 460 km", mass: "95 x Terre", temp: "-140 °C" } },
    { name: "Uranus", color: "#71c8d7", radius: 9, a: 620, e: 0.046, period: 30688, baseAngle: 5.46, omega: 3.0, realDist: "19.2 UA", tex: 'uranusmap.jpg',
      info: { type: "Géante de glaces", diam: "50 724 km", mass: "14,5 x Terre", temp: "-195 °C" } },
    { name: "Neptune", color: "#4b70dd", radius: 9, a: 780, e: 0.011, period: 60182, baseAngle: 5.31, omega: 0.8, realDist: "30.1 UA", tex: 'neptunemap.jpg',
      info: { type: "Géante de glaces", diam: "49 244 km", mass: "17 x Terre", temp: "-200 °C" } },
    { name: "Comète Halley", color: "#cceeff", radius: 2.5, a: 450, e: 0.967, period: -27562, baseAngle: 3.14, omega: -0.8, realDist: "0.59 - 35.1 UA", tex: null,
      info: { type: "Comète périodique", diam: "~11 km", mass: "Négligeable", temp: "Variable" } },
    { name: "Pluton", color: "#ddccbb", radius: 4, a: 1020, e: 0.248, period: 90560, baseAngle: 3.5, omega: 1.96, realDist: "29.6 - 49.3 UA", tex: 'plutomap.jpg',
      info: { type: "Planète naine", diam: "2 376 km", mass: "0,002 x Terre", temp: "-229 °C" } }
];