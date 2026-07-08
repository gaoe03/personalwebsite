// Blog cover art, drawn in the erewhon sprite language: bold flat fills,
// ink outlines, minimal shapes. The wobble filters make them feel hand-drawn.

const C = {
  ink: '#2A2118',
  yellow: '#F0C24F',
  orange: '#E8893D',
  purple: '#7B5AA6',
  magenta: '#D9568C',
  pink: '#F2A7BB',
  peach: '#F0A284',
  blush: '#E87FA0',
  green: '#5E8C4F',
  deep: '#3F6B4F',
  lime: '#A4BE6C',
  blue: '#4F7BC0',
  sky: '#A8C8E8',
  brown: '#8A5A3B',
  cocoa: '#5C4030',
  teal: '#5E9C8F',
  tan: '#D9B98C',
  wheat: '#C68A4F',
  red: '#D8503C',
  cream: '#F6EDD8',
  white: '#FBF7EE',
};

const S = { stroke: C.ink, strokeWidth: 3, strokeLinecap: 'round', strokeLinejoin: 'round' };

// Two tiers: a barely-there boil for card borders, a livelier one for the art.
export const BlogWobbleDefs = () => (
  <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
    <defs>
      <filter id="blog-wobble-border" x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence data-wobble="slow" data-seeds="41,141,241" type="turbulence" baseFrequency="0.015 0.012" numOctaves="2" seed="41" result="warp" />
        <feDisplacementMap in="SourceGraphic" in2="warp" scale="1.7" xChannelSelector="R" yChannelSelector="G" />
      </filter>
      <filter id="blog-wobble-soft" x="-12%" y="-12%" width="124%" height="124%">
        <feTurbulence data-wobble="slow" data-seeds="63,163,263" type="turbulence" baseFrequency="0.013 0.01" numOctaves="2" seed="63" result="warp" />
        <feDisplacementMap in="SourceGraphic" in2="warp" scale="2.2" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </defs>
  </svg>
);

// Sketched border for cards and cover boxes; the parent must be position: relative.
export const SoftFrame = ({ radius = 12, stroke = '#c8ccc4', strokeWidth = 1.3 }) => (
  <svg className="soft-frame" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible', pointerEvents: 'none', zIndex: 2 }} aria-hidden="true">
    <rect x="2" y="2" width="calc(100% - 4px)" height="calc(100% - 4px)" rx={radius} fill="none" stroke={stroke} strokeWidth={strokeWidth} filter="url(#blog-wobble-border)" />
  </svg>
);

// A bowl of rice, steaming, chopsticks resting on the table beside it.
export const RiceScene = () => (
  <svg viewBox="0 0 320 180" style={{ display: 'block', width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    <g filter="url(#blog-wobble-soft)">
      {/* table line */}
      <path d="M-8 145 H328" fill="none" stroke={C.ink} strokeWidth="3" strokeLinecap="round" opacity="0.35" />

      {/* steam */}
      <path d="M144 60 C140 50 148 46 144 36" fill="none" stroke={C.ink} strokeWidth="2.5" opacity="0.45" strokeLinecap="round" />
      <path d="M174 58 C178 48 170 42 174 32" fill="none" stroke={C.ink} strokeWidth="2.5" opacity="0.45" strokeLinecap="round" />

      {/* rice mound */}
      <path d="M112 96 Q124 76 144 80 Q160 68 176 80 Q196 76 208 96 Z" fill={C.white} {...S} />
      <path d="M140 88 l7 -2 M160 82 l7 -1 M180 88 l7 -2" stroke={C.ink} strokeWidth="2" strokeLinecap="round" opacity="0.5" />

      {/* bowl, sitting on the table */}
      <path d="M104 96 H216 C213 124 195 137 160 137 C125 137 107 124 104 96 Z" fill={C.deep} {...S} />
      <path d="M147 137 h26 v8 h-26 Z" fill={C.deep} {...S} strokeWidth={2.5} />

      {/* chopsticks lying on the table beside the bowl */}
      <path d="M234 141 L292 129" stroke={C.wheat} strokeWidth="4.5" strokeLinecap="round" />
      <path d="M236 150 L294 138" stroke={C.wheat} strokeWidth="4.5" strokeLinecap="round" />
    </g>
  </svg>
);

// An environment inside the visor: goggle-shaped window, world drifting within.
export const MtHoodScene = () => (
  <svg viewBox="0 0 320 180" style={{ display: 'block', width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    <defs>
      <clipPath id="ve-visor">
        <rect x="76" y="44" width="168" height="92" rx="46" />
      </clipPath>
    </defs>
    <g clipPath="url(#ve-visor)">
      <rect x="76" y="44" width="168" height="92" fill={C.sky} opacity="0.45" />
      <g filter="url(#blog-wobble-soft)">
        <circle cx="212" cy="70" r="10" fill={C.yellow} {...S} strokeWidth={2.5} />
        <path d="M92 148 L150 68 L208 148 Z" fill={C.deep} {...S} />
        {/* snow cap covers the upper slopes, jagged snowline */}
        <path d="M127 100 L150 68 L173 100 L165 95 L159 101 L152 95 L145 101 L138 95 Z" fill={C.white} {...S} strokeWidth={2.5} />
        <path d="M196 148 L222 106 L248 148 Z" fill={C.green} {...S} strokeWidth={2.5} />
      </g>
    </g>
    {/* visor pane stays crisp */}
    <rect x="76" y="44" width="168" height="92" rx="46" fill="none" stroke={C.ink} strokeWidth="3.5" />
  </svg>
);

// The Photos bloom: eight rounded-rectangle "dog tag" petals radiating around
// a small white center, overlapping with multiply blend so the colors deepen
// into rich secondaries where they cross, the way the real app icon does.
export const CameraScene = () => {
  const hues = [32, 50, 115, 152, 205, 250, 315, 350];
  const W = 22, Yin = 8, Yout = 62, rc = 20;
  return (
    <svg viewBox="0 0 320 180" style={{ display: 'block', width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <g transform="translate(160 90)" filter="url(#blog-wobble-soft)">
        {hues.map((h, i) => (
          <rect
            key={i}
            x={-W}
            y={-Yout}
            width={2 * W}
            height={Yout - Yin}
            rx={rc}
            ry={rc}
            fill={`hsl(${h}, 66%, 57%)`}
            fillOpacity="0.62"
            style={{ mixBlendMode: 'multiply' }}
            transform={`rotate(${i * 45})`}
          />
        ))}
      </g>
    </svg>
  );
};
