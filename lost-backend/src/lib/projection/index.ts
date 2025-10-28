export const getProjection = (projec: object | undefined) => {
  let projection = {};
  if (projec) {
    projection = Object.keys(projec) ? { ...projec } : {};
  }
  return projection;
};
