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

export function objectAccessor(obj, path) {
  const paths = path.split(".");
  if (paths.length === 1) {
    return obj[path];
  }
  let cell = obj;
  // handle nested path: prop1.prop2.prop3
  while (paths.length) {
    try {
      cell = cell[paths[0]];
    } catch (e) {
      // gracefully handle bad data
      cell = null
      break;
    }
    paths.shift();
  }
  return cell
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

  if (sort) {
    const filter = {};
    const [sortedCol, state] = sort.split(":");
    filter[sortedCol] = state;
    urlState.sort = filter;
  }
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
