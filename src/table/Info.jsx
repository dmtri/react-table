import PropTypes from "prop-types";

const Info = ({ data, selectedIndexes }) => {
  const selectedRows = data.filter((_, index) =>
    selectedIndexes.includes(index)
  );

  return (
    <>
      <pre title="info-length">Selected: {selectedRows.length} items</pre>
      <pre>Selected: {JSON.stringify(selectedRows, null, 4)}</pre>
    </>
  );
};

Info.propTypes = {
  data: PropTypes.array.isRequired,
  selectedIndexes: PropTypes.array.isRequired,
};

export default Info;
