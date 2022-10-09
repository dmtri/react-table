# React Minimal Table
---

React Minimal Table component for React

## Screenshots

<img src="https://i.postimg.cc/QMpMXkgQ/image.png" width="550"/>

## Install & Running development mode

```bash
yarn
yarn run start
```

## Usage

````js
import Table from "./table";
import data from "./mockData";

import "./App.css";

function App() {
  return (
    <div className="App">
      <Table
        dataSource={data}
        columns={[
          { title: "User ID", path: "userId" },
          { title: "Post ID", path: "id" },
          { title: "Title", path: "title" },
          { title: "Body", path: "body" },
        ]}
        searchColumn="userId"
      />
    </div>
  );
}

export default App;

`````

## API


### Table (TableContainer)
````js
TableContainer.propTypes = {
  dataSource: PropTypes.oneOfType([PropTypes.array, PropTypes.func]).isRequired, // could be an array or a function to fetch async data
  loading: PropTypes.bool,
  columns: PropTypes.array.isRequired, // list of column titles and path in dataSource
  renderColumns: PropTypes.func, // custom function to render table columns
  renderRow: PropTypes.func, // custom function to render table rows
  renderCell: PropTypes.func, // custom function to render table cell
  renderCheckbox: PropTypes.func, // custom function to render table checkbox
  renderCheckboxAll: PropTypes.func, // custom function to render table checkbox (check all)
  renderSearch: PropTypes.func, // custom function to render search input
  renderLoader: PropTypes.func, // custom function to render loader
  emptyCellPlaceholder: PropTypes.string, // custom placeholder for empty cell
  selectable: PropTypes.bool, // allow select with checkboxes
  sortable: PropTypes.bool, // allow sort by clicking on column headings
  searchColumn: PropTypes.string, // specify the column to search in
  onSearchTermFilterChange: PropTypes.func, // callback when search input changes
  onSelectionChange: PropTypes.func, // callback when selection changes
  onPaginationChange: PropTypes.func, // callback when pagination changes
  onCellClick: PropTypes.func, // callback when cell is clicked
  displayDebugInfo: PropTypes.bool, // display Info component for debugging
};
````

### Pagination

````js
Pagination.propTypes = {
  perPage: PropTypes.number.isRequired, // number of rows per page
  onPerpageChange: PropTypes.func.isRequired, // callback when perPage changes
  currentPage: PropTypes.number.isRequired,
  onCurrentPageChange: PropTypes.func.isRequired, // callback when currentPage changes
  total: PropTypes.number.isRequired, // total number of rows (after filtering)
  onPaginationChangeCallback: PropTypes.func, // callback when pagination changes (if using through TableContainer)
};
````

### Search
````js
Search.propTypes = {
  searchTermFilter: PropTypes.string.isRequired, // current search term
  onSearchTermFilterChange: PropTypes.func.isRequired, // callback when search input changes
  searchColumn: PropTypes.string.isRequired, // name of column to search for, used to display input placeholder
  renderSearch: PropTypes.func, // custom function to render search input
  onSearchTermFilterChangeCallback: PropTypes.func, // callback when search input changes (if using through TableContainer)
};
````

## Example

`yarn start` and then go to `http://localhost:3000/`

## Test Case & Coverage

```bash
# please use node >= 16.0.0
yarn test --coverage
```