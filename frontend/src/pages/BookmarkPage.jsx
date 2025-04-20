import React, { useState, useEffect } from 'react';
import ContestTable from '../components/ContestTable';
import ApiRequest from '../services/ApiRequest';
import { BOOKMARK_BASE_URL } from '../constants';

const BookmarkPage = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [bookmarkedContestsWithIds, setBookmarkedContestsWithIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookmarkedContests = async () => {
    setLoading(true);
    setError(null);
    try {
      const apirequest = new ApiRequest(`${BOOKMARK_BASE_URL}`);
      const response = await apirequest.getRequest();
      
      if (response.success) {
        // Store the entire bookmark objects
        const bookmarks = response.data.docs || [];
        setBookmarks(bookmarks);
        
        // Prepare contests with bookmark IDs for ContestTable
        const contestsWithIds = bookmarks.map(bookmark => ({
          ...bookmark.contest,
          bookmarkId: bookmark._id // Add the bookmark ID to each contest object
        }));
        
        setBookmarkedContestsWithIds(contestsWithIds);
      } else {
        setError(response.message || 'Failed to fetch bookmarked contests.');
      }
    } catch (err) {
      setError('Error fetching bookmarked contests.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarkedContests();
  }, []);

  const handleContestDeleted = (contestId) => {
    // Update the bookmarks state to remove the deleted contest
    setBookmarks((prevBookmarks) =>
      prevBookmarks.filter((bookmark) => bookmark.contest._id !== contestId)
    );
    
    // Also update the contests with IDs list
    setBookmarkedContestsWithIds((prevContests) =>
      prevContests.filter((contest) => contest._id !== contestId)
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Bookmarked Contests</h1>
          <p className="text-gray-400">
            Keep track of all the programming contests you're interested in
          </p>
        </header>

        {error ? (
          <div className="bg-red-900 bg-opacity-30 border border-red-700 text-red-100 p-4 rounded-md mb-8">
            <p>{error}</p>
            <button 
              onClick={() => fetchBookmarkedContests()}
              className="mt-2 text-sm underline hover:text-red-200"
            >
              Try again
            </button>
          </div>
        ) : loading && bookmarkedContestsWithIds.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse flex flex-col items-center">
              <div className="rounded-full bg-gray-700 h-16 w-16 flex items-center justify-center mb-4"></div>
              <p className="text-gray-400">Loading bookmarked contests...</p>
            </div>
          </div>
        ) : (
          <>
            {bookmarkedContestsWithIds.length > 0 ? (
              <ContestTable 
                contests={bookmarkedContestsWithIds} 
                type="upcoming" 
                showDeleteButton={true}
                onContestDeleted={handleContestDeleted}
                isBookmarkPage={true}
              />
            ) : (
              <div className="text-center py-16 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700">
                <div className="mx-auto h-16 w-16 text-gray-600 mb-4"></div>
                <h3 className="text-xl font-medium text-gray-300">No bookmarks found</h3>
                <p className="text-gray-400 mt-2">
                  You haven't bookmarked any contests yet
                </p>
              </div>
            )}
          </>
        )}

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Last updated: {new Date().toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default BookmarkPage;