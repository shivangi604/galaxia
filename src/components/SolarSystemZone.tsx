import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { SOLAR_SYSTEM_DATA } from '../utils/solarData';
import { PlanetData } from '../types/space';
import {
  Play,
  Pause,
  ChevronUp,
  ChevronDown,
  Compass,
  RotateCcw,
  Layers,
  X,
  Sparkles
} from 'lucide-react';

export const SolarSystemZone: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [showOrbits, setShowOrbits] = useState<boolean>(true);
  const [isCinemaMode, setIsCinemaMode] = useState<boolean>(false);
  const [scaleMode, setScaleMode] = useState<'aesthetic' | 'realistic'>('aesthetic');

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const planetMeshesRef = useRef<Map<string, THREE.Group>>(new Map());
  const orbitLinesRef = useRef<THREE.Line[]>([]);
  const targetCamPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 45, 90));
  const targetLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const cameraSphericalRef = useRef({ radius: 100, theta: Math.PI / 4, phi: Math.PI / 3 });

  // Vibrant procedural texture generators
  const createSunTexture = (): THREE.CanvasTexture => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    const grad = ctx.createLinearGradient(0, 0, 512, 256);
    grad.addColorStop(0, '#ff3700');
    grad.addColorStop(0.25, '#ff8800');
    grad.addColorStop(0.5, '#ffcc00');
    grad.addColorStop(0.75, '#ffea00');
    grad.addColorStop(1, '#ff4500');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 256);

    for (let i = 0; i < 350; i++) {
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.1})`;
      ctx.beginPath();
      ctx.arc(Math.random() * 512, Math.random() * 256, Math.random() * 6 + 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  };

  const createEarthTexture = (): THREE.CanvasTexture => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    // Vibrant deep electric blue ocean
    ctx.fillStyle = '#005f9e';
    ctx.fillRect(0, 0, 512, 256);

    // Lush saturated emerald continents
    ctx.fillStyle = '#10b981';
    const continents = [
      { x: 120, y: 85, r: 48 },
      { x: 155, y: 155, r: 38 },
      { x: 285, y: 75, r: 55 },
      { x: 335, y: 105, r: 44 },
      { x: 395, y: 165, r: 34 },
    ];
    continents.forEach((c) => {
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // Swirling brilliant white cloud streamers
    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    for (let i = 0; i < 60; i++) {
      ctx.beginPath();
      ctx.ellipse(Math.random() * 512, Math.random() * 256, Math.random() * 40 + 20, Math.random() * 10 + 4, Math.random() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  };

  const createMarsTexture = (): THREE.CanvasTexture => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    // High saturation fiery red-orange
    ctx.fillStyle = '#e63946';
    ctx.fillRect(0, 0, 512, 256);

    // Dark volcanic basalt basins
    ctx.fillStyle = '#9b2226';
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * 512, Math.random() * 256, Math.random() * 30 + 10, 0, Math.PI * 2);
      ctx.fill();
    }

    // Brilliant white polar ice caps
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 512, 25);
    ctx.fillRect(0, 235, 512, 21);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  };

  const createJupiterTexture = (): THREE.CanvasTexture => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    // Ultra-vibrant contrasting bands
    const colors = ['#f77f00', '#fcbf49', '#d62828', '#eae2b7', '#f77f00', '#ffb703', '#934b00'];
    const bandHeight = 256 / colors.length;
    colors.forEach((col, idx) => {
      ctx.fillStyle = col;
      ctx.fillRect(0, idx * bandHeight, 512, bandHeight + 2);
    });

    // Intense Crimson Great Red Spot
    ctx.fillStyle = '#ba181b';
    ctx.beginPath();
    ctx.ellipse(330, 165, 45, 24, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#660708';
    ctx.lineWidth = 3;
    ctx.stroke();

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  };

  const createSaturnRingTexture = (): THREE.CanvasTexture => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;

    const grad = ctx.createLinearGradient(0, 0, 512, 0);
    grad.addColorStop(0, 'rgba(255, 209, 102, 0)');
    grad.addColorStop(0.2, 'rgba(255, 217, 125, 0.95)');
    grad.addColorStop(0.5, 'rgba(180, 120, 50, 0.15)'); // Cassini division
    grad.addColorStop(0.65, 'rgba(255, 235, 170, 0.98)');
    grad.addColorStop(0.9, 'rgba(255, 195, 80, 0.6)');
    grad.addColorStop(1, 'rgba(200, 150, 60, 0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 64);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  };

  useEffect(() => {
    if (!mountRef.current) return;

    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x020617);
    scene.fog = new THREE.FogExp2(0x020617, 0.003);

    const camera = new THREE.PerspectiveCamera(
      45,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      2000
    );
    cameraRef.current = camera;
    camera.position.set(0, 60, 110);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    rendererRef.current = renderer;
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    mountRef.current.appendChild(renderer.domElement);

    // Warm high-intensity radiant point light from Sun
    const sunPointLight = new THREE.PointLight(0xfff0cc, 3.2, 400);
    sunPointLight.position.set(0, 0, 0);
    scene.add(sunPointLight);

    const ambientLight = new THREE.AmbientLight(0x243552, 0.75);
    scene.add(ambientLight);

    // Deep Space Starfield
    const starGeo = new THREE.BufferGeometry();
    const starCount = 2200;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPos[i] = (Math.random() - 0.5) * 1200;
      starPos[i + 1] = (Math.random() - 0.5) * 1200;
      starPos[i + 2] = (Math.random() - 0.5) * 1200;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1.2,
      transparent: true,
      opacity: 0.85,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    const sunTex = createSunTexture();
    const earthTex = createEarthTexture();
    const marsTex = createMarsTexture();
    const jupiterTex = createJupiterTexture();
    const saturnRingTex = createSaturnRingTexture();

    SOLAR_SYSTEM_DATA.forEach((planet) => {
      const planetGroup = new THREE.Group();
      planetGroup.name = planet.id;

      let radius = planet.radiusRender;
      let mat: THREE.Material;

      if (planet.id === 'sun') {
        mat = new THREE.MeshBasicMaterial({
          map: sunTex,
          color: 0xffea00,
        });
        // Radiant glowing solar corona
        const haloGeo = new THREE.SphereGeometry(radius * 1.35, 32, 32);
        const haloMat = new THREE.MeshBasicMaterial({
          color: 0xff9900,
          transparent: true,
          opacity: 0.28,
          side: THREE.BackSide,
        });
        planetGroup.add(new THREE.Mesh(haloGeo, haloMat));
      } else if (planet.id === 'earth') {
        mat = new THREE.MeshStandardMaterial({
          map: earthTex,
          roughness: 0.5,
          metalness: 0.1,
          emissive: new THREE.Color(0x002b4d),
          emissiveIntensity: 0.25,
        });
        // Luminous atmosphere rim
        const atmoGeo = new THREE.SphereGeometry(radius * 1.05, 32, 32);
        const atmoMat = new THREE.MeshBasicMaterial({
          color: 0x38bdf8,
          transparent: true,
          opacity: 0.22,
          side: THREE.BackSide,
        });
        planetGroup.add(new THREE.Mesh(atmoGeo, atmoMat));

        // Earth's Moon
        const moonGeo = new THREE.SphereGeometry(0.36, 16, 16);
        const moonMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.8 });
        const moonMesh = new THREE.Mesh(moonGeo, moonMat);
        moonMesh.name = 'moon';
        moonMesh.position.set(2.4, 0.4, 0);
        planetGroup.add(moonMesh);
      } else if (planet.id === 'mars') {
        mat = new THREE.MeshStandardMaterial({
          map: marsTex,
          roughness: 0.6,
          emissive: new THREE.Color(0x550a00),
          emissiveIntensity: 0.2,
        });
      } else if (planet.id === 'jupiter') {
        mat = new THREE.MeshStandardMaterial({
          map: jupiterTex,
          roughness: 0.6,
          emissive: new THREE.Color(0x3d1a00),
          emissiveIntensity: 0.25,
        });
      } else if (planet.id === 'venus') {
        mat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(planet.color),
          roughness: 0.4,
          metalness: 0.2,
          emissive: new THREE.Color(0x664400),
          emissiveIntensity: 0.35,
        });
      } else if (planet.id === 'uranus') {
        mat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(planet.color),
          roughness: 0.35,
          metalness: 0.1,
          emissive: new THREE.Color(0x005544),
          emissiveIntensity: 0.3,
        });
      } else if (planet.id === 'neptune') {
        mat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(planet.color),
          roughness: 0.35,
          metalness: 0.1,
          emissive: new THREE.Color(0x001a66),
          emissiveIntensity: 0.3,
        });
      } else {
        mat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(planet.color),
          roughness: 0.6,
          metalness: 0.1,
          emissive: new THREE.Color(planet.color).multiplyScalar(0.2),
          emissiveIntensity: 0.2,
        });
      }

      const sphereGeo = new THREE.SphereGeometry(radius, 32, 32);
      const planetMesh = new THREE.Mesh(sphereGeo, mat);
      planetGroup.add(planetMesh);

      // Saturn Rings
      if (planet.hasRings) {
        const ringGeo = new THREE.RingGeometry(radius * 1.4, radius * 2.8, 64);
        const uvs = ringGeo.attributes.uv;
        const pos = ringGeo.attributes.position;
        for (let i = 0; i < pos.count; i++) {
          const vx = pos.getX(i);
          const vy = pos.getY(i);
          const dist = Math.sqrt(vx * vx + vy * vy);
          const normalized = (dist - radius * 1.4) / (radius * 1.4);
          uvs.setXY(i, normalized, 0.5);
        }
        uvs.needsUpdate = true;

        const ringMat = new THREE.MeshStandardMaterial({
          map: saturnRingTex,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.98,
          roughness: 0.7,
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.PI / 2.3;
        planetGroup.add(ringMesh);
      }

      const dist = scaleMode === 'aesthetic' ? planet.orbitalDistanceRender : planet.orbitalRadiusAU * 12;
      planetGroup.position.set(dist, 0, 0);

      scene.add(planetGroup);
      planetMeshesRef.current.set(planet.id, planetGroup);

      if (planet.id !== 'sun') {
        const orbitCurve = new THREE.EllipseCurve(0, 0, dist, dist, 0, 2 * Math.PI, false, 0);
        const points = orbitCurve.getPoints(120);
        const orbitGeo = new THREE.BufferGeometry().setFromPoints(
          points.map((p) => new THREE.Vector3(p.x, 0, p.y))
        );
        const orbitMat = new THREE.LineBasicMaterial({
          color: new THREE.Color(planet.color),
          transparent: true,
          opacity: 0.35,
        });
        const orbitLine = new THREE.Line(orbitGeo, orbitMat);
        scene.add(orbitLine);
        orbitLinesRef.current.push(orbitLine);
      }
    });

    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      cameraSphericalRef.current.theta -= deltaX * 0.006;
      cameraSphericalRef.current.phi = Math.max(
        0.1,
        Math.min(Math.PI / 2 - 0.05, cameraSphericalRef.current.phi - deltaY * 0.006)
      );

      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const handleWheel = (e: WheelEvent) => {
      cameraSphericalRef.current.radius = Math.max(
        12,
        Math.min(300, cameraSphericalRef.current.radius + e.deltaY * 0.1)
      );
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    dom.addEventListener('wheel', handleWheel, { passive: true });

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (e: MouseEvent) => {
      const rect = dom.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        let currentObj: THREE.Object3D | null = intersects[0].object;
        while (currentObj && currentObj.parent !== scene) {
          currentObj = currentObj.parent;
        }
        if (currentObj && planetMeshesRef.current.has(currentObj.name)) {
          const found = SOLAR_SYSTEM_DATA.find((p) => p.id === currentObj!.name);
          if (found) {
            setSelectedPlanet(found);
          }
        }
      }
    };
    dom.addEventListener('click', handleClick);

    let frameId = 0;
    const clock = new THREE.Clock();
    let simTime = 0;

    const tick = () => {
      frameId = requestAnimationFrame(tick);
      const delta = clock.getDelta();

      if (isPlaying) {
        simTime += delta * speedMultiplier * 0.4;
      }

      SOLAR_SYSTEM_DATA.forEach((planet) => {
        const group = planetMeshesRef.current.get(planet.id);
        if (!group) return;

        group.children[0].rotation.y += (24 / (Math.abs(planet.rotationPeriodHours) || 24)) * delta * 0.5;

        if (planet.id !== 'sun' && planet.orbitalPeriodDays > 0) {
          const dist = scaleMode === 'aesthetic' ? planet.orbitalDistanceRender : planet.orbitalRadiusAU * 12;
          const orbitalSpeed = (365.25 / planet.orbitalPeriodDays) * 0.2;
          const angle = simTime * orbitalSpeed + planet.orbitalDistanceRender;

          group.position.x = Math.cos(angle) * dist;
          group.position.z = Math.sin(angle) * dist;

          if (planet.id === 'earth') {
            const moon = group.getObjectByName('moon');
            if (moon) {
              const moonAngle = simTime * 2.5;
              moon.position.x = Math.cos(moonAngle) * 2.6;
              moon.position.z = Math.sin(moonAngle) * 2.6;
            }
          }
        }
      });

      if (selectedPlanet) {
        const targetGroup = planetMeshesRef.current.get(selectedPlanet.id);
        if (targetGroup) {
          targetLookAtRef.current.copy(targetGroup.position);
          const offsetDist = selectedPlanet.radiusRender * 3.8 + 6;
          targetCamPosRef.current.set(
            targetGroup.position.x + offsetDist * 0.7,
            targetGroup.position.y + offsetDist * 0.5,
            targetGroup.position.z + offsetDist * 0.8
          );
        }
      } else {
        targetLookAtRef.current.set(0, 0, 0);
        const { radius, theta, phi } = cameraSphericalRef.current;
        targetCamPosRef.current.set(
          radius * Math.sin(phi) * Math.sin(theta),
          radius * Math.cos(phi),
          radius * Math.sin(phi) * Math.cos(theta)
        );
      }

      camera.position.lerp(targetCamPosRef.current, 0.05);
      camera.lookAt(targetLookAtRef.current);

      renderer.render(scene, camera);
    };

    tick();

    const handleResize = () => {
      if (!mountRef.current || !renderer || !camera) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      dom.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      dom.removeEventListener('wheel', handleWheel);
      dom.removeEventListener('click', handleClick);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      starGeo.dispose();
    };
  }, [scaleMode]);

  useEffect(() => {
    orbitLinesRef.current.forEach((line) => {
      line.visible = showOrbits;
    });
  }, [showOrbits]);

  const resetCameraView = () => {
    setSelectedPlanet(null);
    cameraSphericalRef.current = { radius: 100, theta: Math.PI / 4, phi: Math.PI / 3 };
  };

  const setTopDownView = () => {
    setSelectedPlanet(null);
    cameraSphericalRef.current = { radius: 140, theta: 0, phi: 0.1 };
  };

  return (
    <div className="relative w-full h-[calc(100vh-64px)] bg-slate-950 overflow-hidden select-none">
      <div ref={mountRef} className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing" />

      {/* Top Overlay Badge */}
      <div className="absolute top-4 left-6 z-10 flex items-center gap-3 pointer-events-none">
        <div className="px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-cyan-500/30 backdrop-blur-md shadow-lg shadow-black/40">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs uppercase tracking-widest text-cyan-300 font-mono font-bold">VIBRANT 3D SOLAR EXPLORER</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Click any celestial body to focus • Drag to orbit • Scroll to zoom</p>
        </div>
      </div>

      {/* Right Flank Planet Quick Picker with vibrant color swatches */}
      <div className="absolute top-4 right-6 z-10 hidden lg:flex flex-col gap-1.5 bg-slate-900/80 border border-slate-800/80 p-2 rounded-2xl backdrop-blur-md shadow-xl max-h-[75vh] overflow-y-auto">
        <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 px-2 py-1 font-semibold">
          Celestial Bodies
        </span>
        {SOLAR_SYSTEM_DATA.map((p) => {
          const isSelected = selectedPlanet?.id === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setSelectedPlanet(p)}
              className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition text-left cursor-pointer ${
                isSelected
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <span
                className="w-3 h-3 rounded-full flex-shrink-0 shadow-md"
                style={{ backgroundColor: p.color, boxShadow: `0 0 8px ${p.color}` }}
              />
              <span className="truncate">{p.name.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Detailed Planet Dossier Modal */}
      {selectedPlanet && (
        <div className="absolute top-4 left-6 md:left-8 z-20 w-[90vw] max-w-md bg-slate-900/95 border border-cyan-500/40 rounded-2xl p-5 backdrop-blur-xl shadow-2xl shadow-cyan-950/50 animate-in fade-in slide-in-from-left duration-300 max-h-[85vh] overflow-y-auto">
          <div className="flex items-start justify-between pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="w-3.5 h-3.5 rounded-full shadow-md"
                  style={{ backgroundColor: selectedPlanet.color, boxShadow: `0 0 10px ${selectedPlanet.color}` }}
                />
                <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
                  {selectedPlanet.type}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white mt-1">{selectedPlanet.name}</h2>
            </div>
            <button
              onClick={() => setSelectedPlanet(null)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed mt-3">
            {selectedPlanet.description}
          </p>

          <div className="grid grid-cols-2 gap-2 mt-4 text-xs font-mono">
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase">Mean Radius</span>
              <span className="text-slate-200 font-semibold">{selectedPlanet.radiusKm.toLocaleString()} km</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase">Distance from Sun</span>
              <span className="text-slate-200 font-semibold">{selectedPlanet.orbitalRadiusAU} AU</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase">Surface Gravity</span>
              <span className="text-slate-200 font-semibold">{selectedPlanet.surfaceGravityMs2} m/s²</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase">Mean Temperature</span>
              <span className="text-slate-200 font-semibold">{selectedPlanet.meanTempC}°C</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase">Orbital Period</span>
              <span className="text-slate-200 font-semibold">
                {selectedPlanet.orbitalPeriodDays > 0 ? `${selectedPlanet.orbitalPeriodDays} Earth days` : 'Center of System'}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase">Moons Count</span>
              <span className="text-slate-200 font-semibold">{selectedPlanet.moonsCount} known moons</span>
            </div>
          </div>

          {selectedPlanet.atmosphericGases.length > 0 && (
            <div className="mt-4">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold block mb-2">
                Atmospheric Composition
              </span>
              <div className="space-y-1.5">
                {selectedPlanet.atmosphericGases.map((gas, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-[11px] font-mono text-slate-300 mb-0.5">
                      <span>{gas.gas}</span>
                      <span>{gas.percentage}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cyan-400 rounded-full"
                        style={{ width: `${Math.min(100, gas.percentage)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedPlanet.keyMissions.length > 0 && (
            <div className="mt-4">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold block mb-1.5">
                Notable Robotic Missions
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedPlanet.keyMissions.map((m, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md bg-slate-800 text-cyan-300 border border-slate-700 text-[10px] font-mono"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          )}

          {selectedPlanet.funFacts.length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-800">
              <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-semibold block mb-1">
                Astrophysics Fun Fact
              </span>
              <p className="text-xs text-slate-300 italic">
                "{selectedPlanet.funFacts[0]}"
              </p>
            </div>
          )}

          <div className="mt-4 pt-2">
            <button
              onClick={resetCameraView}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Back to Solar System Overview</span>
            </button>
          </div>
        </div>
      )}

      {/* Sleek Collapsible Bottom Dock */}
      <div className={`absolute bottom-5 left-1/2 -translate-x-1/2 z-20 transition-all duration-300 ${isCinemaMode ? 'translate-y-[calc(100%+20px)]' : 'translate-y-0'}`}>
        <div className="relative">
          <button
            onClick={() => setIsCinemaMode(!isCinemaMode)}
            className="absolute -top-8 left-1/2 -translate-x-1/2 px-3 py-1 rounded-t-lg bg-slate-900/90 border-t border-x border-slate-700 text-[11px] font-mono text-slate-400 hover:text-white transition flex items-center gap-1 cursor-pointer backdrop-blur-sm"
          >
            {isCinemaMode ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            <span>{isCinemaMode ? 'Show Controls' : 'Cinema Mode'}</span>
          </button>

          <div className="flex flex-wrap items-center justify-center gap-3 px-5 py-3 rounded-2xl bg-slate-900/90 border border-slate-700/70 backdrop-blur-xl shadow-2xl max-w-[94vw] md:max-w-4xl text-slate-200">
            <div className="flex items-center gap-2 pr-3 border-r border-slate-800">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 transition cursor-pointer"
                title={isPlaying ? 'Pause Simulation' : 'Resume Simulation'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>

              <div className="flex items-center gap-1">
                {[0.5, 1, 5, 20].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setSpeedMultiplier(spd)}
                    className={`px-2 py-1 rounded-md text-[11px] font-mono font-medium transition cursor-pointer ${
                      speedMultiplier === spd
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-1.5 pr-3 border-r border-slate-800">
              <button
                onClick={resetCameraView}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 hover:text-white font-medium transition flex items-center gap-1.5 cursor-pointer"
                title="Default Perspective"
              >
                <Compass className="w-3.5 h-3.5 text-cyan-400" />
                <span>Default</span>
              </button>
              <button
                onClick={setTopDownView}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 hover:text-white font-medium transition flex items-center gap-1.5 cursor-pointer"
                title="Top Down Orbital View"
              >
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>Top Down</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showOrbits}
                  onChange={(e) => setShowOrbits(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0 cursor-pointer"
                />
                <span>Orbits</span>
              </label>

              <button
                onClick={() => setScaleMode(scaleMode === 'aesthetic' ? 'realistic' : 'aesthetic')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] font-mono text-cyan-300 transition cursor-pointer"
                title="Toggle distance scale mode"
              >
                Scale: <span className="text-white capitalize">{scaleMode}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {isCinemaMode && (
        <button
          onClick={() => setIsCinemaMode(false)}
          className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-full bg-slate-900/90 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-semibold shadow-xl backdrop-blur-md flex items-center gap-2 cursor-pointer hover:bg-slate-800"
        >
          <ChevronUp className="w-4 h-4" />
          <span>Show Solar Controls</span>
        </button>
      )}
    </div>
  );
};
