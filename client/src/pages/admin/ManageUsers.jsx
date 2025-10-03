import React from 'react'
import { toast } from 'react-hot-toast'
import { fetchAllUsers, blockUnblockUser, deleteUser } from '../../api/admin'


const ManageUsers = () => {
  const [loading, setLoading] = React.useState(true);
  const [users, setUsers] = React.useState([]);
  const [stats, setStats] = React.useState({
    totalUsers: 0,
    adminUsers: 0,
    regularUsers: 0,
    activeUsers: 0,
    blockedUsers: 0
  });

  React.useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const response = await fetchAllUsers();
        const users = response.users || [];
        setUsers(users);
        setStats({
          totalUsers: response.count || 0,
          adminUsers: users.filter(user => user.role === 'admin').length || 0,
          regularUsers: users.filter(user => user.role === 'user').length || 0,
          activeUsers: users.filter(user => user.status === 'active').length || 0,
          blockedUsers: users.filter(user => user.status === 'blocked').length || 0
        });
      } catch (error) {
        toast.error("Error loading users");
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  // Function to update stats based on current users
  const updateStats = (users) => {
    setStats({
      totalUsers: users.length,
      adminUsers: users.filter(user => user.role === 'admin').length,
      regularUsers: users.filter(user => user.role === 'user').length,
      activeUsers: users.filter(user => user.status === 'active').length,
      blockedUsers: users.filter(user => user.status === 'blocked').length
    });
  };

  const handleBlockUnblock = async (userId) => {
    try {
      setLoading(true);
      await blockUnblockUser(userId);
      // Update user status in local state
      const updatedUsers = users.map(user => {
        if (user._id === userId) {
          const newStatus = user.status === 'blocked' ? 'active' : 'blocked';
          toast.success(`User ${newStatus === 'blocked' ? 'blocked' : 'unblocked'} successfully`);
          return { ...user, status: newStatus };
        }
        return user;
      });
      setUsers(updatedUsers);
      updateStats(updatedUsers);
    } catch (error) {
      toast.error("Error updating user status");
      console.error("Error blocking/unblocking user:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleDeleteUser = async (userId) => {
    try {
      setLoading(true);
      await deleteUser(userId);
      toast.success("User deleted successfully");
      // Remove user from local state
      const updatedUsers = users.filter(user => user._id !== userId);
      setUsers(updatedUsers);
      updateStats(updatedUsers);
    } catch (error) {
      toast.error("Error deleting user");
      console.error("Error deleting user:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-700"></div>
      </div>
    );
  }

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
      {/*HEADER*/}
      <h1 className='text-3xl text-green-700 font-bold'>User Management</h1>

      {/*STATS */}
      <div className='mt-6 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6'>
        <div className="bg-gray-100 rounded-lg shadow-md p-6 flex flex-col items-center">
          <div className="text-4xl font-bold text-green-700 mb-2">{stats.totalUsers}</div>
          <div className="text-gray-600">Total Registered Users</div>
        </div>
        <div className="bg-gray-100 rounded-lg shadow-md p-6 flex flex-col items-center">
          <div className="text-4xl font-bold text-green-700 mb-2">{stats.adminUsers}</div>
          <div className="text-gray-600">Total Admin Users</div>
        </div>
        <div className="bg-gray-100 rounded-lg shadow-md p-6 flex flex-col items-center">
          <div className="text-4xl font-bold text-green-700 mb-2">{stats.regularUsers}</div>
          <div className="text-gray-600">Total Regular Users</div>
        </div>
        <div className="bg-gray-100 rounded-lg shadow-md p-6 flex flex-col items-center">
          <div className="text-4xl font-bold text-green-700 mb-2">{stats.activeUsers}</div>
          <div className="text-gray-600">Total Active Users</div>
        </div>
        <div className="bg-gray-100 rounded-lg shadow-md p-6 flex flex-col items-center">
          <div className="text-4xl font-bold text-green-700 mb-2">{stats.blockedUsers}</div>
          <div className="text-gray-600">Total Blocked Users</div>
        </div>
      </div>

      {/*USER TABLE*/}
      {users.length === 0 ? (
        <div>
          <p className="text-center text-gray-600 mt-10">No users found.</p>
        </div>
      ) : (
        <div className='mt-8 border rounded-lg shadow-lg overflow-hidden'>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 *:border-b-2 border-gray-200 overflow-x-auto">
                <tr>
                  <th className="px-4 py-2 text-left uppercase border-b">User</th>
                  <th className="px-4 py-2 text-left uppercase border-b">Email</th>
                  <th className="px-4 py-2 text-left uppercase border-b">Role</th>
                  <th className="px-4 py-2 text-left uppercase border-b">Status</th>
                  <th className="px-4 py-2 text-left uppercase border-b">Joined</th>
                  <th className="px-4 py-2 text-left uppercase border-b">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-gray-100">
                {users.map(user => (
                  <tr key={user._id}>
                    <td className="px-4 py-2 border-b">
                      <div className="flex items-center space-x-3">
                        <img
                          src={user.avatar?.url || '/default-avatar.png'}
                          alt={user.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <span className="font-bold text-gray-700">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2 font-medium border-b">{user.email}</td>
                    <td className="px-4 py-2 border-b">
                      <span className={`${user.role === "admin"
                        ? "bg-green-200 text-green-800"
                        : "bg-blue-200 text-blue-800"
                        } px-2 py-1 rounded-full text-sm font-semibold`}>
                        {user.role === "admin" ? "Administrator" : "User"}
                      </span>
                    </td>
                    <td className="px-4 py-2 border-b">
                      <span className={`${user.status === "active"
                        ? "bg-green-200 text-green-800"
                        : user.status === "blocked"
                          ? "bg-red-200 text-red-800"
                          : "bg-yellow-200 text-yellow-800"}
                             px-2 py-1 rounded-full text-sm font-semibold`}>
                        {user.status === "active" ? "Active" : user.status === "blocked" ? "Blocked" : "Pending"}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-sm border-b">
                      {new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                    </td>
                    <td className="px-4 py-2 border-b">
                     <div className="flex flex-row space-x-2">
                       {user.role === 'user' ? (
                         <>
                           <button onClick={() => handleBlockUnblock(user._id)} className="cursor-pointer flex items-center justify-center">
                             <span className={`${user.status === "blocked"
                               ? "bg-green-500 text-white hover:bg-green-600"
                               : "bg-red-500 text-white hover:bg-red-600"
                               } w-20 p-2 rounded-md text-sm font-semibold`}>
                               {user.status === "blocked" ? "Unblock" : "Block"}
                             </span>
                           </button>
                           <button onClick={() => handleDeleteUser(user._id)} className="cursor-pointer flex items-center justify-center">
                             <span className="bg-red-500 text-white hover:bg-red-600 w-20 p-2 rounded-md text-sm font-semibold">
                               Delete
                             </span>
                           </button>
                         </>
                       ) : (
                         <span className="text-gray-500">No actions available for admin...</span>
                       )}
                     </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  )
}

export default ManageUsers
