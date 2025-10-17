import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from 'src/context/authContext/AuthContext';
import { FaPencilAlt } from 'react-icons/fa';
import { Icon } from '@iconify/react';
import { uploadProfilePicture } from 'src/service/uploadProfilePic';
import { toast } from 'react-toastify';

const EditProfilePic = () => {
  const { user, login } = useContext<any>(AuthContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Cleanup to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewImage) URL.revokeObjectURL(previewImage);
    };
  }, [previewImage]);

  // Handle file selection
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      const previewURL = URL.createObjectURL(file);
      setPreviewImage(previewURL);
    }
  };

  // Handle image upload
  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select an image first.');
      return;
    }

    setIsUploading(true);

    try {
      const response = await uploadProfilePicture(user?._id, selectedFile);
      console.log('Upload Response:', response.result.profile_pic);

      login(response?.result);
      toast.success('Business Logo Uploaded Successfully!', {
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
      setPreviewImage(null); // Clear preview after upload
    } catch (error: any) {
      console.error('Upload Error:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Failed to upload image.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative w-24 h-24 mx-auto">
      {/* Profile Picture */}
      <img
        src={user?.profile_pic || '/default-avatar.png'}
        alt="Profile"
        className="w-full h-full object-cover rounded-full border-4 border-white dark:border-darkborder"
      />

      {/* Edit Icon */}
      <button
        className="absolute bottom-0 right-0 bg-gray-800 p-1 rounded-full text-white"
        onClick={() => setModalOpen(true)}
      >
        <FaPencilAlt className="text-xs" />
      </button>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-80">
            <h2 className="text-lg font-semibold mb-4">Change Profile Picture</h2>

            {/* Image Preview */}
            {previewImage && (
              <div className="w-32 h-32 mx-auto mb-4">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-full border"
                />
              </div>
            )}

            {/* File Upload */}
            <label
              htmlFor="file-upload"
              className="block cursor-pointer hover:bg-gray-100 rounded-md pb-2 text-center border"
            >
              <Icon icon="ic:round-cloud-upload" height="50" className="text-gray-400 mx-auto" />
              <p className="text-gray-500 mt-2">Click to upload a file</p>
              <p className="text-xs text-gray-400 mb-4">PNG, JPG, SVG, WEBP, and GIF allowed.</p>
            </label>

            {/* Hidden File Input */}
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />

            {/* Modal Buttons */}
            <div className="flex justify-end mt-4 gap-2">
              <button
                onClick={() => setModalOpen(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className={`py-2 px-4 rounded-md transition ${
                  isUploading ? 'bg-gray-400' : 'bg-[#b03052] hover:bg-blue-700 text-white'
                }`}
              >
                {isUploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfilePic;
