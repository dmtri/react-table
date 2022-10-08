// TODO: props validation
import { useEffect } from "react";

const Search = ({
  searchTermFilter,
  setSearchTermFilter,
  searchColumn,
  renderSearch,
  onSearchTermFilterChange,
}) => {
  useEffect(() => {
    onSearchTermFilterChange && onSearchTermFilterChange(searchTermFilter);
  }, [searchTermFilter, onSearchTermFilterChange]);

  const onChangeSearchTermFilter = (e) => {
    const { value } = e.target;
    setSearchTermFilter(value);
  };
  return renderSearch ? (
    renderSearch()
  ) : (
    <input
      title="Search"
      value={searchTermFilter}
      onChange={onChangeSearchTermFilter}
      placeholder={`search by ${searchColumn}`}
    />
  );
};

export default Search;
