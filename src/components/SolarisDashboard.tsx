import { useState, useEffect } from "react";

// ── Ascendii color tokens ──────────────────────────────────────────────
const C = {
  bg0: "#020b18",
  bg1: "#071426",
  bg2: "#0c1e3a",
  bg3: "#112244",
  cyan: "#00e5c8",
  gold: "#e8a020",
  purple: "#7b4fff",
  red: "#ff4d6d",
  text: "#d6eef8",
  textDim: "#4a7090",
  textMid: "#8aaec8",
  border: "#1a3455",
};

const css = `
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;800;900&family=Rajdhani:wght@300;400;500;600&family=Share+Tech+Mono&display=swap');

@keyframes pulse-glow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
@keyframes scan-line {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100vh); }
}
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-6px); }
}
@keyframes data-stream {
  0% { opacity: 0; transform: translateX(-8px); }
  100% { opacity: 1; transform: translateX(0); }
}
@keyframes ring-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@keyframes counter-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(-360deg); }
}
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
`;

// ── Scan line effect ────────────────────────────────────────────────────
const ScanLine = () => (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      height: 2,
      background: `${C.cyan}40`,
      animation: "scan-line 8s linear infinite",
      pointerEvents: "none",
      zIndex: 1,
    }}
  />
);

// ── Corner bracket decoration ───────────────────────────────────────────
type CornerPos = "topLeft" | "topRight" | "bottomLeft" | "bottomRight";

const Corner = ({ pos }: { pos: CornerPos }) => {
  const size = 14;
  const s: Record<CornerPos, React.CSSProperties> = {
    topLeft: { top: 0, left: 0, borderTop: `2px solid ${C.cyan}`, borderLeft: `2px solid ${C.cyan}` },
    topRight: { top: 0, right: 0, borderTop: `2px solid ${C.cyan}`, borderRight: `2px solid ${C.cyan}` },
    bottomLeft: { bottom: 0, left: 0, borderBottom: `2px solid ${C.cyan}`, borderLeft: `2px solid ${C.cyan}` },
    bottomRight: { bottom: 0, right: 0, borderBottom: `2px solid ${C.cyan}`, borderRight: `2px solid ${C.cyan}` },
  };
  return <div style={{ position: "absolute", width: size, height: size, ...s[pos] }} />;
};

// ── Glass card ──────────────────────────────────────────────────────────
interface GlassCardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  accent?: string;
  glow?: boolean;
}

const GlassCard = ({ children, style = {}, accent = C.cyan, glow = true }: GlassCardProps) => (
  <div
    style={{
      position: "relative",
      background: `${C.bg1}cc`,
      border: `1px solid ${accent}40`,
      borderRadius: 8,
      backdropFilter: "blur(12px)",
      boxShadow: glow ? `0 0 20px ${accent}15, inset 0 1px 0 ${accent}10` : "none",
      overflow: "hidden",
      ...style,
    }}
  >
    <Corner pos="topLeft" />
    <Corner pos="topRight" />
    <Corner pos="bottomLeft" />
    <Corner pos="bottomRight" />
    {children}
  </div>
);

// ── Label chip ─────────────────────────────────────────────────────────
const Chip = ({ label, color = C.cyan }: { label: string; color?: string }) => (
  <span
    style={{
      display: "inline-block",
      padding: "2px 10px",
      borderRadius: 2,
      border: `1px solid ${color}60`,
      background: `${color}15`,
      color,
      fontSize: 10,
      fontFamily: "'Share Tech Mono', monospace",
      letterSpacing: 1,
      textTransform: "uppercase",
    }}
  >
    {label}
  </span>
);

// ── Stat block ─────────────────────────────────────────────────────────
interface StatProps {
  label: string;
  value: string | number;
  unit?: string;
  color?: string;
  delta?: number;
}

const Stat = ({ label, value, unit, color = C.cyan, delta }: StatProps) => (
  <div style={{ animation: "data-stream 0.4s ease" }}>
    <div
      style={{
        fontSize: 11,
        color: C.textDim,
        fontFamily: "'Share Tech Mono', monospace",
        letterSpacing: 1,
        marginBottom: 4,
      }}
    >
      {label.toUpperCase()}
    </div>
    <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
      <span style={{ fontSize: 28, fontFamily: "'Orbitron', monospace", fontWeight: 700, color }}>{value}</span>
      {unit && <span style={{ fontSize: 12, color: C.textMid }}>{unit}</span>}
    </div>
    {delta !== undefined && (
      <div style={{ fontSize: 11, color: delta >= 0 ? C.cyan : C.red, marginTop: 2 }}>
        {delta >= 0 ? "▲" : "▼"} {Math.abs(delta)}%
      </div>
    )}
  </div>
);

// ── ULIQ radial gauge ──────────────────────────────────────────────────
const ULIQGauge = ({ score = 847 }: { score?: number }) => {
  const r = 52, cx = 70, cy = 70;
  const circ = 2 * Math.PI * r;
  const dash = (score / 1000) * circ;
  const aura =
    score >= 900 ? "SOVEREIGN" : score >= 800 ? "ARCHITECT" : score >= 700 ? "PIONEER" : "INITIATE";
  const auraColor = score >= 900 ? C.gold : score >= 800 ? C.cyan : C.purple;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <div
        style={{ position: "relative", width: 140, height: 140, animation: "float 4s ease-in-out infinite" }}
      >
        <svg width="140" height="140" style={{ transform: "rotate(-90deg)" }}>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.bg3} strokeWidth="8" />
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={auraColor}
            strokeWidth="8"
            strokeDasharray={`${dash} ${circ}`}
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 6px ${auraColor})`,
              transition: "stroke-dasharray 1s ease",
            }}
          />
          <circle
            cx={cx}
            cy={cy}
            r={64}
            fill="none"
            stroke={`${auraColor}20`}
            strokeWidth="1"
            strokeDasharray="4 4"
            style={{ animation: "ring-spin 20s linear infinite", transformOrigin: "70px 70px" }}
          />
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ fontSize: 26, fontFamily: "'Orbitron'", fontWeight: 800, color: auraColor }}>
            {score}
          </span>
          <span style={{ fontSize: 9, color: C.textDim, letterSpacing: 1 }}>ULIQ</span>
        </div>
      </div>
      <Chip label={aura} color={auraColor} />
    </div>
  );
};

// ── Mini bar chart ─────────────────────────────────────────────────────
const BarChart = ({
  data,
  color = C.cyan,
}: {
  data: { l: string; v: number }[];
  color?: string;
}) => {
  const max = Math.max(...data.map((d) => d.v));
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 60 }}>
      {data.map((d, i) => (
        <div
          key={i}
          style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}
        >
          <div
            style={{
              width: "100%",
              background: `${color}30`,
              height: `${(d.v / max) * 100}%`,
              borderRadius: "2px 2px 0 0",
              boxShadow: `0 0 6px ${color}60`,
              transition: "height 0.6s ease",
            }}
          />
          <span style={{ fontSize: 8, color: C.textDim, fontFamily: "'Share Tech Mono'" }}>{d.l}</span>
        </div>
      ))}
    </div>
  );
};

// ── Hex node map (Intelligence tab) ───────────────────────────────────
const HexMap = () => {
  const nodes = [
    { x: 50, y: 50, r: 22, color: C.cyan, label: "CORE", score: 94, anomaly: false },
    { x: 140, y: 30, r: 16, color: C.gold, label: "EU-W", score: 82, anomaly: false },
    { x: 200, y: 70, r: 14, color: C.purple, label: "EU-E", score: 71, anomaly: true },
    { x: 100, y: 110, r: 18, color: C.cyan, label: "UK", score: 88, anomaly: false },
    { x: 200, y: 130, r: 12, color: C.red, label: "ANML", score: 43, anomaly: true },
    { x: 155, y: 95, r: 10, color: C.textMid, label: "NL", score: 66, anomaly: false },
  ];
  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <svg viewBox="0 0 260 160" style={{ width: "100%", height: "auto" }}>
        <defs>
          <filter id="solaris-glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <line x1="50" y1="50" x2="140" y2="30" stroke={`${C.cyan}30`} strokeWidth="1" strokeDasharray="3 3" />
        <line x1="50" y1="50" x2="100" y2="110" stroke={`${C.cyan}30`} strokeWidth="1" strokeDasharray="3 3" />
        <line x1="140" y1="30" x2="200" y2="70" stroke={`${C.gold}30`} strokeWidth="1" strokeDasharray="3 3" />
        <line x1="100" y1="110" x2="155" y2="95" stroke={`${C.cyan}30`} strokeWidth="1" strokeDasharray="3 3" />
        <line x1="155" y1="95" x2="200" y2="130" stroke={`${C.red}40`} strokeWidth="1" strokeDasharray="2 2" />
        {nodes.map((n, i) => (
          <g key={i} filter="url(#solaris-glow)">
            {n.anomaly && (
              <circle
                cx={n.x}
                cy={n.y}
                r={n.r + 6}
                fill="none"
                stroke={n.color}
                strokeWidth="1"
                strokeDasharray="4 4"
                opacity="0.6"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from={`0 ${n.x} ${n.y}`}
                  to={`360 ${n.x} ${n.y}`}
                  dur="4s"
                  repeatCount="indefinite"
                />
              </circle>
            )}
            <circle cx={n.x} cy={n.y} r={n.r} fill={`${n.color}20`} stroke={n.color} strokeWidth="1.5" />
            <text
              x={n.x}
              y={n.y - 3}
              textAnchor="middle"
              fontSize="7"
              fill={n.color}
              fontFamily="'Share Tech Mono'"
            >
              {n.label}
            </text>
            <text
              x={n.x}
              y={n.y + 8}
              textAnchor="middle"
              fontSize="9"
              fill="white"
              fontFamily="'Orbitron'"
              fontWeight="700"
            >
              {n.score}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

// ── Score dimension bar ────────────────────────────────────────────────
const DimBar = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div style={{ marginBottom: 10 }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
      <span
        style={{ fontSize: 11, color: C.textMid, fontFamily: "'Share Tech Mono'", letterSpacing: 1 }}
      >
        {label}
      </span>
      <span style={{ fontSize: 11, color, fontFamily: "'Orbitron'", fontWeight: 600 }}>{value}</span>
    </div>
    <div style={{ height: 4, background: C.bg3, borderRadius: 2 }}>
      <div
        style={{
          height: "100%",
          width: `${value}%`,
          borderRadius: 2,
          background: `linear-gradient(90deg, ${color}, ${color}80)`,
          boxShadow: `0 0 8px ${color}60`,
          transition: "width 0.8s ease",
        }}
      />
    </div>
  </div>
);

// ── Steward row ────────────────────────────────────────────────────────
interface StewardRowProps {
  name: string;
  handle: string;
  tier: string;
  score: string | number;
  status: "active" | "inactive";
}

const StewardRow = ({ name, handle, tier, score, status }: StewardRowProps) => {
  const tColor = tier === "Founding" ? C.gold : tier === "Verified" ? C.cyan : C.textMid;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 0",
        borderBottom: `1px solid ${C.border}`,
        animation: "data-stream 0.4s ease",
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          flexShrink: 0,
          background: `${tColor}20`,
          border: `1px solid ${tColor}40`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 13,
          fontFamily: "'Orbitron'",
          fontWeight: 700,
          color: tColor,
        }}
      >
        {name[0]}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: C.text,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {name}
        </div>
        <div style={{ fontSize: 11, color: C.textDim, fontFamily: "'Share Tech Mono'" }}>{handle}</div>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <Chip label={tier} color={tColor} />
        <div style={{ fontSize: 12, color: C.textMid, marginTop: 4, fontFamily: "'Orbitron'" }}>
          {score}
        </div>
      </div>
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: status === "active" ? C.cyan : C.textDim,
          boxShadow: status === "active" ? `0 0 6px ${C.cyan}` : "none",
          flexShrink: 0,
        }}
      />
    </div>
  );
};

// ── Tab content panels ─────────────────────────────────────────────────
const panels: Record<string, () => React.ReactNode> = {
  overview: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, animation: "fade-in 0.4s ease" }}>
      <GlassCard style={{ padding: 20 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <ULIQGauge score={847} />
          <div
            style={{ flex: 1, minWidth: 200, display: "flex", flexDirection: "column", gap: 16 }}
          >
            <Stat label="Brand Velocity" value="94.2" unit="pts" color={C.cyan} delta={3.1} />
            <Stat label="Trust Index" value="88.7" unit="%" color={C.gold} delta={-0.4} />
            <Stat label="DPP Compliance" value="100" unit="%" color={C.cyan} />
          </div>
        </div>
      </GlassCard>

      <GlassCard style={{ padding: 16 }} accent={C.gold}>
        <div
          style={{
            fontSize: 11,
            color: C.textDim,
            fontFamily: "'Share Tech Mono'",
            letterSpacing: 1,
            marginBottom: 12,
          }}
        >
          SCAN COVERAGE — 7 DAY
        </div>
        <BarChart
          color={C.gold}
          data={[
            { l: "M", v: 72 },
            { l: "T", v: 88 },
            { l: "W", v: 65 },
            { l: "T", v: 91 },
            { l: "F", v: 79 },
            { l: "S", v: 44 },
            { l: "S", v: 51 },
          ]}
        />
      </GlassCard>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {[
          { l: "Active Nodes", v: "2,841", c: C.cyan },
          { l: "Anomalies", v: "3", c: C.red },
          { l: "DPP Records", v: "18,492", c: C.gold },
          { l: "Impact Credits", v: "1,204", c: C.purple },
        ].map((s, i) => (
          <GlassCard key={i} style={{ padding: 14 }} accent={s.c}>
            <div
              style={{
                fontSize: 10,
                color: C.textDim,
                fontFamily: "'Share Tech Mono'",
                letterSpacing: 1,
                marginBottom: 6,
              }}
            >
              {s.l}
            </div>
            <div
              style={{ fontSize: 22, fontFamily: "'Orbitron'", fontWeight: 700, color: s.c }}
            >
              {s.v}
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  ),

  intelligence: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, animation: "fade-in 0.4s ease" }}>
      <GlassCard style={{ padding: 16 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <span
            style={{
              fontSize: 11,
              color: C.textDim,
              fontFamily: "'Share Tech Mono'",
              letterSpacing: 1,
            }}
          >
            HEX-SCAN TOPOLOGY
          </span>
          <Chip label="LIVE" color={C.cyan} />
        </div>
        <HexMap />
      </GlassCard>

      <GlassCard style={{ padding: 16 }} accent={C.red}>
        <div
          style={{
            fontSize: 11,
            color: C.red,
            fontFamily: "'Share Tech Mono'",
            letterSpacing: 1,
            marginBottom: 12,
          }}
        >
          ⚠ ANOMALY LOG
        </div>
        {[
          { node: "EU-E", type: "Velocity Spike", delta: "+340%", ts: "14m ago" },
          { node: "ANML", type: "Auth Deviation", delta: "SIG:NULL", ts: "1h ago" },
          { node: "NL", type: "Latency Drift", delta: "+180ms", ts: "3h ago" },
        ].map((a, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 0",
              borderBottom: `1px solid ${C.border}`,
            }}
          >
            <div>
              <div style={{ fontSize: 13, color: C.text, fontWeight: 600 }}>{a.type}</div>
              <div style={{ fontSize: 10, color: C.textDim, fontFamily: "'Share Tech Mono'" }}>
                NODE:{a.node}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 12, color: C.red, fontFamily: "'Share Tech Mono'" }}>
                {a.delta}
              </div>
              <div style={{ fontSize: 10, color: C.textDim }}>{a.ts}</div>
            </div>
          </div>
        ))}
      </GlassCard>
    </div>
  ),

  brandwells: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, animation: "fade-in 0.4s ease" }}>
      <GlassCard style={{ padding: 16 }} accent={C.gold}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          <span
            style={{
              fontSize: 11,
              color: C.textDim,
              fontFamily: "'Share Tech Mono'",
              letterSpacing: 1,
            }}
          >
            BRAND WELL — UNDER ARMOUR
          </span>
          <Chip label="Architect Aura" color={C.gold} />
        </div>
        <DimBar label="REACH DEPTH" value={84} color={C.cyan} />
        <DimBar label="TRUST SIGNAL" value={91} color={C.gold} />
        <DimBar label="CULTURAL FIT" value={76} color={C.purple} />
        <DimBar label="IMPACT VECTOR" value={68} color={C.cyan} />
        <DimBar label="DPP INTEGRITY" value={100} color={C.cyan} />
        <div
          style={{
            marginTop: 16,
            padding: 12,
            background: C.bg3,
            borderRadius: 4,
            border: `1px solid ${C.gold}20`,
          }}
        >
          <div
            style={{
              fontSize: 10,
              color: C.textDim,
              fontFamily: "'Share Tech Mono'",
              letterSpacing: 1,
              marginBottom: 4,
            }}
          >
            BRAND ULIQ COMPOSITE
          </div>
          <div
            style={{ fontSize: 32, fontFamily: "'Orbitron'", fontWeight: 800, color: C.gold }}
          >
            847{" "}
            <span style={{ fontSize: 14, color: C.textMid }}>/1000</span>
          </div>
        </div>
      </GlassCard>

      <GlassCard style={{ padding: 16 }}>
        <div
          style={{
            fontSize: 11,
            color: C.textDim,
            fontFamily: "'Share Tech Mono'",
            letterSpacing: 1,
            marginBottom: 12,
          }}
        >
          AURA TIER REGISTRY
        </div>
        {[
          { tier: "Sovereign", range: "950–1000", color: "#ffffff", count: 0 },
          { tier: "Visionary", range: "900–949", color: C.gold, count: 4 },
          { tier: "Architect", range: "800–899", color: C.cyan, count: 12 },
          { tier: "Pioneer", range: "700–799", color: C.purple, count: 31 },
          { tier: "Initiate", range: "500–699", color: C.textMid, count: 88 },
          { tier: "Nascent", range: "0–499", color: C.textDim, count: 203 },
        ].map((a, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "7px 0",
              borderBottom: `1px solid ${C.border}`,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: a.color,
                boxShadow: `0 0 6px ${a.color}`,
                flexShrink: 0,
              }}
            />
            <span style={{ flex: 1, fontSize: 13, color: a.color, fontWeight: 600 }}>{a.tier}</span>
            <span style={{ fontSize: 11, color: C.textDim, fontFamily: "'Share Tech Mono'" }}>
              {a.range}
            </span>
            <span
              style={{
                fontSize: 12,
                color: a.color,
                fontFamily: "'Orbitron'",
                fontWeight: 600,
                minWidth: 28,
                textAlign: "right",
              }}
            >
              {a.count}
            </span>
          </div>
        ))}
      </GlassCard>
    </div>
  ),

  stewards: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, animation: "fade-in 0.4s ease" }}>
      <GlassCard style={{ padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <span
            style={{
              fontSize: 11,
              color: C.textDim,
              fontFamily: "'Share Tech Mono'",
              letterSpacing: 1,
            }}
          >
            ACTIVE STEWARDS
          </span>
          <Chip label="338 total" color={C.cyan} />
        </div>
        <StewardRow name="Kieran Osei" handle="@k.osei" tier="Founding" score="982" status="active" />
        <StewardRow name="Yuna Park" handle="@y.park.eu" tier="Founding" score="964" status="active" />
        <StewardRow name="Marco Vespa" handle="@mvespa" tier="Verified" score="841" status="active" />
        <StewardRow
          name="Aisha Nwosu"
          handle="@a.nwosu"
          tier="Verified"
          score="822"
          status="inactive"
        />
        <StewardRow
          name="Dmitri Sorel"
          handle="@sorel.d"
          tier="Associate"
          score="701"
          status="active"
        />
      </GlassCard>

      <GlassCard style={{ padding: 16 }} accent={C.purple}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 12,
            textAlign: "center",
          }}
        >
          <div>
            <div
              style={{ fontSize: 22, fontFamily: "'Orbitron'", fontWeight: 700, color: C.gold }}
            >
              14
            </div>
            <div
              style={{ fontSize: 10, color: C.textDim, fontFamily: "'Share Tech Mono'" }}
            >
              FOUNDING
            </div>
          </div>
          <div>
            <div
              style={{ fontSize: 22, fontFamily: "'Orbitron'", fontWeight: 700, color: C.cyan }}
            >
              87
            </div>
            <div
              style={{ fontSize: 10, color: C.textDim, fontFamily: "'Share Tech Mono'" }}
            >
              VERIFIED
            </div>
          </div>
          <div>
            <div
              style={{ fontSize: 22, fontFamily: "'Orbitron'", fontWeight: 700, color: C.textMid }}
            >
              237
            </div>
            <div
              style={{ fontSize: 10, color: C.textDim, fontFamily: "'Share Tech Mono'" }}
            >
              ASSOCIATE
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  ),

  covenant: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, animation: "fade-in 0.4s ease" }}>
      <GlassCard style={{ padding: 16 }} accent={C.gold}>
        <div
          style={{
            fontSize: 11,
            color: C.textDim,
            fontFamily: "'Share Tech Mono'",
            letterSpacing: 1,
            marginBottom: 16,
          }}
        >
          ACTIVE COVENANT
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { label: "Partner", value: "Under Armour EMEA" },
            { label: "Covenant ID", value: "CVN-0042-UA-EMEA" },
            { label: "Established", value: "Q1 2026" },
            { label: "Status", value: "RATIFIED", color: C.cyan },
            { label: "Renewal", value: "Q1 2027" },
          ].map((r, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "8px 0",
                borderBottom: `1px solid ${C.border}`,
              }}
            >
              <span
                style={{ fontSize: 12, color: C.textDim, fontFamily: "'Share Tech Mono'" }}
              >
                {r.label}
              </span>
              <span
                style={{ fontSize: 13, color: r.color ?? C.text, fontWeight: 600 }}
              >
                {r.value}
              </span>
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard style={{ padding: 16 }}>
        <div
          style={{
            fontSize: 11,
            color: C.textDim,
            fontFamily: "'Share Tech Mono'",
            letterSpacing: 1,
            marginBottom: 12,
          }}
        >
          COVENANT TERMS
        </div>
        {[
          { term: "DPP Compliance", status: "MET", c: C.cyan },
          { term: "Impact Credit Floor", status: "MET", c: C.cyan },
          { term: "Steward Threshold (50)", status: "MET", c: C.cyan },
          { term: "ULIQ Floor (750)", status: "MET", c: C.cyan },
          { term: "Quarterly Audit", status: "PENDING", c: C.gold },
        ].map((t, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "8px 0",
              borderBottom: `1px solid ${C.border}`,
            }}
          >
            <span style={{ fontSize: 13, color: C.text }}>{t.term}</span>
            <Chip label={t.status} color={t.c} />
          </div>
        ))}
      </GlassCard>
    </div>
  ),

  digitaltwin: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, animation: "fade-in 0.4s ease" }}>
      <GlassCard style={{ padding: 16 }} accent={C.purple}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          <span
            style={{
              fontSize: 11,
              color: C.textDim,
              fontFamily: "'Share Tech Mono'",
              letterSpacing: 1,
            }}
          >
            DIGITAL TWIN STATUS
          </span>
          <Chip label="SYNCED" color={C.purple} />
        </div>

        <div
          style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}
        >
          <div
            style={{
              position: "relative",
              width: 120,
              height: 120,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="120" height="120" style={{ position: "absolute" }}>
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke={`${C.purple}20`}
                strokeWidth="1"
                strokeDasharray="6 6"
                style={{
                  animation: "ring-spin 15s linear infinite",
                  transformOrigin: "60px 60px",
                }}
              />
              <circle
                cx="60"
                cy="60"
                r="38"
                fill="none"
                stroke={`${C.cyan}30`}
                strokeWidth="1"
                strokeDasharray="3 3"
                style={{
                  animation: "counter-spin 10s linear infinite",
                  transformOrigin: "60px 60px",
                }}
              />
              <circle
                cx="60"
                cy="60"
                r="26"
                fill={`${C.purple}15`}
                stroke={C.purple}
                strokeWidth="1.5"
              />
              <text
                x="60"
                y="55"
                textAnchor="middle"
                fontSize="9"
                fill={C.purple}
                fontFamily="'Share Tech Mono'"
              >
                TWIN
              </text>
              <text
                x="60"
                y="68"
                textAnchor="middle"
                fontSize="10"
                fill="white"
                fontFamily="'Orbitron'"
                fontWeight="700"
              >
                v2.4
              </text>
            </svg>
          </div>
        </div>

        {[
          { label: "Last Sync", value: "2m ago" },
          { label: "Data Points", value: "481,204" },
          { label: "Integrity Hash", value: "0x3f9a…d71c" },
          { label: "Chain", value: "Base L2" },
        ].map((r, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "7px 0",
              borderBottom: `1px solid ${C.border}`,
            }}
          >
            <span
              style={{ fontSize: 12, color: C.textDim, fontFamily: "'Share Tech Mono'" }}
            >
              {r.label}
            </span>
            <span style={{ fontSize: 13, color: C.text }}>{r.value}</span>
          </div>
        ))}
      </GlassCard>
    </div>
  ),
};

// ── Tab configuration ──────────────────────────────────────────────────
const TABS = [
  { id: "overview", label: "Overview" },
  { id: "intelligence", label: "Intelligence" },
  { id: "brandwells", label: "Brand Wells" },
  { id: "stewards", label: "Stewards" },
  { id: "covenant", label: "Covenant" },
  { id: "digitaltwin", label: "Digital Twin" },
];

// ── Main dashboard ─────────────────────────────────────────────────────
export function SolarisDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg0,
        color: C.text,
        fontFamily: "'Rajdhani', sans-serif",
        paddingBottom: 40,
      }}
    >
      <ScanLine />

      {/* Header */}
      <div
        style={{
          padding: "16px 20px",
          borderBottom: `1px solid ${C.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: `${C.bg0}ee`,
          backdropFilter: "blur(12px)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ fontSize: 20, color: C.cyan, fontFamily: "'Orbitron'" }}>⬡</div>
          <div>
            <div
              style={{
                fontSize: 14,
                fontFamily: "'Orbitron'",
                fontWeight: 800,
                color: C.cyan,
                letterSpacing: 2,
              }}
            >
              SOLARIS
            </div>
            <div
              style={{
                fontSize: 9,
                color: C.textDim,
                fontFamily: "'Share Tech Mono'",
                letterSpacing: 2,
              }}
            >
              ASCENDII PROTOCOL
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: C.cyan,
              boxShadow: `0 0 6px ${C.cyan}`,
              animation: "pulse-glow 2s ease infinite",
            }}
          />
          <span style={{ fontSize: 10, color: C.textDim, fontFamily: "'Share Tech Mono'" }}>LIVE</span>
        </div>
      </div>

      {/* Tab navigation */}
      <div
        style={{
          display: "flex",
          overflowX: "auto",
          borderBottom: `1px solid ${C.border}`,
          padding: "0 20px",
        }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: "none",
              border: "none",
              borderBottom:
                activeTab === tab.id ? `2px solid ${C.cyan}` : "2px solid transparent",
              color: activeTab === tab.id ? C.cyan : C.textDim,
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: 11,
              letterSpacing: 1,
              padding: "12px 16px",
              cursor: "pointer",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              transition: "color 0.2s, border-color 0.2s",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: "20px" }}>{panels[activeTab]?.()}</div>
    </div>
  );
}
