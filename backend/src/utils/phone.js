function normalizeEthiopianPhone(input) {
  const cleaned = String(input).replace(/[\s\-()]/g, "");
  const m = cleaned.match(/^(?:\+251|251|0)?([79]\d{8})$/);
  return m ? `+251${m[1]}` : null;
}
module.exports = { normalizeEthiopianPhone };
