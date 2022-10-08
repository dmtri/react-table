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

export const getStateFromHistory = () => {
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

export const modifyHistory = ({
  perPage,
  currentPage,
  searchTermFilter,
  selectedIndexes,
  sortFilter,
}) => {
  const { url } = qs.parseUrl(window.location.href);
  const colToSort = Object.keys(sortFilter).find(
    (col) => sortFilter[col] !== SORT_STATE.NONE
  );
  const query = {
    perPage,
    currentPage,
    searchTermFilter,
    selectedIndexes,
  };
  if (colToSort) {
    query.sort = `${colToSort}:${sortFilter[colToSort]}`;
  }
  const newUrl = qs.stringifyUrl({ url, query }, { arrayFormat: "comma" });
  window.history.pushState(query, "", newUrl);
};
