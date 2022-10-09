// TODO: props validation
import { useEffect } from "react";

const Search = ({
  searchTermFilter,
  onSearchTermFilterChange,
  searchColumn,
  renderSearch,
  onSearchTermFilterChangeCallback,
}) => {
  useEffect(() => {
    onSearchTermFilterChangeCallback && onSearchTermFilterChangeCallback(searchTermFilter);
  }, [searchTermFilter, onSearchTermFilterChangeCallback]);

  const onChangeSearch = (e) => {
    const { value } = e.target;
    onSearchTermFilterChange(value);
  };
  return renderSearch ? (
    renderSearch()
  ) : (
    <input
      title="Search"
      value={searchTermFilter}
      onChange={onChangeSearch}
      placeholder={`search by ${searchColumn}`}
    />
  );
};

export default Search;
