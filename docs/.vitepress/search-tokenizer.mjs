export function tokenizeSearchText(text) {
  if (!text) return []

  const tokens = []
  const cjkPattern = /[\u3400-\u9fff\uf900-\ufaff]+/gu
  const latinPattern = /[a-z0-9]+(?:[-_./][a-z0-9]+)*/giu

  for (const match of text.matchAll(latinPattern)) {
    const raw = match[0].toLowerCase()
    const compact = raw.replace(/[-_./]/g, '')
    tokens.push(raw, compact)
    tokens.push(...raw.split(/[-_./]/g))
  }

  for (const match of text.matchAll(cjkPattern)) {
    const chars = [...match[0]]
    for (let start = 0; start < chars.length; start += 1) {
      for (let size = 1; size <= 4 && start + size <= chars.length; size += 1) {
        tokens.push(chars.slice(start, start + size).join(''))
      }
    }
  }

  return [...new Set(tokens.filter(Boolean))]
}

export function processSearchTerm(term) {
  const normalized = term.toLowerCase().replace(/[-_./]/g, '')
  return normalized || null
}
