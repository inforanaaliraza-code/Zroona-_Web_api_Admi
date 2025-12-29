import { useEffect, useState } from "react";

function Paginations({ handlePage, page, total, itemsPerPage }) {
  const [activePage, setActivePage] = useState(page);
  const totalPages = Math.ceil(total / itemsPerPage); // Calculate total pages based on itemsPerPage

  useEffect(() => {
    setActivePage(page);
  }, [page]);

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
    handlePage(pageNumber);
  };

  const renderPageNumbers = () => {
    let pages = [];

    if (totalPages <= 8) {
      // Show all pages if totalPages is 10 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <a
            key={i}
            href="#"
            onClick={() => handlePageChange(i)}
            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
              activePage === i
                ? "z-10 bg-[#a797cc] text-white"
                : "text-gray-800 ring-1 ring-inset ring-gray-300 bg-white hover:bg-gray-50"
            } focus:z-20 focus:outline-offset-0`}
          >
            {i}
          </a>
        );
      }
    } else {
      // Always show the first two pages
      for (let i = 1; i <= 2; i++) {
        pages.push(
          <a
            key={i}
            href="#"
            onClick={() => handlePageChange(i)}
            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
              activePage === i
                ? "z-10 bg-[#a797cc] text-white"
                : "text-gray-800 ring-1 ring-inset ring-gray-300 bg-white hover:bg-gray-50"
            } focus:z-20 focus:outline-offset-0`}
          >
            {i}
          </a>
        );
      }

      if (activePage > 4) {
        // Add ellipsis if the active page is beyond the first few pages
        pages.push(
          <span
            key="start-ellipsis"
            className="inline-flex items-center px-3 py-2 text-sm text-gray-900 bg-white ring-1 ring-inset ring-gray-300"
          >
            ...
          </span>
        );
      }

      // Show pages around the active page
      for (
        let i = Math.max(3, activePage - 1);
        i <= Math.min(totalPages - 2, activePage + 1);
        i++
      ) {
        pages.push(
          <a
            key={i}
            href="#"
            onClick={() => handlePageChange(i)}
            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
              activePage === i
                ? "z-10 bg-[#a797cc] text-white"
                : "text-gray-800 ring-1 ring-inset ring-gray-300 bg-white hover:bg-gray-50"
            } focus:z-20 focus:outline-offset-0`}
          >
            {i}
          </a>
        );
      }

      if (activePage < totalPages - 3) {
        // Add ellipsis before the last two pages
        pages.push(
          <span
            key="end-ellipsis"
            className="inline-flex items-center px-3 py-2 text-sm text-gray-900 bg-white ring-1 ring-inset ring-gray-300"
          >
            ...
          </span>
        );
      }

      // Show the last two pages
      for (let i = totalPages - 1; i <= totalPages; i++) {
        pages.push(
          <a
            key={i}
            href="#"
            onClick={() => handlePageChange(i)}
            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
              activePage === i
                ? "z-10 bg-[#a797cc] text-white"
                : "text-gray-800 ring-1 ring-inset ring-gray-300 bg-white hover:bg-gray-50"
            } focus:z-20 focus:outline-offset-0`}
          >
            {i}
          </a>
        );
      }
    }

    return pages;
  };

  return (
    <div className="flex justify-center">
      <nav
        className="isolate inline-flex -space-x-px rounded-md shadow-sm"
        aria-label="Pagination"
      >
        {/* Previous Button */}
        <a
          href="#"
          onClick={() => handlePageChange(Math.max(1, activePage - 1))}
          className="relative inline-flex items-center rounded-l-md px-2 py-2 bg-white text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
        >
          <span className="sr-only">Previous</span>
          <svg
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
              clipRule="evenodd"
            />
          </svg>
        </a>

        {/* Page Numbers */}
        {renderPageNumbers()}

        {/* Next Button */}
        <a
          href="#"
          onClick={() => handlePageChange(Math.min(totalPages, activePage + 1))}
          className="relative inline-flex items-center rounded-r-md px-2 py-2 bg-[white] text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
        >
          <span className="sr-only">Next</span>
          <svg
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
              clipRule="evenodd"
            />
          </svg>
        </a>
      </nav>
    </div>
  );
}

export default Paginations;
