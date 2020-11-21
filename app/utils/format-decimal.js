export default function formatDecimal(value, nbOfDecimals = 2) {
  return (parseFloat(value) || 0).toFixed(nbOfDecimals);
}
