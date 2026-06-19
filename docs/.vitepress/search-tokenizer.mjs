const cjkPattern = /[\u3400-\u9fff\uf900-\ufaff]+/gu
const latinPattern = /[a-z0-9]+(?:[-_./][a-z0-9]+)*/giu

function unique(values) {
  return [...new Set(values.filter(Boolean))]
}

function cjkTokens(text) {
  const tokens = []

  for (const match of text.matchAll(cjkPattern)) {
    const chars = [...match[0]]
    for (let start = 0; start < chars.length; start += 1) {
      for (let size = 1; size <= 4 && start + size <= chars.length; size += 1) {
        tokens.push(chars.slice(start, start + size).join(''))
      }
    }
  }

  return tokens
}

function latinTokens(text) {
  const tokens = []

  for (const match of text.matchAll(latinPattern)) {
    const raw = match[0].toLowerCase()
    const compact = raw.replace(/[-_./]/g, '')
    tokens.push(raw, compact)
    tokens.push(...raw.split(/[-_./]/g))
  }

  return tokens
}

export function tokenizeSearchText(text) {
  if (!text) return []

  return unique([...latinTokens(text), ...cjkTokens(text)])
}

export function processSearchTerm(term) {
  const normalized = term.toLowerCase().replace(/[-_./]/g, '')
  return normalized || null
}
