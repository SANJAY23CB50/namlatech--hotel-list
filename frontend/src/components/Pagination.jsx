function Pagination({ page, total, limit, onPageChange }) {
  const pageCount = Math.max(1, Math.ceil(total / limit));

  if (total === 0) {
    return null;
  }

  const pages = [];
  for (let i = 1; i <= pageCount; i += 1) {
    pages.push(i);
  }

  return (
    <nav className="pagination" aria-label="Hotel pages">
      <button type="button" className="page-btn" disabled={page <= 1} onClick={function () { onPageChange(page - 1); }}>
        Previous
      </button>
      {pages.map(function (number) {
        return (
          <button
            type="button"
            key={number}
            className={number === page ? "page-btn active" : "page-btn"}
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
        className="page-btn"
        disabled={page >= pageCount}
        onClick={function () {
          onPageChange(page + 1);
        }}
      >
        Next
      </button>
    </nav>
  );
}

export default Pagination;
