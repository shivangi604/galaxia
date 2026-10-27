import React, { useState } from 'react';
import { SpaceMission } from '../types/space';
import {
  Rocket,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  Search,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';

const MISSIONS: SpaceMission[] = [
  {
    id: 'apollo-11',
    name: 'Apollo 11',
    agency: 'NASA',
    launchYear: 1969,
    target: 'The Moon (Mare Tranquillitatis)',
    status: 'Completed',
    vehicle: 'Saturn V (Three-stage liquid fuel)',
    badgeColor: '#f59e0b',
    description: 'The monumental human spaceflight that landed Neil Armstrong and Buzz Aldrin on the Moon on July 20, 1969, while Michael Collins piloted the command module in lunar orbit.',
    achievements: [
      'First human footsteps on an extraterrestrial planetary body',
      'Returned 21.55 kg of pristine lunar rocks and regolith',
      'Deployed Early Apollo Scientific Experiment Package (EASEP)',
      'Proved feasibility of trans-lunar injection and rendezvous'
    ]
  },
  {
    id: 'voyager-1',
    name: 'Voyager 1 & 2 (The Grand Tour)',
    agency: 'NASA JPL',
    launchYear: 1977,
    target: 'Outer Planets & Interstellar Space',
    status: 'Active',
    vehicle: 'Titan IIIE-Centaur',
    badgeColor: '#06b6d4',
    description: 'Taking advantage of a rare 175-year planetary alignment, the twin Voyager probes explored Jupiter, Saturn, Uranus, Neptune, and continue transmitting from interstellar space.',
    achievements: [
      'Voyager 1 is the farthest human-made object from Earth (>160 AU)',
      'Crossed the heliopause into interstellar space in August 2012',
      'Carries the Golden Record carrying Earth greetings, sounds, and music',
      'Discovered active volcanoes on Io and lightning on Jupiter'
    ]
  },
  {
    id: 'artemis-program',
    name: 'Artemis Program (Artemis I, II, III)',
    agency: 'NASA / ESA / CSA / JAXA',
    launchYear: 2022,
    target: 'Moon (South Pole & Lunar Gateway)',
    status: 'Active',
    vehicle: 'Space Launch System (SLS) & Orion Spacecraft',
    badgeColor: '#3b82f6',
    description: 'The international human exploration campaign to establish sustainable presence on the Moon and prepare for the first crewed expedition to Mars.',
    achievements: [
      'Artemis I completed a record-breaking 1.4-million-mile lunar orbit',
      'Landing the first woman and first person of color on the Moon',
      'Exploration of permanently shadowed lunar craters harboring water ice',
      'Construction of the orbiting Lunar Gateway orbital outpost'
    ]
  },
  {
    id: 'jwst',
    name: 'James Webb Space Telescope (JWST)',
    agency: 'NASA / ESA / CSA',
    launchYear: 2021,
    target: 'Sun-Earth Lagrange Point 2 (L2)',
    status: 'Active',
    vehicle: 'Ariane 5 ECA',
    badgeColor: '#eab308',
    description: 'Humanity’s flagship infrared space observatory featuring a 6.5-meter gold-coated beryllium primary mirror, studying the earliest galaxies formed after the Big Bang.',
    achievements: [
      'Observed primeval galaxies existing just 300 million years after the Big Bang',
      'Spectroscopic analysis of exoplanet atmospheres detecting carbon and water',
      'Infrared deep field views piercing cosmic dust clouds in star nurseries',
      'Operational at ultra-cold 40 Kelvin (-233°C)'
    ]
  },
  {
    id: 'perseverance',
    name: 'Mars 2020: Perseverance & Ingenuity',
    agency: 'NASA JPL',
    launchYear: 2020,
    target: 'Mars (Jezero Crater)',
    status: 'Active',
    vehicle: 'Atlas V 541',
    badgeColor: '#ef4444',
    description: 'A car-sized robotic astrobiology rover exploring an ancient Martian river delta to seek signs of ancient microbial life and collect hermetically sealed rock core samples.',
    achievements: [
      'Ingenuity completed 72 powered flights in the thin Martian atmosphere',
      'MOXIE instrument successfully synthesized breathable oxygen from Martian CO₂',
      'Drilled and cached 24 geological core samples for Mars Sample Return',
      'Recorded the first acoustic sounds of Martian wind and laser impacts'
    ]
  },
  {
    id: 'cassini',
    name: 'Cassini-Huygens',
    agency: 'NASA / ESA / ASI',
    launchYear: 1997,
    target: 'Saturn, Rings & Moons',
    status: 'Completed',
    vehicle: 'Titan IVB / Centaur',
    badgeColor: '#8b5cf6',
    description: 'A 13-year tour of the Saturnian system that revealed subsurface water oceans on Enceladus, hydrocarbon lakes on Titan, and concluded with a dramatic Grand Finale atmospheric plunge.',
    achievements: [
      'ESA Huygens probe landed successfully on Titan in January 2005',
      'Discovered supersonic water ice geysers venting from Enceladus south pole',
      'Detailed mapping of the complex dynamics of Saturn’s ring system',
      'Photographed the mysterious hexagonal storm pattern at Saturn’s north pole'
    ]
  }
];

export const MissionsSection: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeMission, setActiveMission] = useState<SpaceMission>(MISSIONS[0]);

  const filteredMissions = MISSIONS.filter((m) => {
    const matchesStatus = selectedStatus === 'all' || m.status.toLowerCase() === selectedStatus.toLowerCase();
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.agency.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1.5">
          <Rocket className="w-5 h-5 text-cyan-400" />
          <span className="text-xs uppercase tracking-widest text-cyan-400 font-mono font-bold">
            HISTORIC & ACTIVE SPACE EXPLORATION
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wide">
          Humanity’s Great Space Missions
        </h1>
        <p className="text-sm text-slate-400 max-w-3xl mt-1">
          From the Apollo lunar landings to interstellar Voyagers and Mars sample returns, explore the robotic and crewed spacecraft that expand human frontiers.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-900 border border-slate-800 w-full sm:w-auto">
          {['all', 'active', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition cursor-pointer ${
                selectedStatus === status
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search missions, targets, rockets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Missions List */}
        <div className="lg:col-span-5 space-y-3">
          {filteredMissions.map((m) => {
            const isSelected = activeMission.id === m.id;
            return (
              <div
                key={m.id}
                onClick={() => setActiveMission(m)}
                className={`p-4 rounded-2xl border transition duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 border-cyan-500/50 shadow-xl shadow-cyan-950/20'
                    : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-900/90 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5 text-[10px] font-mono">
                  <span className="text-cyan-400 font-bold">{m.agency}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Launch: {m.launchYear}</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                      m.status === 'Active' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {m.status}
                    </span>
                  </div>
                </div>
                <h3 className="text-base font-bold text-white mb-1">{m.name}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {m.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Detailed Mission Dossier */}
        <div className="lg:col-span-7 bg-slate-900/95 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-xl">
          <div className="flex items-start justify-between pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
                  {activeMission.agency} • LAUNCHED {activeMission.launchYear}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white">{activeMission.name}</h2>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase ${
              activeMission.status === 'Active' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-300 border border-slate-700'
            }`}>
              {activeMission.status}
            </span>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed my-4">
            {activeMission.description}
          </p>

          <div className="grid grid-cols-2 gap-3 mb-6 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase">Destination</span>
              <span className="text-slate-200 font-semibold">{activeMission.target}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase">Launch Vehicle</span>
              <span className="text-slate-200 font-semibold">{activeMission.vehicle}</span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                Major Scientific & Technical Milestones
              </h4>
            </div>
            <div className="space-y-2">
              {activeMission.achievements.map((ach, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3 text-xs text-slate-300 leading-relaxed"
                >
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span>{ach}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
