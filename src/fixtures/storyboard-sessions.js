import { createDemoSessionSeed, DEMO_SESSION_ID } from '@/fixtures/demo-session.js'
import { createMyListLines } from '@/fixtures/my-list-lines.js'

export const SESSION_COUNTING_ID = 'session-counting'
export const SESSION_RECONCILING_ID = 'session-reconciling'

function createCountingSessionSeed() {
  const base = createDemoSessionSeed('42100')
  return {
    ...base,
    id: SESSION_COUNTING_ID,
    phase: 'counting',
    joinedWorkers: ['Alice'],
    organizePromptAcknowledged: false,
    organizerLists: base.organizerLists.map((list) => ({
      ...list,
      assigneeDisplayName: null,
    })),
  }
}

function createReconcilingSessionSeed() {
  const base = createDemoSessionSeed('10280')
  return {
    ...base,
    id: SESSION_RECONCILING_ID,
    phase: 'reconciling',
    joinedWorkers: ['Bob'],
    organizePromptAcknowledged: false,
    organizerLists: base.organizerLists.map((list) => ({
      ...list,
      assigneeDisplayName: null,
    })),
  }
}

/** Demo session seed with extended fields for workflow profile fixtures. */
export function createDemoWorkflowSessionSeed(setNumber = '10281') {
  const base = createDemoSessionSeed(setNumber)
  return {
    ...base,
    joinedWorkers: [],
    organizePromptAcknowledged: false,
    organizerLists: [
      {
        id: 'org-1',
        title: 'Pick list — red plates',
        assigneeDisplayName: null,
        lines: [
          {
            id: 'ol-1',
            partId: '3001',
            name: 'Brick 2×4',
            color: 'Red',
            quantity: 10,
            moved: false,
            needsLocation: false,
          },
          {
            id: 'ol-2',
            partId: '3710',
            name: 'Plate 1×4',
            color: 'Red',
            quantity: 6,
            moved: false,
            needsLocation: false,
          },
        ],
      },
      {
        id: 'org-long',
        title: 'Pick list — long virtual scroll fixture',
        assigneeDisplayName: 'Demo Worker',
        lines: createMyListLines(55),
      },
    ],
  }
}

export const STORYBOARD_SESSION_SEEDS = [
  createCountingSessionSeed(),
  createReconcilingSessionSeed(),
]

export const STORYBOARD_SESSION_LIST_META = [
  { id: DEMO_SESSION_ID, label: 'Demo session' },
  { id: SESSION_COUNTING_ID, label: 'Counting session' },
  { id: SESSION_RECONCILING_ID, label: 'Reconciling session' },
]
