const dateOffset = (day: string): number => {
  let dateOffset = 0;
  if (day === 'yesterday') {
    dateOffset = -1;
  } else if (day === 'tomorrow') {
    dateOffset = 1;
  }
  return dateOffset;
};

export default dateOffset;
