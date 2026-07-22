import { useState, useEffect, useRef } from 'react';
import { ChevronRight } from 'lucide-react';
import { erewhonIngredients } from './lab/erewhonIngredients.js';
import { labPrecinctShapes } from './lab/precinctShapes.js';
import OverlayDialog from './lab/OverlayDialog.jsx';
import DitherAvatar from './vendor/dither-kit/DitherAvatar.jsx';

// === WOBBLE SYSTEM ===
// Motion tiers mapped to physical weight. Erewhon matches the source archive's 140ms boil.
const WOBBLE_SPEED_MS = { erewhon: 140, alive: 170, calm: 600, slow: 1300 };
const WOBBLE_FRAME_COUNT = { erewhon: 4, alive: 3, calm: 3, slow: 3 };

const WobbleDefs = () => (
  <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
    <defs>
      {[
        { id: 'wobble-alive', speed: 'alive', baseFrequency: '0.012 0.009', scale: 6.5, seed: 13 },
        { id: 'wobble-calm', speed: 'calm', baseFrequency: '0.02 0.016', scale: 2.2, seed: 29 },
        { id: 'wobble-erewhon', speed: 'erewhon', type: 'fractalNoise', baseFrequency: '0.045', scale: 2.6, seed: 3, seeds: [3, 17, 29, 41] },
        { id: 'wobble-slow', speed: 'slow', baseFrequency: '0.012 0.01', scale: 2.2, seed: 89 },
      ].map(f => (
        <filter key={f.id} id={f.id} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            data-wobble={f.speed}
            data-seeds={(f.seeds || [f.seed, f.seed + 100, f.seed + 200]).join(',')}
            type={f.type || 'turbulence'}
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
    const frames = { erewhon: 0, alive: 0, calm: 0, slow: 0 };
    const last = { erewhon: 0, alive: 0, calm: 0, slow: 0 };
    let raf;

    const tick = (time) => {
      for (const speed of Object.keys(WOBBLE_SPEED_MS)) {
        if (time - last[speed] >= WOBBLE_SPEED_MS[speed]) {
          last[speed] = time;
          frames[speed] = (frames[speed] + 1) % WOBBLE_FRAME_COUNT[speed];
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
const IconCyberCredit = (p) => <ProjIcon {...p} paths={`<circle cx="32" cy="32" r="18"/><path d="M32 22 L40 32 L32 42 L24 32 Z"/>`} />;
const IconIceCream = (p) => <ProjIcon {...p} paths={`<path d="M20 27 Q21 18 27 17 Q29 11 34 14 Q41 12 42 20 Q46 23 43 27 Z"/><path d="M23 27 L32 51 L41 27"/>`} />;
const IconCodeBrackets = (p) => <ProjIcon {...p} paths={`<path d="M22 21 L12 32 L22 43"/><path d="M42 21 L52 32 L42 43"/><path d="M37 17 L27 47"/>`} />;
const IconBriefcase = (p) => <ProjIcon {...p} paths={`<rect x="12" y="23" width="40" height="28" rx="4"/><path d="M25 23 V17 H39 V23"/><path d="M12 35 H52"/>`} />;

const projects = [
  {
    id: 'precinct', title: 'Precinctly', desc: 'Reads the political lean and demographics of the precinct you\'re standing in', tech: ['SwiftUI', 'MapKit', 'SQLite', 'HTML', 'CSS', 'JavaScript'], link: 'https://precinct.ethangao.xyz/', repo: 'https://github.com/gaoe03/precinctly', live: true, type: 'Jun 2026',
    category: 'iOS App' },
  {
    id: 'erewhon', title: 'Erewhon Smoothie Archive', desc: 'An illustrated archive of Erewhon smoothies from 2022 onward', tech: ['JavaScript', 'Algolia', 'GitHub Actions'], link: 'https://erewhon.vercel.app/', repo: 'https://github.com/gaoe03/erewhon', live: true, type: 'Jun 2026',
    category: 'Web App' },
  {
    id: 'image-tagger', title: 'Image Tagger', desc: 'Searches a 10,000-image art reference archive I saved from Twitter', tech: ['Python', 'Gemini API', 'OpenAI API', 'Discord.py'], type: 'Nov 2025',
    category: 'Personal Tool' },
  {
    id: 'tweetfetch', title: 'TweetFetch', desc: 'Discord bot for browsing and searching archived Twitter likes', tech: ['Python', 'Discord.py', 'AsyncIO'], link: 'https://github.com/gaoe03/TweetFetch', type: 'Mar 2025',
    category: 'Discord Bot' },
  {
    id: 'synth', title: 'Synth', desc: 'Discord bot for experimenting with text generation models', tech: ['Python', 'Discord.py', 'TextSynth API'], link: 'https://github.com/gaoe03/Synth', type: 'Dec 2022',
    category: 'Discord Bot' },
  {
    id: 'stockx-guess', title: 'StockX Guess', desc: 'Browser game where you guess sneaker market prices', tech: ['JavaScript', 'HTML', 'CSS'], link: 'https://github.com/pyangmain/Sneaker-Price-Guessing-Game', type: 'Aug 2022',
    category: 'Web Game' },
  {
    id: 'cybercredit', title: 'CyberCredit', desc: 'On-chain credit scoring for DeFi lending protocols', tech: ['JavaScript', 'TypeScript', 'Etherscan API', 'CyberConnect API'], type: 'Mar 2022',
    category: 'Hackathon' }
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
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '800px', margin: '0 auto', background: '#fff', borderRadius: '14px', padding: '8px' }}>
      <WobblyFrameBorder radius={12} />
      <svg viewBox="568 365 180 115" style={{ width: '100%', height: 'auto', background: '#e8f4f8', borderRadius: '10px', display: 'block' }}>

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
          <g key={i} className="map-pin" tabIndex={0} role="button" aria-label={`${video.title} video`} aria-pressed={selectedIndex === i} style={{ cursor: 'pointer' }} onClick={() => onSelectVideo(i)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectVideo(i); } }}>
            {/* Transparent oversized hit area so the marker is tappable on mobile */}
            <circle cx={video.mapX} cy={video.mapY} r="7" fill="transparent" />
            {/* Pulse animation ring - shows on selected, subtle on others */}
            <circle
              cx={video.mapX}
              cy={video.mapY}
              r={selectedIndex === i ? 4 : 3}
              fill="none"
              stroke={selectedIndex === i ? 'var(--portfolio-accent, #4A7C59)' : '#999'}
              strokeWidth="0.8"
              opacity={0.3}
            >
              {!reducedMotion && <animate attributeName="r" from="3" to="6" dur={selectedIndex === i ? '1.5s' : '2.5s'} repeatCount="indefinite" />}
              {!reducedMotion && <animate attributeName="opacity" from="0.4" to="0" dur={selectedIndex === i ? '1.5s' : '2.5s'} repeatCount="indefinite" />}
            </circle>
            {/* Main marker */}
            <circle
              cx={video.mapX}
              cy={video.mapY}
              r={selectedIndex === i ? 3 : 2}
              fill={selectedIndex === i ? 'var(--portfolio-accent, #4A7C59)' : '#999'}
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
                fill="var(--portfolio-accent, #4A7C59)"
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
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
          <g key={i} className="map-pin" tabIndex={0} role="button" aria-label={`${video.title} video`} aria-pressed={selectedIndex === i} style={{ cursor: 'pointer' }} onClick={() => onSelectVideo(i)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectVideo(i); } }}>
            <circle cx={video.mapX} cy={video.mapY} r="7" fill="transparent" />
            <circle
              cx={video.mapX}
              cy={video.mapY}
              r={selectedIndex === i ? 4 : 3}
              fill="none"
              stroke={selectedIndex === i ? 'var(--portfolio-accent, #4A7C59)' : '#999'}
              strokeWidth="0.8"
              opacity={0.3}
            >
              {!reducedMotion && <animate attributeName="r" from="3" to="6" dur={selectedIndex === i ? '1.5s' : '2.5s'} repeatCount="indefinite" />}
              {!reducedMotion && <animate attributeName="opacity" from="0.4" to="0" dur={selectedIndex === i ? '1.5s' : '2.5s'} repeatCount="indefinite" />}
            </circle>
            <circle
              cx={video.mapX}
              cy={video.mapY}
              r={selectedIndex === i ? 3 : 2}
              fill={selectedIndex === i ? 'var(--portfolio-accent, #4A7C59)' : '#999'}
              stroke="#fff"
              strokeWidth="1"
              style={{ transition: 'all 0.3s ease' }}
            />
            {selectedIndex === i && (
              <text
                x={video.mapX}
                y={video.mapY - 5}
                textAnchor="middle"
                fill="var(--portfolio-accent, #4A7C59)"
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

const skills = {
  languages: { title: 'Languages', items: ['Python', 'JavaScript', 'TypeScript', 'SQL', 'HTML/CSS', 'LaTeX'] },
  frameworks: { title: 'Frameworks & Libraries', items: ['React', 'SwiftUI', 'Discord.py', 'Pandas', 'NumPy', 'PyTorch'] },
  tools: { title: 'Tools', items: ['Claude Code', 'OpenAI Codex', 'Gemini & OpenAI APIs', 'Git/GitHub', 'Notion', 'Jira', 'CapCut'] },
  certs: { title: 'Certifications', items: ['Claude Certified Architect - Foundations (CCA-F)', 'Salesforce Platform Administrator'] }
};

// Interactive mockup for TweetFetch - Discord bot slideshow
const useTypedCommand = (command, animate) => {
  const [typedCommand, setTypedCommand] = useState(animate ? '' : command);

  useEffect(() => {
    if (!animate || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTypedCommand(command);
      return undefined;
    }

    setTypedCommand('');
    let index = 0;
    let timer;
    const pauses = [68, 54, 82, 61, 92, 58, 73, 124, 67, 86, 55, 78, 64, 96, 59, 74, 88];

    const typeNextCharacter = () => {
      if (index >= command.length) return;
      timer = window.setTimeout(() => {
        index += 1;
        setTypedCommand(command.slice(0, index));
        typeNextCharacter();
      }, pauses[index] || 72);
    };

    timer = window.setTimeout(typeNextCharacter, 240);
    return () => window.clearTimeout(timer);
  }, [animate, command]);

  return typedCommand;
};

// Interactive mockup for Synth - Discord bot text generation
const SynthMockup = ({ labVariant = false }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [completionIndex, setCompletionIndex] = useState(0);
  const [displayedCompletion, setDisplayedCompletion] = useState('');
  const [generationRun, setGenerationRun] = useState(0);
  const [selectedEngine, setSelectedEngine] = useState(0);
  const [typedPrompt, setTypedPrompt] = useState(labVariant ? '' : 'The best');

  const engines = ['GPT-3', 'CodeGen', 'FairseqGPT'];
  const prompt = 'The best';
  const promptIsReady = !labVariant || typedPrompt === prompt;

  const completions = [
    'The best time to visit a ski resort is in the summer. A lot of high end resorts drop their rates drastically because the snow is gone. The mountains look completely different when they are green, and it is a lot quieter than the winter season. You get to relax in peace and soak in the mountains by yourself.',
    "The best cat of all time is Ace. Follow him on instagram at @gaoacey to see what he's up to.",
    'The best food combo I enjoy is chicken and rice. There are so many different combinations and it always hits. I think I could eat Hainan chicken with rice every day for the rest of my life.',
    'The best travel advice for exploring small cities is to grab the free tourist pamphlets at the train station or look at the bulletin boards inside local cafes. I used to ignore them but they really do have some good stuff on there.',
    'The best way to manage a stream of thoughts is to just record yourself rambling and dump the transcript into an AI to organize it later. Writing makes me hesitate and constantly reread what I type, while talking out loud keeps everything raw and unfiltered.',
    'The best burger always includes tomatoes to keep it juicy and tasting fresh. Heavy sauces can easily drown a burger, but tomatoes add the right amount of moisture naturally.',
    "The best time to go hiking is on an overcast day. The gray sky creates a nice contrast that makes the green grass and trees look much deeper and more lush than usual. Plus, you don't have to worry about sunscreen! It just might rain or get a bit chilly.",
  ];
  const completion = completions[completionIndex];
  const completionAfterPrompt = completion.slice(prompt.length).trimStart();

  useEffect(() => {
    if (!labVariant) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTypedPrompt(prompt);
      return undefined;
    }
    setTypedPrompt('');
    let index = 0;
    let timer;
    const pauses = [92, 70, 118, 78, 132, 82, 108, 86];

    const typeNextCharacter = () => {
      if (index >= prompt.length) return;
      timer = window.setTimeout(() => {
        index += 1;
        setTypedPrompt(prompt.slice(0, index));
        typeNextCharacter();
      }, pauses[index]);
    };

    timer = window.setTimeout(typeNextCharacter, 240);
    return () => window.clearTimeout(timer);
  }, [labVariant]);

  useEffect(() => {
    if (!promptIsReady) return undefined;
    if (!labVariant || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayedCompletion(completionAfterPrompt);
      setIsGenerating(false);
      return undefined;
    }

    const words = completionAfterPrompt.match(/\S+\s*/g) || [];
    const chunkSizes = [3, 5, 4, 6, 3, 7, 4, 5];
    const pauses = [190, 145, 220, 165, 205, 135, 180, 155];
    let wordIndex = 0;
    let chunkIndex = 0;
    let timer;

    setDisplayedCompletion('');
    setIsGenerating(true);

    const streamNextChunk = () => {
      if (wordIndex >= words.length) {
        setIsGenerating(false);
        return;
      }

      const nextWordIndex = Math.min(wordIndex + chunkSizes[chunkIndex % chunkSizes.length], words.length);
      const chunk = words.slice(wordIndex, nextWordIndex).join('');
      wordIndex = nextWordIndex;
      setDisplayedCompletion((current) => current + chunk);

      timer = window.setTimeout(streamNextChunk, pauses[chunkIndex % pauses.length]);
      chunkIndex += 1;
    };

    timer = window.setTimeout(streamNextChunk, generationRun === 0 ? 240 : 140);
    return () => window.clearTimeout(timer);
  }, [completionAfterPrompt, generationRun, labVariant, promptIsReady]);

  const handleGenerate = () => {
    if (isGenerating) return;
    setCompletionIndex((index) => (index + 1) % completions.length);
    setGenerationRun((run) => run + 1);
  };

  return (
    <div className={labVariant ? 'synth-mockup' : undefined} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      {/* Command input bar */}
      <div style={{ background: 'var(--project-demo-dark-toolbar, #40444b)', borderRadius: labVariant ? '4px' : '8px', padding: labVariant ? '8px 10px' : '10px 14px', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        <span style={{ color: 'var(--project-demo-accent-on-dark, #96bee3)', fontSize: '11px', fontWeight: '600' }}>!gen</span>
        <span style={{ color: '#dcddde', fontSize: '11px' }}>{typedPrompt}<span style={{ opacity: typedPrompt.length < prompt.length ? 0.8 : 0 }}>|</span></span>
      </div>

      {/* Bot response card */}
      <div style={{ marginTop: labVariant ? '8px' : '12px', background: 'var(--project-demo-dark, #2f3136)', borderRadius: labVariant ? '3px' : '8px', borderLeft: '4px solid var(--project-demo-accent, #AA96DA)', padding: labVariant ? '8px' : '12px', flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: labVariant ? '6px' : '8px', flexShrink: 0 }}>
          <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--project-demo-control, #3479b7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'var(--project-demo-control-text, #f7fbff)', fontSize: '8px', fontWeight: '700' }}>S</span>
          </div>
          <span style={{ color: 'var(--project-demo-accent-on-dark, #96bee3)', fontSize: '11px', fontWeight: '600' }}>Synth</span>
          <span style={{ background: '#4752c4', color: '#fff', fontSize: '7px', padding: '2px 4px', borderRadius: '3px' }}>BOT</span>
        </div>

        {/* Engine selector */}
        <div role="group" aria-label="Text generation engine" style={{ display: 'flex', gap: '6px', marginBottom: labVariant ? '6px' : '8px', flexShrink: 0 }}>
          {engines.map((engine, i) => (
            <button
              type="button"
              key={engine}
              onClick={() => setSelectedEngine(i)}
              aria-pressed={selectedEngine === i}
              style={{
                background: selectedEngine === i ? 'var(--project-demo-control, #3479b7)' : 'var(--project-demo-dark-toolbar, #40444b)',
                color: selectedEngine === i ? 'var(--project-demo-control-text, #f7fbff)' : '#a6abb0',
                fontSize: '8px',
                padding: '6px 8px',
                minHeight: '28px',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {engine}
            </button>
          ))}
        </div>

        {/* Generated text - shows prompt + completion */}
        <div aria-live="polite" aria-atomic="true" style={{ flex: 1, background: 'var(--project-demo-dark-soft, #36393f)', borderRadius: labVariant ? '2px' : '6px', padding: labVariant ? '10px' : '10px', minHeight: labVariant ? 0 : '50px', overflow: 'hidden' }}>
          <p style={{ color: '#dcddde', fontSize: labVariant ? '12px' : '10px', lineHeight: labVariant ? 1.5 : 1.5, margin: 0 }}>
            <span style={{ color: 'var(--project-demo-accent-on-dark, #96bee3)' }}>{prompt}</span>{' '}
            {!promptIsReady ? (
              <span style={{ opacity: 0.5 }}>...</span>
            ) : (
              <>
                {displayedCompletion}
                {isGenerating && <span style={{ opacity: 0.55 }}>▍</span>}
              </>
            )}
          </p>
        </div>

        {/* Generate button */}
        <button
          type="button"
          onClick={handleGenerate}
          disabled={isGenerating}
          style={{
            marginTop: labVariant ? '6px' : '8px',
            background: isGenerating ? '#b8bdba' : 'var(--project-demo-control, #3479b7)',
            border: 'none',
            borderRadius: labVariant ? '4px' : '6px',
            padding: labVariant ? '5px 10px' : '6px 12px',
            cursor: isGenerating ? 'default' : 'pointer',
            color: isGenerating ? '#4b514e' : 'var(--project-demo-control-text, #f7fbff)',
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
const StockXGuessMockup = ({ labVariant = false }) => {
  const [guess, setGuess] = useState('');
  const [result, setResult] = useState(null);
  const [currentSneaker, setCurrentSneaker] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const inputRef = useRef(null);
  const roundTimerRef = useRef(null);

  const sneakers = [
    { name: 'Jordan 1 Retro', price: 180, bg: 'var(--project-demo-accent-wash, #FFE5E5)', accent: 'var(--project-demo-pastel-one, #E8B4B8)' },
    { name: 'Yeezy 350 V2', price: 230, bg: 'var(--project-demo-accent-soft, #E5F0FF)', accent: 'var(--project-demo-pastel-two, #A8D8EA)' },
    { name: 'Nike Dunk Low', price: 110, bg: 'var(--project-demo-accent-wash, #F0E5FF)', accent: 'var(--project-demo-pastel-three, #AA96DA)' },
  ];

  const handleGuess = () => {
    const guessNum = Number.parseInt(guess, 10);
    if (Number.isNaN(guessNum) || result || isFinished) return;
    const actual = sneakers[currentSneaker].price;
    const diff = Math.abs(guessNum - actual);
    const isCorrect = diff <= 20;
    const isLastSneaker = currentSneaker === sneakers.length - 1;

    setResult({ correct: isCorrect, actual });
    if (isCorrect) setScore((currentScore) => currentScore + 1);

    roundTimerRef.current = window.setTimeout(() => {
      setResult(null);
      setGuess('');
      if (isLastSneaker) {
        setIsFinished(true);
      } else {
        setCurrentSneaker((index) => index + 1);
      }
    }, 1500);
  };

  const playAgain = () => {
    window.clearTimeout(roundTimerRef.current);
    setGuess('');
    setResult(null);
    setCurrentSneaker(0);
    setScore(0);
    setIsFinished(false);
  };

  useEffect(() => () => window.clearTimeout(roundTimerRef.current), []);

  const sneaker = sneakers[currentSneaker];

  if (isFinished) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '14px' }}>
        <div style={{ fontSize: '10px', color: '#666d69' }}>Round complete</div>
        <div>
          <div aria-live="polite" style={{ fontSize: labVariant ? '38px' : '30px', fontWeight: '700', color: 'var(--project-demo-accent, #4A7C59)', lineHeight: 1 }}>{score}/{sneakers.length}</div>
          <div style={{ marginTop: '7px', fontSize: '11px', color: '#555' }}>Your final score</div>
        </div>
        <button
          type="button"
          onClick={playAgain}
          style={{ background: 'var(--project-demo-control, #3479b7)', border: 'none', borderRadius: '4px', padding: '8px 16px', color: 'var(--project-demo-control-text, #f7fbff)', fontSize: '10px', fontWeight: '700', cursor: 'pointer' }}
        >
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <div style={{ fontSize: labVariant ? '13px' : '11px', color: '#666d69', textAlign: 'center', marginBottom: '8px', flexShrink: 0, fontWeight: '600' }}>Guess the market price! (±$20)</div>

      {/* Sneaker card - centered */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: sneaker.bg, borderRadius: labVariant ? '8px' : '12px', padding: labVariant ? '18px 30px' : '16px 24px', textAlign: 'center' }}>
          <div style={{ width: labVariant ? '84px' : '60px', height: labVariant ? '44px' : '35px', background: sneaker.accent, borderRadius: labVariant ? '4px' : '6px', margin: '0 auto 10px', opacity: 0.82 }} />
          <div style={{ fontSize: '11px', fontWeight: '600', color: '#555' }}>{sneaker.name}</div>
        </div>
      </div>

      {result ? (
        <div role="status" aria-live="polite" style={{
          textAlign: 'center',
          padding: '12px',
          background: result.correct ? 'rgba(74,124,89,0.1)' : 'rgba(232,180,184,0.2)',
          borderRadius: '8px',
          flexShrink: 0,
        }}>
          <div style={{ fontSize: '10px', color: result.correct ? 'var(--project-demo-accent, #4A7C59)' : '#b8524b', fontWeight: '600' }}>
            {result.correct ? 'Nice!' : 'Not quite!'} Actual: ${result.actual}
          </div>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.focus()}
          style={{ background: 'var(--project-demo-surface, #f1f3f1)', borderRadius: '10px', padding: '8px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, cursor: 'text' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1 }}>
            <span style={{ color: 'var(--project-demo-accent, #4A7C59)', fontWeight: '600', fontSize: '12px' }}>$</span>
            <input
              ref={inputRef}
              type="number"
              inputMode="numeric"
              aria-label="Market price guess in dollars"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGuess()}
              placeholder="???"
              style={{ width: '100%', border: 'none', background: 'transparent', fontSize: '14px', outline: 'none', fontWeight: '600' }}
            />
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); handleGuess(); }}
            disabled={!guess}
            style={{ background: guess ? 'var(--project-demo-control, #3479b7)' : '#ccc', border: 'none', borderRadius: '6px', padding: '6px 14px', cursor: guess ? 'pointer' : 'default', color: guess ? 'var(--project-demo-control-text, #f7fbff)' : '#555', fontSize: '10px', fontWeight: '700', flexShrink: 0 }}
          >
            Guess
          </button>
        </div>
      )}
      <div aria-live="polite" aria-atomic="true" style={{ textAlign: 'center', marginTop: '8px', fontSize: '9px', color: '#666d69', flexShrink: 0 }}>
        Score: {score}/{sneakers.length}
      </div>
    </div>
  );
};

const CYBER_WALLETS = [
  {
    address: '0x7a2...f4e9',
    score: 704,
    activity: [40, 60, 45, 80, 55],
    signals: [
      { label: '30d transfers', value: '42', width: 82 },
      { label: 'Protocols', value: '9', width: 64 },
      { label: 'Tokens held', value: '24', width: 91 },
    ],
  },
  {
    address: '0x91c...a802',
    score: 318,
    activity: [18, 29, 12, 34, 21],
    signals: [
      { label: '30d transfers', value: '4', width: 16 },
      { label: 'Protocols', value: '2', width: 18 },
      { label: 'Tokens held', value: '3', width: 12 },
    ],
  },
  {
    address: '0x4bd...19c6',
    score: 846,
    activity: [52, 84, 70, 92, 73],
    signals: [
      { label: '30d transfers', value: '63', width: 94 },
      { label: 'Protocols', value: '12', width: 78 },
      { label: 'Tokens held', value: '31', width: 88 },
    ],
  },
];

// Interactive mockup for CyberCredit - animated dashboard
const CyberCreditMockup = ({ labVariant = false }) => {
  const [walletIndex, setWalletIndex] = useState(0);
  const [score, setScore] = useState(CYBER_WALLETS[0].score);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [barHeights, setBarHeights] = useState(CYBER_WALLETS[0].activity);
  const scoreAnimationRef = useRef(null);
  const analysisDelayRef = useRef(null);
  const wallet = CYBER_WALLETS[walletIndex];

  const analyzeWallet = () => {
    if (isAnalyzing) return;
    setIsAnalyzing(true);
    const nextWalletIndex = (walletIndex + 1) % CYBER_WALLETS.length;
    const nextWallet = CYBER_WALLETS[nextWalletIndex];
    const startingScore = score;
    analysisDelayRef.current = window.setTimeout(() => {
      setWalletIndex(nextWalletIndex);
      setBarHeights(nextWallet.activity);
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setScore(nextWallet.score);
        setIsAnalyzing(false);
        return;
      }

      const startTime = window.performance.now();
      const animateScore = (time) => {
        const progress = Math.min((time - startTime) / 1350, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        setScore(Math.round(startingScore + (nextWallet.score - startingScore) * easedProgress));

        if (progress < 1) {
          scoreAnimationRef.current = window.requestAnimationFrame(animateScore);
        } else {
          setIsAnalyzing(false);
        }
      };

      scoreAnimationRef.current = window.requestAnimationFrame(animateScore);
    }, 320);
  };

  useEffect(() => () => {
    window.clearTimeout(analysisDelayRef.current);
    window.cancelAnimationFrame(scoreAnimationRef.current);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', flexShrink: 0 }}>
        <div style={{ flex: 1, background: 'var(--project-demo-surface, #f1f3f1)', borderRadius: '8px', padding: '10px' }}>
          <div style={{ fontSize: '8px', color: '#666d69', marginBottom: '4px' }}>Credit Score</div>
          <div aria-live="polite" aria-atomic="true" style={{
            fontSize: '22px',
            fontWeight: '600',
            color: 'var(--project-demo-accent, #4A7C59)',
          }}>
            {score}
          </div>
        </div>
        <div style={{ flex: 1, background: 'var(--project-demo-surface, #f1f3f1)', borderRadius: '8px', padding: '10px' }}>
          <div style={{ fontSize: '8px', color: '#666d69', marginBottom: '4px' }}>Activity</div>
          <div style={{ display: 'flex', gap: '2px', alignItems: 'flex-end', height: '28px' }}>
            {barHeights.map((h, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: `${h}%`,
                  background: 'var(--project-demo-accent, #4A7C59)',
                  borderRadius: '2px 2px 0 0',
                  opacity: 0.4 + i * 0.12,
                  transition: `height 1.05s cubic-bezier(0.22, 1, 0.36, 1) ${80 + i * 45}ms`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div aria-live="polite" aria-atomic="true" style={{ background: 'var(--project-demo-surface, #f1f3f1)', borderRadius: '6px', padding: '8px 10px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <DitherAvatar name={wallet.address} hue={210} size={18} />
        <span style={{ fontSize: '9px', color: '#666d69', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>{wallet.address}</span>
      </div>

      {labVariant && <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '9px', padding: '4px 4px 12px' }}>
        {wallet.signals.map((signal, index) => (
          <div key={signal.label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', marginBottom: '3px', fontSize: '8px', color: '#666d69' }}>
              <span>{signal.label}</span>
              <strong style={{ color: '#444946', fontWeight: '600' }}>{signal.value}</strong>
            </div>
            <div style={{ height: '4px', background: 'var(--project-demo-accent-soft, #dce7df)', overflow: 'hidden' }}>
              <span style={{ display: 'block', width: `${signal.width}%`, height: '100%', background: 'var(--project-demo-accent, #4A7C59)', opacity: 0.5 + index * 0.14, transition: `width 1.05s cubic-bezier(0.22, 1, 0.36, 1) ${160 + index * 60}ms` }} />
            </div>
          </div>
        ))}
      </div>}

      <button
        type="button"
        onClick={analyzeWallet}
        disabled={isAnalyzing}
        style={{
          width: '100%',
          background: isAnalyzing ? '#ccc' : 'var(--project-demo-control, #3479b7)',
          border: 'none',
          borderRadius: '10px',
          padding: '14px 10px',
          color: isAnalyzing ? '#555' : 'var(--project-demo-control-text, #f7fbff)',
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
const ImageTaggerMockupDesktop = ({ labVariant = false }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showTags, setShowTags] = useState(true);

  const images = labVariant ? [
    { bg: 'linear-gradient(135deg, var(--project-demo-accent-soft, #dce7df), var(--project-demo-pastel-two, #A8D8EA))', tags: ['landscape', 'cool palette', 'soft light'] },
    { bg: 'repeating-radial-gradient(circle at 30% 60%, var(--project-demo-accent, #4A7C59) 0 2px, transparent 3px 9px), linear-gradient(145deg, var(--project-demo-pastel-one, #E8B4B8), var(--project-demo-accent-wash, #f5ece8))', tags: ['character', 'warm palette', 'linework'] },
    { bg: 'repeating-linear-gradient(45deg, transparent 0 9px, color-mix(in srgb, var(--project-demo-accent, #4A7C59) 35%, transparent) 10px 12px), linear-gradient(135deg, var(--project-demo-pastel-three, #AA96DA), var(--project-demo-accent-soft, #dce7df))', tags: ['abstract', 'shape study', 'texture'] },
  ] : [
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
        {labVariant && <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(var(--project-demo-accent, #4A7C59) 1.2px, transparent 1.6px)', backgroundSize: '7px 7px', WebkitMaskImage: 'radial-gradient(circle at 26% 56%, #000 0 12%, transparent 68%)', maskImage: 'radial-gradient(circle at 26% 56%, #000 0 12%, transparent 68%)', opacity: 0.78 }} aria-hidden="true" />}
        {isAnalyzing && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontSize: '11px' }}>Analyzing...</span>
          </div>
        )}
      </div>

      {/* Generated tags */}
      <div aria-live="polite" aria-atomic="true" style={{ background: 'var(--project-demo-surface, #f1f3f1)', borderRadius: '10px', padding: '12px', marginTop: '12px', flexShrink: 0 }}>
        <div style={{ fontSize: '9px', color: '#666d69', marginBottom: '8px' }}>Generated Tags:</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {showTags && image.tags.map((tag, i) => (
            <span
              key={tag}
              style={{
                background: 'var(--project-demo-control, #3479b7)',
                color: 'var(--project-demo-control-text, #f7fbff)',
                fontSize: '10px',
                padding: '4px 10px',
                borderRadius: '3px',
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
        type="button"
        onClick={handleAnalyze}
        disabled={isAnalyzing}
        style={{
          marginTop: '10px',
          width: '100%',
          background: isAnalyzing ? '#ccc' : 'var(--project-demo-control, #3479b7)',
          border: 'none',
          borderRadius: '8px',
          padding: '10px 8px',
          color: isAnalyzing ? '#555' : 'var(--project-demo-control-text, #f7fbff)',
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

const TweetFetchMockupDesktop = ({ labVariant = false }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideVisible, setSlideVisible] = useState(true);
  const typedCommand = useTypedCommand('compile favartist', labVariant);

  const slides = [
    { bg: 'var(--project-demo-pastel-one, #E8B4B8)', text: 'finally finished this piece after 3 weeks' },
    { bg: 'var(--project-demo-pastel-two, #A8D8EA)', text: 'day 247 of daily sketches' },
    { bg: 'var(--project-demo-pastel-three, #AA96DA)', text: 'commission for a friend' },
  ];

  const currentArt = slides[currentSlide];
  const changeSlide = (direction) => {
    if (!slideVisible) return;
    setSlideVisible(false);
    window.setTimeout(() => {
      setCurrentSlide((current) => (current + direction + slides.length) % slides.length);
      window.setTimeout(() => setSlideVisible(true), 30);
    }, labVariant ? 170 : 0);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      {/* Command input bar */}
      <div style={{ background: 'var(--project-demo-dark-toolbar, #40444b)', borderRadius: '8px', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        <span style={{ color: 'var(--project-demo-accent-on-dark, #96bee3)', fontSize: '12px', fontWeight: '600' }}>/</span>
        <span style={{ color: '#dcddde', fontSize: '11px' }}>{typedCommand}<span style={{ opacity: typedCommand.length < 17 ? .75 : 0 }}>|</span></span>
      </div>

      {/* Bot response card */}
      <div style={{ marginTop: '8px', background: 'var(--project-demo-dark, #2f3136)', borderRadius: '8px', borderLeft: '4px solid var(--project-demo-accent-on-dark, #96bee3)', padding: '10px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: labVariant ? 'center' : 'flex-start', minHeight: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--project-demo-control, #3479b7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'var(--project-demo-control-text, #f7fbff)', fontSize: '8px', fontWeight: '700' }}>TF</span>
          </div>
          <span style={{ color: 'var(--project-demo-accent-on-dark, #96bee3)', fontSize: '11px', fontWeight: '600' }}>TweetFetch</span>
          <span style={{ background: '#4752c4', color: '#fff', fontSize: '7px', padding: '2px 4px', borderRadius: '3px' }}>BOT</span>
        </div>

        {/* Response text */}
        <div style={{ fontSize: '10px', color: '#dcddde', marginBottom: '8px' }}>
          You liked <span style={{ color: 'var(--project-demo-accent-on-dark, #96bee3)', fontWeight: '600' }}>3</span> tweets by <span style={{ color: 'var(--project-demo-accent-on-dark, #96bee3)', fontWeight: '600' }}>@favartist</span>
        </div>

        {/* Image + metadata */}
        <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ borderRadius: labVariant ? '2px' : '8px', overflow: 'hidden', height: '70px', boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.15)', opacity: slideVisible ? 1 : 0, transform: slideVisible ? 'translateX(0)' : 'translateX(-12px)', transition: labVariant ? 'opacity 170ms ease, transform 170ms ease' : 'none' }}>
            <div style={{ width: '100%', height: '100%', background: currentArt.bg }} />
          </div>
          {/* Tweet text */}
          <div style={{ background: 'var(--project-demo-dark-soft, #36393f)', borderRadius: labVariant ? '2px' : '6px', padding: '6px', opacity: slideVisible ? 1 : 0, transition: labVariant ? 'opacity 170ms ease' : 'none' }}>
            <div style={{ fontSize: '9px', color: '#a6abb0' }}>{currentArt.text}</div>
          </div>
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px', flexShrink: 0 }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button type="button" aria-label="Previous archived tweet" onClick={() => changeSlide(-1)} style={{ background: 'var(--project-demo-control, #3479b7)', border: 'none', borderRadius: '2px', minWidth: '32px', minHeight: '32px', padding: '4px 10px', cursor: 'pointer', color: 'var(--project-demo-control-text, #f7fbff)', fontSize: '12px', fontWeight: '700' }}>←</button>
            <button type="button" aria-label="Next archived tweet" onClick={() => changeSlide(1)} style={{ background: 'var(--project-demo-control, #3479b7)', border: 'none', borderRadius: '2px', minWidth: '32px', minHeight: '32px', padding: '4px 10px', cursor: 'pointer', color: 'var(--project-demo-control-text, #f7fbff)', fontSize: '12px', fontWeight: '700' }}>→</button>
          </div>
          <span style={{ color: '#a6abb0', fontSize: '10px' }}>{currentSlide + 1} / {slides.length}</span>
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
  { c: EW.brown, svg: `<path d="M13 34 Q17 24 32 24 Q47 24 51 34 L47 45 Q32 52 17 45 Z" fill="${EW.brown}" ${EWS}/><path d="M15 34 Q22 28 32 28 Q42 28 49 34 Q42 40 32 40 Q22 40 15 34 Z" fill="${EW.cream}" ${EWS2}/><path d="M19 35 Q31 39 45 35" stroke="${EW.tan}" stroke-width="2" fill="none" stroke-linecap="round"/>` },
  { c: EW.brown, svg: `<path d="M32 10 C21 10 17 23 18 35 C19 49 24 56 32 56 C40 56 45 49 46 35 C47 23 43 10 32 10 Z" fill="${EW.brown}" ${EWS}/><path d="M29 17 Q25 31 30 48" stroke="${EW.tan}" stroke-width="3" fill="none" stroke-linecap="round" opacity=".55"/>` },
];
const EwFruit = ({ svg, size, labVariant = false }) => (
  <svg viewBox="0 0 64 64" style={{ width: size, height: size, display: 'block', filter: labVariant ? 'url(#wobble-erewhon)' : 'url(#wobble-calm)', overflow: 'visible' }} dangerouslySetInnerHTML={{ __html: svg }} aria-hidden="true" />
);
const EwBar = ({ w, h = 5, c = '#d9d9d6' }) => (
  <span style={{ display: 'block', width: w, height: h, borderRadius: 3, background: c }} />
);
const ErewhonMockup = ({ labVariant = false }) => {
  const [sel, setSel] = useState(0);
  const picks = [0, 1, 3, 2, 7, 12];
  const f = EW_FRUITS[sel];
  const ingredient = erewhonIngredients[sel];

  if (labVariant) {
    return (
      <div className="ew-ingredient-demo">
        <div className="ew-ingredient-stage" aria-live="polite">
          <div className="ew-ingredient-stage-art" style={{ background: `color-mix(in srgb, ${ingredient.color} 10%, white)` }}>
            <EwFruit svg={ingredient.svg} size={82} labVariant />
          </div>
          <div className="ew-ingredient-stage-copy">
            <strong style={{ color: ingredient.color }}>{ingredient.name}</strong>
            <span>in {ingredient.count} smoothies</span>
          </div>
        </div>
        <div className="ew-ingredient-picks" aria-label="Choose an ingredient">
          {erewhonIngredients.map((item, index) => (
            <button
              type="button"
              key={item.name}
              className={index === sel ? 'is-active' : ''}
              onClick={() => setSel(index)}
              aria-label={`Show ${item.name}, used in ${item.count} smoothies`}
              aria-pressed={index === sel}
              style={{ '--ingredient-color': item.color }}
            >
              <EwFruit svg={item.svg} size={34} labVariant />
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, justifyContent: 'center', gap: labVariant ? 16 : 22 }}>
      {labVariant && <div style={{ color: EW.ink, fontFamily: "'Libre Baskerville', serif", fontSize: 20 }}>Ingredients</div>}
      {/* big wobbling fruit + a few abstract bars */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ flexShrink: 0, width: 108, height: 108, borderRadius: 22, background: '#f5f5f3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <EwFruit svg={f.svg} size={74} labVariant={labVariant} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
          <EwBar w="52%" h={12} c={f.c} />
          {!labVariant && <EwBar w="100%" h={6} c="#d9d9d6" />}
          {!labVariant && <EwBar w="74%" h={6} c="#d9d9d6" />}
        </div>
      </div>
      {/* small row of fruits to pick from */}
      <div style={{ display: 'flex', gap: 9, justifyContent: 'center', flexShrink: 0 }}>
        {picks.map((idx) => {
          const on = sel === idx;
          return (
            <button key={idx} onClick={() => setSel(idx)} className="ew-pick" style={{ width: 48, height: 48, borderRadius: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: 'none', ...(on ? { background: `${EW_FRUITS[idx].c}14`, boxShadow: `0 0 0 2px ${EW_FRUITS[idx].c}` } : {}) }}>
              <EwFruit svg={EW_FRUITS[idx].svg} size={32} labVariant={labVariant} />
            </button>
          );
        })}
      </div>
    </div>
  );
};

// Precinct: the project idea reduced to a map and tappable precinct shapes.
const precinctColor = (dem) => {
  const share = Math.max(0, Math.min(1, dem / 100));
  const red = [217, 41, 41];
  const purple = [140, 64, 179];
  const blue = [33, 102, 230];
  const [from, to, amount] = share >= 0.5
    ? [purple, blue, (share - 0.5) * 2]
    : [red, purple, share * 2];
  const channel = (index) => Math.round(from[index] + (to[index] - from[index]) * amount);
  return `rgb(${channel(0)}, ${channel(1)}, ${channel(2)})`;
};
const PRECINCTS = [
  { name: 'AD 75, ED 14', loc: 'Manhattan, NY', lean: 'D+49', dem: 74, income: '$89k', turnout: '44%', x: '24%', y: '30%' },
  { name: 'Precinct 0331', loc: 'Houston, TX', lean: 'D+11', dem: 56, income: '$58k', turnout: '52%', x: '67%', y: '25%' },
  { name: 'Precinct 142', loc: 'McAllen, TX', lean: 'R+1', dem: 49, income: '$41k', turnout: '39%', x: '46%', y: '44%' },
];
const LAB_PRECINCTS = labPrecinctShapes.map((precinct) => ({
  ...precinct,
  name: `Precinct ${precinct.id}`,
  loc: 'San Francisco, CA',
  lean: precinct.id === '7516' ? 'D+87' : `D+${Math.round((precinct.dem - 50) * 2)}`,
}));
const PrecinctMockup = ({ labVariant = false }) => {
  const [sel, setSel] = useState(0);
  const [open, setOpen] = useState(labVariant);
  useEffect(() => {
    if (labVariant) return undefined;
    const timer = setTimeout(() => setOpen(true), 550);
    return () => clearTimeout(timer);
  }, [labVariant]);
  const p = labVariant ? LAB_PRECINCTS[sel] : PRECINCTS[sel];
  const c = precinctColor(p.dem);

  return (
    <div style={{ position: 'relative', flex: 1, minHeight: 0, borderRadius: 14, overflow: 'hidden', background: '#edf0ea' }}>
      {/* map paper: faint grid + a couple soft roads */}
      {labVariant ? (
        <div className="precinct-lab-map">
          <img src="/projects/precinctly/map.png" alt="Street map of Hayes Valley and the San Francisco Civic Center" />
          <svg className="precinct-lab-boundaries" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" aria-label="San Francisco precinct boundaries">
            {LAB_PRECINCTS.map((precinct, index) => {
              const active = index === sel;
              return (
                <g
                  key={precinct.id}
                  className={active ? 'is-active' : ''}
                  style={{ '--precinct-color': precinctColor(precinct.dem) }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Open San Francisco precinct ${precinct.id}, ${precinct.lean}`}
                  aria-pressed={active}
                  onClick={() => {
                    setSel(index);
                    setOpen(true);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      setSel(index);
                      setOpen(true);
                    }
                  }}
                >
                  {precinct.shapes.map((shape, shapeIndex) => (
                    <polygon key={`${precinct.id}-${shapeIndex}`} points={shape.map((point) => point.join(',')).join(' ')} />
                  ))}
                </g>
              );
            })}
          </svg>
        </div>
      ) : (
        <>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(#dde3d8 1px, transparent 1px), linear-gradient(90deg, #dde3d8 1px, transparent 1px)', backgroundSize: '20px 20px', opacity: 0.7 }} />
          <svg width="100%" height="100%" viewBox="0 0 100 70" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, display: 'block' }} aria-hidden="true">
            <path d="M-5 22 C 30 16, 55 34, 105 26" stroke="#d3dacb" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M40 -5 C 44 25, 30 45, 52 75" stroke="#d3dacb" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </svg>
        </>
      )}
      {/* precinct pins, colored by lean */}
      {!labVariant && PRECINCTS.map((pr, i) => {
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
            <div style={{ fontSize: 10.5, color: '#666d69', marginTop: 2 }}>{p.loc}</div>
          </div>
          <span style={{ fontFamily: 'var(--heading-font)', fontSize: 28, fontWeight: 600, color: c, lineHeight: 1, transition: 'color 0.25s ease', flexShrink: 0 }}>{p.lean}</span>
        </div>
        <div style={{ display: 'flex', height: 9, borderRadius: 6, overflow: 'hidden', marginTop: 9 }}>
          <div style={{ width: `${p.dem}%`, background: '#2166E6', transition: 'width 0.3s ease' }} />
          <div style={{ flex: 1, background: '#D92929' }} />
        </div>
        {labVariant ? (
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginTop: 8, fontSize: 10, color: '#5b616b' }}><span>{Math.round(p.dem)}% Dem</span><span>{Math.round(100 - p.dem)}% Rep</span></div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginTop: 10, fontSize: 10, color: '#5b616b' }}>
            <span><b style={{ color: '#2d2d2d', fontWeight: 600 }}>{p.income}</b> income</span>
            <span><b style={{ color: '#2d2d2d', fontWeight: 600 }}>{p.turnout}</b> turnout</span>
          </div>
        )}
      </div>
    </div>
  );
};

const ProjectMockup = ({ projectId, frameless = false }) => {
  const mockupStyle = {
    position: 'relative',
    width: '100%',
    maxWidth: frameless ? 'none' : '480px',
    aspectRatio: '4/3',
    borderRadius: frameless ? 0 : '20px',
    background: frameless ? 'transparent' : '#fff',
    overflow: 'hidden',
  };

  const contentStyle = {
    position: 'relative',
    zIndex: 1,
    padding: frameless ? (projectId === 'precinct' ? 0 : 'clamp(12px, 3%, 18px)') : '24px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  };

  const renderMockupContent = () => {
    switch (projectId) {
      case 'precinct':
        return <PrecinctMockup labVariant={frameless} />;
      case 'erewhon':
        return <ErewhonMockup labVariant={frameless} />;
      case 'image-tagger':
        return <ImageTaggerMockupDesktop labVariant={frameless} />;
      case 'tweetfetch':
        return <TweetFetchMockupDesktop labVariant={frameless} />;
      case 'synth':
        return <SynthMockup labVariant={frameless} />;
      case 'stockx-guess':
        return <StockXGuessMockup labVariant={frameless} />;
      case 'cybercredit':
        return <CyberCreditMockup labVariant={frameless} />;
      default:
        return null;
    }
  };

  return (
    <div style={mockupStyle} data-mockup-frame={frameless ? 'none' : 'wobbly'}>
      {!frameless && <WobblyFrameBorder radius={18} stroke="#8e918c" />}
      <div style={contentStyle}>
        {renderMockupContent()}
      </div>
    </div>
  );
};

const HikingTrail = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [resumeView, setResumeView] = useState('trail');

  const stops = [
    {
      id: 'wellesley', year: 'Childhood', title: 'Wellesley, MA', modalContent: { title: 'Wellesley, MA', bullets: ['My hometown.'] }, milestones: [
        { label: "Truly's", desc: '2018 - 2021', icon: IconIceCream, modalContent: { title: "Truly's Ice Cream", role: 'Team Member', date: '2018 - 2021', location: 'Wellesley, MA', bullets: [] } },
        { label: 'Code Ninjas', desc: '2020 - 2021', icon: IconCodeBrackets, modalContent: { title: 'Code Ninjas', role: 'Instructor', date: 'August 2020 - June 2021', location: 'Wellesley, MA', bullets: ['Taught coding in Scratch and JavaScript to groups of up to 10 students per session', 'Created and taught custom curricula for weekly summer coding camps', 'Facilitated mock hackathons for students, guiding them through the creation of their own games'] } },
      ]
    },
    {
      id: 'uci', year: '2021 - 2025', title: 'UC Irvine', desc: 'B.A. Business Admin & B.S. Computer Science', modalContent: { title: 'University of California, Irvine', subtitle: 'B.A. in Business Administration and B.S. in Computer Science', date: 'September 2021 - March 2025', location: 'Irvine, CA', bullets: ['Concentration in Finance for Business Administration', 'Concentration in Systems & Software for Computer Science'] }, milestones: [
        { label: 'Blockchain @ UCI', desc: 'President', icon: IconCyberCredit, modalContent: { title: 'Blockchain @ UCI Club', role: 'President', date: 'December 2021 - March 2025', location: 'Irvine, CA', bullets: ['Managed club event logistics, including booking rooms and flights, ordering supplies, and leading discussions', 'Integrated automated emailing software to distribute announcements and track metrics', 'Led communications for multiple partnerships, securing over $40,000 in club funding'] } },
        { label: 'Deloitte Consulting Intern', desc: 'Summer 2024', icon: IconBriefcase, modalContent: { title: 'Deloitte Consulting', role: 'Summer Scholar', date: 'June 2024 - August 2024', location: 'Costa Mesa, CA', bullets: [] } },
      ]
    },
    { id: 'alpher', year: '2023 - 2024', title: 'Alpher LLC', desc: 'Founder', modalContent: { title: 'Alpher LLC', subtitle: 'Founder', date: 'February 2023 - 2024', location: 'Remote', bullets: ['Founded a ticket brokering venture delivering high-demand event tickets to 400+ international customers', 'Generated 7 figures in revenue during year one', 'Recruited and mentored a team of 7', 'Used sales data to improve pricing and event selection'] }, milestones: [] },
    { id: 'deloitte', year: 'Since 2025', title: 'Deloitte Consulting', desc: 'Analyst', modalContent: { title: 'Deloitte Consulting', subtitle: 'Analyst', date: 'October 2025 - Present', location: 'Costa Mesa, CA', bullets: [] }, milestones: [] },
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

  const ResumeModal = ({ item, onClose, returnFocus }) => {
    return (
      <OverlayDialog
        id="resume-dialog"
        className="resume-dialog"
        labelledBy="resume-modal-title"
        closeLabel="Close resume details"
        onClose={onClose}
        returnFocus={returnFocus}
      >
        <header className="resume-dialog-header">
          {(item.role || item.subtitle) && (
            <p className="resume-dialog-kicker">{item.role || item.subtitle}</p>
          )}
          <h3 id="resume-modal-title">{item.title}</h3>
          {(item.date || item.location) && (
            <div className="resume-dialog-meta">
              {item.date && <span>{item.date}</span>}
              {item.location && <span>{item.location}</span>}
            </div>
          )}
        </header>
        {item.bullets?.length > 0 && (
          <div className="resume-dialog-body">
            <ul>
              {item.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </div>
        )}
      </OverlayDialog>
    );
  };

  const renderResumeStopButton = ({ stop, className = '' }) => (
    <button
      type="button"
      className={`resume-stop-card ${className}`}
      aria-haspopup="dialog"
      aria-controls="resume-dialog"
      onClick={(event) => {
        event.currentTarget.focus();
        setSelectedItem({ content: stop.modalContent, returnFocus: event.currentTarget });
      }}
    >
      <span className="resume-stop-year">{stop.year}</span>
      <strong>{stop.title}</strong>
      {stop.desc && <span className="resume-stop-description">{stop.desc}</span>}
      <span className="resume-stop-action">View details <ChevronRight size={13} /></span>
    </button>
  );

  const renderResumeMilestoneButton = ({ milestone, className = '', reactKey }) => {
    const MilestoneIcon = milestone.icon;

    return (
      <button
        key={reactKey}
        type="button"
        className={`resume-milestone-card ${className}`}
        aria-haspopup="dialog"
        aria-controls="resume-dialog"
        onClick={(event) => {
          event.currentTarget.focus();
          setSelectedItem({
            content: { ...milestone.modalContent, icon: milestone.icon },
            returnFocus: event.currentTarget,
          });
        }}
      >
        <span className="resume-milestone-icon"><MilestoneIcon size={17} /></span>
        <span>
          <strong>{milestone.label}</strong>
          <small>{milestone.desc}</small>
        </span>
      </button>
    );
  };

  const renderStopCard = ({ stop, side }) => (
    <div className={`resume-stop-group is-${side}`}>
      {renderResumeStopButton({ stop, className: 'is-trail' })}
      {stop.milestones.length > 0 && (
        <div className="resume-milestone-list is-trail">
          {stop.milestones.map((milestone) => renderResumeMilestoneButton({
            milestone,
            className: 'is-trail',
            reactKey: milestone.label,
          }))}
        </div>
      )}
    </div>
  );

  const renderCompactTimeline = ({ className = '' }) => (
    <div className={`resume-compact-layout ${className}`}>
      <div className="flex">
        <div className="flex flex-col items-center mr-4">
          <div className="resume-timeline-rail" aria-hidden="true">
            <div className="resume-timeline-rail-line" />
          </div>
        </div>
        <div className="flex flex-col gap-5 flex-1 pb-4">
          {stops.map((stop) => (
            <div key={stop.id} className="relative">
              <div className="absolute top-5 w-4 h-4 rounded-full" style={{ left: '-31px', backgroundColor: '#fff', border: '2px solid var(--portfolio-accent, #4A7C59)', boxShadow: '0 0 0 3px color-mix(in srgb, var(--portfolio-accent, #4A7C59) 15%, transparent)' }} />
              {renderResumeStopButton({ stop, className: 'is-compact' })}
              {stop.milestones.length > 0 && (
                <div className="resume-milestone-list is-compact">
                  {stop.milestones.map((milestone) => renderResumeMilestoneButton({
                    milestone,
                    className: 'is-compact',
                    reactKey: milestone.label,
                  }))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="resume-visual relative overflow-hidden">
      {/* MOBILE LAYOUT */}
      {renderCompactTimeline({ className: 'md:hidden px-4' })}

      {/* DESKTOP LAYOUT */}
      <div className="resume-desktop-layout hidden md:block">
        <div className="resume-view-switch" role="group" aria-label="Resume view">
          {['simple', 'trail'].map((view) => (
            <button
              key={view}
              type="button"
              className={resumeView === view ? 'is-active' : ''}
              aria-pressed={resumeView === view}
              onClick={() => setResumeView(view)}
            >
              {view === 'simple' ? 'Simple' : 'Trail'}
            </button>
          ))}
        </div>

        {resumeView === 'simple' ? (
          renderCompactTimeline({ className: 'resume-simple-view px-4' })
        ) : (
          <div className="resume-trail-layout">
        <div className="relative" style={{ minHeight: '920px' }}>
            <svg className="absolute top-0 right-0" width="620" height="350" viewBox="0 0 620 350" fill="none" style={{ pointerEvents: 'none' }}>
              <defs>
                <WobbleFilter id="resume-tree-wobble" />
              </defs>
              {trees.map((t, i) => (<g key={i} filter="url(#resume-tree-wobble)"><polygon points={`${t.x},${t.y - 20 * t.s} ${t.x - 12 * t.s},${t.y + 10 * t.s} ${t.x + 12 * t.s},${t.y + 10 * t.s}`} fill="#4A7C59" opacity={0.1 + (i % 5) * 0.03} /><polygon points={`${t.x},${t.y - 10 * t.s} ${t.x - 8 * t.s},${t.y + 6 * t.s} ${t.x + 8 * t.s},${t.y + 6 * t.s}`} fill="#3d6b4a" opacity={0.15 + (i % 4) * 0.04} /><rect x={t.x - 2} y={t.y + 8 * t.s} width="4" height={6 * t.s} fill="#8b7355" opacity="0.2" /></g>))}
            </svg>
            <svg className="absolute" style={{ top: '540px', right: 0, width: 'min(38vw, 420px)', height: 'auto', pointerEvents: 'none' }} viewBox="0 0 420 240" fill="none">
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
                <line x1="129" y1="160" x2="0" y2="160" stroke="rgba(255,255,255,0.9)" strokeWidth="4" strokeLinecap="round" />
                <line x1="137" y1="320" x2="200" y2="320" stroke="rgba(255,255,255,0.9)" strokeWidth="4" strokeLinecap="round" />
                <line x1="55" y1="560" x2="0" y2="560" stroke="rgba(255,255,255,0.9)" strokeWidth="4" strokeLinecap="round" />
                <line x1="104" y1="820" x2="200" y2="820" stroke="rgba(255,255,255,0.9)" strokeWidth="4" strokeLinecap="round" />
                <circle cx="129" cy="160" r="14" fill="#fff" stroke="var(--portfolio-accent, #4A7C59)" strokeWidth="4" />
                <circle cx="137" cy="320" r="14" fill="#fff" stroke="var(--portfolio-accent, #4A7C59)" strokeWidth="4" />
                <circle cx="55" cy="560" r="14" fill="#fff" stroke="var(--portfolio-accent, #4A7C59)" strokeWidth="4" />
                <circle cx="104" cy="820" r="14" fill="#fff" stroke="var(--portfolio-accent, #4A7C59)" strokeWidth="4" />
              </svg>
            </div>
            <div className="absolute right-1/2 pr-20 lg:pr-28" style={{ top: '100px' }}>{renderStopCard({ stop: stops[0], side: 'left' })}</div>
            <div className="absolute right-1/2 pr-20 lg:pr-28" style={{ top: '500px' }}>{renderStopCard({ stop: stops[2], side: 'left' })}</div>
            <div className="absolute left-1/2 pl-20 lg:pl-28" style={{ top: '260px' }}>{renderStopCard({ stop: stops[1], side: 'right' })}</div>
            <div className="absolute left-1/2 pl-20 lg:pl-28" style={{ top: '760px' }}>{renderStopCard({ stop: stops[3], side: 'right' })}</div>
        </div>
          </div>
        )}
      </div>


      {selectedItem && (
        <ResumeModal
          item={selectedItem.content}
          returnFocus={selectedItem.returnFocus}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
};

export { WobbleDefs, ProjectMockup, HikingTrail, TravelMap, AmericaMap, projects, skills, videos };
