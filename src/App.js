import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Settings, Volume2, VolumeX, Smartphone, RotateCw, ShoppingCart, ShieldCheck, Play, ChevronLeft } from 'lucide-react';

// --- ADMOB IMPORT (COMMENTED OUT FOR WEB PREVIEW) ---
// import { AdMob, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';

// --- MOCK ADMOB FOR WEB PREVIEW ---
const AdMob = {
  initialize: async () => console.log('AdMob: Initialized'),
  showBanner: async () => console.log('AdMob: Show Banner'),
  prepareInterstitial: async () => console.log('AdMob: Prepare Interstitial'),
  showInterstitial: async () => console.log('AdMob: Show Interstitial'),
};
const BannerAdSize = { BANNER: 'BANNER' };
const BannerAdPosition = { BOTTOM_CENTER: 'BOTTOM_CENTER' };

/**
 * INDIAN CHARADES - FINAL STABLE VERSION
 * * Features:
 * - Fixed Redirect Bug (Splash screen logic isolated)
 * - "Neutral Zone" Tilt Logic (Prevents accidental double-triggering)
 * - Auto-Start on Landscape
 */

// --- CONSTANTS (Moved outside to prevent re-renders) ---
const ADMOB_IDS = {
  android: {
    banner: 'ca-app-pub-3940256099942544/6300978111', 
    interstitial: 'ca-app-pub-3940256099942544/1033173712'
  },
  ios: {
    banner: 'ca-app-pub-3940256099942544/2934735716',
    interstitial: 'ca-app-pub-3940256099942544/4411468910'
  }
};

const CATEGORIES = [
  {
    id: 'bollywood',
    name: 'Bollywood Movies',
    icon: '🎬',
    color: 'bg-red-500',
    words: ['Sholay', 'DDLJ', '3 Idiots', 'Lagaan', 'Bahubali', 'KGF', 'Pushpa', 'Dangal', 'PK', 'Munna Bhai', 'Gadar', 'Don', 'RRR', 'Pathaan', 'Jawan', 'Stree', 'Drishyam', 'Hera Pheri', 'Golmaal', 'Chak De India']
  },
  {
    id: 'cricket',
    name: 'Cricket Stars',
    icon: '🏏',
    color: 'bg-blue-600',
    words: ['Virat Kohli', 'MS Dhoni', 'Sachin Tendulkar', 'Rohit Sharma', 'Hardik Pandya', 'Bumrah', 'Kapil Dev', 'Yuvraj Singh', 'Dravid', 'Ganguly', 'Jadeja', 'Rishabh Pant', 'Shami', 'Ashwin', 'Gill', 'Sehwag', 'Gambhir', 'Raina', 'Zaheer Khan', 'Kumble']
  },
  {
    id: 'food',
    name: 'Desi Food',
    icon: '🍛',
    color: 'bg-yellow-500',
    words: ['Biryani', 'Pani Puri', 'Dosa', 'Samosa', 'Butter Chicken', 'Vada Pav', 'Gulab Jamun', 'Idli', 'Chole Bhature', 'Pav Bhaji', 'Jalebi', 'Rasgulla', 'Dhokla', 'Tandoori Chicken', 'Naan', 'Lassi', 'Momos', 'Kheer', 'Rajma Chawal', 'Dal Makhani']
  },
  {
    id: 'places',
    name: 'Indian Places',
    icon: '🕌',
    color: 'bg-orange-500',
    words: ['Taj Mahal', 'Goa', 'Mumbai', 'Delhi', 'Jaipur', 'Kerala', 'Ladakh', 'Varanasi', 'Kolkata', 'Bangalore', 'Hyderabad', 'Manali', 'Shimla', 'Udaipur', 'Agra', 'Rishikesh', 'Darjeeling', 'Mysore', 'Golden Temple', 'Gateway of India']
  },
  {
    id: 'festivals',
    name: 'Festivals',
    icon: '🪔',
    color: 'bg-purple-500',
    words: ['Diwali', 'Holi', 'Eid', 'Christmas', 'Navratri', 'Durga Puja', 'Ganesh Chaturthi', 'Onam', 'Pongal', 'Raksha Bandhan', 'Janmashtami', 'Baisakhi', 'Makar Sankranti', 'Dussehra', 'Karwa Chauth', 'Lohri', 'Republic Day', 'Independence Day', 'Gandhi Jayanti', 'Mahashivratri']
  },
  {
    id: 'actions',
    name: 'Actions',
    icon: '🎭',
    color: 'bg-pink-500',
    words: ['Dancing', 'Sleeping', 'Cooking', 'Driving', 'Swimming', 'Singing', 'Crying', 'Laughing', 'Running', 'Fighting', 'Eating', 'Drinking', 'Reading', 'Writing', 'Thinking', 'Jumping', 'Clapping', 'Praying', 'Cleaning', 'Shopping']
  }
];

// --- SOUND UTILITIES ---
const playSound = (type, enabled) => {
  if (!enabled) return;
  
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    if (type === 'correct') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(500, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } else if (type === 'pass') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } else if (type === 'tick') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } else if (type === 'gameover') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.5);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1);
      osc.start();
      osc.stop(ctx.currentTime + 1);
    }
  } catch (e) {
    // console.error("Audio error", e);
  }
};

const triggerVibrate = (pattern, enabled) => {
  if (!enabled || !navigator.vibrate) return;
  navigator.vibrate(pattern);
};

export default function App() {
  // --- STATE ---
  const [screen, setScreen] = useState('splash');
  const [settings, setSettings] = useState({
    sound: true,
    vibration: true,
    adsRemoved: false,
    durationMinutes: 1,
  });
  
  const [gameState, setGameState] = useState({
    category: null,
    score: { correct: 0, pass: 0 },
    wordsQueue: [],
    currentWord: '',
    timeLeft: 0,
    isActive: false,
    results: []
  });

  const [prepTimer, setPrepTimer] = useState(3);
  const [isLandscape, setIsLandscape] = useState(false);
  
  // Tilt Logic Refs
  const tiltLocked = useRef(false);
  const waitingForNeutral = useRef(false); // NEW: Requires user to tilt back to center

  // --- INITIALIZATION ---

  const checkOrientation = useCallback(() => {
    // A robust check for landscape: width > height
    const isLand = window.innerWidth > window.innerHeight;
    setIsLandscape(isLand);
  }, []);

  const initializeAds = useCallback(async () => {
    if (settings.adsRemoved) return;
    try {
      await AdMob.initialize();
      const isAndroid = /Android/i.test(navigator.userAgent);
      const ids = isAndroid ? ADMOB_IDS.android : ADMOB_IDS.ios;
      await AdMob.showBanner({
        adId: ids.banner,
        position: BannerAdPosition.BOTTOM_CENTER,
        margin: 0, 
        size: BannerAdSize.BANNER
      });
    } catch (e) {
      console.error("AdMob Init Error:", e);
    }
  }, [settings.adsRemoved]);

  // App Start - Fixed the "Redirect Bug" by reducing dependencies
  useEffect(() => {
    initializeAds();
    checkOrientation();

    // Listen for resize/orientation changes
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    // This SPLASH TIMER now only runs ONCE on mount, ensuring no random redirects
    const timer = setTimeout(() => {
      setScreen('home');
    }, 2500); // Increased splash time slightly

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []); // Empty dependency array ensures this only runs once!


  // --- GAME LOGIC: PREP & START ---

  const startGameFlow = (duration) => {
    // 1. Set settings
    setSettings(prev => ({ ...prev, durationMinutes: duration }));
    
    // 2. Setup Game Data
    const catData = CATEGORIES.find(c => c.id === gameState.category);
    let words = [...catData.words];
    words = words.sort(() => Math.random() - 0.5);
    
    setGameState({
      category: gameState.category,
      score: { correct: 0, pass: 0 },
      wordsQueue: words,
      currentWord: words[0],
      timeLeft: duration * 60,
      isActive: false,
      results: []
    });

    // 3. Reset Tilt State
    waitingForNeutral.current = false;
    tiltLocked.current = false;

    // 4. Go to Prep Screen
    setScreen('prep');
    setPrepTimer(3);
    requestTiltPermission();
  };

  // --- PREP TIMER LOGIC (LANDSCAPE TRIGGER) ---
  useEffect(() => {
    let countInterval = null;

    // Only run this logic if we are in PREP mode
    if (screen === 'prep') {
      if (isLandscape) {
        // Phone is in position! Start Countdown.
        countInterval = setInterval(() => {
          setPrepTimer(prev => {
            if (prev <= 1) {
              clearInterval(countInterval);
              setScreen('game');
              setGameState(gs => ({ ...gs, isActive: true }));
              return 0;
            }
            playSound('tick', settings.sound);
            return prev - 1;
          });
        }, 1000);
      } else {
        // Phone rotated back to portrait? Reset timer.
        setPrepTimer(3);
      }
    }

    return () => {
      if (countInterval) clearInterval(countInterval);
    };
  }, [screen, isLandscape, settings.sound]);


  // --- GAME TIMER ---
  useEffect(() => {
    let interval = null;
    if (screen === 'game' && gameState.isActive && gameState.timeLeft > 0) {
      interval = setInterval(() => {
        setGameState(prev => {
          if (prev.timeLeft <= 1) {
            return { ...prev, timeLeft: 0 };
          }
          if (prev.timeLeft <= 6 && settings.sound) {
             playSound('tick', true);
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [screen, gameState.isActive, settings.sound]);

  // Watch for game end
  const endGame = useCallback(async () => {
    setGameState(prev => ({ ...prev, isActive: false }));
    playSound('gameover', settings.sound);
    triggerVibrate(500, settings.vibration);
    
    if (!settings.adsRemoved) {
       try {
         const isAndroid = /Android/i.test(navigator.userAgent);
         const ids = isAndroid ? ADMOB_IDS.android : ADMOB_IDS.ios;
         await AdMob.prepareInterstitial({ adId: ids.interstitial });
         await AdMob.showInterstitial();
       } catch (e) {
         console.error("AdMob Interstitial Error:", e);
       }
    }
    setScreen('result');
  }, [settings.adsRemoved, settings.sound, settings.vibration]);

  useEffect(() => {
      if (screen === 'game' && gameState.isActive && gameState.timeLeft === 0) {
          endGame();
      }
  }, [gameState.timeLeft, screen, gameState.isActive, endGame]);


  // --- TILT PROCESSING ---
  const processAction = useCallback((action) => {
    if (tiltLocked.current) return;
    tiltLocked.current = true;
    
    setGameState(prev => {
        const currentWord = prev.currentWord;
        const newResults = [...prev.results, { word: currentWord, status: action }];
        
        const newScore = { ...prev.score };
        if (action === 'correct') {
            newScore.correct += 1;
            playSound('correct', settings.sound);
            triggerVibrate(100, settings.vibration);
        } else {
            newScore.pass += 1;
            playSound('pass', settings.sound);
            triggerVibrate([50, 50, 50], settings.vibration);
        }

        return {
            ...prev,
            score: newScore,
            results: newResults
        };
    });

    // Next Word Loading Logic
    // NOTE: We do NOT unlock tilt here. We set a flag requiring neutral.
    waitingForNeutral.current = true; 

    setTimeout(() => {
      setGameState(prev => {
        const nextQueue = prev.wordsQueue.slice(1);
        if (nextQueue.length === 0) {
           setTimeout(endGame, 100);
           return prev;
        }
        return {
          ...prev,
          wordsQueue: nextQueue,
          currentWord: nextQueue[0]
        };
      });
      // We still keep tiltLocked true until user physically resets orientation
    }, 500); 
  }, [settings.sound, settings.vibration, endGame]);


  // --- LANDSCAPE TILT SENSOR LOGIC (FIXED) ---
  const handleOrientation = useCallback((event) => {
    // Guard Clauses
    if (screen !== 'game' || !gameState.isActive) return;

    const { gamma } = event; // gamma is left-to-right tilt (which is Up/Down in Landscape)
    const TILT_THRESHOLD = 35; // Increased threshold slightly for stability
    const NEUTRAL_THRESHOLD = 15; // Zone considered "Reset"

    // 1. NEUTRAL RESET CHECK
    // If we are locked waiting for neutral, check if user brought phone back to center
    if (waitingForNeutral.current) {
      if (Math.abs(gamma) < NEUTRAL_THRESHOLD) {
        // User has returned to center! Unlock everything.
        waitingForNeutral.current = false;
        tiltLocked.current = false;
      }
      return; // Do nothing else until reset
    }

    // 2. STANDARD CHECK
    // If not locked, look for triggers
    if (tiltLocked.current) return;

    // Gamma < -35 means tilted UP (towards sky/back of head) -> Correct
    if (gamma < -TILT_THRESHOLD) {
       processAction('correct'); 
    } 
    // Gamma > 35 means tilted DOWN (towards floor/chin) -> Pass
    else if (gamma > TILT_THRESHOLD) {
       processAction('pass');    
    }
  }, [screen, gameState.isActive, processAction]); 

  useEffect(() => {
    const listener = (e) => handleOrientation(e);
    if (screen === 'game') {
      window.addEventListener('deviceorientation', listener);
    }
    return () => {
      window.removeEventListener('deviceorientation', listener);
    };
  }, [screen, handleOrientation]);

  // --- PERMISSIONS ---
  const requestTiltPermission = async () => {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        const response = await DeviceOrientationEvent.requestPermission();
        if (response !== 'granted') {
          // Permission denied
        }
      } catch (e) {
        console.error(e);
      }
    }
  };
  
  const restorePurchase = () => {
    setSettings(prev => ({ ...prev, adsRemoved: true }));
  };

  // --- RENDER HELPERS ---
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // --- COMPONENT RENDER TREE ---

  if (screen === 'splash') {
    return (
      <div className="h-screen w-full bg-indigo-900 flex flex-col items-center justify-center text-white">
        <div className="text-6xl mb-4 animate-bounce">🇮🇳</div>
        <h1 className="text-4xl font-bold tracking-wider mb-2">DESI CHARADES</h1>
        <p className="text-indigo-300">Loading Game...</p>
      </div>
    );
  }

  if (screen === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800 text-white flex flex-col">
        <div className="p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Desi Charades</h1>
          <button onClick={() => setScreen('settings')} className="p-2 bg-white/10 rounded-full">
            <Settings size={24} />
          </button>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-6">
          <div className="w-48 h-48 bg-white/10 rounded-full flex items-center justify-center border-4 border-yellow-400 shadow-lg shadow-yellow-500/20 mb-8">
            <Smartphone size={80} className="text-yellow-400" />
          </div>
          <button 
            onClick={() => setScreen('category')}
            className="w-full max-w-xs bg-yellow-400 text-indigo-900 py-4 rounded-xl text-xl font-black shadow-lg transform active:scale-95 transition-transform flex items-center justify-center gap-2"
          >
            <Play fill="currentColor" /> PLAY GAME
          </button>
          <button onClick={() => setScreen('howtoplay')} className="w-full max-w-xs bg-white/20 py-3 rounded-xl font-bold backdrop-blur-sm">
            How To Play
          </button>
          {!settings.adsRemoved && (
            <button onClick={() => setSettings(s => ({...s, adsRemoved: true}))} className="text-sm text-yellow-300 underline mt-4">
              Remove Ads (₹99)
            </button>
          )}
        </div>
      </div>
    );
  }

  if (screen === 'settings' || screen === 'howtoplay') {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4">
        <div className="flex items-center mb-8">
          <button onClick={() => setScreen('home')} className="p-2 mr-4">
            <ChevronLeft size={32} />
          </button>
          <h2 className="text-2xl font-bold">{screen === 'settings' ? 'Settings' : 'How to Play'}</h2>
        </div>
        {screen === 'settings' ? (
          <div className="space-y-4">
            <div className="bg-white/10 p-4 rounded-xl flex justify-between items-center">
              <div className="flex items-center gap-3">
                {settings.sound ? <Volume2 className="text-green-400"/> : <VolumeX className="text-red-400"/>}
                <span>Sound Effects</span>
              </div>
              <button 
                onClick={() => setSettings(s => ({...s, sound: !s.sound}))}
                className={`w-12 h-6 rounded-full relative ${settings.sound ? 'bg-green-500' : 'bg-gray-600'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${settings.sound ? 'right-1' : 'left-1'}`} />
              </button>
            </div>
            <div className="bg-white/10 p-4 rounded-xl flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Smartphone className={settings.vibration ? "text-green-400" : "text-red-400"}/>
                <span>Vibration</span>
              </div>
              <button 
                onClick={() => setSettings(s => ({...s, vibration: !s.vibration}))}
                className={`w-12 h-6 rounded-full relative ${settings.vibration ? 'bg-green-500' : 'bg-gray-600'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${settings.vibration ? 'right-1' : 'left-1'}`} />
              </button>
            </div>
            <div className="mt-8">
              <h3 className="text-gray-400 mb-2 uppercase text-sm font-bold tracking-wider">Premium</h3>
              <button 
                onClick={() => setSettings(s => ({...s, adsRemoved: true}))}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 p-4 rounded-xl flex items-center justify-between font-bold mb-3"
              >
                <span className="flex items-center gap-2"><ShoppingCart size={20}/> Remove Ads</span>
                <span>₹199.00</span>
              </button>
              <button 
                onClick={restorePurchase}
                className="w-full bg-white/5 p-4 rounded-xl flex items-center justify-between text-gray-300"
              >
                <span className="flex items-center gap-2"><ShieldCheck size={20}/> Restore Purchase</span>
              </button>
            </div>
            <div className="mt-8 p-4 bg-white/5 rounded-xl text-xs text-gray-400">
               <h4 className="font-bold text-gray-300 mb-2">Privacy Policy</h4>
               <p>We do not collect personal data. All game data is stored locally on your device. AdMob may collect data for personalized ads.</p>
            </div>
          </div>
        ) : (
           <div className="space-y-6 text-gray-300">
             <div className="bg-white/10 p-6 rounded-xl text-center">
                <RotateCw size={48} className="mx-auto mb-4 text-yellow-400" />
                <h3 className="text-xl font-bold text-white mb-2">1. Place on Forehead</h3>
                <p>Hold the phone against your forehead so your friends can see the screen, but you can't.</p>
             </div>
             <div className="bg-white/10 p-6 rounded-xl text-center">
                <div className="flex justify-center gap-8 mb-4">
                  <span className="text-green-400 font-bold">Tilt UP</span>
                  <span className="text-red-400 font-bold">Tilt DOWN</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">2. Tilt to Play</h3>
                <p>Tilt the phone <strong>UP</strong> (face sky) if you guess correctly.</p>
                <p className="mt-2">Tilt the phone <strong>DOWN</strong> (face floor) to pass.</p>
             </div>
           </div>
        )}
      </div>
    );
  }

  if (screen === 'category') {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4">
        <div className="flex items-center mb-6">
          <button onClick={() => setScreen('home')} className="p-2 mr-4">
            <ChevronLeft size={32} />
          </button>
          <h2 className="text-xl font-bold">Choose Category</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setGameState(p => ({...p, category: cat.id}));
                setScreen('duration');
              }}
              className={`${cat.color} aspect-square rounded-2xl flex flex-col items-center justify-center shadow-lg transform active:scale-95 transition-transform`}
            >
              <span className="text-4xl mb-2">{cat.icon}</span>
              <span className="font-bold text-center px-2">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (screen === 'duration') {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4 flex flex-col">
        <div className="flex items-center mb-6">
          <button onClick={() => setScreen('category')} className="p-2 mr-4">
            <ChevronLeft size={32} />
          </button>
          <h2 className="text-xl font-bold">Game Duration</h2>
        </div>
        <div className="flex-1 flex flex-col justify-center space-y-4">
          {[1, 2, 3, 4, 5].map(min => (
             <button
               key={min}
               onClick={() => startGameFlow(min)}
               className="w-full bg-white/10 py-5 rounded-xl text-xl font-bold hover:bg-yellow-400 hover:text-black transition-colors border border-white/20"
             >
               {min} Minute{min > 1 ? 's' : ''}
             </button>
          ))}
        </div>
      </div>
    );
  }

  // 7. PREP SCREEN (Landscape Detection)
  if (screen === 'prep') {
    return (
      <div className={`h-screen w-full bg-black text-white flex flex-col items-center justify-center p-8 text-center transition-colors duration-500 ${isLandscape ? 'bg-green-900' : 'bg-red-900'}`}>
        
        {!isLandscape ? (
          <>
            <RotateCw size={80} className="mb-6 text-yellow-400 animate-spin" />
            <h2 className="text-4xl font-bold mb-4">Rotate Phone!</h2>
            <p className="text-xl">Please turn your phone sideways (Landscape) to start.</p>
          </>
        ) : (
          <>
            <div className="text-8xl font-black text-white animate-ping mb-8">{prepTimer}</div>
            <h2 className="text-3xl font-bold text-yellow-400">Place on Forehead!</h2>
            <p className="text-xl mt-4">Get Ready...</p>
          </>
        )}
      </div>
    );
  }

  if (screen === 'game') {
    const catData = CATEGORIES.find(c => c.id === gameState.category);
    return (
      <div className={`h-screen w-full ${catData.color} flex flex-col relative overflow-hidden`}>
        <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center text-white/90 font-bold z-10">
          <div className="flex flex-col items-center bg-black/20 p-2 rounded-lg min-w-[60px]">
            <span className="text-xs uppercase">Time</span>
            <span className={`text-xl ${gameState.timeLeft < 10 ? 'text-red-300' : 'text-white'}`}>
              {formatTime(gameState.timeLeft)}
            </span>
          </div>
          <div className="flex gap-4">
             <div className="bg-green-600/80 px-4 py-1 rounded-full flex flex-col items-center">
                <span className="text-xs">Correct</span>
                <span className="text-lg">{gameState.score.correct}</span>
             </div>
             <div className="bg-red-600/80 px-4 py-1 rounded-full flex flex-col items-center">
                <span className="text-xs">Pass</span>
                <span className="text-lg">{gameState.score.pass}</span>
             </div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-8 text-center">
           <h1 className="text-5xl md:text-7xl font-black text-white drop-shadow-md leading-tight animate-bounce-in">
             {gameState.currentWord}
           </h1>
        </div>
        <div className="h-24 flex">
           <button 
             onClick={() => processAction('pass')}
             className="flex-1 bg-red-600/90 text-white font-bold text-xl flex flex-col items-center justify-center active:bg-red-700 transition-colors"
           >
             <span className="text-3xl mb-1">⬇️</span>
             PASS
           </button>
           <button 
             onClick={() => processAction('correct')}
             className="flex-1 bg-green-600/90 text-white font-bold text-xl flex flex-col items-center justify-center active:bg-green-700 transition-colors"
           >
             <span className="text-3xl mb-1">⬆️</span>
             CORRECT
           </button>
        </div>
      </div>
    );
  }

  if (screen === 'result') {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col">
        <div className="p-6 text-center border-b border-gray-700">
           <h2 className="text-3xl font-bold mb-2">Time's Up!</h2>
           <div className="text-6xl font-black text-yellow-400 mb-2">{gameState.score.correct}</div>
           <p className="text-gray-400">Correct Guesses</p>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
           <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">History</h3>
           {gameState.results.map((res, idx) => (
             <div key={idx} className="flex justify-between items-center p-3 rounded bg-white/10">
               <span className="font-medium">{res.word}</span>
               <span className={`px-2 py-1 rounded text-xs font-bold ${res.status === 'correct' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                 {res.status.toUpperCase()}
               </span>
             </div>
           ))}
        </div>
        <div className="p-4 bg-gray-800">
          <button onClick={() => setScreen('home')} className="w-full bg-yellow-400 text-black mb-20 py-4 rounded-xl font-bold text-xl shadow-lg">
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return <div>Loading...</div>;
}