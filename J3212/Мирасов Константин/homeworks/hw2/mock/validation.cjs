function hasQuery(request) {
  return Boolean(new URL(request.originalUrl, 'http://127.0.0.1').search);
}

function isNumericId(value) {
  return Number.isSafeInteger(value) && value > 0;
}

function isNonEmptyText(value, maxLength) {
  return typeof value === 'string' && Boolean(value.trim()) && value.trim().length <= maxLength;
}

function isTimestamp(value) {
  return typeof value === 'string' && Number.isFinite(Date.parse(value));
}

function hasOnlyFields(body, fields) {
  return Object.keys(body).every((key) => fields.includes(key));
}

function isPositiveId(value) {
  return (
    typeof value === 'string' && /^[1-9]\d*$/.test(value) && Number.isSafeInteger(Number(value))
  );
}

function isEmail(value) {
  return (
    typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254
  );
}

function isPassword(value) {
  return typeof value === 'string' && value.length >= 8 && Buffer.byteLength(value, 'utf8') <= 72;
}

module.exports = {
  hasQuery,
  isNumericId,
  isNonEmptyText,
  isTimestamp,
  hasOnlyFields,
  isPositiveId,
  isEmail,
  isPassword,
};
