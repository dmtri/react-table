// TODO: props validation

import { useEffect } from "react";
import { SORT_STATE, generateAllIndexes } from "./common.js";

const Table = ({
  selectable,
  renderCheckboxAll,
  checkboxAllRef,
  selectedIndexes,
  total,
  emptyCellPlaceholder,
  paginatedData,
  renderRows,
  renderCell,
  renderCheckbox,
  columns,
  setSelectedIndexes,
  renderColumns,
  sortFilter,
  setSortFilter,
  onSelectionChange,
}) => {
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

  const INTERNAL_renderRows = () => {
    const rows = paginatedData;
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
        setSelectedIndexes(generateAllIndexes(total));
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

  useEffect(() => {
    onSelectionChange && onSelectionChange(selectedIndexes);
  }, [selectedIndexes, onSelectionChange]);

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

  return (
    <table>
      <thead>
        <tr>
          <th>{selectable && INTERNAL_renderCheckboxAll()}</th>
          {INTERNAL_renderColumns()}
        </tr>
      </thead>
      <tbody>{INTERNAL_renderRows()}</tbody>
    </table>
  );
};

export default Table;
