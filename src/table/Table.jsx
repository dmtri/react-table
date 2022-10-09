import PropTypes from "prop-types";
import { useEffect, useRef } from "react";
import { SORT_STATE, generateAllIndexes, objectAccessor } from "../common.js";
import { useIndeterminateCheckbox } from "../hooks.js";

const Table = ({
  selectable,
  sortable,
  selectedIndexes,
  onSelectedIndexesChange,
  onSelectionChangeCallback,
  emptyCellPlaceholder,
  data,
  columns,
  renderRow,
  renderCell,
  renderCheckbox,
  renderCheckboxAll,
  renderColumns,
  sortFilter = {},
  onSortFilterChange,
  onCellClick,
}) => {
  const checkboxAllRef = useRef();
  useEffect(() => {
    onSelectionChangeCallback && onSelectionChangeCallback(selectedIndexes);
  }, [selectedIndexes, onSelectionChangeCallback]);
  useIndeterminateCheckbox(checkboxAllRef, selectedIndexes, data.length);

  const INTERNAL_renderRows = () => {
    const rows = data;
    if (!rows || !rows.length) return;
    if (renderRow) return rows.map(renderRow);
    return rows.map((row, index) => (
      <tr key={index} title="row">
        <td>{selectable && INTERNAL_renderCheckbox(index)}</td>
        {INTERNAL_renderCell(row)}
      </tr>
    ));
  };

  const INTERNAL_renderColumns = () => {
    if (renderColumns) return columns.map(renderColumns);
    return columns.map(({ title, path }, index) => (
      <th
        key={index}
        title="col-heading"
        className="react-table _col-heading"
        onClick={() => sortColumn(path)}
      >
        {sortable && renderSort(path)}
        {title}
      </th>
    ));
  };

  const INTERNAL_renderCell = (row) => {
    const cells = columns.map(({ path }) => {
      const cellValue =
        objectAccessor(row, path) || emptyCellPlaceholder || "-";
      return typeof cellValue === "object"
        ? JSON.stringify(cellValue)
        : cellValue;
    });
    if (renderCell) return cells.map(renderCell);
    return cells.map((cell, index) => (
      <td
        title="cell"
        key={index}
        onClick={() => onCellClick && onCellClick(cell, index)}
      >
        {cell}
      </td>
    ));
  };

  const INTERNAL_renderCheckboxAll = () => {
    if (renderCheckboxAll) return renderCheckboxAll();
    return (
      <input
        title="checkbox-all"
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
        title="checkbox"
        type="checkbox"
        checked={selectedIndexes.includes(index)}
        onChange={(e) => handleChangeCheckbox(e.target.checked, index)}
      />
    );
  };

  const handleChangeCheckbox = (checked, index) => {
    if (index === "all") {
      if (checked) {
        onSelectedIndexesChange(generateAllIndexes(data.length));
      } else {
        onSelectedIndexesChange([]);
      }
    } else {
      if (checked) {
        onSelectedIndexesChange([...selectedIndexes, index]);
      } else {
        onSelectedIndexesChange(selectedIndexes.filter((idx) => idx !== index));
      }
    }
  };

  const renderSort = (path) => {
    let text = "";
    if (sortFilter[path] === SORT_STATE.NONE) {
      text = "";
    } else if (sortFilter[path] === SORT_STATE.ASC) {
      text = "▲";
    } else if (sortFilter[path] === SORT_STATE.DESC) {
      text = "▼";
    }
    return <span title="sort-icon">{text}</span>;
  };

  const getEmptySortFilter = () => {
    const newFilter = {};
    columns.forEach(({ path }) => {
      newFilter[path] = SORT_STATE.NONE;
    });
    return newFilter;
  };

  const sortColumn = (path) => {
    if (!sortable) return;
    // only support single column sort for now
    const newFilter = getEmptySortFilter();
    if (sortFilter[path] === SORT_STATE.NONE) {
      newFilter[path] = SORT_STATE.ASC;
    } else if (sortFilter[path] === SORT_STATE.ASC) {
      newFilter[path] = SORT_STATE.DESC;
    } else if (sortFilter[path] === SORT_STATE.DESC) {
      newFilter[path] = SORT_STATE.NONE;
    }
    onSortFilterChange(newFilter);
  };

  return (
    <table className="react-table _table">
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

Table.propTypes = {
  selectable: PropTypes.bool,
  sortable: PropTypes.bool,
  selectedIndexes: PropTypes.array,
  onSelectedIndexesChange: PropTypes.func,
  onSelectionChangeCallback: PropTypes.func,
  emptyCellPlaceholder: PropTypes.string,
  data: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  renderRow: PropTypes.func,
  renderCell: PropTypes.func,
  renderCheckbox: PropTypes.func,
  renderCheckboxAll: PropTypes.func,
  renderColumns: PropTypes.func,
  sortFilter: PropTypes.object,
  onSortFilterChange: PropTypes.func,
  onCellClick: PropTypes.func,
};

export default Table;
