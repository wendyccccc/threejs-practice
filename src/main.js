// import { createApp } from 'vue'
// import './style.css'
// import App from './App.vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import gsap from 'gsap';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';


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

const controls = new OrbitControls(camera, renderer.domElement)

const gltfLoader = new GLTFLoader();

new RGBELoader().load('room.hdr', (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = texture;
    scene.environment = texture;
    // scene.backgroundBlurriness = 0.1;
    renderer.outputEncoding = THREE.sRGBEncoding;

})
const canRaycastMeshes = [];
let mixer01;
// 按鍵觸發
window.addEventListener('keydown', (e) => {
    if (e.key === 'f') {
        mixer01 = new THREE.AnimationMixer(fireWorksGltf.scene);
        const clips = fireWorksGltf.animations;
        clips.forEach((clip) => {
            const action = mixer01.clipAction(clip);
            action.loop = THREE.LoopOnce;
            action.clampWhenFinished = true;
            action.play();
        })
    }
})


let fireWorksGltf;
gltfLoader.load('fireworks.glb', (gltf) => {
    scene.add(gltf.scene);
    fireWorksGltf = gltf;
    gltf.scene.traverse((child) => {
        if (child.isMesh) { // 只存入 Mesh
            canRaycastMeshes.push(child);
        }
    })

    window.addEventListener('click', checkRaycast);
})

gltfLoader.load('owl.glb', (gltf) => {
    scene.add(gltf.scene);
    owl = scene.getObjectByName('owl');
    // 可以把資料丟到userData裡面
    owl.traverse((child) => {
        child.userData.groupIns = owl;
        if (child.isMesh) {
            canRaycastMeshes.push(child);
        }
    });
    console.log('owl', owl);
    gsap.to(owl.position, { x: 20, duration: 2, repeat: -1, yoyo: true, ease: 'sine.inOut' })
    gsap.to(owl.rotation, { y: 360, duration: 30, repeat: -1, yoyo: true }).timeScale(0.1);

})

gltfLoader.load('cubes.glb', (gltf) => {
    scene.add(gltf.scene);
    gltf.scene.traverse((child) => {
        if (child.name.indexOf('Cube') >= 0) {
            canRaycastMeshes.push(child);
        }
    })
})

// // 懸浮粒子
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

// 拾取step1: new raycaster
function checkRaycast(e) {
    // 轉換座標
    pointerThreejs = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
    };


    raycaster.setFromCamera(pointerThreejs, camera);
    const intersects = raycaster.intersectObjects(canRaycastMeshes);

    if (intersects[0]?.object.name === 'fireworks') {


        // fireWorksGltf.scene.rotateY(30);

        const fireworks = scene.getObjectByName('fireworks');
        fireworks.rotateY(30)

        mixer01 = new THREE.AnimationMixer(fireWorksGltf.scene);
        const clips = fireWorksGltf.animations;
        clips.forEach((clip) => {
            const action = mixer01.clipAction(clip);
            action.loop = THREE.LoopOnce;
            action.clampWhenFinished = true;
            action.play();
        })

    }

    console.log('intersects', intersects);

    if (intersects[0]?.object.name.indexOf('Cube') >= 0) {
        const cube = intersects[0].object;

        const newMaterial = cube.material.clone();
        cube.material = newMaterial;
        cube.material.color = new THREE.Color(0, 255, 0);
    }
}

window.addEventListener('click', (e) => {
    pointerThreejs.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointerThreejs.y = -(e.clientY / window.innerHeight) * 2 + 1;
    checkRaycast(e);
});


window.addEventListener('mousemove', (e) => {
    pointerThreejs.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointerThreejs.y = -(e.clientY / window.innerHeight) * 2 + 1;
    // checkRaycast(e)
})


// const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);

animation();
// requestAnimationFrame比setInterval更有彈性 滑動更順暢
function animation() {
    requestAnimationFrame(animation);
    renderer.render(scene, camera);
    controls.update()

    if (mixer01) {
        mixer01.update(0.02);
    }
}



// createApp(App).mount('#app')
