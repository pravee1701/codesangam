import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, BookmarkIcon, BookmarkFilledIcon, LinkIcon, CodeIcon, ClockIcon, AlarmIcon, TimerIcon, YoutubeIcon, DeleteIcon } from './Icons';
import ApiRequest from "../services/ApiRequest";
import { BOOKMARK_BASE_URL } from '../constants';

const ContestTable = ({
  contests = [],
  type = "upcoming", // "upcoming" or "past"
  className = "",
  showDeleteButton = false, // New prop to conditionally render delete button
  onContestDeleted // Optional callback function to notify parent component
}) => {
  const [bookmarkedContests, setBookmarkedContests] = useState(new Set());
  const [remainingTimes, setRemainingTimes] = useState({});

    // Function to handle contest deletion
    const handleDeleteContest = async (contestId, e) => {
      e.preventDefault();
      e.stopPropagation();

      try {
          // Make API request to delete the contest
          const apirequest = new ApiRequest(`${BOOKMARK_BASE_URL}/${contestId}`); // Assuming your API endpoint is /bookmarks/:contestId
          const response = await apirequest.deleteRequest();

          if (!response.success) {
              throw new Error(response.message || "Failed to delete contest");
          }

          // Update local state: remove the contest ID from bookmarkedContests
          setBookmarkedContests((prev) => {
              const newBookmarks = new Set(prev);
              newBookmarks.delete(contestId);
              return newBookmarks;
          });

          // Optionally, notify the parent component that a contest has been deleted
          if (onContestDeleted) {
              onContestDeleted(contestId);
          }
      } catch (error) {
          console.error("Error deleting contest:", error);
          // Optionally, display an error message to the user
      }
  };


  // Handle bookmark toggling
  const toggleBookmark = async (contestId, e) => {
    e.preventDefault();
    e.stopPropagation();
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
      throw new Error("Bookmark updation Failed")
    }

  };

  // Format duration from minutes to "2h 30m" format
  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours > 0 ? `${hours}h ` : ''}${mins > 0 ? `${mins}m` : ''}`;
  };

  // Format time to local time string with day
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString(undefined, { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  // Calculate and format time remaining until contest start
  const calculateTimeRemaining = (startTime) => {
    const now = new Date();
    const start = new Date(startTime);
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
  };

  // Update remaining times every minute
  useEffect(() => {
    if (type !== "upcoming") return;

    const calculateAllRemainingTimes = () => {
      const times = {};
      contests.forEach(contest => {
        times[contest._id] = calculateTimeRemaining(contest.startTime);
      });
      setRemainingTimes(times);
    };

    // Initial calculation
    calculateAllRemainingTimes();
    
    // Set up interval
    const interval = setInterval(calculateAllRemainingTimes, 60000);
    
    return () => clearInterval(interval);
  }, [contests, type]);

  // Determine row color based on time remaining (for upcoming contests)
  const getRowColorClass = (contest) => {
    if (type !== "upcoming") return "";
    
    const now = new Date();
    const start = new Date(contest.startTime);
    const diffHours = (start - now) / (1000 * 60 * 60);
    
    if (diffHours < 1) return "border-l-4 border-red-500 bg-red-900 bg-opacity-20";
    if (diffHours < 24) return "border-l-4 border-yellow-500 bg-yellow-900 bg-opacity-10";
    return "";
  };

  const getPlatformColor = (platform) => {
    const platformColors = {
      'Codeforces': 'text-blue-400',
      'LeetCode': 'text-yellow-400',
      'CodeChef': 'text-orange-400',
    };
    
    return platformColors[platform] || 'text-blue-400';
  };

  return (
    <div className={`w-full rounded-lg overflow-hidden shadow-lg bg-gray-900 bg-opacity-70 backdrop-blur-md border border-gray-800 ${className}`}>
      <div className="py-4 px-6 bg-gray-800 bg-opacity-80">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <Calendar className="mr-2 text-blue-400" />
          {type === "upcoming" ? "Upcoming Contests" : "Past Contests"}
        </h2>
      </div>
      
      <div className="overflow-x-auto">
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
            {contests.length > 0 ? (
              contests.map((contest, index) => (
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
                          to={contest.url} 
                          className={`flex items-center font-medium hover:underline ${getPlatformColor(contest.platform)}`}
                        >
                          {contest.name}
                          <LinkIcon className="ml-1 w-4 h-4" />
                        </Link>
                        <div className="text-xs text-gray-400">{contest.platform}</div>
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
                      {showDeleteButton && (
                            <button
                                onClick={(e) => handleDeleteContest(contest._id, e)}
                                className="text-red-400 hover:text-red-300 transition-colors p-2 rounded-full hover:bg-gray-700"
                                aria-label="Delete contest"
                            >
                                <DeleteIcon className="w-5 h-5" />
                            </button>
                        )}
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
                      
                      {type === "upcoming" ? (
                        <Link
                          to={`/register/${contest._id}`}
                          className="text-blue-400 hover:text-blue-300 transition-colors flex items-center p-2 text-sm bg-blue-900 bg-opacity-30 rounded-md hover:bg-opacity-50"
                        >
                          <AlarmIcon className="w-4 h-4 mr-1" />
                          Register
                        </Link>
                      ) : (
                        <Link
                          to={contest.solutionVideoId}
                          className="text-green-400 hover:text-green-300 transition-colors p-2 rounded-full hover:bg-gray-700"
                          aria-label="View solution"
                        >
                          <YoutubeIcon className="w-5 h-5" />
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))
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
    </div>
  );
};

export default ContestTable;
