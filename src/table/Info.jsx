// TODO: props validation

const Info = ({ paginatedData, selectedIndexes }) => {
  const selectedRows = paginatedData.filter((_, index) =>
    selectedIndexes.includes(index)
  );

  return (
    <div>
      <pre>Selected: {JSON.stringify(selectedRows, null, 4)}</pre>
    </div>
  );
};

export default Info;
