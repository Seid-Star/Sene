// frontend/src/utils/formatters.js
// Pure formatting helpers for Sene. No React, no API calls.
// Every function returns a safe fallback when the value is missing or invalid.

const FALLBACK = '—';

// ASSUMPTION: status values below are guesses until Seid confirms them in docs/api.md.
// To change a label, edit it here only.
const LISTING_STATUS_LABELS = {
  active: 'Available',
  available: 'Available',
  sold: 'Sold',
  closed: 'Closed',
  inactive: 'Inactive',
};

const TRANSACTION_STATUS_LABELS = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

const PAYMENT_STATUS_LABELS = {
  pending: 'Payment pending',
  paid: 'Paid',
  failed: 'Payment failed',
  refunded: 'Refunded',
};

// ---------- internal helpers (not exported) ----------

const isMissing = (value) =>
  value === null ||
  value === undefined ||
  (typeof value === 'string' && value.trim() === '');

// Returns a real number, or null if the value cannot be trusted as one.
const toNumber = (value) => {
  if (isMissing(value)) return null;
  if (typeof value !== 'number' && typeof value !== 'string') return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

// "pending_payment" -> "Pending payment"
const humanize = (text) => {
  const cleaned = String(text).replace(/[_-]+/g, ' ').trim().toLowerCase();
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
};

const getStatusLabel = (labels, status, fallback) => {
  if (isMissing(status)) return fallback;
  const key = String(status).trim().toLowerCase();
  // Unknown status: show it readably instead of hiding or inventing meaning.
  return labels[key] ?? humanize(key);
};

// Created once and reused (cheaper than creating one on every call).
// Up to 4 decimals so we never silently round a real amount like 12.345.
const numberFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 4,
});

const quantityFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 4,
});

// ASSUMPTION: Gregorian dates in Ethiopian time. Ethiopian calendar not used.
const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'Africa/Addis_Ababa',
});

const dateTimeFormatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZone: 'Africa/Addis_Ababa',
});

const toDate = (value) => {
  if (isMissing(value)) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

// ---------- public API ----------

export const formatPrice = (value, fallback = FALLBACK) => {
  const number = toNumber(value);
  return number === null ? fallback : `ETB ${numberFormatter.format(number)}`;
};

export const formatQuantity = (quantity, unit, fallback = FALLBACK) => {
  const number = toNumber(quantity);
  if (number === null) return fallback;
  const formatted = quantityFormatter.format(number);
  return isMissing(unit) ? formatted : `${formatted} ${String(unit).trim()}`;
};

export const formatDate = (value, fallback = FALLBACK) => {
  const date = toDate(value);
  return date ? dateFormatter.format(date) : fallback;
};

export const formatDateTime = (value, fallback = FALLBACK) => {
  const date = toDate(value);
  return date ? dateTimeFormatter.format(date) : fallback;
};

export const getListingStatusLabel = (status, fallback = FALLBACK) =>
  getStatusLabel(LISTING_STATUS_LABELS, status, fallback);

export const getTransactionStatusLabel = (status, fallback = FALLBACK) =>
  getStatusLabel(TRANSACTION_STATUS_LABELS, status, fallback);

export const getPaymentStatusLabel = (status, fallback = FALLBACK) =>
  getStatusLabel(PAYMENT_STATUS_LABELS, status, fallback);