import { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const Geometry = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    //Data from the div as canvas
    const currentRef = mountRef.current;
    const { clientWidth: width, clientHeight: height } = currentRef;

    //Scene, Camera and Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x393939);
    const camera = new THREE.PerspectiveCamera(25, width / height, 0.1, 100);
    scene.add(camera);
    camera.position.z = 3;
    camera.position.x = 3;
    camera.position.y = -1;
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);

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

    //Texture Loader
    const textureLoader = new THREE.TextureLoader();
    const material = new THREE.MeshStandardMaterial();

    //Minecraft
    const iron = textureLoader.load("./minecraft/iron.jpg");
    material.map = iron;

    //Brick
    // const base = textureLoader.load("./textures/base.jpg");
    // const normal = textureLoader.load("./textures/normal.jpg");
    // const ambientalOcclusion = textureLoader.load(
    //   "./textures/ambientalOcclusion.jpg"
    // );
    // const roughness = textureLoader.load("./textures/roughness.jpg");

    // material.map = base;
    // material.normalMap = normal;
    // material.aoMap = ambientalOcclusion;
    // material.roughnessMap = roughness;

    const geometry = new THREE.BoxGeometry(1, 1, 1, 4, 4, 4);
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    const ambientalLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientalLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(6, 6, 6);
    scene.add(pointLight);

    //Clean up
    return () => {
      window.removeEventListener("resize", resize);
      currentRef.removeChild(renderer.domElement);
    };
  });

  return (
    <div
      className='Contenedor3D'
      ref={mountRef}
      style={{ width: "100%", height: "100vh" }}
    ></div>
  );
};

export default Geometry;
