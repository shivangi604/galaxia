import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { sound } from '../utils/soundEffects';
import { Rocket, FastForward, Volume2, VolumeX } from 'lucide-react';

interface RocketLaunchIntroProps {
  onLaunchComplete: () => void;
}

export const RocketLaunchIntro: React.FC<RocketLaunchIntroProps> = ({ onLaunchComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [countdown, setCountdown] = useState<number | null>(4);
  const [launchPhase, setLaunchPhase] = useState<'hold' | 'igniting' | 'ascending' | 'boom'>('hold');
  const [isMuted, setIsMuted] = useState(false);
  const hasTriggeredBoom = useRef(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Detect software WebGL
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
    scene.background = new THREE.Color(0x020617);
    scene.fog = new THREE.FogExp2(0x020617, 0.015);

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    // Low camera angle looking up from spectator ground level
    camera.position.set(0, 5, 45);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    containerRef.current.appendChild(renderer.domElement);

    // 1. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0x1e293b, 0.8);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x0f172a, 0.5);
    scene.add(hemiLight);

    // Launchpad searchlights illuminating the rocket
    const padLight1 = new THREE.SpotLight(0xffedd5, 15, 80, Math.PI / 6, 0.4);
    padLight1.position.set(-18, 2, 15);
    scene.add(padLight1);

    const padLight2 = new THREE.SpotLight(0xbae6fd, 15, 80, Math.PI / 6, 0.4);
    padLight2.position.set(18, 2, 15);
    scene.add(padLight2);

    // Engine glow light (dynamic)
    const engineLight = new THREE.PointLight(0xff5500, 0, 50);
    scene.add(engineLight);

    // 2. Stars field
    const starGeo = new THREE.BufferGeometry();
    const starCount = 1200;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPos[i] = (Math.random() - 0.5) * 400;
      starPos[i + 1] = Math.random() * 200 + 10;
      starPos[i + 2] = (Math.random() - 0.5) * 400;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.8, transparent: true, opacity: 0.8 });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // 3. Ground / Launch Complex Floor
    const groundGeo = new THREE.PlaneGeometry(300, 300);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x0b0f19,
      roughness: 0.9,
      metalness: 0.1,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    scene.add(ground);

    // Launchpad Pedestal & Gantry Tower
    const padBaseGeo = new THREE.CylinderGeometry(8, 10, 2, 16);
    const padBaseMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.7, metalness: 0.5 });
    const padBase = new THREE.Mesh(padBaseGeo, padBaseMat);
    padBase.position.set(0, 1, 0);
    scene.add(padBase);

    // Gantry Tower (Lattice truss assembly)
    const towerGroup = new THREE.Group();
    const columnGeo = new THREE.BoxGeometry(0.8, 38, 0.8);
    const columnMat = new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.6, metalness: 0.4 });
    const col1 = new THREE.Mesh(columnGeo, columnMat);
    col1.position.set(-6, 20, -5);
    const col2 = new THREE.Mesh(columnGeo, columnMat);
    col2.position.set(-6, 20, 5);
    towerGroup.add(col1, col2);

    // Tower platforms and swing arm
    for (let h = 8; h <= 34; h += 6) {
      const platGeo = new THREE.BoxGeometry(4, 0.4, 12);
      const plat = new THREE.Mesh(platGeo, columnMat);
      plat.position.set(-6, h, 0);
      towerGroup.add(plat);
    }
    const swingArmGeo = new THREE.BoxGeometry(7, 0.6, 1.2);
    const swingArm = new THREE.Mesh(swingArmGeo, columnMat);
    swingArm.position.set(-2.5, 30, 0);
    towerGroup.add(swingArm);
    scene.add(towerGroup);

    // 4. Hero Rocket Model (Procedural Multi-Part THREE.Group)
    const rocket = new THREE.Group();
    rocket.position.set(0, 2, 0); // Sits right on the pad base

    // Stage 1 Main Booster Core
    const boosterGeo = new THREE.CylinderGeometry(1.6, 1.8, 18, 32);
    const whiteHullMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3, metalness: 0.2 });
    const booster = new THREE.Mesh(boosterGeo, whiteHullMat);
    booster.position.y = 10;
    rocket.add(booster);

    // Interstage Ring (Black/Titanium)
    const interstageGeo = new THREE.CylinderGeometry(1.6, 1.6, 1.5, 32);
    const darkHullMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4, metalness: 0.8 });
    const interstage = new THREE.Mesh(interstageGeo, darkHullMat);
    interstage.position.y = 19.5;
    rocket.add(interstage);

    // Stage 2 Core
    const stage2Geo = new THREE.CylinderGeometry(1.6, 1.6, 8, 32);
    const stage2 = new THREE.Mesh(stage2Geo, whiteHullMat);
    stage2.position.y = 24.2;
    rocket.add(stage2);

    // Payload Fairing Nose Cone
    const noseGeo = new THREE.ConeGeometry(1.6, 6, 32);
    const nose = new THREE.Mesh(noseGeo, whiteHullMat);
    nose.position.y = 31.2;
    rocket.add(nose);

    // 4 Aerodynamic Grid Fins / Stabilizers
    for (let i = 0; i < 4; i++) {
      const finShape = new THREE.Shape();
      finShape.moveTo(0, 0);
      finShape.lineTo(2.2, -1.8);
      finShape.lineTo(2.2, 0);
      finShape.lineTo(0, 3.5);
      finShape.closePath();

      const extrudeSettings = { depth: 0.15, bevelEnabled: false };
      const finGeo = new THREE.ExtrudeGeometry(finShape, extrudeSettings);
      const finMesh = new THREE.Mesh(finGeo, darkHullMat);
      finMesh.rotation.y = (i * Math.PI) / 2;
      finMesh.position.set(0, 2.5, 0);
      rocket.add(finMesh);
    }

    // Rocket Nozzles
    const nozzleGeo = new THREE.CylinderGeometry(0.5, 0.9, 1.4, 16);
    const nozzleMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2, metalness: 0.9 });
    for (let dx of [-0.6, 0.6]) {
      for (let dz of [-0.6, 0.6]) {
        const nozzle = new THREE.Mesh(nozzleGeo, nozzleMat);
        nozzle.position.set(dx, 0.5, dz);
        rocket.add(nozzle);
      }
    }
    scene.add(rocket);

    padLight1.target = rocket;
    padLight2.target = rocket;

    // 5. Spectators Silhouette Group in foreground!
    const spectatorsGroup = new THREE.Group();
    spectatorsGroup.position.set(0, 0, 36);

    const spectatorMat = new THREE.MeshBasicMaterial({ color: 0x050811 }); // Crisp dark silhouette against launch glare

    // Viewing barrier / fence
    const railingGeo = new THREE.BoxGeometry(35, 0.1, 0.1);
    const postGeo = new THREE.CylinderGeometry(0.06, 0.06, 1.4, 8);
    const railing = new THREE.Mesh(railingGeo, spectatorMat);
    railing.position.set(0, 1.3, 0);
    spectatorsGroup.add(railing);
    for (let px = -16; px <= 16; px += 4) {
      const post = new THREE.Mesh(postGeo, spectatorMat);
      post.position.set(px, 0.7, 0);
      spectatorsGroup.add(post);
    }

    // Spectator figures (3-5 distinct silhouettes with heads, torsos, and raised arms pointing toward rocket)
    const spectatorPositions = [
      { x: -7, scale: 1.0, armAngle: 0.6 },
      { x: -4, scale: 0.95, armAngle: 0.9 },
      { x: -1.5, scale: 0.8, armAngle: 0.4 }, // child
      { x: 2, scale: 1.05, armAngle: 0.8 },
      { x: 5, scale: 0.9, armAngle: 0.5 },
      { x: 8, scale: 1.0, armAngle: 0.7 },
    ];

    spectatorPositions.forEach((spec) => {
      const person = new THREE.Group();
      person.position.set(spec.x, 0, (Math.random() - 0.5) * 1.5);
      person.scale.set(spec.scale, spec.scale, spec.scale);

      // Body (capsule / cylinder)
      const bodyGeo = new THREE.CylinderGeometry(0.35, 0.3, 1.6, 12);
      const body = new THREE.Mesh(bodyGeo, spectatorMat);
      body.position.y = 0.9;
      person.add(body);

      // Head
      const headGeo = new THREE.SphereGeometry(0.24, 12, 12);
      const head = new THREE.Mesh(headGeo, spectatorMat);
      head.position.y = 1.95;
      person.add(head);

      // Raised arm pointing at the rocket
      const armGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.9, 8);
      const arm = new THREE.Mesh(armGeo, spectatorMat);
      arm.rotation.z = -spec.armAngle;
      arm.rotation.x = -0.4;
      arm.position.set(0.4, 1.5, -0.2);
      person.add(arm);

      spectatorsGroup.add(person);
    });
    scene.add(spectatorsGroup);

    // 6. Volumetric Launch Smoke & Flame Particles
    const particleCount = 180;
    const smokeGeo = new THREE.BufferGeometry();
    const smokePos = new Float32Array(particleCount * 3);
    const smokeVel: { x: number; y: number; z: number; life: number; maxLife: number; scale: number }[] = [];

    for (let i = 0; i < particleCount; i++) {
      smokePos[i * 3] = 0;
      smokePos[i * 3 + 1] = 0;
      smokePos[i * 3 + 2] = 0;
      smokeVel.push({
        x: (Math.random() - 0.5) * 0.4,
        y: -(Math.random() * 0.4 + 0.1),
        z: (Math.random() - 0.5) * 0.4,
        life: Math.random() * 50,
        maxLife: 40 + Math.random() * 30,
        scale: 1.0,
      });
    }
    smokeGeo.setAttribute('position', new THREE.BufferAttribute(smokePos, 3));
    const smokeMat = new THREE.PointsMaterial({
      color: 0xff6600,
      size: 4.5,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const smokeParticles = new THREE.Points(smokeGeo, smokeMat);
    scene.add(smokeParticles);

    // Animation state
    let frameId = 0;
    let clock = new THREE.Clock();
    let velocityY = 0;
    let accelerationY = 0;
    let rocketY = 2;
    let cameraShake = 0;
    let launchStartTime = 0;
    let phase = 'hold';

    // Countdown timer sequence
    let count = 3;
    const interval = setInterval(() => {
      if (count > 0) {
        sound.playBeep(800 + (3 - count) * 120, 0.18);
        setCountdown(count);
        count--;
      } else if (count === 0) {
        setCountdown(0);
        phase = 'igniting';
        setLaunchPhase('igniting');
        sound.playIgnitionRoar(4);
        launchStartTime = clock.getElapsedTime();
        count--;
      } else {
        clearInterval(interval);
      }
    }, 1000);

    // Render loop
    const tick = () => {
      frameId = requestAnimationFrame(tick);
      const elapsed = clock.getElapsedTime();

      // Searchlight sweeps
      padLight1.position.x = -18 + Math.sin(elapsed * 0.7) * 4;
      padLight2.position.x = 18 - Math.sin(elapsed * 0.7) * 4;

      if (phase === 'igniting') {
        const igniteTime = elapsed - launchStartTime;
        engineLight.intensity = Math.min(igniteTime * 80, 100);
        cameraShake = 0.08;

        if (igniteTime > 1.2) {
          phase = 'ascending';
          setLaunchPhase('ascending');
          accelerationY = 0.025;
        }
      }

      if (phase === 'ascending') {
        velocityY += accelerationY;
        rocketY += velocityY;
        rocket.position.y = rocketY;

        engineLight.position.set(0, rocketY, 0);
        engineLight.intensity = 120 + Math.sin(elapsed * 40) * 30;

        cameraShake = Math.min(0.25, 0.05 + velocityY * 0.15);

        // Camera tracks the ascending rocket smoothly
        camera.lookAt(0, rocketY * 0.7 + 5, 0);

        // Trigger BOOM at height
        if (rocketY > 60 && !hasTriggeredBoom.current) {
          hasTriggeredBoom.current = true;
          setLaunchPhase('boom');
          sound.playBlastoffBoom();

          setTimeout(() => {
            onLaunchComplete();
          }, 1100);
        }
      }

      // Camera vibration shake effect during launch
      if (cameraShake > 0.001) {
        camera.position.x = (Math.random() - 0.5) * cameraShake * 2;
        camera.position.y = 5 + (Math.random() - 0.5) * cameraShake * 2;
      }

      // Update engine smoke / flame particles
      if (phase === 'igniting' || phase === 'ascending') {
        const posAttr = smokeGeo.attributes.position as THREE.BufferAttribute;
        for (let i = 0; i < particleCount; i++) {
          const v = smokeVel[i];
          v.life++;

          if (v.life > v.maxLife) {
            v.life = 0;
            posAttr.setXYZ(
              i,
              (Math.random() - 0.5) * 1.5,
              rocketY - 0.2,
              (Math.random() - 0.5) * 1.5
            );
            v.x = (Math.random() - 0.5) * 0.8;
            v.y = -(Math.random() * 1.2 + 0.4);
            v.z = (Math.random() - 0.5) * 0.8;
          } else {
            const curX = posAttr.getX(i);
            const curY = posAttr.getY(i);
            const curZ = posAttr.getZ(i);
            posAttr.setXYZ(i, curX + v.x, curY + v.y, curZ + v.z);
          }
        }
        posAttr.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    tick();

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      groundGeo.dispose();
      padBaseGeo.dispose();
      boosterGeo.dispose();
      noseGeo.dispose();
      starGeo.dispose();
      smokeGeo.dispose();
    };
  }, [onLaunchComplete]);

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    sound.setMuted(nextMuted);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 select-none">
      {/* 3D Canvas Mount */}
      <div ref={containerRef} className="absolute inset-0 z-0" />

      {/* Atmospheric vignette & spectator overlay frame */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40" />

      {/* Top Bar Controls */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-30">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-cyan-500/30 text-cyan-400 backdrop-blur-md shadow-lg shadow-cyan-950/40">
            <Rocket className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest text-cyan-400 font-mono font-bold">GALAXIA LAUNCH COMPLEX</span>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-cyan-950/80 border border-cyan-800 text-cyan-300 rounded">PAD 39A</span>
            </div>
            <h1 className="text-lg font-bold text-white tracking-wide">Mission Liftoff Sequence</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleMute}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white text-xs font-medium transition cursor-pointer backdrop-blur-md"
            title="Toggle audio effects"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
            <span>{isMuted ? 'Unmute' : 'Mute'}</span>
          </button>

          <button
            onClick={onLaunchComplete}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-300 hover:text-white font-mono text-xs font-semibold uppercase tracking-wider transition cursor-pointer backdrop-blur-md shadow-lg shadow-cyan-950/50"
          >
            <FastForward className="w-4 h-4" />
            <span>Skip to Galaxia</span>
          </button>
        </div>
      </div>

      {/* Center Countdown & Telemetry HUD */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
        {countdown !== null && countdown > 0 && (
          <div className="flex flex-col items-center transition-all duration-300 transform scale-110">
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-cyan-400 mb-2 font-bold">
              IGNITION COUNTDOWN
            </span>
            <div className="w-28 h-28 rounded-full border-2 border-cyan-500/40 bg-slate-900/80 backdrop-blur-md flex items-center justify-center shadow-2xl shadow-cyan-500/30">
              <span className="text-6xl font-black font-mono text-cyan-300">
                T-{countdown}
              </span>
            </div>
            <span className="text-xs font-mono text-slate-400 mt-4 tracking-wider">
              Spectator Gallery Ready • All Systems Go
            </span>
          </div>
        )}

        {launchPhase === 'igniting' && (
          <div className="flex flex-col items-center animate-bounce">
            <span className="px-5 py-2 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-300 font-mono text-xl font-black tracking-widest shadow-xl shadow-amber-500/30">
              ENGINE IGNITION • THROTTLE 100%
            </span>
          </div>
        )}

        {launchPhase === 'ascending' && (
          <div className="flex flex-col items-center">
            <span className="px-6 py-2.5 rounded-full bg-cyan-500/20 border border-cyan-400 text-cyan-300 font-mono text-2xl font-black tracking-widest shadow-2xl shadow-cyan-500/40">
              LIFTOFF! CLEARING THE TOWER
            </span>
            <span className="text-xs font-mono text-cyan-400/80 mt-2 tracking-widest animate-pulse">
              ACCELERATING TO ESCAPE VELOCITY...
            </span>
          </div>
        )}

        {/* Explosive Hyper-drive Boom Transition */}
        {launchPhase === 'boom' && (
          <div className="absolute inset-0 bg-white flex items-center justify-center transition-opacity duration-700 animate-pulse">
            <div className="text-center">
              <div className="text-4xl md:text-6xl font-black font-mono text-slate-950 tracking-wider">
                BOOM!
              </div>
              <div className="text-lg md:text-2xl font-bold font-mono text-cyan-700 uppercase tracking-widest mt-2">
                MAX-Q • ORBITAL REACH ACHIEVED
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Crowd Banner Label */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none text-center">
        <div className="px-4 py-1.5 rounded-full bg-slate-900/70 border border-slate-700/50 text-slate-400 text-xs font-mono backdrop-blur-sm">
          Watching from Public Causeway • Stargazers & Students Witnessing Liftoff
        </div>
      </div>
    </div>
  );
};
