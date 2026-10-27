import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  Atom,
  Compass,
  Rocket,
  Globe2,
  FileText,
  HelpCircle,
  ArrowRight
} from 'lucide-react';

interface LessonTopic {
  id: string;
  title: string;
  category: 'Orbital Mechanics' | 'Planetary Science' | 'Stellar Physics' | 'Cosmology' | 'Spaceflight';
  summary: string;
  keyPrinciples: string[];
  equation?: { formula: string; explanation: string };
  empiricalProof: {
    title: string;
    description: string;
    observationalData: string;
  };
  officialLinks: { label: string; url: string; agency: string }[];
}

const LESSON_TOPICS: LessonTopic[] = [
  {
    id: 'keplers-laws',
    title: "Kepler's Laws of Planetary Motion",
    category: 'Orbital Mechanics',
    summary: 'The three fundamental mathematical laws formulated by Johannes Kepler describing the motion of planets around the Sun, later proven by Isaac Newton using universal gravitation.',
    keyPrinciples: [
      'Law of Ellipses: Every planet revolves in an elliptical orbit with the Sun at one focus.',
      'Law of Equal Areas: A line segment joining a planet and the Sun sweeps out equal areas during equal intervals of time (orbital speed increases near perihelion).',
      'Harmonic Law: The square of the orbital period is directly proportional to the cube of the semi-major axis (T² ∝ a³).'
    ],
    equation: {
      formula: 'T² = (4π² / G(M + m)) · a³',
      explanation: 'Where T is the orbital period, a is semi-major axis, G is the gravitational constant, and M is the Sun’s mass.'
    },
    empiricalProof: {
      title: 'Tycho Brahe’s Mars Ephemeris & Cassini Radio Tracking',
      description: 'Kepler derived these laws from decades of naked-eye observations of Mars recorded by Tycho Brahe. In modern times, NASA Cassini and Mars Reconnaissance Orbiter Doppler tracking validates Keplerian orbits to within 1 part in 10⁸.',
      observationalData: 'Earth orbital eccentricity e = 0.0167; Mars e = 0.0934. Ratio T²/a³ = 1.00000 across all 8 planets.'
    },
    officialLinks: [
      { label: 'NASA Solar System Dynamics - Keplerian Orbits', url: 'https://ssd.jpl.nasa.gov/planets/approx_pos.html', agency: 'NASA JPL' },
      { label: 'ESA Science - Planetary Motion Guide', url: 'https://www.esa.int/Science_Exploration/Space_Science/Planets_and_moons', agency: 'ESA' },
    ]
  },
  {
    id: 'hohmann-transfer',
    title: 'Hohmann Orbital Transfer & Delta-v',
    category: 'Spaceflight',
    summary: 'An elliptical orbit used to transfer a spacecraft between two circular orbits of different radii in the same plane, requiring minimum total propulsive velocity change (Δv).',
    keyPrinciples: [
      'Two instantaneous propulsive impulse burns: one to enter the transfer ellipse and one to circularize at the destination.',
      'Transfer orbit apoapsis touches the outer orbit, and periapsis touches the inner orbit.',
      'Phase angle alignment determines the launch window (occurs every ~26 months for Earth-Mars).'
    ],
    equation: {
      formula: 'Δv₁ = √(μ/r₁) · (√(2r₂ / (r₁ + r₂)) - 1)',
      explanation: 'Departure burn from radius r₁ into an elliptical transfer trajectory toward target radius r₂.'
    },
    empiricalProof: {
      title: 'NASA Mariner, Viking & Perseverance Mars Injections',
      description: 'Practically demonstrated on every interplanetary robotic journey since Mariner 4 in 1964. NASA Perseverance launched in July 2020 at a 44° Earth-Mars phase angle, traveling 470 million km and arriving within minutes of predicted trajectory.',
      observationalData: 'Earth-Mars transfer Δv ≈ 3.9 km/s; transit time ≈ 200–260 days.'
    },
    officialLinks: [
      { label: 'NASA Basics of Space Flight - Orbital Mechanics', url: 'https://science.nasa.gov/learn/basics-of-space-flight/chapter4-1/', agency: 'NASA Science' },
      { label: 'JPL Interplanetary Trajectories', url: 'https://www.jpl.nasa.gov/edu/teach/activity/lets-go-to-mars-calculating-launch-windows/', agency: 'NASA JPL Edu' }
    ]
  },
  {
    id: 'solar-fusion',
    title: 'Thermonuclear Fusion in the Solar Core',
    category: 'Stellar Physics',
    summary: 'The process powering the Sun, wherein four hydrogen nuclei (protons) fuse into one helium-4 nucleus via the proton-proton (p-p) chain reaction, converting mass directly into energy.',
    keyPrinciples: [
      'Core temperature exceeds 15 million Kelvin and core pressure reaches 250 billion atmospheres.',
      'Quantum tunneling allows protons to overcome mutual electrostatic Coulomb repulsion.',
      'Emits solar neutrinos, gamma-ray photons, and positrons.'
    ],
    equation: {
      formula: 'E = Δm · c²  (4 ¹H → ⁴He + 2e⁺ + 2νₑ + 26.7 MeV)',
      explanation: '0.7% of the fused hydrogen mass is converted directly into radiant energy.'
    },
    empiricalProof: {
      title: 'Solar Neutrino Detection at Super-Kamiokande & SNO',
      description: 'Neutrinos generated in the Sun’s core pass freely through the Sun and reach Earth in 8.3 minutes. The Sudbury Neutrino Observatory (SNO) in Canada proved solar neutrino oscillations in 2001, confirming stellar fusion models and earning the 2015 Nobel Prize.',
      observationalData: 'Solar neutrino flux measured at Earth: ~6.5 × 10¹⁰ neutrinos per cm² per second.'
    },
    officialLinks: [
      { label: 'NASA Heliophysics - How the Sun Works', url: 'https://science.nasa.gov/sun/facts/', agency: 'NASA' },
      { label: 'SOHO Solar Observatory Real-Time Feed', url: 'https://soho.nascom.nasa.gov/', agency: 'NASA / ESA' }
    ]
  },
  {
    id: 'general-relativity-black-holes',
    title: 'General Relativity & Black Holes',
    category: 'Cosmology',
    summary: 'Einstein’s theory that gravity is not a Newtonian force, but a geometric curvature of four-dimensional spacetime caused by mass and energy, creating event horizons around singularities.',
    keyPrinciples: [
      'Equivalence Principle: Inertial mass and gravitational mass are identical.',
      'Gravitational time dilation: Clocks tick slower in deeper gravitational potentials.',
      'Schwarzschild radius defines the point of no return (event horizon).'
    ],
    equation: {
      formula: 'rₛ = 2GM / c²',
      explanation: 'Schwarzschild radius for a non-rotating spherically symmetric mass M.'
    },
    empiricalProof: {
      title: 'Event Horizon Telescope (EHT) & LIGO Gravitational Waves',
      description: 'Direct imaging of the supermassive black hole shadows in M87* (2019) and Sagittarius A* at our galactic center (2022). LIGO and Virgo detected gravitational waves from binary black hole mergers (GW150914) with exact match to Einstein’s field equations.',
      observationalData: 'Sagittarius A* mass: 4.15 million solar masses; Schwarzschild radius: 12.3 million km.'
    },
    officialLinks: [
      { label: 'Event Horizon Telescope Collaboration', url: 'https://eventhorizontelescope.org/', agency: 'EHT Consortium' },
      { label: 'LIGO Caltech Gravitational Wave Observatory', url: 'https://www.ligo.caltech.edu/', agency: 'Caltech / NSF' }
    ]
  },
  {
    id: 'exoplanet-transit',
    title: 'Exoplanet Detection & Transit Spectroscopy',
    category: 'Planetary Science',
    summary: 'Methods for discovering worlds orbiting alien stars and measuring their atmospheric chemical constituents via optical dips and transmission spectra.',
    keyPrinciples: [
      'Transit Method: A planet crossing in front of its host star blocks a tiny fraction of starlight (ΔF/F ≈ (Rₚ/Rₛ)²).',
      'Radial Velocity: Gravitational wobble measured via Doppler shift of stellar absorption lines.',
      'Transmission Spectroscopy: Starlight filtered through the planet’s atmosphere reveals chemical absorption bands.'
    ],
    equation: {
      formula: 'Transit Depth: δ = (R_planet / R_star)²',
      explanation: 'For a Jupiter-sized planet orbiting a Sun-like star, the transit depth is ~1%.'
    },
    empiricalProof: {
      title: 'NASA Kepler, TESS & James Webb Space Telescope',
      description: 'Over 5,600 confirmed exoplanets discovered. In 2023, JWST NIRSpec transmission spectroscopy confirmed carbon dioxide (CO₂), water vapor (H₂O), and sulfur dioxide (SO₂) in the atmospheres of WASP-39 b and K2-18 b.',
      observationalData: 'Confirmed exoplanet count: 5,600+ worlds cataloged in the NASA Exoplanet Archive.'
    },
    officialLinks: [
      { label: 'NASA Exoplanet Archive & Exploration Portal', url: 'https://exoplanets.nasa.gov/', agency: 'NASA JPL' },
      { label: 'James Webb Exoplanet Science Releases', url: 'https://webbtelescope.org/science/early-highlights/exoplanets', agency: 'STScI / NASA' }
    ]
  },
  {
    id: 'rocket-equation',
    title: 'Tsiolkovsky Rocket Equation & Specific Impulse',
    category: 'Spaceflight',
    summary: 'The mathematical equation formulated by Konstantin Tsiolkovsky in 1903 describing the motion of vehicles that follow the basic principle of rocket thrust by expelling reaction mass.',
    keyPrinciples: [
      'Delta-v depends logarithmically on the mass ratio (initial wet mass divided by dry structural mass).',
      'Exhaust velocity is directly proportional to specific impulse (Iₛₚ) in seconds.',
      'Governs multi-stage rocket design for Earth orbit insertion (orbital velocity ~7.8 km/s).'
    ],
    equation: {
      formula: 'Δv = v_e · ln(m₀ / m_f) = I_sp · g₀ · ln(m₀ / m_f)',
      explanation: 'Where v_e is effective exhaust velocity, m₀ is initial wet mass, m_f is final dry mass, and I_sp is specific impulse.'
    },
    empiricalProof: {
      title: 'Saturn V, Space Shuttle & Falcon 9 Telemetry',
      description: 'Used in every rocket launch in human history. The Saturn V launched Apollo 11 with m₀ = 2,970,000 kg and m_f = 130,000 kg, achieving the 11.2 km/s required for translunar escape velocity.',
      observationalData: 'Hydrolox RS-25 engine I_sp (vacuum) = 452 seconds; Kerolox Merlin 1D (vacuum) = 311 seconds.'
    },
    officialLinks: [
      { label: 'NASA Propulsion Systems Overview', url: 'https://www.nasa.gov/general/propulsion-systems-overview/', agency: 'NASA Glenn' },
      { label: 'NASA Rocket Principles', url: 'https://www.grc.nasa.gov/www/k-12/rocket/rktpow.html', agency: 'NASA GRC' }
    ]
  }
];

export const LessonsSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeLesson, setActiveLesson] = useState<LessonTopic>(LESSON_TOPICS[0]);

  const filteredLessons = LESSON_TOPICS.filter((l) => {
    const matchesCategory = selectedCategory === 'all' || l.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          l.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          l.empiricalProof.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1.5">
          <BookOpen className="w-5 h-5 text-cyan-400" />
          <span className="text-xs uppercase tracking-widest text-cyan-400 font-mono font-bold">
            ACADEMIC ASTROPHYSICS LAB • CURRICULUM & PROOFS
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wide">
          Space Science Academy & Verified Proofs
        </h1>
        <p className="text-sm text-slate-400 max-w-3xl mt-1">
          Search any astrophysics, orbital mechanics, or spaceflight concept. Each lesson provides core physical formulas, historical & modern observational proof, and direct links to verified NASA and ESA documentation.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 w-full sm:w-auto">
          {['all', 'Orbital Mechanics', 'Planetary Science', 'Stellar Physics', 'Cosmology', 'Spaceflight'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search lessons (e.g. Kepler, Fusion, Black Holes)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Lesson Index List */}
        <div className="lg:col-span-5 space-y-3">
          {filteredLessons.map((l) => {
            const isSelected = activeLesson.id === l.id;
            return (
              <div
                key={l.id}
                onClick={() => setActiveLesson(l)}
                className={`p-4 rounded-2xl border transition duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 border-cyan-500/50 shadow-xl shadow-cyan-950/20'
                    : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-900/90 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5 text-[10px] font-mono">
                  <span className="px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/80 font-semibold">
                    {l.category}
                  </span>
                  <span className="text-slate-500 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Verified Proof</span>
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mb-1">{l.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {l.summary}
                </p>
              </div>
            );
          })}
        </div>

        {/* Right Active Lesson Detailed Dossier with Proofs and Official Links */}
        <div className="lg:col-span-7 bg-slate-900/95 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest block mb-1">
                  ACADEMIC MODULE • {activeLesson.category}
                </span>
                <h2 className="text-2xl font-bold text-white">{activeLesson.title}</h2>
              </div>
            </div>

            <p className="text-xs md:text-sm text-slate-300 leading-relaxed my-4">
              {activeLesson.summary}
            </p>

            {/* Core Physics Formulation / Formula Box */}
            {activeLesson.equation && (
              <div className="my-4 p-4 rounded-xl bg-slate-950/80 border border-cyan-500/30">
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold block mb-1">
                  MATHEMATICAL FORMULATION
                </span>
                <div className="text-base md:text-lg font-mono font-bold text-cyan-300 py-1">
                  {activeLesson.equation.formula}
                </div>
                <p className="text-xs text-slate-400 mt-1 font-mono">
                  {activeLesson.equation.explanation}
                </p>
              </div>
            )}

            {/* Key Theoretical Principles */}
            <div className="my-5">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-white block mb-2">
                Core Astrophysical Principles
              </span>
              <ul className="space-y-2">
                {activeLesson.keyPrinciples.map((kp, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                    <span>{kp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Empirical Proof Section */}
            <div className="my-5 p-4 rounded-xl bg-slate-950/90 border border-emerald-500/30">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-300 font-bold">
                  Empirical Proof & Observational Verification
                </span>
              </div>
              <h4 className="text-xs font-bold text-white mb-1">
                {activeLesson.empiricalProof.title}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-2">
                {activeLesson.empiricalProof.description}
              </p>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-cyan-300">
                Data Evidence: {activeLesson.empiricalProof.observationalData}
              </div>
            </div>
          </div>

          {/* Official Agency Links */}
          <div className="pt-4 border-t border-slate-800">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold block mb-2">
              Official Primary Sources & Agency Documentation
            </span>
            <div className="flex flex-wrap gap-2">
              {activeLesson.officialLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700/80 text-xs font-mono text-cyan-300 hover:text-white transition cursor-pointer"
                >
                  <span>{link.label}</span>
                  <span className="px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 text-[9px] font-bold">
                    {link.agency}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
