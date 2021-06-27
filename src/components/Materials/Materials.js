import { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const Material = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    //Data from the div as canvas
    const currentRef = mountRef.current;
    const { clientWidth: width, clientHeight: height } = currentRef;

    //Scene, Camera and Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(25, width / height, 0.1, 100);
    scene.add(camera);
    camera.position.z = 10;
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    currentRef.appendChild(renderer.domElement);

    //Orbit Controls
    const orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.enableDamping = true;

    //Resize the canvas
    const resize = () => {
      renderer.setSize(currentRef.clientWidth, currentRef.clientHeight);
      camera.aspect = currentRef.clientWidth / currentRef.clientHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", resize);

    //Animate the scene and for update the orbit controls
    const animateScene = () => {
      orbitControls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animateScene);
    };
    animateScene();

    const cubeTextureloader = new THREE.CubeTextureLoader();
    const evm = cubeTextureloader.load([
      "./envMap/px.jpg",
      "./envMap/nx.jpg",
      "./envMap/py.jpg",
      "./envMap/ny.jpg",
      "./envMap/pz.jpg",
      "./envMap/nz.jpg",
    ]);

    const textureLoader = new THREE.TextureLoader();
    const matcap = textureLoader.load("./matcaps/3.png");

    // const material = new THREE.MeshBasicMaterial();
    // material.color = new THREE.Color(0xff00fa);
    // material.wireframe = true;
    // material.transparent = true;
    // material.opacity = 0.5;

    // const material = new THREE.MeshNormalMaterial();
    // material.flatShading = true;

    // const material = new THREE.MeshMatcapMaterial();
    // material.matcap = matcap;
    // material.flatShading = true;

    const material = new THREE.MeshStandardMaterial();
    // material.color.set("#ff0000");
    material.metalness = 1;
    material.roughness = 0.2;
    material.envMap = evm;
    scene.background = new THREE.Color(0xeeeeee);

    const ambientalLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientalLight);

    const pointLight = new THREE.PointLight(0xffffff, 2);
    scene.add(pointLight);
    pointLight.position.set(5, 5, 5);

    //Cube
    const cubeGeometry = new THREE.BoxBufferGeometry(1, 1, 1);
    const cube = new THREE.Mesh(cubeGeometry, material);
    cube.position.set(-3, 0, 0);

    const torusGeometry = new THREE.TorusBufferGeometry(0.5, 0.2, 16, 32);
    const torus = new THREE.Mesh(torusGeometry, material);
    torus.castShadow = true;

    const torusKnotGeometry = new THREE.TorusKnotGeometry(0.7, 0.2, 50, 32);
    const torusknot = new THREE.Mesh(torusKnotGeometry, material);
    torusknot.position.set(3, 0, 0);

    scene.add(cube, torus, torusknot);

    //Clean up
    return () => {
      window.removeEventListener("resize", resize);
      currentRef.removeChild(renderer.domElement);
    };
  });

  return <div ref={mountRef} style={{ width: "100%", height: "100vh" }}></div>;
};

export default Material;
