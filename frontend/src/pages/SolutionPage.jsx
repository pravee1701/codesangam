import { useState } from "react";
import { YoutubeIcon } from "../components/Icons";

const SolutionPage = ({ isOpen, onClose, contest, onSubmit }) => {
  const [solutionLink, setSolutionLink] = useState(contest?.solutionVideoId || '');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(contest._id, solutionLink);
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-90 flex items-center justify-center z-50 px-4">
      <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md border border-gray-700 shadow-xl animate-fadeIn">
        <h2 className="text-xl text-white font-semibold mb-4 flex items-center">
          <YoutubeIcon className="text-red-500 mr-2" />
          Update Solution Video
        </h2>
        <p className="text-gray-300 mb-4">
          Adding solution for: <span className="text-blue-400 font-medium">{contest?.name}</span>
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2" htmlFor="solutionLink">
              YouTube Video ID or Full URL
            </label>
            <input 
              id="solutionLink"
              type="text" 
              value={solutionLink} 
              onChange={(e) => setSolutionLink(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              placeholder="e.g. dQw4w9WgXcQ or https://youtube.com/watch?v=dQw4w9WgXcQ"
              autoFocus
            />
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors"
            >
              Save Solution
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SolutionPage;