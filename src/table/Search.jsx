// TODO: props validation

const Search = ({
  searchTermFilter,
  setSearchTermFilter,
  searchColumn,
}) => {
  const onChangeSearchTermFilter = (e) => {
    const { value } = e.target;
    setSearchTermFilter(value);
  };
  return (
    <input
      title="Search"
      value={searchTermFilter}
      onChange={onChangeSearchTermFilter}
      placeholder={`search by ${searchColumn}`}
    />
  );
};

export default Search;
