import React, { useState, useEffect, useRef, useCallback } from 'react';
// --- ADDED ExternalLink TO THE IMPORTS BELOW ---
import { Settings, Volume2, VolumeX, Smartphone, RotateCw, ShoppingCart, ShieldCheck, Play, ChevronLeft, ChevronRight, RefreshCw, MessageCircle, WifiOff, FileText, Plus, Save, PenTool, Trash2, Crown, X, Pause, MousePointer2, ExternalLink } from 'lucide-react';
import { Preferences } from '@capacitor/preferences';
import { Network } from '@capacitor/network';
import { AdMob, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';
import { App as CapacitorApp } from '@capacitor/app';

// --- IMPORT YOUR IMAGES ---
import qrCodeImg from './qrcode.jpeg';
import howToPlayImg from './howtoplay.jpg';
import splashBg from './splash-bg.jpg';

// --- CONSTANTS ---
const ADMOB_IDS = {
  android: {
    banner: 'ca-app-pub-4060071785789817/7965382826',
    interstitial: 'ca-app-pub-4060071785789817/6954170594'
  },
  ios: {
    banner: 'ca-app-pub-4060071785789817/1820143856',
    interstitial: 'ca-app-pub-4060071785789817/8978123730'
  }
};

const LINKS = {
  privacy: "https://docs.google.com/document/d/11YqURZXba6QSVSBT_easihPFe-wxuEWUVdBwgS9nImI/edit?usp=drivesdk", 
  terms: "https://docs.google.com/document/d/1lyCrijoJl2WFj7cfN-CBTI4oHcVsbOu7Vhqt5h6ZfqM/edit?usp=drivesdk"    
};

const DEFAULT_CATEGORIES = [
  {
    id: 'bollywood',
    name: 'Bollywood Movies',
    icon: '🎬',
    color: 'bg-red-500',
    words: ['Sholay', 'DDLJ', '3 Idiots', 'Lagaan', 'Bahubali', 'KGF', 'Pushpa', 'Dangal', 'PK', 'Munna Bhai', 'Gadar', 'Don', 'RRR', 'Pathaan', 'Jawan', 'Stree', 'Drishyam', 'Hera Pheri', 'Golmaal', 'Chak De India', 'Tare Zameen Par', 'Barfii', 'Bajrangi Bhaijaan', 'Chennai Express', 'Rockstar', 'Bhool Bhulaiyaa', 'Gangs of Wasseypur', 'Hum Aapke Hain Koun', 'Kabhi Khushi Kabhie Gham', 'Gully Boy', 'Animal', 'Devdas', 'Welcome', 'Om Shanti Om', 'Zindagi Na Milegi Dobara']
  },
  {
    id: 'cricket',
    name: 'Cricket Stars',
    icon: '🏏',
    color: 'bg-blue-600',
    words: ['Sachin Tendulkar', 'MS Dhoni', 'Virat Kohli', 'Jasprit Bumrah', 'Ravindra Jadeja', 'Shikhar Dhawan', 'Kapil Dev', 'Sourav Ganguly', 'Yuvraj Singh', 'Rohit Sharma', 'Hardik Pandya', 'Virender Sehwag', 'Rahul Dravid', 'Suryakumar Yadav', 'Rishabh Pant', 'Harbhajan Singh', 'Chris Gayle', 'David Warner', 'Shoaib Akhtar', 'AB de Villiers', 'Gautam Gambhir', 'Sunil Gavaskar', 'Shubman Gill', 'Mohammed Shami', 'KL Rahul']
  },
  {
    id: 'food',
    name: 'Desi Food',
    icon: '🍛',
    color: 'bg-yellow-500',
    words: ['Biryani', 'Pani Puri', 'Dosa', 'Samosa', 'Butter Chicken', 'Vada Pav', 'Gulab Jamun', 'Idli', 'Chole Bhature', 'Pav Bhaji', 'Jalebi', 'Rasgulla', 'Dhokla', 'Tandoori Chicken', 'Naan', 'Lassi', 'Momos', 'Kheer', 'Rajma Chawal', 'Dal Makhani', 'Maggi', 'Chai', 'Pakora', 'Kulfi', 'Aloo Paratha', 'Chicken Tikka', 'Fish Curry']
  },
  {
    id: 'places',
    name: 'Indian Places',
    icon: '🕌',
    color: 'bg-orange-500',
    words: ['Taj Mahal', 'India Gate', 'Red Fort', 'Goa', 'Golden Temple', 'Statue of Unity', 'Qutub Minar', 'Hawa Mahal', 'Kerala', 'Wagah Border', 'Howrah Bridge', 'Gateway of India', 'Lotus Temple', 'Dal Lake', 'Charminar', 'Varanasi', 'Kedarnath', 'Ladakh', 'Ayodhya', 'Mysore Palace', 'Sundarbans', 'Rishikesh', 'Andaman', 'Shimla', 'Manali', 'Darjeeling']
  },
  {
    id: 'festivals',
    name: 'Festivals',
    icon: '🪔',
    color: 'bg-purple-500',
    words: ['Diwali', 'Holi', 'Eid', 'Christmas', 'Navratri', 'Durga Puja', 'Ganesh Chaturthi', 'Onam', 'Pongal', 'Raksha Bandhan', 'Janmashtami', 'Baisakhi', 'Makar Sankranti', 'Dussehra', 'Karwa Chauth', 'Lohri', 'Republic Day', 'Independence Day', 'Gandhi Jayanti', 'Mahashivratri', 'Chhath Puja', 'Bakra Eid', 'New Year']
  },
  {
    id: 'actions',
    name: 'Actions',
    icon: '🎭',
    color: 'bg-pink-500',
    words: ['Dancing', 'Sleeping', 'Cooking', 'Driving', 'Swimming', 'Singing', 'Crying', 'Laughing', 'Running', 'Fighting', 'Eating', 'Drinking', 'Reading', 'Writing', 'Thinking', 'Jumping', 'Clapping', 'Praying', 'Cleaning', 'Shopping', 'Selfie', 'Yoga', 'Sneezing', 'Walking', 'Fishing', 'Painting']
  },
  {
    id: 'indiansuperstars',
    name: 'Indian Superstars',
    icon: '🌟',
    color: 'bg-rose-600',
    words: ["Aamir Khan", "Akshay Kumar", "Ajay Devgn", "Amitabh Bachchan", "Amjad Khan", "Arshad Warsi", "Anupam Kher", "Anil Kapoor", "Amrish Puri", "Boman Irani", "Salman Khan", "Dharmendra", "Govinda", "Sanjay Dutt", "Kader Khan", "Hrithik Roshan", "Irfan Khan", "Nawazuddin Siddiqui", "Tiger Shroff", "Johnny Lever", "Kapil Sharma", "Emraan Hashmi", "Katrina Kaif", "Priyanka Chopra", "Ranbir Kapoor", "Saif Ali Khan", "John Abraham", "Shah Rukh Khan", "Sunny Leone", "Suniel Shetty", "Kareena Kapoor", "Alia Bhatt", "Aishwarya Rai", "Jacqueline Fernandez", "Shraddha Kapoor", "Tamannaah Bhatia", "Rashmika Mandanna", "Rajpal Yadav", "Nana Patekar", "Sonam Kapoor", "Riteish Deshmukh", "Mithun Chakraborty", "The Great Khali", "Arjun Rampal", "Rajinikanth"]
  },
  {
    id: 'netflix',
    name: 'Netflix & Chill',
    icon: '🍿',
    color: 'bg-red-700',
    words: ["Sacred Games", "Stranger Things", "Money Heist", "Delhi Crime", "Kota Factory", "Squid Game", "Mirzapur", "The Railway Men", "Jamtara: Sabka Number Ayega", "Breaking Bad", "Friends", "Wednesday", "Little Things", "Khakee: The Bihar Chapter", "Peaky Blinders", "Black Mirror", "The Crown", "Yeh Kaali Kaali Ankhein", "Narcos", "Guns & Gulaabs", "Dark", "Better Call Saul", "Emily in Paris", "The Witcher", "Masaba Masaba", "Aranyak", "Decoupled", "Mai", "She", "The Fame Game", "Bridgerton", "Lucifer", "Sex Education", "House of Cards", "Mindhunter", "You", "The Queen's Gambit", "Kaala Paani", "Class", "Scoop", "Tooth Pari: When Love Bites", "Mismatched", "Selection Day", "Bard of Blood", "Betaal", "Ray", "Indian Matchmaking", "Fabulous Lives of Bollywood Wives", "Hunt for Veerappan", "Curry & Cyanide: The Jolly Joseph Case"]
  },
  {
    id: 'hollywood',
    name: 'Hollywood Movies',
    icon: '🎥',
    color: 'bg-indigo-600',
    words: ["The Shawshank Redemption", "Schindler's List", "Raging Bull", "Casablanca", "Citizen Kane", "Gone with the Wind", "The Wizard of Oz", "One Flew Over the Cuckoo's Nest", "Lawrence of Arabia", "Vertigo", "Psycho", "On the Waterfront", "Sunset Boulevard", "Forrest Gump", "The Sound of Music", "12 Angry Men", "West Side Story", "Star Wars: Episode IV - A New Hope", "2001: A Space Odyssey", "E.T. the Extra-Terrestrial", "The Silence of the Lambs", "Chinatown", "The Bridge on the River Kwai", "Singin' in the Rain", "It's a Wonderful Life", "Dr. Strangelove", "Some Like It Hot", "Ben-Hur", "Apocalypse Now", "Amadeus", "The Lord of the Rings: The Return of the King", "Gladiator", "Titanic", "Saving Private Ryan", "Unforgiven", "Raiders of the Lost Ark", "Rocky", "Jaws", "The Exorcist", "Taxi Driver", "Pulp Fiction", "The Dark Knight", "Goodfellas", "Fight Club", "The Matrix", "The Lion King", "Jurassic Park", "The Avengers", "Iron Man", "Avengers: Endgame", "Black Panther", "Spider-Man", "Spider-Man 2", "Spider-Man 3", "Logan", "Wonder Woman", "Joker", "Guardians of the Galaxy", "Spider-Man: Into the Spider-Verse", "Captain America: The Winter Soldier", "The Incredibles", "Deadpool", "Spider-Man: No Way Home", "The Batman"]
  },
  {
    id: 'objects',
    name: 'Objects',
    icon: '💡',
    color: 'bg-amber-600',
    words: ["Computer", "Paper", "Coin", "Drum", "Bed", "Ring", "Knife", "Glue", "Bottle", "Window", "Compass", "Carpet", "Money", "Chair", "Basket", "Desk", "Piano", "Hammer", "Hat", "Notebook", "Wheel", "Camera", "Pencil", "Blender", "Vase", "Scissors", "Paint Brush", "Bowl", "Fork", "Umbrella", "Ladder", "Letter", "Gift", "Gun", "Pan", "Book", "Dice", "Calculator", "Globe", "Wallet", "Sofa", "Dustbin", "Spoon", "Plate", "Cup", "Mug", "Teapot", "Toaster", "Microwave", "Refrigerator", "Washing Machine", "Iron", "Table", "Lamp", "Mirror", "Door", "Key", "Lock", "Fan", "Pillow", "Blanket", "Curtain", "Toothbrush", "Toothpaste", "Soap", "Shampoo", "Towel", "Comb", "Shoe", "Sock", "Shirt", "T-Shirt", "Tie", "Belt", "Watch", "Glasses", "Mobile Phone", "Remote", "Headphones", "Battery", "Charger", "Light Bulb", "Candle", "Matchbox", "Broom", "Bucket", "Mop", "Tap", "Saw", "Screwdriver", "Axe", "Nail", "Ball", "Balloon", "Swing", "Eraser", "Stapler", "Chalk", "Blackboard"]
  },
  {
    id: 'games',
    name: 'Games',
    icon: '🎮',
    color: 'bg-violet-600',
    words: ["PUBG Mobile", "Battlegrounds Mobile India (BGMI)", "Ludo King", "Genshin Impact", "Free Fire Max", "Call of Duty: Mobile", "Subway Surfers", "Clash of Clans", "Clash Royale", "Candy Crush Saga", "Pokémon GO", "Among Us", "Minecraft", "Roblox", "Mini Militia", "Shadow Fight 2", "Temple Run", "Temple Run 2", "Fruit Ninja", "Angry Birds", "Cut the Rope", "Jetpack Joyride", "Hill Climb Racing", "Hill Climb Racing 2", "Dr. Driving", "Asphalt 8: Airborne", "Asphalt 9: Legends", "Garena Free Fire", "League of Legends: Wild Rift", "Mobile Legends: Bang Bang", "Brawl Stars", "Alto's Adventure", "Monument Valley", "Plants vs. Zombies", "8 Ball Pool", "Carrom Pool", "Hunter Assassin", "Brain Out", "Coin Master", "Gardenscapes", "Homescapes", "Vector", "Hungry Shark Evolution", "Dead Trigger 2", "Traffic Rider", "Talking Tom", "Slither.io", "Flappy Bird", "Doodle Jump", "Need for Speed: No Limits", "GTA: San Andreas", "GTA: Vice City", "Fortnite", "Valorant", "World of Warcraft", "Mortal Kombat", "Sonic the Hedgehog"]
  },
  {
    id: 'kids',
    name: 'Just For Kids',
    icon: '🧸',
    color: 'bg-teal-500',
    words: ['Doraemon', 'Chhota Bheem', 'Motu Patlu', 'Tom and Jerry', 'Shinchan', 'Peppa Pig', 'Mickey Mouse', 'School', 'Homework', 'Teacher', 'Chocolate', 'Balloon', 'Ice Cream', 'Park', 'Swing', 'Bicycle', 'Doll', 'Robot', 'Cartoon', 'Fairy', 'Unicorn', 'Santa Claus', 'Elsa', 'Spiderman', "Elephant", "Owl", "Sand Castle", "Milkshake", "Scissors", "Bowling", "Skateboard", "TV", "Game", "Hot Dog", "Shower", "Donkey", "Clock", "Bedroom", "Penguin", "Fox", "Flashlight", "Crane", "Kite", "Laughing", "Squirrel", "Butter", "Board Game", "Ghost", "Gift", "Cupcake", "Fish", "Tree House", "Dog", "Fries", "Samosa", "Burger", "Momos", "Water", "Shaving", "Angel", "Blanket", "Bells", "Airplane", "Cat", "Sun", "Moon", "Star", "Rain", "Ball", "Car", "Bicycle", "Ice Cream", "Pizza", "Chocolate", "Apple", "Banana", "Monkey", "Rabbit", "Lion", "Snake", "Butterfly", "Flower", "Tree", "Book", "Pencil", "School", "Teacher", "Baby", "Sleeping", "Dancing", "Running", "Swimming", "Singing", "Crying", "Hat", "Glasses", "Shoes", "Socks", "Toothbrush", "Spoon", "Chair", "Table", "Door", "Key", "Mobile", "Camera", "Balloon", "Fire", "Snow", "Bird", "Duck", "Cow", "Horse", "Egg", "Bread", "Candy", "Cake", "Juice"]
  },
  {
    id: 'animals',
    name: 'Animals',
    icon: '🦁',
    color: 'bg-lime-600',
    words: ["Cat", "Bat", "Gorilla", "Donkey", "Penguin", "Pigeon", "Elephant", "Bear", "Ant", "Swan", "Lynx", "Kangaroo", "Panther", "Crab", "Mouse", "Eagle", "Scorpion", "Owl", "Vulture", "Wolf", "Cobra", "Whale", "Camel", "Tiger", "Crocodile", "Goat", "Buffalo", "Cheetah", "Ostrich", "Spider", "Turtle", "Squirrel", "Peacock", "Asiatic Lion", "Royal Bengal Tiger", "Indian Rhinoceros", "Leopard", "Snow Leopard", "Red Panda", "King Cobra", "Mongoose", "Langur", "Macaque", "Gharial", "Blackbuck", "Chital", "Sambar Deer", "Nilgai", "Gaur", "Sloth Bear", "Great Indian Bustard", "Gangetic Dolphin", "Monitor Lizard", "Wild Boar", "Pangolin"]
  },
  {
    id: 'brands',
    name: 'Famous Brands',
    icon: '🏷️',
    color: 'bg-cyan-600',
    words: ['Tata', 'Reliance Jio', 'Amul', 'Maggi', 'Thums Up', 'Parle-G', 'Britannia', 'Haldirams', 'Bata', 'Mahindra', 'Ola', 'Zomato', 'Swiggy', 'Paytm', 'Flipkart', 'Lenskart', 'Royal Enfield', 'Maruti Suzuki', 'Asian Paints', 'HDFC Bank', 'Amrutanjan', 'Boroline', 'Dabur', 'Patanjali', 'PhonePe', "Amazon", "Colgate", "Gillette", "Instagram", "Red Bull", "Apple", "Toyota", "H&M", "Starbucks", "HP", "Xiaomi", "Disney", "Ferrari", "Samsung", "KFC", "Ford", "YouTube", "Facebook", "BMW", "Coca-Cola", "Microsoft", "Huawei", "Pepsi", "Audi", "Mercedes-Benz", "Sony", "Zara", "Nike", "Netflix", "Pampers", "Google", "Intel", "PayPal", "Gucci", "Tesla", "Spotify", "LinkedIn", "Adidas", "Visa", "Mastercard", "Tata", "Reliance", "Mahindra", "Bajaj", "Hero", "Maruti Suzuki", "Royal Enfield", "TVS", "Amul", "Britannia", "Parle", "Haldiram's", "Dabur", "Godrej", "Patanjali", "ITC", "Asian Paints", "Fevicol", "Jio", "Airtel", "Infosys", "Wipro", "HDFC Bank", "SBI", "ICICI Bank", "LIC", "Paytm", "PhonePe", "Flipkart", "Zomato", "Swiggy", "Myntra", "Nykaa", "Ola", "Titan", "Fastrack", "Lenskart", "BoAt", "Old Monk", "Thums Up", "Frooti", "Paper Boat", "Raymond", "Fabindia", "Manyavar", "Sabyasachi", "Indigo"]
  },
  {
    id: 'professions',
    name: 'Professions',
    icon: '👨‍⚕️',
    color: 'bg-slate-600',
    words: ["Bus Driver", "Secretary", "Engineer", "Photographer", "Architect", "Dancer", "Gardener", "Fisherman", "Hairdresser", "Artist", "Designer", "Model", "Lawyer", "Plumber", "Postman", "Lifeguard", "Electrician", "Dentist", "Farmer", "Mechanic", "Journalist", "Pharmacist", "Soldier", "Businessman", "Scientist", "Policeman", "Carpenter", "Firefighter", "Painter", "Baker", "Tailor", "Politician", "Pilot", "Nurse", "Teacher", "Waiter", "Doctor", "Chef", "Judge", "Cricketer", "Auto Rickshaw Driver", "Chaiwala (Tea Seller)", "Coolie (Porter)", "Traffic Police", "Security Guard (Watchman)", "Priest (Pandit)", "Vegetable Vendor (Sabziwala)", "Cobbler (Mochi)", "Washerman (Dhobi)", "Scrap Dealer (Kabaadiwala)", "Bus Conductor", "Delivery Partner", "Astrologer", "Magician", "Snake Charmer", "Potter", "Weaver", "Sweeper"]
  },
  {
    id: 'superheroes',
    name: 'Superheroes & Villains',
    icon: '🦸',
    color: 'bg-fuchsia-700',
    words: ["G.One", "Ra.One", "Blade", "Sabretooth", "Doctor Strange", "Professor X", "Spider-Man", "Optimus Prime", "Megatron", "Abomination", "Loki", "She-Hulk", "Hulk", "Batman", "Ant-Man", "Superman", "Dormammu", "Vulture", "Magneto", "Homelander", "Juggernaut", "Logan", "Black Panther", "Apocalypse", "Iron Man", "Captain America", "Winter Soldier", "Thor", "Black Widow", "Captain Marvel", "Rocket", "Groot", "Wonder Woman", "Flash", "Green Lantern", "Aquaman", "Cyborg", "Green Arrow", "Martian Manhunter", "Shazam", "Black Adam", "Darkside", "Doctor Doom", "Thanos", "Ultron", "Chitti", "Krrish", "Flying Jatt", "Mr. India", "Minnal Murali", "Kaal", "Pakshi Rajan", "Hawkeye"]
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
      osc.type = 'sine'; osc.frequency.setValueAtTime(500, ctx.currentTime); osc.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.1); gain.gain.setValueAtTime(0.3, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4); osc.start(); osc.stop(ctx.currentTime + 0.4);
    } else if (type === 'pass') {
      osc.type = 'sawtooth'; osc.frequency.setValueAtTime(200, ctx.currentTime); osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.2); gain.gain.setValueAtTime(0.3, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3); osc.start(); osc.stop(ctx.currentTime + 0.3);
    } else if (type === 'tick') {
      osc.type = 'square'; osc.frequency.setValueAtTime(800, ctx.currentTime); gain.gain.setValueAtTime(0.05, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05); osc.start(); osc.stop(ctx.currentTime + 0.05);
    } else if (type === 'gameover') {
      osc.type = 'triangle'; osc.frequency.setValueAtTime(600, ctx.currentTime); osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.5); gain.gain.setValueAtTime(0.3, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1); osc.start(); osc.stop(ctx.currentTime + 1);
    }
  } catch (e) { }
};

const triggerVibrate = (pattern, enabled) => {
  if (!enabled || !navigator.vibrate) return;
  navigator.vibrate(pattern);
};

export default function App() {
  const [screen, setScreen] = useState('splash');
  const [settings, setSettings] = useState({
    sound: true,
    vibration: true,
    adsRemoved: false,
    durationMinutes: 1,
    gameMode: 'tilt', // 'tilt' or 'button'
  });
  const [promoCode, setPromoCode] = useState('');
  const [isOnline, setIsOnline] = useState(true);
  const MY_PHONE_NUMBER = "919897951097";

  // --- CUSTOM DECKS ---
  const [customDecks, setCustomDecks] = useState([]);
  const [newDeckName, setNewDeckName] = useState('');
  const [newDeckEmoji, setNewDeckEmoji] = useState('🃏');
  const [newDeckWords, setNewDeckWords] = useState('');
  
  // --- PAUSE STATE ---
  const [isPaused, setIsPaused] = useState(false);

  // --- PREMIUM POPUP ---
  const [showPremiumPopup, setShowPremiumPopup] = useState(false);

  // --- SCREEN TRACKER FOR BACK BUTTON ---
  const currentScreenRef = useRef(screen);

  useEffect(() => {
    currentScreenRef.current = screen;
  }, [screen]);

  // --- DISABLE BACK BUTTON LOGIC ---
  useEffect(() => {
    const handleBackButton = async () => {
        if (currentScreenRef.current === 'home') {
            CapacitorApp.exitApp();
        } else {
            if (currentScreenRef.current === 'create' || currentScreenRef.current === 'category' || currentScreenRef.current === 'settings' || currentScreenRef.current === 'howtoplay' || currentScreenRef.current === 'privacy') {
               setScreen('home'); 
            }
        }
    };
    const listener = CapacitorApp.addListener('backButton', handleBackButton);
    return () => { listener.then(h => h.remove()); };
  }, []);


  // --- LOAD DATA ---
  useEffect(() => {
    const loadData = async () => {
      const { value: adsVal } = await Preferences.get({ key: 'adsRemoved' });
      if (adsVal === 'true') setSettings(s => ({ ...s, adsRemoved: true }));

      // NEW: Load Game Mode Preference
      const { value: modeVal } = await Preferences.get({ key: 'gameMode' });
      if (modeVal) setSettings(s => ({ ...s, gameMode: modeVal }));

      const { value: decksVal } = await Preferences.get({ key: 'custom_decks' });
      if (decksVal) {
        try { setCustomDecks(JSON.parse(decksVal)); } catch (e) { }
      }
    };
    loadData();
  }, []);

  // --- SAVE PREFERENCES HELPER ---
  const saveGameMode = async (mode) => {
    setSettings(s => ({ ...s, gameMode: mode }));
    await Preferences.set({ key: 'gameMode', value: mode });
  };

  const saveNewDeck = async () => {
    if (!newDeckName.trim()) { alert("Please enter a deck name!"); return; }
    if (!newDeckWords.trim()) { alert("Please add some words!"); return; }
    const wordsArray = newDeckWords.split(',').map(w => w.trim()).filter(w => w.length > 0);
    if (wordsArray.length < 5) { alert("Please add at least 5 words separated by commas."); return; }

    const newDeck = {
      id: `custom_${Date.now()}`,
      name: newDeckName,
      icon: newDeckEmoji || '🃏',
      color: 'bg-purple-600',
      words: wordsArray,
      isCustom: true
    };

    const updatedDecks = [...customDecks, newDeck];
    setCustomDecks(updatedDecks);
    await Preferences.set({ key: 'custom_decks', value: JSON.stringify(updatedDecks) });
    setNewDeckName(''); setNewDeckWords(''); setNewDeckEmoji('🃏');
    setScreen('category');
  };

  const deleteDeck = async (id) => {
    const updated = customDecks.filter(d => d.id !== id);
    setCustomDecks(updated);
    await Preferences.set({ key: 'custom_decks', value: JSON.stringify(updated) });
  };

  const handleCreateDeckClick = () => {
    if (settings.adsRemoved) { setScreen('create'); } else { setShowPremiumPopup(true); }
  };

  // --- INTERNET ---
  useEffect(() => {
    const checkStatus = async () => {
      const status = await Network.getStatus();
      setIsOnline(status.connected);
    };
    checkStatus();
    const listener = Network.addListener('networkStatusChange', status => { setIsOnline(status.connected); });
    return () => { listener.then(handler => handler.remove()); };
  }, []);

  const handleUnlock = async () => {
    if (promoCode.toUpperCase() === 'DESIKING') {
      setSettings(s => ({ ...s, adsRemoved: true }));
      await Preferences.set({ key: 'adsRemoved', value: 'true' });
      alert("Success! Ads Removed Forever. Enjoy!");
    } else { alert("Invalid Code. Try again."); }
  };

  const openWhatsApp = () => {
    const text = "Hi, here is the payment screenshot for Indian Charades.";
    window.open(`https://wa.me/${MY_PHONE_NUMBER}?text=${encodeURIComponent(text)}`, '_system');
  };

  // --- ADS ---
  const manageAds = useCallback(async () => {
    if (settings.adsRemoved || !isOnline) { try { await AdMob.hideBanner(); } catch (e) {} return; }
    if (screen === 'prep' || screen === 'game') { try { await AdMob.hideBanner(); } catch (e) {} return; }
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
    } catch (e) { }
  }, [settings.adsRemoved, isOnline, screen]);

  useEffect(() => {
    manageAds();
    const timer = setTimeout(() => {
      setScreen(current => current === 'splash' ? 'home' : current);
    }, 2500);
    return () => { clearTimeout(timer); };
  }, [manageAds]);


  // --- GAME STATE ---
  const [gameState, setGameState] = useState({ category: null, score: { correct: 0, pass: 0 }, wordsQueue: [], currentWord: '', timeLeft: 0, isActive: false, results: [] });
  const [prepTimer, setPrepTimer] = useState(3);
  const [isSensorLandscape, setIsSensorLandscape] = useState(false);
  const [windowPortrait, setWindowPortrait] = useState(false); 
  const tiltLocked = useRef(false);
  const waitingForNeutral = useRef(true);

  // --- SENSOR ---
  const checkSensor = useCallback((event) => {
    if(!event) return;
    if (screen === 'game') return; // Lock check when game starts
    const { gamma } = event;
    const isLand = Math.abs(gamma) > 45;
    setIsSensorLandscape(isLand);
  }, [screen]);

  const checkWindow = useCallback(() => { setWindowPortrait(window.innerWidth < window.innerHeight); }, []);

  useEffect(() => {
    const sensorListener = (e) => checkSensor(e);
    window.addEventListener('deviceorientation', sensorListener);
    window.addEventListener('resize', checkWindow);
    checkWindow();
    return () => { window.removeEventListener('deviceorientation', sensorListener); window.removeEventListener('resize', checkWindow); };
  }, [checkSensor, checkWindow]);


  const startGameFlow = (duration) => {
    setSettings(prev => ({ ...prev, durationMinutes: duration }));
    const allCategories = [...DEFAULT_CATEGORIES, ...customDecks];
    const catData = allCategories.find(c => c.id === gameState.category);
    let words = [...catData.words];
    words = words.sort(() => Math.random() - 0.5);
    setGameState({ category: gameState.category, score: { correct: 0, pass: 0 }, wordsQueue: words, currentWord: words[0], timeLeft: duration * 60, isActive: false, results: [] });
    waitingForNeutral.current = true;
    tiltLocked.current = false;
    setIsPaused(false); 
    setScreen('prep');
    setPrepTimer(3);
    requestTiltPermission();
  };

  useEffect(() => {
    let countInterval = null;
    if (screen === 'prep') {
      // SENSOR CHECK for auto-start (Works for both modes to ensure phone is sideways)
      if (isSensorLandscape) {
        countInterval = setInterval(() => {
          setPrepTimer(prev => {
            if (prev <= 1) {
              clearInterval(countInterval);
              setScreen('game');
              waitingForNeutral.current = true;
              setGameState(gs => ({ ...gs, isActive: true }));
              return 0;
            }
            playSound('tick', settings.sound);
            return prev - 1;
          });
        }, 1000);
      } else { setPrepTimer(3); }
    }
    return () => { if (countInterval) clearInterval(countInterval); };
  }, [screen, isSensorLandscape, settings.sound]);

  // --- TIMER ---
  useEffect(() => {
    let interval = null;
    if (screen === 'game' && gameState.isActive && gameState.timeLeft > 0 && !isPaused) {
      interval = setInterval(() => {
        setGameState(prev => {
          if (prev.timeLeft <= 1) { return { ...prev, timeLeft: 0 }; }
          if (prev.timeLeft <= 6 && settings.sound) { playSound('tick', true); }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [screen, gameState.isActive, settings.sound, isPaused]);

  const endGame = useCallback(async () => {
    setGameState(prev => ({ ...prev, isActive: false }));
    playSound('gameover', settings.sound);
    triggerVibrate(500, settings.vibration);
    if (!settings.adsRemoved && isOnline) {
      try {
        const isAndroid = /Android/i.test(navigator.userAgent);
        const ids = isAndroid ? ADMOB_IDS.android : ADMOB_IDS.ios;
        await AdMob.prepareInterstitial({ adId: ids.interstitial });
        await AdMob.showInterstitial();
      } catch (e) {}
    }
    setScreen('result');
  }, [settings.adsRemoved, settings.sound, settings.vibration, isOnline]);

  useEffect(() => { if (screen === 'game' && gameState.isActive && gameState.timeLeft === 0) { endGame(); } }, [gameState.timeLeft, screen, gameState.isActive, endGame]);

  // --- PROCESS ACTION (CORRECTED) ---
  const processAction = useCallback((action) => {
    if (tiltLocked.current) return;
    tiltLocked.current = true;
    
    setGameState(prev => {
      const currentWord = prev.currentWord;
      const newResults = [...prev.results, { word: currentWord, status: action }];
      const newScore = { ...prev.score };
      if (action === 'correct') { newScore.correct += 1; playSound('correct', settings.sound); triggerVibrate(100, settings.vibration); }
      else { newScore.pass += 1; playSound('pass', settings.sound); triggerVibrate([50, 50, 50], settings.vibration); }
      return { ...prev, score: newScore, results: newResults };
    });

    // AUTO UNLOCK FOR BUTTON MODE
    if (settings.gameMode === 'button') {
        setTimeout(() => {
            setGameState(prev => {
                const nextQueue = prev.wordsQueue.slice(1);
                if (nextQueue.length === 0) { setTimeout(endGame, 100); return prev; }
                return { ...prev, wordsQueue: nextQueue, currentWord: nextQueue[0] };
            });
            tiltLocked.current = false; // Unlock immediately
        }, 500);
    } else {
        // TILT MODE: Require physical reset
        waitingForNeutral.current = true;
        setTimeout(() => {
            setGameState(prev => {
                const nextQueue = prev.wordsQueue.slice(1);
                if (nextQueue.length === 0) { setTimeout(endGame, 100); return prev; }
                return { ...prev, wordsQueue: nextQueue, currentWord: nextQueue[0] };
            });
        }, 500);
    }
  }, [settings.sound, settings.vibration, endGame, settings.gameMode]);

  // --- GAMEPLAY TILT ---
  const handleGameTilt = useCallback((event) => {
    if (screen !== 'game' || !gameState.isActive || isPaused) return; 
    
    // IF BUTTON MODE, STOP HERE (Disable sensors)
    if (settings.gameMode === 'button') return;

    const { gamma } = event;
    const TILT_THRESHOLD = 40;
    const NEUTRAL_THRESHOLD = 15;
    
    if (waitingForNeutral.current) {
      if (Math.abs(gamma) < NEUTRAL_THRESHOLD) { 
          waitingForNeutral.current = false; 
          tiltLocked.current = false; 
      }
      return;
    }
    if (tiltLocked.current) return;
    
    if (gamma < -TILT_THRESHOLD) { processAction('correct'); }
    else if (gamma > TILT_THRESHOLD) { processAction('pass'); }
    
  }, [screen, gameState.isActive, processAction, isPaused, settings.gameMode]);

  useEffect(() => {
    const listener = (e) => handleGameTilt(e);
    if (screen === 'game') { window.addEventListener('deviceorientation', listener); }
    return () => { window.removeEventListener('deviceorientation', listener); };
  }, [screen, handleGameTilt]);

  const requestTiltPermission = async () => {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      try { await DeviceOrientationEvent.requestPermission(); } catch (e) { }
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60); const s = seconds % 60; return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const needsForceRotation = (screen === 'game' || screen === 'prep') && windowPortrait;
  const rotationStyle = needsForceRotation ? {
    position: 'fixed', top: '50%', left: '50%', width: '100vh', height: '100vw',
    transform: 'translate(-50%, -50%) rotate(90deg)', overflow: 'hidden', zIndex: 9999
  } : { width: '100%', height: '100vh' };

  if (!isOnline) {
    return (
      <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col items-center justify-center p-8 text-center">
        <div className="bg-red-500/20 p-6 rounded-full mb-6 animate-pulse"> <WifiOff size={64} className="text-red-500" /> </div>
        <h2 className="text-3xl font-bold text-white mb-2">No Internet!</h2>
        <p className="text-gray-300 text-lg mb-8">Please turn on your Data or WiFi to play Indian Charades.</p>
        <button onClick={() => window.location.reload()} className="bg-white text-gray-900 px-8 py-3 rounded-full font-bold"> Try Again </button>
      </div>
    );
  }

  // --- SCREENS ---

  if (screen === 'splash') {
    return (
      <div 
        className="h-screen w-full flex flex-col items-center justify-center text-white"
        style={{ 
          backgroundImage: `url(${splashBg})`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center' 
        }}
      >
        <div className="bg-black/40 absolute inset-0 z-0" />
        <div className="z-10 flex flex-col items-center">
            <div className="text-6xl mb-4 animate-bounce">🇮🇳</div>
            <h1 className="text-4xl font-bold tracking-wider mb-2 drop-shadow-lg">Indian CHARADES</h1>
            <p className="text-indigo-100 drop-shadow-md">Loading Game...</p>
        </div>
      </div>
    );
  }

  if (screen === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800 text-white flex flex-col pb-24">
        {showPremiumPopup && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 p-6 rounded-2xl border border-yellow-400/50 text-center w-full max-w-sm relative shadow-2xl">
              <button onClick={() => setShowPremiumPopup(false)} className="absolute top-2 right-2 text-gray-400 hover:text-white"> <X size={24} /> </button>
              <Crown size={48} className="text-yellow-400 mx-auto mb-4 animate-bounce" />
              <h3 className="text-2xl font-bold text-white mb-2">VIP Feature</h3>
              <p className="text-gray-300 mb-6">Unlock Premium to create unlimited custom decks for you and your friends!</p>
              <div className="flex gap-3">
                <button onClick={() => setShowPremiumPopup(false)} className="flex-1 py-3 rounded-xl font-bold text-gray-400 bg-white/5 hover:bg-white/10"> Cancel </button>
                <button onClick={() => { setShowPremiumPopup(false); setScreen('settings'); }} className="flex-1 bg-yellow-400 text-black py-3 rounded-xl font-bold hover:bg-yellow-300"> Unlock Now </button>
              </div>
            </div>
          </div>
        )}
        <div className="p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Indian Charades</h1>
          <button onClick={() => setScreen('settings')} className="p-2 bg-white/10 rounded-full"> <Settings size={24} /> </button>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-4">
          <div className="w-48 h-48 bg-white/10 rounded-full flex items-center justify-center border-4 border-yellow-400 shadow-lg shadow-yellow-500/20 mb-4"> <Smartphone size={80} className="text-yellow-400" /> </div>
          <button onClick={() => setScreen('category')} className="w-full max-w-xs bg-yellow-400 text-indigo-900 py-4 rounded-xl text-xl font-black shadow-lg transform active:scale-95 transition-transform flex items-center justify-center gap-2"> <Play fill="currentColor" /> PLAY GAME </button>
          <button onClick={handleCreateDeckClick} className="w-full max-w-xs bg-purple-500 text-white py-4 rounded-xl text-xl font-black shadow-lg transform active:scale-95 transition-transform flex items-center justify-center gap-2 border border-purple-400/50"> <Plus strokeWidth={3} /> CREATE DECK </button>
          <button onClick={() => setScreen('howtoplay')} className="w-full max-w-xs bg-white/20 py-3 rounded-xl font-bold backdrop-blur-sm"> How To Play </button>
        </div>
      </div>
    );
  }

  // --- CREATE DECK SCREEN ---
  if (screen === 'create') {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4 pb-24">
        <div className="flex items-center mb-6">
          <button onClick={() => setScreen('home')} className="p-2 mr-4 rounded-full bg-white/10"> <ChevronLeft size={32} /> </button>
          <h2 className="text-xl font-bold">Create Your Own Deck</h2>
        </div>
        <div className="space-y-6">
          <div className="bg-blue-500/20 border border-blue-500/50 p-4 rounded-xl text-sm text-blue-200">
            <p className="font-bold mb-1 flex items-center gap-2"><PenTool size={16}/> How to Create:</p>
            <p>1. Give your deck a name (e.g. "Family Trip").</p>
            <p>2. Pick an emoji.</p>
            <p>3. Add words separated by commas (e.g. "Mom, Dad, Dog").</p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2 font-bold">Deck Name</label>
              <input value={newDeckName} onChange={(e) => setNewDeckName(e.target.value)} className="w-full bg-white/10 p-4 rounded-xl text-white font-bold outline-none focus:ring-2 focus:ring-purple-500" placeholder="e.g. My Best Friends" />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2 font-bold">Emoji Icon</label>
              <input value={newDeckEmoji} onChange={(e) => setNewDeckEmoji(e.target.value)} className="w-full bg-white/10 p-4 rounded-xl text-white font-bold outline-none focus:ring-2 focus:ring-purple-500" placeholder="e.g. 🥳" maxLength={2} />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2 font-bold">Words (Comma Separated)</label>
              <textarea value={newDeckWords} onChange={(e) => setNewDeckWords(e.target.value)} className="w-full bg-white/10 p-4 rounded-xl text-white h-40 outline-none focus:ring-2 focus:ring-purple-500" placeholder="Batman, Superman, Spiderman..." />
              <p className="text-right text-xs text-gray-500 mt-1">At least 5 words required</p>
            </div>
            <button onClick={saveNewDeck} className="w-full bg-green-500 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform"> <Save /> Save Deck </button>
          </div>
        </div>
      </div>
    )
  }

  if (screen === 'settings' || screen === 'howtoplay') {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4 pb-24">
        <div className="flex items-center mb-8">
          <button onClick={() => setScreen('home')} className="p-2 mr-4"> <ChevronLeft size={32} /> </button>
          <h2 className="text-2xl font-bold">{screen === 'settings' ? 'Settings' : 'How to Play'}</h2>
        </div>
        {screen === 'settings' ? (
          <div className="space-y-4">
            {/* GAME MODE TOGGLE */}
            <div className="bg-white/10 p-4 rounded-xl">
              <h3 className="text-gray-400 text-xs font-bold uppercase mb-3 tracking-wider">Game Mode</h3>
              <div className="flex gap-2 bg-black/20 p-1 rounded-lg">
                <button 
                  onClick={() => saveGameMode('tilt')}
                  className={`flex-1 py-2 rounded-md font-bold text-sm flex items-center justify-center gap-2 transition-colors ${settings.gameMode === 'tilt' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
                >
                  <RotateCw size={16} /> Tilt
                </button>
                <button 
                  onClick={() => saveGameMode('button')}
                  className={`flex-1 py-2 rounded-md font-bold text-sm flex items-center justify-center gap-2 transition-colors ${settings.gameMode === 'button' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
                >
                  <MousePointer2 size={16} /> Button
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                {settings.gameMode === 'tilt' ? 'Tilt phone Up/Down to play.' : 'Tap buttons on screen to play.'}
              </p>
            </div>

            <div className="bg-white/10 p-4 rounded-xl flex justify-between items-center">
              <div className="flex items-center gap-3"> {settings.sound ? <Volume2 className="text-green-400" /> : <VolumeX className="text-red-400" />} <span>Sound Effects</span> </div>
              <button onClick={() => setSettings(s => ({ ...s, sound: !s.sound }))} className={`w-12 h-6 rounded-full relative ${settings.sound ? 'bg-green-500' : 'bg-gray-600'}`}> <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${settings.sound ? 'right-1' : 'left-1'}`} /> </button>
            </div>
            <div className="bg-white/10 p-4 rounded-xl flex justify-between items-center">
              <div className="flex items-center gap-3"> <Smartphone className={settings.vibration ? "text-green-400" : "text-red-400"} /> <span>Vibration</span> </div>
              <button onClick={() => setSettings(s => ({ ...s, vibration: !s.vibration }))} className={`w-12 h-6 rounded-full relative ${settings.vibration ? 'bg-green-500' : 'bg-gray-600'}`}> <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${settings.vibration ? 'right-1' : 'left-1'}`} /> </button>
            </div>
            <button onClick={() => setScreen('privacy')} className="w-full bg-white/10 p-4 rounded-xl flex justify-between items-center hover:bg-white/20 transition-colors">
              <div className="flex items-center gap-3"> <FileText className="text-blue-400" /> <span>Legal Terms & Policies</span> </div>
              <ChevronRight className="text-gray-500" />
            </button>
            <div className="mt-8">
              <h3 className="text-gray-400 mb-2 uppercase text-sm font-bold tracking-wider"> Unlock Premium </h3>
              {settings.adsRemoved ? (
                <div className="bg-green-500/20 text-green-400 p-4 rounded-xl flex items-center justify-center gap-2 border border-green-500/50 animate-pulse"> <ShieldCheck size={24} /> <span className="font-bold">Ads Removed Forever!</span> </div>
              ) : (
                <div className="bg-white/10 p-4 rounded-xl space-y-3">
                  <p className="text-sm text-gray-300 font-medium"> Enter the secret code to remove ads: </p>
                  <div className="flex gap-2">
                    <input type="text" placeholder="Enter Code" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} className="flex-1 bg-black/40 border border-gray-600 rounded-lg px-4 py-3 text-white uppercase tracking-widest font-bold focus:outline-none focus:border-yellow-400 transition-colors" />
                    <button onClick={handleUnlock} className="bg-yellow-400 text-black font-black px-6 py-2 rounded-lg hover:bg-yellow-300 active:scale-95 transition-transform"> GO </button>
                  </div>
                  <div className="flex justify-center my-4"> <img src={qrCodeImg} alt="Payment QR Code" className="w-48 h-48 rounded-lg border-4 border-white shadow-lg" /> </div>
                  <div className="pt-2 border-t border-gray-700">
                    <p className="text-xs text-gray-400 mb-2 text-center">To Support Me, pay ₹100 via UPI and share screenshot on WhatsApp and get Secret Code. </p>
                    <button onClick={openWhatsApp} className="w-full bg-green-600 hover:bg-green-500 text-white py-2 rounded-lg flex items-center justify-center gap-2 font-bold transition-colors"> <MessageCircle size={20} /> Share Screenshot on WhatsApp </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col flex-1">
            <div className="flex-1 overflow-y-auto mb-4 p-2 bg-white/5 rounded-xl"> <img src={howToPlayImg} alt="How to Play" className="w-full h-auto rounded-lg" /> </div>
            <button onClick={() => setScreen('category')} className="w-full bg-yellow-400 text-black py-4 rounded-xl font-bold text-xl shadow-lg flex items-center justify-center gap-2 hover:bg-yellow-300 transition-colors"> Continue <Play fill="currentColor" size={20} /> </button>
          </div>
        )}
      </div>
    );
  }

  // --- PRIVACY POLICY SCREEN ---
  if (screen === 'privacy') {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4 pb-24">
        <div className="flex items-center mb-6">
          <button onClick={() => setScreen('settings')} className="p-2 mr-4 rounded-full hover:bg-white/10 transition-colors"> <ChevronLeft size={32} /> </button>
          <h2 className="text-2xl font-bold">Legal</h2>
        </div>
        <div className="space-y-6 text-gray-300 overflow-y-auto">
          <div className="bg-white/10 p-5 rounded-xl border-l-4 border-blue-500"> 
            <h3 className="text-white font-bold text-lg mb-2">Transparency</h3> 
            <p className="text-sm leading-relaxed"> We believe in open communication. Tap below to read our full policies. </p> 
          </div>
          
          <div className="space-y-3">
            <a href={LINKS.privacy} target="_blank" rel="noreferrer" className="block w-full bg-white/10 p-4 rounded-xl flex justify-between items-center hover:bg-white/20 transition-colors">
              <span className="font-bold text-white flex items-center gap-3"><ShieldCheck size={20} className="text-green-400" /> Privacy Policy</span>
              <ExternalLink size={18} className="text-gray-400" />
            </a>
            
            <a href={LINKS.terms} target="_blank" rel="noreferrer" className="block w-full bg-white/10 p-4 rounded-xl flex justify-between items-center hover:bg-white/20 transition-colors">
              <span className="font-bold text-white flex items-center gap-3"><FileText size={20} className="text-blue-400" /> Terms & Conditions</span>
              <ExternalLink size={18} className="text-gray-400" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'category') {
    const allCats = [...DEFAULT_CATEGORIES, ...customDecks];
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4 pb-24">
        <div className="flex items-center mb-6">
          <button onClick={() => setScreen('home')} className="p-2 mr-4"> <ChevronLeft size={32} /> </button>
          <h2 className="text-xl font-bold">Choose Category</h2>
        </div>
        {customDecks.length > 0 && (
          <div className="mb-6">
            <h3 className="text-gray-400 text-sm font-bold uppercase mb-3 ml-1">Your Custom Decks</h3>
            <div className="grid grid-cols-2 gap-4">
              {customDecks.map(cat => (
                <div key={cat.id} className="relative">
                  <button onClick={() => { setGameState(p => ({ ...p, category: cat.id })); setScreen('duration'); }} className={`${cat.color} w-full aspect-square rounded-2xl flex flex-col items-center justify-center shadow-lg transform active:scale-95 transition-transform`}>
                    <span className="text-4xl mb-2">{cat.icon}</span>
                    <span className="font-bold text-center px-2">{cat.name}</span>
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); deleteDeck(cat.id); }} className="absolute -top-2 -right-2 bg-red-600 rounded-full p-1 shadow-md z-10"> <Trash2 size={16} /> </button>
                </div>
              ))}
            </div>
          </div>
        )}
        <h3 className="text-gray-400 text-sm font-bold uppercase mb-3 ml-1">Standard Decks</h3>
        <div className="grid grid-cols-2 gap-4">
          {DEFAULT_CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => { setGameState(p => ({ ...p, category: cat.id })); setScreen('duration'); }} className={`${cat.color} aspect-square rounded-2xl flex flex-col items-center justify-center shadow-lg transform active:scale-95 transition-transform`}>
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
      <div className="min-h-screen bg-gray-900 text-white p-4 flex flex-col pb-24">
        <div className="flex items-center mb-6">
          <button onClick={() => setScreen('category')} className="p-2 mr-4"> <ChevronLeft size={32} /> </button>
          <h2 className="text-xl font-bold">Game Duration</h2>
        </div>
        <div className="flex-1 flex flex-col justify-center space-y-4">
          {[1, 2, 3, 4, 5].map(min => (
            <button key={min} onClick={() => startGameFlow(min)} className="w-full bg-white/10 py-5 rounded-xl text-xl font-bold hover:bg-yellow-400 hover:text-black transition-colors border border-white/20"> {min} Minute{min > 1 ? 's' : ''} </button>
          ))}
        </div>
      </div>
    );
  }

  // --- PREP SCREEN ---
  if (screen === 'prep') {
    return (
      <div style={rotationStyle} className={`flex flex-col items-center justify-center p-8 text-center transition-colors duration-500 ${isSensorLandscape ? 'bg-green-900' : 'bg-red-900'}`}>
        {!isSensorLandscape ? (
          <>
            <RotateCw size={80} className="mb-6 text-yellow-400 animate-spin" />
            <h2 className="text-4xl font-bold mb-4 text-white">Rotate Phone!</h2>
            <p className="text-xl text-gray-200">Please turn your phone sideways (Landscape) to start.</p>
          </>
        ) : (
          <>
            <div className="text-8xl font-black text-white animate-ping mb-8">{prepTimer}</div>
            <h2 className="text-3xl font-bold text-yellow-400">Place on Forehead!</h2>
            <p className="text-xl mt-4 text-gray-200">Get Ready...</p>
          </>
        )}
      </div>
    );
  }

  // --- GAME SCREEN (WITH PAUSE BUTTON & MODAL) ---
  if (screen === 'game') {
    const allCats = [...DEFAULT_CATEGORIES, ...customDecks];
    const catData = allCats.find(c => c.id === gameState.category);
    
    return (
      <div style={rotationStyle} className={`${catData.color} flex flex-col relative overflow-hidden`}>
        {/* PAUSE MODAL */}
        {isPaused && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-white p-8 rounded-2xl text-center w-80 shadow-2xl">
              <h2 className="text-3xl font-black text-gray-800 mb-6">PAUSED</h2>
              <div className="space-y-3">
                <button 
                  onClick={() => setIsPaused(false)} 
                  className="w-full bg-green-500 text-white py-4 rounded-xl font-bold text-xl shadow-lg active:scale-95 transition-transform"
                >
                  RESUME
                </button>
                <button 
                  onClick={() => { setIsPaused(false); setScreen('category'); }} 
                  className="w-full bg-red-500 text-white py-4 rounded-xl font-bold text-xl shadow-lg active:scale-95 transition-transform"
                >
                  QUIT
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center text-white/90 font-bold z-10">
          <div className="flex flex-col items-center bg-black/20 p-2 rounded-lg min-w-[60px]">
            <span className="text-xs uppercase">Time</span>
            <span className={`text-xl ${gameState.timeLeft < 10 ? 'text-red-300' : 'text-white'}`}>
              {formatTime(gameState.timeLeft)}
            </span>
          </div>
          
          <div className="flex gap-4 items-center">
            {/* SCORE DISPLAY (Only if TILT MODE) */}
            {settings.gameMode === 'tilt' && (
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
            )}
            
            {/* PAUSE BUTTON */}
            <button 
              onClick={() => setIsPaused(true)}
              className="bg-black/30 p-3 rounded-full hover:bg-black/50 transition-colors"
            >
              <Pause fill="white" size={24} />
            </button>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-8 text-center">
          <h1 className="text-5xl md:text-7xl font-black text-white drop-shadow-md leading-tight animate-bounce-in">
            {gameState.currentWord}
          </h1>
        </div>

        {/* BUTTON MODE CONTROLS */}
        {settings.gameMode === 'button' && (
          <div className="h-32 flex w-full absolute bottom-0 left-0 z-20">
             <button onClick={() => processAction('pass')} className="flex-1 bg-red-600 text-white font-bold text-2xl flex flex-col items-center justify-center active:bg-red-700 transition-colors border-r border-white/20"> 
               <span className="text-3xl mb-1">👎</span> PASS 
             </button>
             <button onClick={() => processAction('correct')} className="flex-1 bg-green-600 text-white font-bold text-2xl flex flex-col items-center justify-center active:bg-green-700 transition-colors"> 
               <span className="text-3xl mb-1">👍</span> CORRECT 
             </button>
          </div>
        )}
      </div>
    );
  }

  if (screen === 'result') {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col pb-24">
        <div className="p-6 text-center bg-gray-800 shadow-md z-10">
          <h2 className="text-3xl font-bold mb-2">Time's Up!</h2>
          <div className="text-6xl font-black text-yellow-400 mb-2">{gameState.score.correct}</div>
          <p className="text-gray-400 mb-4">Correct Guesses</p>
          <button onClick={() => setScreen('category')} className="w-full bg-yellow-400 text-black py-4 rounded-xl font-bold text-xl shadow-lg flex items-center justify-center gap-2"> <RefreshCw size={24} /> Play Again </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-900">
          <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">Game History</h3>
          {gameState.results.map((res, idx) => (
            <div key={idx} className="flex justify-between items-center p-3 rounded bg-white/10">
              <span className="font-medium">{res.word}</span>
              <span className={`px-2 py-1 rounded text-xs font-bold ${res.status === 'correct' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {res.status.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return <div>Loading...</div>;
}