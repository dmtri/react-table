import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

import Pagination from "./Pagination";
import Table from "./Table";
import Search from "./Search";
import Info from "./Info";
import {
  SORT_STATE,
  getStateFromHistory,
  modifyHistory,
  objectAccessor,
} from "../common.js";
import { useInitialData } from "../hooks.js";

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
  const defaultSortFilter = {};
  columns.forEach((col) => {
    defaultSortFilter[col.path] = SORT_STATE.NONE;
  });
  const [sortFilter, setSortFilter] = useState(
    sortHistory || defaultSortFilter
  );
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
      if (!searchTermFilter) return true;
      const col = objectAccessor(row, searchColumn);
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

  useEffect(() => {
    setCurrentPage(1);
    setSelectedIndexes([]);
  }, [searchTermFilter]);

  useEffect(() => {
    setSelectedIndexes([]);
  }, [currentPage]);

  return (
    <>
      {!tableDataLoading ? (
        <>
          <Search
            searchTermFilter={searchTermFilter}
            onSearchTermFilterChange={setSearchTermFilter}
            searchColumn={searchColumn}
            renderSearch={renderSearch}
            onSearchTermFilterChangeCallback={onSearchTermFilterChange}
          />
          <Table
            selectable={selectable}
            sortable={sortable}
            selectedIndexes={selectedIndexes}
            onSelectedIndexesChange={setSelectedIndexes}
            onSelectionChangeCallback={onSelectionChange}
            data={paginatedData}
            columns={columns}
            sortFilter={sortFilter}
            onSortFilterChange={setSortFilter}
            onCellClick={onCellClick}
            emptyCellPlaceholder={emptyCellPlaceholder}
            renderColumns={renderColumns}
            renderRow={renderRow}
            renderCell={renderCell}
            renderCheckboxAll={renderCheckboxAll}
            renderCheckbox={renderCheckbox}
          />
          <Pagination
            perPage={perPage}
            onPerpageChange={setPerpage}
            currentPage={currentPage}
            onCurrentPageChange={setCurrentPage}
            onPaginationChangeCallback={onPaginationChange}
            total={filteredData.length}
          />
          <Info data={paginatedData} selectedIndexes={selectedIndexes} />
        </>
      ) : renderLoader ? (
        renderLoader()
      ) : (
        "...loading"
      )}
    </>
  );
};

TableContainer.propTypes = {
  dataSource: PropTypes.oneOfType([PropTypes.array, PropTypes.func]).isRequired,
  columns: PropTypes.array.isRequired,
  renderColumns: PropTypes.func,
  renderRow: PropTypes.func,
  renderCell: PropTypes.func,
  renderCheckbox: PropTypes.func,
  renderCheckboxAll: PropTypes.func,
  renderSearch: PropTypes.func,
  renderLoader: PropTypes.func,
  emptyCellPlaceholder: PropTypes.string,
  selectable: PropTypes.bool,
  sortable: PropTypes.bool,
  searchColumn: PropTypes.string,
  onSearchTermFilterChange: PropTypes.func,
  loading: PropTypes.bool,
  onSelectionChange: PropTypes.func,
  onPaginationChange: PropTypes.func,
  onCellClick: PropTypes.func,
};

const ErrorFallback = ({ error }) => {
  return (
    <div role="alert">
      <p>Something went wrong with Table component:</p>
      <pre>{error.message}</pre>
    </div>
  );
};

const TableContainerWithErrorBoundary = (props) => (
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <TableContainer {...props} />
  </ErrorBoundary>
);

export default TableContainerWithErrorBoundary;
