import React, { useState, useEffect } from 'react';
import ContestTable from '../components/ContestTable';
import { SearchIcon, FilterIcon, RefreshIcon, Calendar, ChevronLeftIcon, ChevronRightIcon } from '../components/Icons';
import ApiRequest from '../services/ApiRequest';
import { CONTEST_BASE_URL, USER_BASE_URL } from '../constants';
import { useSelector } from 'react-redux';

const PastContestsPage = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [dateRange, setDateRange] = useState('30'); // Default to last 30 days
  const [userRole, setUserRole] = useState('USER'); // Default to regular user
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  const userData = useSelector((state) => state.auth.userData);
  
  const platforms = [
    { id: 'all', name: 'All Platforms' },
    { id: 'codeforces', name: 'Codeforces' },
    { id: 'leetcode', name: 'LeetCode' },
    { id: 'codechef', name: 'CodeChef' },
  ];

  const dateRanges = [
    { value: '7', label: 'Last 7 days' },
    { value: '30', label: 'Last 30 days' },
    { value: '90', label: 'Last 3 months' },
    { value: '365', label: 'Last year' },
    { value: 'all', label: 'All time' }
  ];

  useEffect(() => {
    const fetchUserRole = async () => {
      try {        
        if (userData && userData.role) {
          setUserRole(userData.role);
          return;
        }
        
        // Fallback to API request if not in Redux state
        const apiRequest = new ApiRequest(`${USER_BASE_URL}/current-user`);
        const response = await apiRequest.getRequest();
        
        if (response.success && response.data && response.data.role) {
          setUserRole(response.data.role);
        }
      } catch (err) {
        setError(err.message);
      }
    };
    
    fetchUserRole();
  }, []);

  const fetchContests = async (page = currentPage) => {
    setLoading(true);

    try {
      const apiRequest = new ApiRequest(`${CONTEST_BASE_URL}/past?page=${page}`);
      const response = await apiRequest.getRequest();
      
      if(!response.success){
        throw new Error("Failed to fetch contests");
      }
      
      setContests(response.data.contests);
      
      // Update pagination data
      setHasNextPage(response.data.pagination.hasNextPage);
      setHasPrevPage(response.data.pagination.hasPrevPage);
      setTotalPages(response.data.pagination.totalPages || 1);
      setCurrentPage(page);
      setError(null);
    } catch (err) {
      console.error('Error fetching contests:', err);
      setError('Failed to load contests. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContests(1); // Reset to page 1 when filters change
  }, [dateRange, platformFilter]);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && (newPage <= totalPages || hasNextPage)) {
      fetchContests(newPage);
      window.scrollTo(0, 0); // Scroll to top when page changes
    }
  };

  // Handle contest update - this will be passed to ContestTable to update contests when a solution is added
  const handleContestUpdated = (updatedContests) => {
    if (Array.isArray(updatedContests)) {
      setContests(updatedContests);
    }
  };

  // Filter contests based on search term 
  const filteredContests = contests.filter(contest => {
    return contest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           contest.platform.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5; // Max number of page buttons to show
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages around current page
      let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      let endPage = startPage + maxVisiblePages - 1;
      
      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Add ellipsis indicators
      if (startPage > 1) {
        pages.unshift('...');
        pages.unshift(1);
      }
      
      if (endPage < totalPages) {
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  // Check if user is admin
  const isAdmin = userRole === 'ADMIN';
  

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Past Programming Contests</h1>
          <p className="text-gray-400">
            Browse previous contests and access solutions from various competitive programming platforms
          </p>
        </header>

        <div className="mb-8 flex flex-col md:flex-row gap-4 justify-between">
          {/* Search Bar */}
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="bg-gray-800 w-full py-2 pl-10 pr-4 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              placeholder="Search past contests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-3">
            {/* Admin Badge - only shown for admins */}
            {isAdmin && (
              <div className="bg-purple-900 text-purple-100 px-3 py-2 rounded-md flex items-center">
                <span className="text-xs font-medium">Admin Mode</span>
              </div>
            )}

            {/* Date Range Filter */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <select
                className="bg-gray-800 py-2 pl-10 pr-8 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white appearance-none"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                {dateRanges.map(range => (
                  <option key={range.value} value={range.value}>{range.label}</option>
                ))}
              </select>
            </div>

            {/* Platform Filter */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FilterIcon className="h-5 w-5 text-gray-400" />
              </div>
              <select
                className="bg-gray-800 py-2 pl-10 pr-8 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white appearance-none"
                value={platformFilter}
                onChange={(e) => setPlatformFilter(e.target.value)}
              >
                {platforms.map(platform => (
                  <option key={platform.id} value={platform.id}>{platform.name}</option>
                ))}
              </select>
            </div>

            {/* Refresh Button */}
            <button
              onClick={() => fetchContests(currentPage)}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshIcon className={`h-5 w-5 mr-1 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {error ? (
          <div className="bg-red-900 bg-opacity-30 border border-red-700 text-red-100 p-4 rounded-md mb-8">
            <p>{error}</p>
            <button 
              onClick={() => fetchContests(currentPage)}
              className="mt-2 text-sm underline hover:text-red-200"
            >
              Try again
            </button>
          </div>
        ) : loading && contests.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse flex flex-col items-center">
              <div className="rounded-full bg-gray-700 h-16 w-16 flex items-center justify-center mb-4">
                <RefreshIcon className="h-8 w-8 text-gray-500 animate-spin" />
              </div>
              <p className="text-gray-400">Loading contests...</p>
            </div>
          </div>
        ) : (
          <>
            {filteredContests.length > 0 ? (
              <ContestTable 
                contests={filteredContests} 
                type="past" 
                isAdmin={isAdmin}
                onContestUpdated={handleContestUpdated}
              />
            ) : (
              <div className="text-center py-16 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700">
                <div className="mx-auto h-16 w-16 text-gray-600 mb-4">
                  <SearchIcon className="h-full w-full" />
                </div>
                <h3 className="text-xl font-medium text-gray-300">No contests found</h3>
                <p className="text-gray-400 mt-2">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}

            {/* Pagination Controls */}
            {(hasPrevPage || hasNextPage || totalPages > 1) && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center space-x-2" aria-label="Pagination">
                  {/* Previous Page Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!hasPrevPage}
                    className="px-3 py-2 rounded-md border border-gray-700 bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed flex items-center"
                    aria-label="Previous page"
                  >
                    <ChevronLeftIcon className="h-5 w-5" />
                    <span className="sr-only md:not-sr-only md:ml-1">Previous</span>
                  </button>

                  {/* Page Numbers */}
                  <div className="hidden md:flex space-x-1">
                    {getPageNumbers().map((page, index) => (
                      page === '...' ? (
                        <span key={`ellipsis-${index}`} className="px-3 py-2">...</span>
                      ) : (
                        <button
                          key={`page-${page}`}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-2 rounded-md ${
                            currentPage === page
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-800 border border-gray-700 hover:bg-gray-700'
                          }`}
                          aria-current={currentPage === page ? 'page' : undefined}
                        >
                          {page}
                        </button>
                      )
                    ))}
                  </div>

                  {/* Mobile Page Indicator */}
                  <span className="md:hidden text-sm text-gray-400">
                    Page {currentPage} of {totalPages}
                  </span>

                  {/* Next Page Button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!hasNextPage}
                    className="px-3 py-2 rounded-md border border-gray-700 bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed flex items-center"
                    aria-label="Next page"
                  >
                    <span className="sr-only md:not-sr-only md:mr-1">Next</span>
                    <ChevronRightIcon className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            )}
          </>
        )}

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Showing past contests {dateRange !== 'all' ? `from the last ${dateRange} days` : 'from all time'}</p>
        </div>
      </div>
    </div>
  );
};

export default PastContestsPage;