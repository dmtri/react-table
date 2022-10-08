// TODO: props validation

import { useEffect, useRef } from "react";
import { SORT_STATE, generateAllIndexes } from "../common.js";
import { useIndeterminateCheckbox } from "../hooks.js";

const Table = ({
  selectable,
  selectedIndexes,
  setSelectedIndexes,
  onSelectionChange,
  emptyCellPlaceholder,
  data,
  columns,
  renderRow,
  renderCell,
  renderCheckbox,
  renderCheckboxAll,
  renderColumns,
  sortFilter,
  setSortFilter,
  onCellClick,
}) => {
  const checkboxAllRef = useRef();
  useEffect(() => {
    onSelectionChange && onSelectionChange(selectedIndexes);
  }, [selectedIndexes, onSelectionChange]);
  useIndeterminateCheckbox(checkboxAllRef, selectedIndexes, data.length);

  const INTERNAL_renderRows = () => {
    const rows = data;
    if (!rows || !rows.length) return;
    if (renderRow) return rows.map(renderRow);
    return rows.map((row, index) => (
      <tr key={index}>
        <td>{selectable && INTERNAL_renderCheckbox(index)}</td>
        {INTERNAL_renderCell(row)}
      </tr>
    ));
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
    return cells.map((cell, index) => (
      <td key={index} onClick={() => onCellClick && onCellClick(cell, index)}>
        {cell}
      </td>
    ));
  };

  const INTERNAL_renderCheckboxAll = () => {
    if (renderCheckboxAll) return renderCheckboxAll();
    return (
      <input
        ref={checkboxAllRef}
        type="checkbox"
        checked={
          selectedIndexes.length && selectedIndexes.length === data.length
        }
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
        setSelectedIndexes(generateAllIndexes(data.length));
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
