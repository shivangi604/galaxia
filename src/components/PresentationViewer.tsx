import React, { useState } from 'react';
import {
  Layers,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Globe2,
  ArrowRight,
  Bot
} from 'lucide-react';

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  content: React.ReactNode;
}

export const PresentationViewer: React.FC = () => {
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);

  const slides: Slide[] = [
    {
      id: 2,
      title: 'Problem Statement',
      subtitle: 'The Core Challenge in Space Science Education',
      content: (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            <h4 className="text-sm font-bold text-cyan-400 mb-1 font-mono uppercase">The Problem</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Students and space enthusiasts who want to learn about space (missions, satellites, orbital mechanics, the ISS) have to jump between many disconnected websites — news portals, raw tracking coordinate feeds, and dry academic pages with static, outdated content.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase">Target Audience</span>
              <span className="text-slate-200 font-semibold">School/College Students, Beginners & Enthusiasts</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase">Why It Matters</span>
              <span className="text-slate-200 font-semibold">Space telemetry is dynamic — static pages go stale fast</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase">The Market Gap</span>
              <span className="text-slate-200 font-semibold">No unified platform merging tracking + news + 3D play</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      title: 'Proposed Solution',
      subtitle: 'Galaxia: Unified Space-Learning Ecosystem',
      content: (
        <div className="space-y-4">
          <p className="text-xs text-slate-300 leading-relaxed">
            One interactive space-learning platform that harmonizes live telemetry, astrophysical 3D simulations, interactive gamification, and an intelligent AI tutor into a single browser destination.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-cyan-500/30">
              <Globe2 className="w-5 h-5 text-cyan-400 mb-2" />
              <h5 className="font-bold text-white mb-1">Live ISS Tracking</h5>
              <p className="text-[11px] text-slate-400">Real-time coordinates, orbital speed, & ground track.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-amber-500/30">
              <Sparkles className="w-5 h-5 text-amber-400 mb-2" />
              <h5 className="font-bold text-white mb-1">3D Solar System</h5>
              <p className="text-[11px] text-slate-400">Scale explorer, planetary dossiers, & fly-to camera.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-purple-500/30">
              <Bot className="w-5 h-5 text-purple-400 mb-2" />
              <h5 className="font-bold text-white mb-1">AI Space Assistant</h5>
              <p className="text-[11px] text-slate-400">Ask astrophysics questions with Gemini 3.8 Flash.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-emerald-500/30">
              <TrendingUp className="w-5 h-5 text-emerald-400 mb-2" />
              <h5 className="font-bold text-white mb-1">Educational Games</h5>
              <p className="text-[11px] text-slate-400">Nebula Escape, Orbit Slingshot, & Solar Quiz.</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 4,
      title: 'Design & Architecture',
      subtitle: 'Technical Methodology & Block Diagram',
      content: (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-500/40">
            <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold block mb-3">
              SYSTEM ARCHITECTURE BLOCK DIAGRAM
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-mono">
              <div className="px-3 py-2 rounded-lg bg-slate-900 border border-cyan-400 text-cyan-300 font-bold">
                USER
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500" />
              <div className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200">
                React UI (Tailwind)
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500" />
              <div className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200">
                Express API
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500" />
              <div className="flex flex-col gap-1">
                <div className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-[10px] text-amber-300">
                  NASA / ISS Telemetry APIs
                </div>
                <div className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-[10px] text-purple-300">
                  AI Service (@google/genai)
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500" />
              <div className="px-3 py-2 rounded-lg bg-emerald-950/60 border border-emerald-500 text-emerald-300 font-bold">
                Interactive Results
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed font-mono">
            <strong>Workflow:</strong> User opens the site → React UI requests data → Express backend coordinates external telemetry & AI services → Interactive 3D graphics & results render in the browser.
          </p>
        </div>
      ),
    },
    {
      id: 5,
      title: 'Innovation & USP',
      subtitle: 'What Sets Galaxia Apart from Legacy Tools',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <h5 className="font-bold text-amber-400 font-mono uppercase mb-1">Single-Purpose Tools (Existing)</h5>
              <p className="text-slate-400 leading-relaxed">
                Users must browse 4+ tabs: one for raw ISS coordinates, another for NASA news feeds, a textbook for Kepler equations, and static encyclopedia pages with no interactivity.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/40">
              <h5 className="font-bold text-cyan-300 font-mono uppercase mb-1">Galaxia Unified Platform (Our USP)</h5>
              <p className="text-slate-300 leading-relaxed">
                A seamless single-page hub merging real-time tracking, 3D solar system modeling, interactive orbit alignment simulations, and arcade gamification.
              </p>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 text-xs text-slate-400 font-mono">
            <strong>Key Advantages:</strong> Zero-installation web app • Responsive cross-device UI • High engagement via gamified astronomy badges.
          </div>
        </div>
      ),
    },
    {
      id: 6,
      title: 'Feasibility & Implementation Plan',
      subtitle: '5 Development Stages & Risk Mitigation',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-mono">
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-cyan-400 font-bold block text-[10px]">STAGE 1</span>
              <span className="text-slate-300">UI & Core 3D Pages</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-cyan-400 font-bold block text-[10px]">STAGE 2</span>
              <span className="text-slate-300">API Integrations</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-cyan-400 font-bold block text-[10px]">STAGE 3</span>
              <span className="text-slate-300">Profiles & Gamification</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-cyan-400 font-bold block text-[10px]">STAGE 4</span>
              <span className="text-slate-300">AI Assistant & Physics</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-cyan-400 font-bold block text-[10px]">STAGE 5</span>
              <span className="text-slate-300">Testing & Deployment</span>
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
            <h5 className="font-bold text-white mb-1 font-mono uppercase text-[11px]">Risk Mitigation Matrix</h5>
            <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
              <li><strong>External API downtime:</strong> Built-in Keplerian ephemeris math guarantees live simulated fallback.</li>
              <li><strong>AI Hallucination:</strong> Grounded space tutor system prompts with validated astrophysical constants.</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 7,
      title: 'Expected Impact & Scalability',
      subtitle: 'Beneficiaries & Educational Metrics',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <h5 className="font-bold text-white font-mono uppercase mb-2">Direct Beneficiaries</h5>
              <p className="text-slate-300 leading-relaxed">
                Middle school, high school, and undergraduate astronomy students gaining intuitive, visual comprehension of Keplerian orbits and solar planetary physics.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <h5 className="font-bold text-white font-mono uppercase mb-2">Indirect Beneficiaries</h5>
              <p className="text-slate-300 leading-relaxed">
                Educators, science museum outreach clubs, and independent stargazers with an interactive visual teaching aid.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 8,
      title: 'UN SDG Alignment',
      subtitle: 'Sustainable Development Goals Impact',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/70 border border-emerald-500/40">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono text-xs font-bold">
                  SDG 4
                </span>
                <h5 className="font-bold text-white text-sm">Quality Education</h5>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Democratizes STEM and informal astronomy education through open browser access, free interactive 3D simulations, and self-paced quizzes.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/70 border border-cyan-500/40">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono text-xs font-bold">
                  SDG 9
                </span>
                <h5 className="font-bold text-white text-sm">Industry, Innovation & Infrastructure</h5>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Sparks student curiosity in satellite infrastructure, aerospace engineering, telecommunications, and cutting-edge planetary exploration technology.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 9,
      title: 'Conclusion & Future Scope',
      subtitle: 'Vision & Next Milestones',
      content: (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 text-center">
            <h4 className="text-lg font-bold text-white mb-2 font-display">
              "Making the universe easier to explore, understand, and learn from — one interaction at a time."
            </h4>
            <p className="text-xs text-slate-300 max-w-xl mx-auto leading-relaxed">
              Galaxia unifies telemetry, interactive 3D exploration, and gamified education to inspire the next generation of aerospace engineers, astrophysicists, and cosmic explorers.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
              <span className="text-cyan-400 font-bold block mb-1">01. Multilingual AI</span>
              <span className="text-slate-400">Localized space tutor explanations in 12+ world languages.</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
              <span className="text-cyan-400 font-bold block mb-1">02. Educator Mode</span>
              <span className="text-slate-400">Custom classroom quiz assignments and student telemetry dashboards.</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
              <span className="text-cyan-400 font-bold block mb-1">03. VR / WebXR</span>
              <span className="text-slate-400">Immersive headset walking on lunar surface & Mars landing sites.</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 10,
      title: 'References & API Documentation',
      subtitle: 'Data Sources, Standards & Technical Attribution',
      content: (
        <div className="space-y-3 text-xs font-mono">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-cyan-400 font-bold block text-[11px]">NASA Open Data APIs</span>
            <span className="text-slate-300">api.nasa.gov • Astronomy Picture of the Day (APOD) & JPL Solar System Dynamics</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-cyan-400 font-bold block text-[11px]">ISS Real-Time Telemetry Provider</span>
            <span className="text-slate-300">Where The ISS At API (api.wheretheiss.at/v1/satellites/25544) & NORAD TLE Ephemeris</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-cyan-400 font-bold block text-[11px]">AI Model & Language Engine</span>
            <span className="text-slate-300">Google Gemini 3.8 Flash (@google/genai TypeScript SDK)</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-cyan-400 font-bold block text-[11px]">Core Frontend & 3D Graphics Stack</span>
            <span className="text-slate-300">React 19 • Three.js WebGL • Tailwind CSS • Express / Node.js</span>
          </div>
        </div>
      ),
    },
  ];

  const currentSlide = slides[currentSlideIdx];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Layers className="w-5 h-5 text-cyan-400" />
            <span className="text-xs uppercase tracking-widest text-cyan-400 font-mono font-bold">
              GALAXIA PROJECT SPECIFICATION & ARCHITECTURE
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wide">
            Presentation & Technical Blueprint
          </h1>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
          <span>Slide {currentSlide.id} of 10</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentSlideIdx((prev) => Math.max(0, prev - 1))}
              disabled={currentSlideIdx === 0}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-30 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentSlideIdx((prev) => Math.min(slides.length - 1, prev + 1))}
              disabled={currentSlideIdx === slides.length - 1}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-30 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl backdrop-blur-xl min-h-[400px] flex flex-col justify-between">
        <div>
          <div className="mb-6">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
              Page {currentSlide.id} — {currentSlide.subtitle}
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-white mt-1">
              {currentSlide.title}
            </h2>
          </div>

          <div className="mt-4">
            {currentSlide.content}
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentSlideIdx(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentSlideIdx === idx ? 'w-6 bg-cyan-400' : 'w-2 bg-slate-800 hover:bg-slate-700'
                }`}
                title={`Jump to Page ${s.id}: ${s.title}`}
              />
            ))}
          </div>

          <div className="flex gap-2">
            {currentSlideIdx > 0 && (
              <button
                onClick={() => setCurrentSlideIdx((prev) => prev - 1)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 cursor-pointer"
              >
                Previous
              </button>
            )}
            {currentSlideIdx < slides.length - 1 && (
              <button
                onClick={() => setCurrentSlideIdx((prev) => prev + 1)}
                className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono cursor-pointer"
              >
                Next Slide
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
