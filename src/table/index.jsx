// TODO: props validation
import { useEffect, useState, useRef } from "react";
import { ErrorBoundary } from "react-error-boundary";

// TODO: move out of this file
const ErrorFallback = ({ error }) => {
  return (
    <div role="alert">
      <p>Something went wrong with Table component:</p>
      <pre>{error.message}</pre>
    </div>
  );
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
}) => {
  const [selectedIndexes, setSelectedIndexes] = useState([]);
  const [total, setTotal] = useState([]);
  const checkboxAllRef = useRef();

  useEffect(() => {
    setTotal(dataSource.length);
  }, [dataSource]);

  useEffect(() => {
    // if neither empty nor all checked, set indeterminate = true
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

  const INTERNAL_renderColumns = () => {
    if (renderColumns) return columns.map(renderColumns);
    return columns.map((col) => <th>{col}</th>);
  };

  const INTERNAL_renderRows = () => {
    const rows = dataSource;
    if (renderRows) return rows.map(renderRows);
    return rows.map((row, index) => (
      <tr>
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
    return cells.map((cell) => <td>{cell}</td>);
  };

  const INTERNAL_renderCheckboxAll = () => {
    if (renderCheckboxAll) return renderCheckboxAll();
    return (
      <input
        ref={checkboxAllRef}
        type="checkbox"
        checked={selectedIndexes.length === total}
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

  return (
    <table>
      <thead>
        <tr>
          <th>{selectable && INTERNAL_renderCheckboxAll()}</th>
          {INTERNAL_renderColumns()}
        </tr>
      </thead>
      <tbody>{INTERNAL_renderRows()}</tbody>
      <tfoot>
        <tr>
          <td>Selected: {JSON.stringify(selectedIndexes)}</td>
          <td>Total: {total}</td>
        </tr>
      </tfoot>
    </table>
  );
};

const TableWithErrorBoundary = (props) => (
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <Table {...props} />
  </ErrorBoundary>
);

export default TableWithErrorBoundary;
