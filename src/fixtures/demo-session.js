import { PART_OUT_FALLBACK_LINES } from '@/fixtures/part-out-fallback.js'

export const DEMO_SESSION_ID = 'demo'

export function createDemoSessionSeed(setNumber = '10281') {
  return {
    id: DEMO_SESSION_ID,
    phase: 'importing',
    setNumber,
    avgPartOutValueUsd: 127.5,
    partOutOptions: {
      condition: 'used', // all-used part-out — condition field read-only, default Used
    },
    partOutLines: PART_OUT_FALLBACK_LINES.map((line) => ({ ...line })),
    lots: [
      { id: 'lot-1', partId: '3001', colorId: 4, condition: 'U', qty: 10 },
      { id: 'lot-2', partId: '3023', colorId: 7, condition: 'U', qty: 8 },
      { id: 'lot-3', partId: '3069b', colorId: 11, condition: 'U', qty: 3 },
    ],
    cups: [
      { id: 'cup-1', label: 'Cup 1 — plates', partCount: 14 },
      { id: 'cup-2', label: 'Cup 2 — tiles', partCount: 7 },
    ],
    reconciliationRows: [
      {
        id: 'rec-1',
        partId: '3001',
        colorId: 4,
        condition: 'U',
        name: 'Brick 2×4',
        color: 'Red',
        partOutQty: 12,
        lotQty: 10,
        resolved: false,
      },
      {
        id: 'rec-2',
        partId: '3069b',
        colorId: 11,
        condition: 'U',
        name: 'Tile 1×2',
        color: 'Black',
        partOutQty: 4,
        lotQty: 3,
        resolved: false,
      },
      {
        id: 'rec-3',
        partId: '3023',
        colorId: 7,
        condition: 'U',
        name: 'Plate 1×2',
        color: 'Blue',
        partOutQty: 8,
        lotQty: 8,
        resolved: true,
      },
    ],
    joinedWorkers: [],
    organizePromptAcknowledged: false,
    organizerLists: [
      {
        id: 'org-1',
        title: 'Pick list — red plates',
        assigneeDisplayName: null,
        lines: [
          { id: 'ol-1', partId: '3001', name: 'Brick 2×4', color: 'Red', quantity: 10, moved: false, needsLocation: false },
          { id: 'ol-2', partId: '3710', name: 'Plate 1×4', color: 'Red', quantity: 6, moved: false, needsLocation: false },
        ],
      },
    ],
  }
}
