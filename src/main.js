// import { createApp } from 'vue'
// import './style.css'
// import App from './App.vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
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
boxMesh.position.set(5, 0, 0);
scene.add(boxMesh);
boxMesh.castShadow = true;
boxMesh.receiveShadow = true;

const controls = new OrbitControls(camera, renderer.domElement)

const gltfLoader = new GLTFLoader();
// gltfLoader.load('container.glb', (gltf) => {
//     scene.add(gltf.scene);
//     // gltf.scene.traverse((child) => {
//     //     if (child.type === 'mesh') {
//     //         child.castShadow = true;
//     //         child.receiveShadow = true;
//     //     }
//     // })
// })

gltfLoader.load('owl.glb', (gltf) => {
    scene.add(gltf.scene);
    owl = scene.getObjectByName('owl');
})

// scene.add(group);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

animation();
// requestAnimationFrame比setInterval更有彈性 滑動更順暢
function animation() {
    requestAnimationFrame(animation);
    renderer.render(scene, camera);
    controls.update()

    if (owl) {
        owl.position.x -= 0.01;
    }
}



// createApp(App).mount('#app')
