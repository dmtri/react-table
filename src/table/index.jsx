// TODO: props validation
import { useEffect, useState, useRef } from "react";
import { ErrorBoundary } from "react-error-boundary";

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


const ErrorFallback = ({ error }) => {
  return (
    <div role="alert">
      <p>Something went wrong with Table component:</p>
      <pre>{error.message}</pre>
    </div>
  );
};

// TODO: move to SORT
const SORT_STATE = {
  ASC: "asc",
  DESC: "desc",
  NONE: "",
};

const Table = ({
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
}) => {
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [tableDataLoading, setTableDataLoading] = useState(loading);
  const [selectedIndexes, setSelectedIndexes] = useState([]);
  const [total, setTotal] = useState([]);
  const [searchTermFilter, setsearchTermFilter] = useState("");
  const [sortFilter, setSortFilter] = useState("");
  const checkboxAllRef = useRef();

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

  // // handle initial filter
  useEffect(() => {
    const filter = {};
    columns.forEach((col) => {
      filter[col] = "";
    });
    setSortFilter(filter);
  }, []);

  useEffect(() => {
    const filteredData = tableData.filter((row) => {
      // TODO: create accessor helper
      return row[searchColumn].includes(searchTermFilter);
    });
    const colToSort = Object.keys(sortFilter).find(
      (col) => sortFilter[col] !== SORT_STATE.NONE
    );
    if (colToSort) {
      filteredData.sort((a, b) => {
        if (typeof a[colToSort] === 'number') {
          if (sortFilter[colToSort] === SORT_STATE.ASC) {
            return a[colToSort] - b[colToSort]
          } else {
            return b[colToSort] - a[colToSort]
          }
        } else if (typeof a[colToSort] === 'string') {
          if (sortFilter[colToSort] === SORT_STATE.ASC) {
            return a[colToSort].localeCompare(b[colToSort])
          } else {
            return b[colToSort].localeCompare(a[colToSort])
          }
        } else {
          throw new Error('data type not supported for sorting')
        }
      });
    }
    setFilteredData(filteredData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTermFilter, sortFilter, tableData]);

  useEffect(() => {
    setTotal(filteredData.length);
  }, [filteredData]);

  useEffect(() => {
    setSelectedIndexes([]);
  }, [tableData, searchTermFilter]);

  useEffect(() => {
    // if neither empty nor all checked, set indeterminate = true
    if (!checkboxAllRef.current) return;
    if (selectedIndexes.length && selectedIndexes.length !== total) {
      checkboxAllRef.current.indeterminate = true;
    } else {
      checkboxAllRef.current.indeterminate = false;
    }
  }, [selectedIndexes, total]);

  const generateAllIndexes = () => {
    let allIndexes = [];
    for (let i = 0; i < total; i++) {
      allIndexes.push(i);
    }
    return allIndexes;
  };

  // TODO: custom sort function
  const sortColumn = (col) => {
    // only support single column sort for now
    const newFilter = { ...sortFilter };
    columns.forEach((col) => {
      newFilter[col] = SORT_STATE.NONE;
    });
    if (sortFilter[col] === SORT_STATE.NONE) {
      newFilter[col] = SORT_STATE.ASC;
    } else if (sortFilter[col] === SORT_STATE.ASC) {
      newFilter[col] = SORT_STATE.DESC;
    } else if (sortFilter[col] === SORT_STATE.DESC) {
      newFilter[col] = SORT_STATE.NONE;
    }
    setSortFilter(newFilter);
  };

  const renderSort = (col) => {
    let text = "";
    if (sortFilter[col] === SORT_STATE.NONE) {
      text = "";
    } else if (sortFilter[col] === SORT_STATE.ASC) {
      text = "asc";
    } else if (sortFilter[col] === SORT_STATE.DESC) {
      text = "desc";
    }
    return text;
  };

  const INTERNAL_renderColumns = () => {
    if (renderColumns) return columns.map(renderColumns);
    return columns.map((col, index) => (
      <th
        key={index}
        className="react-table _col-heading"
        onClick={() => sortColumn(col)}
      >
        <span> {renderSort(col)} </span>
        {col}
      </th>
    ));
  };

  const INTERNAL_renderRows = () => {
    const rows = filteredData;
    if (!rows || !rows.length) return;
    if (renderRows) return rows.map(renderRows);
    return rows.map((row, index) => (
      <tr key={index}>
        <td>{selectable && INTERNAL_renderCheckbox(index)}</td>
        {INTERNAL_renderCell(row)}
      </tr>
    ));
  };

  const INTERNAL_renderCell = (row) => {
    const cells = columns.map((col) => {
      // handle nested path: prop1.prop2.prop3
      const paths = col.split(".");
      if (paths.length === 1) {
        return row[col];
      }
      let cell = row;
      while (paths.length) {
        try {
          cell = cell[paths[0]];
        } catch (e) {
          // gracefully handle bad data
          cell = emptyCellPlaceholder || "-";
          break;
        }
        paths.shift();
      }
      // handle bad data, cell is object
      return typeof cell === "object" ? JSON.stringify(cell) : cell;
    });
    if (renderCell) return cells.map(renderCell);
    return cells.map((cell, index) => <td key={index}>{cell}</td>);
  };

  const INTERNAL_renderCheckboxAll = () => {
    if (renderCheckboxAll) return renderCheckboxAll();
    return (
      <input
        ref={checkboxAllRef}
        type="checkbox"
        checked={selectedIndexes.length && selectedIndexes.length === total}
        onChange={(e) => handleChangeCheckbox(e.target.checked, "all")}
      />
    );
  };

  const INTERNAL_renderCheckbox = (index) => {
    if (renderCheckbox) return renderCheckbox();
    return (
      <input
        type="checkbox"
        checked={selectedIndexes.includes(index)}
        onChange={(e) => handleChangeCheckbox(e.target.checked, index)}
      />
    );
  };

  const handleChangeCheckbox = (checked, index) => {
    if (index === "all") {
      if (checked) {
        setSelectedIndexes(generateAllIndexes());
      } else {
        setSelectedIndexes([]);
      }
    } else {
      if (checked) {
        setSelectedIndexes([...selectedIndexes, index]);
      } else {
        setSelectedIndexes(selectedIndexes.filter((idx) => idx !== index));
      }
    }
  };

  const onChangesearchTermFilter = (e) => {
    const { value } = e.target;
    setsearchTermFilter(value);
  };

  return (
    <>
      {!tableDataLoading ? (
        <>
          <input
            title="Search"
            onChange={onChangesearchTermFilter}
            placeholder={`search by ${searchColumn}`}
          />
          <table>
            <thead>
              <tr>
                <th>{selectable && INTERNAL_renderCheckboxAll()}</th>
                {INTERNAL_renderColumns()}
              </tr>
            </thead>
            <tbody>{INTERNAL_renderRows()}</tbody>
          </table>
        </>
      ) : (
        "...loading"
      )}
      <div>
        <p>Selected indexes: {JSON.stringify(selectedIndexes)}</p>
        <p>Total rows: {total}</p>
      </div>
    </>
  );
};

const TableWithErrorBoundary = (props) => (
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <Table {...props} />
  </ErrorBoundary>
);

export default TableWithErrorBoundary;
