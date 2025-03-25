// import { createApp } from 'vue'
// import './style.css'
// import App from './App.vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import gsap from 'gsap'
import { int } from 'three/tsl';
let owl;

const scene = new THREE.Scene();
scene.background = new THREE.Color(66, 66, 66)
// PerspectiveCamera 透視相機(進大遠小)
// 正交相機(沒有進大遠小)
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 50);
camera.position.set(43, 0, 25);
const renderer = new THREE.WebGLRenderer();
// 陰影
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement)


const directionLight = new THREE.DirectionalLight(0xffffff, 1);
scene.add(directionLight)
directionLight.position.set(5, 15, 5);
directionLight.castShadow = true;

const SHADOW_DISTANCE = 20
directionLight.shadow.camera.near = 0.1;
directionLight.shadow.camera.far = SHADOW_DISTANCE;
directionLight.shadow.camera.left = -SHADOW_DISTANCE;
directionLight.shadow.camera.right = SHADOW_DISTANCE;
directionLight.shadow.camera.top = SHADOW_DISTANCE;
directionLight.shadow.camera.bottom = -SHADOW_DISTANCE;

// const dirHelper = new THREE.DirectionalLightHelper(directionLight, 5);
// scene.add(dirHelper);

// const camHelper = new THREE.CameraHelper(directionLight.shadow.camera);
// scene.add(camHelper);
// const group = new THREE.Group();

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);

scene.add(boxMesh);
boxMesh.castShadow = true;
boxMesh.receiveShadow = true;

const controls = new OrbitControls(camera, renderer.domElement)

const gltfLoader = new GLTFLoader();

const sphereType1 = new THREE.SphereGeometry(1);
const sphereMat1 = new THREE.MeshBasicMaterial({ color: 0xff0000 });


for (let i = 0; i < 10; i++) {
    const sphere = new THREE.Mesh(sphereType1, sphereMat1);
    scene.add(sphere);
    sphere.position.setX(i * 3);
    gsap.to(sphere.position,
        { y: 30, duration: 2, repeat: -1, yoyo: true, ease: 'sine.inOut' }
    )
}

const canRaycastMeshes = [];

gltfLoader.load('container.glb', (gltf) => {
    scene.add(gltf.scene);
    gltf.scene.traverse((child) => {
        if (child.type === 'mesh') {
            child.castShadow = true;
            child.receiveShadow = true;
            canRaycastMeshes.push(child);
        }
    })
})

gltfLoader.load('owl.glb', (gltf) => {
    scene.add(gltf.scene);
    owl = scene.getObjectByName('owl');
    gsap.to(owl.position, { x: 20, duration: 2, repeat: -1, yoyo: true, ease: 'sine.inOut' })
    gsap.to(owl.rotation, { y: 360, duration: 30, repeat: -1, yoyo: true }).timeScale(0.1);

})

// 懸浮粒子
const textureLoader = new THREE.TextureLoader();
textureLoader.load('particle.png', (texture) => {
    const vertices = [];

    for (let i = 0; i < 1000; i++) {
        const x = THREE.MathUtils.randFloatSpread(100);
        const y = THREE.MathUtils.randFloatSpread(100);
        const z = THREE.MathUtils.randFloatSpread(100);
        vertices.push(x, y, z);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    const material = new THREE.PointsMaterial({ color: 0xffffff, map: texture, transparent: true, size: 0.5 });
    const points = new THREE.Points(geometry, material);

    gsap.to(points.position, {
        x: -8,
        y: -3,
        duration: 30,
        repeat: -1,
        yoyo: true,
        ease: 'none',
    })
    scene.add(points);

})

let pointerScreen = new THREE.Vector2();
let pointerThreejs = new THREE.Vector2();
const raycaster = new THREE.Raycaster();


function checkRaycast() {
    // 轉換座標
    pointerThreejs.x = (pointerScreen / window.innerWidth) * 2 - 1;
    pointerThreejs.y = -(pointerScreen / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(pointerThreejs, camera);
    const intersects = raycaster.intersectObjects(canRaycastMeshes);
    console.log(intersects)

}

window.addEventListener('mousemove', (e) => {
    pointerThreejs.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointerThreejs.y = -(e.clientY / window.innerHeight) * 2 + 1;
    checkRaycast()
})


const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

animation();
// requestAnimationFrame比setInterval更有彈性 滑動更順暢
function animation() {
    requestAnimationFrame(animation);
    renderer.render(scene, camera);
    controls.update()
}



// createApp(App).mount('#app')
