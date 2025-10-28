export const isTrue = (value: string | boolean | null | undefined) => value === 'true' || value === true;

export const isYes = (value: string | boolean | null | undefined) =>
  (typeof value === 'string' && value.toLowerCase() === 'true') || 
  (typeof value === 'string' && value.toLowerCase() === 'yes') || 
  value === true;
