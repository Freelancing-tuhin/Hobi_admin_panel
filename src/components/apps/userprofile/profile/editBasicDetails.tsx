import { useState, useContext } from 'react';
import { updateOrganizerProfile } from 'src/service/auth';
import { AuthContext } from 'src/context/authContext/AuthContext';
import { toast } from 'react-toastify';
import Loader from 'src/components/shared/Loader';

interface UserDetailsType {
  full_name: string;
  age: number | null;
  phone: string;
  email: string;
  gender: string;
  address: string;
}

const EditUserProfile = () => {
  const { user, login } = useContext<any>(AuthContext);

  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetailsType>({
    full_name: user?.full_name || '',
    age: user?.age || null,
    phone: user?.phone || '',
    email: user?.email || '',
    gender: user?.gender || '',
    address: user?.address || '',
  });

  const handleChange = (e: any) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await updateOrganizerProfile(user?._id, userDetails);
      login(response?.result);
      toast.success('Profile updated successfully!', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      setModalOpen(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <button
        onClick={() => setModalOpen(true)}
        className="bg-[#b03052] text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
      >
        Edit Profile
      </button>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex z-[1000] items-center justify-center">
          <div className="bg-white p-6 rounded-md shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
            {loading ? (
              <div className="h-56 flex items-center justify-center">
                <Loader />
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  <div className="">
                    <label className="block">Business Name</label>
                    <input
                      type="text"
                      name="full_name"
                      value={userDetails.full_name}
                      onChange={handleChange}
                      placeholder="Full Name"
                      className="w-full p-2 border rounded-md"
                    />
                  </div>

                  <div className="">
                    <label className="block">Business Contact Number</label>
                    <input
                      type="text"
                      name="phone"
                      value={userDetails.phone}
                      onChange={handleChange}
                      placeholder="Phone"
                      className="w-full p-2 border rounded-md"
                    />
                  </div>

                  <div className="">
                    <label className="block">Gender</label>
                    <select
                      name="gender"
                      value={userDetails.gender}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="">
                    <label className="block">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={userDetails.address}
                      onChange={handleChange}
                      placeholder="Address"
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    onClick={() => setModalOpen(false)}
                    className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="bg-[#b03052] text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
                  >
                    Save
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EditUserProfile;
