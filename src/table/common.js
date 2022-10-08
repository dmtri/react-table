import qs from "query-string";

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

export const getStateFromHistory = (columns) => {
  const urlState = {};

  const { query } = qs.parseUrl(window.location.href);
  const {
    perPage,
    currentPage,
    searchTermFilter = "",
    sort,
    selectedIndexes,
  } = query;
  if (perPage) {
    urlState.perPage = parseInt(perPage, 10);
  }
  if (currentPage) {
    urlState.currentPage = parseInt(currentPage, 10);
  }
  urlState.searchTermFilter = searchTermFilter;

  const filter = {};
  columns.forEach((col) => {
    filter[col] = SORT_STATE.NONE;
  });
  if (sort) {
    const [sortedCol, state] = sort.split(":");
    filter[sortedCol] = state;
  }
  urlState.sort = filter;
  if (selectedIndexes) {
    urlState.selectedIndexes = selectedIndexes
      .split(",")
      .map((idx) => parseInt(idx, 10));
  }
  return urlState;
};
