// TODO: props validation

const Info = ({ data, selectedIndexes }) => {
  const selectedRows = data.filter((_, index) =>
    selectedIndexes.includes(index)
  );

  return (
    <div>
      <pre>Selected: {JSON.stringify(selectedRows, null, 4)}</pre>
    </div>
  );
};

export default Info;
