export const DEMO_SESSION_ID = 'demo'

export function createDemoSessionSeed(setNumber = '10281') {
  return {
    id: DEMO_SESSION_ID,
    phase: 'importing',
    setNumber,
    partOutLines: [
      { id: 'po-1', partId: '3001', name: 'Brick 2×4', color: 'Red', quantity: 12 },
      { id: 'po-2', partId: '3023', name: 'Plate 1×2', color: 'Blue', quantity: 8 },
      { id: 'po-3', partId: '3069b', name: 'Tile 1×2', color: 'Black', quantity: 4 },
      { id: 'po-4', partId: '3710', name: 'Plate 1×4', color: 'Red', quantity: 6 },
    ],
    lots: [
      { id: 'lot-1', label: 'Lot A', partId: '3001', color: 'Red', quantity: 10 },
      { id: 'lot-2', label: 'Lot B', partId: '3023', color: 'Blue', quantity: 8 },
      { id: 'lot-3', label: 'Lot C', partId: '3069b', color: 'Black', quantity: 3 },
    ],
    cups: [
      { id: 'cup-1', label: 'Cup 1 — plates', partCount: 14 },
      { id: 'cup-2', label: 'Cup 2 — tiles', partCount: 7 },
    ],
    reconciliationRows: [
      {
        id: 'rec-1',
        partId: '3001',
        name: 'Brick 2×4',
        color: 'Red',
        partOutQty: 12,
        lotQty: 10,
        resolved: false,
      },
      {
        id: 'rec-2',
        partId: '3069b',
        name: 'Tile 1×2',
        color: 'Black',
        partOutQty: 4,
        lotQty: 3,
        resolved: false,
      },
      {
        id: 'rec-3',
        partId: '3023',
        name: 'Plate 1×2',
        color: 'Blue',
        partOutQty: 8,
        lotQty: 8,
        resolved: true,
      },
    ],
    organizerLists: [
      {
        id: 'org-1',
        title: 'Pick list — red plates',
        lines: [
          { id: 'ol-1', partId: '3001', name: 'Brick 2×4', color: 'Red', quantity: 10, moved: false, needsLocation: false },
          { id: 'ol-2', partId: '3710', name: 'Plate 1×4', color: 'Red', quantity: 6, moved: false, needsLocation: false },
        ],
      },
    ],
  }
}
