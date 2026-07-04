"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

function disposeObject(object: THREE.Object3D) {
  object.traverse((child) => {
    if (child instanceof THREE.Mesh || child instanceof THREE.Points || child instanceof THREE.Line) {
      child.geometry.dispose();
      const material = child.material;
      if (Array.isArray(material)) {
        material.forEach((item) => item.dispose());
      } else {
        material.dispose();
      }
    }
  });
}

export function RoyalHallWebGL() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const container = mount;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05070d, 0.082);

    const camera = new THREE.PerspectiveCamera(44, 1, 0.1, 80);
    camera.position.set(0, 2.2, 7.4);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.45));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    container.appendChild(renderer.domElement);

    const hall = new THREE.Group();
    scene.add(hall);

    scene.add(new THREE.AmbientLight(0xb8c1d4, 0.18));

    const crownLight = new THREE.PointLight(0xf3d487, 9, 16);
    crownLight.position.set(0, 4.2, -2.6);
    scene.add(crownLight);

    const sideLight = new THREE.PointLight(0x6f86bb, 2.5, 12);
    sideLight.position.set(-4.4, 2.8, 2.2);
    scene.add(sideLight);

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(16, 24, 16, 16),
      new THREE.MeshStandardMaterial({
        color: 0x07080d,
        metalness: 0.58,
        roughness: 0.27,
        transparent: true,
        opacity: 0.82
      })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, -0.95, -2.5);
    hall.add(floor);

    const aisle = new THREE.Mesh(
      new THREE.PlaneGeometry(2.25, 18),
      new THREE.MeshStandardMaterial({
        color: 0xc9a45d,
        emissive: 0x6b4618,
        emissiveIntensity: 0.36,
        metalness: 0.76,
        roughness: 0.22,
        transparent: true,
        opacity: 0.62
      })
    );
    aisle.rotation.x = -Math.PI / 2;
    aisle.position.set(0, -0.93, -2.9);
    hall.add(aisle);

    const columnMaterial = new THREE.MeshStandardMaterial({
      color: 0x11131a,
      emissive: 0x08090f,
      metalness: 0.66,
      roughness: 0.38
    });

    for (let row = 0; row < 6; row += 1) {
      const z = 2.5 - row * 1.72;
      for (const x of [-4.45, 4.45]) {
        const column = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.34, 4.8, 26), columnMaterial);
        column.position.set(x, 1.35, z);
        hall.add(column);

        const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.42, 0.18, 26), columnMaterial);
        cap.position.set(x, 3.82, z);
        hall.add(cap);
      }
    }

    const portalMaterial = new THREE.MeshStandardMaterial({
      color: 0xf7e8ad,
      emissive: 0xc9a45d,
      emissiveIntensity: 1.42,
      metalness: 0.86,
      roughness: 0.12,
      transparent: true,
      opacity: 0.82
    });
    const portal = new THREE.Mesh(new THREE.TorusGeometry(1.55, 0.025, 12, 128), portalMaterial);
    portal.position.set(0, 1.95, -5.55);
    portal.scale.set(1, 1.34, 1);
    hall.add(portal);

    const innerPortal = new THREE.Mesh(new THREE.TorusGeometry(1.12, 0.012, 8, 96), portalMaterial);
    innerPortal.position.copy(portal.position);
    innerPortal.scale.set(1, 1.35, 1);
    hall.add(innerPortal);

    const crownGroup = new THREE.Group();
    crownGroup.position.set(0, 3.35, -5.45);
    hall.add(crownGroup);

    const crownBase = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.08, 0.08), portalMaterial);
    crownGroup.add(crownBase);
    for (const x of [-0.46, -0.18, 0.18, 0.46]) {
      const spire = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.42, 4), portalMaterial);
      spire.position.set(x, 0.23, 0);
      spire.rotation.z = x < 0 ? -0.16 : 0.16;
      crownGroup.add(spire);
    }

    const wingMaterial = new THREE.MeshStandardMaterial({
      color: 0xd6b76d,
      emissive: 0x6b4618,
      emissiveIntensity: 0.36,
      metalness: 0.72,
      roughness: 0.2,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.68
    });
    for (const side of [-1, 1]) {
      const wing = new THREE.Mesh(new THREE.PlaneGeometry(1.35, 0.42, 1, 1), wingMaterial);
      wing.position.set(side * 1.05, 2.55, -5.5);
      wing.rotation.set(0.1, side * -0.45, side * -0.36);
      hall.add(wing);
    }

    const particleCount = 420;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let index = 0; index < particleCount; index += 1) {
      particlePositions[index * 3] = (Math.random() - 0.5) * 10;
      particlePositions[index * 3 + 1] = Math.random() * 4.7 - 0.75;
      particlePositions[index * 3 + 2] = Math.random() * -8 + 3.2;
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particles = new THREE.Points(
      particleGeometry,
      new THREE.PointsMaterial({
        color: 0xe3c980,
        size: 0.026,
        transparent: true,
        opacity: 0.48,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      })
    );
    hall.add(particles);

    const clock = new THREE.Clock();
    let frameId = 0;
    let disposed = false;

    function resize() {
      const width = container.clientWidth || 1;
      const height = container.clientHeight || 1;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    function render() {
      if (disposed) return;
      const elapsed = clock.getElapsedTime();

      if (!reduceMotion) {
        camera.position.x = Math.sin(elapsed * 0.24) * 0.18;
        camera.position.y = 2.14 + Math.sin(elapsed * 0.18) * 0.06;
        camera.position.z = 7.15 + Math.sin(elapsed * 0.16) * 0.24;
        hall.rotation.y = Math.sin(elapsed * 0.12) * 0.025;
        portal.rotation.z = elapsed * 0.035;
        innerPortal.rotation.z = -elapsed * 0.052;
        crownGroup.position.y = 3.35 + Math.sin(elapsed * 0.8) * 0.035;
        particles.rotation.y = elapsed * 0.018;
      }

      camera.lookAt(0, 1.42, -3.9);
      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(render);
    }

    render();

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      disposeObject(hall);
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={mountRef} className="webgl-hall" aria-hidden />;
}
