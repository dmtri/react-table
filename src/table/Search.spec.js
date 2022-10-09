import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import Search from "./Search";

const onSearchTermFilterChange = jest.fn();
const onSearchTermFilterChangeCallback = jest.fn();
const newSearchTerm = 'test'

const setup = () => {
  const searchTermFilter = "";
  const searchColumn = "title";

  render(
    <Search
      searchTermFilter={searchTermFilter}
      searchColumn={searchColumn}
      onSearchTermFilterChange={onSearchTermFilterChange}
      onSearchTermFilterChangeCallback={onSearchTermFilterChangeCallback}
    />
  );
  const input = screen.getByPlaceholderText("search by title");
  return input;
};

it("renders Search component with correct placeholder", () => {
  const input = setup();
  expect(input).toBeInTheDocument();
});

it("calls the appropriate callbacks when searchTerm changes", async () => {
  const input = setup();
  fireEvent.input(input, { target: { value: newSearchTerm } });
  expect(onSearchTermFilterChange).toHaveBeenCalled();
  expect(onSearchTermFilterChangeCallback).toHaveBeenCalled();
});
