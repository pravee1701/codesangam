import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, BookmarkIcon, BookmarkFilledIcon, LinkIcon, CodeIcon, ClockIcon, AlarmIcon, TimerIcon, YoutubeIcon, DeleteIcon, EditIcon } from './Icons';
import ApiRequest from "../services/ApiRequest";
import { BOOKMARK_BASE_URL, CONTEST_BASE_URL } from '../constants';
import SolutionPage from '../pages/SolutionPage';


const ContestTable = ({
  contests = [],
  type = "upcoming", 
  className = "",
  showDeleteButton = false,
  onContestDeleted,
  isBookmarkPage = false,
  isAdmin = false,
  onContestUpdated
}) => {
  const [bookmarkedContests, setBookmarkedContests] = useState(new Set());
  const [remainingTimes, setRemainingTimes] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedContest, setSelectedContest] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const contestsPerPage = 10; 

  // Calculate pagination values
  const indexOfLastContest = currentPage * contestsPerPage;
  const indexOfFirstContest = indexOfLastContest - contestsPerPage;
  const currentContests = Array.isArray(contests) ? 
    contests.slice(indexOfFirstContest, indexOfLastContest) : [];
  const totalPages = Math.ceil((contests?.length || 0) / contestsPerPage);

  // Function to handle solution update
  const handleUpdateSolution = async (contestId, solutionLink) => {
    try {
      // Extract YouTube ID if full URL is provided
      const url = new URL(solutionLink);
      

      // Make API request to update the solution
      const apiRequest = new ApiRequest(`${CONTEST_BASE_URL}/solution`);
      const response = await apiRequest.postRequest({ solutionLink: url, contestId: contestId });
      
      if (!response.success) {
        throw new Error(response.message || "Failed to update solution");
      }

      // Update the contest in the local state
      const updatedContests = contests.map(contest => {
        if (contest._id === contestId) {
          return { ...contest, solutionVideoId: url };
        }
        return contest;
      });

      // This assumes you have a way to update the contests array in the parent component
      if (onContestUpdated) {
        onContestUpdated(updatedContests);
      }
      
      alert("Solution updated successfully!");
    } catch (error) {
      console.error("Error updating solution:", error);
      alert("Failed to update solution. Please try again.");
    }
  };

  // Open the solution edit modal - improved to make it more visible
  const openSolutionModal = (contest, e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedContest(contest);
    setModalOpen(true);
    // Make sure the modal is visible in the viewport
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 100);
  };

  // Function to handle bookmark deletion
  const handleDeleteBookmark = async (bookmarkId, contestId, e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      // Make API request to delete the bookmark
      const apirequest = new ApiRequest(`${BOOKMARK_BASE_URL}/${bookmarkId}`);
      const response = await apirequest.deleteRequest();

      if (!response.success) {
        throw new Error(response.message || "Failed to delete bookmark");
      }

      // Update local state: remove the contest ID from bookmarkedContests
      setBookmarkedContests((prev) => {
        const newBookmarks = new Set(prev);
        newBookmarks.delete(contestId);
        return newBookmarks;
      });

      // Notify the parent component that a contest has been deleted
      if (onContestDeleted) {
        onContestDeleted(contestId);
      }
    } catch (error) {
      console.error("Error deleting bookmark:", error);
    }
  };

  // Handle bookmark toggling
  const toggleBookmark = async (contestId, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      setBookmarkedContests(prev => {
        const newBookmarks = new Set(prev);
        if (newBookmarks.has(contestId)) {
          newBookmarks.delete(contestId);
        } else {
          newBookmarks.add(contestId);
        }
        return newBookmarks;
      });

      const apirequest = new ApiRequest(`${BOOKMARK_BASE_URL}`);
      const response = await apirequest.postRequest({contestId});

      if(!response.success){
        throw new Error("Bookmark update failed");
      }
    } catch (error) {
      console.error("Error updating bookmark:", error);
    }
  };

  // Format duration from minutes to "2h 30m" format
  const formatDuration = (minutes) => {
    if (!minutes && minutes !== 0) return "N/A";
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours > 0 ? `${hours}h ` : ''}${mins > 0 ? `${mins}m` : hours > 0 ? '' : '0m'}`;
  };

  // Format time to local time string with day
  const formatTime = (timestamp) => {
    if (!timestamp) return "Not specified";
    
    try {
      const date = new Date(timestamp);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }
      
      return date.toLocaleString(undefined, { 
        weekday: 'short',
        month: 'short', 
        day: 'numeric',
        hour: '2-digit', 
        minute: '2-digit'
      });
    } catch (error) {
      console.error("Error formatting time:", error);
      return "Invalid date";
    }
  };

  // Calculate and format time remaining until contest start
  const calculateTimeRemaining = (startTime) => {
    if (!startTime) return "N/A";
    
    try {
      const now = new Date();
      const start = new Date(startTime);
      
      // Check if date is valid
      if (isNaN(start.getTime())) {
        return "Invalid date";
      }
      
      const diffMs = start - now;
      
      if (diffMs <= 0) return "Started";
      
      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      
      if (days > 0) {
        return `${days}d ${hours}h`;
      } else if (hours > 0) {
        return `${hours}h ${minutes}m`;
      } else {
        return `${minutes}m`;
      }
    } catch (error) {
      console.error("Error calculating time remaining:", error);
      return "Invalid date";
    }
  };

  // Update remaining times every minute
  useEffect(() => {
    if (type !== "upcoming") return;

    const calculateAllRemainingTimes = () => {
      const times = {};
      currentContests.forEach(contest => {
        if (contest && contest._id) {
          times[contest._id] = calculateTimeRemaining(contest.startTime);
        }
      });
      setRemainingTimes(times);
    };

    // Initial calculation
    calculateAllRemainingTimes();
    
    // Set up interval
    const interval = setInterval(calculateAllRemainingTimes, 60000);
    
    return () => clearInterval(interval);
  }, [currentContests, type]);

  // Determine row color based on time remaining (for upcoming contests)
  const getRowColorClass = (contest) => {
    if (type !== "upcoming" || !contest || !contest.startTime) return "";
    
    try {
      const now = new Date();
      const start = new Date(contest.startTime);
      
      // Check if date is valid
      if (isNaN(start.getTime())) {
        return "";
      }
      
      const diffHours = (start - now) / (1000 * 60 * 60);
      
      if (diffHours < 1) return "border-l-4 border-red-500 bg-red-900 bg-opacity-20";
      if (diffHours < 24) return "border-l-4 border-yellow-500 bg-yellow-900 bg-opacity-10";
      return "";
    } catch (error) {
      return "";
    }
  };

  const getPlatformColor = (platform) => {
    if (!platform) return 'text-gray-400';
    
    const platformColors = {
      'Codeforces': 'text-blue-400',
      'LeetCode': 'text-yellow-400',
      'CodeChef': 'text-orange-400',
    };
    
    return platformColors[platform] || 'text-blue-400';
  };

  // Pagination controls
  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top of table when changing pages
    document.querySelector('.contest-table-container')?.scrollIntoView({ behavior: 'smooth' });
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  // Check if contests array is valid and has items
  const hasValidContests = Array.isArray(contests) && contests.length > 0 && contests.some(contest => contest && contest._id);

  return (
    <div className="contest-table-container w-full rounded-lg overflow-hidden shadow-lg bg-gray-900 bg-opacity-70 backdrop-blur-md border border-gray-800 relative flex flex-col">
      <div className="py-4 px-6 bg-gray-800 bg-opacity-80">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <Calendar className="mr-2 text-blue-400" />
          {isBookmarkPage ? "Your Bookmarked Contests" : 
           type === "upcoming" ? "Upcoming Contests" : "Past Contests"}
        </h2>
      </div>
      
      <div className="overflow-x-auto flex-grow">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-800 bg-opacity-90 text-left">
              <th className="py-3 px-4 text-gray-300 font-medium">Platform</th>
              <th className="py-3 px-4 text-gray-300 font-medium">Start Time</th>
              <th className="py-3 px-4 text-gray-300 font-medium">End Time</th>
              <th className="py-3 px-4 text-gray-300 font-medium">
                {type === "upcoming" ? "Countdown" : "Duration"}
              </th>
              <th className="py-3 px-4 text-gray-300 font-medium text-center">Actions</th>
            </tr>
          </thead>
          <tbody>   
            {hasValidContests && currentContests.length > 0 ? (
              currentContests.map((contest, index) => {
                // Skip rendering if contest is null or missing _id
                if (!contest || !contest._id) return null;
                
                return (
                  <tr 
                    key={contest._id} 
                    className={`
                      border-b border-gray-700 hover:bg-gray-800 hover:bg-opacity-50 transition-all
                      ${index % 2 === 0 ? 'bg-gray-800 bg-opacity-40' : 'bg-gray-800 bg-opacity-20'}
                      ${getRowColorClass(contest)}
                    `}
                  >
                    <td className="py-4 px-4 text-white">
                      <div className="flex items-center space-x-2">
                        {/* Platform icon */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getPlatformColor(contest.platform)} bg-gray-800`}>
                          {contest.platformIcon || <CodeIcon />}
                        </div>
                        <div>
                          <Link 
                            to={contest.url || "#"} 
                            className={`flex items-center font-medium hover:underline ${getPlatformColor(contest.platform)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {contest.name || "Unnamed Contest"}
                            <LinkIcon className="ml-1 w-4 h-4" />
                          </Link>
                          <div className="text-xs text-gray-400">{contest.platform || "Unknown Platform"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-white">{formatTime(contest.startTime)}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-white">{formatTime(contest.endTime)}</div>
                    </td>
                    <td className="py-4 px-4">
                      {type === "upcoming" ? (
                        <div className="flex items-center">
                          <TimerIcon className="mr-2 text-yellow-400" />
                          <div className="text-yellow-200 font-mono bg-gray-800 rounded px-2 py-1">
                            {remainingTimes[contest._id] || calculateTimeRemaining(contest.startTime)}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center text-white">
                          <ClockIcon className="mr-1 w-4 h-4 text-gray-400" />
                          {formatDuration(contest.duration)}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center space-x-4">
                        {/* Delete button - shown on bookmark page or when showDeleteButton is true */}
                        {(showDeleteButton || isBookmarkPage) && (
                          <button
                            onClick={(e) => handleDeleteBookmark(contest.bookmarkId, contest._id, e)}
                            className="text-red-400 hover:text-red-300 transition-colors p-2 rounded-full hover:bg-gray-700 flex items-center"
                            aria-label="Remove from bookmarks"
                          >
                            <DeleteIcon className="w-5 h-5" />
                            {isBookmarkPage && <span className="ml-1 text-sm">Remove</span>}
                          </button>
                        )}
                        
                        {/* Bookmark button - only show if not on bookmark page */}
                        {!isBookmarkPage && (
                          <button
                            onClick={(e) => toggleBookmark(contest._id, e)}
                            className="text-gray-400 hover:text-yellow-400 transition-colors p-2 rounded-full hover:bg-gray-700"
                            aria-label={bookmarkedContests.has(contest._id) ? "Remove bookmark" : "Add bookmark"}
                          >
                            {bookmarkedContests.has(contest._id) ? (
                              <BookmarkFilledIcon className="w-5 h-5 text-yellow-400" />
                            ) : (
                              <BookmarkIcon className="w-5 h-5" />
                            )}
                          </button>
                        )}
                        
                        {/* Register button - only show if not on bookmark page */}
                        {type === "upcoming" && !isBookmarkPage && (
                          <Link
                            to={`/register/${contest._id}`}
                            className="text-blue-400 hover:text-blue-300 transition-colors flex items-center p-2 text-sm bg-blue-900 bg-opacity-30 rounded-md hover:bg-opacity-50"
                          >
                            <AlarmIcon className="w-4 h-4 mr-1" />
                            Register
                          </Link>
                        )}
                        
                        {/* Solution video button - Always show for past contests, just disable if no video */}
                        {type !== "upcoming" && (
                          <>
                            {contest.solutionVideoId ? (
                              <Link
                                to={`${contest.solutionVideoId}`}
                                className="text-red-400 hover:text-red-300 transition-colors p-2 rounded-full hover:bg-gray-700"
                                aria-label="View solution"
                                target="_blank" 
                                rel="noopener noreferrer"
                              >
                                <YoutubeIcon className="w-5 h-5" />
                              </Link>
                            ) : (
                              <span className="text-gray-600 p-2 rounded-full">
                                <YoutubeIcon className="w-5 h-5" />
                              </span>
                            )}
                            
                            {/* Add solution button - improved visual styling */}
                            {isAdmin && (
                              <button
                                onClick={(e) => openSolutionModal(contest, e)}
                                className="text-green-400 hover:text-green-300 transition-colors p-2 rounded-md hover:bg-green-900 hover:bg-opacity-50 border border-green-800 flex items-center"
                                aria-label="Add solution"
                              >
                                <EditIcon className="w-4 h-4 mr-1" />
                                <span className="text-xs">Solution</span>
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr className="border-t border-gray-700">
                <td colSpan="5" className="py-10 px-4 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <Calendar className="w-12 h-12 mb-3 opacity-30" />
                    <p className="text-lg">No contests available at this time</p>
                    <p className="text-sm mt-1">Check back later for updates</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination controls - Added to make navigation easier */}
      {totalPages > 1 && (
        <div className="bg-gray-800 py-3 px-4 border-t border-gray-700 flex justify-between items-center">
          <div className="text-gray-400 text-sm">
            Showing {indexOfFirstContest + 1}-{Math.min(indexOfLastContest, contests.length)} of {contests.length} contests
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={goToPreviousPage} 
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            >
              Previous
            </button>
            
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => goToPage(index + 1)}
                className={`px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >
                {index + 1}
              </button>
            ))}
            
            <button 
              onClick={goToNextPage} 
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            >
              Next
            </button>
          </div>
        </div>
      )}
      
      {/* Solution Update Modal - Improved positioning */}
      {modalOpen && selectedContest && (
        <SolutionPage 
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          contest={selectedContest}
          onSubmit={handleUpdateSolution}
        />
      )}
    </div>
  );
};

export default ContestTable;