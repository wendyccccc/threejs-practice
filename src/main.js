// import { createApp } from 'vue'
// import './style.css'
// import App from './App.vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
// PerspectiveCamera 透視相機(進大遠小)
// 正交相機(沒有進大遠小)
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 50);
camera.position.set(3, 0, 5);// 必須在render前設定
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(boxMesh);

setInterval(() => {
    renderer.render(scene, camera);
    controls.update()
}, 1000 / 24)



// createApp(App).mount('#app')
