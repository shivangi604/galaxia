/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { RocketLaunchIntro } from './components/RocketLaunchIntro';
import { Navbar } from './components/Navbar';
import { SolarSystemZone } from './components/SolarSystemZone';
import { OrbitAlignmentSimulator } from './components/OrbitAlignmentSimulator';
import { QuizSection } from './components/QuizSection';
import { LessonsSection } from './components/LessonsSection';
import { NewsSection } from './components/NewsSection';
import { InformationCenter } from './components/InformationCenter';
import { MissionsSection } from './components/MissionsSection';
import { PresentationViewer } from './components/PresentationViewer';
import { AIAssistant } from './components/AIAssistant';
import { sound } from './utils/soundEffects';

export default function App() {
  const [hasLaunched, setHasLaunched] = useState(false);
  const [activeTab, setActiveTab] = useState('solar');
  const [isMuted, setIsMuted] = useState(false);

  const handleLaunchComplete = () => {
    setHasLaunched(true);
  };

  const handleReplayLaunch = () => {
    setHasLaunched(false);
  };

  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    sound.setMuted(next);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* 1. Dramatic Rocket Launch Blastoff Intro */}
      {!hasLaunched && (
        <RocketLaunchIntro onLaunchComplete={handleLaunchComplete} />
      )}

      {/* 2. Main Galaxia Space Learning Universe */}
      {hasLaunched && (
        <>
          <Navbar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onReplayLaunch={handleReplayLaunch}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
          />

          <main className="flex-1 flex flex-col">
            {activeTab === 'solar' && <SolarSystemZone />}
            {activeTab === 'lessons' && <LessonsSection />}
            {activeTab === 'news' && <NewsSection />}
            {activeTab === 'quiz' && <QuizSection />}
            {activeTab === 'alignment' && <OrbitAlignmentSimulator />}
            {activeTab === 'info' && <InformationCenter />}
            {activeTab === 'missions' && <MissionsSection />}
            {activeTab === 'presentation' && <PresentationViewer />}
          </main>

          {/* Floating AI Space Assistant (Gemini 3.8 Flash) */}
          <AIAssistant />

          {/* Minimal Cosmic Footer */}
          {activeTab !== 'solar' && (
            <footer className="w-full border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500 font-mono">
              <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-500" />
                  <span>Galaxia: Unified Space Exploration & Astrophysics Learning Hub</span>
                </div>
                <div className="flex items-center gap-4 text-[11px]">
                  <span>NASA Open Data & ISS Ephemeris</span>
                  <span>•</span>
                  <span>UN SDG 4 & 9 Aligned</span>
                  <span>•</span>
                  <button
                    onClick={() => setActiveTab('presentation')}
                    className="text-cyan-400 hover:underline cursor-pointer"
                  >
                    View Project Architecture
                  </button>
                </div>
              </div>
            </footer>
          )}
        </>
      )}
    </div>
  );
}
