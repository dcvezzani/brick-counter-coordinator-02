/**
 * Generates organizer list lines for virtual-scroll validation (≥50 rows).
 */
export function createMyListLines(count = 55) {
  const colors = ['Red', 'Blue', 'Black', 'White', 'Yellow']
  const lines = []

  for (let i = 0; i < count; i += 1) {
    lines.push({
      id: `ol-long-${i + 1}`,
      partId: `30${String(i % 100).padStart(2, '0')}`,
      name: `Part row ${i + 1}`,
      color: colors[i % colors.length],
      quantity: (i % 8) + 1,
      moved: false,
      needsLocation: false,
    })
  }

  return lines
}
