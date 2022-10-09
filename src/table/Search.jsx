import PropTypes from "prop-types";
import { useEffect } from "react";

const Search = ({
  searchTermFilter,
  onSearchTermFilterChange,
  searchColumn,
  renderSearch,
  onSearchTermFilterChangeCallback,
}) => {
  useEffect(() => {
    onSearchTermFilterChangeCallback &&
      onSearchTermFilterChangeCallback(searchTermFilter);
  }, [searchTermFilter, onSearchTermFilterChangeCallback]);

  const onChangeSearch = (e) => {
    const { value } = e.target;
    onSearchTermFilterChange && onSearchTermFilterChange(value);
  };
  return renderSearch ? (
    renderSearch()
  ) : (
    <input
      title="search"
      value={searchTermFilter}
      onChange={onChangeSearch}
      placeholder={`search by ${searchColumn}`}
    />
  );
};

Search.propTypes = {
  searchTermFilter: PropTypes.string.isRequired,
  onSearchTermFilterChange: PropTypes.func.isRequired,
  searchColumn: PropTypes.string.isRequired,
  renderSearch: PropTypes.func,
  onSearchTermFilterChangeCallback: PropTypes.func,
};

export default Search;
