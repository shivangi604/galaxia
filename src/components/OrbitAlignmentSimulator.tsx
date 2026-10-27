import React, { useState, useEffect, useRef } from 'react';
import { sound } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import {
  Compass,
  RotateCcw,
  Rocket,
  CheckCircle2,
  AlertTriangle,
  Info,
  Calendar,
  Gauge,
  ArrowRight
} from 'lucide-react';

interface TransferResult {
  status: 'idle' | 'in_transit' | 'success' | 'missed';
  distanceErrorKm?: number;
  message?: string;
  deltaVTotal?: number;
}

export const OrbitAlignmentSimulator: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [targetPlanet, setTargetPlanet] = useState<'mars' | 'venus' | 'jupiter'>('mars');
  const [dayOffset, setDayOffset] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [transferState, setTransferState] = useState<TransferResult>({ status: 'idle' });
  const [probeProgress, setProbeProgress] = useState<number>(0); // 0 to 1 along transfer ellipse

  // Target planet orbital parameters
  const targets = {
    mars: {
      name: 'Mars (Ares)',
      distanceAU: 1.524,
      periodDays: 687,
      color: '#ef4444',
      optimalAngleDeg: 44.3, // Earth must lag Mars by ~44.3 degrees
      transferDays: 259,
      deltaV1: 2.95, // km/s from LEO
      deltaV2: 2.65,
      synodicDays: 780, // ~26 months
      description: 'Transfer from Earth (1.0 AU) to Mars (1.52 AU). Minimum energy Hohmann ellipse.',
    },
    venus: {
      name: 'Venus (Aphrodite)',
      distanceAU: 0.723,
      periodDays: 224.7,
      color: '#eab308',
      optimalAngleDeg: -54.2, // Earth must lead Venus by ~54 degrees
      transferDays: 146,
      deltaV1: 2.50,
      deltaV2: 2.70,
      synodicDays: 584,
      description: 'Inward Hohmann transfer down the Sun’s gravity well to Venus (0.72 AU).',
    },
    jupiter: {
      name: 'Jupiter (Jovian King)',
      distanceAU: 5.204,
      periodDays: 4332.6,
      color: '#f97316',
      optimalAngleDeg: 97.4,
      transferDays: 998,
      deltaV1: 8.80,
      deltaV2: 5.64,
      synodicDays: 399,
      description: 'Outer solar system transfer across the asteroid belt to giant Jupiter.',
    },
  };

  const currentTarget = targets[targetPlanet];

  // Calculate planetary angles at given day
  const earthAngleRad = ((dayOffset % 365.25) / 365.25) * 2 * Math.PI;
  const targetAngleRad = ((dayOffset % currentTarget.periodDays) / currentTarget.periodDays) * 2 * Math.PI;

  // Relative Phase Angle in degrees [-180, 180]
  let phaseAngleDeg = ((targetAngleRad - earthAngleRad) * 180) / Math.PI;
  while (phaseAngleDeg > 180) phaseAngleDeg -= 360;
  while (phaseAngleDeg < -180) phaseAngleDeg += 360;

  const angleDiff = Math.abs(phaseAngleDeg - currentTarget.optimalAngleDeg);
  const isOptimalWindow = angleDiff < 6.0;

  // Auto-play time progression
  useEffect(() => {
    let animId: number;
    if (isPlaying) {
      const interval = setInterval(() => {
        setDayOffset((prev) => (prev + 2) % 2000);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  // Handle probe flight animation
  useEffect(() => {
    if (transferState.status === 'in_transit') {
      let currentP = 0;
      const timer = setInterval(() => {
        currentP += 0.015;
        if (currentP >= 1.0) {
          clearInterval(timer);
          setProbeProgress(1.0);
          // Evaluate success
          if (isOptimalWindow) {
            setTransferState({
              status: 'success',
              distanceErrorKm: Math.round(angleDiff * 84000),
              message: `Precision Rendezvous Confirmed! Spacecraft inserted into ${currentTarget.name} orbit with optimal fuel expenditure!`,
              deltaVTotal: Number((currentTarget.deltaV1 + currentTarget.deltaV2).toFixed(2)),
            });
            sound.playSuccessChime();
            confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
          } else {
            setTransferState({
              status: 'missed',
              distanceErrorKm: Math.round(angleDiff * 2100000),
              message: `Trajectory Missed! Launched with phase error of ${angleDiff.toFixed(1)}°. The target was not at the intercept coordinates upon arrival.`,
            });
            sound.playErrorBuzz();
          }
        } else {
          setProbeProgress(currentP);
        }
      }, 35);

      return () => clearInterval(timer);
    }
  }, [transferState.status, isOptimalWindow]);

  // Draw 2D Interactive Orbital Mechanics Diagram
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const cx = width / 2;
    const cy = height / 2;

    ctx.clearRect(0, 0, width, height);

    // Deep cosmic background grid
    ctx.fillStyle = '#030712';
    ctx.fillRect(0, 0, width, height);

    // Star background
    ctx.fillStyle = '#334155';
    for (let i = 0; i < 60; i++) {
      const sx = (Math.sin(i * 123.4) * 0.5 + 0.5) * width;
      const sy = (Math.cos(i * 321.7) * 0.5 + 0.5) * height;
      ctx.fillRect(sx, sy, 1.5, 1.5);
    }

    const scale = targetPlanet === 'jupiter' ? 38 : 120;
    const rEarth = 1.0 * scale;
    const rTarget = currentTarget.distanceAU * scale;

    // Sun at center
    ctx.beginPath();
    const sunGrad = ctx.createRadialGradient(cx, cy, 3, cx, cy, 18);
    sunGrad.addColorStop(0, '#ffffff');
    sunGrad.addColorStop(0.3, '#fde047');
    sunGrad.addColorStop(1, 'rgba(234, 88, 12, 0)');
    ctx.fillStyle = sunGrad;
    ctx.arc(cx, cy, 18, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(cx, cy, 9, 0, Math.PI * 2);
    ctx.fill();

    // Earth Orbit Ring
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, rEarth, 0, Math.PI * 2);
    ctx.stroke();

    // Target Planet Orbit Ring
    ctx.strokeStyle = currentTarget.color + '88';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, rTarget, 0, Math.PI * 2);
    ctx.stroke();

    // Earth Position
    const ex = cx + Math.cos(earthAngleRad) * rEarth;
    const ey = cy + Math.sin(earthAngleRad) * rEarth;

    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(ex, ey, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px monospace';
    ctx.fillText('Earth', ex + 10, ey + 4);

    // Target Planet Position
    const tx = cx + Math.cos(targetAngleRad) * rTarget;
    const ty = cy + Math.sin(targetAngleRad) * rTarget;

    ctx.fillStyle = currentTarget.color;
    ctx.beginPath();
    ctx.arc(tx, ty, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '10px monospace';
    ctx.fillText(currentTarget.name.split(' ')[0], tx + 10, ty + 4);

    // Angular connection rays to Sun to illustrate Phase Angle
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(ex, ey);
    ctx.stroke();

    ctx.strokeStyle = currentTarget.color + '66';
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(tx, ty);
    ctx.stroke();
    ctx.setLineDash([]);

    // Optimal Hohmann Transfer Ellipse Arc
    const rA = rEarth;
    const rB = rTarget;
    const semiMajorAxis = (rA + rB) / 2;
    const focalDist = Math.abs(rB - rA) / 2;

    ctx.strokeStyle = isOptimalWindow ? 'rgba(34, 197, 94, 0.7)' : 'rgba(148, 163, 184, 0.25)';
    ctx.lineWidth = 2;
    ctx.setLineDash([3, 5]);
    ctx.beginPath();
    // Ellipse center is offset from Sun along Earth's radial axis
    const ellipseCenterDist = (rB - rA) / 2;
    const ecx = cx - Math.cos(earthAngleRad) * ellipseCenterDist;
    const ecy = cy - Math.sin(earthAngleRad) * ellipseCenterDist;
    const semiMinorAxis = Math.sqrt(rA * rB);

    ctx.ellipse(
      ecx,
      ecy,
      semiMajorAxis,
      semiMinorAxis,
      earthAngleRad,
      0,
      Math.PI
    );
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw active Probe in flight
    if (transferState.status === 'in_transit' || transferState.status === 'success' || transferState.status === 'missed') {
      const probeAngle = earthAngleRad + probeProgress * Math.PI;
      const currentR = rA + (rB - rA) * Math.sin((probeProgress * Math.PI) / 2);
      const px = cx + Math.cos(probeAngle) * currentR;
      const py = cy + Math.sin(probeAngle) * currentR;

      // Probe trail
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(px, py, 4.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 9px monospace';
      ctx.fillText('PROBE', px + 7, py - 4);
    }
  }, [dayOffset, targetPlanet, transferState, probeProgress, earthAngleRad, targetAngleRad, isOptimalWindow]);

  const handleLaunch = () => {
    sound.playThruster();
    setTransferState({ status: 'in_transit' });
  };

  const handleAlignAutomatically = () => {
    // Solve day offset for optimal window
    let testDay = dayOffset;
    for (let d = 0; d < 1200; d++) {
      const testD = dayOffset + d;
      const eAng = ((testD % 365.25) / 365.25) * 2 * Math.PI;
      const tAng = ((testD % currentTarget.periodDays) / currentTarget.periodDays) * 2 * Math.PI;
      let diffDeg = ((tAng - eAng) * 180) / Math.PI;
      while (diffDeg > 180) diffDeg -= 360;
      while (diffDeg < -180) diffDeg += 360;
      if (Math.abs(diffDeg - currentTarget.optimalAngleDeg) < 1.0) {
        setDayOffset(testD);
        sound.playBeep(920, 0.15);
        break;
      }
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Title & Concept Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Compass className="w-5 h-5 text-cyan-400" />
          <span className="text-xs uppercase tracking-widest text-cyan-400 font-mono font-bold">
            ASTROPHYSICS LAB • ORBITAL MECHANICS
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wide">
          Planetary Orbit Alignment & Hohmann Transfer Simulator
        </h1>
        <p className="text-sm text-slate-400 max-w-3xl mt-1">
          In spaceflight, you cannot fly in a straight line. Spacecraft travel along Keplerian elliptical transfer orbits.
          Align the planets to open the optimal launch window and dispatch a deep space probe with minimum delta-v (fuel)!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 2D Interactive Orbital Mechanics Canvas */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl relative flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-3 text-xs font-mono">
            <span className="text-slate-400">HELIOCENTRIC ORBITAL PLANE</span>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                isOptimalWindow ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'
              }`}>
                {isOptimalWindow ? 'LAUNCH WINDOW OPEN' : 'WINDOW CLOSED'}
              </span>
            </div>
          </div>

          <div className="relative w-full aspect-square max-w-[500px] rounded-xl overflow-hidden border border-slate-800/80 shadow-inner">
            <canvas
              ref={canvasRef}
              width={520}
              height={520}
              className="w-full h-full block"
            />
          </div>

          {/* Time Scrubber */}
          <div className="w-full mt-5">
            <div className="flex items-center justify-between text-xs font-mono text-slate-300 mb-2">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                <span>Simulation Time: Day {dayOffset}</span>
              </span>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer"
              >
                {isPlaying ? 'Pause Scrubber' : 'Auto-Scrub Time'}
              </button>
            </div>
            <input
              type="range"
              min="0"
              max="1600"
              value={dayOffset}
              onChange={(e) => {
                setDayOffset(Number(e.target.value));
                setTransferState({ status: 'idle' });
              }}
              className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Right: Telemetry & Launch Controls */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Target Selector Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-2 font-semibold">
              Select Mission Destination
            </span>
            <div className="grid grid-cols-3 gap-2">
              {(['mars', 'venus', 'jupiter'] as const).map((key) => {
                const isSelected = targetPlanet === key;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      setTargetPlanet(key);
                      setTransferState({ status: 'idle' });
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition cursor-pointer border ${
                      isSelected
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60 shadow-md shadow-cyan-950/40'
                        : 'bg-slate-800/80 text-slate-400 border-slate-700/60 hover:text-white'
                    }`}
                  >
                    {key}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-slate-400 mt-3 leading-relaxed">
              {currentTarget.description}
            </p>
          </div>

          {/* Phase Angle Telemetry */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-3 font-semibold">
              Phase Angle Alignment Telemetry
            </span>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-slate-500 text-[10px] block uppercase">Current Phase Angle</span>
                <span className="text-lg font-bold text-white">{phaseAngleDeg.toFixed(1)}°</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-slate-500 text-[10px] block uppercase">Optimal Target Angle</span>
                <span className="text-lg font-bold text-cyan-400">{currentTarget.optimalAngleDeg}°</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-slate-500 text-[10px] block uppercase">Transfer Flight Time</span>
                <span className="text-sm font-semibold text-slate-200">{currentTarget.transferDays} days</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-slate-500 text-[10px] block uppercase">Total Δv Required</span>
                <span className="text-sm font-semibold text-slate-200">
                  {(currentTarget.deltaV1 + currentTarget.deltaV2).toFixed(2)} km/s
                </span>
              </div>
            </div>

            {/* Launch Status Notification */}
            <div className={`mt-4 p-3 rounded-xl border text-xs flex items-center gap-2.5 ${
              isOptimalWindow
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                : 'bg-amber-950/30 border-amber-500/30 text-amber-300'
            }`}>
              {isOptimalWindow ? (
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-400" />
              )}
              <span>
                {isOptimalWindow
                  ? 'Planets are aligned for a fuel-efficient Hohmann transfer!'
                  : `Misalignment error: ${angleDiff.toFixed(1)}°. Scrub time or auto-align to open window.`}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2.5 mt-4">
              <button
                onClick={handleAlignAutomatically}
                className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Compass className="w-4 h-4 text-cyan-400" />
                <span>Auto-Align Window</span>
              </button>

              <button
                onClick={handleLaunch}
                disabled={transferState.status === 'in_transit'}
                className="flex-1 py-2.5 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-500/20 disabled:opacity-50"
              >
                <Rocket className="w-4 h-4" />
                <span>{transferState.status === 'in_transit' ? 'Probe In Flight...' : 'Launch Probe'}</span>
              </button>
            </div>
          </div>

          {/* Mission Result Card */}
          {transferState.status !== 'idle' && transferState.status !== 'in_transit' && (
            <div className={`p-4 rounded-2xl border backdrop-blur-md animate-in fade-in duration-300 ${
              transferState.status === 'success'
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
                : 'bg-rose-950/60 border-rose-500/50 text-rose-200'
            }`}>
              <div className="flex items-center gap-2 mb-1.5">
                {transferState.status === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-rose-400" />
                )}
                <span className="font-bold text-sm tracking-wide font-mono uppercase">
                  {transferState.status === 'success' ? 'Mission Success' : 'Transfer Trajectory Failed'}
                </span>
              </div>
              <p className="text-xs leading-relaxed">{transferState.message}</p>
              {transferState.distanceErrorKm !== undefined && (
                <div className="mt-2 text-[11px] font-mono text-slate-300">
                  Intercept offset: {transferState.distanceErrorKm.toLocaleString()} km
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
