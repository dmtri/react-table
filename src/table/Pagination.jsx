// TODO: props validation
import { useEffect } from "react";

const Pagination = ({
  onPaginationChange,
  perPage,
  currentPage,
  setPerpage,
  setCurrentPage,
  totalRows,
}) => {
  useEffect(() => {
    onPaginationChange && onPaginationChange(currentPage, perPage);
  }, [currentPage, perPage, onPaginationChange]);

  const onChangePerPage = (e) => {
    const { value } = e.target;
    setPerpage(parseInt(value, 10));
  };

  const prevPage = () => {
    if (currentPage <= 1) {
      return;
    }
    setCurrentPage(currentPage - 1);
  };

  const nextPage = () => {
    const maxPage = Math.ceil(totalRows / perPage);
    if (currentPage >= maxPage) {
      return;
    }
    setCurrentPage(currentPage + 1);
  };

  const renderPagination = () => {
    return (
      <div className="react-table _pagination">
        <button onClick={prevPage}>prev</button>
        <span>Current page: {currentPage}</span>
        <button onClick={nextPage}>next</button>

        <span>Per Page {perPage}</span>
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

  return <div>{renderPagination()}</div>;
};

export default Pagination;
