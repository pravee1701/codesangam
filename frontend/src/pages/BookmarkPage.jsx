// BookmarkPage.jsx
import React, { useState, useEffect } from 'react';
import ContestTable from '../components/ContestTable';
import ApiRequest from "../services/ApiRequest";
import { BOOKMARK_BASE_URL } from '../constants';

const BookmarkPage = () => {
  const [bookmarkedContests, setBookmarkedContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookmarkedContests = async () => {
      setLoading(true);
      setError(null);
      try {
        const apirequest = new ApiRequest(`${BOOKMARK_BASE_URL}`);
        const response = await apirequest.getRequest();

        if (response.success) {
          setBookmarkedContests(response.data);
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

    fetchBookmarkedContests();
  }, []);

  const handleContestDeleted = (deletedContestId) => {
    // Update the bookmarkedContests state to remove the deleted contest
    setBookmarkedContests((prevContests) =>
      prevContests.filter((contest) => contest._id !== deletedContestId)
    );
  };

  if (loading) {
    return <div className="container mx-auto mt-8 text-white">Loading bookmarked contests...</div>;
  }

  if (error) {
    return <div className="container mx-auto mt-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4 text-white">Your Bookmarks</h1>
      {bookmarkedContests.length > 0 ? (
        <ContestTable
          contests={bookmarkedContests}
          type="upcoming"
          showDeleteButton={true} //  Enable the delete button
          onContestDeleted={handleContestDeleted} // Pass the callback function
        />
      ) : (
        <p className="text-gray-400">No contests bookmarked yet.</p>
      )}
    </div>
  );
};

export default BookmarkPage;
