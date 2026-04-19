import { useState } from 'react';

// x: 0 FIRM -> 10 SOFT
// y: 0 STICKY -> 10 SMOOTH
// Coordinates on the rice factory's 1–10 scale (x: FIRM→SOFT, y: STICKY→SMOOTH).
const varieties = [
  { name: 'Koshihikari',         origin: 'Niigata',  x: 10, y: 3, use: 'Benchmark Japanese rice. Sushi, donburi, eaten plain.' },
  { name: 'Yumepirika',          origin: 'Hokkaido', x: 9,  y: 2, use: "Hokkaido's flagship. Sticky and soft, often eaten plain." },
  { name: 'Milky Queen',         origin: 'Nagano',   x: 8,  y: 1, use: 'Extra sticky. Onigiri, mochi, sweet rice dishes.' },
  { name: 'Akitakomachi',        origin: 'Akita',    x: 5,  y: 5, use: 'Balanced and all-purpose. One of the most common rices in Japan.' },
  { name: 'Nanatsuboshi',        origin: 'Hokkaido', x: 4,  y: 7, use: 'Firmer, holds up when cold. Usually used for bento.' },
  { name: 'Sasanishiki',         origin: 'Nagano',   x: 3,  y: 8, use: 'Classic sushi rice. Firmer than most.' },
];

const originColors = {
  'Niigata':  '#3d5a7c',
  'Hokkaido': '#4a7a9c',
  'Akita':    '#8e6b5a',
  'Nagano':   '#6b8e5a',
};

const W = 400, H = 400, PAD = 52;
// 1-10 scale: v=1 lands at left/top edge, v=10 at right/bottom, center crosshair at v=5.5.
const toPx = (v) => PAD + ((v - 1) / 9) * (W - PAD * 2);

export default function FlavorMatrix() {
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [originFilter, setOriginFilter] = useState(null);

  const active = selected !== null ? selected : hovered;
  const isVisible = (v) => !originFilter || v.origin === originFilter;
  const origins = Array.from(new Set(varieties.map((v) => v.origin)));

  return (
    <div style={{ margin: '32px auto', maxWidth: '500px' }}>
      <div style={{ position: 'relative', width: '100%', aspectRatio: '1 / 1' }}>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" style={{ background: '#fafafa', borderRadius: '10px', border: '1px solid #eee' }}>
          <defs>
            <filter id="dotShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="1.5" stdDeviation="2" floodColor="#000" floodOpacity="0.2" />
            </filter>
          </defs>

          {/* Grid */}
          {[2, 4, 6, 8].map((t) => (
            <g key={t} stroke="#eee" strokeWidth="0.5">
              <line x1={toPx(t)} y1={PAD} x2={toPx(t)} y2={H - PAD} />
              <line x1={PAD} y1={toPx(t)} x2={W - PAD} y2={toPx(t)} />
            </g>
          ))}
          {/* Axes */}
          <line x1={W / 2} y1={PAD} x2={W / 2} y2={H - PAD} stroke="#bbb" strokeWidth="1" />
          <line x1={PAD} y1={H / 2} x2={W - PAD} y2={H / 2} stroke="#bbb" strokeWidth="1" />
          {/* Axis labels */}
          <text x={W / 2} y={PAD - 14} textAnchor="middle" fontSize="11" fontWeight="600" fill="#555" letterSpacing="1.5">STICKY</text>
          <text x={W / 2} y={H - PAD + 22} textAnchor="middle" fontSize="11" fontWeight="600" fill="#555" letterSpacing="1.5">SMOOTH</text>
          <text x={PAD - 10} y={H / 2 + 4} textAnchor="end" fontSize="11" fontWeight="600" fill="#555" letterSpacing="1.5">FIRM</text>
          <text x={W - PAD + 10} y={H / 2 + 4} textAnchor="start" fontSize="11" fontWeight="600" fill="#555" letterSpacing="1.5">SOFT</text>

          {/* Dots */}
          {varieties.map((v, i) => {
            const isSel = selected === i;
            const isHov = hovered === i;
            // Filter dims non-matching dots. Selected/hovered always override.
            const dimmed = !isSel && !isHov && !isVisible(v);
            const r = isSel ? 10 : isHov ? 8 : 6;
            return (
              <g
                key={i}
                style={{ cursor: 'pointer' }}
                onClick={() => setSelected(isSel ? null : i)}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                <circle
                  cx={toPx(v.x)}
                  cy={toPx(v.y)}
                  r={r}
                  fill={originColors[v.origin]}
                  stroke="#fff"
                  strokeWidth="2"
                  opacity={dimmed ? 0.25 : 1}
                  filter={isSel || isHov ? 'url(#dotShadow)' : undefined}
                  style={{ transition: 'r 0.15s ease, opacity 0.2s ease' }}
                />
                {/* Hover label */}
                {isHov && !isSel && (
                  <g style={{ pointerEvents: 'none' }}>
                    <rect
                      x={toPx(v.x) - (v.name.length * 3.2 + 10)}
                      y={toPx(v.y) - 28}
                      width={v.name.length * 6.4 + 20}
                      height="20"
                      rx="4"
                      fill="#222"
                    />
                    <text
                      x={toPx(v.x)}
                      y={toPx(v.y) - 14}
                      textAnchor="middle"
                      fontSize="11"
                      fill="#fff"
                    >
                      {v.name}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Detail panel */}
      <div style={{
        minHeight: '76px',
        marginTop: '14px',
        padding: '14px 16px',
        background: '#fff',
        border: '1px solid #eee',
        borderRadius: '8px',
        fontSize: '13px',
        color: '#555',
        transition: 'border-color 0.2s',
        borderColor: active !== null
          ? originColors[varieties[active].origin] + '40'
          : originFilter
          ? originColors[originFilter] + '40'
          : '#eee',
      }}>
        {active !== null ? (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <span style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: originColors[varieties[active].origin],
              flexShrink: 0,
              marginTop: '4px',
            }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: '#222', fontWeight: 500, fontSize: '14px' }}>
                {varieties[active].name}
                <span style={{ color: '#999', fontWeight: 400, marginLeft: '8px', fontSize: '12.5px' }}>
                  · {varieties[active].origin}
                </span>
              </div>
              <div style={{ color: '#666', fontSize: '13px', marginTop: '4px', lineHeight: 1.5 }}>
                {varieties[active].use}
              </div>
            </div>
          </div>
        ) : originFilter ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <span style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: originColors[originFilter],
                flexShrink: 0,
              }} />
              <div style={{ color: '#222', fontWeight: 500, fontSize: '14px' }}>{originFilter}</div>
            </div>
            {varieties.filter((v) => v.origin === originFilter).map((v) => (
              <div key={v.name} style={{ marginBottom: '6px', paddingLeft: '18px' }}>
                <span style={{ color: '#222', fontWeight: 500 }}>{v.name}</span>
                <span style={{ color: '#666', marginLeft: '6px' }}>— {v.use}</span>
              </div>
            ))}
          </div>
        ) : (
          <span style={{ color: '#aaa' }}>Hover or tap a dot to see the variety.</span>
        )}
      </div>

      {/* Legend / filter */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '12px' }}>
        {origins.map((origin) => {
          const isActive = originFilter === origin;
          return (
            <button
              key={origin}
              onClick={() => {
                if (isActive) {
                  setOriginFilter(null);
                } else {
                  setOriginFilter(origin);
                  const matching = varieties
                    .map((v, i) => ({ v, i }))
                    .filter(({ v }) => v.origin === origin);
                  // Single variety: auto-select it. Multiple: show region summary.
                  setSelected(matching.length === 1 ? matching[0].i : null);
                }
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: '14px',
                background: isActive ? originColors[origin] : '#fff',
                color: isActive ? '#fff' : '#666',
                border: `1px solid ${isActive ? originColors[origin] : '#eee'}`,
                fontSize: '11.5px',
                fontFamily: 'inherit',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              <span style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: isActive ? '#fff' : originColors[origin],
              }} />
              {origin}
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: '14px', fontSize: '11px', color: '#aaa', fontStyle: 'italic' }}>
        Data from the rice factory's best-selling charts.
      </div>
    </div>
  );
}

// Tiny non-interactive version for the blog card preview
export function FlavorMatrixPreview() {
  const pw = 120, ph = 90, pad = 10;
  const pxx = (v) => pad + ((v - 1) / 9) * (pw - pad * 2);
  const pxy = (v) => pad + ((v - 1) / 9) * (ph - pad * 2);
  return (
    <svg viewBox={`0 0 ${pw} ${ph}`} width="100%" height="100%" style={{ display: 'block' }}>
      <line x1={pw / 2} y1={pad} x2={pw / 2} y2={ph - pad} stroke="#ccc" strokeWidth="0.5" />
      <line x1={pad} y1={ph / 2} x2={pw - pad} y2={ph / 2} stroke="#ccc" strokeWidth="0.5" />
      {varieties.map((v, i) => (
        <circle key={i} cx={pxx(v.x)} cy={pxy(v.y)} r="2.2" fill={originColors[v.origin]} />
      ))}
    </svg>
  );
}
