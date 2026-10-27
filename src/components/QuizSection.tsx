import React, { useState, useEffect, useRef } from 'react';
import { sound } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import {
  HelpCircle,
  Sparkles,
  Trophy,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Crosshair,
  ShieldAlert,
  ChevronRight,
  Brain,
  Rocket,
  Globe2,
  Satellite,
  Sun,
  Flame,
  Atom,
  Eye
} from 'lucide-react';
import { QuizQuestion } from '../types/space';

// Curated astronomy quiz dataset
const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    category: 'Solar System',
    difficulty: 'Cadet',
    question: 'Which planet in our solar system has the highest surface temperature, despite not being closest to the Sun?',
    options: ['Mercury', 'Venus', 'Mars', 'Jupiter'],
    correctIndex: 1,
    explanation: 'Venus is hotter than Mercury (approx 464°C) due to a runaway greenhouse effect caused by its dense 96.5% carbon dioxide atmosphere trapping solar heat.'
  },
  {
    id: 2,
    category: 'Solar System',
    difficulty: 'Cadet',
    question: 'What is the Great Red Spot on Jupiter?',
    options: ['A massive active volcano', 'An impact crater from a comet', 'A gigantic anticyclonic storm older than 300 years', 'A molten lake of liquid sulfur'],
    correctIndex: 2,
    explanation: 'The Great Red Spot is a persistent high-pressure anticyclonic storm larger than Earth, with wind speeds reaching over 430 km/h.'
  },
  {
    id: 3,
    category: 'Orbital Mechanics',
    difficulty: 'Specialist',
    question: 'According to Kepler’s Third Law of Planetary Motion, what is the mathematical relationship between orbital period (T) and semi-major axis (a)?',
    options: ['T is proportional to a', 'T² is proportional to a³', 'T³ is proportional to a²', 'T is proportional to 1/a²'],
    correctIndex: 1,
    explanation: 'Kepler’s Third Law states that the square of a planet’s orbital period (T²) is directly proportional to the cube of its semi-major axis (a³).'
  },
  {
    id: 4,
    category: 'Space Missions',
    difficulty: 'Cadet',
    question: 'In 2015, which robotic NASA spacecraft conducted humanity’s first historic flyby of Pluto?',
    options: ['Voyager 1', 'Cassini', 'New Horizons', 'Dawn'],
    correctIndex: 2,
    explanation: 'NASA’s New Horizons probe flew past Pluto on July 14, 2015, revealing high water-ice mountains and the vast nitrogen glacier Sputnik Planitia.'
  },
  {
    id: 5,
    category: 'Astrophysics',
    difficulty: 'Specialist',
    question: 'What thermonuclear reaction fuels the Sun in its core?',
    options: ['Uranium fission', 'Proton-proton chain hydrogen fusion into helium', 'Chemical combustion of oxygen', 'Helium flash fusion into carbon'],
    correctIndex: 1,
    explanation: 'The Sun fuses approximately 600 million tons of hydrogen into helium every second via the proton-proton chain reaction at 15 million kelvins.'
  },
  {
    id: 6,
    category: 'Orbital Mechanics',
    difficulty: 'Commander',
    question: 'What is the primary physical benefit of a gravity assist (gravitational slingshot)?',
    options: ['It slows the spacecraft down to save thermal tiles', 'It steals orbital momentum from a planet to alter craft speed & heading without propellant', 'It shields against cosmic radiation', 'It recharges the solar arrays via tidal forces'],
    correctIndex: 1,
    explanation: 'A gravity assist exchanges orbital energy between the spacecraft and the planet, allowing deep space probes to accelerate to immense velocities without burning rocket fuel.'
  },
  {
    id: 7,
    category: 'Solar System',
    difficulty: 'Cadet',
    question: 'Which of Saturn’s moons is famous for possessing a dense nitrogen atmosphere and liquid hydrocarbon lakes?',
    options: ['Enceladus', 'Mimas', 'Titan', 'Iapetus'],
    correctIndex: 2,
    explanation: 'Titan is the only moon in the solar system with a substantial atmosphere (1.5x Earth pressure) and surface rivers, lakes, and seas composed of liquid methane and ethane.'
  },
  {
    id: 8,
    category: 'Space Missions',
    difficulty: 'Specialist',
    question: 'How fast does the International Space Station (ISS) travel in Low Earth Orbit?',
    options: ['~1,200 km/h (Mach 1)', '~7,500 km/h', '~27,600 km/h (7.7 km/s)', '~108,000 km/h'],
    correctIndex: 2,
    explanation: 'The ISS travels at roughly 27,600 km/h (7.66 km/s), completing an orbit around Earth every ~93 minutes.'
  }
];

// Memory Card Definitions
interface MemoryCardItem {
  id: number;
  pairKey: string;
  name: string;
  iconName: string;
  color: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const MEMORY_CARD_TYPES = [
  { key: 'sun', name: 'The Sun', icon: Sun, color: '#f59e0b' },
  { key: 'earth', name: 'Earth', icon: Globe2, color: '#06b6d4' },
  { key: 'rocket', name: 'Saturn V', icon: Rocket, color: '#ef4444' },
  { key: 'iss', name: 'Space Station', icon: Satellite, color: '#10b981' },
  { key: 'blackhole', name: 'Singularity', icon: Atom, color: '#a855f7' },
  { key: 'telescope', name: 'James Webb', icon: Eye, color: '#eab308' },
  { key: 'nebula', name: 'Carina Nebula', icon: Sparkles, color: '#ec4899' },
  { key: 'fusion', name: 'Nuclear Core', icon: Flame, color: '#f97316' },
];

export const QuizSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'quiz' | 'memory' | 'nebula' | 'graviton'>('quiz');

  // --- QUIZ STATE ---
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);

  const q = QUIZ_QUESTIONS[currentQuestionIdx];

  const handleSelectOption = (idx: number) => {
    if (hasAnswered) return;
    setSelectedOption(idx);
    setHasAnswered(true);

    if (idx === q.correctIndex) {
      setScore((prev) => prev + 100 + streak * 20);
      setStreak((prev) => prev + 1);
      sound.playSuccessChime();
    } else {
      setStreak(0);
      sound.playErrorBuzz();
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIdx + 1 < QUIZ_QUESTIONS.length) {
      setCurrentQuestionIdx((prev) => prev + 1);
      setSelectedOption(null);
      setHasAnswered(false);
    } else {
      setIsQuizComplete(true);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setScore(0);
    setStreak(0);
    setIsQuizComplete(false);
    setHasAnswered(false);
  };

  // --- COSMIC MEMORY GAME STATE ---
  const [memoryCards, setMemoryCards] = useState<MemoryCardItem[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [movesCount, setMovesCount] = useState(0);
  const [matchesFound, setMatchesFound] = useState(0);
  const [memoryGameWon, setMemoryGameWon] = useState(false);
  const [memoryTimer, setMemoryTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const initializeMemoryGame = () => {
    const deck: MemoryCardItem[] = [];
    let idCounter = 1;

    // Create 2 cards for each of the 8 types
    MEMORY_CARD_TYPES.forEach((item) => {
      deck.push({
        id: idCounter++,
        pairKey: item.key,
        name: item.name,
        iconName: item.key,
        color: item.color,
        isFlipped: false,
        isMatched: false,
      });
      deck.push({
        id: idCounter++,
        pairKey: item.key,
        name: item.name,
        iconName: item.key,
        color: item.color,
        isFlipped: false,
        isMatched: false,
      });
    });

    // Shuffle deck
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    setMemoryCards(deck);
    setFlippedIndices([]);
    setMovesCount(0);
    setMatchesFound(0);
    setMemoryGameWon(false);
    setMemoryTimer(0);
    setIsTimerRunning(true);
  };

  useEffect(() => {
    if (activeTab === 'memory' && memoryCards.length === 0) {
      initializeMemoryGame();
    }
  }, [activeTab]);

  useEffect(() => {
    let interval: any;
    if (isTimerRunning && !memoryGameWon) {
      interval = setInterval(() => {
        setMemoryTimer((t) => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, memoryGameWon]);

  const handleCardClick = (index: number) => {
    if (flippedIndices.length >= 2 || memoryCards[index].isFlipped || memoryCards[index].isMatched) {
      return;
    }

    sound.playPickup();
    const updatedCards = [...memoryCards];
    updatedCards[index].isFlipped = true;
    setMemoryCards(updatedCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMovesCount((m) => m + 1);
      const [firstIdx, secondIdx] = newFlipped;
      const firstCard = updatedCards[firstIdx];
      const secondCard = updatedCards[secondIdx];

      if (firstCard.pairKey === secondCard.pairKey) {
        // Match found!
        setTimeout(() => {
          sound.playSuccessChime();
          const matchedState = [...memoryCards];
          matchedState[firstIdx].isMatched = true;
          matchedState[secondIdx].isMatched = true;
          setMemoryCards(matchedState);
          setFlippedIndices([]);
          setMatchesFound((m) => {
            const next = m + 1;
            if (next === MEMORY_CARD_TYPES.length) {
              setMemoryGameWon(true);
              setIsTimerRunning(false);
              confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
            }
            return next;
          });
        }, 400);
      } else {
        // No match, flip back
        setTimeout(() => {
          sound.playErrorBuzz();
          const revertedCards = [...memoryCards];
          revertedCards[firstIdx].isFlipped = false;
          revertedCards[secondIdx].isFlipped = false;
          setMemoryCards(revertedCards);
          setFlippedIndices([]);
        }, 900);
      }
    }
  };

  const getMemoryCardIcon = (key: string) => {
    switch (key) {
      case 'sun': return <Sun className="w-8 h-8 text-amber-400" />;
      case 'earth': return <Globe2 className="w-8 h-8 text-cyan-400" />;
      case 'rocket': return <Rocket className="w-8 h-8 text-rose-400" />;
      case 'iss': return <Satellite className="w-8 h-8 text-emerald-400" />;
      case 'blackhole': return <Atom className="w-8 h-8 text-purple-400" />;
      case 'telescope': return <Eye className="w-8 h-8 text-yellow-400" />;
      case 'nebula': return <Sparkles className="w-8 h-8 text-pink-400" />;
      case 'fusion': return <Flame className="w-8 h-8 text-orange-400" />;
      default: return <Sparkles className="w-8 h-8 text-cyan-400" />;
    }
  };

  // --- NEBULA ESCAPE GAME STATE ---
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nebulaScore, setNebulaScore] = useState(0);
  const [nebulaGameOver, setNebulaGameOver] = useState(false);
  const [nebulaRunning, setNebulaRunning] = useState(false);
  const [crystalsCollected, setCrystalsCollected] = useState(0);

  useEffect(() => {
    if (activeTab !== 'nebula') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let ship = { x: canvas.width / 2, y: canvas.height - 70, radius: 14, vx: 0, vy: 0, shields: 3 };
    let asteroids: any[] = [];
    let crystals: any[] = [];
    let particles: any[] = [];
    let keys: { [key: string]: boolean } = {};

    const handleKeyDown = (e: KeyboardEvent) => { keys[e.key.toLowerCase()] = true; };
    const handleKeyUp = (e: KeyboardEvent) => { keys[e.key.toLowerCase()] = false; };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    let animationId: number;
    let spawnTimer = 0;
    let localScore = 0;
    let localCrystals = 0;

    const gameLoop = () => {
      if (!nebulaRunning) return;
      animationId = requestAnimationFrame(gameLoop);

      ctx.fillStyle = 'rgba(2, 6, 23, 0.35)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const speed = 4.5;
      if (keys['arrowleft'] || keys['a']) ship.vx = -speed;
      else if (keys['arrowright'] || keys['d']) ship.vx = speed;
      else ship.vx *= 0.8;

      if (keys['arrowup'] || keys['w']) ship.vy = -speed;
      else if (keys['arrowdown'] || keys['s']) ship.vy = speed;
      else ship.vy *= 0.8;

      ship.x = Math.max(ship.radius, Math.min(canvas.width - ship.radius, ship.x + ship.vx));
      ship.y = Math.max(ship.radius, Math.min(canvas.height - ship.radius, ship.y + ship.vy));

      // Draw Ship
      ctx.save();
      ctx.translate(ship.x, ship.y);
      ctx.fillStyle = '#06b6d4';
      ctx.beginPath();
      ctx.moveTo(0, -16);
      ctx.lineTo(12, 12);
      ctx.lineTo(0, 6);
      ctx.lineTo(-12, 12);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#e0f2fe';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      if (ship.shields > 0) {
        ctx.strokeStyle = `rgba(56, 189, 248, ${0.3 + ship.shields * 0.2})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, 20, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();

      spawnTimer++;
      if (spawnTimer % 28 === 0) {
        asteroids.push({
          x: Math.random() * canvas.width,
          y: -20,
          r: Math.random() * 12 + 10,
          vy: Math.random() * 2.5 + 2,
          vx: (Math.random() - 0.5) * 1,
          angle: 0,
          spin: (Math.random() - 0.5) * 0.05,
        });
      }
      if (spawnTimer % 45 === 0) {
        crystals.push({
          x: Math.random() * (canvas.width - 40) + 20,
          y: -15,
          r: 9,
          vy: Math.random() * 1.5 + 1.8,
        });
      }

      for (let i = asteroids.length - 1; i >= 0; i--) {
        const a = asteroids[i];
        a.y += a.vy;
        a.x += a.vx;
        a.angle += a.spin;

        ctx.save();
        ctx.translate(a.x, a.y);
        ctx.rotate(a.angle);
        ctx.fillStyle = '#64748b';
        ctx.beginPath();
        ctx.arc(0, 0, a.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        const dist = Math.hypot(ship.x - a.x, ship.y - a.y);
        if (dist < ship.radius + a.r) {
          asteroids.splice(i, 1);
          ship.shields--;
          sound.playErrorBuzz();
          if (ship.shields <= 0) {
            setNebulaRunning(false);
            setNebulaGameOver(true);
            return;
          }
          continue;
        }
        if (a.y > canvas.height + 30) asteroids.splice(i, 1);
      }

      for (let i = crystals.length - 1; i >= 0; i--) {
        const c = crystals[i];
        c.y += c.vy;

        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
        ctx.fill();

        const dist = Math.hypot(ship.x - c.x, ship.y - c.y);
        if (dist < ship.radius + c.r) {
          crystals.splice(i, 1);
          localScore += 50;
          localCrystals++;
          setNebulaScore(localScore);
          setCrystalsCollected(localCrystals);
          sound.playPickup();
          continue;
        }
        if (c.y > canvas.height + 20) crystals.splice(i, 1);
      }

      localScore++;
      setNebulaScore(localScore);
    };

    if (nebulaRunning) {
      animationId = requestAnimationFrame(gameLoop);
    }

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [activeTab, nebulaRunning]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <HelpCircle className="w-5 h-5 text-cyan-400" />
            <span className="text-xs uppercase tracking-widest text-cyan-400 font-mono font-bold">
              SPACE ACADEMY • QUIZ & INTERACTIVE GAMES
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wide">
            Astrophysics Quiz & Space Games
          </h1>
        </div>

        {/* Mode Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeTab === 'quiz'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Solar Quiz</span>
          </button>
          <button
            onClick={() => setActiveTab('memory')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeTab === 'memory'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Brain className="w-4 h-4 text-emerald-400" />
            <span>Cosmic Memory</span>
          </button>
          <button
            onClick={() => setActiveTab('nebula')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeTab === 'nebula'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Nebula Escape</span>
          </button>
        </div>
      </div>

      {/* --- TAB 1: SOLAR QUIZ --- */}
      {activeTab === 'quiz' && (
        <div className="max-w-3xl mx-auto">
          {!isQuizComplete ? (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-cyan-950/80 text-cyan-300 border border-cyan-800 font-semibold">
                    {q.category}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    {q.difficulty}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-slate-300">
                  <span>Question {currentQuestionIdx + 1} of {QUIZ_QUESTIONS.length}</span>
                  <span className="text-cyan-400 font-bold">Score: {score} XP</span>
                </div>
              </div>

              <h2 className="text-lg md:text-xl font-bold text-white my-6 leading-relaxed">
                {q.question}
              </h2>

              <div className="space-y-3">
                {q.options.map((opt, idx) => {
                  let btnStyle = 'bg-slate-800/80 border-slate-700/80 text-slate-200 hover:bg-slate-700/80';
                  if (hasAnswered) {
                    if (idx === q.correctIndex) {
                      btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-semibold';
                    } else if (idx === selectedOption) {
                      btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200';
                    } else {
                      btnStyle = 'bg-slate-900/50 border-slate-800 text-slate-500 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={hasAnswered}
                      className={`w-full p-4 rounded-xl border text-left text-sm transition flex items-center justify-between cursor-pointer ${btnStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-slate-950/80 border border-slate-700 flex items-center justify-center text-xs font-mono text-cyan-400 font-bold">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opt}</span>
                      </div>
                      {hasAnswered && idx === q.correctIndex && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      )}
                      {hasAnswered && idx === selectedOption && idx !== q.correctIndex && (
                        <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {hasAnswered && (
                <div className="mt-6 p-4 rounded-xl bg-slate-950/80 border border-cyan-500/30 animate-in fade-in duration-300">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-bold">
                      Astrophysics Explanation
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {q.explanation}
                  </p>
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={handleNextQuestion}
                      className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold font-mono uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 shadow-lg shadow-cyan-500/20"
                    >
                      <span>Next Question</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-8 text-center shadow-2xl backdrop-blur-xl">
              <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Solar System Quiz Complete!</h2>
              <p className="text-sm text-slate-300 max-w-md mx-auto mb-6">
                Outstanding work, Space Cadet! You demonstrated stellar astrophysics understanding across planetary science and orbital mechanics.
              </p>
              <div className="inline-block p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-center mb-6">
                <span className="text-xs font-mono uppercase text-slate-400 block">Total Cadet XP Earned</span>
                <span className="text-3xl font-black font-mono text-cyan-400">{score} XP</span>
              </div>
              <div className="flex justify-center gap-3">
                <button
                  onClick={resetQuiz}
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition cursor-pointer flex items-center gap-2 shadow-lg shadow-cyan-500/20"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retake Quiz</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- TAB 2: COSMIC MEMORY MATCH GAME --- */}
      {activeTab === 'memory' && (
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          {/* Status Bar */}
          <div className="w-full flex items-center justify-between mb-4 p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-mono">
            <div className="flex items-center gap-4">
              <span className="text-slate-400">Moves: <strong className="text-white">{movesCount}</strong></span>
              <span className="text-slate-400">Time: <strong className="text-cyan-400">{memoryTimer}s</strong></span>
              <span className="text-slate-400">Matches: <strong className="text-emerald-400">{matchesFound} / {MEMORY_CARD_TYPES.length}</strong></span>
            </div>
            <button
              onClick={initializeMemoryGame}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Game</span>
            </button>
          </div>

          {/* 4x4 Memory Cards Grid */}
          <div className="grid grid-cols-4 gap-3.5 w-full max-w-[620px]">
            {memoryCards.map((card, idx) => {
              const isVisible = card.isFlipped || card.isMatched;
              return (
                <div
                  key={card.id}
                  onClick={() => handleCardClick(idx)}
                  className={`aspect-square rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center p-3 text-center cursor-pointer select-none ${
                    isVisible
                      ? 'bg-slate-900 border-cyan-500/50 shadow-xl shadow-cyan-950/40 rotate-0'
                      : 'bg-slate-950 hover:bg-slate-900 border-slate-800 hover:border-slate-700 shadow-md'
                  }`}
                >
                  {isVisible ? (
                    <div className="flex flex-col items-center gap-2 animate-in zoom-in-75 duration-200">
                      {getMemoryCardIcon(card.iconName)}
                      <span className="text-[11px] font-bold text-white tracking-wide truncate max-w-[80px]">
                        {card.name}
                      </span>
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600 font-mono text-sm font-bold">
                      ?
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Victory Modal */}
          {memoryGameWon && (
            <div className="mt-6 p-6 rounded-2xl bg-emerald-950/80 border border-emerald-500 text-center animate-in zoom-in-90 duration-300 max-w-md w-full shadow-2xl">
              <Trophy className="w-12 h-12 text-emerald-400 mx-auto mb-2" />
              <h3 className="text-xl font-bold text-white mb-1">Cosmic Memory Master!</h3>
              <p className="text-xs text-slate-300 mb-4">
                You matched all celestial pairs in <strong className="text-white">{movesCount} moves</strong> and <strong className="text-cyan-300">{memoryTimer} seconds</strong>!
              </p>
              <button
                onClick={initializeMemoryGame}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition cursor-pointer"
              >
                Play Again
              </button>
            </div>
          )}
        </div>
      )}

      {/* --- TAB 3: NEBULA ESCAPE ARCADE --- */}
      {activeTab === 'nebula' && (
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-3 text-xs font-mono">
            <span className="text-slate-400">CARINA NEBULA ESCAPE CORRIDOR</span>
            <div className="flex items-center gap-4">
              <span className="text-amber-400 font-semibold">Crystals: {crystalsCollected}</span>
              <span className="text-cyan-400 font-bold">Flight Score: {nebulaScore}</span>
            </div>
          </div>

          <div className="relative w-full max-w-[600px] aspect-[4/3] rounded-2xl overflow-hidden border border-purple-500/30 shadow-2xl shadow-purple-950/40 bg-slate-950">
            <canvas ref={canvasRef} width={600} height={450} className="w-full h-full block" />

            {!nebulaRunning && !nebulaGameOver && (
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
                <div className="w-14 h-14 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-400 flex items-center justify-center mb-3">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Nebula Escape Arcade</h3>
                <p className="text-xs text-slate-300 max-w-sm mb-5 leading-relaxed">
                  Pilot your scout ship through the cosmic dust storms! Use <strong className="text-cyan-400">Arrow Keys / WASD</strong> to dodge dense asteroids and collect Quantum Fuel Crystals.
                </p>
                <button
                  onClick={() => {
                    setNebulaGameOver(false);
                    setNebulaScore(0);
                    setCrystalsCollected(0);
                    setNebulaRunning(true);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-lg shadow-purple-600/30"
                >
                  Engine Start • Launch Ship
                </button>
              </div>
            )}

            {nebulaGameOver && (
              <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
                <div className="w-14 h-14 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mb-3">
                  <ShieldAlert className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-1">Shields Depleted!</h3>
                <p className="text-xs text-slate-400 mb-4 font-mono">
                  Final Flight Score: <span className="text-cyan-400 font-bold">{nebulaScore}</span> • Crystals: <span className="text-amber-400 font-bold">{crystalsCollected}</span>
                </p>
                <button
                  onClick={() => {
                    setNebulaGameOver(false);
                    setNebulaScore(0);
                    setCrystalsCollected(0);
                    setNebulaRunning(true);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-lg shadow-cyan-500/30 flex items-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Escape Again</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
