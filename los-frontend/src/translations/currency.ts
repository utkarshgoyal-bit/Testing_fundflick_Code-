import currency from "currency.js";
const USD = (value: number) =>
  currency(value, { symbol: "$", precision: 2 }).format();
const INR = ({
  value,
  precision,
  separator,
  decimal,
}: {
  value: number;
  precision?: number;
  separator?: string;
  decimal?: string;
}) =>
  currency(value, {
    symbol: "₹",
    precision: precision || 0,
    separator: separator || ",",
    decimal: decimal || ".",
  }).format();

export { USD, INR };
