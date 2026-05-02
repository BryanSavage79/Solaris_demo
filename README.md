# Solaris Compliance Engine

**Regulatory Logic as Code**  
*Proof of Concept for Transparent & Compliant Supply Chains*

![Solaris Demo](https://via.placeholder.com/800x400?text=Solaris+Compliance+Engine+Demo)  
*(Replace with actual screenshot/GIF after deployment)*

## Overview

**Solaris** is a working demonstration of a modern compliance engine that turns complex regulations into executable code.

It tracks product lifecycle events (creation, material declaration, repairs, recycling, etc.), verifies them against regulatory rule profiles, and produces clear, auditable compliance verdicts — with full evidence trails.

Designed with **EU Digital Product Passport (DPP)** requirements in mind, it is highly relevant for solar, electronics, battery, and sustainability-focused companies.

## Live Demo
**→ [View Live Demo](https://your-project.pages.dev)** *(update after Cloudflare deployment)*

## Demo Scenarios

| Step | Scenario | Outcome | Key Learning |
|------|----------|---------|--------------|
| 1 | Genesis (Creation + Material Declaration) | **PASS** | Baseline compliance |
| 2 | Unauthorized Repair | **FAIL** | Role enforcement violation |
| 3 | Certified Remediation | **PASS** | Full compliance restored |
| 4 | Draft 2027 Rules | **FAIL** | Prepares for stricter future regulation |

## Key Features

- **Rules Engine**: Flexible, readable compliance logic (`exists`, `forall`, `count`, field conditions)
- **Actor Role Verification**: Ensures only certified parties can perform certain actions
- **Full Traceability**: Every decision is backed by evidence and timestamps
- **Visual Timeline**: Clear audit-ready interface
- **Exportable Reports**: Ready for regulatory submission
- **Extensible**: Easy to add new regulations and rule profiles

## Technology Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Core Engine**: Custom lightweight compliance rules engine
- **Blockchain Ready**: Ethers.js integration prepared
- **Testing**: Vitest
- **Deployment**: Cloudflare Pages

## Quick Start (Local)

```bash
git clone https://github.com/BryanSavage79/Solaris_demo.git
cd Solaris_demo
npm install
npm run dev
