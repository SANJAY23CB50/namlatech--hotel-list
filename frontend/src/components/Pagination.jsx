function Pagination({ page, total, limit, onPageChange }) {
  const pageCount = Math.max(1, Math.ceil(total / limit));

  if (total === 0 || pageCount <= 1) {
    return null;
  }

  const pages = [];
  for (let i = 1; i <= pageCount; i += 1) {
    pages.push(i);
  }

  return (
    <nav className="pagination-bar" aria-label="Hotel search pagination">
      <button
        type="button"
        className="page-nav-btn"
        disabled={page <= 1}
        onClick={function () {
          onPageChange(page - 1);
        }}
        aria-label="Previous page"
      >
        ‹
      </button>

      {pages.map(function (number) {
        return (
          <button
            type="button"
            key={number}
            className={number === page ? "page-num-btn active" : "page-num-btn"}
            onClick={function () {
              onPageChange(number);
            }}
            aria-current={number === page ? "page" : undefined}
          >
            {number}
          </button>
        );
      })}

      <button
        type="button"
        className="page-nav-btn"
        disabled={page >= pageCount}
        onClick={function () {
          onPageChange(page + 1);
        }}
        aria-label="Next page"
      >
        ›
      </button>
    </nav>
  );
}

export default Pagination;
