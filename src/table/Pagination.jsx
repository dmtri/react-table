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

  const nextPage = () => {
    const maxPage = Math.ceil(total / perPage);
    if (currentPage >= maxPage) {
      return;
    }
    onCurrentPageChange(currentPage + 1);
  };

  return (
    <div className="react-table _pagination">
      <button onClick={prevPage}>prev</button>
      <span>Current page: {currentPage}</span>
      <button onClick={nextPage}>next</button>

      <span>Per Page: {perPage}</span>
      <span>Total filtered: {total}</span>
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
