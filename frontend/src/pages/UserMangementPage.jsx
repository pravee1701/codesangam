import { useState, useEffect } from 'react';
import { Settings, User, X, Check, RefreshCw, Shield } from 'lucide-react';
import ApiRequest from '../services/ApiRequest';
import { USER_BASE_URL } from '../constants';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const apirequest = new ApiRequest(`${USER_BASE_URL}/getAllUsers`)
        const response = await apirequest.getRequest()
        if (!response.success) {
            setError('Failed to fetch users')
        }
        
        
        setUsers(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Function to update user role
  const updateUserRole = async (userId, newRole) => {
    setUpdating(userId);
    setSuccessMessage('');
    
    try {
        const apirequest = new ApiRequest(`${USER_BASE_URL}/assign-role/${userId}`)
        const response = await apirequest.postRequest({role: newRole})
      
      if (!response.success) {
        setError('Failed to update user role');
      }
      
      setUsers(users.map(user => 
        user._id === userId ? { ...user, role: newRole } : user
      ));
      
      setSuccessMessage(`User role updated successfully`);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(null);
    }
  };

  // Function to refresh user data
  const refreshData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Refresh would happen here with actual API call
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="animate-spin mr-2">
          <RefreshCw size={24} />
        </div>
        <span>Loading users...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold flex items-center">
            <User className="mr-2" /> User Management Dashboard
          </h1>
          <button 
            onClick={refreshData}
            className="flex items-center bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md text-sm transition-colors"
          >
            <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
        
        {error && (
          <div className="bg-red-900 border border-red-700 text-white px-4 py-3 rounded-md mb-6 flex items-center justify-between">
            <div className="flex items-center">
              <X className="mr-2" />
              <span>Error: {error}</span>
            </div>
            <button onClick={() => setError(null)} className="text-white">
              <X size={18} />
            </button>
          </div>
        )}
        
        {successMessage && (
          <div className="bg-green-900 border border-green-700 text-white px-4 py-3 rounded-md mb-6 flex items-center justify-between">
            <div className="flex items-center">
              <Check className="mr-2" />
              <span>{successMessage}</span>
            </div>
            <button onClick={() => setSuccessMessage('')} className="text-white">
              <X size={18} />
            </button>
          </div>
        )}
        
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-700">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {users.map(user => (
                  <tr key={user._id} className="hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center">
                          {user.role === 'ADMIN' ? 
                            <Shield size={20} className="text-purple-400" /> : 
                            <User size={20} className="text-blue-400" />
                          }
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium">{user.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === 'admin' ? 'bg-purple-900 text-purple-200' : 'bg-blue-900 text-blue-200'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {user.role === 'USER' ? (
                        <button
                          onClick={() => updateUserRole(user._id, 'ADMIN')}
                          disabled={updating === user._id}
                          className="flex items-center px-3 py-1 rounded bg-purple-700 hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs"
                        >
                          {updating === user._id ? (
                            <>
                              <RefreshCw size={12} className="animate-spin mr-2" />
                              Updating...
                            </>
                          ) : (
                            <>
                              <Settings size={12} className="mr-2" />
                              Make Admin
                            </>
                          )}
                        </button>
                      ) : (
                        <div className="text-gray-400 text-xs italic">Current Admin</div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}