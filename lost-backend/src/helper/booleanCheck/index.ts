const isTrue = (value: string | boolean | undefined | null) => (value ? `${value}`.toLowerCase() === 'true' || value === true : false);
const isFalse = (value: string | boolean) =>
  `${value}`.toLowerCase() === 'false' ||
  value === false ||
  value === undefined ||
  value === 'undefined' ||
  value === null ||
  value === 'null' ||
  value === '';
export { isTrue, isFalse };
