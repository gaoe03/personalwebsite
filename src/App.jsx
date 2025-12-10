import { useState, useEffect, useRef } from 'react';
import { MapPin, Briefcase, GraduationCap, Github, Youtube, Mail, Camera, Code, Globe, Ticket, ArrowUpRight, Image, X, ChevronRight, Play, ExternalLink, IceCream, Coins, Linkedin, ChevronDown } from 'lucide-react';

const projects = [
  {
    id: 'image-tagger', title: 'Image Tagger', desc: 'AI-powered tool for organizing and searching thousands of saved images', icon: Image, tech: ['Python', 'Gemini API', 'OpenAI API', 'Discord.py'], type: 'Nov 2025',
    category: 'Personal Tool',
    fullDesc: `As someone who enjoys digital art, I cherish the references on Twitter that I've sorted into my liked posts over the years. After they changed their API access and privatized all likes in 2023, I downloaded everything locally but lost the discoverability and threading that Twitter provided.

So I built Image Tagger. It uses Gemini 2.5 and OpenAI's 4o models to automatically analyze and tag images, generating searchable descriptions for medium, color palette, subject matter, and more. I created a taxonomy structure to keep tags consistent across the collection. Now I can search through 10,000+ files with natural language queries like "sunset landscapes with warm colors" or "character designs with armor" locally.` },
  {
    id: 'tweetfetch', title: 'TweetFetch', desc: 'Discord bot for browsing and searching archived Twitter likes', icon: Code, tech: ['Python', 'Discord.py', 'AsyncIO'], link: 'https://github.com/gaoe03/TweetFetch', type: 'Mar 2025',
    category: 'Discord Bot',
    fullDesc: `Discord bot that parses a commonly used Twitter data export format and provides an interface for browsing archived liked tweets.

Features include filtering by username, date range, and media type, a slideshow viewer for passive browsing, and a guessing game for exploring the archive. Tracks statistics like most-liked users and total media count. Later integrated with ImageTagger to enable searching tagged images directly from the bot.

Built with async Python to handle large JSON datasets efficiently.` },
  {
    id: 'synth', title: 'Synth', desc: 'Discord bot for experimenting with text generation models', icon: Code, tech: ['Python', 'Discord.py', 'TextSynth API'], link: 'https://github.com/gaoe03/Synth', type: 'Dec 2022',
    category: 'Discord Bot',
    fullDesc: `Discord bot built to experiment with text generation APIs after learning about TextSynth in a CS class. Integrates with the TextSynth API to generate text using different language models including GPT-3, CodeGen, and FairseqGPT.

Built a command interface that lets users select which engine to use for their prompts, check remaining API credits, and monitor server latency. The bot logs all generation requests with summaries for tracking usage patterns.

Built with Python using discord.py and requests. Implemented custom features to streamline the model selection and query process.` },
  {
    id: 'stockx-guess', title: 'StockX Guess', desc: 'Browser game where you guess sneaker market prices', icon: Globe, tech: ['JavaScript', 'HTML', 'CSS'], link: 'https://github.com/pyangmain/Sneaker-Price-Guessing-Game', type: 'Aug 2022',
    category: 'Web Game',
    fullDesc: `A browser-based game where players guess the market price of ten random sneakers from popular brands and receive a score based on accuracy.

Scraped and parsed JSON data of sneaker information including price, picture, and title using StockX's unofficial API. Built the game logic and UI to display random selections and calculate scoring based on guess proximity to actual market prices.

Built with JavaScript, HTML, and CSS.` },
  {
    id: 'cybercredit', title: 'CyberCredit', desc: 'On-chain credit scoring for DeFi lending protocols', icon: Coins, tech: ['JavaScript', 'TypeScript', 'Etherscan API', 'CyberConnect API'], type: 'Mar 2022',
    category: 'Hackathon',
    fullDesc: `Built at the Blockchain@Columbia 2022 Hackathon. Designed a front-end application that analyzes Ethereum wallet data to generate credit scores for DeFi lending protocols.

The application pulls on-chain transaction history using the Etherscan and CyberConnect APIs, then calculates a creditworthiness score based on factors like transaction frequency, token diversity, protocol interactions, and account age. The goal was to provide risk assessment for under-collateralized lending without traditional credit infrastructure.

Built with JavaScript, TypeScript, and CSS. Completed in 24 hours with a team of three.` }
];

const videos = [
  { num: '1', title: 'Tohoku', gradient: 'linear-gradient(135deg, #3d5a4a 0%, #5a7c6a 100%)', url: 'https://www.youtube.com/watch?v=cUowHezVU8c', comingSoon: false, thumbnail: '/thumbnails/gaolife-1.jpg' },
  { num: '1 pt.2', title: 'Hokkaido', gradient: 'linear-gradient(135deg, #2d4a5a 0%, #4a6a7c 100%)', url: 'https://www.youtube.com/watch?v=xY8n0mokf9w', comingSoon: false, thumbnail: '/thumbnails/gaolife-1pt2.jpg' },
  { num: '2', title: 'Hong Kong', gradient: 'linear-gradient(135deg, #4a3d5a 0%, #6a5a7c 100%)', url: 'https://www.youtube.com/watch?v=DhuqgmEaplg', comingSoon: false, thumbnail: '/thumbnails/gaolife-2.jpg' },
  { num: '3', title: 'Guangdong', gradient: 'linear-gradient(135deg, #5a4a2d 0%, #7c6a4a 100%)', url: 'https://www.youtube.com/watch?v=oHXrmyAfnkc', comingSoon: false, thumbnail: '/thumbnails/gaolife-3.jpg' },
  { num: '4', title: 'Sichuan', gradient: 'linear-gradient(135deg, #2d5a4a 0%, #4a7c59 100%)', url: 'https://www.youtube.com/watch?v=bOl0s6UcLQI', comingSoon: false, thumbnail: '/thumbnails/gaolife-4.jpg' },
  { num: '5', title: 'Coming Soon', gradient: 'linear-gradient(135deg, #4a4a4a 0%, #6a6a6a 100%)', url: '', comingSoon: true, thumbnail: null },
];

const skills = {
  languages: { title: 'Languages', items: ['Python', 'JavaScript', 'TypeScript', 'SQL', 'HTML/CSS', 'LaTeX'] },
  frameworks: { title: 'Frameworks & Libraries', items: ['Discord.py', 'Pandas', 'NumPy', 'PyTorch', 'Requests', 'BeautifulSoup'] },
  tools: { title: 'Tools', items: ['Git/GitHub', 'VS Code', 'Claude Code', 'OpenAI Models', 'OpenAI Codex', 'Google Antigravity IDE', 'Google Gemini Models', 'Notion', 'Jira', 'Microsoft Suite', 'CapCut', 'IntelliJ', 'Eclipse', 'Repl.it'] },
  certs: { title: 'Certifications', items: ['Salesforce Platform Administrator'] }
};

const ProjectModal = ({ project, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: isVisible ? 'rgba(35,35,30,0.6)' : 'rgba(35,35,30,0)', transition: 'background-color 0.3s ease' }} onClick={handleClose}>
      <div className="w-full max-w-xl rounded-2xl relative overflow-hidden" style={{ backgroundColor: '#faf9f6', maxHeight: '85vh', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.05)', transform: isVisible ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(10px)', opacity: isVisible ? 1 : 0, transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease' }} onClick={e => e.stopPropagation()}>
        <div className="px-6 pt-6 pb-5" style={{ background: 'linear-gradient(180deg, #f0ede8 0%, #faf9f6 100%)' }}>
          <button onClick={handleClose} className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-150" style={{ backgroundColor: 'rgba(0,0,0,0.05)' }}>
            <X size={16} style={{ color: '#666' }} />
          </button>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#4A7C59' }}>
              <project.icon size={20} style={{ color: '#fff' }} />
            </div>
            <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ backgroundColor: 'rgba(139,115,85,0.15)', color: '#8b7355' }}>{project.type}</span>
          </div>
          <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.625rem', color: '#2d2d2d', marginBottom: '0.875rem', fontWeight: 400 }}>{project.title}</h3>
          <div className="flex flex-wrap gap-2">
            {project.tech.map(t => <span key={t} className="text-xs px-3 py-1.5 rounded-full font-medium" style={{ backgroundColor: '#fff', color: '#5a5a5a', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>{t}</span>)}
          </div>
        </div>
        <div className="mx-6" style={{ height: '1px', background: 'linear-gradient(90deg, transparent, #e0dcd6, transparent)' }} />
        <div className="px-6 py-5 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 200px)' }}>
          <div className="text-sm leading-relaxed" style={{ color: '#555', whiteSpace: 'pre-line', lineHeight: 1.85 }}>{project.fullDesc}</div>
        </div>
        {project.link && (
          <>
            <div className="mx-6" style={{ height: '1px', background: 'linear-gradient(90deg, transparent, #e0dcd6, transparent)' }} />
            <div className="px-6 py-4">
              <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium" style={{ backgroundColor: '#2d2d2d', color: '#fff' }}>
                <Github size={16} /> View on GitHub <ArrowUpRight size={14} />
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Interactive mockup for Image Tagger - input image, get tags
const ImageTaggerMockup = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showTags, setShowTags] = useState(true);

  const images = [
    { bg: '#E8B4B8', tags: ['sunset', 'warm tones', 'landscape'] },
    { bg: '#A8D8EA', tags: ['character', 'blue palette', 'digital art'] },
    { bg: '#AA96DA', tags: ['abstract', 'purple', 'geometric'] },
  ];

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setShowTags(false);
    setTimeout(() => {
      setShowTags(true);
      setIsAnalyzing(false);
      setCurrentImage((currentImage + 1) % images.length);
    }, 600);
  };

  const image = images[currentImage];

  return (
    <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', height: 'calc(100% - 30px)' }}>
      {/* Image display */}
      <div style={{ borderRadius: '12px', overflow: 'hidden', position: 'relative', height: '120px', boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.1)' }}>
        <div style={{ width: '100%', height: '100%', background: image.bg }} />
        {isAnalyzing && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontSize: '11px' }}>Analyzing...</span>
          </div>
        )}
      </div>

      {/* Generated tags */}
      <div style={{ background: '#f5f3ef', borderRadius: '10px', padding: '12px', marginTop: '12px', flex: 1 }}>
        <div style={{ fontSize: '9px', color: '#888', marginBottom: '8px' }}>Generated Tags:</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {showTags && image.tags.map((tag, i) => (
            <span
              key={tag}
              style={{
                background: '#4A7C59',
                color: '#fff',
                fontSize: '10px',
                padding: '4px 10px',
                borderRadius: '12px',
                animation: `fadeIn 0.3s ease ${i * 0.1}s both`,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Analyze button */}
      <button
        onClick={handleAnalyze}
        disabled={isAnalyzing}
        style={{
          marginTop: '12px',
          width: '100%',
          background: isAnalyzing ? '#ccc' : '#4A7C59',
          border: 'none',
          borderRadius: '8px',
          padding: '10px',
          color: '#fff',
          fontSize: '11px',
          fontWeight: '600',
          cursor: isAnalyzing ? 'default' : 'pointer',
          flexShrink: 0,
        }}
      >
        {isAnalyzing ? 'Analyzing...' : 'Analyze Next Image'}
      </button>
    </div>
  );
};

// Interactive mockup for TweetFetch - Discord bot slideshow
const TweetFetchMockup = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { bg: '#E8B4B8', text: 'finally finished this piece after 3 weeks' },
    { bg: '#A8D8EA', text: 'day 247 of daily sketches' },
    { bg: '#AA96DA', text: 'commission for a friend' },
  ];

  const currentArt = slides[currentSlide];
  const nextSlide = () => setCurrentSlide((currentSlide + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((currentSlide - 1 + slides.length) % slides.length);

  return (
    <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', height: 'calc(100% - 30px)' }}>
      {/* Command input bar */}
      <div style={{ background: '#40444b', borderRadius: '8px', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ color: '#5865F2', fontSize: '12px', fontWeight: '600' }}>/</span>
        <span style={{ color: '#dcddde', fontSize: '11px' }}>compile favartist</span>
      </div>

      {/* Bot response card */}
      <div style={{ marginTop: '12px', background: '#2f3136', borderRadius: '8px', borderLeft: '4px solid #4A7C59', padding: '12px', flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#4A7C59', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontSize: '8px', fontWeight: '600' }}>TF</span>
          </div>
          <span style={{ color: '#4A7C59', fontSize: '11px', fontWeight: '600' }}>TweetFetch</span>
          <span style={{ background: '#5865F2', color: '#fff', fontSize: '7px', padding: '2px 4px', borderRadius: '3px' }}>BOT</span>
        </div>

        {/* Response text */}
        <div style={{ fontSize: '10px', color: '#dcddde', marginBottom: '8px' }}>
          You liked <span style={{ color: '#4A7C59', fontWeight: '600' }}>3</span> tweets by <span style={{ color: '#4A7C59', fontWeight: '600' }}>@favartist</span>
        </div>

        {/* Image + metadata */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px', minHeight: 0 }}>
          <div style={{ borderRadius: '8px', overflow: 'hidden', height: '80px', boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.15)' }}>
            <div style={{ width: '100%', height: '100%', background: currentArt.bg }} />
          </div>
          {/* Tweet text */}
          <div style={{ background: '#36393f', borderRadius: '6px', padding: '8px' }}>
            <div style={{ fontSize: '9px', color: '#8e9297' }}>{currentArt.text}</div>
          </div>
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px', flexShrink: 0 }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button onClick={prevSlide} style={{ background: '#4A7C59', border: 'none', borderRadius: '4px', padding: '5px 12px', cursor: 'pointer', color: '#fff', fontSize: '11px' }}>←</button>
            <button onClick={nextSlide} style={{ background: '#4A7C59', border: 'none', borderRadius: '4px', padding: '5px 12px', cursor: 'pointer', color: '#fff', fontSize: '11px' }}>→</button>
          </div>
          <span style={{ color: '#72767d', fontSize: '10px' }}>{currentSlide + 1} / {slides.length}</span>
        </div>
      </div>
    </div>
  );
};

// Interactive mockup for Synth - Discord bot text generation
const SynthMockup = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [completion, setCompletion] = useState("dessert I had in Japan was in Hokkaido. Try the strawberry cream parfait at Nagayama's Rest.");
  const [selectedEngine, setSelectedEngine] = useState(0);

  const engines = ['GPT-3', 'CodeGen', 'FairseqGPT'];
  const prompt = 'The best';

  const completions = [
    "dessert I had in Japan was in Hokkaido. Try the strawberry cream parfait at Nagayama's Rest.",
    'breakfast is a yogurt bowl with granola and fruit.',
    'cat of all time is Ace. Follow him at @gaoacey on Instagram.',
  ];

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setCompletion(completions[Math.floor(Math.random() * completions.length)]);
      setIsGenerating(false);
    }, 800);
  };

  return (
    <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', height: 'calc(100% - 30px)' }}>
      {/* Command input bar */}
      <div style={{ background: '#40444b', borderRadius: '8px', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ color: '#AA96DA', fontSize: '11px', fontWeight: '600' }}>!gen</span>
        <span style={{ color: '#dcddde', fontSize: '11px' }}>{prompt}</span>
      </div>

      {/* Bot response card */}
      <div style={{ marginTop: '12px', background: '#2f3136', borderRadius: '8px', borderLeft: '4px solid #AA96DA', padding: '12px', flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#AA96DA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontSize: '8px', fontWeight: '600' }}>S</span>
          </div>
          <span style={{ color: '#AA96DA', fontSize: '11px', fontWeight: '600' }}>Synth</span>
          <span style={{ background: '#5865F2', color: '#fff', fontSize: '7px', padding: '2px 4px', borderRadius: '3px' }}>BOT</span>
        </div>

        {/* Engine selector */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
          {engines.map((engine, i) => (
            <button
              key={engine}
              onClick={() => setSelectedEngine(i)}
              style={{
                background: selectedEngine === i ? '#AA96DA' : '#40444b',
                color: selectedEngine === i ? '#fff' : '#72767d',
                fontSize: '8px',
                padding: '3px 8px',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {engine}
            </button>
          ))}
        </div>

        {/* Generated text - shows prompt + completion */}
        <div style={{ flex: 1, background: '#36393f', borderRadius: '6px', padding: '10px', minHeight: '50px' }}>
          <p style={{ color: '#dcddde', fontSize: '10px', lineHeight: 1.5, margin: 0 }}>
            <span style={{ color: '#AA96DA' }}>{prompt}</span>{' '}
            {isGenerating ? <span style={{ opacity: 0.5 }}>...</span> : completion}
          </p>
        </div>

        {/* Generate button */}
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          style={{
            marginTop: '10px',
            background: isGenerating ? '#72767d' : '#AA96DA',
            border: 'none',
            borderRadius: '4px',
            padding: '6px 12px',
            cursor: isGenerating ? 'default' : 'pointer',
            color: '#fff',
            fontSize: '10px',
            fontWeight: '500',
            alignSelf: 'flex-start',
            flexShrink: 0,
          }}
        >
          {isGenerating ? 'Generating...' : 'Regenerate'}
        </button>
      </div>
    </div>
  );
};

// Interactive mockup for StockX Guess - mini price guessing game
const StockXGuessMockup = () => {
  const [guess, setGuess] = useState('');
  const [result, setResult] = useState(null);
  const [currentSneaker, setCurrentSneaker] = useState(0);
  const [score, setScore] = useState(0);
  const inputRef = useRef(null);

  const sneakers = [
    { name: 'Jordan 1 Retro', price: 180, bg: '#FFE5E5', accent: '#E8B4B8' },
    { name: 'Yeezy 350 V2', price: 230, bg: '#E5F0FF', accent: '#A8D8EA' },
    { name: 'Nike Dunk Low', price: 110, bg: '#F0E5FF', accent: '#AA96DA' },
  ];

  const handleGuess = () => {
    const guessNum = parseInt(guess);
    const actual = sneakers[currentSneaker].price;
    const diff = Math.abs(guessNum - actual);

    if (diff <= 20) {
      setResult({ correct: true, actual });
      setScore(score + 1);
    } else {
      setResult({ correct: false, actual });
    }

    setTimeout(() => {
      setResult(null);
      setGuess('');
      setCurrentSneaker((currentSneaker + 1) % sneakers.length);
    }, 1500);
  };

  const sneaker = sneakers[currentSneaker];

  return (
    <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', height: 'calc(100% - 30px)' }}>
      <div style={{ fontSize: '9px', color: '#888', textAlign: 'center' }}>Guess the market price! (±$20)</div>

      {/* Sneaker card - centered */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: sneaker.bg, borderRadius: '16px', padding: '30px 40px', textAlign: 'center' }}>
          <div style={{ width: '80px', height: '50px', background: sneaker.accent, borderRadius: '8px', margin: '0 auto 12px', opacity: 0.8 }} />
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#555' }}>{sneaker.name}</div>
        </div>
      </div>

      {result ? (
        <div style={{
          textAlign: 'center',
          padding: '12px',
          background: result.correct ? 'rgba(74,124,89,0.1)' : 'rgba(232,180,184,0.2)',
          borderRadius: '8px',
          flexShrink: 0,
        }}>
          <div style={{ fontSize: '10px', color: result.correct ? '#4A7C59' : '#c0392b', fontWeight: '600' }}>
            {result.correct ? 'Nice!' : 'Not quite!'} Actual: ${result.actual}
          </div>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.focus()}
          style={{ background: '#f5f3ef', borderRadius: '10px', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, cursor: 'text' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1 }}>
            <span style={{ color: '#4A7C59', fontWeight: '600', fontSize: '14px' }}>$</span>
            <input
              ref={inputRef}
              type="number"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleGuess()}
              placeholder="???"
              style={{ width: '100%', border: 'none', background: 'transparent', fontSize: '14px', outline: 'none', fontWeight: '600' }}
            />
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); handleGuess(); }}
            disabled={!guess}
            style={{ background: guess ? '#4A7C59' : '#ccc', border: 'none', borderRadius: '6px', padding: '8px 16px', cursor: guess ? 'pointer' : 'default', color: '#fff', fontSize: '11px', fontWeight: '600', flexShrink: 0 }}
          >
            Guess
          </button>
        </div>
      )}
      <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '9px', color: '#888', flexShrink: 0 }}>
        Score: {score}/{sneakers.length}
      </div>
    </div>
  );
};

// Interactive mockup for CyberCredit - animated dashboard
const CyberCreditMockup = () => {
  const [score, setScore] = useState(785);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [barHeights, setBarHeights] = useState([40, 60, 45, 80, 55]);

  const analyzeWallet = () => {
    setIsAnalyzing(true);

    // Animate score
    let current = 0;
    const target = 650 + Math.floor(Math.random() * 200);
    const interval = setInterval(() => {
      current += 15;
      if (current >= target) {
        setScore(target);
        clearInterval(interval);
        setIsAnalyzing(false);
      } else {
        setScore(current);
      }
    }, 30);

    // Animate bars
    setBarHeights([
      30 + Math.random() * 50,
      30 + Math.random() * 50,
      30 + Math.random() * 50,
      30 + Math.random() * 50,
      30 + Math.random() * 50,
    ]);
  };

  return (
    <>
      <div style={{ marginTop: '40px', display: 'flex', gap: '10px', marginBottom: '10px' }}>
        <div style={{ flex: 1, background: '#f5f3ef', borderRadius: '8px', padding: '10px' }}>
          <div style={{ fontSize: '8px', color: '#888', marginBottom: '4px' }}>Credit Score</div>
          <div style={{
            fontSize: '22px',
            fontWeight: '600',
            color: score >= 750 ? '#4A7C59' : score >= 650 ? '#f39c12' : '#c0392b',
            transition: 'color 0.3s',
          }}>
            {score}
          </div>
        </div>
        <div style={{ flex: 1, background: '#f5f3ef', borderRadius: '8px', padding: '10px' }}>
          <div style={{ fontSize: '8px', color: '#888', marginBottom: '4px' }}>Activity</div>
          <div style={{ display: 'flex', gap: '2px', alignItems: 'flex-end', height: '28px' }}>
            {barHeights.map((h, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  background: '#4A7C59',
                  borderRadius: '2px',
                  height: `${h}%`,
                  opacity: 0.4 + i * 0.12,
                  transition: 'height 0.5s ease',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: '#f5f3ef', borderRadius: '6px', padding: '8px 10px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }} />
        <span style={{ fontSize: '9px', color: '#888', fontFamily: 'monospace' }}>0x7a2...f4e9</span>
      </div>

      <button
        onClick={analyzeWallet}
        disabled={isAnalyzing}
        style={{
          width: '100%',
          background: isAnalyzing ? '#ccc' : '#4A7C59',
          border: 'none',
          borderRadius: '8px',
          padding: '10px',
          color: '#fff',
          fontSize: '10px',
          fontWeight: '600',
          cursor: isAnalyzing ? 'default' : 'pointer',
          marginTop: 'auto',
        }}
      >
        {isAnalyzing ? 'Analyzing...' : 'Analyze New Wallet'}
      </button>
    </>
  );
};

// Stylized mockup illustrations for each project
const ProjectMockup = ({ projectId }) => {
  const mockupStyle = {
    position: 'relative',
    width: '100%',
    maxWidth: '480px',
    aspectRatio: '4/3',
    borderRadius: '20px',
    background: '#fff',
    boxShadow: '0 25px 50px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.04)',
    overflow: 'hidden',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  };

  const contentStyle = {
    position: 'relative',
    zIndex: 1,
    padding: '24px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  };

  const renderMockupContent = () => {
    switch (projectId) {
      case 'image-tagger':
        return <ImageTaggerMockup />;
      case 'tweetfetch':
        return <TweetFetchMockup />;
      case 'synth':
        return <SynthMockup />;
      case 'stockx-guess':
        return <StockXGuessMockup />;
      case 'cybercredit':
        return <CyberCreditMockup />;
      default:
        return null;
    }
  };

  return (
    <div
      style={mockupStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 30px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.04)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 25px 50px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.04)';
      }}
    >
      <div style={contentStyle}>
        {renderMockupContent()}
      </div>
    </div>
  );
};

// Full project card component
const ProjectCard = ({ project, index, onClick }) => {
  const isEven = index % 2 === 0;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: isEven ? 'row' : 'row-reverse',
        gap: '70px',
        alignItems: 'center',
        padding: '50px 0',
      }}
      className="project-card-container"
    >
      {/* Mockup */}
      <div style={{ flex: '0 0 48%' }}>
        <ProjectMockup projectId={project.id} />
      </div>

      {/* Content */}
      <div style={{ flex: '1' }}>
        <button
          onClick={onClick}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            textAlign: 'left',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '14px',
            color: '#8b7355',
            fontSize: '12px',
            fontWeight: '600',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            transition: 'color 0.2s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#6b5a45'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#8b7355'}
        >
          LEARN MORE <ArrowUpRight size={12} />
        </button>

        <h3 style={{
          fontFamily: 'Georgia, serif',
          fontSize: 'clamp(1.85rem, 3vw, 2.5rem)',
          color: '#2d2d2d',
          marginBottom: '10px',
          fontWeight: '400',
          lineHeight: 1.2,
        }}>
          {project.title}
        </h3>

        <p style={{
          color: '#8b7355',
          fontSize: '14px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#8b7355', opacity: 0.5 }} />
          {project.category} · {project.type}
        </p>

        <p style={{
          color: '#555',
          fontSize: '16px',
          lineHeight: 1.8,
          marginBottom: '24px',
        }}>
          {project.desc}
        </p>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {project.tech.map(t => (
            <span
              key={t}
              style={{
                fontSize: '13px',
                padding: '8px 16px',
                borderRadius: '20px',
                background: '#fff',
                color: '#666',
                border: '1px solid #e8e4df',
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const HikingTrail = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [showSimpleView, setShowSimpleView] = useState(false);

  const stops = [
    {
      id: 'wellesley', year: 'Childhood', title: 'Wellesley, MA', modalContent: { title: 'Wellesley, MA', bullets: ['My hometown.'] }, milestones: [
        { label: "Truly's", desc: '2018 - 2021', icon: IceCream, modalContent: { title: "Truly's Ice Cream", role: 'Team Member', date: '2018 - 2021', location: 'Wellesley, MA', bullets: ['First job experience in customer service', 'Learned teamwork and responsibility'] } },
        { label: 'Code Ninjas', desc: '2020 - 2021', icon: Code, modalContent: { title: 'Code Ninjas', role: 'Instructor', date: 'August 2020 - June 2021', location: 'Wellesley, MA', bullets: ['Taught coding in Scratch and JavaScript to groups of up to 10 students per session', 'Created and held custom designed curricula for weekly summer coding camps', 'Facilitated mock hackathons for students, guiding them through the creation of their own games'] } },
      ]
    },
    {
      id: 'uci', year: '2021 - 2025', title: 'UC Irvine', desc: 'B.A. Business Admin & B.S. Computer Science', modalContent: { title: 'University of California, Irvine', subtitle: 'B.A. in Business Administration • B.S. in Computer Science', date: 'September 2021 - March 2025', location: 'Irvine, CA', bullets: ['Concentration in Finance for Business Administration', 'Concentration in Systems & Software for Computer Science'] }, milestones: [
        { label: 'Blockchain @ UCI', desc: 'President', icon: Coins, modalContent: { title: 'Blockchain @ UCI Club', role: 'President', date: 'December 2021 - March 2025', location: 'Irvine, CA', bullets: ['Managed club event logistics, including booking rooms and flights, ordering supplies, and leading discussions', 'Integrated automated emailing software to distribute announcements and track metrics', 'Led communications for multiple partnerships, securing over $40,000 in club funding'] } },
        { label: 'Deloitte Consulting Intern', desc: 'Summer 2024', icon: Briefcase, modalContent: { title: 'Deloitte Consulting', role: 'Summer Scholar', date: 'June 2024 - August 2024', location: 'Costa Mesa, CA', bullets: ['Summer Scholar for Deloitte Consulting'] } },
      ]
    },
    { id: 'alpher', year: '2023 - 2024', title: 'Alpher LLC', desc: 'Founder', modalContent: { title: 'Alpher LLC', subtitle: 'Founder', date: 'February 2023 - 2024', location: 'Remote', bullets: ['Founded a ticket brokering venture delivering high-demand event tickets to 400+ international customers', 'Generated 7 figures in revenue during year one', 'Recruited and mentored a team of 7', 'Leveraged sales data to optimize pricing and event selection'] }, milestones: [] },
    { id: 'deloitte', year: '2025 -', title: 'Deloitte Consulting', desc: 'Analyst', modalContent: { title: 'Deloitte Consulting', subtitle: 'Analyst', date: 'October 2025 - Present', location: 'Costa Mesa, CA', bullets: ['Deloitte Digital Analyst'] }, milestones: [] },
  ];

  const trees = [
    { x: 320, y: 45, s: 0.95 }, { x: 400, y: 25, s: 1.0 }, { x: 480, y: 40, s: 1.15 },
    { x: 280, y: 75, s: 1.0 }, { x: 360, y: 60, s: 0.85 }, { x: 440, y: 80, s: 1.1 }, { x: 520, y: 65, s: 1.0 },
    { x: 260, y: 120, s: 0.9 }, { x: 330, y: 110, s: 1.15 }, { x: 410, y: 125, s: 0.95 }, { x: 490, y: 115, s: 1.0 }, { x: 560, y: 130, s: 1.1 },
    { x: 290, y: 165, s: 1.05 }, { x: 370, y: 155, s: 0.9 }, { x: 445, y: 170, s: 1.0 }, { x: 520, y: 160, s: 0.85 },
    { x: 275, y: 210, s: 0.95 }, { x: 350, y: 200, s: 1.1 }, { x: 430, y: 220, s: 0.9 }, { x: 505, y: 205, s: 1.05 }, { x: 570, y: 215, s: 0.95 },
    { x: 310, y: 255, s: 1.0 }, { x: 390, y: 245, s: 0.85 }, { x: 465, y: 260, s: 1.1 }, { x: 540, y: 250, s: 0.9 },
    { x: 340, y: 295, s: 0.95 }, { x: 420, y: 305, s: 1.0 }, { x: 495, y: 295, s: 1.15 },
  ];

  const ResumeModal = ({ item, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      requestAnimationFrame(() => setIsVisible(true));
    }, []);

    const handleClose = () => {
      setIsVisible(false);
      setTimeout(onClose, 200);
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: isVisible ? 'rgba(35,35,30,0.6)' : 'rgba(35,35,30,0)', transition: 'background-color 0.3s ease' }} onClick={handleClose}>
        <div className="w-full max-w-lg rounded-2xl relative overflow-hidden" style={{ backgroundColor: '#faf9f6', maxHeight: '80vh', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', transform: isVisible ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(10px)', opacity: isVisible ? 1 : 0, transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease' }} onClick={e => e.stopPropagation()}>
          <div className="px-6 pt-6 pb-5" style={{ background: 'linear-gradient(180deg, #f0ede8 0%, #faf9f6 100%)' }}>
            <button onClick={handleClose} className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.05)' }}>
              <X size={16} style={{ color: '#666' }} />
            </button>
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.5rem', color: '#2d2d2d', marginBottom: '0.25rem' }}>{item.title}</h3>
            {item.role && <p className="font-medium" style={{ color: '#4A7C59' }}>{item.role}</p>}
            {item.subtitle && <p className="text-sm" style={{ color: '#4A7C59' }}>{item.subtitle}</p>}
            <div className="flex flex-wrap gap-3 mt-2 text-sm" style={{ color: '#777' }}>
              {item.date && <span>{item.date}</span>}
              {item.location && <span>• {item.location}</span>}
            </div>
          </div>
          {item.bullets && <div className="mx-6" style={{ height: '1px', background: 'linear-gradient(90deg, transparent, #e0dcd6, transparent)' }} />}
          {item.bullets && (
            <div className="px-6 py-5 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 180px)' }}>
              <ul className="space-y-3">{item.bullets.map((b, i) => <li key={i} className="text-sm flex gap-3" style={{ color: '#555', lineHeight: 1.7 }}><span style={{ color: '#4A7C59', fontWeight: 600 }}>•</span><span>{b}</span></li>)}</ul>
            </div>
          )}
        </div>
      </div>
    );
  };

  const StopCard = ({ stop, side }) => (
    <div className="flex flex-col" style={{ alignItems: side === 'left' ? 'flex-start' : 'flex-end' }}>
      <div className="p-5 rounded-2xl cursor-pointer transition-all duration-200 hover:-translate-y-1" style={{ backgroundColor: '#fff', boxShadow: '0 4px 15px rgba(0,0,0,0.06)', border: '1px solid #e8e4df', minWidth: '260px' }} onClick={() => setSelectedItem(stop.modalContent)} onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.12)'} onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.06)'}>
        <p className="text-sm font-bold tracking-wide" style={{ color: '#4A7C59' }}>{stop.year}</p>
        <p className="text-2xl font-medium mt-1" style={{ color: '#2d2d2d', fontFamily: 'Georgia, serif' }}>{stop.title}</p>
        {stop.desc && <p className="text-sm mt-1" style={{ color: '#777' }}>{stop.desc}</p>}
      </div>
      {stop.milestones.length > 0 && (
        <div className="flex flex-col gap-3 mt-3" style={{ alignItems: side === 'left' ? 'flex-start' : 'flex-end', paddingLeft: side === 'left' ? '20px' : '0', paddingRight: side === 'right' ? '20px' : '0' }}>
          {stop.milestones.map((m, i) => (
            <div key={i} className="flex flex-col" style={{ alignItems: side === 'left' ? 'flex-start' : 'flex-end' }}>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white cursor-pointer transition-all duration-200 hover:-translate-y-1" style={{ border: '1px solid #e8e4df', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }} onClick={() => setSelectedItem(m.modalContent)} onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 6px 15px rgba(0,0,0,0.1)'} onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#4A7C59' }}><m.icon size={16} style={{ color: '#fff' }} /></div>
                <div><p className="text-sm font-semibold" style={{ color: '#2d2d2d' }}>{m.label}</p><p className="text-xs" style={{ color: '#888' }}>{m.desc}</p></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="relative py-6 overflow-hidden">
      {/* MOBILE LAYOUT */}
      <div className="md:hidden px-4">
        <div className="flex">
          <div className="flex flex-col items-center mr-4"><div style={{ width: '3px', backgroundColor: '#c9b896', borderRadius: '2px', flex: 1, minHeight: '100%' }} /></div>
          <div className="flex flex-col gap-6 flex-1 pb-4">
            {stops.map((stop) => (
              <div key={stop.id} className="relative">
                <div className="absolute -left-7 top-4 w-5 h-5 rounded-full bg-white" style={{ borderWidth: '3px', borderStyle: 'solid', borderColor: '#4A7C59' }} />
                <div className="p-4 rounded-xl cursor-pointer bg-white" style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.06)', border: '1px solid #e8e4df' }} onClick={() => setSelectedItem(stop.modalContent)}>
                  <p className="text-xs font-bold tracking-wide" style={{ color: '#4A7C59' }}>{stop.year}</p>
                  <p className="text-lg font-medium mt-0.5" style={{ color: '#2d2d2d', fontFamily: 'Georgia, serif' }}>{stop.title}</p>
                  {stop.desc && <p className="text-xs mt-0.5" style={{ color: '#777' }}>{stop.desc}</p>}
                </div>
                {stop.milestones.length > 0 && (
                  <div className="ml-4 mt-2 flex flex-col gap-2">
                    {stop.milestones.map((m, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-white cursor-pointer" style={{ border: '1px solid #e8e4df' }} onClick={() => setSelectedItem(m.modalContent)}>
                        <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ backgroundColor: '#4A7C59' }}><m.icon size={12} style={{ color: '#fff' }} /></div>
                        <div><p className="text-xs font-semibold" style={{ color: '#2d2d2d' }}>{m.label}</p><p className="text-xs" style={{ color: '#888' }}>{m.desc}</p></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DESKTOP LAYOUT */}
      <div className="hidden md:block">
        {/* Toggle button */}
        <div className="flex justify-end mb-4 mr-4">
          <button onClick={() => setShowSimpleView(!showSimpleView)} className="flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all duration-200" style={{ backgroundColor: showSimpleView ? '#4A7C59' : '#fff', color: showSimpleView ? '#fff' : '#555', border: '1px solid #e8e4df', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', opacity: 0.6 }}>
            {showSimpleView ? 'Show Trail View' : 'Show Simple View'}
          </button>
        </div>

        {showSimpleView ? (
          <div className="max-w-2xl mx-auto">
            <div className="flex">
              <div className="flex flex-col items-center mr-6">
                <div style={{ width: '3px', backgroundColor: '#c9b896', borderRadius: '2px', flex: 1, minHeight: '100%' }} />
              </div>
              <div className="flex flex-col gap-6 flex-1 pb-4">
                {stops.map((stop) => (
                  <div key={stop.id} className="relative">
                    <div className="absolute -left-9 top-5 w-5 h-5 rounded-full bg-white" style={{ borderWidth: '3px', borderStyle: 'solid', borderColor: '#4A7C59' }} />
                    <div className="p-5 rounded-xl cursor-pointer bg-white transition-all duration-200 hover:-translate-y-1" style={{ boxShadow: '0 4px 15px rgba(0,0,0,0.06)', border: '1px solid #e8e4df' }} onClick={() => setSelectedItem(stop.modalContent)} onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.12)'} onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.06)'}>
                      <p className="text-sm font-bold tracking-wide" style={{ color: '#4A7C59' }}>{stop.year}</p>
                      <p className="text-xl font-medium mt-0.5" style={{ color: '#2d2d2d', fontFamily: 'Georgia, serif' }}>{stop.title}</p>
                      {stop.desc && <p className="text-sm mt-0.5" style={{ color: '#777' }}>{stop.desc}</p>}
                    </div>
                    {stop.milestones.length > 0 && (
                      <div className="ml-6 mt-3 flex flex-col gap-2">
                        {stop.milestones.map((m, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white cursor-pointer transition-all duration-200 hover:-translate-y-1" style={{ border: '1px solid #e8e4df', boxShadow: '0 4px 15px rgba(0,0,0,0.06)' }} onClick={() => setSelectedItem(m.modalContent)} onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.12)'} onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.06)'}>
                            <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ backgroundColor: '#4A7C59' }}><m.icon size={14} style={{ color: '#fff' }} /></div>
                            <div><p className="text-sm font-semibold" style={{ color: '#2d2d2d' }}>{m.label}</p><p className="text-xs" style={{ color: '#888' }}>{m.desc}</p></div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="relative" style={{ minHeight: '920px' }}>
            <svg className="absolute top-0 right-0" width="620" height="350" viewBox="0 0 620 350" fill="none" style={{ pointerEvents: 'none' }}>
              {trees.map((t, i) => (<g key={i}><polygon points={`${t.x},${t.y - 20 * t.s} ${t.x - 12 * t.s},${t.y + 10 * t.s} ${t.x + 12 * t.s},${t.y + 10 * t.s}`} fill="#4A7C59" opacity={0.1 + (i % 5) * 0.03} /><polygon points={`${t.x},${t.y - 10 * t.s} ${t.x - 8 * t.s},${t.y + 6 * t.s} ${t.x + 8 * t.s},${t.y + 6 * t.s}`} fill="#3d6b4a" opacity={0.15 + (i % 4) * 0.04} /><rect x={t.x - 2} y={t.y + 8 * t.s} width="4" height={6 * t.s} fill="#8b7355" opacity="0.2" /></g>))}
            </svg>
            <svg className="absolute right-4" style={{ top: '620px', pointerEvents: 'none' }} width="420" height="240" viewBox="0 0 420 240" fill="none">
              <path d="M45 90 Q90 37 195 52 Q315 67 367 120 Q397 172 300 202 Q180 232 75 187 Q22 157 45 90" fill="#a8d4e6" opacity="0.4" />
              <path d="M75 97 Q120 60 202 72 Q292 87 330 132 Q352 172 270 195 Q165 217 90 172 Q52 147 75 97" fill="#c5e4f0" opacity="0.3" />
            </svg>
            <svg className="absolute left-0 bottom-0" width="200" height="200" viewBox="0 0 200 200" fill="none" style={{ pointerEvents: 'none' }}>
              <g><polygon points="40,60 28,90 52,90" fill="#4A7C59" opacity="0.12" /><polygon points="40,72 32,88 48,88" fill="#3d6b4a" opacity="0.16" /><rect x="38" y="88" width="4" height="8" fill="#8b7355" opacity="0.2" /></g>
              <g><polygon points="80,45 68,75 92,75" fill="#4A7C59" opacity="0.14" /><polygon points="80,57 72,73 88,73" fill="#3d6b4a" opacity="0.18" /><rect x="78" y="73" width="4" height="8" fill="#8b7355" opacity="0.2" /></g>
              <g><polygon points="55,95 43,125 67,125" fill="#4A7C59" opacity="0.13" /><polygon points="55,107 47,123 63,123" fill="#3d6b4a" opacity="0.17" /><rect x="53" y="123" width="4" height="8" fill="#8b7355" opacity="0.2" /></g>
              <g><polygon points="25,130 13,160 37,160" fill="#4A7C59" opacity="0.12" /><polygon points="25,142 17,158 33,158" fill="#3d6b4a" opacity="0.16" /><rect x="23" y="158" width="4" height="8" fill="#8b7355" opacity="0.2" /></g>
            </svg>
            <div className="absolute left-1/2 transform -translate-x-1/2" style={{ width: '200px' }}>
              <svg width="200" height="920" viewBox="0 0 200 920" fill="none">
                <path d="M100 60 C100 100 130 130 130 180 C130 250 155 290 125 360 C85 450 55 480 55 540 C55 600 50 650 80 720 C110 790 105 830 100 870" stroke="#c9b896" strokeWidth="50" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.5" />
                <path d="M100 60 C100 100 130 130 130 180 C130 250 155 290 125 360 C85 450 55 480 55 540 C55 600 50 650 80 720 C110 790 105 830 100 870" stroke="#ddd0b8" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.35" />
                <line x1="128" y1="160" x2="-150" y2="160" stroke="rgba(255,255,255,0.9)" strokeWidth="4" strokeLinecap="round" />
                <line x1="140" y1="320" x2="350" y2="320" stroke="rgba(255,255,255,0.9)" strokeWidth="4" strokeLinecap="round" />
                <line x1="55" y1="560" x2="-150" y2="560" stroke="rgba(255,255,255,0.9)" strokeWidth="4" strokeLinecap="round" />
                <line x1="95" y1="820" x2="350" y2="820" stroke="rgba(255,255,255,0.9)" strokeWidth="4" strokeLinecap="round" />
                <circle cx="128" cy="160" r="14" fill="#fff" stroke="#4A7C59" strokeWidth="4" />
                <circle cx="140" cy="320" r="14" fill="#fff" stroke="#4A7C59" strokeWidth="4" />
                <circle cx="55" cy="560" r="14" fill="#fff" stroke="#4A7C59" strokeWidth="4" />
                <circle cx="95" cy="820" r="14" fill="#fff" stroke="#4A7C59" strokeWidth="4" />
              </svg>
            </div>
            <div className="absolute right-1/2 pr-28" style={{ top: '100px' }}><StopCard stop={stops[0]} side="left" /></div>
            <div className="absolute right-1/2 pr-28" style={{ top: '500px' }}><StopCard stop={stops[2]} side="left" /></div>
            <div className="absolute left-1/2 pl-28" style={{ top: '260px' }}><StopCard stop={stops[1]} side="right" /></div>
            <div className="absolute left-1/2 pl-28" style={{ top: '760px' }}><StopCard stop={stops[3]} side="right" /></div>
          </div>
        )}
      </div>


      {selectedItem && <ResumeModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
    </div>
  );
};

import { Analytics } from "@vercel/analytics/react"

export default function Site() {
  const [selectedProject, setSelectedProject] = useState(null);
  return (
    <div style={{ backgroundColor: '#faf9f6', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', scrollBehavior: 'smooth' }}>
      <Analytics />
      <style>{`
        html { scroll-behavior: smooth; }

        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-5deg); }
          75% { transform: rotate(5deg); }
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .social-icon {
          transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .social-icon:hover {
          animation: wiggle 0.5s ease-in-out;
        }

        .typing-dots {
          animation: pulse 1s ease-in-out infinite;
        }

        /* Remove number input spinners */
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
      <div id="about" className="relative overflow-hidden" style={{ minHeight: '100vh' }}>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #faf9f6 0%, #f5f1eb 50%, #f0ebe5 100%)' }} />

        <div className="absolute bottom-0 left-0 right-0 h-24" style={{ background: 'linear-gradient(to bottom, transparent, #f5f3ef)' }} />
        <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-4 md:px-10 py-4">
          <span className="px-3 md:px-4 py-2 rounded-full flex items-center gap-2" style={{ fontFamily: 'Georgia, serif', fontSize: '1.2rem', color: '#2d2d2d', backgroundColor: 'rgba(250,249,246,0.85)', border: '1px solid rgba(139,115,85,0.15)', backdropFilter: 'blur(8px)' }}>
            <img src="/favicon.png" alt="Whale" style={{ width: '24px', height: '24px' }} />
            <span className="hidden sm:inline">Ethan Gao</span>
          </span>
          <div className="flex items-center gap-1 md:gap-3 px-3 md:px-4 py-2 rounded-full" style={{ backgroundColor: 'rgba(250,249,246,0.85)', border: '1px solid rgba(139,115,85,0.15)', backdropFilter: 'blur(8px)' }}>
            {[{ label: 'Experience', href: '#experience' }, { label: 'Projects', href: '#projects' }, { label: 'Interests', href: '#interests' }, { label: 'Contact', href: '#contact' }].map((link) => (
              <a key={link.label} href={link.href} className="text-xs md:text-sm font-medium transition-all duration-200 px-2 md:px-3 py-1 hover:scale-110" style={{ color: '#555' }}>{link.label}</a>
            ))}
          </div>
        </nav>
        <section className="relative px-6 md:px-10 flex flex-col justify-center w-full" style={{ maxWidth: '1200px', margin: '0 auto', minHeight: 'calc(100vh - 80px)', paddingTop: '80px' }}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6" style={{ backgroundColor: 'rgba(74,124,89,0.15)', border: '1px solid rgba(74,124,89,0.25)' }}>
                <MapPin size={12} style={{ color: '#3d6b4a' }} /><span className="text-sm font-medium" style={{ color: '#3d6b4a' }}>Costa Mesa, CA</span>
              </div>
              <h1 className="mb-6" style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', lineHeight: 1.15, color: '#2d2d2d', fontWeight: 400 }}>Hey, I'm <span style={{ color: '#3d6b4a' }}>Ethan Gao</span></h1>
              <p className="leading-relaxed mb-4" style={{ color: '#444', fontSize: 'clamp(1.05rem, 2vw, 1.15rem)', lineHeight: 1.85 }}>I'm an Analyst at <strong>Deloitte</strong> in Costa Mesa, working within Deloitte Digital. I recently graduated from <strong>UC Irvine</strong> with degrees in Computer Science and Business Administration.</p>
              <p className="leading-relaxed mb-8" style={{ color: '#666', fontSize: 'clamp(0.95rem, 1.5vw, 1.05rem)', lineHeight: 1.85 }}>I also make travel videos and build side projects.</p>
              <div className="flex items-center gap-5">
                <a href="https://linkedin.com/in/gaoe" target="_blank" rel="noopener noreferrer" className="social-icon transition-all duration-200 hover:scale-110 hover:text-blue-600" style={{ color: '#666' }} title="LinkedIn"><Linkedin size={20} /></a>
                <a href="https://github.com/gaoe03" target="_blank" rel="noopener noreferrer" className="social-icon transition-all duration-200 hover:scale-110" style={{ color: '#666' }} title="GitHub"><Github size={20} /></a>
                <a href="https://youtube.com/@gaofiles" target="_blank" rel="noopener noreferrer" className="social-icon transition-all duration-200 hover:scale-110 hover:text-red-600" style={{ color: '#666' }} title="YouTube"><Youtube size={20} /></a>
                <a href="mailto:one@ethangao.xyz" className="social-icon transition-all duration-200 hover:scale-110" style={{ color: '#666' }} title="Email"><Mail size={20} /></a>
              </div>
            </div>
          </div>
          <button onClick={() => document.getElementById('experience').scrollIntoView({ behavior: 'smooth' })} className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
            <span className="text-xs" style={{ color: '#888' }}>Scroll</span>
            <div className="w-10 h-10 rounded-full border-2 flex items-center justify-center" style={{ borderColor: '#aaa' }}>
              <ChevronDown size={20} style={{ color: '#888' }} />
            </div>
          </button>
        </section>
      </div>

      <section id="experience" className="px-4 py-10" style={{ backgroundColor: '#f5f3ef' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div className="text-center mb-2"><h2 style={{ fontFamily: 'Georgia, serif', fontSize: '2.25rem', color: '#2d2d2d', fontWeight: 400 }}>Where I've Been</h2></div>
          <p className="text-center text-sm mb-6" style={{ color: '#888' }}>Click on a card for more info</p>
          <HikingTrail />
        </div>
      </section>

      <section id="projects" className="relative px-6 py-16">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(74,124,89,0.08) 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <div className="relative" style={{ maxWidth: '1100px', margin: '0 auto' }}>
          {/* Section header with mixed typography */}
          <div className="mb-12">
            <span style={{ color: '#8b7355', fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '8px' }}>(03)</span>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem, 4vw, 2.75rem)', color: '#2d2d2d', fontWeight: 400 }}>
              <span style={{ fontStyle: 'italic' }}>Recent</span> Projects
            </h2>
            <div style={{ width: '60px', height: '3px', background: 'linear-gradient(90deg, #8b7355, transparent)', marginTop: '12px', borderRadius: '2px' }} />
          </div>

          {/* Desktop: Alternating full-width cards */}
          <div className="hidden md:block">
            {projects.map((proj, i) => (
              <ProjectCard key={proj.id} project={proj} index={i} onClick={() => setSelectedProject(proj)} />
            ))}
          </div>

          {/* Mobile: Simplified cards */}
          <div className="md:hidden flex flex-col gap-6">
            {projects.map((proj, i) => (
              <div key={proj.id} className="rounded-xl overflow-hidden cursor-pointer" style={{ backgroundColor: '#fff', border: '1px solid #e8e4df', boxShadow: '0 4px 15px rgba(0,0,0,0.06)' }} onClick={() => setSelectedProject(proj)}>
                {/* Mobile mockup preview */}
                <div style={{ padding: '20px', background: '#faf9f6', display: 'flex', justifyContent: 'flex-end' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: '#4A7C59', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <proj.icon size={24} style={{ color: '#fff' }} />
                  </div>
                </div>
                {/* Content */}
                <div style={{ padding: '20px' }}>
                  <span style={{ color: '#8b7355', fontSize: '11px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                    LEARN MORE <ArrowUpRight size={10} />
                  </span>
                  <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.35rem', color: '#2d2d2d', marginBottom: '4px', fontWeight: '400' }}>{proj.title}</h3>
                  <p style={{ color: '#8b7355', fontSize: '12px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#8b7355', opacity: 0.5 }} />
                    {proj.category} · {proj.type}
                  </p>
                  <p style={{ color: '#666', fontSize: '14px', lineHeight: 1.6, marginBottom: '16px' }}>{proj.desc}</p>
                  {/* Tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {proj.tech.slice(0, 3).map(t => (
                      <span key={t} style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '12px', background: '#f5f3ef', color: '#777' }}>{t}</span>
                    ))}
                    {proj.tech.length > 3 && <span style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '12px', background: '#f5f3ef', color: '#777' }}>+{proj.tech.length - 3}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}

      {/* Technical Skills Section */}
      <section className="px-6 py-14" style={{ backgroundColor: '#f5f3ef' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 className="mb-8" style={{ fontFamily: 'Georgia, serif', fontSize: '2.25rem', color: '#2d2d2d', fontWeight: 400 }}>Technical Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(skills).map(([key, category]) => (
              <div key={key} className="p-5 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.6)', border: '1px solid #e8e4df', boxShadow: '0 4px 15px rgba(0,0,0,0.06)' }}>
                <h3 className="text-sm font-semibold mb-3" style={{ color: '#4A7C59' }}>{category.title}</h3>
                <p className="text-base leading-relaxed" style={{ color: '#555' }}>{category.items.join('  •  ')}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* YouTube Section */}
      <section id="interests" className="relative px-6 py-16">
        <div className="relative" style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
            <div>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '2.25rem', color: '#2d2d2d', fontWeight: 400 }}>gao life</h2>
            </div>
            <a href="https://youtube.com/@gaofiles" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all duration-200 hover:scale-105" style={{ backgroundColor: '#2d2d2d', color: '#fff' }}><Youtube size={14} />@gaofiles<ExternalLink size={12} /></a>
          </div>
          <p className="mb-8 max-w-2xl" style={{ color: '#666', lineHeight: 1.7 }}>I like traveling and making videos about it. Mostly Asia so far.</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {videos.map((vid, i) => (
              <div key={i} className="group">
                {vid.comingSoon ? (
                  <div className="rounded-xl overflow-hidden relative flex items-center justify-center" style={{ aspectRatio: '16/9', boxShadow: '0 4px 15px rgba(0,0,0,0.08)', background: vid.gradient }}>
                    <p className="text-4xl font-light" style={{ color: 'rgba(255,255,255,0.4)' }}>...</p>
                  </div>
                ) : (
                  <a href={vid.url} target="_blank" rel="noopener noreferrer" className="block rounded-xl overflow-hidden relative transition-transform duration-200 hover:scale-105" style={{ aspectRatio: '16/9', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' }}>
                    {vid.thumbnail ? (
                      <img src={vid.thumbnail} alt={vid.title} className="w-full h-full object-cover" style={{ objectPosition: 'center' }} />
                    ) : (
                      <div className="w-full h-full" style={{ background: vid.gradient }} />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.95)' }}>
                        <Play size={20} style={{ color: '#2d2d2d', marginLeft: '2px' }} fill="#2d2d2d" />
                      </div>
                    </div>
                  </a>
                )}
                <div className="mt-3">
                  <p className="text-xs font-medium mb-0.5" style={{ color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px' }}>gao life {vid.num}</p>
                  <p className="font-medium text-base" style={{ fontFamily: 'Georgia, serif', color: '#2d2d2d' }}>{vid.title}</p>
                  {vid.subtitle && !vid.comingSoon && !vid.thumbnail && <p className="text-xs mt-1" style={{ color: '#666' }}>{vid.subtitle}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="px-6 py-16" style={{ backgroundColor: '#f5f3ef' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 className="mb-8 text-center" style={{ fontFamily: 'Georgia, serif', fontSize: '2.25rem', color: '#2d2d2d', fontWeight: 400 }}>Get In Touch</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <a href="https://linkedin.com/in/gaoe" target="_blank" rel="noopener noreferrer" className="group p-6 rounded-xl transition-all duration-200 hover:-translate-y-1" style={{ backgroundColor: '#fff', border: '1px solid #e8e4df', boxShadow: '0 4px 15px rgba(0,0,0,0.06)', textDecoration: 'none' }} onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.12)'} onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.06)'}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-colors duration-200 group-hover:bg-blue-600" style={{ backgroundColor: 'rgba(14,118,168,0.1)' }}>
                <Linkedin size={24} className="transition-colors duration-200 group-hover:text-white" style={{ color: '#0e76a8' }} />
              </div>
              <h3 className="text-base font-semibold mb-1" style={{ color: '#2d2d2d' }}>LinkedIn</h3>
              <p className="text-sm" style={{ color: '#888' }}>Professional network</p>
            </a>
            <a href="https://github.com/gaoe03" target="_blank" rel="noopener noreferrer" className="group p-6 rounded-xl transition-all duration-200 hover:-translate-y-1" style={{ backgroundColor: '#fff', border: '1px solid #e8e4df', boxShadow: '0 4px 15px rgba(0,0,0,0.06)', textDecoration: 'none' }} onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.12)'} onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.06)'}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-colors duration-200 group-hover:bg-gray-800" style={{ backgroundColor: 'rgba(36,41,47,0.1)' }}>
                <Github size={24} className="transition-colors duration-200 group-hover:text-white" style={{ color: '#24292f' }} />
              </div>
              <h3 className="text-base font-semibold mb-1" style={{ color: '#2d2d2d' }}>GitHub</h3>
              <p className="text-sm" style={{ color: '#888' }}>Code & projects</p>
            </a>
            <a href="https://youtube.com/@gaofiles" target="_blank" rel="noopener noreferrer" className="group p-6 rounded-xl transition-all duration-200 hover:-translate-y-1" style={{ backgroundColor: '#fff', border: '1px solid #e8e4df', boxShadow: '0 4px 15px rgba(0,0,0,0.06)', textDecoration: 'none' }} onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.12)'} onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.06)'}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-colors duration-200 group-hover:bg-red-600" style={{ backgroundColor: 'rgba(255,0,0,0.1)' }}>
                <Youtube size={24} className="transition-colors duration-200 group-hover:text-white" style={{ color: '#FF0000' }} />
              </div>
              <h3 className="text-base font-semibold mb-1" style={{ color: '#2d2d2d' }}>YouTube</h3>
              <p className="text-sm" style={{ color: '#888' }}>Travel videos</p>
            </a>
            <a href="mailto:one@ethangao.xyz" className="group p-6 rounded-xl transition-all duration-200 hover:-translate-y-1" style={{ backgroundColor: '#fff', border: '1px solid #e8e4df', boxShadow: '0 4px 15px rgba(0,0,0,0.06)', textDecoration: 'none' }} onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.12)'} onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.06)'}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-colors duration-200 group-hover:bg-green-700" style={{ backgroundColor: 'rgba(74,124,89,0.1)' }}>
                <Mail size={24} className="transition-colors duration-200 group-hover:text-white" style={{ color: '#4A7C59' }} />
              </div>
              <h3 className="text-base font-semibold mb-1" style={{ color: '#2d2d2d' }}>Email</h3>
              <p className="text-sm" style={{ color: '#888' }}>one@ethangao.xyz</p>
            </a>
          </div>
        </div>
      </section>

      <footer className="px-6 py-8" style={{ borderTop: '1px solid #e8e4df' }}>
        <div className="text-center" style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p className="text-sm" style={{ color: '#999' }}>Built by Ethan Gao with React, Vite & Tailwind CSS</p>
        </div>
      </footer>
    </div>
  );
}
