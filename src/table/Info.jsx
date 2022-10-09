// TODO: props validation

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

export default Info;
