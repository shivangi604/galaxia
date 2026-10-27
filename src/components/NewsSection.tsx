import React, { useState, useEffect } from 'react';
import {
  Newspaper,
  ExternalLink,
  Calendar,
  Search,
  Radio,
  Sparkles,
  ArrowRight,
  Globe2,
  Clock,
  Compass
} from 'lucide-react';

interface NewsArticle {
  id: string;
  title: string;
  category: 'Human Spaceflight' | 'Astrophysics' | 'Planetary Science' | 'Deep Space' | 'Rocket Tech';
  agency: string;
  date: string;
  badge: string;
  summary: string;
  fullDetails: string;
  officialUrl: string;
  imageUrl?: string;
}

const NEWS_DATABASE: NewsArticle[] = [
  {
    id: 'artemis-2-crewed',
    title: 'NASA Artemis II Orion Spacecraft Completes Integrated Vacuum Chamber Testing',
    category: 'Human Spaceflight',
    agency: 'NASA / CSA',
    date: 'October 27, 2026',
    badge: 'Lunar Mission',
    summary: 'The Orion spacecraft and European Service Module completed crucial thermal vacuum chamber testing at Kennedy Space Center, clearing four astronauts for their historic lunar flyby.',
    fullDetails: 'Artemis II will send commander Reid Wiseman, pilot Victor Glover, mission specialist Christina Koch, and Canadian Space Agency astronaut Jeremy Hansen on an approximate 10-day test flight around the Moon and back. This paves the way for Artemis III lunar surface landings at the South Pole.',
    officialUrl: 'https://www.nasa.gov/mission/artemis-ii/',
  },
  {
    id: 'jwst-water-vapor',
    title: 'James Webb Space Telescope Directly Measures Atmospheric Water and Methane on Habitable-Zone Exoplanet',
    category: 'Astrophysics',
    agency: 'NASA / ESA / CSA',
    date: 'October 24, 2026',
    badge: 'Deep Space',
    summary: 'Infrared transmission spectroscopy with NIRSpec reveals unambiguous water vapor absorption lines and methane equilibrium in sub-Neptune exoplanet K2-18 b.',
    fullDetails: 'The observations suggest the possibility of a hydrogen-rich atmosphere above a water ocean world (Hycean planet). These findings provide unprecedented spectroscopic clarity into alien atmospheres 120 light-years away.',
    officialUrl: 'https://webbtelescope.org/news/milestones',
  },
  {
    id: 'europa-clipper-maneuver',
    title: 'Europa Clipper Successfully Deploys 90-Foot Radar Antennas En Route to Jupiter',
    category: 'Planetary Science',
    agency: 'NASA JPL',
    date: 'October 19, 2026',
    badge: 'Interplanetary',
    summary: 'Following its flawless launch, the Europa Clipper probe has unfurled its ice-penetrating radar arrays to survey the subsurface saltwater ocean beneath Europa’s frozen crust.',
    fullDetails: 'Clipper will perform dozens of close flybys of Jupiter’s icy moon Europa, dipping as low as 25 km above the surface to determine whether locations below the ice could support extraterrestrial microbial life.',
    officialUrl: 'https://europa.nasa.gov/',
  },
  {
    id: 'iss-commercial-transition',
    title: 'Axiom Space & NASA Validate Commercial Habitat Module Docking Interface for ISS',
    category: 'Human Spaceflight',
    agency: 'NASA / Commercial',
    date: 'October 15, 2026',
    badge: 'Microgravity',
    summary: 'Engineers complete structural fit checks for the first commercial space station module, planned to attach to the forward port of the Harmony node.',
    fullDetails: 'As the International Space Station approaches its planned retirement in 2030, commercial destinations in Low Earth Orbit (LEO) ensure continuous microgravity research and sovereign astronaut missions.',
    officialUrl: 'https://www.nasa.gov/international-space-station/',
  },
  {
    id: 'mars-sample-return',
    title: 'Perseverance Caches 25th Hermetically Sealed Rock Core in Jezero Ancient Delta',
    category: 'Planetary Science',
    agency: 'NASA JPL / ESA',
    date: 'October 10, 2026',
    badge: 'Mars Exploration',
    summary: 'A new sedimentary drill core collected from the "Bright Angel" boulder site reveals fine silicate clays ideal for preserving ancient organic microbial biosignatures.',
    fullDetails: 'The sample joins a fleet of titanium tubes that will be retrieved by the joint NASA-ESA Mars Sample Return campaign for ultra-sensitive laboratory analysis on Earth.',
    officialUrl: 'https://mars.nasa.gov/mars2020/',
  },
  {
    id: 'starship-refueling',
    title: 'Orbital Cryogenic Propellant Transfer Demonstration Achieves High-Purity Transfer',
    category: 'Rocket Tech',
    agency: 'SpaceX / NASA Tipping Point',
    date: 'October 6, 2026',
    badge: 'Propulsion Tech',
    summary: 'In-space transfer of sub-cooled liquid oxygen and liquid methane demonstrated between two test tanks, validating orbital refueling for lunar Starship missions.',
    fullDetails: 'Orbital refueling is the critical enabling technology for large-scale interplanetary payloads, allowing heavy landers to depart Low Earth Orbit fully fueled for the Moon and Mars.',
    officialUrl: 'https://www.spacex.com/launches/',
  }
];

export const NewsSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredNews = NEWS_DATABASE.filter((n) => {
    const matchesCat = selectedCategory === 'all' || n.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          n.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          n.agency.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const featuredStory = NEWS_DATABASE[0];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1.5">
          <Newspaper className="w-5 h-5 text-cyan-400" />
          <span className="text-xs uppercase tracking-widest text-cyan-400 font-mono font-bold">
            SPACE EXPLORATION JOURNALISM & INTELLIGENCE
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wide">
          Official Space Flight News & Bulletins
        </h1>
        <p className="text-sm text-slate-400 max-w-3xl mt-1">
          Stay informed with verified mission dispatches from NASA, ESA, JPL, and international aerospace agencies, complete with official press releases and primary documentation.
        </p>
      </div>

      {/* Featured Lead Story Banner */}
      <div className="mb-8 p-6 md:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/40 border border-cyan-500/30 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-3 text-xs font-mono">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold uppercase">
              FEATURED HEADLINE
            </span>
            <span className="text-slate-400">{featuredStory.date}</span>
            <span className="text-slate-500">•</span>
            <span className="text-cyan-400 font-bold">{featuredStory.agency}</span>
          </div>

          <h2 className="text-xl md:text-3xl font-bold text-white leading-tight mb-3">
            {featuredStory.title}
          </h2>

          <p className="text-xs md:text-sm text-slate-300 leading-relaxed mb-4">
            {featuredStory.summary}
          </p>

          <p className="text-xs text-slate-400 leading-relaxed mb-6 hidden md:block">
            {featuredStory.fullDetails}
          </p>

          <a
            href={featuredStory.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-lg shadow-cyan-500/20"
          >
            <span>Read Official NASA Release</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 w-full sm:w-auto">
          {['all', 'Human Spaceflight', 'Astrophysics', 'Planetary Science', 'Deep Space', 'Rocket Tech'].map((cat) => (
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

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search news, missions, agencies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
          />
        </div>
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredNews.map((article) => (
          <div
            key={article.id}
            className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition duration-300 flex flex-col justify-between shadow-xl hover:shadow-cyan-950/20"
          >
            <div>
              <div className="flex items-center justify-between text-[10px] font-mono mb-2.5">
                <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-semibold border border-slate-700">
                  {article.badge}
                </span>
                <span className="text-slate-500">{article.date}</span>
              </div>

              <h3 className="text-base font-bold text-white mb-2 leading-snug">
                {article.title}
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                {article.summary}
              </p>

              <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-3">
                {article.fullDetails}
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] font-mono text-cyan-400 font-semibold">
                {article.agency}
              </span>
              <a
                href={article.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white transition font-mono"
              >
                <span>Official Link</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
