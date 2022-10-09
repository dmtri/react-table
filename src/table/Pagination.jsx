import PropTypes from "prop-types";
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
    onPaginationChangeCallback &&
      onPaginationChangeCallback(currentPage, perPage);
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
      <button title="prev-button" onClick={prevPage}>
        Previous page
      </button>
      <span title="current-page">
        Page: {currentPage} / {lastPage}{" "}
      </span>
      <button title="next-button" onClick={nextPage}>
        Next page
      </button>
      <div>
        <span title="per-page">Per page: {perPage}</span>
        <select
          title="select-perpage"
          name="perPage"
          id="perPage"
          onChange={onChangePerPage}
          value={perPage}
        >
          <option value={25}>25</option>
          <option title="perpage-50" value={50}>50</option>
          <option value={100}>100</option>
        </select>
        <span title="total-rows">Total rows: {total}</span>
      </div>
    </div>
  );
};

Pagination.propTypes = {
  perPage: PropTypes.number.isRequired,
  onPerpageChange: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  onCurrentPageChange: PropTypes.func.isRequired,
  total: PropTypes.number.isRequired,
  onPaginationChangeCallback: PropTypes.func,
};

export default Pagination;
