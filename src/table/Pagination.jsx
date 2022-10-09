// TODO: props validation
import { useEffect } from "react";

const Pagination = ({
  perPage,
  onPerpageChange,
  currentPage,
  onCurrentPageChange,
  total,
  onPaginationChangeCallback,
}) => {
  useEffect(() => {
    onPaginationChangeCallback && onPaginationChangeCallback(currentPage, perPage);
  }, [currentPage, perPage, onPaginationChangeCallback]);

  const onChangePerPage = (e) => {
    const { value } = e.target;
    onPerpageChange(parseInt(value, 10));
  };

  const prevPage = () => {
    if (currentPage <= 1) {
      return;
    }
    onCurrentPageChange(currentPage - 1);
  };

  const lastPage = Math.ceil(total / perPage);
  const nextPage = () => {
    if (currentPage >= lastPage) {
      return;
    }
    onCurrentPageChange(currentPage + 1);
  };
  
  return (
    <div className="react-table _pagination">
      <button title="prev-button" onClick={prevPage}>Previous page</button>
      <span title="current-page">Page: {currentPage} / {lastPage} </span>
      <button title="next-button" onClick={nextPage}>Next page</button>

      <span>Per page: {perPage}</span>
      <span>Total rows: {total}</span>
      <select
        name="perPage"
        id="perPage"
        onChange={onChangePerPage}
        value={perPage}
      >
        <option value={25}>25</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
      </select>
    </div>
  );
};

export default Pagination;
