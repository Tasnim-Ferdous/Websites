let scene, camera, renderer, controls, raycaster, mouse;
let animationActive = true;
const solarObjects = [];
const pivotGroups = [];
const orbitRings = [];

init();
animate();

function init() {
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 3000);
    camera.position.set(0, 100, 200);
    camera.lookAt(0, -30, 0);  // Look at Sun (origin)


    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    controls = new THREE.FlyControls(camera, renderer.domElement);
    controls.movementSpeed = 50;
    controls.rollSpeed = Math.PI / 24;
    controls.dragToLook = true;

    // Lights
    const ambient = new THREE.AmbientLight(0x404040, 1.5);
    const pointLight = new THREE.PointLight(0xffffff, 4, 2000);
    pointLight.position.set(0, 0, 0);
    scene.add(ambient, pointLight);

    // Starfield background
    addStarField();

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    window.addEventListener('resize', onWindowResize);
    window.addEventListener('click', onObjectClick);

    document.getElementById("toggleAnimation").onclick = toggleAnimation;
    document.getElementById("closeBtn").onclick = () => document.getElementById("infoPanel").classList.remove("show");
    document.getElementById("closeBtn1").onclick = () => document.getElementById("container").classList.add("hidden");
    document.getElementById("closeBtn1").onclick = () => document.getElementById("instructions").classList.add("hidden");

    createSolarSystem();

    window.addEventListener('wheel', (event) => {
    event.preventDefault();

    const zoomSpeed = 2;
    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    camera.position.addScaledVector(dir, event.deltaY * zoomSpeed * 0.01);
    }, { passive: false });

}

function addStarField() {
    const starGeo = new THREE.BufferGeometry();
    const starCount = 2000;
    const starPositions = [];
    for (let i = 0; i < starCount; i++) {
    starPositions.push((Math.random() - 0.5) * 4000);
    starPositions.push((Math.random() - 0.5) * 4000);
    starPositions.push((Math.random() - 0.5) * 4000);
    }
    starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 1 });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);
}

function createSolarSystem() {
    const loader = new THREE.TextureLoader();

    const solarData = [
        { name: "Sun", radius: 15, distance: 0, speed: 0, texture: "sun/textures/Sun_d.jpg", info: ["Star Type: G2V", "Surface Temp: ~5500°C", "Mass: 99.8% of Solar System"] },
        { name: "Mercury", radius: 1.5, distance: 30, speed: 0.04, texture: "mercury/textures/Mercury_d.jpg", info: ["Diameter: 4,879 km", "Orbit: 88 days", "No moons"] },
        { name: "Venus", radius: 2.5, distance: 40, speed: 0.015, texture: "venus/textures/VenusAtmosphere_d.jpg", info: ["Diameter: 12,104 km", "Orbit: 225 days", "Atmosphere: CO₂"] },
        { name: "Earth", radius: 3, distance: 55, speed: 0.01, texture: "earth-planet-our-homeland/textures/Earth.jpg", info: ["Diameter: 12,742 km", "Orbit: 365 days", "Has 1 moon"] },
        { name: "Moon", radius: 0.8, distance: 6, speed: 0.03, texture: "moon/textures/Moon_d.jpg", parent: "Earth", info: ["Diameter: 3,474 km", "Orbit: 27 days", "Distance: 384,400 km"] },
        { name: "Mars", radius: 1.6, distance: 70, speed: 0.008, texture: "mars/textures/Mars_d.jpg", info: ["Diameter: 6,779 km", "Orbit: 687 days", "Has 2 moons"] },
        { name: "Jupiter", radius: 7, distance: 90, speed: 0.005, texture: "jupiter-planet/textures/Jupiter.jpg", info: ["Diameter: 139,820 km", "Orbit: 12 years", "Gas Giant"] },
        { name: "Uranus", radius: 3.2, distance: 110, speed: 0.003, texture: "sun/textures/Urenus.JPG", info: ["Diameter: 50,724 km", "Orbit: 84 years", "Icy Giant"] },
        { name: "Neptune", radius: 3, distance: 130, speed: 0.002, texture: "neptune/textures/Neptune_d.jpg", info: ["Diameter: 49,244 km", "Orbit: 165 years", "Farthest planet"] }
    ];

    

    const objectMap = {};

    solarData.forEach(obj => {
    const pivot = new THREE.Object3D();
    scene.add(pivot);
    pivotGroups.push({ pivot, speed: obj.speed });
    if(obj.distance > 0){
        addOrbitRing(obj.distance);
    }

    const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(obj.radius, 64, 64),
        new THREE.MeshPhongMaterial({ map: loader.load(obj.texture) })
    );

    sphere.userData = { name: obj.name, info: obj.info };
    sphere.position.x = obj.distance;

    if (obj.name === "Sun") {
        sphere.material = new THREE.MeshBasicMaterial({
        map: loader.load(obj.texture),
        color: new THREE.Color(0xffffff)
    });
}


    if (obj.parent) {
        // For Moon, parent is Earth
        if (objectMap[obj.parent]) {
        objectMap[obj.parent].add(pivot);
        }
    } else {
        scene.add(pivot);
    }

    pivot.add(sphere);
    solarObjects.push(sphere);
    objectMap[obj.name] = pivot;
    });

    // Fix Moon parent-child properly (orbiting Earth)
    const moonData = solarData.find(obj => obj.name === "Moon");
    if(moonData){
    const earthPivot = objectMap[moonData.parent];
    const moonPivot = new THREE.Object3D();
    earthPivot.add(moonPivot);
    pivotGroups.push({ pivot: moonPivot, speed: moonData.speed });

    const moonMesh = new THREE.Mesh(
        new THREE.SphereGeometry(moonData.radius, 32, 32),
        new THREE.MeshPhongMaterial({ map: loader.load(moonData.texture) })
    );
    moonMesh.userData = { name: moonData.name, info: moonData.info };
    moonMesh.position.x = moonData.distance;
    moonPivot.add(moonMesh);
    solarObjects.push(moonMesh);
    }

    // Asteroid Belt
    const asteroidGeo = new THREE.SphereGeometry(0.2, 6, 6);
    const asteroidMat = new THREE.MeshBasicMaterial({ color: 0x888888 });
    for(let i=0; i<300; i++){
    const asteroid = new THREE.Mesh(asteroidGeo, asteroidMat);
    const angle = Math.random() * 2 * Math.PI;
    const radius = 75 + Math.random() * 10;
    asteroid.position.set(Math.cos(angle)*radius, (Math.random()-0.5)*2, Math.sin(angle)*radius);
    scene.add(asteroid);
    pivotGroups.push({ pivot: asteroid, speed: 0.005 + Math.random() * 0.002 });
    }
}

function addOrbitRing(radius){
    const ringGeo = new THREE.RingGeometry(radius-0.1, radius+0.1, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    scene.add(ring);
    orbitRings.push(ring);
}

function animate(){
    requestAnimationFrame(animate);

    if(animationActive){
    pivotGroups.forEach(pg => {
        pg.pivot.rotation.y += pg.speed;
    });
    }

    controls.update(0.01);
    renderer.render(scene, camera);
}

function toggleAnimation(){
    animationActive = !animationActive;
    document.getElementById("toggleAnimation").textContent = animationActive ? "Pause" : "Play";
}

function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onObjectClick(event){
    event.preventDefault();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(solarObjects);

    if(intersects.length > 0){
    const obj = intersects[0].object.userData;
    showObjectInfo(obj.name, obj.info);
    } else {
    document.getElementById("infoPanel").classList.remove("show");
    }
}

function showObjectInfo(name, infoArray){
    const infoPanel = document.getElementById("infoPanel");
    document.getElementById("objName").textContent = name;

    const detailsList = document.getElementById("objDetails");
    detailsList.innerHTML = "";
    infoArray.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    detailsList.appendChild(li);
    });

    infoPanel.classList.add("show");
}