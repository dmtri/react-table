import React from "react";
import { render, screen } from "@testing-library/react";
import Table from "./Table";
import userEvent from "@testing-library/user-event";
import data from "../mockData";

const selectable = true;
const sortable = true;
const selectedIndexes = [0, 1];
const emptyCellPlaceholder = "empty";
const columns = [
  { title: "User ID", path: "userId" },
  { title: "Post ID", path: "id" },
  { title: "Title", path: "title" },
  { title: "Body", path: "body" },
];
const renderRow = null;
const renderCell = null;
const renderCheckbox = null;
const renderCheckboxAll = null;
const renderColumns = null;
const sortFilter = {};
const onSortFilterChange = jest.fn();
const onSelectedIndexesChange = jest.fn();
const onSelectionChangeCallback = jest.fn();
const onCellClick = jest.fn();

const setup = () => {
  render(
    <Table
      data={data}
      selectable={selectable}
      sortable={sortable}
      selectedIndexes={selectedIndexes}
      onSelectedIndexesChange={onSelectedIndexesChange}
      onSelectionChangeCallback={onSelectionChangeCallback}
      emptyCellPlaceholder={emptyCellPlaceholder}
      columns={columns}
      renderRow={renderRow}
      renderCell={renderCell}
      renderCheckbox={renderCheckbox}
      renderCheckboxAll={renderCheckboxAll}
      renderColumns={renderColumns}
      sortFilter={sortFilter}
      onSortFilterChange={onSortFilterChange}
      onCellClick={onCellClick}
    />
  );
  const checkboxAll = screen.getByTitle("checkbox-all");
  const checkboxes = screen.getAllByTitle("checkbox");
  const colHeadings = screen.getAllByTitle("col-heading");
  const cells = screen.queryAllByTitle("cell");

  return { checkboxAll, checkboxes, colHeadings, cells };
};

it("renders Table component with checkbox", () => {
  const { checkboxAll, checkboxes } = setup();
  expect(checkboxAll).toBeInTheDocument();
  expect(checkboxes[0]).toBeInTheDocument();
});

it("renders Table component without checkbox", () => {
  render(<Table data={data} selectable={false} columns={columns} />);
  const checkboxAll = screen.queryByTitle("checkbox-all");
  const checkboxes = screen.queryAllByTitle("checkbox");
  expect(checkboxAll).toBe(null);
  expect(checkboxes[0]).toBe(undefined);
});

it("renders Table component with sortable columns", () => {
  render(<Table data={data} sortable={true} columns={columns} />);
  const checkboxAll = screen.queryAllByTitle("sort-icon");
  expect(checkboxAll[0]).toBeInTheDocument();
});

it("renders Table component with data", () => {
  render(<Table data={data} columns={columns} />);
  const colHeadings = screen.queryAllByTitle("col-heading");
  const cells = screen.queryAllByTitle("cell");

  expect(colHeadings[0]).toHaveTextContent("User ID");
  expect(cells[0]).toHaveTextContent('{"id":1}');
});

it("renders Table empty table cell with -", () => {
  const columns = [
    { title: "User ID", path: "userId.id" },
    { title: "Post ID", path: "id" },
    { title: "Title", path: "title" },
    { title: "Body", path: "body" },
  ];
  render(<Table data={data} columns={columns} />);
  const cells = screen.queryAllByTitle("cell");

  expect(cells[4]).toHaveTextContent("-");
});

it("renders Table empty table cell with custom placeholder", () => {
  const columns = [
    { title: "User ID", path: "userId.id" },
    { title: "Post ID", path: "id" },
    { title: "Title", path: "title" },
    { title: "Body", path: "body" },
  ];
  render(
    <Table
      data={data}
      columns={columns}
      emptyCellPlaceholder={emptyCellPlaceholder}
    />
  );
  const cells = screen.queryAllByTitle("cell");

  expect(cells[4]).toHaveTextContent("empty");
});

it("calls the appropriate callbacks", () => {
  const { checkboxAll, colHeadings, cells } = setup();
  userEvent.click(checkboxAll)
  expect(onSelectedIndexesChange).toHaveBeenCalled();
  expect(onSelectionChangeCallback).toHaveBeenCalled();
  userEvent.click(colHeadings[0])
  expect(onSortFilterChange).toHaveBeenCalled();
  userEvent.click(cells[0])
  expect(onCellClick).toHaveBeenCalled();
});
