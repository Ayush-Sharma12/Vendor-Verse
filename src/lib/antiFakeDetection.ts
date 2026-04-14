/**
 * Anti-Fake Vendor Detection System
 * Runs entirely on the client — zero API calls needed.
 * Returns a risk score 0–100 and a list of flags.
 */

export interface FakeDetectionResult {
  score: number;           // 0 = clean, 100 = definitely fake
  level: 'safe' | 'warning' | 'blocked';
  flags: string[];
  passed: string[];
}

// Common spam / test names
const SPAM_NAMES = [
  'test', 'fake', 'dummy', 'asdf', 'qwerty', 'aaaa', 'xxxx', 'abcd',
  'sample', 'demo', 'example', 'temp', 'abc', 'xyz', '123', 'vendor1',
  'hello', 'hi', 'lol', 'haha', 'random', 'blah', 'foo', 'bar',
];

// Gibberish detector — too many consonants in a row
function isGibberish(str: string): boolean {
  const lower = str.toLowerCase().replace(/[^a-z]/g, '');
  if (lower.length < 4) return false;
  const consonantRun = lower.match(/[^aeiou]{5,}/);
  return !!consonantRun;
}

// Repeated character detector
function hasRepeatedChars(str: string, threshold = 4): boolean {
  return /(.)\1{3,}/.test(str.toLowerCase());
}

// Keyboard mash detector
const KEYBOARD_ROWS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];
function isKeyboardMash(str: string): boolean {
  const lower = str.toLowerCase().replace(/[^a-z]/g, '');
  for (const row of KEYBOARD_ROWS) {
    let consecutive = 0;
    for (let i = 0; i < lower.length - 1; i++) {
      const idx = row.indexOf(lower[i]);
      const nextIdx = row.indexOf(lower[i + 1]);
      if (idx !== -1 && nextIdx !== -1 && Math.abs(idx - nextIdx) === 1) {
        consecutive++;
        if (consecutive >= 4) return true;
      } else {
        consecutive = 0;
      }
    }
  }
  return false;
}

// Check if location looks real (has at least one number or known area keyword)
const AREA_KEYWORDS = [
  'noida', 'gurgaon', 'delhi', 'faridabad', 'ghaziabad', 'sector',
  'metro', 'gate', 'road', 'market', 'chowk', 'nagar', 'colony',
  'extension', 'greater', 'bajaj', 'alpha', 'beta', 'gamma',
  'near', 'opposite', 'behind', 'front', 'side', 'block',
];
function locationLooksReal(location: string): boolean {
  const lower = location.toLowerCase();
  const hasNumber = /\d/.test(location);
  const hasKeyword = AREA_KEYWORDS.some(k => lower.includes(k));
  return hasNumber || hasKeyword || location.trim().split(' ').length >= 3;
}

// Duplicate submission guard (in-memory, session-scoped)
const recentSubmissions = new Map<string, number>();
function isDuplicateSubmission(vendorName: string, location: string): boolean {
  const key = `${vendorName.toLowerCase().trim()}|${location.toLowerCase().trim()}`;
  const last = recentSubmissions.get(key);
  if (last && Date.now() - last < 60_000) return true;
  recentSubmissions.set(key, Date.now());
  return false;
}

// Rate limit guard — max 3 submissions per 5 minutes per session
const submissionTimes: number[] = [];
function isRateLimited(): boolean {
  const now = Date.now();
  const window = 5 * 60 * 1000;
  const recent = submissionTimes.filter(t => now - t < window);
  return recent.length >= 3;
}
export function recordSubmission() {
  submissionTimes.push(Date.now());
}

export interface VendorFormSnapshot {
  vendor_name: string;
  what_they_sell: string;
  location: string;
  hours: string;
  registered_by: string;
  upi_id?: string;
  whatsapp_number?: string;
  photo_url?: string;
  timeToFillSeconds?: number; // how long user took to fill the form
}

export function detectFakeVendor(data: VendorFormSnapshot): FakeDetectionResult {
  let score = 0;
  const flags: string[] = [];
  const passed: string[] = [];

  const name = data.vendor_name.trim();
  const nameLower = name.toLowerCase();

  // ── 1. Spam name check ──────────────────────────────────────────
  if (SPAM_NAMES.some(s => nameLower === s || nameLower.startsWith(s + ' ') || nameLower.endsWith(' ' + s))) {
    score += 40;
    flags.push('Vendor name looks like a test or spam entry');
  } else {
    passed.push('Vendor name looks genuine');
  }

  // ── 2. Gibberish / keyboard mash ────────────────────────────────
  if (isGibberish(name) || isKeyboardMash(name)) {
    score += 35;
    flags.push('Vendor name appears to be gibberish or keyboard mash');
  }
  if (hasRepeatedChars(name)) {
    score += 25;
    flags.push('Vendor name has suspicious repeated characters');
  }

  // ── 3. Name too short ───────────────────────────────────────────
  if (name.replace(/[^a-zA-Z]/g, '').length < 3) {
    score += 20;
    flags.push('Vendor name is too short to be real');
  } else {
    passed.push('Vendor name has adequate length');
  }

  // ── 4. Location check ───────────────────────────────────────────
  if (!locationLooksReal(data.location)) {
    score += 25;
    flags.push('Location does not look like a real address or landmark');
  } else {
    passed.push('Location looks like a real place');
  }

  // ── 5. What they sell — too vague ───────────────────────────────
  const sellWords = data.what_they_sell.trim().split(/[\s,]+/).filter(Boolean);
  if (sellWords.length < 2) {
    score += 15;
    flags.push('Description of what they sell is too vague');
  } else {
    passed.push('Product description is detailed enough');
  }

  // ── 6. Registered by — looks real ───────────────────────────────
  const regBy = data.registered_by.trim();
  if (regBy.length < 3 || SPAM_NAMES.includes(regBy.toLowerCase())) {
    score += 20;
    flags.push('Registrant name looks fake or too short');
  } else {
    passed.push('Registrant name looks real');
  }

  // ── 7. UPI ID format check ──────────────────────────────────────
  if (data.upi_id && data.upi_id.trim()) {
    const upiValid = /^[\w.\-+]+@[\w]+$/.test(data.upi_id.trim());
    if (!upiValid) {
      score += 15;
      flags.push('UPI ID format looks invalid');
    } else {
      passed.push('UPI ID format is valid');
    }
  }

  // ── 8. WhatsApp number format ───────────────────────────────────
  if (data.whatsapp_number && data.whatsapp_number.trim()) {
    const digits = data.whatsapp_number.replace(/\D/g, '');
    if (digits.length !== 10 || !/^[6-9]/.test(digits)) {
      score += 15;
      flags.push('WhatsApp number does not look like a valid Indian mobile number');
    } else {
      passed.push('WhatsApp number looks valid');
    }
  }

  // ── 9. Speed check — filled too fast (bot-like) ─────────────────
  if (data.timeToFillSeconds !== undefined && data.timeToFillSeconds < 8) {
    score += 30;
    flags.push('Form was filled suspiciously fast — possible bot activity');
  } else if (data.timeToFillSeconds && data.timeToFillSeconds > 15) {
    passed.push('Form fill time looks human');
  }

  // ── 10. Duplicate submission ────────────────────────────────────
  if (isDuplicateSubmission(name, data.location)) {
    score += 50;
    flags.push('This vendor was already submitted recently — possible duplicate');
  }

  // ── 11. Rate limit ──────────────────────────────────────────────
  if (isRateLimited()) {
    score += 40;
    flags.push('Too many submissions in a short time from this session');
  }

  // ── 12. Photo bonus — reduces suspicion ─────────────────────────
  if (data.photo_url) {
    score = Math.max(0, score - 15);
    passed.push('Photo uploaded — adds credibility');
  }

  // ── Clamp and level ─────────────────────────────────────────────
  score = Math.min(100, Math.max(0, score));
  const level: FakeDetectionResult['level'] =
    score >= 60 ? 'blocked' : score >= 30 ? 'warning' : 'safe';

  return { score, level, flags, passed };
}
