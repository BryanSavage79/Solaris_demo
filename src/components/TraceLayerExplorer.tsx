import { useState, useEffect, useRef } from 'react';

// ── Color palette ──────────────────────────────────────────────────────
const C = {
  bg:      '#080c14',
  bg2:     '#0d1420',
  bg3:     '#121b2e',
  border:  '#1a2b42',
  text:    '#ddeeff',
  textMid: '#7aa8cc',
  textDim: '#3d6080',
  cyan:    '#00c8ff',
  gold:    '#f5a623',
  purple:  '#9b59ff',
};

// ── Keyframe CSS + fonts ───────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;800;900&family=Share+Tech+Mono&family=Rajdhani:wght@400;500;600;700&display=swap');

  @keyframes fade-in {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0);   }
  }
  @keyframes ring-spin {
    from { transform: rotate(0deg);   }
    to   { transform: rotate(360deg); }
  }
  @keyframes counter-spin {
    from { transform: rotate(0deg);    }
    to   { transform: rotate(-360deg); }
  }
  @keyframes pulse-glow {
    0%, 100% { opacity: 1;   }
    50%       { opacity: 0.3; }
  }
`;

// ── Primitive components ───────────────────────────────────────────────
interface GlassCardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  accent?: string;
}
const GlassCard = ({ children, style, accent }: GlassCardProps) => (
  <div style={{
    background: `linear-gradient(135deg, ${C.bg2}cc, ${C.bg3}80)`,
    border: `1px solid ${accent ? accent + '40' : C.border}`,
    borderRadius: 12,
    backdropFilter: 'blur(16px)',
    boxShadow: accent
      ? `0 4px 24px ${accent}12, inset 0 1px 0 ${accent}25`
      : `0 4px 20px rgba(0,0,0,0.35)`,
    ...style,
  }}>
    {children}
  </div>
);

interface ChipProps { label: string; color: string; }
const Chip = ({ label, color }: ChipProps) => (
  <span style={{
    display: 'inline-block',
    padding: '2px 9px',
    borderRadius: 20,
    fontSize: 10,
    fontWeight: 700,
    fontFamily: "'Share Tech Mono', monospace",
    letterSpacing: 1,
    color,
    border: `1px solid ${color}55`,
    background: `${color}18`,
  }}>
    {label}
  </span>
);

const HexBg = () => (
  <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
    <svg width="100%" height="100%" style={{ position: 'absolute', opacity: 0.035 }}>
      <defs>
        <pattern id="hex" x="0" y="0" width="60" height="52" patternUnits="userSpaceOnUse">
          <polygon points="30,2 58,17 58,47 30,62 2,47 2,17" fill="none" stroke={C.cyan} strokeWidth="1"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hex)"/>
    </svg>
  </div>
);

const Scanline = () => (
  <div style={{
    position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1,
    background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,200,255,0.008) 2px, rgba(0,200,255,0.008) 4px)',
  }}/>
);

// ── Bar helper ────────────────────────────────────────────────────────
interface MiniBarProps { pct: number; color: string; }
const MiniBar = ({ pct, color }: MiniBarProps) => (
  <div style={{ height: 3, background: C.bg3, borderRadius: 2 }}>
    <div style={{
      height: '100%',
      width: `${pct}%`,
      background: color,
      borderRadius: 2,
      boxShadow: `0 0 8px ${color}55`,
    }}/>
  </div>
);

// ── Row divider style ─────────────────────────────────────────────────
const rowBorder: React.CSSProperties = { borderBottom: `1px solid ${C.border}` };

// ── Panel definitions ─────────────────────────────────────────────────
type PanelFn = () => React.ReactElement;

const panels: Record<string, PanelFn> = {

  overview: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, animation: 'fade-in 0.4s ease' }}>
      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {[
          { label: 'ASSETS TRACKED', value: '481,204', color: C.cyan },
          { label: 'DPP PASSPORTS',  value: '18,492',  color: C.gold },
          { label: 'ACTIVE STEWARDS', value: '62',     color: C.purple },
          { label: 'IMPACT CREDITS',  value: '9,341',  color: C.cyan },
        ].map((k, i) => (
          <GlassCard key={i} style={{ padding: '14px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontFamily: "'Orbitron', sans-serif", fontWeight: 800, color: k.color }}>
              {k.value}
            </div>
            <div style={{ fontSize: 9, color: C.textDim, fontFamily: "'Share Tech Mono', monospace", letterSpacing: 1, marginTop: 4 }}>
              {k.label}
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Network health */}
      <GlassCard style={{ padding: 16 }} accent={C.cyan}>
        <div style={{ fontSize: 11, color: C.textDim, fontFamily: "'Share Tech Mono', monospace", letterSpacing: 1, marginBottom: 14 }}>
          NETWORK HEALTH
        </div>
        {[
          { label: 'Data Integrity',   pct: 100, color: C.cyan   },
          { label: 'Chain Latency',    pct: 97,  color: C.cyan   },
          { label: 'Steward Uptime',   pct: 99,  color: C.gold   },
          { label: 'DPP Coverage',     pct: 94,  color: C.purple },
        ].map((m, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 12, color: C.textMid }}>{m.label}</span>
              <span style={{ fontSize: 11, color: m.color, fontFamily: "'Orbitron', sans-serif" }}>{m.pct}%</span>
            </div>
            <MiniBar pct={m.pct} color={m.color}/>
          </div>
        ))}
      </GlassCard>

      {/* Recent activity */}
      <GlassCard style={{ padding: 16 }}>
        <div style={{ fontSize: 11, color: C.textDim, fontFamily: "'Share Tech Mono', monospace", letterSpacing: 1, marginBottom: 12 }}>
          RECENT ACTIVITY
        </div>
        {[
          { event: 'DPP Passport Issued',       actor: 'FACTORY-UA-EMEA-07', time: '2m ago',  color: C.cyan   },
          { event: 'Steward Threshold Met',     actor: 'COVENANT-CVN-0042',  time: '8m ago',  color: C.gold   },
          { event: 'Digital Twin Sync',         actor: 'TWIN-v2.4-BASE-L2',  time: '12m ago', color: C.purple },
          { event: 'Impact Credit Allocated',   actor: 'STEWARD-039',         time: '31m ago', color: C.cyan   },
          { event: 'Quarterly Audit Scheduled', actor: 'AUDITOR-EMEA-QA',    time: '1h ago',  color: C.gold   },
        ].map((a, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', ...rowBorder }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: a.color, flexShrink: 0, boxShadow: `0 0 6px ${a.color}` }}/>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, color: C.text }}>{a.event}</div>
              <div style={{ fontSize: 10, color: C.textDim, fontFamily: "'Share Tech Mono', monospace" }}>{a.actor}</div>
            </div>
            <span style={{ fontSize: 10, color: C.textDim, flexShrink: 0 }}>{a.time}</span>
          </div>
        ))}
      </GlassCard>
    </div>
  ),

  intelligence: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, animation: 'fade-in 0.4s ease' }}>
      <GlassCard style={{ padding: 16 }} accent={C.gold}>
        <div style={{ fontSize: 11, color: C.textDim, fontFamily: "'Share Tech Mono', monospace", letterSpacing: 1, marginBottom: 14 }}>
          BRAND INTELLIGENCE SCORE
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 16 }}>
          <div style={{ fontSize: 52, fontFamily: "'Orbitron', sans-serif", fontWeight: 900, color: C.gold, lineHeight: 1 }}>
            94
          </div>
          <div>
            <Chip label="ELITE TIER" color={C.gold}/>
            <div style={{ fontSize: 11, color: C.textMid, marginTop: 6 }}>Top 6% of brand partners</div>
          </div>
        </div>
        {[
          { label: 'Transparency Index', value: 98, color: C.cyan   },
          { label: 'Circular Score',     value: 91, color: C.gold   },
          { label: 'Steward Quality',    value: 96, color: C.purple },
          { label: 'Impact Efficiency',  value: 93, color: C.cyan   },
        ].map((m, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 12, color: C.textMid }}>{m.label}</span>
              <span style={{ fontSize: 11, color: m.color, fontFamily: "'Orbitron', sans-serif" }}>{m.value}</span>
            </div>
            <MiniBar pct={m.value} color={m.color}/>
          </div>
        ))}
      </GlassCard>

      <GlassCard style={{ padding: 16 }}>
        <div style={{ fontSize: 11, color: C.textDim, fontFamily: "'Share Tech Mono', monospace", letterSpacing: 1, marginBottom: 12 }}>
          SUPPLY CHAIN SIGNALS
        </div>
        {[
          { signal: 'Tier-1 Visibility',    status: 'HIGH',    c: C.cyan   },
          { signal: 'Material Provenance',  status: 'VERIFIED', c: C.cyan  },
          { signal: 'Carbon Accounting',    status: 'ACTIVE',  c: C.gold   },
          { signal: 'Recycled Content',     status: '34%',     c: C.purple },
          { signal: 'Water Stewardship',    status: 'MET',     c: C.cyan   },
          { signal: 'Social Compliance',    status: 'AUDITED', c: C.gold   },
        ].map((s, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', ...rowBorder }}>
            <span style={{ fontSize: 13, color: C.text }}>{s.signal}</span>
            <Chip label={s.status} color={s.c}/>
          </div>
        ))}
      </GlassCard>
    </div>
  ),

  brandwells: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, animation: 'fade-in 0.4s ease' }}>
      <GlassCard style={{ padding: 16 }} accent={C.purple}>
        <div style={{ fontSize: 11, color: C.textDim, fontFamily: "'Share Tech Mono', monospace", letterSpacing: 1, marginBottom: 14 }}>
          ACTIVE BRAND WELLS
        </div>
        {[
          { brand: 'Under Armour EMEA',  well: 'BW-001', assets: '18,492', score: 94, status: 'ACTIVE',  c: C.cyan   },
          { brand: 'Patagonia EU',        well: 'BW-002', assets: '9,881',  score: 99, status: 'ACTIVE',  c: C.cyan   },
          { brand: 'Adidas AG',           well: 'BW-003', assets: '41,203', score: 88, status: 'ACTIVE',  c: C.gold   },
          { brand: 'Lululemon EMEA',      well: 'BW-004', assets: '7,104',  score: 91, status: 'ACTIVE',  c: C.cyan   },
          { brand: 'Decathlon FR',        well: 'BW-005', assets: '2,300',  score: 77, status: 'PENDING', c: C.purple },
        ].map((b, i) => (
          <div key={i} style={{ padding: '12px 0', ...rowBorder }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{b.brand}</span>
              <Chip label={b.status} color={b.c}/>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 10, color: C.textDim, fontFamily: "'Share Tech Mono', monospace" }}>{b.well}</span>
              <span style={{ fontSize: 11, color: C.textMid }}>{b.assets} assets</span>
            </div>
            <MiniBar pct={b.score} color={b.c}/>
          </div>
        ))}
      </GlassCard>
    </div>
  ),

  stewards: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, animation: 'fade-in 0.4s ease' }}>
      <GlassCard style={{ padding: 16 }} accent={C.cyan}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: C.textDim, fontFamily: "'Share Tech Mono', monospace", letterSpacing: 1 }}>
            ACTIVE STEWARDS
          </div>
          <Chip label="62 / 50 THRESHOLD" color={C.cyan}/>
        </div>
        {[
          { id: 'STW-001', name: 'Factory EMEA-07',       role: 'MANUFACTURER', status: 'ACTIVE',   score: 98, c: C.cyan   },
          { id: 'STW-002', name: 'Porto Logistics Hub',   role: 'DISTRIBUTOR',  status: 'ACTIVE',   score: 94, c: C.cyan   },
          { id: 'STW-003', name: 'GreenCycle EU',         role: 'RECYCLER',     status: 'ACTIVE',   score: 92, c: C.gold   },
          { id: 'STW-004', name: 'Audit Collective EMEA', role: 'AUDITOR',      status: 'AUDITING', score: 88, c: C.purple },
          { id: 'STW-005', name: 'Tier-1 Textile Mills',  role: 'SUPPLIER',     status: 'ACTIVE',   score: 96, c: C.cyan   },
          { id: 'STW-006', name: 'Last Mile DE',          role: 'RETAILER',     status: 'ACTIVE',   score: 91, c: C.gold   },
        ].map((s, i) => (
          <div key={i} style={{ padding: '10px 0', ...rowBorder }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <div>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{s.name}</span>
                <span style={{ fontSize: 10, color: C.textDim, fontFamily: "'Share Tech Mono', monospace", marginLeft: 8 }}>{s.id}</span>
              </div>
              <Chip label={s.status} color={s.c}/>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: 10, color: C.textDim, fontFamily: "'Share Tech Mono', monospace", letterSpacing: 0.5 }}>{s.role}</span>
              <span style={{ fontSize: 11, color: s.c, fontFamily: "'Orbitron', sans-serif" }}>{s.score}</span>
            </div>
            <MiniBar pct={s.score} color={s.c}/>
          </div>
        ))}
      </GlassCard>

      <GlassCard style={{ padding: 16 }}>
        <div style={{ fontSize: 11, color: C.textDim, fontFamily: "'Share Tech Mono', monospace", letterSpacing: 1, marginBottom: 12 }}>
          STEWARD BREAKDOWN
        </div>
        {[
          { role: 'Manufacturers', count: 12, color: C.cyan   },
          { role: 'Distributors',  count: 18, color: C.gold   },
          { role: 'Retailers',     count: 14, color: C.purple },
          { role: 'Recyclers',     count: 8,  color: C.cyan   },
          { role: 'Auditors',      count: 6,  color: C.gold   },
          { role: 'Suppliers',     count: 4,  color: C.purple },
        ].map((r, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', ...rowBorder }}>
            <span style={{ fontSize: 12, color: C.text }}>{r.role}</span>
            <span style={{ fontSize: 13, color: r.color, fontFamily: "'Orbitron', sans-serif", fontWeight: 700 }}>{r.count}</span>
          </div>
        ))}
      </GlassCard>
    </div>
  ),

  covenant: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, animation: 'fade-in 0.4s ease' }}>
      <GlassCard style={{ padding: 16 }} accent={C.gold}>
        <div style={{ fontSize: 11, color: C.textDim, fontFamily: "'Share Tech Mono', monospace", letterSpacing: 1, marginBottom: 16 }}>
          ACTIVE COVENANT
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { label: 'Partner',    value: 'Under Armour EMEA',  color: undefined },
            { label: 'Covenant ID', value: 'CVN-0042-UA-EMEA', color: undefined },
            { label: 'Established', value: 'Q1 2026',           color: undefined },
            { label: 'Status',      value: 'RATIFIED',          color: C.cyan    },
            { label: 'Renewal',     value: 'Q1 2027',           color: undefined },
          ].map((r, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', ...rowBorder }}>
              <span style={{ fontSize: 12, color: C.textDim, fontFamily: "'Share Tech Mono', monospace" }}>{r.label}</span>
              <span style={{ fontSize: 13, color: r.color ?? C.text, fontWeight: 600 }}>{r.value}</span>
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard style={{ padding: 16 }}>
        <div style={{ fontSize: 11, color: C.textDim, fontFamily: "'Share Tech Mono', monospace", letterSpacing: 1, marginBottom: 12 }}>
          COVENANT TERMS
        </div>
        {[
          { term: 'DPP Compliance',         status: 'MET',     c: C.cyan   },
          { term: 'Impact Credit Floor',    status: 'MET',     c: C.cyan   },
          { term: 'Steward Threshold (50)', status: 'MET',     c: C.cyan   },
          { term: 'ULIQ Floor (750)',        status: 'MET',     c: C.cyan   },
          { term: 'Quarterly Audit',         status: 'PENDING', c: C.gold  },
        ].map((t, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', ...rowBorder }}>
            <span style={{ fontSize: 13, color: C.text }}>{t.term}</span>
            <Chip label={t.status} color={t.c}/>
          </div>
        ))}
      </GlassCard>
    </div>
  ),

  digitaltwin: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, animation: 'fade-in 0.4s ease' }}>
      <GlassCard style={{ padding: 16 }} accent={C.purple}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <span style={{ fontSize: 11, color: C.textDim, fontFamily: "'Share Tech Mono', monospace", letterSpacing: 1 }}>
            DIGITAL TWIN STATUS
          </span>
          <Chip label="SYNCED" color={C.purple}/>
        </div>

        {/* SVG Orbit rings */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <div style={{ position: 'relative', width: 120, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="120" height="120" style={{ position: 'absolute' }}>
              <circle
                cx="60" cy="60" r="50"
                fill="none"
                stroke={`${C.purple}22`}
                strokeWidth="1"
                strokeDasharray="6 6"
                style={{ animation: 'ring-spin 15s linear infinite', transformOrigin: '60px 60px' }}
              />
              <circle
                cx="60" cy="60" r="38"
                fill="none"
                stroke={`${C.cyan}30`}
                strokeWidth="1"
                strokeDasharray="3 3"
                style={{ animation: 'counter-spin 10s linear infinite', transformOrigin: '60px 60px' }}
              />
              <circle cx="60" cy="60" r="26" fill={`${C.purple}18`} stroke={C.purple} strokeWidth="1.5"/>
              <text x="60" y="55" textAnchor="middle" fontSize="9" fill={C.purple} fontFamily="'Share Tech Mono'">TWIN</text>
              <text x="60" y="68" textAnchor="middle" fontSize="10" fill="white" fontFamily="'Orbitron'" fontWeight="700">v2.4</text>
            </svg>
          </div>
        </div>

        {[
          { label: 'Last Sync',       value: '2m ago'       },
          { label: 'Data Points',     value: '481,204'      },
          { label: 'Integrity Hash',  value: '0x3f9a...d71c' },
          { label: 'Chain',           value: 'Base L2'      },
        ].map((r, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', ...rowBorder }}>
            <span style={{ fontSize: 12, color: C.textDim, fontFamily: "'Share Tech Mono', monospace" }}>{r.label}</span>
            <span style={{ fontSize: 13, color: C.text }}>{r.value}</span>
          </div>
        ))}
      </GlassCard>
    </div>
  ),

  dpp: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, animation: 'fade-in 0.4s ease' }}>
      <GlassCard style={{ padding: 16 }} accent={C.cyan}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontSize: 11, color: C.textDim, fontFamily: "'Share Tech Mono', monospace", letterSpacing: 1 }}>
            EU DPP COMPLIANCE
          </span>
          <Chip label="COMPLIANT" color={C.cyan}/>
        </div>

        {/* KPI pair */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontFamily: "'Orbitron', sans-serif", fontWeight: 800, color: C.cyan }}>18,492</div>
            <div style={{ fontSize: 10, color: C.textDim, fontFamily: "'Share Tech Mono', monospace" }}>PASSPORTS ISSUED</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontFamily: "'Orbitron', sans-serif", fontWeight: 800, color: C.gold }}>100%</div>
            <div style={{ fontSize: 10, color: C.textDim, fontFamily: "'Share Tech Mono', monospace" }}>INTEGRITY RATE</div>
          </div>
        </div>

        {[
          { cat: 'Footwear',  count: 8412, pct: 100 },
          { cat: 'Apparel',   count: 6218, pct: 100 },
          { cat: 'Equipment', count: 3862, pct: 100 },
        ].map((c, i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 12, color: C.textMid }}>{c.cat}</span>
              <span style={{ fontSize: 11, color: C.cyan, fontFamily: "'Orbitron', sans-serif" }}>
                {c.count.toLocaleString()}
              </span>
            </div>
            <MiniBar pct={c.pct} color={C.cyan}/>
          </div>
        ))}
      </GlassCard>
    </div>
  ),
};

// ── Nav tabs config ────────────────────────────────────────────────────
const NAV = [
  { id: 'overview',      label: 'Overview',     icon: '◈' },
  { id: 'intelligence',  label: 'Intelligence', icon: '⬡' },
  { id: 'brandwells',    label: 'Brand Wells',  icon: '◉' },
  { id: 'stewards',      label: 'Stewards',     icon: '⬟' },
  { id: 'covenant',      label: 'Covenant',     icon: '◇' },
  { id: 'digitaltwin',   label: 'Digital Twin', icon: '⊕' },
  { id: 'dpp',           label: 'DPP',          icon: '✦' },
];

// ── Main App ───────────────────────────────────────────────────────────
export default function TraceLayerExplorer() {
  const [tab, setTab]         = useState('overview');
  const [menuOpen, setMenuOpen] = useState(false);
  const [ticker, setTicker]   = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  // live ticker
  useEffect(() => {
    const t = setInterval(() => setTicker(n => n + 1), 3000);
    return () => clearInterval(t);
  }, []);

  // close menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const activeTab = NAV.find(n => n.id === tab);
  const Panel = panels[tab];

  return (
    <>
      <style>{css}</style>
      <HexBg/>
      <Scanline/>

      <div style={{ position: 'relative', zIndex: 2, minHeight: '100vh', maxWidth: 600, margin: '0 auto', padding: '80px 0' }}>

        {/* ── Header ── */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 100,
          background: `${C.bg}e8`,
          backdropFilter: 'blur(16px)',
          borderBottom: `1px solid ${C.border}`,
          padding: '12px 16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

            {/* Logo + wordmark */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ position: 'relative', width: 36, height: 36 }}>
                <svg width="36" height="36" viewBox="0 0 36 36">
                  <polygon points="18,2 32,10 32,26 18,34 4,26 4,10" fill="none" stroke={C.cyan} strokeWidth="1.5"/>
                  <polygon points="18,8 27,13 27,23 18,28 9,23 9,13" fill={`${C.cyan}15`} stroke={`${C.cyan}55`} strokeWidth="1"/>
                  <circle cx="18" cy="18" r="4" fill={C.cyan} style={{ filter: `drop-shadow(0 0 6px ${C.cyan})` }}/>
                </svg>
              </div>
              <div>
                <div style={{ fontSize: 16, fontFamily: "'Orbitron', sans-serif", fontWeight: 800, color: C.text, letterSpacing: 1, lineHeight: 1.2 }}>
                  TRACE<span style={{ color: C.cyan }}>LAYER</span>
                </div>
                <div style={{ fontSize: 9, color: C.textDim, fontFamily: "'Share Tech Mono', monospace", letterSpacing: 2 }}>
                  PROTOCOL EXPLORER
                </div>
              </div>
            </div>

            {/* Live indicator + menu button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: C.cyan,
                  boxShadow: `0 0 8px ${C.cyan}`,
                  animation: 'pulse-glow 2s ease infinite',
                }}/>
                <span style={{ fontSize: 9, color: C.textDim, fontFamily: "'Share Tech Mono', monospace" }}>LIVE</span>
              </div>

              {/* Hamburger */}
              <button
                onClick={() => setMenuOpen(v => !v)}
                style={{ background: 'none', border: `1px solid ${C.border}`, borderRadius: 6, padding: '6px 10px', cursor: 'pointer', color: C.text, display: 'flex', flexDirection: 'column', gap: 4 }}
              >
                {([0, 1, 2] as const).map(i => (
                  <div key={i} style={{
                    width: 18, height: 1.5,
                    background: menuOpen
                      ? (i === 1 ? 'transparent' : C.cyan)
                      : C.textMid,
                    transform: menuOpen
                      ? (i === 0 ? 'rotate(45deg) translate(4px, 4px)'
                        : i === 2 ? 'rotate(-45deg) translate(4px, -4px)'
                        : 'none')
                      : 'none',
                    transition: 'all 0.2s ease',
                  }}/>
                ))}
              </button>
            </div>
          </div>

          {/* ── Dropdown Menu ── */}
          {menuOpen && (
            <div ref={menuRef} style={{
              position: 'absolute', top: '100%', right: 16, width: 220,
              background: `${C.bg2}f0`,
              border: `1px solid ${C.border}`,
              borderRadius: 8, overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(0,0,0,0.45)',
              backdropFilter: 'blur(20px)',
              animation: 'fade-in 0.2s ease',
            }}>
              {NAV.map((n, i) => (
                <button
                  key={n.id}
                  onClick={() => { setTab(n.id); setMenuOpen(false); }}
                  style={{
                    width: '100%', padding: '12px 16px',
                    background: tab === n.id ? `${C.cyan}18` : 'transparent',
                    border: 'none',
                    borderBottom: i < NAV.length - 1 ? `1px solid ${C.border}` : 'none',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12,
                    color: tab === n.id ? C.cyan : C.text, textAlign: 'left',
                  }}
                >
                  <span style={{ fontSize: 16, width: 20, textAlign: 'center', color: tab === n.id ? C.cyan : C.textDim }}>{n.icon}</span>
                  <span style={{ fontSize: 14, fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}>{n.label}</span>
                  {tab === n.id && <div style={{ marginLeft: 'auto', width: 4, height: 4, borderRadius: '50%', background: C.cyan }}/>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Section header ── */}
        <div style={{ padding: '16px 16px 8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 20, color: C.cyan }}>{activeTab?.icon}</span>
            <span style={{ fontSize: 18, fontFamily: "'Orbitron', sans-serif", fontWeight: 600, color: C.text }}>
              {activeTab?.label.toUpperCase()}
            </span>
          </div>
          <div style={{ fontSize: 10, color: C.textDim, fontFamily: "'Share Tech Mono', monospace", letterSpacing: 1, marginTop: 2 }}>
            CYCLE::{String(ticker).padStart(4, '0')} · TRACELAYER/V1
          </div>
        </div>

        {/* ── Tab content ── */}
        <div style={{ padding: '0 12px' }}>
          {Panel && <Panel/>}
        </div>

        {/* ── Bottom tab bar (quick access) ── */}
        <div style={{
          position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
          width: '100%', maxWidth: 600,
          background: `${C.bg}ee`,
          borderTop: `1px solid ${C.border}`,
          backdropFilter: 'blur(16px)',
          padding: '8px 12px',
          display: 'flex', justifyContent: 'space-around',
          zIndex: 100,
        }}>
          {NAV.slice(0, 5).map(n => (
            <button
              key={n.id}
              onClick={() => setTab(n.id)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '4px 8px' }}
            >
              <span style={{
                fontSize: 18,
                color: tab === n.id ? C.cyan : C.textDim,
                transition: 'color 0.2s',
                filter: tab === n.id ? `drop-shadow(0 0 6px ${C.cyan})` : 'none',
              }}>{n.icon}</span>
              <span style={{
                fontSize: 8,
                color: tab === n.id ? C.cyan : C.textDim,
                fontFamily: "'Share Tech Mono', monospace",
                letterSpacing: 0.5,
              }}>{n.label.split(' ')[0].toUpperCase()}</span>
            </button>
          ))}
          <button
            onClick={() => setMenuOpen(v => !v)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '4px 8px' }}
          >
            <span style={{ fontSize: 18, color: C.textDim }}>⋯</span>
            <span style={{ fontSize: 8, color: C.textDim, fontFamily: "'Share Tech Mono', monospace", letterSpacing: 0.5 }}>MORE</span>
          </button>
        </div>

      </div>
    </>
  );
}
