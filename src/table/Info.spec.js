import React from "react";
import { render, screen } from "@testing-library/react";
import data from "../mockData";
import Info from "./Info";

const selectedIndexes = [0,1];

const setup = () => {
  render(
    <Info
        data={data}
        selectedIndexes={selectedIndexes}
    />
  );
  const info = screen.getByTitle("info-length");
  return info;
};

it("renders Search component with correct placeholder", () => {
  const info = setup();
  expect(info).toHaveTextContent(`Selected: ${selectedIndexes.length} items`)
});