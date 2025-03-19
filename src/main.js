// import { createApp } from 'vue'
// import './style.css'
// import App from './App.vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const scene = new THREE.Scene();
scene.background = new THREE.Color(66, 66, 66)
// PerspectiveCamera 透視相機(進大遠小)
// 正交相機(沒有進大遠小)
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 50);
camera.position.set(3, 0, 5);// 必須在render前設定
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement)
// 環境光
const ambientLight = new THREE.AmbientLight({ color: 0xaaaaaa });
scene.add(ambientLight)

const directionLight = new THREE.DirectionalLight({ color: 0xffffff });
scene.add(directionLight)


const controls = new OrbitControls(camera, renderer.domElement)

// const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
// const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
// const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
// scene.add(boxMesh);
const gltfLoader = new GLTFLoader();
gltfLoader.load('container.glb', (gltf) => {
    scene.add(gltf.scene);
})

setInterval(() => {
    renderer.render(scene, camera);
    controls.update()
}, 1000 / 24)



// createApp(App).mount('#app')
