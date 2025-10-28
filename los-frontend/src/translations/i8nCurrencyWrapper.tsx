import { Fragment } from "react";
import { INR } from "./currency";
const I8nCurrencyWrapper = ({
  value,
  precision,
  separator,
  decimal,
}: {
  value: number;
  precision?: number;
  separator?: string;
  decimal?: string;
}) => {
  return <Fragment>{String(INR({ value, precision, separator, decimal }))}</Fragment>;
};

export default I8nCurrencyWrapper;
