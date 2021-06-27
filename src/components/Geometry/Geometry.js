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
    const camera = new THREE.PerspectiveCamera(25, width / height, 0.1, 100);
    scene.add(camera);
    camera.position.z = 8;
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

    //Axes helper
    const axesHelper = new THREE.AxesHelper(2);
    scene.add(axesHelper);

    //Grid Helper
    const size = 10;
    const divisions = 10;
    const gridHelper = new THREE.GridHelper(size, divisions);
    scene.add(gridHelper);

    //Cube
    const boxGeometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);
    const boxMaterial = new THREE.MeshBasicMaterial({
      color: 0xfff000,
      wireframe: true,
    });
    const cube = new THREE.Mesh(boxGeometry, boxMaterial);
    scene.add(cube);
    cube.position.set(1, 1, 1);

    //cube with Buffer Geometry
    // const boxBufferGeometry = new THREE.BoxBufferGeometry(1, 1, 1, 2, 2, 2);
    // const boxBufferMaterial = new THREE.MeshBasicMaterial({
    //   color: 0xff0000,
    //   wireframe: true,
    // });
    // const cubeBuffer = new THREE.Mesh(boxBufferGeometry, boxBufferMaterial);
    // scene.add(cubeBuffer);
    // console.log(boxBufferGeometry);

    //Faces
    // const faceMaterial = new THREE.MeshBasicMaterial({
    //   color: 0xff0000,
    //   wireframe: true,
    // });

    // const faceGeometry = new THREE.BufferGeometry();
    // // console.log(faceGeometry);
    // const facePoints = new Float32Array([0, 0, 0, 0, 1, 0, 1, 1, 0]);
    // const facePointsPositions = new THREE.BufferAttribute(facePoints, 3);
    // faceGeometry.setAttribute("position", facePointsPositions);
    // const face = new THREE.Mesh(faceGeometry, faceMaterial);
    // scene.add(face);

    //Particles
    // const count = 1000;
    // const particlesPositions = new Float32Array(count * 3);
    // for (let i = 0; i < count * 3; i++) {
    //   particlesPositions[i] = Math.random() * (-10 - 10 + 1) + 10;
    // }
    // const particlesAttribute = new THREE.BufferAttribute(particlesPositions, 3);
    // const particlesGeometry = new THREE.BufferGeometry();
    // particlesGeometry.setAttribute("position", particlesAttribute);

    // const particlesMaterial = new THREE.PointsMaterial({ color: 0xff0000 });
    // const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    // scene.add(particles);

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
