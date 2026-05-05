import { useState } from "react";

// ============================================================
// SOLARIS — DPP ACCESS TIER SWITCHER
// Drop into your Solaris dashboard as a route or modal overlay.
// Seeded data mirrors tracelayer-seed.sql exactly.
// ============================================================

const PRODUCT = {
  name: "Velocore X1 Performance Runner",
  serial: "VCX1-EU-00012345",
  gtin: "5901234123457",
  nfc: "NFC-TAG-EU-8F3A2C1D",
  brand: "Stridecore Athletic Europe BV",
  state: "Active Digital Twin",
  activated: "14 Apr 2025",
  warranty: "14 Apr 2027",
  carbon: "3.82 kg CO₂e",
  repairability: 7.8,
  recycled: "68.5%",
  origin: "Vietnam",
  fiberOrigin: "Taiwan",
  circularity:
    "Return to any Stridecore retailer for free take-back. Upper mesh is fiber-to-fiber recyclable via Loopmat Circular Textiles. Outsole rubber reclaimed for track surfacing.",
  care: "Spot clean with damp cloth. Do not machine wash. Air dry only.",
  materials: [
    { name: "Recycled Polyester (Upper mesh)", pct: 42, origin: "TW" },
    { name: "Bio-based EVA Foam (Midsole)", pct: 28, origin: "VN" },
    { name: "Natural Rubber (Outsole)", pct: 18, origin: "TH" },
    { name: "Recycled Nylon (Lining)", pct: 8, origin: "TW" },
    { name: "TPU Overlay (Heel counter)", pct: 4, origin: "CN" },
  ],
  substances: [
    { name: "Dimethylformamide (DMF)", clear: true, ref: "SGS-EU-2025-448821" },
    { name: "Chromium VI", clear: true, ref: "SGS-EU-2025-448822" },
    { name: "Azo Dyes", clear: true, ref: "SGS-EU-2025-448823" },
    { name: "PFAS", clear: true, ref: "SGS-EU-2025-448824" },
  ],
  spareParts: [
    { part: "Outsole unit", until: "2032-12-31", pn: "SC-VCX1-OUT" },
    { part: "Insole (OrthoFit)", until: "2032-12-31", pn: "SC-VCX1-INS" },
    { part: "Lace set", until: "2033-12-31", pn: "SC-VCX1-LAC" },
    { part: "Heel counter TPU", until: "2031-12-31", pn: "SC-VCX1-HLC" },
  ],
  lifecycle: [
    {
      type: "Produced",
      state: "→ In Production",
      actor: "Apex Footwear Mfg.",
      location: "Ho Chi Minh City, VN",
      date: "12 Mar 2025",
      meta: "Plant 3 · Line L-07 · Batch 2400 units",
    },
    {
      type: "Quality Check",
      state: "In Production",
      actor: "Apex Footwear Mfg.",
      location: "Ho Chi Minh City, VN",
      date: "12 Mar 2025",
      meta: "PASS · 5 checks · SGS certified",
    },
    {
      type: "Shipped",
      state: "→ In Transit",
      actor: "Apex Footwear Mfg.",
      location: "Cat Lai Port, VN",
      date: "18 Mar 2025",
      meta: "Maersk Eindhoven · Container MRKU3421887 · CIF",
    },
    {
      type: "Checkpoint Scan",
      state: "In Transit",
      actor: "Europort Logistics BV",
      location: "Singapore PSA",
      date: "24 Mar 2025",
      meta: "Customs transit · Ref SG-TT-2025-9912",
    },
    {
      type: "Received — Warehouse",
      state: "→ In Inventory",
      actor: "Europort Logistics BV",
      location: "Rotterdam ECT Delta",
      date: "2 Apr 2025",
      meta: "RTM-EU-W7 · Bay B-14 · Customs cleared · DPP verified",
    },
    {
      type: "Shipped to Retail",
      state: "→ In Transit",
      actor: "Europort Logistics BV",
      location: "Rotterdam, NL",
      date: "8 Apr 2025",
      meta: "DHL Supply Chain NL · P.C. Hooftstraat 94, Amsterdam",
    },
    {
      type: "Received — Retail",
      state: "→ In Inventory",
      actor: "Stridecore AMS Flagship",
      location: "Amsterdam, NL",
      date: "9 Apr 2025",
      meta: "Zone-C-R3 · Display ready",
    },
    {
      type: "Sold",
      state: "→ Pending Activation",
      actor: "Stridecore AMS Flagship",
      location: "Amsterdam, NL",
      date: "14 Apr 2025",
      meta: "€189.95 · POS-04 · Stripe pi_3OqX2KLkd…",
    },
    {
      type: "Consumer Activation",
      state: "→ Active Digital Twin",
      actor: "marco.runs",
      location: "Amsterdam, NL",
      date: "14 Apr 2025",
      meta: "NFC scan · iPhone 15 Pro · Warranty + Circularity enrolled",
      tx: "0x7a3f…1f3a",
    },
  ],
  accessLog: [
    { tier: "public", actor: "Anonymous consumer", region: "NL", date: "14 Apr 2025 16:23" },
    { tier: "public", actor: "Anonymous consumer", region: "NL", date: "2 May 2025 10:11" },
    { tier: "professional", actor: "SoleFix Certified Repair — Amsterdam", region: "NL", date: "18 Jun 2025 09:44" },
    { tier: "regulator", actor: "EU Commission — ESPR Market Surveillance", region: "BE", date: "3 Jul 2025 14:02" },
  ],
};

const TIERS = [
  {
    id: "public",
    label: "Consumer",
    icon: "◎",
    description: "QR / NFC scan — no authentication required",
    color: "#00E5C3",
  },
  {
    id: "professional",
    label: "Professional",
    icon: "◈",
    description: "Authenticated repairer or brand partner",
    color: "#7B6FFF",
  },
  {
    id: "regulator",
    label: "Regulator",
    icon: "◆",
    description: "EU ESPR market surveillance authority",
    color: "#FF6B35",
  },
];

// ── Shared sub-components ────────────────────────────────────

function Badge({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        padding: "3px 10px",
        borderRadius: "20px",
        fontSize: "11px",
        fontWeight: 700,
        letterSpacing: "0.06em",
        background: color + "22",
        color,
        border: `1px solid ${color}44`,
      }}
    >
      {children}
    </span>
  );
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 12,
        padding: "16px 20px",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "rgba(255,255,255,0.35)",
        marginBottom: 6,
      }}
    >
      {children}
    </div>
  );
}

function Value({ children, mono, style }: { children: React.ReactNode; mono?: boolean; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        fontSize: 14,
        color: "rgba(255,255,255,0.85)",
        fontFamily: mono ? "'Courier New', monospace" : "inherit",
        lineHeight: 1.5,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 800,
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        color: "rgba(255,255,255,0.4)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        paddingBottom: 10,
        marginBottom: 16,
        marginTop: 28,
      }}
    >
      {children}
    </div>
  );
}

// ── Bar chart for material composition ──────────────────────

function MaterialBar({ name, pct, origin }: { name: string; pct: number; origin: string }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>{name}</span>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontFamily: "monospace" }}>
          {pct}% · {origin}
        </span>
      </div>
      <div style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,0.06)" }}>
        <div
          style={{
            height: 4,
            borderRadius: 2,
            width: `${pct}%`,
            background: "linear-gradient(90deg, #00E5C3, #7B6FFF)",
            transition: "width 0.6s ease",
          }}
        />
      </div>
    </div>
  );
}

// ── Repairability gauge ──────────────────────────────────────

function RepairGauge({ score }: { score: number }) {
  const pct = (score / 10) * 100;
  const color = score >= 7 ? "#00E5C3" : score >= 5 ? "#FFD700" : "#FF6B35";
  const circumference = 163.4;
  const dashArray = `${(pct / 100) * circumference} ${circumference}`;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <div style={{ position: "relative", width: 64, height: 64 }}>
        <svg width="64" height="64" viewBox="0 0 64 64">
          <circle
            cx="32" cy="32" r="26"
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="6"
          />
          <circle
            cx="32" cy="32" r="26"
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeDasharray={dashArray}
            strokeLinecap="round"
            transform="rotate(-90 32 32)"
          />
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            fontWeight: 800,
            color,
          }}
        >
          {score}
        </div>
      </div>
      <div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>Repairability Index</div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>EU ESPR scale · 0–10</div>
      </div>
    </div>
  );
}

// ── Lifecycle timeline ───────────────────────────────────────

interface LifecycleEvent {
  type: string;
  state: string;
  actor: string;
  location: string;
  date: string;
  meta: string;
  tx?: string;
}

function Timeline({ events, showMeta }: { events: LifecycleEvent[]; showMeta: boolean }) {
  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          position: "absolute",
          left: 7,
          top: 8,
          bottom: 8,
          width: 1,
          background: "rgba(255,255,255,0.08)",
        }}
      />
      {events.map((e, i) => (
        <div key={i} style={{ display: "flex", gap: 16, marginBottom: 20, position: "relative" }}>
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              background: i === events.length - 1 ? "#00E5C3" : "rgba(255,255,255,0.12)",
              border: "2px solid",
              borderColor: i === events.length - 1 ? "#00E5C3" : "rgba(255,255,255,0.2)",
              flexShrink: 0,
              marginTop: 1,
              zIndex: 1,
            }}
          />
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                flexWrap: "wrap",
                gap: 4,
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.9)" }}>{e.type}</span>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "monospace" }}>{e.date}</span>
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>
              {e.actor} · {e.location}
            </div>
            {showMeta && (
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 4, fontFamily: "monospace" }}>
                {e.meta}
              </div>
            )}
            {showMeta && e.tx && (
              <div style={{ fontSize: 10, color: "#00E5C3", marginTop: 4, fontFamily: "monospace" }}>
                ⛓ {e.tx}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Tier views ───────────────────────────────────────────────

function PublicView() {
  return (
    <div>
      <SectionTitle>Product Identity</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
        <Card><Label>Product</Label><Value>{PRODUCT.name}</Value></Card>
        <Card><Label>Brand</Label><Value>{PRODUCT.brand}</Value></Card>
        <Card><Label>Status</Label><Value><Badge color="#00E5C3">{PRODUCT.state}</Badge></Value></Card>
        <Card><Label>Carbon Footprint</Label><Value>{PRODUCT.carbon}</Value></Card>
        <Card><Label>Recycled Content</Label><Value>{PRODUCT.recycled}</Value></Card>
        <Card><Label>Origin</Label><Value>{PRODUCT.origin}</Value></Card>
      </div>

      <SectionTitle>Sustainability</SectionTitle>
      <Card style={{ marginBottom: 12 }}>
        <RepairGauge score={PRODUCT.repairability} />
      </Card>
      <Card style={{ marginBottom: 12 }}>
        <Label>Material Composition</Label>
        <div style={{ marginTop: 12 }}>
          {PRODUCT.materials.map((m, i) => <MaterialBar key={i} {...m} />)}
        </div>
      </Card>
      <Card>
        <Label>Circularity</Label>
        <Value>{PRODUCT.circularity}</Value>
      </Card>

      <SectionTitle>Journey</SectionTitle>
      <Card>
        <Timeline events={PRODUCT.lifecycle.slice(-3)} showMeta={false} />
      </Card>
    </div>
  );
}

function ProfessionalView() {
  return (
    <div>
      <SectionTitle>Unit Identity</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
        <Card><Label>Serial Number</Label><Value mono>{PRODUCT.serial}</Value></Card>
        <Card><Label>GTIN</Label><Value mono>{PRODUCT.gtin}</Value></Card>
        <Card><Label>NFC Tag UID</Label><Value mono>{PRODUCT.nfc}</Value></Card>
        <Card><Label>Activated</Label><Value>{PRODUCT.activated}</Value></Card>
        <Card><Label>Warranty Expires</Label><Value>{PRODUCT.warranty}</Value></Card>
        <Card><Label>Owner Handle</Label><Value mono>marco.runs</Value></Card>
      </div>

      <SectionTitle>Spare Parts Availability</SectionTitle>
      <Card>
        <div style={{ display: "grid", gap: 10 }}>
          {PRODUCT.spareParts.map((p, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 0",
                borderBottom:
                  i < PRODUCT.spareParts.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
              }}
            >
              <div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)" }}>{p.part}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontFamily: "monospace" }}>{p.pn}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Available until</div>
                <div style={{ fontSize: 12, color: "#00E5C3", fontFamily: "monospace" }}>{p.until}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <SectionTitle>Material Detail</SectionTitle>
      <Card style={{ marginBottom: 12 }}>
        {PRODUCT.materials.map((m, i) => <MaterialBar key={i} {...m} />)}
      </Card>

      <SectionTitle>Substances of Concern — REACH/RoHS</SectionTitle>
      <Card>
        {PRODUCT.substances.map((s, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 0",
              borderBottom:
                i < PRODUCT.substances.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
            }}
          >
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)" }}>{s.name}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 11, fontFamily: "monospace", color: "rgba(255,255,255,0.3)" }}>{s.ref}</span>
              <Badge color="#00E5C3">CLEAR</Badge>
            </div>
          </div>
        ))}
      </Card>

      <SectionTitle>Full Supply Chain</SectionTitle>
      <Card>
        <Timeline events={PRODUCT.lifecycle} showMeta={true} />
      </Card>
    </div>
  );
}

function RegulatorView() {
  const tierBadgeColor: Record<string, string> = {
    public: "#00E5C3",
    professional: "#7B6FFF",
    regulator: "#FF6B35",
  };
  return (
    <div>
      <SectionTitle>Legal & Compliance</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
        <Card><Label>CE Marking</Label><Value><Badge color="#00E5C3">Certified</Badge></Value></Card>
        <Card><Label>DPP Profile</Label><Value><Badge color="#7B6FFF">Textile</Badge></Value></Card>
        <Card style={{ gridColumn: "1 / -1" }}>
          <Label>EU Declaration of Conformity</Label>
          <Value mono style={{ wordBreak: "break-all" }}>
            https://compliance.stridecore.eu/doc/vcx1-eu-doc-conformity-2025.pdf
          </Value>
        </Card>
      </div>

      <SectionTitle>Full Audit Trail</SectionTitle>
      <Card style={{ marginBottom: 12 }}>
        <Timeline events={PRODUCT.lifecycle} showMeta={true} />
      </Card>

      <SectionTitle>Substance Concentrations — Confidential</SectionTitle>
      <Card>
        {PRODUCT.substances.map((s, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 0",
              borderBottom:
                i < PRODUCT.substances.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
            }}
          >
            <div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)" }}>{s.name}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "monospace" }}>{s.ref}</div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: 11, fontFamily: "monospace", color: "rgba(255,255,255,0.4)" }}>
                &lt; 0.001 mg/kg
              </span>
              <Badge color="#00E5C3">CLEAR</Badge>
            </div>
          </div>
        ))}
      </Card>

      <SectionTitle>DPP Access Log</SectionTitle>
      <Card>
        {PRODUCT.accessLog.map((a, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 0",
              borderBottom:
                i < PRODUCT.accessLog.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
            }}
          >
            <div>
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 3 }}>
                <Badge color={tierBadgeColor[a.tier]}>{a.tier}</Badge>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{a.region}</span>
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>{a.actor}</div>
            </div>
            <div style={{ fontSize: 11, fontFamily: "monospace", color: "rgba(255,255,255,0.3)" }}>{a.date}</div>
          </div>
        ))}
      </Card>

      <SectionTitle>Unit Identifiers</SectionTitle>
      <div style={{ display: "grid", gap: 12 }}>
        <Card><Label>Serial Number</Label><Value mono>{PRODUCT.serial}</Value></Card>
        <Card><Label>GTIN</Label><Value mono>{PRODUCT.gtin}</Value></Card>
        <Card><Label>NFC Tag UID</Label><Value mono>{PRODUCT.nfc}</Value></Card>
        <Card>
          <Label>On-Chain Activation TX</Label>
          <Value mono style={{ wordBreak: "break-all", fontSize: 12 }}>
            0x7a3f9c2e1b8d4f6a0c5e7b2d9f1a3c8e5b7d2f4a6c1e9b3d5f7a2c4e6b8d1f3a
          </Value>
        </Card>
      </div>
    </div>
  );
}

// ── Root component ───────────────────────────────────────────

export default function DPPTierSwitcher() {
  const [activeTier, setActiveTier] = useState("public");
  const tier = TIERS.find((t) => t.id === activeTier) ?? TIERS[0];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0A0C10",
        color: "rgba(255,255,255,0.85)",
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        padding: "0 0 80px",
      }}
    >
      {/* Header */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "rgba(10,12,16,0.92)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          padding: "16px 24px",
        }}
      >
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 14,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 11,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.3)",
                  marginBottom: 3,
                }}
              >
                Digital Product Passport
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "rgba(255,255,255,0.9)" }}>
                {PRODUCT.name}
              </div>
            </div>
            <Badge color={tier.color}>
              {tier.icon} {tier.label}
            </Badge>
          </div>

          {/* Tier switcher */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {TIERS.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTier(t.id)}
                style={{
                  padding: "10px 8px",
                  borderRadius: 10,
                  border: "1px solid",
                  borderColor: activeTier === t.id ? t.color : "rgba(255,255,255,0.08)",
                  background: activeTier === t.id ? t.color + "18" : "transparent",
                  color: activeTier === t.id ? t.color : "rgba(255,255,255,0.4)",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 18, marginBottom: 2 }}>{t.icon}</div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em" }}>{t.label}</div>
                <div style={{ fontSize: 10, opacity: 0.6, marginTop: 2, lineHeight: 1.3 }}>
                  {t.description}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "24px 24px 0" }}>
        {activeTier === "public" && <PublicView />}
        {activeTier === "professional" && <ProfessionalView />}
        {activeTier === "regulator" && <RegulatorView />}
      </div>
    </div>
  );
}
