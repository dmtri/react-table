import React from "react";
import { render, screen } from "@testing-library/react";
import Pagination from "./Pagination";
import userEvent from "@testing-library/user-event";

const perPage = 10;
let currentPage = 2;
const total = 200;
const onPerpageChange = jest.fn();
const onCurrentPageChange = jest.fn((c) => {
    console.log(c)
    currentPage = c
});
const onPaginationChangeCallback = jest.fn();

const setup = () => {
  render(
    <Pagination
      perPage={perPage}
      onPerpageChange={onPerpageChange}
      currentPage={currentPage}
      onCurrentPageChange={onCurrentPageChange}
      total={total}
      onPaginationChangeCallback={onPaginationChangeCallback}
    />
  );
  const currentPageElement = screen.getByTitle('current-page')
  const prevButton = screen.getByTitle('prev-button')
  const nextButton = screen.getByTitle('next-button')
  return { prevButton, nextButton, currentPageElement };
};

it("renders Search component with correct placeholder", () => {
  const { currentPageElement } = setup();
  expect(currentPageElement).toBeInTheDocument()
  expect(currentPageElement).toHaveTextContent('Page: 2 / 20')
});

it("calls the appropriate callbacks when next/prev is clicked", () => {
  const { prevButton, nextButton, currentPageElement } = setup();
  expect(currentPageElement).toHaveTextContent('Page: 2 / 20')
  userEvent.click(prevButton)
  expect(onCurrentPageChange).toHaveBeenCalled();
  userEvent.click(nextButton)
  expect(onPaginationChangeCallback).toHaveBeenCalled();
});