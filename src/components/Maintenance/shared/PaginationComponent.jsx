import React, { useState, useEffect } from 'react';
import { MaintenanceNotificationCard } from './MaintenanceNotificationCard';

const Pagination = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5; // Number of items per page
  const totalPages = Math.ceil(data.length / pageSize);

  useEffect(() => {
    console.log('Page changed to:', currentPage);
  }, [currentPage]);

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  // Paginated data
  const startIndex = (currentPage - 1) * pageSize;
  const currentPageData = data.slice(startIndex, startIndex + pageSize);

  return (
    <section className="relative flex flex-col justify-start bg-slate-50 overflow-hidden antialiased">
      <div className="w-full max-w-6xl mx-auto px-4 md:px-6 py-0">
        <div className="flex flex-col justify-self-start divide-y divide-slate-200 [&>*]:py-0 -mt-18">
          <div className="w-full max-w-3xl mx-auto">
            <div className="space-y-5 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:ml-[8.75rem] md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
              {currentPageData.map((notification, index) => (
                <MaintenanceNotificationCard
                  key={index}
                  notification={notification}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-8">
        <nav aria-label="Page navigation">
          <ul className="inline-flex -space-x-px text-sm">
            <li>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 h-8 text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 disabled:opacity-50"
              >
                Previous
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <li key={page}>
                <button
                  onClick={() => handlePageChange(page)}
                  className={`px-3 h-8 border ${
                    currentPage === page
                      ? 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                      : 'text-gray-500 bg-white hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              </li>
            ))}
            <li>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 h-8 text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 disabled:opacity-50"
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </section>
  );
};

export default Pagination;
