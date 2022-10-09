// TODO: props validation
import { useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

import Pagination from "./Pagination";
import Table from "./Table";
import Search from "./Search";
import Info from "./Info";
import { SORT_STATE, getStateFromHistory, modifyHistory, objectAccessor } from "../common.js";
import { useInitialData } from "../hooks.js";

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
const TableContainer = ({
  dataSource,
  columns,
  renderColumns,
  renderRow,
  renderCell,
  renderCheckbox,
  renderCheckboxAll,
  renderSearch,
  renderLoader,
  emptyCellPlaceholder,
  selectable = true,
  sortable = true,
  searchColumn,
  onSearchTermFilterChange,
  loading = false,
  onSelectionChange,
  onPaginationChange,
  onCellClick,
}) => {
  const {
    perPage: perPageHistory,
    currentPage: currentPageHistory,
    searchTermFilter: searchTermFilterHistory,
    sort: sortHistory,
    selectedIndexes: selectedIndexesHistory,
  } = getStateFromHistory();

  // general states
  const [selectedIndexes, setSelectedIndexes] = useState(
    selectedIndexesHistory || []
  );

  // filter states
  const [searchTermFilter, setSearchTermFilter] = useState(
    searchTermFilterHistory || ""
  );
  const defaultSortFilter = {}
  columns.forEach((col) => {
    defaultSortFilter[col] = SORT_STATE.NONE;
  });
  const [sortFilter, setSortFilter] = useState(sortHistory || defaultSortFilter);
  const [filteredData, setFilteredData] = useState([]);

  // pagination states
  const [perPage, setPerpage] = useState(perPageHistory || 25);
  const [currentPage, setCurrentPage] = useState(currentPageHistory || 1);
  const [paginatedData, setPaginatedData] = useState([]);
  const [tableData, tableDataLoading] = useInitialData(dataSource, loading);

  useEffect(() => {
    modifyHistory({
      perPage,
      currentPage,
      searchTermFilter,
      selectedIndexes,
      sortFilter,
    });
  }, [searchTermFilter, currentPage, perPage, sortFilter, selectedIndexes]);

  useEffect(() => {
    const filteredData = tableData.filter((row) => {
      if (!searchTermFilter) return true
      const col = objectAccessor(row, searchColumn)
      return col && col.toString().includes(searchTermFilter);
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
  }, [searchTermFilter, sortFilter, tableData, searchColumn, sortable]);

  useEffect(() => {
    const start = (currentPage - 1) * perPage;
    setPaginatedData(filteredData.slice(start, start + perPage));
  }, [filteredData, perPage, currentPage, setPaginatedData]);

  return (
    <>
      {!tableDataLoading ? (
        <>
          <Search
            searchTermFilter={searchTermFilter}
            setSearchTermFilter={setSearchTermFilter}
            searchColumn={searchColumn}
            renderSearch={renderSearch}
            onSearchTermFilterChange={onSearchTermFilterChange}
          />
          <Table
            selectable={selectable}
            selectedIndexes={selectedIndexes}
            setSelectedIndexes={setSelectedIndexes}
            onSelectionChange={onSelectionChange}
            renderCheckboxAll={renderCheckboxAll}
            renderCheckbox={renderCheckbox}
            emptyCellPlaceholder={emptyCellPlaceholder}
            data={paginatedData}
            columns={columns}
            renderRow={renderRow}
            renderCell={renderCell}
            renderColumns={renderColumns}
            sortFilter={sortFilter}
            setSortFilter={setSortFilter}
            onCellClick={onCellClick}
          />
          <Pagination
            perPage={perPage}
            setPerpage={setPerpage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            onPaginationChange={onPaginationChange}
            total={filteredData.length}
          />
          <Info
            paginatedData={paginatedData}
            selectedIndexes={selectedIndexes}
          />
        </>
      ) : (
        renderLoader ? renderLoader() : "...loading"
      )}
    </>
  );
};

const ErrorFallback = ({ error }) => {
  return (
    <div role="alert">
      <p>Something went wrong with Table component:</p>
      <pre>{error.message}</pre>
    </div>
  );
};

const TableWithErrorBoundary = (props) => (
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <TableContainer {...props} />
  </ErrorBoundary>
);

export default TableWithErrorBoundary;
