import { useState } from 'react';

const grains = [
  {
    name: 'Basmati',
    len: 7.0, wid: 1.2,
    family: 'Indica',
    origin: 'India & Pakistan',
    dishes: 'Biryani, pilaf.',
  },
  {
    name: 'Jasmine',
    len: 6.3, wid: 2.0,
    family: 'Indica',
    origin: 'Thailand',
    dishes: 'Thai curries, rice bowls.',
  },
  {
    name: 'Japanese short-grain',
    len: 5.0, wid: 2.8,
    family: 'Japonica',
    origin: 'Japan',
    dishes: 'Sushi, onigiri.',
  },
  {
    name: 'Arborio',
    len: 7.0, wid: 3.1,
    family: 'Japonica',
    origin: 'Italy',
    dishes: 'Risotto.',
  },
];

const maxDim = Math.max(...grains.flatMap((g) => [g.len, g.wid]));
const SCALE = 80 / maxDim;

const ricePath = (lengthMm, widthMm) => {
  const L = (lengthMm * SCALE) / 2;
  const W = (widthMm * SCALE) / 2;
  return [
    `M ${-L} 0`,
    `C ${-L} ${-W * 0.95}, ${-L * 0.35} ${-W * 1.08}, ${L * 0.15} ${-W * 1.05}`,
    `C ${L * 0.7} ${-W * 1.02}, ${L} ${-W * 0.7}, ${L} 0`,
    `C ${L} ${W * 0.7}, ${L * 0.7} ${W * 1.02}, ${L * 0.15} ${W * 1.05}`,
    `C ${-L * 0.35} ${W * 1.08}, ${-L} ${W * 0.95}, ${-L} 0`,
    'Z',
  ].join(' ');
};

const familyColor = (family) => family === 'Indica' ? '#b5905a' : '#6b8e5a';

export default function GrainComparison() {
  const [selected, setSelected] = useState(2);
  const g = grains[selected];

  return (
    <div style={{ margin: '32px 0', padding: '22px 20px', background: '#fff', border: '1px solid #eee', borderRadius: '10px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', marginBottom: '18px' }}>
        {grains.map((grn, i) => {
          const isSel = selected === i;
          return (
            <button
              key={grn.name}
              onClick={() => setSelected(i)}
              style={{
                textAlign: 'center',
                padding: '14px 8px 12px',
                background: isSel ? '#faf7f1' : '#fafafa',
                border: `1px solid ${isSel ? '#d4c39a' : '#eee'}`,
                borderRadius: '8px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'background 0.2s, border-color 0.2s, transform 0.15s',
                transform: isSel ? 'translateY(-1px)' : 'translateY(0)',
              }}
            >
              <div style={{ height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                <svg viewBox="-50 -30 100 60" width="100%" height="60" preserveAspectRatio="xMidYMid meet" style={{ maxWidth: '100px' }}>
                  {/* All grains centered on y=0 so their grooves sit on the same horizontal axis */}
                  <path
                    d={ricePath(grn.len, grn.wid)}
                    fill="#efe2c4"
                    stroke="#b89960"
                    strokeWidth="0.6"
                  />
                  <line
                    x1={-(grn.len * SCALE) / 2 * 0.55}
                    y1="0"
                    x2={(grn.len * SCALE) / 2 * 0.55}
                    y2="0"
                    stroke="#b89960"
                    strokeWidth="0.4"
                    opacity="0.5"
                  />
                </svg>
              </div>
              <div style={{ fontSize: '12.5px', color: isSel ? '#222' : '#444', fontWeight: isSel ? 500 : 400, marginTop: '2px' }}>
                {grn.name}
              </div>
              <div style={{ fontSize: '10px', color: familyColor(grn.family), marginTop: '3px', letterSpacing: '0.8px', textTransform: 'uppercase', fontWeight: 500 }}>
                {grn.family}
              </div>
            </button>
          );
        })}
      </div>

      <div style={{ padding: '14px 16px', background: '#fafafa', borderRadius: '8px', fontSize: '13px', color: '#555', lineHeight: 1.6 }}>
        <div style={{ color: '#222', fontWeight: 500, marginBottom: '4px', fontSize: '13.5px' }}>
          {g.name}
          <span style={{ color: '#999', fontWeight: 400, marginLeft: '8px', fontSize: '12px' }}>
            · {g.family} · {g.origin}
          </span>
        </div>
        <div style={{ color: '#666' }}>{g.dishes}</div>
      </div>
    </div>
  );
}

// Small non-interactive preview of the Jasmine rice shape for the blog card.
export function GrainPreview() {
  const L = 40, W = 13;
  const path = [
    `M ${-L} 0`,
    `C ${-L} ${-W * 0.95}, ${-L * 0.35} ${-W * 1.08}, ${L * 0.15} ${-W * 1.05}`,
    `C ${L * 0.7} ${-W * 1.02}, ${L} ${-W * 0.7}, ${L} 0`,
    `C ${L} ${W * 0.7}, ${L * 0.7} ${W * 1.02}, ${L * 0.15} ${W * 1.05}`,
    `C ${-L * 0.35} ${W * 1.08}, ${-L} ${W * 0.95}, ${-L} 0`,
    'Z',
  ].join(' ');
  return (
    <svg viewBox="-50 -30 100 60" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" style={{ display: 'block' }}>
      <path d={path} fill="#efe2c4" stroke="#b89960" strokeWidth="0.8" />
      <line x1={-L * 0.55} y1="0" x2={L * 0.55} y2="0" stroke="#b89960" strokeWidth="0.5" opacity="0.5" />
    </svg>
  );
}
