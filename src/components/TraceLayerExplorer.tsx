import { useState, useEffect, useRef } from 'react';
import {
  actors,
  actorById,
  actorCountByType,
  dppAccessCounts,
  dppAccessLog,
  eventLabel,
  lifecycleEventsDesc,
  velocoreX1Class,
  velocoreX1Instance,
} from '../data/tracelayerSeedData';

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

  overview: () => {
    const currentActor = actorById[velocoreX1Instance.current_actor_id];
    const totalAccess = dppAccessLog.length;
    const eventColors: Record<string, string> = {
      produced: C.cyan,
      quality_check: C.cyan,
      shipped: C.gold,
      checkpoint_scan: C.gold,
      received_inventory: C.purple,
      sold: C.gold,
      consumer_activation: C.cyan,
    };
    return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, animation: 'fade-in 0.4s ease' }}>
      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {[
          { label: 'TRACKED INSTANCE', value: '1',                                     color: C.cyan   },
          { label: 'LIFECYCLE STATE',  value: velocoreX1Instance.lifecycle_state.replace(/_/g, ' ').toUpperCase(), color: C.gold },
          { label: 'ACTIVE STEWARDS',  value: String(actors.length),                   color: C.purple },
          { label: 'DPP ACCESS EVENTS', value: String(totalAccess),                    color: C.cyan   },
        ].map((k, i) => (
          <GlassCard key={i} style={{ padding: '14px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontFamily: "'Orbitron', sans-serif", fontWeight: 800, color: k.color, lineHeight: 1.2 }}>
              {k.value}
            </div>
            <div style={{ fontSize: 9, color: C.textDim, fontFamily: "'Share Tech Mono', monospace", letterSpacing: 1, marginTop: 4 }}>
              {k.label}
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Product snapshot */}
      <GlassCard style={{ padding: 16 }} accent={C.cyan}>
        <div style={{ fontSize: 11, color: C.textDim, fontFamily: "'Share Tech Mono', monospace", letterSpacing: 1, marginBottom: 14 }}>
          PRODUCT SNAPSHOT — VELOCORE X1
        </div>
        {[
          { label: 'SKU',            value: velocoreX1Class.sku,                   color: C.cyan   },
          { label: 'Serial',         value: velocoreX1Instance.serial_number,      color: C.text   },
          { label: 'Current Owner',  value: `@${velocoreX1Instance.owner_handle}`, color: C.gold   },
          { label: 'Current Custodian', value: currentActor?.name ?? '—',          color: C.text   },
          { label: 'Carbon Footprint', value: `${velocoreX1Instance.carbon_footprint_kg} kg CO₂e`, color: C.purple },
        ].map((r, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', ...rowBorder }}>
            <span style={{ fontSize: 11, color: C.textDim, fontFamily: "'Share Tech Mono', monospace" }}>{r.label}</span>
            <span style={{ fontSize: 12, color: r.color, fontWeight: 600, maxWidth: '60%', textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.value}</span>
          </div>
        ))}
      </GlassCard>

      {/* Recent activity (seed lifecycle events, reverse-chrono) */}
      <GlassCard style={{ padding: 16 }}>
        <div style={{ fontSize: 11, color: C.textDim, fontFamily: "'Share Tech Mono', monospace", letterSpacing: 1, marginBottom: 12 }}>
          RECENT ACTIVITY
        </div>
        {lifecycleEventsDesc.slice(0, 5).map((e, i) => {
          const actor = e.actor_id ? actorById[e.actor_id] : null;
          const color = eventColors[e.event_type] ?? C.cyan;
          const dateStr = new Date(e.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', ...rowBorder }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0, boxShadow: `0 0 6px ${color}` }}/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, color: C.text }}>{eventLabel(e.event_type)}</div>
                <div style={{ fontSize: 10, color: C.textDim, fontFamily: "'Share Tech Mono', monospace", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {actor ? actor.name : `@${velocoreX1Instance.owner_handle}`}
                </div>
              </div>
              <span style={{ fontSize: 10, color: C.textDim, flexShrink: 0 }}>{dateStr}</span>
            </div>
          );
        })}
      </GlassCard>
    </div>
    );
  },

  intelligence: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, animation: 'fade-in 0.4s ease' }}>
      <GlassCard style={{ padding: 16 }} accent={C.gold}>
        <div style={{ fontSize: 11, color: C.textDim, fontFamily: "'Share Tech Mono', monospace", letterSpacing: 1, marginBottom: 14 }}>
          BRAND INTELLIGENCE — STRIDECORE EU
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
          { label: 'Circular Score',     value: Math.round(velocoreX1Class.recycled_content_pct), color: C.gold   },
          { label: 'Repairability',      value: Math.round(velocoreX1Class.repairability_score * 10), color: C.purple },
          { label: 'DPP Integrity',      value: 100, color: C.cyan   },
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
          { signal: 'Country of Origin',   status: velocoreX1Class.country_of_origin,          c: C.cyan   },
          { signal: 'Material Provenance', status: 'VERIFIED',                                  c: C.cyan   },
          { signal: 'CE Marking',          status: velocoreX1Class.ce_marking ? 'YES' : 'NO',  c: C.gold   },
          { signal: 'Recycled Content',    status: `${velocoreX1Class.recycled_content_pct}%`,  c: C.purple },
          { signal: 'Substances Cleared',  status: 'ALL PASS',                                  c: C.cyan   },
          { signal: 'DPP Profile',         status: velocoreX1Class.dpp_profile.toUpperCase(),   c: C.gold   },
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
          { brand: 'Stridecore Athletic EU', well: 'BW-001', assets: '1', score: 94, status: 'ACTIVE',  c: C.cyan   },
        ].map((b, i) => (
          <div key={i} style={{ padding: '12px 0', ...rowBorder }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{b.brand}</span>
              <Chip label={b.status} color={b.c}/>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 10, color: C.textDim, fontFamily: "'Share Tech Mono', monospace" }}>{b.well}</span>
              <span style={{ fontSize: 11, color: C.textMid }}>{b.assets} tracked instance</span>
            </div>
            <MiniBar pct={b.score} color={b.c}/>
          </div>
        ))}
      </GlassCard>

      <GlassCard style={{ padding: 16 }}>
        <div style={{ fontSize: 11, color: C.textDim, fontFamily: "'Share Tech Mono', monospace", letterSpacing: 1, marginBottom: 12 }}>
          MATERIAL COMPOSITION
        </div>
        {velocoreX1Class.material_composition.map((m, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 11, color: C.textMid }}>{m.material}</span>
              <span style={{ fontSize: 10, color: C.textDim, fontFamily: "'Share Tech Mono', monospace" }}>{m.pct}% · {m.origin}</span>
            </div>
            <MiniBar pct={m.pct} color={i % 2 === 0 ? C.cyan : C.gold}/>
          </div>
        ))}
      </GlassCard>
    </div>
  ),

  stewards: () => {
    const roleColorMap: Record<string, string> = {
      manufacturer: C.cyan,
      brand:        C.gold,
      distributor:  C.gold,
      retailer:     C.purple,
      repairer:     C.cyan,
      recycler:     C.cyan,
      regulator:    C.purple,
    };
    return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, animation: 'fade-in 0.4s ease' }}>
      <GlassCard style={{ padding: 16 }} accent={C.cyan}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: C.textDim, fontFamily: "'Share Tech Mono', monospace", letterSpacing: 1 }}>
            ACTIVE STEWARDS
          </div>
          <Chip label={`${actors.length} ACTORS`} color={C.cyan}/>
        </div>
        {actors.map((a, i) => {
          const color = roleColorMap[a.type] ?? C.cyan;
          return (
            <div key={i} style={{ padding: '10px 0', ...rowBorder }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{a.name}</span>
                  <span style={{ fontSize: 10, color: C.textDim, fontFamily: "'Share Tech Mono', monospace", marginLeft: 8 }}>{a.country_code}</span>
                </div>
                <Chip label={a.verified ? 'VERIFIED' : 'UNVERIFIED'} color={a.verified ? C.cyan : C.gold}/>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: 10, color: C.textDim, fontFamily: "'Share Tech Mono', monospace", letterSpacing: 0.5 }}>{a.type.toUpperCase()}</span>
                {a.onchain_handle && <span style={{ fontSize: 10, color: color, fontFamily: "'Share Tech Mono', monospace" }}>{a.onchain_handle}</span>}
              </div>
            </div>
          );
        })}
      </GlassCard>

      <GlassCard style={{ padding: 16 }}>
        <div style={{ fontSize: 11, color: C.textDim, fontFamily: "'Share Tech Mono', monospace", letterSpacing: 1, marginBottom: 12 }}>
          STEWARD BREAKDOWN
        </div>
        {(Object.entries(actorCountByType) as [string, number][]).map(([role, count], i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', ...rowBorder }}>
            <span style={{ fontSize: 12, color: C.text, textTransform: 'capitalize' }}>{role}s</span>
            <span style={{ fontSize: 13, color: roleColorMap[role] ?? C.cyan, fontFamily: "'Orbitron', sans-serif", fontWeight: 700 }}>{count}</span>
          </div>
        ))}
      </GlassCard>
    </div>
    );
  },

  covenant: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, animation: 'fade-in 0.4s ease' }}>
      <GlassCard style={{ padding: 16 }} accent={C.gold}>
        <div style={{ fontSize: 11, color: C.textDim, fontFamily: "'Share Tech Mono', monospace", letterSpacing: 1, marginBottom: 16 }}>
          ACTIVE COVENANT
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { label: 'Partner',     value: 'Stridecore Athletic Europe BV', color: undefined },
            { label: 'Covenant ID', value: 'CVN-SC-EU-2025',               color: undefined },
            { label: 'Established', value: 'Q1 2025',                       color: undefined },
            { label: 'Status',      value: 'RATIFIED',                      color: C.cyan    },
            { label: 'Renewal',     value: 'Q1 2026',                       color: undefined },
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
          { term: 'CE Marking',             status: 'MET',     c: C.cyan   },
          { term: 'ESPR Substance Checks',  status: 'MET',     c: C.cyan   },
          { term: 'Circularity Programme',  status: 'ACTIVE',  c: C.cyan   },
          { term: 'Quarterly Audit',        status: 'PENDING', c: C.gold   },
        ].map((t, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', ...rowBorder }}>
            <span style={{ fontSize: 13, color: C.text }}>{t.term}</span>
            <Chip label={t.status} color={t.c}/>
          </div>
        ))}
      </GlassCard>
    </div>
  ),

  digitaltwin: () => {
    const onchainTx = lifecycleEventsDesc.find(e => e.onchain_tx)?.onchain_tx ?? '';
    const shortTx = onchainTx ? `${onchainTx.slice(0, 10)}…${onchainTx.slice(-6)}` : '—';
    return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, animation: 'fade-in 0.4s ease' }}>
      <GlassCard style={{ padding: 16 }} accent={C.purple}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <span style={{ fontSize: 11, color: C.textDim, fontFamily: "'Share Tech Mono', monospace", letterSpacing: 1 }}>
            DIGITAL TWIN STATUS
          </span>
          <Chip label="ACTIVE" color={C.purple}/>
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
              <text x="60" y="68" textAnchor="middle" fontSize="9" fill="white" fontFamily="'Orbitron'" fontWeight="700">NFC</text>
            </svg>
          </div>
        </div>

        {[
          { label: 'Serial Number',   value: velocoreX1Instance.serial_number       },
          { label: 'NFC Carrier',     value: velocoreX1Instance.data_carrier_id     },
          { label: 'Lifecycle State', value: velocoreX1Instance.lifecycle_state.replace(/_/g, ' ') },
          { label: 'Owner Handle',    value: `@${velocoreX1Instance.owner_handle}`  },
          { label: 'Activated',       value: new Date(velocoreX1Instance.activated_at).toLocaleDateString('en-GB') },
          { label: 'Warranty Expires', value: new Date(velocoreX1Instance.warranty_expires).toLocaleDateString('en-GB') },
          { label: 'On-Chain TX',     value: shortTx },
        ].map((r, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', ...rowBorder }}>
            <span style={{ fontSize: 12, color: C.textDim, fontFamily: "'Share Tech Mono', monospace" }}>{r.label}</span>
            <span style={{ fontSize: 11, color: C.text, maxWidth: '55%', textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.value}</span>
          </div>
        ))}
      </GlassCard>
    </div>
    );
  },

  dpp: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, animation: 'fade-in 0.4s ease' }}>
      <GlassCard style={{ padding: 16 }} accent={C.cyan}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontSize: 11, color: C.textDim, fontFamily: "'Share Tech Mono', monospace", letterSpacing: 1 }}>
            EU DPP — VELOCORE X1
          </span>
          <Chip label="COMPLIANT" color={C.cyan}/>
        </div>

        {/* Product profile summary */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontFamily: "'Orbitron', sans-serif", fontWeight: 800, color: C.cyan }}>{velocoreX1Class.recycled_content_pct}%</div>
            <div style={{ fontSize: 10, color: C.textDim, fontFamily: "'Share Tech Mono', monospace" }}>RECYCLED CONTENT</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontFamily: "'Orbitron', sans-serif", fontWeight: 800, color: C.gold }}>{velocoreX1Class.repairability_score}/10</div>
            <div style={{ fontSize: 10, color: C.textDim, fontFamily: "'Share Tech Mono', monospace" }}>REPAIRABILITY</div>
          </div>
        </div>

        {/* CE + profile */}
        {[
          { label: 'CE Marking',        value: velocoreX1Class.ce_marking ? 'YES' : 'NO',       color: C.cyan   },
          { label: 'DPP Profile',       value: velocoreX1Class.dpp_profile.toUpperCase(),        color: C.gold   },
          { label: 'GTIN',              value: velocoreX1Class.gtin,                             color: C.text   },
          { label: 'Spare Parts',       value: `${velocoreX1Class.spare_parts.length} available`, color: C.cyan  },
        ].map((r, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', ...rowBorder }}>
            <span style={{ fontSize: 11, color: C.textDim, fontFamily: "'Share Tech Mono', monospace" }}>{r.label}</span>
            <span style={{ fontSize: 12, color: r.color, fontWeight: 600 }}>{r.value}</span>
          </div>
        ))}
      </GlassCard>

      {/* DPP Access summary */}
      <GlassCard style={{ padding: 16 }}>
        <div style={{ fontSize: 11, color: C.textDim, fontFamily: "'Share Tech Mono', monospace", letterSpacing: 1, marginBottom: 12 }}>
          DPP ACCESS SUMMARY
        </div>
        {[
          { tier: 'Public',       count: dppAccessCounts['public']       ?? 0, color: C.cyan   },
          { tier: 'Professional', count: dppAccessCounts['professional'] ?? 0, color: C.gold   },
          { tier: 'Regulator',    count: dppAccessCounts['regulator']    ?? 0, color: C.purple },
        ].map((r, i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 12, color: C.textMid }}>{r.tier}</span>
              <span style={{ fontSize: 11, color: r.color, fontFamily: "'Orbitron', sans-serif" }}>{r.count}</span>
            </div>
            <MiniBar pct={Math.max((r.count / dppAccessLog.length) * 100, 10)} color={r.color}/>
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
