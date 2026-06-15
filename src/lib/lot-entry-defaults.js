export const LOT_CONDITION = {
  NEW: 'N',
  USED: 'U',
}

export const PART_OUT_CONDITION_MODE = {
  NEW: 'new',
  USED: 'used',
  MIXED: 'mixed',
}

export const CONDITION_OPTIONS = [
  { value: LOT_CONDITION.NEW, label: 'New' },
  { value: LOT_CONDITION.USED, label: 'Used' },
]

const VALID_MODES = new Set(Object.values(PART_OUT_CONDITION_MODE))

export function getPartOutConditionMode(session) {
  const mode = session?.partOutOptions?.condition
  if (mode && VALID_MODES.has(mode)) {
    return mode
  }
  return PART_OUT_CONDITION_MODE.MIXED
}

export function resolveDefaultLotCondition(session) {
  const mode = getPartOutConditionMode(session)
  if (mode === PART_OUT_CONDITION_MODE.NEW) {
    return LOT_CONDITION.NEW
  }
  return LOT_CONDITION.USED
}

export function isConditionChoosable(session) {
  return getPartOutConditionMode(session) === PART_OUT_CONDITION_MODE.MIXED
}

export function isConditionReadOnly(session) {
  return !isConditionChoosable(session)
}

export function conditionDisplayLabel(condition) {
  if (condition === LOT_CONDITION.NEW) {
    return 'New'
  }
  return 'Used'
}
