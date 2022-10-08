// TODO: props validation
import { ErrorBoundary } from "react-error-boundary";

// TODO: move out of this file
const ErrorFallback = ({ error }) => {
  return (
    <div role="alert">
      <p>Something went wrong with Table component:</p>
      <pre>{error.message}</pre>
    </div>
  );
}

const Table = ({
  dataSource,
  columns,
  renderColumns,
  renderRows,
  renderCell,
  emptyCellPlaceholder,
}) => {
  const _renderColumns = () => {
    if (renderColumns) return columns.map(renderColumns);
    return columns.map((col) => <th>{col}</th>);
  };

  const _renderRows = () => {
    const rows = dataSource;
    if (renderRows) return rows.map(renderRows);
    return rows.map((row) => <tr>{_renderCell(row)}</tr>);
  };

  const _renderCell = (row) => {
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

  return (
    <table>
      <thead>
        <tr>{_renderColumns()}</tr>
      </thead>
      <tbody>{_renderRows()}</tbody>
    </table>
  );
};

const TableWithErrorBoundary = (props) => (
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <Table {...props} />
  </ErrorBoundary>
);

export default TableWithErrorBoundary;
