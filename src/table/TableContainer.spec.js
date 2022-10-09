import React from "react";
import { render, screen } from "@testing-library/react";
import TableContainer from "./TableContainer";
import axios from "axios";
import userEvent from "@testing-library/user-event";
import { getStateFromHistory } from "../common";
import data from "../mockData";

const dataSourceAsync = () => {
  return new Promise((resolve) => {
    window.setTimeout(() => {
      resolve(axios.get("https://jsonplaceholder.typicode.com/posts"));
    }, 500);
  });
};

const dataSource = data;
const loading = false;
const selectable = true;
const sortable = true;
const emptyCellPlaceholder = "empty";
const columns = [
  { title: "User ID", path: "userId" },
  { title: "Post ID", path: "id" },
  { title: "Title", path: "title" },
  { title: "Body", path: "body" },
];
const searchColumn = "userId";
const renderRow = null;
const renderCell = null;
const renderCheckbox = null;
const renderCheckboxAll = null;
const renderColumns = null;
const renderSearch = null;
const renderLoader = null;
const onCellClick = jest.fn();
const onSelectionChange = jest.fn();
const onSearchTermFilterChange = jest.fn();
const onPaginationChange = jest.fn();

let component = null;

const defaultTestProps = {
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
  selectable,
  sortable,
  searchColumn,
  onSearchTermFilterChange,
  onSelectionChange,
  onPaginationChange,
  onCellClick,
  loading,
};

const setup = ({
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
  selectable,
  sortable,
  searchColumn,
  onSearchTermFilterChange,
  onSelectionChange,
  onPaginationChange,
  onCellClick,
  loading,
}) => {
  component = render(
    <TableContainer
      dataSource={dataSource}
      columns={columns}
      renderColumns={renderColumns}
      renderRow={renderRow}
      renderCell={renderCell}
      renderCheckbox={renderCheckbox}
      renderCheckboxAll={renderCheckboxAll}
      renderSearch={renderSearch}
      renderLoader={renderLoader}
      emptyCellPlaceholder={emptyCellPlaceholder}
      selectable={selectable}
      sortable={sortable}
      searchColumn={searchColumn}
      onSearchTermFilterChange={onSearchTermFilterChange}
      loading={loading}
      onSelectionChange={onSelectionChange}
      onPaginationChange={onPaginationChange}
      onCellClick={onCellClick}
    />
  );
};

afterEach(() => {
  component.unmount();
});

it("renders TableContainer component with checkbox", () => {
  setup(defaultTestProps);
  const checkboxAll = screen.getByTitle("checkbox-all");
  const checkboxes = screen.getAllByTitle("checkbox");
  expect(checkboxAll).toBeInTheDocument();
  expect(checkboxes[0]).toBeInTheDocument();
});

it("renders TableContainer with async dataSource", async () => {
  setup({
    ...defaultTestProps,
    dataSource: dataSourceAsync,
  });
  const loadingElem = screen.getByText("...loading");
  expect(loadingElem).toBeInTheDocument();
  // const checkbox = await screen.findByTitle("checkbox-all")
  // expect(checkbox).toBeInTheDocument()
});

it("renders TableContainer with default perPage, currentPage, total correctly", () => {
  setup(defaultTestProps);
  const currentPageElement = screen.getByTitle("current-page");
  const perPage = screen.getByTitle("per-page");
  const totalRows = screen.getByTitle("total-rows");
  const infoLength = screen.getByTitle("info-length");

  expect(currentPageElement).toHaveTextContent("Page: 1 / 4");
  expect(perPage).toHaveTextContent("25");
  expect(totalRows).toHaveTextContent("100");
  expect(infoLength).toHaveTextContent(`Selected: ${0} items`);
});

it("renders checkbox correctly when selected", () => {
  setup(defaultTestProps);
  const checkboxAll = screen.getByTitle("checkbox-all");
  userEvent.click(checkboxAll);
  const infoLength = screen.getByTitle("info-length");
  expect(infoLength).toHaveTextContent(`Selected: ${25} items`);

  const checkboxes = screen.getAllByTitle("checkbox");
  userEvent.click(checkboxes[0]);
  expect(infoLength).toHaveTextContent(`Selected: ${24} items`);
  expect(checkboxAll).toBePartiallyChecked();
});

it("renders rows correctly when sorting, and updates url", () => {
  setup(defaultTestProps);
  const currentPageElement = screen.getByTitle("current-page");
  expect(currentPageElement).toHaveTextContent("Page: 1 / 4");
  const nextButton = screen.getByTitle("next-button");
  userEvent.click(nextButton);
  expect(currentPageElement).toHaveTextContent("Page: 2 / 4");

  const colHeadings = screen.queryAllByTitle("col-heading");
  userEvent.click(colHeadings[0]); // change to asc
  userEvent.click(colHeadings[0]); // change to desc

  const cells = screen.queryAllByTitle("cell");
  expect(cells[4]).toHaveTextContent(`8`);
  const { sort } = getStateFromHistory();
  expect(sort.userId).toBe("desc");
});

it("resets selection when changing page, and updates url", () => {
  setup(defaultTestProps);
  const currentPageElement = screen.getByTitle("current-page");
  expect(currentPageElement).toHaveTextContent("Page: 1 / 4");

  const checkboxAll = screen.getByTitle("checkbox-all");
  userEvent.click(checkboxAll);
  const infoLength = screen.getByTitle("info-length");
  expect(infoLength).toHaveTextContent(`Selected: ${25} items`);
  const { selectedIndexes } = getStateFromHistory();
  expect(selectedIndexes.length).toBe(25);

  const nextButton = screen.getByTitle("next-button");
  userEvent.click(nextButton);
  expect(currentPageElement).toHaveTextContent("Page: 2 / 4");
  const { currentPage } = getStateFromHistory();
  expect(currentPage).toBe(2);
  expect(infoLength).toHaveTextContent(`Selected: ${0} items`);
});

it("renders correctly when changing perpage, and updates url accordingly", () => {
  setup(defaultTestProps);
  const totalRows = screen.getByTitle("total-rows");
  expect(totalRows).toHaveTextContent("Total rows: 100");

  const currentPageElement = screen.getByTitle("current-page");
  expect(currentPageElement).toHaveTextContent("Page: 1 / 4");

  const perpage = screen.getByTitle("select-perpage");
  const option = screen.getByTitle("perpage-50");
  userEvent.selectOptions(perpage, option);
  const { perPage } = getStateFromHistory();
  expect(perPage).toBe(50);
  expect(currentPageElement).toHaveTextContent("Page: 1 / 2");
});

it("renders rows correctly when searching", () => {
  setup(defaultTestProps);
  const checkboxAll = screen.getByTitle("checkbox-all");
  userEvent.click(checkboxAll);
  const infoLength = screen.getByTitle("info-length");
  expect(infoLength).toHaveTextContent(`Selected: ${50} items`);

  const search = screen.getByTitle("search");
  userEvent.type(search, "10");
  const currentPageElement = screen.getByTitle("current-page");
  expect(currentPageElement).toHaveTextContent("Page: 1 / 1");
  const totalRows = screen.getByTitle("total-rows");
  expect(totalRows).toHaveTextContent("10");
  expect(infoLength).toHaveTextContent(`Selected: ${0} items`);

  const cells = screen.queryAllByTitle("cell");
  expect(cells[1]).toHaveTextContent("91");
  const { searchTermFilter } = getStateFromHistory();
  expect(searchTermFilter).toBe("10");
});
