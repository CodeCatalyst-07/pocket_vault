// Pure calendar helpers: no React, storage, or network calls.
import { EXPIRING_SOON_DAYS } from '../constants/theme.js';

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

// parseDate('2026-03-12') creates local midnight, without UTC string parsing.
function parseDate(dateString) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateString);
  if (!match) throw new Error('Use a date in YYYY-MM-DD format.');

  const [year, month, day] = match.slice(1).map(Number);
  const date = new Date(0);
  date.setHours(0, 0, 0, 0);
  date.setFullYear(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    throw new Error('Use a valid calendar date.');
  }
  return date;
}

// toDateString(a local 12 March 2026 date) returns '2026-03-12'.
function toDateString(date) {
  const year = String(date.getFullYear()).padStart(4, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// addMonths('2026-01-31', 1) returns '2026-02-28'; negative months go backwards.
export function addMonths(dateString, months) {
  if (!Number.isInteger(months)) throw new Error('Months must be a whole number.');
  const date = parseDate(dateString);
  const originalDay = date.getDate();

  // Move from day 1 so JavaScript does not overflow into the following month.
  date.setDate(1);
  date.setMonth(date.getMonth() + months);
  const lastDay = new Date(date);
  lastDay.setMonth(lastDay.getMonth() + 1, 0);
  date.setDate(Math.min(originalDay, lastDay.getDate()));
  return toDateString(date);
}

// calculateExpiryDate('2025-11-05', 12) returns '2026-11-05'.
export function calculateExpiryDate(purchaseDate, warrantyMonths) {
  if (!Number.isInteger(warrantyMonths) || warrantyMonths < 0) {
    throw new Error('Warranty months must be a non-negative whole number.');
  }
  return addMonths(purchaseDate, warrantyMonths);
}

// getDaysLeft('2026-11-06') returns 1 when the local date is 5 November 2026.
export function getDaysLeft(expiryDate) {
  const expiry = parseDate(expiryDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // UTC day numbers represent the local calendar dates, avoiding DST hour gaps.
  const expiryDay = Date.UTC(expiry.getFullYear(), expiry.getMonth(), expiry.getDate());
  const todayDay = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.round((expiryDay - todayDay) / DAY_IN_MS);
}

// getWarrantyStatus('2026-11-04') returns 'expired' on 5 November 2026.
export function getWarrantyStatus(expiryDate) {
  const daysLeft = getDaysLeft(expiryDate);
  if (daysLeft < 0) return 'expired';
  if (daysLeft <= EXPIRING_SOON_DAYS) return 'expiring';
  return 'active';
}

// formatDate('2026-03-12') returns '12 Mar 2026'.
export function formatDate(dateString) {
  const date = parseDate(dateString);
  return `${date.getDate()} ${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
}
