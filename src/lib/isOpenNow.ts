/**
 * isOpenNow — parses a free-text hours string and returns true if the vendor
 * is currently open based on the user's local time (IST).
 *
 * Handles formats like:
 *   "6 AM to 10 PM, Monday to Saturday"
 *   "12 PM to 9 PM, Daily"
 *   "6 AM to 1 PM"
 *   "8 AM to 11 PM daily"
 *   "Subah 6 baje se raat 10 baje tak"
 */

function parseHour(token: string): number | null {
  // Normalise: lowercase, remove dots
  const s = token.toLowerCase().replace(/\./g, '').trim();

  // Patterns: "6am", "6 am", "6:30am", "6:30 am"
  const match = s.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/);
  if (!match) return null;

  let h = parseInt(match[1], 10);
  const mins = match[2] ? parseInt(match[2], 10) : 0;
  const meridiem = match[3];

  if (meridiem === 'pm' && h !== 12) h += 12;
  if (meridiem === 'am' && h === 12) h = 0;

  return h + mins / 60;
}

function extractHourRange(hours: string): { open: number; close: number } | null {
  // Normalise separators: "to", "-", "–", "se", "tak"
  const normalised = hours
    .toLowerCase()
    .replace(/\bse\b/g, 'to')
    .replace(/\btak\b/g, '')
    .replace(/[–—]/g, 'to')
    .replace(/\bbaje\b/g, '')
    .replace(/\bsubah\b|\braat\b|\bsham\b|\bdopahar\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  // Find all time-like tokens
  const tokens = normalised.split(/\bto\b/);
  if (tokens.length < 2) return null;

  const openH = parseHour(tokens[0].trim().split(/\s+/).slice(-1)[0]);
  const closeH = parseHour(tokens[1].trim().split(/\s+/)[0]);

  if (openH === null || closeH === null) return null;
  return { open: openH, close: closeH };
}

function isOpenToday(hours: string): boolean {
  const lower = hours.toLowerCase();
  const now = new Date();
  const day = now.getDay(); // 0=Sun, 1=Mon … 6=Sat

  if (lower.includes('daily') || lower.includes('everyday') || lower.includes('roz') || lower.includes('har din')) {
    return true;
  }
  if (lower.includes('monday to saturday') || lower.includes('mon to sat') || lower.includes('mon-sat')) {
    return day >= 1 && day <= 6;
  }
  if (lower.includes('monday to friday') || lower.includes('mon to fri') || lower.includes('mon-fri')) {
    return day >= 1 && day <= 5;
  }
  if (lower.includes('sunday') || lower.includes('sun')) {
    // If it says "except sunday" or "closed sunday"
    if (lower.includes('except') || lower.includes('closed')) return day !== 0;
    return true;
  }
  // Default: assume open daily
  return true;
}

export function isOpenNow(hours: string): boolean {
  if (!hours) return true; // no info → assume open

  if (!isOpenToday(hours)) return false;

  const range = extractHourRange(hours);
  if (!range) return true; // can't parse → assume open

  const now = new Date();
  const currentH = now.getHours() + now.getMinutes() / 60;

  // Handle overnight (e.g. 10 PM to 2 AM)
  if (range.close < range.open) {
    return currentH >= range.open || currentH < range.close;
  }
  return currentH >= range.open && currentH < range.close;
}
