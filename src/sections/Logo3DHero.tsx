"use client";

import { useEffect, useRef } from "react";

export default function Logo3DHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let animFrameId: number;
    let renderer: any;
    let cleanupFn: (() => void) | undefined;

    async function init() {
      const THREE = await import("three");

      const canvas = canvasRef.current;
      if (!canvas) return;

      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;

      const w = canvas.parentElement!.clientWidth;
      const h = canvas.parentElement!.clientHeight;
      renderer.setSize(w, h);

      const scene = new THREE.Scene();
      scene.background = null;

      const camera = new THREE.PerspectiveCamera(32, w / h, 0.1, 100);
      // pushed back further so logo appears smaller
      camera.position.set(0, 0.5, 14);

      const matSilver = new THREE.MeshStandardMaterial({
        color: 0xd0d0d0,
        metalness: 0.92,
        roughness: 0.12,
      });
      const matDark = new THREE.MeshStandardMaterial({
        color: 0x888888,
        metalness: 0.95,
        roughness: 0.08,
      });

      const group = new THREE.Group();

      function addBox(
        bw: number, bh: number, bd: number,
        x: number, y: number, z: number,
        m = matSilver,
        rz = 0
      ) {
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, bd), m);
        mesh.position.set(x, y, z);
        mesh.rotation.z = rz;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        group.add(mesh);
        return mesh;
      }

      // Top barbell
      addBox(4.2, 0.28, 0.28, 0, 1.45, 0);
      addBox(0.55, 0.85, 0.38, -2.25, 1.65, 0, matDark, 0.35);
      addBox(0.55, 0.85, 0.38, 2.25, 1.65, 0, matDark, -0.35);
      // Vertical stem
      addBox(0.28, 3.6, 0.28, 0, -0.35, 0);
      // Middle crossbar
      addBox(2.1, 0.28, 0.28, 0, -0.55, 0);
      addBox(0.28, 0.7, 0.28, -0.9, -1.05, 0);
      addBox(0.28, 0.7, 0.28, 0.9, -1.05, 0);
      // Bottom foot
      addBox(0.75, 0.28, 0.28, 0, -2.15, 0);

      scene.add(group);

      scene.add(new THREE.AmbientLight(0xffffff, 0.25));
      const key = new THREE.DirectionalLight(0xffffff, 2.8);
      key.position.set(5, 8, 6);
      key.castShadow = true;
      scene.add(key);
      const fill = new THREE.DirectionalLight(0x8899ff, 1.0);
      fill.position.set(-5, 2, 3);
      scene.add(fill);
      const rim = new THREE.DirectionalLight(0xffffff, 1.5);
      rim.position.set(0, -5, -4);
      scene.add(rim);
      const top = new THREE.DirectionalLight(0xffd0a0, 0.7);
      top.position.set(0, 10, 2);
      scene.add(top);

      try {
        const { RoomEnvironment } = await import("three/examples/jsm/environments/RoomEnvironment.js");
        const pmrem = new THREE.PMREMGenerator(renderer);
        const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
        scene.environment = envTex;
      } catch (_) {}

      let isDragging = false;
      let prevX = 0, prevY = 0;
      let rotX = 0, rotY = 0;
      let velX = 0, velY = 0;

      const el = canvas.parentElement!;

      const onMouseDown = (e: MouseEvent) => { isDragging = true; prevX = e.clientX; prevY = e.clientY; };
      const onMouseUp = () => { isDragging = false; };
      const onMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;
        velX = (e.clientY - prevY) * 0.008;
        velY = (e.clientX - prevX) * 0.008;
        prevX = e.clientX; prevY = e.clientY;
      };
      const onTouchStart = (e: TouchEvent) => { isDragging = true; prevX = e.touches[0].clientX; prevY = e.touches[0].clientY; };
      const onTouchEnd = () => { isDragging = false; };
      const onTouchMove = (e: TouchEvent) => {
        if (!isDragging) return;
        velX = (e.touches[0].clientY - prevY) * 0.008;
        velY = (e.touches[0].clientX - prevX) * 0.008;
        prevX = e.touches[0].clientX; prevY = e.touches[0].clientY;
      };

      el.addEventListener("mousedown", onMouseDown);
      window.addEventListener("mouseup", onMouseUp);
      window.addEventListener("mousemove", onMouseMove);
      el.addEventListener("touchstart", onTouchStart, { passive: true });
      window.addEventListener("touchend", onTouchEnd);
      window.addEventListener("touchmove", onTouchMove, { passive: true });

      const startTime = performance.now();

      const animate = () => {
        animFrameId = requestAnimationFrame(animate);
        const t = (performance.now() - startTime) / 1000;
        if (!isDragging) { velX *= 0.92; velY *= 0.92; rotY += 0.006; }
        rotX += velX;
        rotY += velY;
        group.rotation.x = rotX;
        group.rotation.y = rotY;
        group.position.y = Math.sin(t * 0.8) * 0.12;
        renderer.render(scene, camera);
      };
      animate();

      const onResize = () => {
        if (!canvas.parentElement) return;
        const w2 = canvas.parentElement.clientWidth;
        const h2 = canvas.parentElement.clientHeight;
        renderer.setSize(w2, h2);
        camera.aspect = w2 / h2;
        camera.updateProjectionMatrix();
      };
      window.addEventListener("resize", onResize);

      cleanupFn = () => {
        el.removeEventListener("mousedown", onMouseDown);
        window.removeEventListener("mouseup", onMouseUp);
        window.removeEventListener("mousemove", onMouseMove);
        el.removeEventListener("touchstart", onTouchStart);
        window.removeEventListener("touchend", onTouchEnd);
        window.removeEventListener("touchmove", onTouchMove);
        window.removeEventListener("resize", onResize);
      };
    }

    init();

    return () => {
      cancelAnimationFrame(animFrameId);
      renderer?.dispose();
      cleanupFn?.();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ cursor: "grab", display: "block" }}
    />
  );
}