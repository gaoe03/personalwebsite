import { useState, useEffect, useRef } from 'react';
import { Briefcase, GraduationCap, Github, Youtube, Mail, Camera, Code, Globe, Ticket, ArrowUpRight, Image, X, ChevronRight, Play, ExternalLink, IceCream, Coins, Linkedin, ChevronDown } from 'lucide-react';
import usePageTitle from './usePageTitle.js';
import posts from './posts/index.js';
import { Cover, BlogWobbleDefs } from './blogArt.jsx';

// === TYPING ANIMATION HOOK ===
const useTypingEffect = (text, speed = 80, delay = 500) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let timeout;
    const startTyping = () => {
      let i = 0;
      const type = () => {
        if (i < text.length) {
          setDisplayedText(text.slice(0, i + 1));
          i++;
          timeout = setTimeout(type, speed);
        } else {
          setIsComplete(true);
        }
      };
      timeout = setTimeout(type, delay);
    };

    startTyping();
    return () => clearTimeout(timeout);
  }, [text, speed, delay]);

  return { displayedText, isComplete };
};

// === WOBBLE SYSTEM ===
// Three speeds mapped to physical weight:
// alive (170ms) trees/leaves, calm (600ms) drawn lines, slow (1300ms) frames/structure
const WOBBLE_SPEED_MS = { alive: 170, calm: 600, slow: 1300 };

const WobbleDefs = () => (
  <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
    <defs>
      {[
        { id: 'wobble-alive', speed: 'alive', baseFrequency: '0.012 0.009', scale: 6.5, seed: 13 },
        { id: 'wobble-calm', speed: 'calm', baseFrequency: '0.02 0.016', scale: 2.2, seed: 29 },
        { id: 'wobble-slow', speed: 'slow', baseFrequency: '0.012 0.01', scale: 2.2, seed: 89 },
      ].map(f => (
        <filter key={f.id} id={f.id} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            data-wobble={f.speed}
            data-seeds={`${f.seed},${f.seed + 100},${f.seed + 200}`}
            type="turbulence"
            baseFrequency={f.baseFrequency}
            numOctaves="2"
            seed={f.seed}
            result="warp"
          />
          <feDisplacementMap in="SourceGraphic" in2="warp" scale={f.scale} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      ))}
    </defs>
  </svg>
);

export const useWobbleLoop = (rootRef) => {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const frames = { alive: 0, calm: 0, slow: 0 };
    const last = { alive: 0, calm: 0, slow: 0 };
    let raf;

    const tick = (time) => {
      for (const speed of Object.keys(WOBBLE_SPEED_MS)) {
        if (time - last[speed] >= WOBBLE_SPEED_MS[speed]) {
          last[speed] = time;
          frames[speed] = (frames[speed] + 1) % 3;
          rootRef.current?.querySelectorAll(`[data-wobble="${speed}"]`).forEach((node) => {
            node.setAttribute('seed', node.dataset.seeds.split(',')[frames[speed]]);
          });
        }
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [rootRef]);
};

// Hand-drawn underline, calm tier
const WobblyUnderline = ({ color = '#4A7C59', height = 9, strokeWidth = 2.4, style }) => (
  <svg viewBox="0 0 200 12" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height, overflow: 'visible', ...style }} aria-hidden="true">
    <path d="M4 7 Q 50 3 100 6 T 196 5" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" filter="url(#wobble-calm)" />
  </svg>
);

// Sketched frame border, slow tier — drawn inside the parent, which must be position: relative
const WobblyFrameBorder = ({ stroke = '#9a9d98', strokeWidth = 1.5, radius = 12 }) => (
  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible', pointerEvents: 'none', zIndex: 2 }} aria-hidden="true">
    <rect x="2.5" y="2.5" width="calc(100% - 5px)" height="calc(100% - 5px)" rx={radius} fill="none" stroke={stroke} strokeWidth={strokeWidth} filter="url(#wobble-slow)" />
  </svg>
);

// Hand-drawn, slightly wobbling project icons (white line art on the accent tile)
const ProjIcon = ({ size = 20, style, paths }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true"
    style={{ ...style, fill: 'none', stroke: 'currentColor', strokeWidth: 4, strokeLinecap: 'round', strokeLinejoin: 'round', filter: 'url(#wobble-calm)', overflow: 'visible' }}
    dangerouslySetInnerHTML={{ __html: paths }} />
);
const IconErewhon = (p) => <ProjIcon {...p} paths={`<path d="M38 8 L35 19"/><rect x="15" y="18" width="34" height="5" rx="2.5"/><path d="M19 23 L22 51 H42 L45 23 Z"/><path d="M24 34 Q32 30 40 34"/>`} />;
const IconImageTagger = (p) => <ProjIcon {...p} paths={`<rect x="13" y="17" width="38" height="30" rx="4"/><circle cx="25" cy="28" r="3.5"/><path d="M15 44 L27 33 L34 40 L43 31 L49 37"/>`} />;
const IconTweetFetch = (p) => <ProjIcon {...p} paths={`<path d="M18 13 H46 V50 L32 41 L18 50 Z"/><path d="M26 24 H38"/><path d="M26 31 H36"/>`} />;
const IconSynth = (p) => <ProjIcon {...p} paths={`<path d="M32 11 L36 28 L53 32 L36 36 L32 53 L28 36 L11 32 L28 28 Z"/>`} />;
const IconStockX = (p) => <ProjIcon {...p} paths={`<path d="M14 30 L30 14 H50 V34 L34 50 Z"/><circle cx="42" cy="22" r="3"/>`} />;
const IconCyberCredit = (p) => <ProjIcon {...p} paths={`<circle cx="32" cy="32" r="18"/><path d="M32 22 L40 32 L32 42 L24 32 Z"/>`} />;
const IconIceCream = (p) => <ProjIcon {...p} paths={`<path d="M20 27 Q21 18 27 17 Q29 11 34 14 Q41 12 42 20 Q46 23 43 27 Z"/><path d="M23 27 L32 51 L41 27"/>`} />;
const IconCodeBrackets = (p) => <ProjIcon {...p} paths={`<path d="M22 21 L12 32 L22 43"/><path d="M42 21 L52 32 L42 43"/><path d="M37 17 L27 47"/>`} />;
const IconBriefcase = (p) => <ProjIcon {...p} paths={`<rect x="12" y="23" width="40" height="28" rx="4"/><path d="M25 23 V17 H39 V23"/><path d="M12 35 H52"/>`} />;
const IconMapPin = (p) => <ProjIcon {...p} paths={`<path d="M32 53 C22 39 18 31 18 24 A14 14 0 0 1 46 24 C46 31 42 39 32 53 Z"/><circle cx="32" cy="24" r="5.5"/>`} />;

const projects = [
  {
    id: 'precinct', title: 'Precinct', desc: 'Reads the political lean and demographics of the precinct you\'re standing in', icon: IconMapPin, tech: ['SwiftUI', 'MapKit', 'SQLite', 'HTML', 'CSS', 'JavaScript'], link: 'https://precinct.ethangao.xyz/', repo: 'https://github.com/gaoe03/precinct', live: true, type: 'Jun 2026',
    category: 'iOS App',
    fullDesc: `Stand anywhere it covers and Precinct reads the precinct you're standing in: how it voted, which way it has been moving, and who lives there.

A friend had the data and the general idea. I designed and engineered the app. It covers about 41,000 precincts across California, New York, Texas, and Massachusetts.

The site you can visit here is a landing page I made for the app, mostly for fun and to test out my design skills.` },
  {
    id: 'erewhon', title: 'Erewhon Smoothie Archive', shortTitle: 'Erewhon', desc: 'Research agents that scoured the web to reconstruct every Erewhon smoothie', icon: IconErewhon, tech: ['Agents', 'JavaScript'], link: 'https://erewhon.vercel.app/', repo: 'https://github.com/gaoe03/erewhon', live: true, type: 'Jun 2026',
    category: 'Web App',
    fullDesc: `A weekend spent learning how research agents handle long, multi-step work, with Erewhon's smoothies as the test case.

Erewhon removes all their smoothie collabs after each product life cycle, and I couldn't find a centralized place with the old ones, so I made one. That meant recovering what they'd taken down: old press, archived menu pages, copycat recipes. I ran a fleet of agents to search, loop, and cross-check until messy pages turned into clean structured data, down to a photo for every smoothie.

It was also a design project: every ingredient is its own SVG sprite, each one intentionally designed, with a wobble that gives it a hand-drawn feel.` },
  {
    id: 'image-tagger', title: 'Image Tagger', desc: 'AI-powered tool for organizing and searching thousands of saved images', icon: IconImageTagger, tech: ['Python', 'Gemini API', 'OpenAI API', 'Discord.py'], type: 'Nov 2025',
    category: 'Personal Tool',
    fullDesc: `As someone who enjoys digital art, I cherish the references on Twitter that I've sorted into my liked posts over the years. After they changed their API access and privatized all likes in 2023, I downloaded everything locally but lost the discoverability and threading that Twitter provided.

So I built Image Tagger. It uses Gemini 2.5 and OpenAI's 4o models to automatically analyze and tag images, generating searchable descriptions for medium, color palette, subject matter, and more. I created a taxonomy structure to keep tags consistent across the collection. Now I can search through 10,000+ files with natural language queries like "sunset landscapes with warm colors" or "character designs with armor" locally.` },
  {
    id: 'tweetfetch', title: 'TweetFetch', desc: 'Discord bot for browsing and searching archived Twitter likes', icon: IconTweetFetch, tech: ['Python', 'Discord.py', 'AsyncIO'], link: 'https://github.com/gaoe03/TweetFetch', type: 'Mar 2025',
    category: 'Discord Bot',
    fullDesc: `Discord bot that parses a commonly used Twitter data export format and provides an interface for browsing archived liked tweets.

Features include filtering by username, date range, and media type, a slideshow viewer for passive browsing, and a guessing game for exploring the archive. Tracks statistics like most-liked users and total media count. Later integrated with ImageTagger to enable searching tagged images directly from the bot.

Built with async Python to handle large JSON datasets efficiently.` },
  {
    id: 'synth', title: 'Synth', desc: 'Discord bot for experimenting with text generation models', icon: IconSynth, tech: ['Python', 'Discord.py', 'TextSynth API'], link: 'https://github.com/gaoe03/Synth', type: 'Dec 2022',
    category: 'Discord Bot',
    fullDesc: `Discord bot built to experiment with text generation APIs after learning about TextSynth in a CS class. Integrates with the TextSynth API to generate text using different language models including GPT-3, CodeGen, and FairseqGPT.

Built a command interface that lets users select which engine to use for their prompts, check remaining API credits, and monitor server latency. The bot logs all generation requests with summaries for tracking usage patterns.

Built with Python using discord.py and requests. Implemented custom features to streamline the model selection and query process.` },
  {
    id: 'stockx-guess', title: 'StockX Guess', desc: 'Browser game where you guess sneaker market prices', icon: IconStockX, tech: ['JavaScript', 'HTML', 'CSS'], link: 'https://github.com/pyangmain/Sneaker-Price-Guessing-Game', type: 'Aug 2022',
    category: 'Web Game',
    fullDesc: `A browser-based game where players guess the market price of ten random sneakers from popular brands and receive a score based on accuracy.

Scraped and parsed JSON data of sneaker information including price, picture, and title using StockX's unofficial API. Built the game logic and UI to display random selections and calculate scoring based on guess proximity to actual market prices.

Built with JavaScript, HTML, and CSS.` },
  {
    id: 'cybercredit', title: 'CyberCredit', desc: 'On-chain credit scoring for DeFi lending protocols', icon: IconCyberCredit, tech: ['JavaScript', 'TypeScript', 'Etherscan API', 'CyberConnect API'], type: 'Mar 2022',
    category: 'Hackathon',
    fullDesc: `Built at the Blockchain@Columbia 2022 Hackathon. Designed a front-end application that analyzes Ethereum wallet data to generate credit scores for DeFi lending protocols.

The application pulls on-chain transaction history using the Etherscan and CyberConnect APIs, then calculates a creditworthiness score based on factors like transaction frequency, token diversity, protocol interactions, and account age. The goal was to provide risk assessment for under-collateralized lending without traditional credit infrastructure.

Built with JavaScript, TypeScript, and CSS. Completed in 24 hours with a team of three.` }
];

// Coordinates placed visually on SVG landmasses
const videos = [
  // Coordinates calculated from SVG path analysis
  { num: '1', title: 'Tohoku', gradient: 'linear-gradient(135deg, #3d5a4a 0%, #5a7c6a 100%)', url: 'https://www.youtube.com/watch?v=cUowHezVU8c', comingSoon: false, thumbnail: '/thumbnails/gaolife-1.jpg', mapX: 725, mapY: 405, country: 'Japan' },
  { num: '2', title: 'Hokkaido', gradient: 'linear-gradient(135deg, #2d4a5a 0%, #4a6a7c 100%)', url: 'https://www.youtube.com/watch?v=xY8n0mokf9w', comingSoon: false, thumbnail: '/thumbnails/gaolife-1pt2.jpg', mapX: 725, mapY: 388, country: 'Japan' },
  { num: '3', title: 'Hong Kong', gradient: 'linear-gradient(135deg, #4a3d5a 0%, #6a5a7c 100%)', url: 'https://www.youtube.com/watch?v=DhuqgmEaplg', comingSoon: false, thumbnail: '/thumbnails/gaolife-2.jpg', mapX: 682, mapY: 462, country: 'China' },
  { num: '4', title: 'Guangdong', gradient: 'linear-gradient(135deg, #5a4a2d 0%, #7c6a4a 100%)', url: 'https://www.youtube.com/watch?v=oHXrmyAfnkc', comingSoon: false, thumbnail: '/thumbnails/gaolife-3.jpg', mapX: 677, mapY: 456, country: 'China' },
  { num: '5', title: 'Sichuan', gradient: 'linear-gradient(135deg, #2d5a4a 0%, #4a7c59 100%)', url: 'https://www.youtube.com/watch?v=bOl0s6UcLQI', comingSoon: false, thumbnail: '/thumbnails/gaolife-4.jpg', mapX: 638, mapY: 428, country: 'China' },
  { num: '6', title: 'Yunnan', gradient: 'linear-gradient(135deg, #5a3d2d 0%, #7c5a4a 100%)', url: 'https://www.youtube.com/watch?v=3eXUCCUpVOU', comingSoon: false, thumbnail: '/thumbnails/gaolife-5.jpg', mapX: 640, mapY: 447, country: 'China' },
  { num: '7', title: 'Oregon', gradient: 'linear-gradient(135deg, #2d4a3d 0%, #4a7c5a 100%)', url: 'https://www.youtube.com/watch?v=XIAJCIYQvZM', comingSoon: false, thumbnail: '/thumbnails/gaolife-6.jpg', mapX: 138, mapY: 410, country: 'USA' },
  { num: '8', title: 'Coming Soon', gradient: 'linear-gradient(135deg, #4a4a4a 0%, #6a6a6a 100%)', url: '', comingSoon: true, thumbnail: null, mapX: 0, mapY: 0, country: '' },
];

// Interactive map component for gao life videos
const TravelMap = ({ videos, onSelectVideo, selectedIndex }) => {
  // East Asia map using accurate geographic SVG paths from simple-world-map
  // ViewBox cropped to show East Asia region

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '800px', margin: '0 auto', background: '#fff', borderRadius: '14px', padding: '8px' }}>
      <WobblyFrameBorder radius={12} />
      <svg viewBox="575 365 170 115" style={{ width: '100%', height: 'auto', background: '#e8f4f8', borderRadius: '10px', display: 'block' }}>

        <g filter="url(#wobble-calm)">
        {/* China - accurate geographic outline */}
        <path
          d="M594.498,386.128l-2.99,7.521l-4.124-0.217l-4.349,9.518l3.691,4.701l-7.606,10.504l-3.907-0.658l-2.611,3.285l0.648,1.971l3.043,0.217l1.521,3.5l3.044,0.658l9.344,12.04v6.129l4.563,2.844l4.996-0.873l6.303,3.719l7.605,2.187l3.691-0.439l4.132-0.441l8.687-5.688l2.828,0.44l1.08,2.567l2.396,0.718l3.26,4.813l-2.17,4.814l1.306,3.285l3.69,1.312l0.647,3.942l4.35,0.439l0.647-1.971l6.302-3.285l3.907,0.217l4.563,5.03l3.043-1.312l1.954,0.216l0.873,2.412l1.521,0.216l2.169-3.06l8.688-3.285l7.823-9.413l2.61-8.974l-0.217-5.912l-3.259-0.656l1.953-2.188l-0.434-3.501l-8.255-8.314v-4.157l2.386-3.062l2.388-1.098l0.216-2.412h-6.085l-1.089,3.285l-2.828-0.656l-3.475-3.718l2.17-5.688l3.043-3.285l2.827,0.217l-0.434,5.031l1.521,1.313l3.691-3.717l1.306-0.216l-0.433-2.844l3.476-4.158l2.61,0.216l1.521-4.813l1.781-0.942l0.182-3l-1.729-1.815l-0.147-4.736l3.329-0.217l-0.216-12.214l-2.334,1.4L694.267,377l-3.897-0.009l-11.298-6.354l-8.16-9.837l-8.281-0.086l-2.107,1.833l2.68,6.137l-0.935,5.758l-3.335,1.383l-1.876-0.147l-0.139,5.696l1.954,0.441l3.476-1.53l4.563,2.187v2.188l-3.26,0.216l-2.611,5.688l-2.386,0.215l-8.472,11.16l-8.902,3.941l-6.086,0.441l-4.124-2.844l-5.869,3.068l-6.302-1.971l-1.521-4.158l-10.642-0.657l-5.646-9.188h-2.386l-1.92-4.262L594.498,386.128z"
          fill="#e8e4df"
          stroke="#c5c0b8"
          strokeWidth="0.5"
        />

        {/* Taiwan - accurate geographic outline */}
        <path
          d="M695.686,453.76l-3.06,2.334l-0.163,4.494l2.646,3.078l0.656-0.58L695.686,453.76z"
          fill="#e8e4df"
          stroke="#c5c0b8"
          strokeWidth="0.4"
        />

        {/* North Korea - accurate geographic outline */}
        <path
          d="M687.751,407.047l1.59,0.666l0.484,5.566l3.155,0.183l2.974-3.483l-1.029-0.916l0.121-3.734l2.731-3.303l-1.392-2.506l0.908-1.039l0.501-2.592l-1.582-0.719l-1.35,0.684l-1.668,5.064l-2.697-0.232l-3.12,3.682L687.751,407.047z"
          fill="#e8e4df"
          stroke="#c5c0b8"
          strokeWidth="0.4"
        />

        {/* South Korea - accurate geographic outline */}
        <path
          d="M696.446,410.443l5.342,4.356l0.909,4.22l-0.183,2.264l-2.61,2.939l-2.248,0.12l-2.551-5.506l-0.968-2.629l1.028-0.795l-0.242-1.099l-1.271-0.569L696.446,410.443z"
          fill="#e8e4df"
          stroke="#c5c0b8"
          strokeWidth="0.4"
        />

        {/* Japan - all islands with accurate geographic outlines */}
        {/* Kyushu */}
        <path
          d="M709.317,426.193l-1.41,1.418l0.579,1.996l1.236,0.086l0.83,4.332l0.993,1.08l1.738-1.582l0.151-4.773l-2-2.125L709.317,426.193z"
          fill="#e8e4df"
          stroke="#c5c0b8"
          strokeWidth="0.4"
        />
        {/* Shikoku */}
        <path
          d="M716.688,422.188l-2.659,2.156l-0.591,2.719l1.812,1.25l2.625-2.75l0.37-3.062L716.688,422.188z"
          fill="#e8e4df"
          stroke="#c5c0b8"
          strokeWidth="0.4"
        />
        {/* Honshu (main island) */}
        <path
          d="M713.613,418.033l-4.219,4.832v2.322l2.604-0.312l4.085-3.592l2.731-0.502l0.663,0.779l0.015,2.377l0.688,1.25h1.255l1.763-2.158l0.743-2.836l3.552-0.086l3.476-4.166l-1.814-6.916l-0.83-3.664l1.815-1.496l-4.133-6.241l-0.944-0.744l-1.875,0.744l-0.481,2.584v2.083l0.994,1.167l0.328,5.498l-2.56,3.164l-1.485-0.917l-1.159,2.584l-0.251,2.412l0.909,1.418l-0.579,1.08l-1.902-1.582h-1.322l-1.157,0.666L713.613,418.033z"
          fill="#e8e4df"
          stroke="#c5c0b8"
          strokeWidth="0.4"
        />
        {/* Hokkaido */}
        <path
          d="M720.729,380.396l-1.321,1.168l0.665,2.498l1.158,1.166l-0.086,3.83l-1.487,0.578l-1.158,2.584l3.388,4.659l2.23-0.752l0.415-1.167l-2.396-2.161l1.487-1.919l1.572,0.25l3.43,2.305l0.37-2.584l1.63-2.979l2.281-2.312l-2.469-1.125l-0.944-1.801l-1.236,0.83l-1.071,1.331l-2.316-0.501l-2.396-1.582L720.729,380.396z"
          fill="#e8e4df"
          stroke="#c5c0b8"
          strokeWidth="0.4"
        />
        {/* Small northern islands */}
        <path
          d="M733.201,377.812l-2.317,3.25l0.164,1.582l1.158-0.502l2.723-3.414L733.201,377.812z"
          fill="#e8e4df"
          stroke="#c5c0b8"
          strokeWidth="0.4"
        />
        <path
          d="M736.261,373.066l-0.829,2.248l0.086,1.496l1.409-0.918l1.322-2.662v-0.994L736.261,373.066z"
          fill="#e8e4df"
          stroke="#c5c0b8"
          strokeWidth="0.4"
        />
        </g>

        {/* Location markers */}
        {videos.filter(v => !v.comingSoon && v.mapX > 0).map((video, i) => (
          <g key={i} className="map-pin" tabIndex={0} role="button" aria-label={`${video.title} video`} style={{ cursor: 'pointer' }} onClick={() => onSelectVideo(i)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectVideo(i); } }}>
            {/* Transparent oversized hit area so the marker is tappable on mobile */}
            <circle cx={video.mapX} cy={video.mapY} r="7" fill="transparent" />
            {/* Pulse animation ring - shows on selected, subtle on others */}
            <circle
              cx={video.mapX}
              cy={video.mapY}
              r={selectedIndex === i ? 4 : 3}
              fill="none"
              stroke={selectedIndex === i ? '#4A7C59' : '#999'}
              strokeWidth="0.8"
              opacity={0.3}
            >
              <animate attributeName="r" from="3" to="6" dur={selectedIndex === i ? '1.5s' : '2.5s'} repeatCount="indefinite" />
              <animate attributeName="opacity" from="0.4" to="0" dur={selectedIndex === i ? '1.5s' : '2.5s'} repeatCount="indefinite" />
            </circle>
            {/* Main marker */}
            <circle
              cx={video.mapX}
              cy={video.mapY}
              r={selectedIndex === i ? 3 : 2}
              fill={selectedIndex === i ? '#4A7C59' : '#999'}
              stroke="#fff"
              strokeWidth="1"
              className="map-marker"
              style={{ transition: 'all 0.3s ease' }}
            />
            {/* Label - positioned contextually to avoid overlaps */}
            {selectedIndex === i && (
              <text
                x={video.country === 'Japan' ? video.mapX - 8 : video.title === 'Hong Kong' ? video.mapX + 8 : video.mapX}
                y={video.country === 'Japan' ? video.mapY + 1 : video.title === 'Hong Kong' ? video.mapY + 1 : video.mapY - 5}
                textAnchor={video.country === 'Japan' ? 'end' : video.title === 'Hong Kong' ? 'start' : 'middle'}
                fill="#4A7C59"
                fontSize="4"
                fontWeight="600"
                fontFamily="system-ui, sans-serif"
              >
                {video.title}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
};

// America map component for gao life videos
const AmericaMap = ({ videos, onSelectVideo, selectedIndex }) => {
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '800px', margin: '0 auto', background: '#fff', borderRadius: '14px', padding: '8px' }}>
      <WobblyFrameBorder radius={12} />
      <svg viewBox="120 370 150 100" style={{ width: '100%', height: 'auto', background: '#e8f4f8', borderRadius: '10px', display: 'block' }}>
        {/* Continental US - from simple-world-map, rotated to correct orientation */}
        <g transform="rotate(-12, 195, 420)" filter="url(#wobble-calm)">
          <path
            d="M143.589,375.989l-0.865,3.475l-3.017-1.954h-1.504l-0.865,3.691l-10.554,23.65l2.801,20.606l3.449,1.737l0.648,5.645h7.105l6.889,5.204l13.562,1.305l1.504,6.941l2.152,1.521l3.017-3.033l2.369,1.08l2.152,9.976l3.656,2.386l3.017-5.645l9.258-6.726l6.025,2.817l5.169,0.433l0.216-3.25l10.762,0.217l2.152,2.386l0.432,5.42l-1.288,3.034l1.504,5.203h3.233l3.232-4.987l-1.288-2.386l-1.288-5.204l1.936-5.86l8.826-7.59l6.673-1.953l-0.864-6.293l9.258-9.983l9.258-1.521l-1.504-5.193l9.042-5.205v-6.94l-0.865-0.433l-3.233,1.082l-0.432,4.252l-10.745,0.129l-8.419,5.594l-13.217,4.322l-2.109-2.586l5.999-9.076l-2.965-2.826l-2.014-3.838l-4.175-3.354l-4.538-0.38l-8.575-5.852L143.589,375.989L143.589,375.989z"
            fill="#e8e4df"
            stroke="#c5c0b8"
            strokeWidth="0.5"
          />
        </g>

        {/* Location markers */}
        {videos.filter(v => !v.comingSoon && v.mapX > 0).map((video, i) => (
          <g key={i} className="map-pin" tabIndex={0} role="button" aria-label={`${video.title} video`} style={{ cursor: 'pointer' }} onClick={() => onSelectVideo(i)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectVideo(i); } }}>
            <circle cx={video.mapX} cy={video.mapY} r="7" fill="transparent" />
            <circle
              cx={video.mapX}
              cy={video.mapY}
              r={selectedIndex === i ? 4 : 3}
              fill="none"
              stroke={selectedIndex === i ? '#4A7C59' : '#999'}
              strokeWidth="0.8"
              opacity={0.3}
            >
              <animate attributeName="r" from="3" to="6" dur={selectedIndex === i ? '1.5s' : '2.5s'} repeatCount="indefinite" />
              <animate attributeName="opacity" from="0.4" to="0" dur={selectedIndex === i ? '1.5s' : '2.5s'} repeatCount="indefinite" />
            </circle>
            <circle
              cx={video.mapX}
              cy={video.mapY}
              r={selectedIndex === i ? 3 : 2}
              fill={selectedIndex === i ? '#4A7C59' : '#999'}
              stroke="#fff"
              strokeWidth="1"
              style={{ transition: 'all 0.3s ease' }}
            />
            {selectedIndex === i && (
              <text
                x={video.mapX}
                y={video.mapY - 5}
                textAnchor="middle"
                fill="#4A7C59"
                fontSize="4"
                fontWeight="600"
                fontFamily="system-ui, sans-serif"
              >
                {video.title}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
};

// Gao Life section with interactive map
const GaoLifeSection = () => {
  const [selectedVideo, setSelectedVideo] = useState(0);
  const [selectedRegion, setSelectedRegion] = useState('Asia');
  const regions = ['Asia', 'America'];
  const activeVideos = videos.filter(v => !v.comingSoon);
  const filteredVideos = activeVideos.filter(v =>
    selectedRegion === 'Asia' ? ['Japan', 'China'].includes(v.country) : ['USA'].includes(v.country)
  );
  const currentVideo = filteredVideos[selectedVideo] || filteredVideos[0];

  const handleRegionChange = (region) => {
    setSelectedRegion(region);
    setSelectedVideo(0);
  };

  return (
    <section id="interests" className="relative px-6 py-16 scroll-mt-20">
      <div className="relative" style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
          <div>
            <div style={{ display: 'inline-block' }}>
              <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: '2.25rem', color: '#2d2d2d', fontWeight: 400 }}>gao life</h2>
              <WobblyUnderline height={8} />
            </div>
          </div>
          <a href="https://youtube.com/@gaofiles" target="_blank" rel="noopener noreferrer" className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all duration-200 hover:scale-105" style={{ backgroundColor: '#2d2d2d', color: '#fff' }}><Youtube size={14} />@gaofiles<ExternalLink size={12} /></a>
        </div>
        <p className="mb-8 max-w-2xl" style={{ color: '#666', lineHeight: 1.7 }}>I like traveling and making videos about it. Mostly Asia so far.</p>

        {/* Desktop: Map + Video side by side */}
        <div className="hidden md:flex gap-12 items-start">
          {/* Map */}
          <div style={{ flex: '1' }}>
            {selectedRegion === 'Asia' ? (
              <TravelMap
                videos={filteredVideos}
                onSelectVideo={setSelectedVideo}
                selectedIndex={selectedVideo}
              />
            ) : (
              <AmericaMap
                videos={filteredVideos}
                onSelectVideo={setSelectedVideo}
                selectedIndex={selectedVideo}
              />
            )}
          </div>

          {/* Selected video card */}
          <div style={{ flex: '1', maxWidth: '400px' }}>
            <a
              href={currentVideo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl overflow-hidden relative transition-all duration-300 hover:scale-[1.02] group"
              style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}
            >
              <div style={{ aspectRatio: '16/9', position: 'relative' }}>
                {currentVideo.thumbnail ? (
                  <img src={currentVideo.thumbnail} alt={currentVideo.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full" style={{ background: currentVideo.gradient }} />
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.95)' }}>
                    <Play size={24} style={{ color: '#2d2d2d', marginLeft: '2px' }} fill="#2d2d2d" />
                  </div>
                </div>
              </div>
              <div style={{ padding: '20px', background: '#fff' }}>
                <p className="text-xs mb-1" style={{ color: '#4A7C59' }}>
                  gao life {currentVideo.num}, {currentVideo.country}
                </p>
                <p className="font-medium text-xl" style={{ fontFamily: 'var(--heading-font)', color: '#2d2d2d' }}>{currentVideo.title}</p>
              </div>
            </a>

            {/* Region tabs */}
            <div style={{ display: 'flex', gap: '6px', marginTop: '16px' }}>
              {regions.map(region => (
                <button
                  key={region}
                  onClick={() => handleRegionChange(region)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '16px',
                    border: selectedRegion === region ? '1.5px solid #4A7C59' : '1.5px solid #e3e5e2',
                    background: selectedRegion === region ? 'rgba(74,124,89,0.08)' : 'transparent',
                    color: selectedRegion === region ? '#4A7C59' : '#999',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {region}
                </button>
              ))}
            </div>

            {/* Video selector pills */}
            <div className="no-scrollbar" style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'nowrap', overflowX: 'auto' }}>
              {filteredVideos.map((vid, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedVideo(i)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: 'none',
                    background: selectedVideo === i ? '#4A7C59' : '#f1f3f1',
                    color: selectedVideo === i ? '#fff' : '#666',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    flexShrink: 0,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {vid.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile: Stacked layout */}
        <div className="md:hidden">
          {selectedRegion === 'Asia' ? (
            <TravelMap
              videos={filteredVideos}
              onSelectVideo={setSelectedVideo}
              selectedIndex={selectedVideo}
            />
          ) : (
            <AmericaMap
              videos={filteredVideos}
              onSelectVideo={setSelectedVideo}
              selectedIndex={selectedVideo}
            />
          )}

          {/* Selected video */}
          <a
            href={currentVideo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-xl overflow-hidden mt-6"
            style={{ boxShadow: '0 4px 15px rgba(0,0,0,0.08)' }}
          >
            <div style={{ aspectRatio: '16/9', position: 'relative' }}>
              {currentVideo.thumbnail ? (
                <img src={currentVideo.thumbnail} alt={currentVideo.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full" style={{ background: currentVideo.gradient }} />
              )}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}>
                  <Play size={20} style={{ color: '#2d2d2d', marginLeft: '2px' }} fill="#2d2d2d" />
                </div>
              </div>
            </div>
          </a>
          <div className="mt-3">
            <p className="text-xs mb-0.5" style={{ color: '#4A7C59' }}>
              gao life {currentVideo.num}, {currentVideo.country}
            </p>
            <p className="font-medium text-lg" style={{ fontFamily: 'var(--heading-font)', color: '#2d2d2d' }}>{currentVideo.title}</p>
          </div>

          {/* Mobile region tabs */}
          <div style={{ display: 'flex', gap: '6px', marginTop: '16px' }}>
            {regions.map(region => (
              <button
                key={region}
                onClick={() => handleRegionChange(region)}
                style={{
                  padding: '9px 14px',
                  borderRadius: '14px',
                  border: selectedRegion === region ? '1.5px solid #4A7C59' : '1.5px solid #e3e5e2',
                  background: selectedRegion === region ? 'rgba(74,124,89,0.08)' : 'transparent',
                  color: selectedRegion === region ? '#4A7C59' : '#999',
                  fontSize: '11px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                {region}
              </button>
            ))}
          </div>

          {/* Mobile video pills: wrap into the space below so nothing is cut off */}
          <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
            {filteredVideos.map((vid, i) => (
              <button
                key={i}
                onClick={() => setSelectedVideo(i)}
                style={{
                  padding: '10px 14px',
                  borderRadius: '16px',
                  border: 'none',
                  flexShrink: 0,
                  whiteSpace: 'nowrap',
                  background: selectedVideo === i ? '#4A7C59' : '#f1f3f1',
                  color: selectedVideo === i ? '#fff' : '#666',
                  fontSize: '12px',
                  fontWeight: '500',
                  cursor: 'pointer',
                }}
              >
                {vid.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const skills = {
  languages: { title: 'Languages', items: ['Python', 'JavaScript', 'TypeScript', 'SQL', 'HTML/CSS', 'LaTeX'] },
  frameworks: { title: 'Frameworks & Libraries', items: ['React', 'SwiftUI', 'Discord.py', 'Pandas', 'NumPy', 'PyTorch'] },
  tools: { title: 'Tools', items: ['Claude Code', 'OpenAI Codex', 'Gemini & OpenAI APIs', 'Git/GitHub', 'Notion', 'Jira', 'CapCut'] },
  certs: { title: 'Certifications', items: ['Claude Certified Architect - Foundations (CCA-F)', 'Salesforce Platform Administrator'] }
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
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      {/* Image display */}
      <div style={{ borderRadius: '12px', overflow: 'hidden', position: 'relative', flex: '0 0 auto', minHeight: '80px', boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.1)' }}>
        <div style={{ width: '100%', height: '100%', background: image.bg }} />
        {isAnalyzing && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontSize: '11px' }}>Analyzing...</span>
          </div>
        )}
      </div>

      {/* Generated tags */}
      <div style={{ background: '#f1f3f1', borderRadius: '10px', padding: '12px', marginTop: '12px', flex: 1 }}>
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
          marginTop: '10px',
          width: '100%',
          background: isAnalyzing ? '#ccc' : '#4A7C59',
          border: 'none',
          borderRadius: '8px',
          padding: '10px 8px',
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
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      {/* Command input bar */}
      <div style={{ background: '#40444b', borderRadius: '8px', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
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
          <div style={{ borderRadius: '8px', overflow: 'hidden', height: '55px', boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.15)' }}>
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
            <button onClick={prevSlide} style={{ background: '#4A7C59', border: 'none', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', color: '#fff', fontSize: '12px' }}>←</button>
            <button onClick={nextSlide} style={{ background: '#4A7C59', border: 'none', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', color: '#fff', fontSize: '12px' }}>→</button>
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
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      {/* Command input bar */}
      <div style={{ background: '#40444b', borderRadius: '8px', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
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
            marginTop: '8px',
            background: isGenerating ? '#72767d' : '#AA96DA',
            border: 'none',
            borderRadius: '6px',
            padding: '6px 12px',
            cursor: isGenerating ? 'default' : 'pointer',
            color: '#fff',
            fontSize: '10px',
            fontWeight: '600',
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
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <div style={{ fontSize: '10px', color: '#888', textAlign: 'center', marginBottom: '8px', flexShrink: 0 }}>Guess the market price! (±$20)</div>

      {/* Sneaker card - centered */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: sneaker.bg, borderRadius: '12px', padding: '16px 24px', textAlign: 'center' }}>
          <div style={{ width: '60px', height: '35px', background: sneaker.accent, borderRadius: '6px', margin: '0 auto 8px', opacity: 0.8 }} />
          <div style={{ fontSize: '11px', fontWeight: '600', color: '#555' }}>{sneaker.name}</div>
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
          style={{ background: '#f1f3f1', borderRadius: '10px', padding: '8px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, cursor: 'text' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1 }}>
            <span style={{ color: '#4A7C59', fontWeight: '600', fontSize: '12px' }}>$</span>
            <input
              ref={inputRef}
              type="number"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleGuess()}
              placeholder="???"
              style={{ width: '100%', border: 'none', background: 'transparent', fontSize: '12px', outline: 'none', fontWeight: '600' }}
            />
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); handleGuess(); }}
            disabled={!guess}
            style={{ background: guess ? '#4A7C59' : '#ccc', border: 'none', borderRadius: '6px', padding: '6px 14px', cursor: guess ? 'pointer' : 'default', color: '#fff', fontSize: '10px', fontWeight: '600', flexShrink: 0 }}
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
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', flexShrink: 0 }}>
        <div style={{ flex: 1, background: '#f1f3f1', borderRadius: '8px', padding: '10px' }}>
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
        <div style={{ flex: 1, background: '#f1f3f1', borderRadius: '8px', padding: '10px' }}>
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

      <div style={{ background: '#f1f3f1', borderRadius: '6px', padding: '8px 10px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: 'linear-gradient(135deg, #4A7C59 0%, #3d6b4a 100%)' }} />
        <span style={{ fontSize: '9px', color: '#888', fontFamily: 'monospace' }}>0x7a2...f4e9</span>
      </div>

      <button
        onClick={analyzeWallet}
        disabled={isAnalyzing}
        style={{
          width: '100%',
          background: isAnalyzing ? '#ccc' : '#4A7C59',
          border: 'none',
          borderRadius: '10px',
          padding: '14px 10px',
          color: '#fff',
          fontSize: '12px',
          fontWeight: '600',
          cursor: isAnalyzing ? 'default' : 'pointer',
          marginTop: 'auto',
          minHeight: '44px',
          flexShrink: 0,
        }}
      >
        {isAnalyzing ? 'Analyzing...' : 'Analyze New Wallet'}
      </button>
    </div>
  );
};

// Desktop versions with taller images
const ImageTaggerMockupDesktop = () => {
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
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      {/* Image display - taller for desktop */}
      <div style={{ borderRadius: '12px', overflow: 'hidden', position: 'relative', height: '45%', minHeight: '100px', flexShrink: 0, boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.1)' }}>
        <div style={{ width: '100%', height: '100%', background: image.bg }} />
        {isAnalyzing && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontSize: '11px' }}>Analyzing...</span>
          </div>
        )}
      </div>

      {/* Generated tags */}
      <div style={{ background: '#f1f3f1', borderRadius: '10px', padding: '12px', marginTop: '12px', flexShrink: 0 }}>
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
          marginTop: '10px',
          width: '100%',
          background: isAnalyzing ? '#ccc' : '#4A7C59',
          border: 'none',
          borderRadius: '8px',
          padding: '10px 8px',
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

const TweetFetchMockupDesktop = () => {
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
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      {/* Command input bar */}
      <div style={{ background: '#40444b', borderRadius: '8px', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
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
        <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ borderRadius: '8px', overflow: 'hidden', height: '90px', boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.15)' }}>
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
            <button onClick={prevSlide} style={{ background: '#4A7C59', border: 'none', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', color: '#fff', fontSize: '12px' }}>←</button>
            <button onClick={nextSlide} style={{ background: '#4A7C59', border: 'none', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', color: '#fff', fontSize: '12px' }}>→</button>
          </div>
          <span style={{ color: '#72767d', fontSize: '10px' }}>{currentSlide + 1} / {slides.length}</span>
        </div>
      </div>
    </div>
  );
};

// Stylized mockup illustrations for each project
// Mockup for the Erewhon Smoothie Archive — an abstract, interactive ingredients grid.
// Real wobbly fruit icons; click one to open an abstracted ingredient "profile".
const EW = { ink: '#2A2118', red: '#D8503C', pink: '#F2A7BB', magenta: '#D9568C', yellow: '#F0C24F', orange: '#E8893D', peach: '#F0A284', green: '#5E8C4F', deep: '#3F6B4F', lime: '#A4BE6C', blue: '#4F7BC0', purple: '#7B5AA6', brown: '#8A5A3B', cocoa: '#5C4030', tan: '#D9B98C', cream: '#F6EDD8' };
const EWS = `stroke="${EW.ink}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"`;
const EWS2 = `stroke="${EW.ink}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"`;
const EW_FRUITS = [
  { c: EW.red, svg: `<path d="M32 58 C16 50 10 34 16 26 C22 19 42 19 48 26 C54 34 48 50 32 58 Z" fill="${EW.red}" ${EWS}/><path d="M22 22 L27 11 L31 20 Z" fill="${EW.green}" ${EWS}/><path d="M33 20 L37 10 L42 22 Z" fill="${EW.green}" ${EWS}/><path d="M24 33 h.01 M32 36 h.01 M40 33 h.01 M28 45 h.01 M36 45 h.01 M32 50 h.01" stroke="${EW.cream}" stroke-width="3.5" stroke-linecap="round"/>` },
  { c: EW.yellow, svg: `<path d="M14 14 C9 39 27 55 50 51 C56 50 56 44 50 43 C32 46 22 32 23 15 C23.5 9 14.5 8 14 14 Z" fill="${EW.yellow}" ${EWS}/><path d="M49 46 l3.5 -1" stroke="${EW.cocoa}" stroke-width="4" stroke-linecap="round"/><path d="M16 13 l1 -3.5" stroke="${EW.cocoa}" stroke-width="4" stroke-linecap="round"/>` },
  { c: EW.blue, svg: `<circle cx="22" cy="41" r="8" fill="${EW.blue}" ${EWS}/><circle cx="41" cy="42" r="8" fill="${EW.blue}" ${EWS}/><circle cx="31" cy="25" r="8" fill="${EW.blue}" ${EWS}/><path d="M29 23 l4 4 M33 23 l-4 4" stroke="${EW.ink}" stroke-width="1.6" stroke-linecap="round"/><path d="M20 39 l4 4 M24 39 l-4 4" stroke="${EW.ink}" stroke-width="1.6" stroke-linecap="round"/><path d="M39 40 l4 4 M43 40 l-4 4" stroke="${EW.ink}" stroke-width="1.6" stroke-linecap="round"/>` },
  { c: EW.orange, svg: `<path d="M18 41 C13 27 27 13 40 15 C52 17 53 33 43 44 C34 53 22 53 18 41 Z" fill="${EW.orange}" ${EWS}/><path d="M38 19 C46 22 49 31 44 39" stroke="${EW.red}" stroke-width="5" fill="none" stroke-linecap="round" opacity=".65"/><path d="M40 13 Q47 6 53 9 Q48 15 40 13 Z" fill="${EW.green}" ${EWS}/>` },
  { c: EW.yellow, svg: `<path d="M24 23 L28 8 L32 20 L36 6 L40 23" fill="${EW.green}" ${EWS}/><ellipse cx="32" cy="40" rx="14" ry="17" fill="${EW.yellow}" ${EWS}/><path d="M24 31 l15 17 M21 40 l11 13 M40 31 l-15 17 M43 40 l-11 13" ${EWS2} fill="none"/>` },
  { c: EW.red, svg: `<path d="M24 36 C24 22 34 14 46 10" stroke="${EW.deep}" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M42 38 C40 26 42 18 46 10" stroke="${EW.deep}" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M46 10 Q56 8 58 16 Q50 18 46 10 Z" fill="${EW.green}" ${EWS}/><circle cx="23" cy="44" r="9" fill="${EW.red}" ${EWS}/><circle cx="42" cy="46" r="9" fill="${EW.red}" ${EWS}/>` },
  { c: EW.orange, svg: `<circle cx="32" cy="34" r="20" fill="${EW.orange}" ${EWS}/><circle cx="32" cy="34" r="13" fill="${EW.peach}" ${EWS2}/><path d="M32 34 L32 21 M32 34 L43 27 M32 34 L43 41 M32 34 L32 47 M32 34 L21 41 M32 34 L21 27" ${EWS2} fill="none" opacity=".5"/>` },
  { c: EW.deep, svg: `<path d="M32 8 C21 8 15 22 15 36 C15 48 22 56 32 56 C42 56 49 48 49 36 C49 22 43 8 32 8 Z" fill="${EW.deep}" ${EWS}/><path d="M32 13 C24 13 19 24 19 36 C19 46 24 52 32 52 C40 52 45 46 45 36 C45 24 40 13 32 13 Z" fill="${EW.lime}" stroke="none"/><circle cx="32" cy="40" r="8" fill="${EW.brown}" ${EWS2}/>` },
  { c: EW.magenta, svg: `<ellipse cx="32" cy="39" rx="14" ry="16" fill="${EW.magenta}" ${EWS}/><path d="M21 30 C13 27 9 30 11 35 C16 35 19 34 24 33 Z" fill="${EW.lime}" ${EWS2}/><path d="M43 30 C51 27 55 30 53 35 C48 35 45 34 40 33 Z" fill="${EW.lime}" ${EWS2}/><path d="M24 25 C19 17 13 17 13 23 C18 25 21 27 26 29 Z" fill="${EW.lime}" ${EWS2}/><path d="M40 25 C45 17 51 17 51 23 C46 25 43 27 38 29 Z" fill="${EW.lime}" ${EWS2}/><path d="M32 22 C30 13 25 11 23 15 C27 19 29 22 31 26 Z" fill="${EW.lime}" ${EWS2}/><path d="M32 22 C34 13 39 11 41 15 C37 19 35 22 33 26 Z" fill="${EW.lime}" ${EWS2}/>` },
  { c: EW.yellow, svg: `<path d="M14 35 Q13 24 26 21 Q43 18 49 28 Q52 34 46 40 Q34 49 22 45 Q15 42 14 35 Z" fill="${EW.yellow}" ${EWS}/><path d="M49 29 l2.5 -1.5 M15 38 l-2.5 1.5" ${EWS} fill="none"/>` },
  { c: '#7FA84A', svg: `<path d="M14 35 Q13 24 26 21 Q43 18 49 28 Q52 34 46 40 Q34 49 22 45 Q15 42 14 35 Z" fill="#7FA84A" ${EWS}/><path d="M49 29 l2.5 -1.5 M15 38 l-2.5 1.5" ${EWS} fill="none"/>` },
  { c: EW.magenta, svg: `<path d="M28 14 Q32 8 36 14" stroke="${EW.green}" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="32" cy="22" r="6" fill="${EW.magenta}" ${EWS}/><circle cx="23" cy="31" r="6" fill="${EW.magenta}" ${EWS}/><circle cx="41" cy="31" r="6" fill="${EW.magenta}" ${EWS}/><circle cx="26" cy="42" r="6" fill="${EW.magenta}" ${EWS}/><circle cx="38" cy="42" r="6" fill="${EW.magenta}" ${EWS}/><circle cx="32" cy="51" r="5" fill="${EW.magenta}" ${EWS}/>` },
  { c: EW.blue, svg: `<path d="M19 25 L25 13 L41 13 L46 25 Z" fill="${EW.tan}" ${EWS}/><path d="M19 25 H46 V53 H19 Z" fill="${EW.cream}" ${EWS}/><path d="M19 39 Q26 35 32.5 39 T46 39" stroke="${EW.blue}" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M30 13 L30 8 L36 8 L36 13" ${EWS2} fill="${EW.cream}"/>` },
];
const EwFruit = ({ svg, size }) => (
  <svg viewBox="0 0 64 64" style={{ width: size, height: size, display: 'block', filter: 'url(#wobble-calm)', overflow: 'visible' }} dangerouslySetInnerHTML={{ __html: svg }} aria-hidden="true" />
);
const EwBar = ({ w, h = 5, c = '#d9d9d6' }) => (
  <span style={{ display: 'block', width: w, height: h, borderRadius: 3, background: c }} />
);
const ErewhonMockup = () => {
  const [sel, setSel] = useState(0);
  const picks = [0, 1, 3, 2, 7, 12];
  const f = EW_FRUITS[sel];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, justifyContent: 'center', gap: 22 }}>
      {/* big wobbling fruit + a few abstract bars */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ flexShrink: 0, width: 108, height: 108, borderRadius: 22, background: '#f5f5f3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <EwFruit svg={f.svg} size={74} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
          <EwBar w="52%" h={12} c={f.c} />
          <EwBar w="100%" h={6} c="#d9d9d6" />
          <EwBar w="74%" h={6} c="#d9d9d6" />
        </div>
      </div>
      {/* small row of fruits to pick from */}
      <div style={{ display: 'flex', gap: 9, justifyContent: 'center', flexShrink: 0 }}>
        {picks.map((idx) => {
          const on = sel === idx;
          return (
            <button key={idx} onClick={() => setSel(idx)} className="ew-pick" style={{ width: 48, height: 48, borderRadius: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: 'none', ...(on ? { background: `${EW_FRUITS[idx].c}14`, boxShadow: `0 0 0 2px ${EW_FRUITS[idx].c}` } : {}) }}>
              <EwFruit svg={EW_FRUITS[idx].svg} size={32} />
            </button>
          );
        })}
      </div>
    </div>
  );
};

// Precinct: a mini of the actual app — a map with hand-drawn pins; tap one and its profile card slides open.
const precinctColor = (dem) => dem >= 72 ? '#2166E6' : dem >= 58 ? '#4F54CF' : dem >= 43 ? '#8C40B3' : dem >= 29 ? '#B5347A' : '#D92929';
const PRECINCTS = [
  { name: 'AD 75, ED 14', loc: 'Manhattan, NY', lean: 'D+49', dem: 74, income: '$89k', race: '64% White', turnout: '44%', x: '24%', y: '30%' },
  { name: 'Precinct 0331', loc: 'Houston, TX', lean: 'D+11', dem: 56, income: '$58k', race: '31% White', turnout: '52%', x: '67%', y: '25%' },
  { name: 'Precinct 142', loc: 'McAllen, TX', lean: 'R+1', dem: 49, income: '$41k', race: '14% White', turnout: '39%', x: '46%', y: '44%' },
];
const PrecinctMockup = () => {
  const [sel, setSel] = useState(0);
  const [open, setOpen] = useState(false);
  useEffect(() => { const t = setTimeout(() => setOpen(true), 550); return () => clearTimeout(t); }, []);
  const p = PRECINCTS[sel];
  const c = precinctColor(p.dem);
  return (
    <div style={{ position: 'relative', flex: 1, minHeight: 0, borderRadius: 14, overflow: 'hidden', background: '#edf0ea' }}>
      {/* map paper: faint grid + a couple soft roads */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(#dde3d8 1px, transparent 1px), linear-gradient(90deg, #dde3d8 1px, transparent 1px)', backgroundSize: '20px 20px', opacity: 0.7 }} />
      <svg width="100%" height="100%" viewBox="0 0 100 70" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, display: 'block' }} aria-hidden="true">
        <path d="M-5 22 C 30 16, 55 34, 105 26" stroke="#d3dacb" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M40 -5 C 44 25, 30 45, 52 75" stroke="#d3dacb" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </svg>
      {/* precinct pins, colored by lean */}
      {PRECINCTS.map((pr, i) => {
        const on = sel === i;
        return (
          <button key={i} onClick={() => setSel(i)} aria-label={`${pr.loc}, ${pr.lean}`} style={{ position: 'absolute', left: pr.x, top: pr.y, transform: 'translate(-50%, -100%)', border: 'none', background: 'none', cursor: 'pointer', padding: 0, zIndex: on ? 3 : 2, opacity: on ? 1 : 0.78, transition: 'opacity 0.2s ease' }}>
            <svg width="24" height="29" viewBox="0 0 60 72" style={{ display: 'block', filter: on ? 'drop-shadow(0 3px 5px rgba(20,24,32,0.3))' : 'drop-shadow(0 2px 3px rgba(20,24,32,0.2))' }}>
              <g filter="url(#wobble-calm)">
                <path d="M30 5 C16 5 6 15 6 29 C6 45 30 67 30 67 C30 67 54 45 54 29 C54 15 44 5 30 5 Z" fill={precinctColor(pr.dem)} stroke="#fff" strokeWidth="3.5" strokeLinejoin="round" />
                <circle cx="30" cy="28" r="8" fill="#fff" />
              </g>
            </svg>
          </button>
        );
      })}
      {/* bottom-sheet profile card — slides open to reveal the demographics */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, background: '#fff', borderRadius: '16px 16px 0 0', boxShadow: '0 -6px 20px rgba(20,24,32,0.12)', padding: '9px 15px 14px', transform: open ? 'translateY(0)' : 'translateY(40%)', transition: 'transform 0.5s cubic-bezier(.22,.61,.36,1)' }}>
        <div style={{ width: 32, height: 4, borderRadius: 2, background: '#dcdfd9', margin: '0 auto 9px' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 10 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--heading-font)', fontSize: 14, fontWeight: 600, color: '#2d2d2d', lineHeight: 1.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
            <div style={{ fontSize: 10.5, color: '#888', marginTop: 2 }}>{p.loc}</div>
          </div>
          <span style={{ fontFamily: 'var(--heading-font)', fontSize: 28, fontWeight: 600, color: c, lineHeight: 1, transition: 'color 0.25s ease', flexShrink: 0 }}>{p.lean}</span>
        </div>
        <div style={{ display: 'flex', height: 9, borderRadius: 6, overflow: 'hidden', marginTop: 9 }}>
          <div style={{ width: `${p.dem}%`, background: '#2166E6', transition: 'width 0.3s ease' }} />
          <div style={{ flex: 1, background: '#D92929' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginTop: 10, fontSize: 10, color: '#5b616b' }}>
          <span><b style={{ color: '#2d2d2d', fontWeight: 600 }}>{p.income}</b> income</span>
          <span><b style={{ color: '#2d2d2d', fontWeight: 600 }}>{p.race}</b></span>
          <span><b style={{ color: '#2d2d2d', fontWeight: 600 }}>{p.turnout}</b> turnout</span>
        </div>
      </div>
    </div>
  );
};

const ProjectMockup = ({ projectId }) => {
  const mockupStyle = {
    position: 'relative',
    width: '100%',
    maxWidth: '480px',
    aspectRatio: '4/3',
    borderRadius: '20px',
    background: '#fff',
    overflow: 'hidden',
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
      case 'precinct':
        return <PrecinctMockup />;
      case 'erewhon':
        return <ErewhonMockup />;
      case 'image-tagger':
        return <ImageTaggerMockupDesktop />;
      case 'tweetfetch':
        return <TweetFetchMockupDesktop />;
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
    <div style={mockupStyle}>
      <WobblyFrameBorder radius={18} stroke="#8e918c" />
      <div style={contentStyle}>
        {renderMockupContent()}
      </div>
    </div>
  );
};

// Project switcher: tabs on top (most recent first), one full project on stage below.
// The whole case study fits one screen on desktop; new projects just add a tab.
const ProjectSwitcher = () => {
  const [activeId, setActiveId] = useState(projects[0].id);
  const active = projects.find((p) => p.id === activeId);

  return (
    <div>
      {/* Tabs: compact wrapping pills, every project visible at once on any screen */}
      <div className="flex flex-wrap gap-1.5 md:gap-2" style={{ marginBottom: '22px' }}>
        {projects.map((p) => {
          const on = p.id === activeId;
          const Icon = p.icon;
          return (
            <button
              key={p.id}
              onClick={() => setActiveId(p.id)}
              aria-pressed={on}
              className="flex-none px-[11px] py-[5px] md:px-[15px] md:py-2 text-xs md:text-[13px]"
              style={{
                display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer',
                borderRadius: '999px', whiteSpace: 'nowrap',
                border: on ? '1.5px solid #4A7C59' : '1.5px solid #e3e5e2',
                background: on ? 'rgba(74,124,89,0.08)' : 'transparent',
                color: on ? '#3d6b4a' : '#777',
                fontWeight: '600', transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => { if (!on) e.currentTarget.style.borderColor = '#c6cdc6'; }}
              onMouseLeave={(e) => { if (!on) e.currentTarget.style.borderColor = '#e3e5e2'; }}
            >
              <Icon size={16} style={{ color: on ? '#4A7C59' : '#9aa09a', flexShrink: 0 }} />
              {p.shortTitle || p.title}
            </button>
          );
        })}
      </div>

      {/* Stage: demo beside the writeup on large screens, stacked below that */}
      <div key={active.id} className="p-5 md:p-8" style={{ background: '#fff', border: '1px solid #e3e5e2', borderRadius: '18px', boxShadow: '0 4px 15px rgba(0,0,0,0.06)', animation: 'fadeIn 0.35s ease both' }}>
        <div className="flex flex-col lg:flex-row lg:items-center gap-7 lg:gap-10">
          {/* Demo */}
          <div className="w-full lg:w-[480px] lg:flex-none flex justify-center">
            <div className="hidden md:block w-full" style={{ maxWidth: '480px' }}>
              <ProjectMockup projectId={active.id} />
            </div>
            <div className="md:hidden w-full">
              <div style={{ position: 'relative', minHeight: '220px', borderRadius: '16px', background: '#fff', overflow: 'hidden', padding: '16px', display: 'flex', flexDirection: 'column' }}>
                <WobblyFrameBorder radius={14} stroke="#8e918c" />
                {active.id === 'precinct' && <PrecinctMockup />}
                {active.id === 'erewhon' && <ErewhonMockup />}
                {active.id === 'image-tagger' && <ImageTaggerMockup />}
                {active.id === 'tweetfetch' && <TweetFetchMockup />}
                {active.id === 'synth' && <SynthMockup />}
                {active.id === 'stockx-guess' && <StockXGuessMockup />}
                {active.id === 'cybercredit' && <CyberCreditMockup />}
              </div>
            </div>
          </div>

          {/* Writeup */}
          <div className="flex-1 min-w-0 w-full">
            <div style={{ display: 'inline-block', marginBottom: '6px' }}>
              <h3 style={{ fontFamily: 'var(--heading-font)', fontSize: 'clamp(1.5rem, 2.4vw, 1.85rem)', color: '#2d2d2d', fontWeight: '400', lineHeight: 1.25 }}>
                {active.title}
              </h3>
              <WobblyUnderline height={8} strokeWidth={2} color="#aeb1ac" />
            </div>
            <p style={{ color: '#888', fontSize: '12px', marginBottom: '16px' }}>
              {active.category}, {active.type}
            </p>
            {active.fullDesc.split('\n\n').map((para, i) => (
              <p key={i} style={{ color: '#555', fontSize: '14px', lineHeight: 1.7, marginBottom: '12px' }}>{para}</p>
            ))}
            <p style={{ fontSize: '12px', color: '#6f7570', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', marginTop: '14px' }}>
              {active.tech.join(', ')}
            </p>
            <div style={{ display: 'flex', gap: '8px', marginTop: '18px', flexWrap: 'wrap' }}>
              {active.live && active.link && (
                <a
                  href={active.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: '#4A7C59', cursor: 'pointer', textDecoration: 'none',
                    display: 'inline-flex', alignItems: 'center', gap: '5px',
                    color: '#fff', fontSize: '12px', fontWeight: '600',
                    padding: '8px 16px', borderRadius: '999px', transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#3d6b4a'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#4A7C59'; }}
                >
                  Visit site <ArrowUpRight size={13} />
                </a>
              )}
              {!active.live && active.link && active.link.includes('github') && (
                <a
                  href={active.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: 'rgba(74,124,89,0.12)', cursor: 'pointer', textDecoration: 'none',
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    color: '#3d6b4a', fontSize: '12px', fontWeight: '600',
                    padding: '8px 16px', borderRadius: '999px', transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#4A7C59'; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(74,124,89,0.12)'; e.currentTarget.style.color = '#3d6b4a'; }}
                >
                  <Github size={13} /> View code
                </a>
              )}
              {active.repo && (
                <a
                  href={active.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: 'rgba(74,124,89,0.12)', cursor: 'pointer', textDecoration: 'none',
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    color: '#3d6b4a', fontSize: '12px', fontWeight: '600',
                    padding: '8px 16px', borderRadius: '999px', transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#4A7C59'; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(74,124,89,0.12)'; e.currentTarget.style.color = '#3d6b4a'; }}
                >
                  <Github size={13} /> View code
                </a>
              )}
            </div>
          </div>
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
        { label: "Truly's", desc: '2018 - 2021', icon: IconIceCream, modalContent: { title: "Truly's Ice Cream", role: 'Team Member', date: '2018 - 2021', location: 'Wellesley, MA', bullets: ['First job experience in customer service', 'Learned teamwork and responsibility'] } },
        { label: 'Code Ninjas', desc: '2020 - 2021', icon: IconCodeBrackets, modalContent: { title: 'Code Ninjas', role: 'Instructor', date: 'August 2020 - June 2021', location: 'Wellesley, MA', bullets: ['Taught coding in Scratch and JavaScript to groups of up to 10 students per session', 'Created and held custom designed curricula for weekly summer coding camps', 'Facilitated mock hackathons for students, guiding them through the creation of their own games'] } },
      ]
    },
    {
      id: 'uci', year: '2021 - 2025', title: 'UC Irvine', desc: 'B.A. Business Admin & B.S. Computer Science', modalContent: { title: 'University of California, Irvine', subtitle: 'B.A. in Business Administration and B.S. in Computer Science', date: 'September 2021 - March 2025', location: 'Irvine, CA', bullets: ['Concentration in Finance for Business Administration', 'Concentration in Systems & Software for Computer Science'] }, milestones: [
        { label: 'Blockchain @ UCI', desc: 'President', icon: IconCyberCredit, modalContent: { title: 'Blockchain @ UCI Club', role: 'President', date: 'December 2021 - March 2025', location: 'Irvine, CA', bullets: ['Managed club event logistics, including booking rooms and flights, ordering supplies, and leading discussions', 'Integrated automated emailing software to distribute announcements and track metrics', 'Led communications for multiple partnerships, securing over $40,000 in club funding'] } },
        { label: 'Deloitte Consulting Intern', desc: 'Summer 2024', icon: IconBriefcase, modalContent: { title: 'Deloitte Consulting', role: 'Summer Scholar', date: 'June 2024 - August 2024', location: 'Costa Mesa, CA', bullets: ['Summer Scholar for Deloitte Consulting'] } },
      ]
    },
    { id: 'alpher', year: '2023 - 2024', title: 'Alpher LLC', desc: 'Founder', modalContent: { title: 'Alpher LLC', subtitle: 'Founder', date: 'February 2023 - 2024', location: 'Remote', bullets: ['Founded a ticket brokering venture delivering high-demand event tickets to 400+ international customers', 'Generated 7 figures in revenue during year one', 'Recruited and mentored a team of 7', 'Leveraged sales data to optimize pricing and event selection'] }, milestones: [] },
    { id: 'deloitte', year: 'Since 2025', title: 'Deloitte Consulting', desc: 'Analyst', modalContent: { title: 'Deloitte Consulting', subtitle: 'Analyst', date: 'October 2025 - Present', location: 'Costa Mesa, CA', bullets: ['Deloitte Digital Analyst'] }, milestones: [] },
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

  const WobbleFilter = ({ id, seedOffset = 0, speed = 'alive' }) => (
    <filter id={id} x="-45%" y="-45%" width="190%" height="190%">
      <feTurbulence
        data-wobble={speed}
        data-seeds={`${13 + seedOffset},${113 + seedOffset},${213 + seedOffset}`}
        type="turbulence"
        baseFrequency="0.012 0.009"
        numOctaves="2"
        seed={13 + seedOffset}
        result="warp"
      />
      <feDisplacementMap
        in="SourceGraphic"
        in2="warp"
        scale="6.5"
        xChannelSelector="R"
        yChannelSelector="G"
      />
    </filter>
  );

  const ResumeModal = ({ item, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      requestAnimationFrame(() => setIsVisible(true));
    }, []);

    const handleClose = () => {
      setIsVisible(false);
      setTimeout(onClose, 200);
    };

    useEffect(() => {
      const onKey = (e) => { if (e.key === 'Escape') handleClose(); };
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }, []);

    const Icon = item.icon || IconMapPin;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: isVisible ? 'rgba(17,24,39,0.56)' : 'rgba(17,24,39,0)', transition: 'background-color 0.3s ease' }} onClick={handleClose}>
        <div className="w-full max-w-xl rounded-2xl relative overflow-hidden" style={{ backgroundColor: '#fff', maxHeight: '85vh', border: '1px solid #e8e4da', boxShadow: '0 16px 40px rgba(74,60,40,0.16)', transform: isVisible ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(10px)', opacity: isVisible ? 1 : 0, transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease' }} onClick={e => e.stopPropagation()}>
          <div className="px-6 pt-6 pb-5" style={{ background: '#f7f6f1', borderBottom: '1px solid #e8e4da' }}>
            <button onClick={handleClose} className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-150" style={{ backgroundColor: '#f1efe9' }}>
              <X size={16} style={{ color: '#666' }} />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#4A7C59' }}>
                <Icon size={24} style={{ color: '#fff' }} />
              </div>
              {(item.role || item.subtitle) && (
                <span className="text-xs" style={{ color: '#3d6b4a' }}>{item.role || item.subtitle}</span>
              )}
            </div>
            <h3 style={{ fontFamily: 'var(--heading-font)', fontSize: '1.625rem', color: '#2d2d2d', marginBottom: '0.5rem', fontWeight: 400 }}>{item.title}</h3>
            {(item.date || item.location) && (
              <div className="flex flex-wrap gap-3">
                {item.date && <span className="text-xs font-medium" style={{ color: '#4b5563' }}>{item.date}</span>}
                {item.location && <span className="text-xs font-medium" style={{ color: '#6f7570' }}>{item.location}</span>}
              </div>
            )}
          </div>
          {item.bullets && item.bullets.length > 0 && (
            <>
              <div className="px-6 py-5 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 200px)' }}>
                <ul className="space-y-3">
                  {item.bullets.map((b, i) => (
                    <li key={i} className="text-sm leading-relaxed flex gap-3" style={{ color: '#555', lineHeight: 1.85 }}>
                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#4A7C59', flexShrink: 0, marginTop: '10px' }} />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  const StopCard = ({ stop, side }) => (
    <div className="flex flex-col" style={{ alignItems: side === 'left' ? 'flex-start' : 'flex-end' }}>
      <div
        className="relative p-6 rounded-2xl cursor-pointer transition-all duration-300 hover:-translate-y-1 group"
        style={{
          background: '#fff',
          boxShadow: '0 8px 24px rgba(74,60,40,0.06)',
          border: '1px solid #e8e4da',
          minWidth: '280px',
          backdropFilter: 'blur(4px)'
        }}
        onClick={() => setSelectedItem(stop.modalContent)}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 14px 34px rgba(74,60,40,0.11)';
          e.currentTarget.style.borderColor = '#cbd5e1';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(74,60,40,0.06)';
          e.currentTarget.style.borderColor = '#e8e4da';
        }}
      >
        {/* Subtle accent line */}
        <div className="absolute top-0 left-6 right-6 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(74,124,89,0.24), transparent)' }} />

        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs" style={{ color: '#4A7C59' }}>{stop.year}</span>
        </div>
        <p className="text-2xl font-medium" style={{ color: '#2d2d2d', fontFamily: 'var(--heading-font)', letterSpacing: '-0.01em' }}>{stop.title}</p>
        {stop.desc && (
          <p className="text-sm mt-2" style={{ color: '#666', lineHeight: 1.5 }}>{stop.desc}</p>
        )}

        {/* Click indicator */}
        <div className="flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-xs" style={{ color: '#888' }}>View details</span>
          <ChevronRight size={12} style={{ color: '#888' }} />
        </div>
      </div>

      {stop.milestones.length > 0 && (
        <div className="flex flex-col gap-2 mt-4" style={{ alignItems: side === 'left' ? 'flex-start' : 'flex-end', paddingLeft: side === 'left' ? '16px' : '0', paddingRight: side === 'right' ? '16px' : '0' }}>
          {/* Connector line to milestones */}
          <div className="h-3 w-px mb-1" style={{ backgroundColor: '#d1d5db', marginLeft: side === 'left' ? '20px' : 'auto', marginRight: side === 'right' ? '20px' : 'auto' }} />

          {stop.milestones.map((m, i) => (
            <div key={i} className="flex flex-col" style={{ alignItems: side === 'left' ? 'flex-start' : 'flex-end' }}>
              <div
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white cursor-pointer transition-all duration-300 hover:-translate-y-0.5 group"
                style={{
                  border: '1px solid #e8e4da',
                  boxShadow: '0 4px 14px rgba(74,60,40,0.04)',
                  background: '#fff'
                }}
                onClick={() => setSelectedItem({ ...m.modalContent, icon: m.icon })}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 10px 24px rgba(74,60,40,0.09)';
                  e.currentTarget.style.borderColor = '#cbd5e1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 14px rgba(74,60,40,0.04)';
                  e.currentTarget.style.borderColor = '#e8e4da';
                }}
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-105" style={{ background: 'linear-gradient(135deg, #4A7C59 0%, #3d6b4a 100%)' }}>
                  <m.icon size={21} style={{ color: '#fff' }} />
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: '#2d2d2d' }}>{m.label}</p>
                  <p className="text-xs" style={{ color: '#999' }}>{m.desc}</p>
                </div>
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
          <div className="flex flex-col items-center mr-4">
            {/* Mini dirt path, same trail browns as the desktop hike */}
            <div style={{ position: 'relative', flex: 1, width: '14px', minHeight: '100%', filter: 'url(#wobble-slow)' }} aria-hidden="true">
              <div style={{ position: 'absolute', inset: 0, borderRadius: '7px', background: 'linear-gradient(90deg, #c2af89, #ddd0b4 50%, #c2af89)', opacity: 0.9 }} />
            </div>
          </div>
          <div className="flex flex-col gap-5 flex-1 pb-4">
            {stops.map((stop) => (
              <div key={stop.id} className="relative">
                <div className="absolute top-5 w-4 h-4 rounded-full" style={{ left: '-31px', backgroundColor: '#fff', border: '2px solid #4A7C59', boxShadow: '0 0 0 3px rgba(74,124,89,0.15)' }} />
                <div
                  className="p-4 rounded-xl cursor-pointer"
                  style={{
                    background: '#fff',
                    boxShadow: '0 6px 18px rgba(74,60,40,0.06)',
                    border: '1px solid #e8e4da'
                  }}
                  onClick={() => setSelectedItem(stop.modalContent)}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs" style={{ color: '#4A7C59' }}>{stop.year}</span>
                  </div>
                  <p className="text-lg font-medium" style={{ color: '#2d2d2d', fontFamily: 'var(--heading-font)' }}>{stop.title}</p>
                  {stop.desc && <p className="text-xs mt-1" style={{ color: '#666', lineHeight: 1.4 }}>{stop.desc}</p>}
                </div>
                {stop.milestones.length > 0 && (
                  <div className="ml-3 mt-2 flex flex-col gap-2">
                    {stop.milestones.map((m, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg cursor-pointer"
                        style={{
                          background: '#fff',
                          border: '1px solid #e8e4da',
                          boxShadow: '0 4px 12px rgba(74,60,40,0.04)'
                        }}
                        onClick={() => setSelectedItem({ ...m.modalContent, icon: m.icon })}
                      >
                        <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #4A7C59 0%, #3d6b4a 100%)' }}>
                          <m.icon size={17} style={{ color: '#fff' }} />
                        </div>
                        <div>
                          <p className="text-xs font-medium" style={{ color: '#2d2d2d' }}>{m.label}</p>
                          <p className="text-xs" style={{ color: '#999' }}>{m.desc}</p>
                        </div>
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
        <div className="flex justify-end items-center gap-3 mb-6 mr-4">
          <button
            onClick={() => setShowSimpleView(!showSimpleView)}
            className="group flex items-center gap-3 px-5 py-2.5 rounded-full text-sm transition-all duration-300"
            style={{
              backgroundColor: showSimpleView ? '#4A7C59' : 'rgba(255,255,255,0.9)',
              color: showSimpleView ? '#fff' : '#666',
              border: showSimpleView ? '1px solid #4A7C59' : '1px solid rgba(232,228,223,0.8)',
              boxShadow: showSimpleView
                ? '0 4px 15px rgba(74,124,89,0.25)'
                : '0 2px 10px rgba(0,0,0,0.04)',
              backdropFilter: 'blur(4px)'
            }}
            onMouseEnter={(e) => {
              if (!showSimpleView) {
                e.currentTarget.style.borderColor = 'rgba(74,124,89,0.3)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.08)';
              }
            }}
            onMouseLeave={(e) => {
              if (!showSimpleView) {
                e.currentTarget.style.borderColor = 'rgba(232,228,223,0.8)';
                e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.04)';
              }
            }}
          >
            <span className="relative">
              <span className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${showSimpleView ? 'opacity-0 scale-75' : 'opacity-100 scale-100'}`}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                </svg>
              </span>
              <span className={`flex items-center justify-center transition-all duration-300 ${showSimpleView ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M12 2L12 22M2 12H22" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </span>
            </span>
            <span className="font-medium tracking-wide" style={{ fontSize: '13px' }}>
              {showSimpleView ? 'Trail View' : 'Simple View'}
            </span>
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
                    <div className="p-5 rounded-xl cursor-pointer bg-white transition-all duration-200 hover:-translate-y-1" style={{ boxShadow: '0 8px 24px rgba(74,60,40,0.06)', border: '1px solid #e8e4da' }} onClick={() => setSelectedItem(stop.modalContent)} onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 14px 34px rgba(74,60,40,0.11)'} onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 8px 24px rgba(74,60,40,0.06)'}>
                      <p className="text-sm font-bold tracking-wide" style={{ color: '#4A7C59' }}>{stop.year}</p>
                      <p className="text-xl font-medium mt-0.5" style={{ color: '#2d2d2d', fontFamily: 'var(--heading-font)' }}>{stop.title}</p>
                      {stop.desc && <p className="text-sm mt-0.5" style={{ color: '#777' }}>{stop.desc}</p>}
                    </div>
                    {stop.milestones.length > 0 && (
                      <div className="ml-6 mt-3 flex flex-col gap-2">
                        {stop.milestones.map((m, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white cursor-pointer transition-all duration-200 hover:-translate-y-1" style={{ border: '1px solid #e8e4da', boxShadow: '0 6px 18px rgba(74,60,40,0.05)' }} onClick={() => setSelectedItem({ ...m.modalContent, icon: m.icon })} onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 12px 28px rgba(74,60,40,0.1)'} onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 6px 18px rgba(74,60,40,0.05)'}>
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
              <defs>
                <WobbleFilter id="resume-tree-wobble" />
              </defs>
              {trees.map((t, i) => (<g key={i} filter="url(#resume-tree-wobble)"><polygon points={`${t.x},${t.y - 20 * t.s} ${t.x - 12 * t.s},${t.y + 10 * t.s} ${t.x + 12 * t.s},${t.y + 10 * t.s}`} fill="#4A7C59" opacity={0.1 + (i % 5) * 0.03} /><polygon points={`${t.x},${t.y - 10 * t.s} ${t.x - 8 * t.s},${t.y + 6 * t.s} ${t.x + 8 * t.s},${t.y + 6 * t.s}`} fill="#3d6b4a" opacity={0.15 + (i % 4) * 0.04} /><rect x={t.x - 2} y={t.y + 8 * t.s} width="4" height={6 * t.s} fill="#8b7355" opacity="0.2" /></g>))}
            </svg>
            <svg className="absolute right-4" style={{ top: '520px', pointerEvents: 'none' }} width="495" height="288" viewBox="0 0 420 240" fill="none">
              <defs>
                <WobbleFilter id="resume-lake-wobble" seedOffset={31} speed="calm" />
              </defs>
              <g filter="url(#resume-lake-wobble)">
                <path d="M45 90 Q90 37 195 52 Q315 67 367 120 Q397 172 300 202 Q180 232 75 187 Q22 157 45 90" fill="#a8d4e6" opacity="0.4" />
                <path d="M75 97 Q120 60 202 72 Q292 87 330 132 Q352 172 270 195 Q165 217 90 172 Q52 147 75 97" fill="#c5e4f0" opacity="0.3" />
              </g>
            </svg>
            <svg className="absolute left-0 bottom-0" width="200" height="200" viewBox="0 0 200 200" fill="none" style={{ pointerEvents: 'none' }}>
              <defs>
                <WobbleFilter id="resume-foreground-tree-wobble" seedOffset={59} />
              </defs>
              <g filter="url(#resume-foreground-tree-wobble)"><polygon points="40,60 28,90 52,90" fill="#4A7C59" opacity="0.12" /><polygon points="40,72 32,88 48,88" fill="#3d6b4a" opacity="0.16" /><rect x="38" y="88" width="4" height="8" fill="#8b7355" opacity="0.2" /></g>
              <g filter="url(#resume-foreground-tree-wobble)"><polygon points="80,45 68,75 92,75" fill="#4A7C59" opacity="0.14" /><polygon points="80,57 72,73 88,73" fill="#3d6b4a" opacity="0.18" /><rect x="78" y="73" width="4" height="8" fill="#8b7355" opacity="0.2" /></g>
              <g filter="url(#resume-foreground-tree-wobble)"><polygon points="55,95 43,125 67,125" fill="#4A7C59" opacity="0.13" /><polygon points="55,107 47,123 63,123" fill="#3d6b4a" opacity="0.17" /><rect x="53" y="123" width="4" height="8" fill="#8b7355" opacity="0.2" /></g>
              <g filter="url(#resume-foreground-tree-wobble)"><polygon points="25,130 13,160 37,160" fill="#4A7C59" opacity="0.12" /><polygon points="25,142 17,158 33,158" fill="#3d6b4a" opacity="0.16" /><rect x="23" y="158" width="4" height="8" fill="#8b7355" opacity="0.2" /></g>
            </svg>
            <div className="absolute left-1/2 transform -translate-x-1/2" style={{ width: '200px' }}>
              <svg width="200" height="920" viewBox="0 0 200 920" fill="none">
                <defs>
                  <WobbleFilter id="resume-path-wobble" seedOffset={83} speed="slow" />
                </defs>
                <g filter="url(#resume-path-wobble)">
                  <path d="M100 60 C100 100 130 130 130 180 C130 250 155 290 125 360 C85 450 55 480 55 540 C55 600 50 650 80 720 C110 790 105 830 100 870" stroke="#c9b896" strokeWidth="50" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.5" />
                  <path d="M100 60 C100 100 130 130 130 180 C130 250 155 290 125 360 C85 450 55 480 55 540 C55 600 50 650 80 720 C110 790 105 830 100 870" stroke="#ddd0b8" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.35" />
                </g>
                <line x1="129" y1="160" x2="-150" y2="160" stroke="rgba(255,255,255,0.9)" strokeWidth="4" strokeLinecap="round" />
                <line x1="137" y1="320" x2="350" y2="320" stroke="rgba(255,255,255,0.9)" strokeWidth="4" strokeLinecap="round" />
                <line x1="55" y1="560" x2="-150" y2="560" stroke="rgba(255,255,255,0.9)" strokeWidth="4" strokeLinecap="round" />
                <line x1="104" y1="820" x2="350" y2="820" stroke="rgba(255,255,255,0.9)" strokeWidth="4" strokeLinecap="round" />
                <circle cx="129" cy="160" r="14" fill="#fff" stroke="#4A7C59" strokeWidth="4" />
                <circle cx="137" cy="320" r="14" fill="#fff" stroke="#4A7C59" strokeWidth="4" />
                <circle cx="55" cy="560" r="14" fill="#fff" stroke="#4A7C59" strokeWidth="4" />
                <circle cx="104" cy="820" r="14" fill="#fff" stroke="#4A7C59" strokeWidth="4" />
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

// === HERO HEADING WITH TYPING ===
const HeroHeading = () => {
  const { displayedText, isComplete } = useTypingEffect("Hey, I'm Ethan Gao", 70, 300);

  return (
    <h1 className="mb-6" style={{ fontFamily: 'var(--heading-font)', fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', lineHeight: 1.15, color: '#2d2d2d', fontWeight: 400, minHeight: '1.2em' }}>
      {displayedText.includes("Ethan") ? (
        <>
          {displayedText.split("Ethan")[0]}
          <span style={{ color: '#3d6b4a' }}>Ethan{displayedText.split("Ethan")[1] || ''}</span>
        </>
      ) : (
        displayedText
      )}
      {!isComplete && <span className="inline-block w-0.5 h-8 ml-1 bg-current" style={{ animation: 'blink 1s infinite' }} />}
    </h1>
  );
};

// Recent writing: teaser of the three newest posts, pulled from the same posts
// list the /blog page uses (one source of truth). Cards link straight to each
// post; the "read the blog" link goes to the full archive.
const RecentWriting = () => {
  const recent = posts.filter((p) => p.status !== 'draft').slice(0, 3);
  if (recent.length === 0) return null;
  const fmtDate = (iso) => {
    const d = new Date(`${iso}T00:00:00`);
    return isNaN(d) ? iso : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  return (
    <section id="writing" className="relative px-6 py-16 scroll-mt-20">
      <BlogWobbleDefs />
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-4 mb-8">
          <div style={{ display: 'inline-block' }}>
            <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: '2.25rem', color: '#2d2d2d', fontWeight: 400 }}>recent writing</h2>
            <WobblyUnderline height={8} />
          </div>
          <a href="/blog" className="inline-flex items-center gap-1 text-sm transition-all duration-200 hover:gap-2" style={{ color: '#4A7C59', fontWeight: 500 }}>
            read more <ArrowUpRight size={15} />
          </a>
        </div>
        <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
          {recent.map((post) => (
            <a key={post.slug} href={`/blog/${post.slug}`} className="block group" style={{ textDecoration: 'none' }}>
              <Cover slug={post.slug} aspect="16 / 9" />
              <div style={{ padding: '14px 2px 0' }}>
                {post.category && (
                  <p style={{ fontSize: '13px', color: '#75806f', margin: '0 0 6px' }}>{post.category.toLowerCase()}</p>
                )}
                <h3 className="transition-colors duration-150" style={{ fontFamily: 'var(--heading-font)', fontSize: '1.2rem', color: '#232323', fontWeight: 400, lineHeight: 1.3, margin: '0 0 6px' }}>{post.title}</h3>
                {post.excerpt && (
                  <p style={{ color: '#565a53', fontSize: '14px', lineHeight: 1.55, margin: '0 0 8px' }}>{post.excerpt}</p>
                )}
                <p style={{ color: '#9a9d97', fontSize: '12.5px', margin: 0 }}>{fmtDate(post.date)}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default function Site() {
  const rootRef = useRef(null);
  useWobbleLoop(rootRef);
  usePageTitle('Ethan Gao');
  return (
    <div ref={rootRef} style={{ backgroundColor: '#fbfcfb', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', scrollBehavior: 'smooth' }}>
      <WobbleDefs />
      <style>{`
        :root {
          --heading-font: 'Libre Baskerville', serif;
        }
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

        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }

        .ew-pick { background: #f5f5f3; transition: background 0.15s ease, box-shadow 0.15s ease; }
        .ew-pick:hover { background: #ecebe9; }

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

        /* Map pins: no ugly UA focus box on click; clean ring only on keyboard nav */
        .map-pin:focus { outline: none; }
        .map-pin:focus-visible { outline: 2px solid #4A7C59; outline-offset: 2px; border-radius: 4px; }
      `}</style>
      <div id="about" className="relative overflow-hidden" style={{ minHeight: '100vh' }}>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(175deg, #fbfcfb 0%, #f4f6f4 55%, #f1f3f1 100%)' }} />

        <div className="absolute bottom-0 left-0 right-0 h-24" style={{ background: 'linear-gradient(to bottom, transparent, #f1f3f1)' }} />
        <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-4 md:px-10 py-4">
          <span className="px-3 md:px-4 py-2 rounded-full flex items-center gap-2" style={{ fontFamily: 'var(--heading-font)', fontSize: '1.2rem', color: '#2d2d2d', backgroundColor: 'rgba(250,249,246,0.85)', border: '1px solid rgba(139,115,85,0.15)', backdropFilter: 'blur(8px)' }}>
            <img src="/favicon.png" alt="Whale" style={{ width: '24px', height: '24px' }} />
            <span className="hidden sm:inline">Ethan Gao</span>
          </span>
          <div className="flex items-center gap-1 md:gap-3 px-3 md:px-4 py-2 rounded-full" style={{ backgroundColor: 'rgba(250,249,246,0.85)', border: '1px solid rgba(139,115,85,0.15)', backdropFilter: 'blur(8px)' }}>
            {[{ label: 'Projects', href: '#projects' }, { label: 'Experience', href: '#experience' }, { label: 'Interests', href: '#interests' }, { label: 'Blog', href: '/blog' }, { label: 'Contact', href: '#contact' }].map((link) => (
              <a key={link.label} href={link.href} className="text-xs md:text-sm font-medium transition-colors duration-200 px-2 md:px-3 py-1 text-[#555] hover:text-[#4A7C59]">{link.label}</a>
            ))}
          </div>
        </nav>
        <section className="relative px-6 md:px-10 flex flex-col justify-center w-full" style={{ maxWidth: '1200px', margin: '0 auto', minHeight: 'calc(100vh - 80px)', paddingTop: '80px' }}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="relative z-10 max-w-xl">
              <HeroHeading />
              <p className="leading-relaxed mb-4" style={{ color: '#444', fontSize: 'clamp(1.05rem, 2vw, 1.15rem)', lineHeight: 1.85 }}>I'm an Analyst at <strong>Deloitte</strong> in Costa Mesa, working within Deloitte Digital. I recently graduated from <strong>UC Irvine</strong> with degrees in Computer Science and Business Administration.</p>
              <p className="leading-relaxed mb-8" style={{ color: '#666', fontSize: 'clamp(0.95rem, 1.5vw, 1.05rem)', lineHeight: 1.85 }}>I also make travel videos and build side projects.</p>
              <div className="flex items-center gap-5">
                <a href="https://linkedin.com/in/gaoe" target="_blank" rel="noopener noreferrer" className="social-icon inline-flex p-2.5 -m-2.5 transition-all duration-200 hover:text-blue-600" style={{ color: '#666' }} title="LinkedIn"><Linkedin size={20} /></a>
                <a href="https://github.com/gaoe03" target="_blank" rel="noopener noreferrer" className="social-icon inline-flex p-2.5 -m-2.5 transition-all duration-200" style={{ color: '#666' }} title="GitHub"><Github size={20} /></a>
                <a href="https://youtube.com/@gaofiles" target="_blank" rel="noopener noreferrer" className="social-icon inline-flex p-2.5 -m-2.5 transition-all duration-200 hover:text-red-600" style={{ color: '#666' }} title="YouTube"><Youtube size={20} /></a>
                <a href="mailto:one@ethangao.xyz" className="social-icon inline-flex p-2.5 -m-2.5 transition-all duration-200" style={{ color: '#666' }} title="Email"><Mail size={20} /></a>
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

      <section id="projects" className="relative px-6 py-16 scroll-mt-20">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(74,124,89,0.08) 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <div className="relative" style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div className="mb-12">
            <div style={{ display: 'inline-block' }}>
              <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: 'clamp(2rem, 4vw, 2.75rem)', color: '#2d2d2d', fontWeight: 400 }}>
                Recent Projects
              </h2>
              <WobblyUnderline height={9} />
            </div>
          </div>

          <ProjectSwitcher />
        </div>
      </section>

      <section id="experience" className="px-6 py-10 scroll-mt-20" style={{ backgroundColor: '#f1f3f1' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div className="mb-2"><div style={{ display: 'inline-block' }}><h2 style={{ fontFamily: 'var(--heading-font)', fontSize: '2.25rem', color: '#2d2d2d', fontWeight: 400 }}>Where I've Been</h2><WobblyUnderline height={8} /></div></div>
          <p className="text-sm mb-6" style={{ color: '#888' }}>Click on a card for more info</p>
          <HikingTrail />
        </div>
      </section>

      {/* Technical Skills Section */}
      <section id="skills" className="px-6 py-14 scroll-mt-20" style={{ backgroundColor: '#f1f3f1' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div className="mb-8" style={{ display: 'inline-block' }}><h2 style={{ fontFamily: 'var(--heading-font)', fontSize: '2.25rem', color: '#2d2d2d', fontWeight: 400 }}>Technical Skills</h2><WobblyUnderline height={8} /></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(skills).map(([key, category]) => (
              <div key={key} className="p-5 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.6)', border: '1px solid #e3e5e2', boxShadow: '0 4px 15px rgba(0,0,0,0.06)' }}>
                <h3 className="text-sm font-semibold mb-3" style={{ color: '#4A7C59' }}>{category.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {category.items.map((it) => (
                    <span key={it} className="text-sm" style={{ color: '#555', background: '#fff', border: '1px solid #e6e8e5', borderRadius: '8px', padding: '5px 12px' }}>{it}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* YouTube Section */}
      <GaoLifeSection />

      {/* Recent writing teaser */}
      <RecentWriting />

      <footer id="contact" className="px-6 py-10 scroll-mt-20" style={{ borderTop: '1px solid #e3e5e2' }}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5" style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div className="flex items-center gap-2.5">
            <img src="/favicon.png" alt="" style={{ width: '22px', height: '22px' }} />
            <span style={{ fontFamily: 'var(--heading-font)', fontSize: '15px', color: '#2d2d2d' }}>Ethan Gao</span>
            <a href="mailto:one@ethangao.xyz" className="text-sm" style={{ color: '#999', textDecoration: 'none', marginLeft: '6px' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#555'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#999'}
            >one@ethangao.xyz</a>
          </div>
          <div className="flex items-center gap-5">
            <a href="https://linkedin.com/in/gaoe" target="_blank" rel="noopener noreferrer" className="social-icon inline-flex p-2 -m-2 transition-all duration-200 hover:text-blue-600" style={{ color: '#999' }} title="LinkedIn"><Linkedin size={17} /></a>
            <a href="https://github.com/gaoe03" target="_blank" rel="noopener noreferrer" className="social-icon inline-flex p-2 -m-2 transition-all duration-200" style={{ color: '#999' }} title="GitHub"><Github size={17} /></a>
            <a href="https://youtube.com/@gaofiles" target="_blank" rel="noopener noreferrer" className="social-icon inline-flex p-2 -m-2 transition-all duration-200 hover:text-red-600" style={{ color: '#999' }} title="YouTube"><Youtube size={17} /></a>
            <a href="mailto:one@ethangao.xyz" className="social-icon inline-flex p-2 -m-2 transition-all duration-200" style={{ color: '#999' }} title="Email"><Mail size={17} /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
