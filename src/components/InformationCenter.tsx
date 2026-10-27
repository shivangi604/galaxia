import React, { useState, useEffect, useRef } from 'react';
import { ISSTelemetry } from '../types/space';
import {
  Satellite,
  Globe2,
  Radio,
  Users,
  Compass,
  ExternalLink,
  Newspaper,
  Sparkles,
  Calendar,
  Clock,
  Layers
} from 'lucide-react';

export const InformationCenter: React.FC = () => {
  const [telemetry, setTelemetry] = useState<ISSTelemetry>({
    latitude: 28.5729,
    longitude: -80.649,
    altitude: 418.5,
    velocity: 27582,
    visibility: 'daylight',
    timestamp: Math.floor(Date.now() / 1000),
    status: 'live',
  });
  const [news, setNews] = useState<any[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const mapCanvasRef = useRef<HTMLCanvasElement>(null);

  // Astronauts aboard the ISS
  const currentExpeditionCrew = [
    { name: 'Sunita Williams', role: 'Commander', agency: 'NASA', daysInSpace: 145 },
    { name: 'Barry Wilmore', role: 'Flight Engineer', agency: 'NASA', daysInSpace: 145 },
    { name: 'Matthew Dominick', role: 'Flight Engineer', agency: 'NASA', daysInSpace: 210 },
    { name: 'Jeanette Epps', role: 'Mission Specialist', agency: 'NASA', daysInSpace: 210 },
    { name: 'Oleg Kononenko', role: 'Flight Engineer', agency: 'Roscosmos', daysInSpace: 370 },
  ];

  // Fetch live ISS telemetry every 4 seconds
  useEffect(() => {
    const fetchISS = async () => {
      try {
        const res = await fetch('/api/iss/live');
        if (res.ok) {
          const data = await res.json();
          setTelemetry(data);
        }
      } catch (err) {
        // Ephemeris fallback handled in server
      }
    };

    fetchISS();
    const interval = setInterval(fetchISS, 4000);
    return () => clearInterval(interval);
  }, []);

  // Fetch curated NASA space news
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch('/api/space/news');
        if (res.ok) {
          const data = await res.json();
          setNews(data);
        }
      } catch (e) {}
      setLoadingNews(false);
    };
    fetchNews();
  }, []);

  // Draw 2D World Map with Ground Track & ISS Marker
  useEffect(() => {
    const canvas = mapCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Ocean background
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, width, height);

    // Lat/Lon coordinate grid lines
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let x = 0; x <= width; x += width / 12) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y += height / 6) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Equator Line
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Approximate stylized world landmasses
    ctx.fillStyle = '#1e293b';
    const landmasses = [
      // North America
      { x: width * 0.22, y: height * 0.3, rx: width * 0.12, ry: height * 0.18 },
      // South America
      { x: width * 0.3, y: height * 0.65, rx: width * 0.08, ry: height * 0.2 },
      // Eurasia & Africa
      { x: width * 0.58, y: height * 0.35, rx: width * 0.2, ry: height * 0.22 },
      { x: width * 0.52, y: height * 0.6, rx: width * 0.1, ry: height * 0.18 },
      // Australia
      { x: width * 0.82, y: height * 0.72, rx: width * 0.07, ry: height * 0.1 },
    ];

    landmasses.forEach((l) => {
      ctx.beginPath();
      ctx.ellipse(l.x, l.y, l.rx, l.ry, 0, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw sinusoidal ISS orbital path (51.6 deg inclination)
    ctx.strokeStyle = 'rgba(234, 179, 8, 0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = 0; x < width; x += 4) {
      const normLon = (x / width) * 360 - 180;
      // Shift curve to pass through current ISS lon/lat
      const phase = ((normLon - telemetry.longitude) * Math.PI) / 180;
      const calcLat = Math.sin(phase) * 51.6;
      const y = ((90 - calcLat) / 180) * height;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Map ISS Lat/Lon to Canvas Coordinates
    // Longitude: -180 to 180 -> 0 to width
    // Latitude: 90 to -90 -> 0 to height
    const issX = ((telemetry.longitude + 180) / 360) * width;
    const issY = ((90 - telemetry.latitude) / 180) * height;

    // Ground footprint circle (~2,200 km horizon line)
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.35)';
    ctx.fillStyle = 'rgba(6, 182, 212, 0.08)';
    ctx.beginPath();
    ctx.arc(issX, issY, width * 0.12, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // ISS Marker Icon
    ctx.fillStyle = '#06b6d4';
    ctx.beginPath();
    ctx.arc(issX, issY, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Solar panels wings
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(issX - 12, issY);
    ctx.lineTo(issX + 12, issY);
    ctx.stroke();

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 10px monospace';
    ctx.fillText('ISS (ZARYA)', issX + 14, issY - 4);
  }, [telemetry]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Title */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1.5">
          <Satellite className="w-5 h-5 text-cyan-400" />
          <span className="text-xs uppercase tracking-widest text-cyan-400 font-mono font-bold">
            ORBITAL TELEMETRY & SPACE EXPLORATION INTELLIGENCE
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wide">
          Live Space Station & News Tracker
        </h1>
        <p className="text-sm text-slate-400 max-w-3xl mt-1">
          Real-time orbital tracking of the International Space Station, active orbital crew rosters, and curated spaceflight bulletins.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Live ISS Tracking World Map */}
        <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="text-xs font-mono font-bold uppercase text-white tracking-wider">
                ISS REAL-TIME GROUND TRACK
              </span>
            </div>
            <span className="text-[11px] font-mono text-cyan-400">
              Norad ID: 25544 • Inclination: 51.6°
            </span>
          </div>

          <div className="relative w-full aspect-[2/1] rounded-xl overflow-hidden border border-slate-800 shadow-inner bg-slate-950">
            <canvas
              ref={mapCanvasRef}
              width={700}
              height={350}
              className="w-full h-full block"
            />
          </div>

          {/* Telemetry Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase">Latitude</span>
              <span className="text-sm font-bold text-slate-100">{telemetry.latitude}°</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase">Longitude</span>
              <span className="text-sm font-bold text-slate-100">{telemetry.longitude}°</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase">Orbital Altitude</span>
              <span className="text-sm font-bold text-cyan-400">{telemetry.altitude.toFixed(1)} km</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase">Ground Speed</span>
              <span className="text-sm font-bold text-emerald-400">{Math.round(telemetry.velocity).toLocaleString()} km/h</span>
            </div>
          </div>
        </div>

        {/* Right: Astronauts in Space & Quick Stats */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800 mb-3">
              <Users className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-white">
                Humanity in Orbit • Expedition Crew
              </h3>
            </div>
            <div className="space-y-2.5">
              {currentExpeditionCrew.map((c, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-semibold text-white block">{c.name}</span>
                    <span className="text-[11px] text-slate-400">{c.role}</span>
                  </div>
                  <div className="text-right">
                    <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono text-[10px] font-bold">
                      {c.agency}
                    </span>
                    <span className="block text-[10px] font-mono text-slate-500 mt-0.5">
                      {c.daysInSpace}d in microgravity
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl text-xs text-slate-300">
            <div className="flex items-center gap-2 mb-2 font-mono uppercase text-cyan-400 font-bold text-[11px]">
              <Radio className="w-4 h-4" />
              <span>Orbital Visibility Window</span>
            </div>
            <p className="leading-relaxed">
              The station reflects sunlight and is visible to the naked eye at dawn and dusk as the third brightest object in the sky, after the Sun and Moon.
            </p>
          </div>
        </div>
      </div>

      {/* NASA Space News Feed */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white tracking-wide">
              NASA & International Space News
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">Curated Space Exploration Bulletins</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {news.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition duration-300 flex flex-col justify-between shadow-lg hover:shadow-cyan-950/20"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono mb-2">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-semibold">
                    {item.badge}
                  </span>
                  <span className="text-slate-500">{item.date}</span>
                </div>
                <h3 className="text-sm font-bold text-white mb-2 leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.summary}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>{item.agency}</span>
                <span className="text-cyan-400 font-semibold">{item.category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
