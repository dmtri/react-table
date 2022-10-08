export const SORT_STATE = {
  ASC: "asc",
  DESC: "desc",
  NONE: "",
};

export function generateAllIndexes(total) {
  let allIndexes = [];
  for (let i = 0; i < total; i++) {
    allIndexes.push(i);
  }
  return allIndexes;
}
