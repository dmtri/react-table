// TODO: props validation
import qs from "query-string";
import { useEffect, useState, useRef } from "react";
import { ErrorBoundary } from "react-error-boundary";

import Pagination from "./Pagination";
import Table from "./Table";
import Search from "./Search";
import Info from "./Info";
import { SORT_STATE, getStateFromHistory } from "./common.js";

// TODO: move out of this file
// TODO: add header title/accessor
/*
       columns: [
            { title: 'ID', field: 'ID' , type: 'numeric' },
            { title: 'uitdeler', field: 'Uitdeler' },
            { title: 'ontvanger', field: 'Ontvanger' },
            { title: 'Uitgedeeld', field: 'Uitgedeeld', lookup: { 1: true, 0: false },},
            { title: 'datum', field: 'Datum',
            },
        ],
*/
// override components: https://material-table.com/#/docs/features/component-overriding
// TODO: allow callbacks for key events (onCellClick, onSearch, onPaginationChange, onSort): https://material-table.com/#/docs/features/selection

const ErrorFallback = ({ error }) => {
  return (
    <div role="alert">
      <p>Something went wrong with Table component:</p>
      <pre>{error.message}</pre>
    </div>
  );
};

const TableContainer = ({
  dataSource,
  columns,
  renderColumns,
  renderRows,
  renderCell,
  renderCheckboxAll,
  renderCheckbox,
  emptyCellPlaceholder,
  selectable = true,
  sortable = true,
  searchColumn,
  loading = false,
  onSelectionChange,
  onPaginationChange,
}) => {
  const {
    perPage: perPageHistory,
    currentPage: currentPageHistory,
    searchTermFilter: searchTermFilterHistory,
    sort: sortHistory,
    selectedIndexes: selectedIndexesHistory,
  } = getStateFromHistory(columns);

  const [total, setTotal] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [tableDataLoading, setTableDataLoading] = useState(loading);
  const [selectedIndexes, setSelectedIndexes] = useState(
    selectedIndexesHistory || []
  );
  const [paginatedData, setPaginatedData] = useState([]);
  const [searchTermFilter, setSearchTermFilter] = useState(
    searchTermFilterHistory || ""
  );
  const [sortFilter, setSortFilter] = useState(sortHistory || {});
  const checkboxAllRef = useRef();

  // ------Pagination-----
  const [perPage, setPerpage] = useState(perPageHistory || 25);
  const [currentPage, setCurrentPage] = useState(currentPageHistory || 1);

  // handle initial dataSource
  useEffect(() => {
    const getData = async () => {
      setTableDataLoading(true);
      const { data } = await dataSource();
      setTableData(data);
      setTableDataLoading(false);
    };
    if (typeof dataSource === "function") {
      getData().catch((e) => {
        throw new Error("Problem fetching table data");
      });
    } else if (Array.isArray(dataSource)) {
      setTableData(dataSource);
    } else {
      throw new Error("Invalid table datasource");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    modifyHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTermFilter, currentPage, perPage, sortFilter, selectedIndexes]);

  useEffect(() => {
    onSelectionChange && onSelectionChange(selectedIndexes);
  }, [selectedIndexes, onSelectionChange]);

  useEffect(() => {
    setTotal(paginatedData.length);
  }, [paginatedData]);

  // paginate data
  useEffect(() => {
    const start = (currentPage - 1) * perPage;
    setPaginatedData(filteredData.slice(start, start + perPage));
  }, [filteredData, perPage, currentPage, setPaginatedData]);

  // filter data
  // TODO: create accessor helper
  useEffect(() => {
    const filteredData = tableData.filter((row) => {
      return row[searchColumn].includes(searchTermFilter);
    });
    const colToSort = Object.keys(sortFilter).find(
      (col) => sortFilter[col] !== SORT_STATE.NONE
    );
    if (sortable && colToSort) {
      filteredData.sort((a, b) => {
        if (typeof a[colToSort] === "number") {
          if (sortFilter[colToSort] === SORT_STATE.ASC) {
            return a[colToSort] - b[colToSort];
          } else {
            return b[colToSort] - a[colToSort];
          }
        } else if (typeof a[colToSort] === "string") {
          if (sortFilter[colToSort] === SORT_STATE.ASC) {
            return a[colToSort].localeCompare(b[colToSort]);
          } else {
            return b[colToSort].localeCompare(a[colToSort]);
          }
        } else {
          throw new Error("data type not supported for sorting");
        }
      });
    }
    setFilteredData(filteredData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTermFilter, sortFilter, tableData]);

  useEffect(() => {
    // if neither empty nor all checked, set indeterminate = true
    if (!checkboxAllRef.current) return;
    if (selectedIndexes.length && selectedIndexes.length !== total) {
      checkboxAllRef.current.indeterminate = true;
    } else {
      checkboxAllRef.current.indeterminate = false;
    }
  }, [selectedIndexes, total]);

  const modifyHistory = () => {
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

  return (
    <>
      {!tableDataLoading ? (
        <>
          <Search
            searchTermFilter={searchTermFilter}
            setSearchTermFilter={setSearchTermFilter}
            searchColumn={searchColumn}
          />
          <Table
            selectable={selectable}
            renderCheckboxAll={renderCheckboxAll}
            checkboxAllRef={checkboxAllRef}
            selectedIndexes={selectedIndexes}
            total={total}
            emptyCellPlaceholder={emptyCellPlaceholder}
            paginatedData={paginatedData}
            renderRows={renderRows}
            renderCell={renderCell}
            renderCheckbox={renderCheckbox}
            columns={columns}
            setSelectedIndexes={setSelectedIndexes}
            renderColumns={renderColumns}
            sortFilter={sortFilter}
            setSortFilter={setSortFilter}
          />
          <Pagination
            perPage={perPage}
            setPerpage={setPerpage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            onPaginationChange={onPaginationChange}
            totalRows={filteredData}
            setPaginatedData={setPaginatedData}
          />
        </>
      ) : (
        "...loading"
      )}
      <Info
        paginatedData={paginatedData}
        selectedIndexes={selectedIndexes}
        total={total}
      />
    </>
  );
};

const TableWithErrorBoundary = (props) => (
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <TableContainer {...props} />
  </ErrorBoundary>
);

export default TableWithErrorBoundary;
