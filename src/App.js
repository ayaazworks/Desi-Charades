import { useState, useEffect, useRef, useCallback } from 'react';
import { Settings, Volume2, VolumeX, Smartphone, RotateCw, ShieldCheck, Play, ChevronLeft, ChevronRight, RefreshCw, MessageCircle, WifiOff, FileText, Plus, Save, PenTool, Trash2, Crown, X, Pause, MousePointer2, ExternalLink, Globe } from 'lucide-react';
import { Preferences } from '@capacitor/preferences';
import { Network } from '@capacitor/network';
import { AdMob, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';
import { App as CapacitorApp } from '@capacitor/app';

// --- IMPORT IMAGES ---
import qrCodeImg from './qrcode.jpeg';
import howToPlayImg from './howtoplay.jpg';

// NEW: Import Hindi image
import howToPlayHindiImg from './howtoplayhindi.jpg';

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

const TRANSLATIONS = {
  en: {
    title: "Indian Charades",
    loading: "Loading Game...",
    play: "PLAY GAME",
    createDeck: "CREATE DECK",
    howToPlay: "How To Play",
    settings: "Settings",
    sound: "Sound Effects",
    vibration: "Vibration",
    language: "Language",
    gameMode: "Game Mode",
    tiltMode: "Tilt",
    buttonMode: "Button",
    tiltDesc: "Tilt phone Up/Down to play.",
    buttonDesc: "Tap buttons on screen to play.",
    legal: "Legal",
    privacy: "Policies & Agreement",
    unlock: "Unlock Premium",
    adsRemoved: "Ads Removed Forever!",
    enterCode: "Enter the secret code to remove ads:",
    support: "To Support Me, pay ₹100 via UPI and share screenshot on WhatsApp and get Secret Code.",
    share: "Share Screenshot on WhatsApp",
    chooseCat: "Choose Category",
    customDecks: "Your Custom Decks",
    stdDecks: "Standard Decks",
    duration: "Game Duration",
    minute: "Minute",
    minutes: "Minutes",
    rotate: "Rotate Phone!",
    rotateDesc: "Please turn your phone sideways (Landscape) to start.",
    place: "Place on Forehead!",
    getReady: "Get Ready...",
    paused: "PAUSED",
    resume: "RESUME",
    quit: "QUIT",
    timeUp: "Time's Up!",
    correct: "Correct",
    pass: "Pass",
    playAgain: "Play Again",
    history: "Game History",
    createTitle: "Create Your Own Deck",
    deckName: "Deck Name",
    emoji: "Emoji Icon",
    words: "Words (Comma Separated)",
    atLeast: "At least 5 words required",
    save: "Save Deck",
    howCreate: "How to Create:",
    step1: "1. Give your deck a name (e.g. 'Family Trip').",
    step2: "2. Pick an emoji.",
    step3: "3. Add words separated by commas (e.g. 'Mom, Dad, Dog').",
    vipTitle: "VIP Feature",
    vipDesc: "Unlock Premium to create unlimited custom decks for you and your friends!",
    cancel: "Cancel",
    unlockNow: "Unlock Now",
    noInternet: "No Internet!",
    internetDesc: "Please turn on your Data or WiFi to play Indian Charades.",
    tryAgain: "Try Again",
    transparency: "Transparency",
    transparencyDesc: "We believe in open communication. Tap below to read our full policies.",
    terms: "Terms & Conditions"
  },
  hi: {
    title: "देसी शराड्स",
    loading: "गेम लोड हो रहा है...",
    play: "खेलें",
    createDeck: "नया डेक बनाएं",
    howToPlay: "कैसे खेलें",
    settings: "सेटिंग्स",
    sound: "आवाज़",
    vibration: "कंपन (Vibration)",
    language: "भाषा",
    gameMode: "गेम मोड",
    tiltMode: "झुकाव (Tilt)",
    buttonMode: "बटन",
    tiltDesc: "खेलने के लिए फोन को ऊपर/नीचे झुकाएं।",
    buttonDesc: "खेलने के लिए स्क्रीन पर बटन दबाएं।",
    legal: "कानूनी",
    privacy: "नीति और समझौता",
    unlock: "प्रीमियम अनलॉक करें",
    adsRemoved: "विज्ञापन हमेशा के लिए हटा दिए गए!",
    enterCode: "विज्ञापन हटाने के लिए गुप्त कोड दर्ज करें:",
    support: "मुझे सपोर्ट करने के लिए, UPI के माध्यम से ₹100 का भुगतान करें और व्हाट्सएप पर स्क्रीनशॉट साझा करें और गुप्त कोड प्राप्त करें।",
    share: "व्हाट्सएप पर शेयर करें",
    chooseCat: "श्रेणी चुनें",
    customDecks: "आपके डेक",
    stdDecks: "मानक डेक",
    duration: "खेल की अवधि",
    minute: "मिनट",
    minutes: "मिनट",
    rotate: "फोन घुमाएं!",
    rotateDesc: "शुरू करने के लिए कृपया अपना फोन टेढ़ा (Landscape) करें।",
    place: "माथे पर रखें!",
    getReady: "तैयार हो जाएं...",
    paused: "रूका हुआ",
    resume: "फिर शुरू करें",
    quit: "बंद करें",
    timeUp: "समय समाप्त!",
    correct: "सही",
    pass: "छोड़ें",
    playAgain: "फिर से खेलें",
    history: "खेल का इतिहास",
    createTitle: "अपना खुद का डेक बनाएं",
    deckName: "डेक का नाम",
    emoji: "इमोजी",
    words: "शब्द (कॉमा से अलग करें)",
    atLeast: "कम से कम 5 शब्द आवश्यक हैं",
    save: "डेक सेव करें",
    howCreate: "कैसे बनाएं:",
    step1: "1. अपने डेक को एक नाम दें (जैसे 'परिवार').",
    step2: "2. एक इमोजी चुनें।",
    step3: "3. शब्द जोड़ें और कॉमा लगाएं (जैसे 'मां, पिताजी, कुत्ता').",
    vipTitle: "VIP फीचर",
    vipDesc: "असीमित कस्टम डेक बनाने के लिए प्रीमियम अनलॉक करें!",
    cancel: "रद्द करें",
    unlockNow: "अभी अनलॉक करें",
    noInternet: "इंटरनेट नहीं है!",
    internetDesc: "कृपया खेलने के लिए अपना डेटा या वाईफाई चालू करें।",
    tryAgain: "पुनः प्रयास करें",
    transparency: "पारदर्शिता",
    transparencyDesc: "हम खुली बातचीत में विश्वास करते हैं। हमारी पूरी नीतियां पढ़ने के लिए नीचे टैप करें।",
    terms: "नियम और शर्तें"
  }
};

const DEFAULT_CATEGORIES = [
  {
    id: 'bollywood',
    name: 'Bollywood Movies',
    icon: '🎬',
    color: 'bg-red-500',
    words: {
      en: ['Sholay', 'DDLJ', '3 Idiots', 'Lagaan', 'Bahubali', 'KGF', 'Pushpa', 'Dangal', 'PK', 'Munna Bhai', 'Gadar', 'Don', 'RRR', 'Pathaan', 'Jawan', 'Stree', 'Drishyam', 'Hera Pheri', 'Golmaal', 'Chak De India', 'Tare Zameen Par', 'Barfii', 'Bajrangi Bhaijaan', 'Chennai Express', 'Rockstar', 'Bhool Bhulaiyaa', 'Gangs of Wasseypur', 'Hum Aapke Hain Koun', 'Kabhi Khushi Kabhie Gham', 'Gully Boy', 'Animal', 'Devdas', 'Welcome', 'Om Shanti Om', 'Zindagi Na Milegi Dobara'],
      hi: ['शोले', 'दिलवाले दुल्हनिया ले जाएंगे', '3 इडियट्स', 'लगान', 'बाहुबली', 'के.जी.एफ', 'पुष्पा', 'दंगल', 'पीके', 'मुन्ना भाई', 'गदर', 'डॉन', 'आरआरआर', 'पठान', 'जवान', 'स्त्री', 'दृश्यम', 'हेरा फेरी', 'गोलमाल', 'चक दे इंडिया', 'तारे ज़मीन पर', 'बर्फी', 'बजरंगी भाईजान', 'चेन्नई एक्सप्रेस', 'रॉकस्टार', 'भूल भुलैया', 'गैंग्स ऑफ वासेपुर', 'हम आपके हैं कौन', 'कभी खुशी कभी गम', 'गली बॉय', 'एनिमल', 'देवदास', 'वेलकम', 'ओम शांति ओम', 'जिंदगी ना मिलेगी दोबारा']
    }
  },
  {
    id: 'cricket',
    name: 'Cricket Stars',
    icon: '🏏',
    color: 'bg-blue-600',
    words: {
      en: ['Sachin Tendulkar', 'MS Dhoni', 'Virat Kohli', 'Jasprit Bumrah', 'Ravindra Jadeja', 'Shikhar Dhawan', 'Kapil Dev', 'Sourav Ganguly', 'Yuvraj Singh', 'Rohit Sharma', 'Hardik Pandya', 'Virender Sehwag', 'Rahul Dravid', 'Suryakumar Yadav', 'Rishabh Pant', 'Harbhajan Singh', 'Chris Gayle', 'David Warner', 'Shoaib Akhtar', 'AB de Villiers', 'Gautam Gambhir', 'Sunil Gavaskar', 'Shubman Gill', 'Mohammed Shami', 'KL Rahul'],
      hi: ['सचिन तेंदुलकर', 'एम.एस. धोनी', 'विराट कोहली', 'जसप्रीत बुमराह', 'रवींद्र जडेजा', 'शिखर धवन', 'कपिल देव', 'सौरव गांगुली', 'युवराज सिंह', 'रोहित शर्मा', 'हार्दिक पांड्या', 'वीरेंद्र सहवाग', 'राहुल द्रविड़', 'सूर्यकुमार यादव', 'ऋषभ पंत', 'हरभजन सिंह', 'क्रिस गेल', 'डेविड वॉर्नर', 'शोएब अख्तर', 'एबी डिविलियर्स', 'गौतम गंभीर', 'सुनील गावस्कर', 'शुभमन गिल', 'मोहम्मद शमी', 'के.एल. राहुल']
    }
  },
  {
    id: 'food',
    name: 'Desi Food',
    icon: '🍛',
    color: 'bg-yellow-500',
    words: {
      en: ['Biryani', 'Pani Puri', 'Dosa', 'Samosa', 'Butter Chicken', 'Vada Pav', 'Gulab Jamun', 'Idli', 'Chole Bhature', 'Pav Bhaji', 'Jalebi', 'Rasgulla', 'Dhokla', 'Tandoori Chicken', 'Naan', 'Lassi', 'Momos', 'Kheer', 'Rajma Chawal', 'Dal Makhani', 'Maggi', 'Chai', 'Pakora', 'Kulfi', 'Aloo Paratha', 'Chicken Tikka', 'Fish Curry'],
      hi: ['बिरयानी', 'पानी पूरी', 'डोसा', 'समोसा', 'बटर चिकन', 'वड़ा पाव', 'गुलाब जामुन', 'इडली', 'छोले भटूरे', 'पाव भाजी', 'जलेबी', 'रसगुल्ला', 'ढोकला', 'तंदूरी चिकन', 'नान', 'लस्सी', 'मोमोस', 'खीर', 'राजमा चावल', 'दाल मखनी', 'मैगी', 'चाय', 'पकौड़ा', 'कुल्फी', 'आलू पराठा', 'चिकन टिक्का', 'फिश करी']
    }
  },
  {
    id: 'places',
    name: 'Indian Places',
    icon: '🕌',
    color: 'bg-orange-500',
    words: {
      en: ['Taj Mahal', 'India Gate', 'Red Fort', 'Goa', 'Golden Temple', 'Statue of Unity', 'Qutub Minar', 'Hawa Mahal', 'Kerala', 'Wagah Border', 'Howrah Bridge', 'Gateway of India', 'Lotus Temple', 'Dal Lake', 'Charminar', 'Varanasi', 'Kedarnath', 'Ladakh', 'Ayodhya', 'Mysore Palace', 'Sundarbans', 'Rishikesh', 'Andaman', 'Shimla', 'Manali', 'Darjeeling'],
      hi: ['ताज महल', 'इंडिया गेट', 'लाल किला', 'गोवा', 'स्वर्ण मंदिर', 'स्टैच्यू ऑफ यूनिटी', 'कुतुब मीनार', 'हवा महल', 'केरल', 'वाघा बॉर्डर', 'हावड़ा ब्रिज', 'गेटवे ऑफ इंडिया', 'लोटस टेंपल', 'डल झील', 'चारमीनार', 'वाराणसी', 'केदारनाथ', 'लद्दाख', 'अयोध्या', 'मैसूर पैलेस', 'सुंदरवन', 'ऋषिकेश', 'अंडमान', 'शिमला', 'मनाली', 'दार्जिलिंग']
    }
  },
  {
    id: 'festivals',
    name: 'Festivals',
    icon: '🪔',
    color: 'bg-purple-500',
    words: {
      en: ['Diwali', 'Holi', 'Eid', 'Christmas', 'Navratri', 'Durga Puja', 'Ganesh Chaturthi', 'Onam', 'Pongal', 'Raksha Bandhan', 'Janmashtami', 'Baisakhi', 'Makar Sankranti', 'Dussehra', 'Karwa Chauth', 'Lohri', 'Republic Day', 'Independence Day', 'Gandhi Jayanti', 'Mahashivratri', 'Chhath Puja', 'Bakra Eid', 'New Year'],
      hi: ['दिवाली', 'होली', 'ईद', 'क्रिसमस', 'नवरात्रि', 'दुर्गा पूजा', 'गणेश चतुर्थी', 'ओणम', 'पोंगल', 'रक्षा बंधन', 'जन्माष्टमी', 'बैसाखी', 'मकर संक्रांति', 'दशहरा', 'करवा चौथ', 'लोहड़ी', 'गणतंत्र दिवस', 'स्वतंत्रता दिवस', 'गांधी जयंती', 'महाशिवरात्रि', 'छठ पूजा', 'बकरा ईद', 'नया साल']
    }
  },
  {
    id: 'actions',
    name: 'Actions',
    icon: '🎭',
    color: 'bg-pink-500',
    words: {
      en: ['Dancing', 'Sleeping', 'Cooking', 'Driving', 'Swimming', 'Singing', 'Crying', 'Laughing', 'Running', 'Fighting', 'Eating', 'Drinking', 'Reading', 'Writing', 'Thinking', 'Jumping', 'Clapping', 'Praying', 'Cleaning', 'Shopping', 'Selfie', 'Yoga', 'Sneezing', 'Walking', 'Fishing', 'Painting'],
      hi: ['नाचना', 'सोना', 'खाना बनाना', 'गाड़ी चलाना', 'तैरना', 'गाना', 'रोना', 'हंसना', 'दौड़ना', 'लड़ाई करना', 'खाना', ' पीना', 'पढ़ना', 'लिखना', 'सोचना', 'कूदना', 'ताली बजाना', 'प्रार्थना करना', 'सफाई करना', 'खरीदारी', 'सेल्फी', 'योग', 'छींकना', 'चलना', 'मछली पकड़ना', 'पेंटिंग']
    }
  },
  {
    id: 'indiansuperstars',
    name: 'Indian Superstars',
    icon: '🌟',
    color: 'bg-rose-600',
    words: {
      en: ["Aamir Khan", "Akshay Kumar", "Ajay Devgn", "Amitabh Bachchan", "Amjad Khan", "Arshad Warsi", "Anupam Kher", "Anil Kapoor", "Amrish Puri", "Boman Irani", "Salman Khan", "Dharmendra", "Govinda", "Sanjay Dutt", "Kader Khan", "Hrithik Roshan", "Irfan Khan", "Nawazuddin Siddiqui", "Tiger Shroff", "Johnny Lever", "Kapil Sharma", "Emraan Hashmi", "Katrina Kaif", "Priyanka Chopra", "Ranbir Kapoor", "Saif Ali Khan", "John Abraham", "Shah Rukh Khan", "Sunny Leone", "Suniel Shetty", "Kareena Kapoor", "Alia Bhatt", "Aishwarya Rai", "Jacqueline Fernandez", "Shraddha Kapoor", "Tamannaah Bhatia", "Rashmika Mandanna", "Rajpal Yadav", "Nana Patekar", "Sonam Kapoor", "Riteish Deshmukh", "Mithun Chakraborty", "The Great Khali", "Arjun Rampal", "Rajinikanth"],
      hi: ["आमिर खान", "अक्षय कुमार", "अजय देवगन", "अमिताभ बच्चन", "अमजद खान", "अरशद वारसी", "अनुपम खेर", "अनिल कपूर", "अमरीश पुरी", "बोमन ईरानी", "सलमान खान", "धर्मेंद्र", "गोविंदा", "संजय दत्त", "कादर खान", "ऋतिक रोशन", "इरफान खान", "नवाजुद्दीन सिद्दीकी", "टाइगर श्रॉफ", "जॉनी लीवर", "कपिल शर्मा", "इमरान हाशमी", "कैटरीना कैफ", "प्रियंका चोपड़ा", "रणबीर कपूर", "सैफ अली खान", "जॉन अब्राहम", "शाहरुख खान", "सनी लियोन", "सुनील शेट्टी", "करीना कपूर", "आलिया भट्ट", "ऐश्वर्या राय", "जैकलीन फर्नांडीज", "श्रद्धा कपूर", "तमन्ना भाटिया", "रश्मिका मंदाना", "राजपाल यादव", "नाना पाटेकर", "सोनम कपूर", "रितेश देशमुख", "मिथुन चक्रवर्ती", "द ग्रेट खली", "अर्जुन रामपाल", "रजनीकांत"]
    }
  },
  {
    id: 'netflix',
    name: 'Netflix & Chill',
    icon: '🍿',
    color: 'bg-red-700',
    words: {
      en: ["Sacred Games", "Stranger Things", "Money Heist", "Delhi Crime", "Kota Factory", "Squid Game", "Mirzapur", "The Railway Men", "Jamtara: Sabka Number Ayega", "Breaking Bad", "Friends", "Wednesday", "Little Things", "Khakee: The Bihar Chapter", "Peaky Blinders", "Black Mirror", "The Crown", "Yeh Kaali Kaali Ankhein", "Narcos", "Guns & Gulaabs", "Dark", "Better Call Saul", "Emily in Paris", "The Witcher", "Masaba Masaba", "Aranyak", "Decoupled", "Mai", "She", "The Fame Game", "Bridgerton", "Lucifer", "Sex Education", "House of Cards", "Mindhunter", "You", "The Queen's Gambit", "Kaala Paani", "Class", "Scoop", "Tooth Pari: When Love Bites", "Mismatched", "Selection Day", "Bard of Blood", "Betaal", "Ray", "Indian Matchmaking", "Fabulous Lives of Bollywood Wives", "Hunt for Veerappan", "Curry & Cyanide: The Jolly Joseph Case"],
      hi: ["सेक्रेड गेम्स", "स्ट्रेंजर थिंग्स", "मनी हाइस्ट", "दिल्ली क्राइम", "कोटा फैक्ट्री", "स्क्विड गेम", "मिर्जापुर", "द रेलवे मेन", "जामताड़ा", "ब्रेकिंग बैड", "फ्रेंड्स", "वेडनेसडे", "लिटिल थिंग्स", "खाकी", "पीकी ब्लाइंडर्स", "ब्लैक मिरर", "द क्राउन", "ये काली काली आंखें", "नार्कोस", "गन्स एंड गुलाब्स", "डार्क", "बेटर कॉल शॉल", "एमिली इन पेरिस", "द विचर", " मसाबा मसाबा", "अरण्यक", " डिकपल्ड", "माई", "शी", "द फेम गेम", "ब्रिजर्टन", "लूसिफर", "सेक्स एजुकेशन", "हाउस ऑफ कार्ड्स", "माइंडहंटर", "यू", "द क्वींस गैम्बिट", "काला पानी", "क्लास", "स्कूप", "टूथ परी", "मिसमैचड", "सिलेक्शन डे", "बार्ड ऑफ ब्लड", "बेताल", "रे", "इंडियन मैचमेकिंग", "फैबुलस लाइव्स ऑफ बॉलीवुड वाइव्स", "हंट फॉर वीरप्पन", "करी एंड साइनाइड"]
    }
  },
  {
    id: 'hollywood',
    name: 'Hollywood Movies',
    icon: '🎥',
    color: 'bg-indigo-600',
    words: {
      en: ["The Shawshank Redemption", "Schindler's List", "Raging Bull", "Casablanca", "Citizen Kane", "Gone with the Wind", "The Wizard of Oz", "One Flew Over the Cuckoo's Nest", "Lawrence of Arabia", "Vertigo", "Psycho", "On the Waterfront", "Sunset Boulevard", "Forrest Gump", "The Sound of Music", "12 Angry Men", "West Side Story", "Star Wars: Episode IV - A New Hope", "2001: A Space Odyssey", "E.T. the Extra-Terrestrial", "The Silence of the Lambs", "Chinatown", "The Bridge on the River Kwai", "Singin' in the Rain", "It's a Wonderful Life", "Dr. Strangelove", "Some Like It Hot", "Ben-Hur", "Apocalypse Now", "Amadeus", "The Lord of the Rings: The Return of the King", "Gladiator", "Titanic", "Saving Private Ryan", "Unforgiven", "Raiders of the Lost Ark", "Rocky", "Jaws", "The Exorcist", "Taxi Driver", "Pulp Fiction", "The Dark Knight", "Goodfellas", "Fight Club", "The Matrix", "The Lion King", "Jurassic Park", "The Avengers", "Iron Man", "Avengers: Endgame", "Black Panther", "Spider-Man", "Spider-Man 2", "Spider-Man 3", "Logan", "Wonder Woman", "Joker", "Guardians of the Galaxy", "Spider-Man: Into the Spider-Verse", "Captain America: The Winter Soldier", "The Incredibles", "Deadpool", "Spider-Man: No Way Home", "The Batman"],
      hi: ["द शौशंक रिडेम्पशन", "शिंडलर्स लिस्ट", "रेजिंग बुल", "कासाब्लांका", "सिटिजन केन", "गॉन विद द विंड", "द विजार्ड ऑफ ओज़", "वन फ्लू ओवर द कुकूज़ नेस्ट", "लॉरेंस ऑफ अरेबिया", "वर्टिगो", "साइको", "ऑन द वाटरफ्रंट", "सनसेट बुलेवार्ड", "फॉरेस्ट गम्प", "द साउंड ऑफ म्यूजिक", "12 एंग्री मेन", "वेस्ट साइड स्टोरी", "स्टार वार्स", "2001: ए स्पेस ओडिसी", "ई.टी.", "द साइलेंस ऑफ द लैम्ब्स", "चाइनाटाउन", "द ब्रिज ऑन द रिवर क्वाई", "सिंगिन इन द रेन", "इट्स ए वंडरफुल लाइफ", "डॉ स्ट्रेंजलव", "सम लाइक इट हॉट", "बेन-हर", "एपोकैलिप्स नाउ", "एमडियस", "द लॉर्ड ऑफ द रिंग्स", "ग्लेडिएटर", "टाइटैनिक", "सेविंग प्राइवेट रयान", "अनफॉरगिवेन", "रेडर्स ऑफ द लॉस्ट आर्क", "रॉकी", "जॉज", "द एक्सोरसिस्ट", "टैक्सी ड्राइवर", "पल्प फिक्शन", "द डार्क नाइट", "गुडफेलस", "फाइट क्लब", "द मैट्रिक्स", "द लायन किंग", "जुरासिक पार्क", "द एवेंजर्स", "आयरन मैन", "एवेंजर्स: एंडगेम", "ब्लैक पैंथर", "स्पाइडर-मैन", "स्पाइडर-मैन 2", "स्पाइडर-मैन 3", "लोगन", "वंडर वुमन", "जोकर", "गार्डियंस ऑफ द गैलेक्सी", "स्पाइडर-मैन: इनटू द स्पाइडर-वर्स", "कैप्टन अमेरिका", "द इनक्रेडिबल्स", "डेडपूल", "स्पाइडर-मैन: नो वे होम", "द बैटमैन"]
    }
  },
  {
    id: 'objects',
    name: 'Objects',
    icon: '💡',
    color: 'bg-amber-600',
    words: {
      en: ["Computer", "Paper", "Coin", "Drum", "Bed", "Ring", "Knife", "Glue", "Bottle", "Window", "Compass", "Carpet", "Money", "Chair", "Basket", "Desk", "Piano", "Hammer", "Hat", "Notebook", "Wheel", "Camera", "Pencil", "Blender", "Vase", "Scissors", "Paint Brush", "Bowl", "Fork", "Umbrella", "Ladder", "Letter", "Gift", "Gun", "Pan", "Book", "Dice", "Calculator", "Globe", "Wallet", "Sofa", "Dustbin", "Spoon", "Plate", "Cup", "Mug", "Teapot", "Toaster", "Microwave", "Refrigerator", "Washing Machine", "Iron", "Table", "Lamp", "Mirror", "Door", "Key", "Lock", "Fan", "Pillow", "Blanket", "Curtain", "Toothbrush", "Toothpaste", "Soap", "Shampoo", "Towel", "Comb", "Shoe", "Sock", "Shirt", "T-Shirt", "Tie", "Belt", "Watch", "Glasses", "Mobile Phone", "Remote", "Headphones", "Battery", "Charger", "Light Bulb", "Candle", "Matchbox", "Broom", "Bucket", "Mop", "Tap", "Saw", "Screwdriver", "Axe", "Nail", "Ball", "Balloon", "Swing", "Eraser", "Stapler", "Chalk", "Blackboard"],
      hi: ["कंप्यूटर", "कागज", "सिक्का", "ड्रम", "बिस्तर", "अंगूठी", "चाकू", "गोंद", "बोतल", "खिड़की", "कम्पास", "कालीन", "पैसा", "कुर्सी", "टोकरी", "डेस्क", "पियानो", "हथौड़ा", "टोपी", "नोटबुक", "पहिया", "कैमरा", "पेंसिल", "ब्लेंडर", "फूलदान", "कैंची", "पेंट ब्रश", "कटोरा", "कांटा", "छाता", "सीढ़ी", "पत्र", "उपहार", "बंदूक", "कड़ाही", "किताब", "पासा", "कैलकुलेटर", "ग्लोब", "बटुआ", "सोफा", "कूड़ेदान", "चम्मच", "प्लेट", "कप", "मग", "चायदानी", "टोस्टर", "माइक्रोवेव", "फ्रिज", "वाशिंग मशीन", "इस्त्री", "मेज़", "लैंप", "आईना", "दरवाजा", "चाबी", "ताला", "पंखा", "तकिया", "कंबल", "पर्दा", "टूथब्रश", "टूथपेस्ट", "साबुन", "शैम्पू", "तौलिया", "कंघी", "जूता", "मोज़ा", "शर्ट", "टी-शर्ट", "टाई", "बेल्ट", "घड़ी", "चश्मा", "मोबाइल फोन", "रिमोट", "हेडफोन", "बैटरी", "चार्जर", "बल्ब", "मोमबत्ती", "माचिस", "झाड़ू", "बाल्टी", "पोंछा", "नल", "आरी", "पेचकश", "कुल्हाड़ी", "कील", "गेंद", "गुब्बारा", "झूला", "रबड़", "स्टेपलर", "चौक", "ब्लैकबोर्ड"]
    }
  },
  {
    id: 'games',
    name: 'Games',
    icon: '🎮',
    color: 'bg-violet-600',
    words: {
      en: ["PUBG Mobile", "Battlegrounds Mobile India (BGMI)", "Ludo King", "Genshin Impact", "Free Fire Max", "Call of Duty: Mobile", "Subway Surfers", "Clash of Clans", "Clash Royale", "Candy Crush Saga", "Pokémon GO", "Among Us", "Minecraft", "Roblox", "Mini Militia", "Shadow Fight 2", "Temple Run", "Temple Run 2", "Fruit Ninja", "Angry Birds", "Cut the Rope", "Jetpack Joyride", "Hill Climb Racing", "Hill Climb Racing 2", "Dr. Driving", "Asphalt 8: Airborne", "Asphalt 9: Legends", "Garena Free Fire", "League of Legends: Wild Rift", "Mobile Legends: Bang Bang", "Brawl Stars", "Alto's Adventure", "Monument Valley", "Plants vs. Zombies", "8 Ball Pool", "Carrom Pool", "Hunter Assassin", "Brain Out", "Coin Master", "Gardenscapes", "Homescapes", "Vector", "Hungry Shark Evolution", "Dead Trigger 2", "Traffic Rider", "Talking Tom", "Slither.io", "Flappy Bird", "Doodle Jump", "Need for Speed: No Limits", "GTA: San Andreas", "GTA: Vice City", "Fortnite", "Valorant", "World of Warcraft", "Mortal Kombat", "Sonic the Hedgehog"],
      hi: ["पबजी", "बीजीएमआई", "लूडो किंग", "जेनशिन इम्पैक्ट", "फ्री फायर मैक्स", "कॉल ऑफ ड्यूटी", "सबवे सर्फर्स", "क्लैश ऑफ क्लैन्स", "क्लैश रोयाल", "कैंडी क्रश सागा", "पोकेमॉन गो", "अमंग अस", "माइनक्राफ्ट", "रोब्लॉक्स", "मिनी मिलिशिया", "शैडो फाइट 2", "टेम्पल रन", "टेम्पल रन 2", "फ्रूट निंजा", "एंग्री बर्ड्स", "कट द रोप", "जेटपैक जॉयराइड", "हिल क्लाइंब रेसिंग", "हिल क्लाइंब रेसिंग 2", "डॉ. ड्राइविंग", "एस्फाल्ट 8", "एस्फाल्ट 9", " गरेना फ्री फायर", "लीग ऑफ लीजेंड्स", "मोबाइल लीजेंड्स", "ब्रॉल स्टार्स", " ऑल्टोज़ एडवेंचर", "मोन्यूमेंट वैली", "प्लांट्स बनाम ज़ोंबी", "8 बॉल पूल", "कैरम पूल", "हंटर हत्यारा", "ब्रेन आउट", "कॉइन मास्टर", "गार्डनस्केप्स", "होमस्केप्स", "वेक्टर", "हंग्री शार्क", "डेड ट्रिगर 2", "ट्रैफिक राइडर", "टॉकिंग टॉम", "स्लिदर.आईओ", "फ्लैपी बर्ड", "डूडल जम्प", "नीड फॉर स्पीड", "जीटीए सैन एंड्रियास", "जीटीए वाइस सिटी", "फोर्टनाइट", "वेलोरेंट", "वर्ल्ड ऑफ वारक्राफ्ट", "मोर्टल कोम्बैट", "सोनिक"]
    }
  },
  {
    id: 'kids',
    name: 'Just For Kids',
    icon: '🧸',
    color: 'bg-teal-500',
    words: {
      en: ['Doraemon', 'Chhota Bheem', 'Motu Patlu', 'Tom and Jerry', 'Shinchan', 'Peppa Pig', 'Mickey Mouse', 'School', 'Homework', 'Teacher', 'Chocolate', 'Balloon', 'Ice Cream', 'Park', 'Swing', 'Bicycle', 'Doll', 'Robot', 'Cartoon', 'Fairy', 'Unicorn', 'Santa Claus', 'Elsa', 'Spiderman', "Elephant", "Owl", "Sand Castle", "Milkshake", "Scissors", "Bowling", "Skateboard", "TV", "Game", "Hot Dog", "Shower", "Donkey", "Clock", "Bedroom", "Penguin", "Fox", "Flashlight", "Crane", "Kite", "Laughing", "Squirrel", "Butter", "Board Game", "Ghost", "Gift", "Cupcake", "Fish", "Tree House", "Dog", "Fries", "Samosa", "Burger", "Momos", "Water", "Shaving", "Angel", "Blanket", "Bells", "Airplane", "Cat", "Sun", "Moon", "Star", "Rain", "Ball", "Car", "Bicycle", "Ice Cream", "Pizza", "Chocolate", "Apple", "Banana", "Monkey", "Rabbit", "Lion", "Snake", "Butterfly", "Flower", "Tree", "Book", "Pencil", "School", "Teacher", "Baby", "Sleeping", "Dancing", "Running", "Swimming", "Singing", "Crying", "Hat", "Glasses", "Shoes", "Socks", "Toothbrush", "Spoon", "Chair", "Table", "Door", "Key", "Mobile", "Camera", "Balloon", "Fire", "Snow", "Bird", "Duck", "Cow", "Horse", "Egg", "Bread", "Candy", "Cake", "Juice"],
      hi: ['डोरेमोन', 'छोटा भीम', 'मोटू पतलू', 'टॉम एंड जेरी', 'शिनचैन', 'पेप्पा पिग', 'मिकी माउस', 'स्कूल', 'होमवर्क', 'अध्यापक', 'चॉकलेट', 'गुब्बारा', 'आइसक्रीम', 'पार्क', 'झूला', 'साइकिल', 'गुड़िया', 'रोबोट', 'कार्टून', 'परी', 'यूनिकॉर्न', 'संता क्लॉस', 'एल्सा', 'स्पाइडरमैन', "हाथी", "उल्लू", "रेत का महल", "मिल्कशेक", "कैंची", "बॉलिंग", "स्केटबोर्ड", "टीवी", "खेल", "हॉट डॉग", "शावर", "गधा", "घड़ी", "बेडरूम", "पेंगुइन", "लोमड़ी", "टॉर्च", "क्रेन", "पतंग", "हंसना", "गिलहरी", "मक्खन", "बोर्ड गेम", "भूत", "उपहार", "कपकेक", "मछली", "ट्री हाउस", "कुत्ता", "फ्राइज़", "समोसा", "बर्गर", "मोमोस", "पानी", "शेविंग", "परी", "कंबल", "घंटी", "हवाई जहाज", "बिल्ली", "सूरज", "चांद", "तारा", "बारिश", "गेंद", "कार", "साइकिल", "आइसक्रीम", "पिज़्ज़ा", "चॉकलेट", "सेब", "केला", "बंदर", "खरगोश", "शेर", "सांप", "तितली", "फूल", "पेड़", "किताब", "पेंसिल", "स्कूल", "अध्यापक", "बच्चा", "सोना", "नाचना", "दौड़ना", "तैरना", "गाना", "रोना", "टोपी", "चश्मा", "जूते", "मोज़े", "टूथब्रश", "चम्मच", "कुर्सी", "मेज़", "दरवाजा", "चाबी", "मोबाइल", "कैमरा", "गुब्बारा", "आग", "बर्फ", "पक्षी", "बत्तख", "गाय", "घोड़ा", "अंडा", "ब्रेड", "कैंडी", "केक", "जूस"]
    }
  },
  {
    id: 'animals',
    name: 'Animals',
    icon: '🦁',
    color: 'bg-lime-600',
    words: {
      en: ["Cat", "Bat", "Gorilla", "Donkey", "Penguin", "Pigeon", "Elephant", "Bear", "Ant", "Swan", "Lynx", "Kangaroo", "Panther", "Crab", "Mouse", "Eagle", "Scorpion", "Owl", "Vulture", "Wolf", "Cobra", "Whale", "Camel", "Tiger", "Crocodile", "Goat", "Buffalo", "Cheetah", "Ostrich", "Spider", "Turtle", "Squirrel", "Peacock", "Asiatic Lion", "Royal Bengal Tiger", "Indian Rhinoceros", "Leopard", "Snow Leopard", "Red Panda", "King Cobra", "Mongoose", "Langur", "Macaque", "Gharial", "Blackbuck", "Chital", "Sambar Deer", "Nilgai", "Gaur", "Sloth Bear", "Great Indian Bustard", "Gangetic Dolphin", "Monitor Lizard", "Wild Boar", "Pangolin"],
      hi: ["बिल्ली", "चमगादड़", "गोरिल्ला", "गधा", "पेंगुइन", "कबूतर", "हाथी", "भालू", "चींटी", "हंस", "लिंक्स", "कंगारू", "तेंदुआ", "केकड़ा", "चूहा", "बाज़", "बिच्छू", "उल्लू", "गिद्ध", "भेड़िया", "कोबरा", "व्हेल", "ऊंट", "बाघ", "मगरमच्छ", "बकरी", "भैंस", "चीता", "शुतुरमुर्ग", "मकड़ी", "कछुआ", "गिलहरी", "मोर", "एशियाई शेर", "रॉयल बंगाल टाइगर", "गेंडा", "तेंदुआ", "हिम तेंदुआ", "लाल पांडा", "किंग कोबरा", "नेवला", "लंगूर", "मकाक", "घड़ियाल", "काला हिरण", "चीतल", "सांभर हिरण", "नीलगाय", "गौर", "स्लॉथ भालू", "ग्रेट इंडियन बस्टर्ड", "गंगा डॉल्फिन", "मॉनिटर छिपकली", "जंगली सूअर", "पैंगोलिन"]
    }
  },
  {
    id: 'brands',
    name: 'Famous Brands',
    icon: '🏷️',
    color: 'bg-cyan-600',
    words: {
      en: ['Tata', 'Reliance Jio', 'Amul', 'Maggi', 'Thums Up', 'Parle-G', 'Britannia', 'Haldirams', 'Bata', 'Mahindra', 'Ola', 'Zomato', 'Swiggy', 'Paytm', 'Flipkart', 'Lenskart', 'Royal Enfield', 'Maruti Suzuki', 'Asian Paints', 'HDFC Bank', 'Amrutanjan', 'Boroline', 'Dabur', 'Patanjali', 'PhonePe', "Amazon", "Colgate", "Gillette", "Instagram", "Red Bull", "Apple", "Toyota", "H&M", "Starbucks", "HP", "Xiaomi", "Disney", "Ferrari", "Samsung", "KFC", "Ford", "YouTube", "Facebook", "BMW", "Coca-Cola", "Microsoft", "Huawei", "Pepsi", "Audi", "Mercedes-Benz", "Sony", "Zara", "Nike", "Netflix", "Pampers", "Google", "Intel", "PayPal", "Gucci", "Tesla", "Spotify", "LinkedIn", "Adidas", "Visa", "Mastercard", "Tata", "Reliance", "Mahindra", "Bajaj", "Hero", "Maruti Suzuki", "Royal Enfield", "TVS", "Amul", "Britannia", "Parle", "Haldiram's", "Dabur", "Godrej", "Patanjali", "ITC", "Asian Paints", "Fevicol", "Jio", "Airtel", "Infosys", "Wipro", "HDFC Bank", "SBI", "ICICI Bank", "LIC", "Paytm", "PhonePe", "Flipkart", "Zomato", "Swiggy", "Myntra", "Nykaa", "Ola", "Titan", "Fastrack", "Lenskart", "BoAt", "Old Monk", "Thums Up", "Frooti", "Paper Boat", "Raymond", "Fabindia", "Manyavar", "Sabyasachi", "Indigo"],
      hi: ['टाटा', 'रिलायंस जियो', 'अमूल', 'मैगी', 'थम्स अप', 'पारले-जी', 'ब्रिटानिया', 'हल्दीराम', 'बाटा', 'महिंद्रा', 'ओला', 'ज़ोमैटो', 'स्विगी', 'पेटीएम', 'फ्लिपकार्ट', 'लेंसकार्ट', 'रॉयल एनफील्ड', 'मारुति सुजुकी', 'एशियन पेंट्स', 'एचडीएफसी बैंक', 'अमृतांजन', 'बोरोलिन', 'डाबर', 'पतंजलि', 'फोनपे', "अमेज़न", "कोलगेट", "जिलेट", "इंस्टाग्राम", "रेड बुल", "एप्पल", "टोयोटा", "एच एंड एम", "स्टारबक्स", "एचपी", "शाओमी", "डिज्नी", "फेरारी", "सैमसंग", "केएफसी", "फोर्ड", "यूट्यूब", "फेसबुक", "बीएमडब्ल्यू", "कोका-कोला", "माइक्रोसॉफ्ट", "हुवाई", "पेप्सी", "ऑडी", "मर्सिडीज-बेंज", "सोनी", "ज़ारा", "नाइके", "नेटफ्लिक्स", "पैम्पर्स", "गूगल", "इंटेल", "पेपाल", "गुच्ची", "टेस्ला", "स्पॉटिफाई", "लिंक्डइन", "एडिडास", "वीज़ा", "मास्टरकार्ड", "टाटा", "रिलायंस", "महिंद्रा", "बजाज", "हीरो", "मारुति सुजुकी", "रॉयल एनफील्ड", "टीवीएस", "अमूल", "ब्रिटानिया", "पारले", "हल्दीराम", "डाबर", "गोदरेज", "पतंजलि", "आईटीसी", "एशियन पेंट्स", "फेविकोल", "जियो", "एयरटेल", "इन्फोसिस", "विप्रो", "एचडीएफसी बैंक", "एसबीआई", "आईसीआईसीआई बैंक", "एलआईसी", "पेटीएम", "फोनपे", "फ्लिपकार्ट", "ज़ोमैटो", "स्विगी", "मिंत्रा", "नायका", "ओला", "टाइटन", "फास्टट्रैक", "लेंसकार्ट", "बोट", "ओल्ड मोंक", "थम्स अप", "फ्रूटी", "पेपर बोट", "रेमंड", "फैबइंडिया", "मान्यवर", "सब्यसाची", "इंडिगो"]
    }
  },
  {
    id: 'professions',
    name: 'Professions',
    icon: '👨‍⚕️',
    color: 'bg-slate-600',
    words: {
      en: ["Bus Driver", "Secretary", "Engineer", "Photographer", "Architect", "Dancer", "Gardener", "Fisherman", "Hairdresser", "Artist", "Designer", "Model", "Lawyer", "Plumber", "Postman", "Lifeguard", "Electrician", "Dentist", "Farmer", "Mechanic", "Journalist", "Pharmacist", "Soldier", "Businessman", "Scientist", "Policeman", "Carpenter", "Firefighter", "Painter", "Baker", "Tailor", "Politician", "Pilot", "Nurse", "Teacher", "Waiter", "Doctor", "Chef", "Judge", "Cricketer", "Auto Rickshaw Driver", "Chaiwala (Tea Seller)", "Coolie (Porter)", "Traffic Police", "Security Guard (Watchman)", "Priest (Pandit)", "Vegetable Vendor (Sabziwala)", "Cobbler (Mochi)", "Washerman (Dhobi)", "Scrap Dealer (Kabaadiwala)", "Bus Conductor", "Delivery Partner", "Astrologer", "Magician", "Snake Charmer", "Potter", "Weaver", "Sweeper"],
      hi: ["बस ड्राइवर", "सचिव", "इंजीनियर", "फोटोग्राफर", "आर्किटेक्ट", "डांसर", "माली", "मछुआरा", "हेयरड्रेसर", "कलाकार", "डिजाइनर", "मॉडल", "वकील", "प्लंबर", "डाकिया", "लाइफगार्ड", "इलेक्ट्रीशियन", "दंत चिकित्सक", "किसान", "मैकेनिक", "पत्रकार", "फार्मासिस्ट", "सैनिक", "व्यवसायी", "वैज्ञानिक", "पुलिसकर्मी", "बढ़ई", "फायर फाइटर", "पेंटर", "बेकर", "दर्जी", "राजनेता", "पायलट", "नर्स", "अध्यापक", "वेटर", "डॉक्टर", "बावर्ची", "न्यायाधीश", "क्रिकेटर", "ऑटो रिक्शा चालक", "चायवाला", "कुली", "ट्रैफिक पुलिस", "सुरक्षा गार्ड", "पुजारी", "सब्जी वाला", "मोची", "धोबी", "कबाड़ीवाला", "बस कंडक्टर", "डिलीवरी पार्टनर", "ज्योतिषी", "जादूगर", "सपेरा", "कुम्हार", "बुनकर", "सफाई कर्मचारी"]
    }
  },
  {
    id: 'superheroes',
    name: 'Superheroes & Villains',
    icon: '🦸',
    color: 'bg-fuchsia-700',
    words: {
      en: ["G.One", "Ra.One", "Blade", "Sabretooth", "Doctor Strange", "Professor X", "Spider-Man", "Optimus Prime", "Megatron", "Abomination", "Loki", "She-Hulk", "Hulk", "Batman", "Ant-Man", "Superman", "Dormammu", "Vulture", "Magneto", "Homelander", "Juggernaut", "Logan", "Black Panther", "Apocalypse", "Iron Man", "Captain America", "Winter Soldier", "Thor", "Black Widow", "Captain Marvel", "Rocket", "Groot", "Wonder Woman", "Flash", "Green Lantern", "Aquaman", "Cyborg", "Green Arrow", "Martian Manhunter", "Shazam", "Black Adam", "Darkside", "Doctor Doom", "Thanos", "Ultron", "Chitti", "Krrish", "Flying Jatt", "Mr. India", "Minnal Murali", "Kaal", "Pakshi Rajan", "Hawkeye"],
      hi: ["जी.वन", "रा.वन", "ब्लेड", "साब्रेटूथ", "डॉक्टर स्ट्रेंज", "प्रोफेसर एक्स", "स्पाइडर-मैन", "ऑप्टिमस प्राइम", "मेगाट्रॉन", "एबोमिनेशन", "लोकी", "शी-हल्क", "हल्क", "बैटमैन", "एंट-मैन", "सुपरमैन", "डॉर्मामू", "वल्चर", "मैग्नेटो", "होमलैंडर", "जगरनॉट", "लोगन", "ब्लैक पैंथर", "एपोकैलिप्स", "आयरन मैन", "कैप्टन अमेरिका", "विंटर सोल्जर", "थॉर", "ब्लैक विडो", "कैप्टन मार्वल", "रॉकेट", "ग्रूट", "वंडर वुमन", "फ्लैश", "ग्रीन लैंटर्न", "एक्वामैन", "साइबोर्ग", "ग्रीन एरो", "मार्टियन मैनहंटर", "शज़ैम", "ब्लैक एडम", "डार्कसाइड", "डॉक्टर डूम", "थानोस", "अल्ट्रॉन", "चिट्टी", "क्रिश", "फ्लाइंग जट्ट", "मिस्टर इंडिया", "मिन्नल मुरली", "काल", "पक्षी राजन", "हॉकआई"]
    }
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
    gameMode: 'tilt',
    language: 'en'
  });
  const [promoCode, setPromoCode] = useState('');
  const [isOnline, setIsOnline] = useState(true);
  const MY_PHONE_NUMBER = "919897951097";

  // --- TRANSLATION HELPER ---
  const t = (key) => {
    return TRANSLATIONS[settings.language][key] || TRANSLATIONS['en'][key];
  };

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

      const { value: modeVal } = await Preferences.get({ key: 'gameMode' });
      if (modeVal) setSettings(s => ({ ...s, gameMode: modeVal }));

      const { value: langVal } = await Preferences.get({ key: 'language' });
      if (langVal) setSettings(s => ({ ...s, language: langVal }));

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

  const saveLanguage = async (lang) => {
    setSettings(s => ({ ...s, language: lang }));
    await Preferences.set({ key: 'language', value: lang });
  };

  const saveNewDeck = async () => {
    if (!newDeckName.trim()) { alert("Please enter a deck name!"); return; }
    if (!newDeckWords.trim()) { alert("Please add some words!"); return; }
    const wordsArray = newDeckWords.split(',').map(w => w.trim()).filter(w => w.length > 0);
    if (wordsArray.length < 5) { alert(t('atLeast')); return; }

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
    if (settings.adsRemoved || !isOnline) { try { await AdMob.hideBanner(); } catch (e) { } return; }
    if (screen === 'prep' || screen === 'game') { try { await AdMob.hideBanner(); } catch (e) { } return; }
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
    if (!event) return;
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

    // FETCH CORRECT WORD LIST BASED ON LANGUAGE
    const allCategories = [...DEFAULT_CATEGORIES, ...customDecks];
    const catData = allCategories.find(c => c.id === gameState.category);

    let words;
    // Check if category has translation object or flat array (custom decks)
    if (Array.isArray(catData.words)) {
      words = [...catData.words]; // Custom Deck
    } else {
      // Translated Deck - Pick correct language or fallback to English
      words = [...(catData.words[settings.language] || catData.words['en'])];
    }

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
      } catch (e) { }
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

    if (settings.gameMode === 'button') {
      setTimeout(() => {
        setGameState(prev => {
          const nextQueue = prev.wordsQueue.slice(1);
          if (nextQueue.length === 0) { setTimeout(endGame, 100); return prev; }
          return { ...prev, wordsQueue: nextQueue, currentWord: nextQueue[0] };
        });
        tiltLocked.current = false;
      }, 500);
    } else {
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
        <h2 className="text-3xl font-bold text-white mb-2">{t('noInternet')}</h2>
        <p className="text-gray-300 text-lg mb-8">{t('internetDesc')}</p>
        <button onClick={() => window.location.reload()} className="bg-white text-gray-900 px-8 py-3 rounded-full font-bold"> {t('tryAgain')} </button>
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
          <h1 className="text-4xl font-bold tracking-wider mb-2 drop-shadow-lg">{t('title')}</h1>
          <p className="text-indigo-100 drop-shadow-md">{t('loading')}</p>
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
              <h3 className="text-2xl font-bold text-white mb-2">{t('vipTitle')}</h3>
              <p className="text-gray-300 mb-6">{t('vipDesc')}</p>
              <div className="flex gap-3">
                <button onClick={() => setShowPremiumPopup(false)} className="flex-1 py-3 rounded-xl font-bold text-gray-400 bg-white/5 hover:bg-white/10"> {t('cancel')} </button>
                <button onClick={() => { setShowPremiumPopup(false); setScreen('settings'); }} className="flex-1 bg-yellow-400 text-black py-3 rounded-xl font-bold hover:bg-yellow-300"> {t('unlockNow')} </button>
              </div>
            </div>
          </div>
        )}
        <div className="p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">{t('title')}</h1>
          <button onClick={() => setScreen('settings')} className="p-2 bg-white/10 rounded-full"> <Settings size={24} /> </button>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-4">
          <div className="w-48 h-48 bg-white/10 rounded-full flex items-center justify-center border-4 border-yellow-400 shadow-lg shadow-yellow-500/20 mb-4"> <Smartphone size={80} className="text-yellow-400" /> </div>
          <button onClick={() => setScreen('category')} className="w-full max-w-xs bg-yellow-400 text-indigo-900 py-4 rounded-xl text-xl font-black shadow-lg transform active:scale-95 transition-transform flex items-center justify-center gap-2"> <Play fill="currentColor" /> {t('play')} </button>
          <button onClick={handleCreateDeckClick} className="w-full max-w-xs bg-purple-500 text-white py-4 rounded-xl text-xl font-black shadow-lg transform active:scale-95 transition-transform flex items-center justify-center gap-2 border border-purple-400/50"> <Plus strokeWidth={3} /> {t('createDeck')} </button>
          <button onClick={() => setScreen('howtoplay')} className="w-full max-w-xs bg-white/20 py-3 rounded-xl font-bold backdrop-blur-sm"> {t('howToPlay')} </button>
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
          <h2 className="text-xl font-bold">{t('createTitle')}</h2>
        </div>
        <div className="space-y-6">
          <div className="bg-blue-500/20 border border-blue-500/50 p-4 rounded-xl text-sm text-blue-200">
            <p className="font-bold mb-1 flex items-center gap-2"><PenTool size={16} /> {t('howCreate')}</p>
            <p>{t('step1')}</p>
            <p>{t('step2')}</p>
            <p>{t('step3')}</p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2 font-bold">{t('deckName')}</label>
              <input value={newDeckName} onChange={(e) => setNewDeckName(e.target.value)} className="w-full bg-white/10 p-4 rounded-xl text-white font-bold outline-none focus:ring-2 focus:ring-purple-500" placeholder="e.g. My Best Friends" />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2 font-bold">{t('emoji')}</label>
              <input value={newDeckEmoji} onChange={(e) => setNewDeckEmoji(e.target.value)} className="w-full bg-white/10 p-4 rounded-xl text-white font-bold outline-none focus:ring-2 focus:ring-purple-500" placeholder="e.g. 🥳" maxLength={2} />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2 font-bold">{t('words')}</label>
              <textarea value={newDeckWords} onChange={(e) => setNewDeckWords(e.target.value)} className="w-full bg-white/10 p-4 rounded-xl text-white h-40 outline-none focus:ring-2 focus:ring-purple-500" placeholder="Batman, Superman, Spiderman..." />
              <p className="text-right text-xs text-gray-500 mt-1">{t('atLeast')}</p>
            </div>
            <button onClick={saveNewDeck} className="w-full bg-green-500 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform"> <Save /> {t('save')} </button>
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
          <h2 className="text-2xl font-bold">{screen === 'settings' ? t('settings') : t('howToPlay')}</h2>
        </div>
        {screen === 'settings' ? (
          <div className="space-y-4">
            {/* LANGUAGE TOGGLE */}
            <div className="bg-white/10 p-4 rounded-xl">
              <h3 className="text-gray-400 text-xs font-bold uppercase mb-3 tracking-wider">{t('language')}</h3>
              <div className="flex gap-2 bg-black/20 p-1 rounded-lg">
                <button
                  onClick={() => saveLanguage('en')}
                  className={`flex-1 py-2 rounded-md font-bold text-sm flex items-center justify-center gap-2 transition-colors ${settings.language === 'en' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
                >
                  <Globe size={16} /> English
                </button>
                <button
                  onClick={() => saveLanguage('hi')}
                  className={`flex-1 py-2 rounded-md font-bold text-sm flex items-center justify-center gap-2 transition-colors ${settings.language === 'hi' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
                >
                  <Globe size={16} /> हिंदी
                </button>
              </div>
            </div>

            {/* GAME MODE TOGGLE */}
            <div className="bg-white/10 p-4 rounded-xl">
              <h3 className="text-gray-400 text-xs font-bold uppercase mb-3 tracking-wider">{t('gameMode')}</h3>
              <div className="flex gap-2 bg-black/20 p-1 rounded-lg">
                <button onClick={() => saveGameMode('tilt')} className={`flex-1 py-2 rounded-md font-bold text-sm flex items-center justify-center gap-2 transition-colors ${settings.gameMode === 'tilt' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}>
                  <RotateCw size={16} /> {t('tiltMode')}
                </button>
                <button onClick={() => saveGameMode('button')} className={`flex-1 py-2 rounded-md font-bold text-sm flex items-center justify-center gap-2 transition-colors ${settings.gameMode === 'button' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}>
                  <MousePointer2 size={16} /> {t('buttonMode')}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">{settings.gameMode === 'tilt' ? t('tiltDesc') : t('buttonDesc')}</p>
            </div>

            <div className="bg-white/10 p-4 rounded-xl flex justify-between items-center">
              <div className="flex items-center gap-3"> {settings.sound ? <Volume2 className="text-green-400" /> : <VolumeX className="text-red-400" />} <span>{t('sound')}</span> </div>
              <button onClick={() => setSettings(s => ({ ...s, sound: !s.sound }))} className={`w-12 h-6 rounded-full relative ${settings.sound ? 'bg-green-500' : 'bg-gray-600'}`}> <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${settings.sound ? 'right-1' : 'left-1'}`} /> </button>
            </div>
            <div className="bg-white/10 p-4 rounded-xl flex justify-between items-center">
              <div className="flex items-center gap-3"> <Smartphone className={settings.vibration ? "text-green-400" : "text-red-400"} /> <span>{t('vibration')}</span> </div>
              <button onClick={() => setSettings(s => ({ ...s, vibration: !s.vibration }))} className={`w-12 h-6 rounded-full relative ${settings.vibration ? 'bg-green-500' : 'bg-gray-600'}`}> <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${settings.vibration ? 'right-1' : 'left-1'}`} /> </button>
            </div>
            <button onClick={() => setScreen('privacy')} className="w-full bg-white/10 p-4 rounded-xl flex justify-between items-center hover:bg-white/20 transition-colors">
              <div className="flex items-center gap-3"> <FileText className="text-blue-400" /> <span>{t('privacy')}</span> </div>
              <ChevronRight className="text-gray-500" />
            </button>
            <div className="mt-8">
              <h3 className="text-gray-400 mb-2 uppercase text-sm font-bold tracking-wider"> {t('unlock')} </h3>
              {settings.adsRemoved ? (
                <div className="bg-green-500/20 text-green-400 p-4 rounded-xl flex items-center justify-center gap-2 border border-green-500/50 animate-pulse"> <ShieldCheck size={24} /> <span className="font-bold">{t('adsRemoved')}</span> </div>
              ) : (
                <div className="bg-white/10 p-4 rounded-xl space-y-3">
                  <p className="text-sm text-gray-300 font-medium"> {t('enterCode')} </p>
                  <div className="flex gap-2">
                    <input type="text" placeholder="Enter Code" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} className="flex-1 bg-black/40 border border-gray-600 rounded-lg px-4 py-3 text-white uppercase tracking-widest font-bold focus:outline-none focus:border-yellow-400 transition-colors" />
                    <button onClick={handleUnlock} className="bg-yellow-400 text-black font-black px-6 py-2 rounded-lg hover:bg-yellow-300 active:scale-95 transition-transform"> GO </button>
                  </div>
                  <div className="flex justify-center my-4"> <img src={qrCodeImg} alt="Payment QR Code" className="w-48 h-48 rounded-lg border-4 border-white shadow-lg" /> </div>
                  <div className="pt-2 border-t border-gray-700">
                    <p className="text-xs text-gray-400 mb-2 text-center">{t('support')} </p>
                    <button onClick={openWhatsApp} className="w-full bg-green-600 hover:bg-green-500 text-white py-2 rounded-lg flex items-center justify-center gap-2 font-bold transition-colors"> <MessageCircle size={20} /> {t('share')} </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col flex-1">
            <div className="flex-1 overflow-y-auto mb-4 p-2 bg-white/5 rounded-xl">
              {/* DYNAMIC IMAGE SOURCE BASED ON LANGUAGE */}
              <img src={settings.language === 'hi' ? howToPlayHindiImg : howToPlayImg} alt="How to Play" className="w-full h-auto rounded-lg" />
            </div>
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
          <h2 className="text-2xl font-bold">{t('legal')}</h2>
        </div>
        <div className="space-y-6 text-gray-300 overflow-y-auto">
          <div className="bg-white/10 p-5 rounded-xl border-l-4 border-blue-500">
            <h3 className="text-white font-bold text-lg mb-2">{t('transparency')}</h3>
            <p className="text-sm leading-relaxed"> {t('transparencyDesc')} </p>
          </div>

          <div className="space-y-3">
            <a href={LINKS.privacy} target="_blank" rel="noreferrer" className="block w-full bg-white/10 p-4 rounded-xl justify-between items-center hover:bg-white/20 transition-colors">
              <span className="font-bold text-white flex items-center gap-3"><ShieldCheck size={20} className="text-green-400" /> Privacy Policy</span>
              <ExternalLink size={18} className="text-gray-400" />
            </a>

            <a href={LINKS.terms} target="_blank" rel="noreferrer" className="block w-full bg-white/10 p-4 rounded-xl justify-between items-center hover:bg-white/20 transition-colors">
              <span className="font-bold text-white flex items-center gap-3"><FileText size={20} className="text-blue-400" /> {t('terms')}</span>
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
          <h2 className="text-xl font-bold">{t('chooseCat')}</h2>
        </div>
        {customDecks.length > 0 && (
          <div className="mb-6">
            <h3 className="text-gray-400 text-sm font-bold uppercase mb-3 ml-1">{t('customDecks')}</h3>
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
        <h3 className="text-gray-400 text-sm font-bold uppercase mb-3 ml-1">{t('stdDecks')}</h3>
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
          <h2 className="text-xl font-bold">{t('duration')}</h2>
        </div>
        <div className="flex-1 flex flex-col justify-center space-y-4">
          {[1, 2, 3, 4, 5].map(min => (
            <button key={min} onClick={() => startGameFlow(min)} className="w-full bg-white/10 py-5 rounded-xl text-xl font-bold hover:bg-yellow-400 hover:text-black transition-colors border border-white/20"> {min} {min > 1 ? t('minutes') : t('minute')} </button>
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
            <h2 className="text-4xl font-bold mb-4 text-white">{t('rotate')}</h2>
            <p className="text-xl text-gray-200">{t('rotateDesc')}</p>
          </>
        ) : (
          <>
            <div className="text-8xl font-black text-white animate-ping mb-8">{prepTimer}</div>
            <h2 className="text-3xl font-bold text-yellow-400">{t('place')}</h2>
            <p className="text-xl mt-4 text-gray-200">{t('getReady')}</p>
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
              <h2 className="text-3xl font-black text-gray-800 mb-6">{t('paused')}</h2>
              <div className="space-y-3">
                <button onClick={() => setIsPaused(false)} className="w-full bg-green-500 text-white py-4 rounded-xl font-bold text-xl shadow-lg active:scale-95 transition-transform"> {t('resume')} </button>
                <button onClick={() => { setIsPaused(false); setScreen('category'); }} className="w-full bg-red-500 text-white py-4 rounded-xl font-bold text-xl shadow-lg active:scale-95 transition-transform"> {t('quit')} </button>
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
                  <span className="text-xs">{t('correct')}</span>
                  <span className="text-lg">{gameState.score.correct}</span>
                </div>
                <div className="bg-red-600/80 px-4 py-1 rounded-full flex flex-col items-center">
                  <span className="text-xs">{t('pass')}</span>
                  <span className="text-lg">{gameState.score.pass}</span>
                </div>
              </div>
            )}

            {/* PAUSE BUTTON */}
            <button onClick={() => setIsPaused(true)} className="bg-black/30 p-3 rounded-full hover:bg-black/50 transition-colors"> <Pause fill="white" size={24} /> </button>
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
              <span className="text-3xl mb-1">👎</span> {t('pass')}
            </button>
            <button onClick={() => processAction('correct')} className="flex-1 bg-green-600 text-white font-bold text-2xl flex flex-col items-center justify-center active:bg-green-700 transition-colors">
              <span className="text-3xl mb-1">👍</span> {t('correct')}
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
          <h2 className="text-3xl font-bold mb-2">{t('timeUp')}</h2>
          <div className="text-6xl font-black text-yellow-400 mb-2">{gameState.score.correct}</div>
          <p className="text-gray-400 mb-4">{t('correct')}</p>
          <button onClick={() => setScreen('category')} className="w-full bg-yellow-400 text-black py-4 rounded-xl font-bold text-xl shadow-lg flex items-center justify-center gap-2"> <RefreshCw size={24} /> {t('playAgain')} </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-900">
          <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">{t('history')}</h3>
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