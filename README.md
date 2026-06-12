# Brick Counter Coordinator

Frontend for coordinating LEGO brick counting sessions. This repo uses the [AIDLC](docs/AIDLC.md) process.

## Prerequisites

- **Node.js 24.x** ([download](https://nodejs.org/))
- npm (included with Node)

Optional: initialize the AI-DLC submodule if you work on process automation:

```bash
git submodule update --init --recursive
```

Not required to run the UI.

## Quick start

```bash
git clone https://github.com/dcvezzani/brick-counter-coordinator-02.git
cd brick-counter-coordinator-02
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). The default route shows **hello**.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build locally |
| `npm test` | Run Vitest unit tests |
| `npm run test:watch` | Vitest in watch mode |

## Project context

See [PROJECT.md](PROJECT.md) for current architecture, conventions, and implemented features.

## Stack

See [docs/tech-stack.md](docs/tech-stack.md).

## Feature: initial-setup

- Product Spec: [feature/initial-setup/product-spec.md](feature/initial-setup/product-spec.md)
- Tech Spec: [feature/initial-setup/tech-spec.md](feature/initial-setup/tech-spec.md)
- Tracker: [GitHub issue #1](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/1) — **Complete**
- Validate: [validate-scorecard.md](feature/initial-setup/validate-scorecard.md) (PASS)
- Learn: [learn-notes.md](feature/initial-setup/learn-notes.md)
