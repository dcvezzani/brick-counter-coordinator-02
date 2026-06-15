/**
 * @typedef {{ value: string | number, label: string, data?: unknown }} PickerOption
 */

function normalizeQuery(query) {
  return String(query ?? '').trim().toLowerCase()
}

/**
 * @param {PickerOption[]} options
 * @param {string} query
 * @returns {PickerOption[]}
 */
export function defaultPrefixFilter(options, query) {
  const normalized = normalizeQuery(query)
  if (!normalized) return options

  return options.filter((option) => {
    const label = String(option.label ?? '').toLowerCase()
    const value = String(option.value ?? '').toLowerCase()
    return label.startsWith(normalized) || value.startsWith(normalized)
  })
}

/**
 * @param {PickerOption[]} options
 * @param {string} query
 * @returns {PickerOption[]}
 */
export function defaultContainsFilter(options, query) {
  const normalized = normalizeQuery(query)
  if (!normalized) return options

  return options.filter((option) => {
    const label = String(option.label ?? '').toLowerCase()
    const value = String(option.value ?? '').toLowerCase()
    return label.includes(normalized) || value.includes(normalized)
  })
}

/**
 * @param {PickerOption[]} options
 * @param {string | number | null | undefined} value
 * @returns {PickerOption | undefined}
 */
export function findPickerOption(options, value) {
  if (value === null || value === undefined || value === '') {
    return undefined
  }

  return options.find((option) => option.value === value)
}
