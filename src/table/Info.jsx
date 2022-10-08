// TODO: props validation

const Info = ({ paginatedData, total, selectedIndexes }) => {
  const selectedRows = paginatedData.filter((_, index) =>
    selectedIndexes.includes(index)
  );

  return (
    <div>
      <pre>Selected: {JSON.stringify(selectedRows, null, 4)}</pre>
      <p>Total rows: {total}</p>
    </div>
  );
};

export default Info;
