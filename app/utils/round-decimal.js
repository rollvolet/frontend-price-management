export default function roundDecimal(value, nbOfDecimals = 2) {
  return (parseFloat(value) || 0).toFixed(nbOfDecimals);
}
