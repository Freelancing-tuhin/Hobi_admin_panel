import { useContext, useEffect, useState } from 'react';
import CardBox from 'src/components/shared/CardBox';
import { AuthContext } from 'src/context/authContext/AuthContext';
import { updateOrganizerProfile } from 'src/service/auth';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loader from 'src/components/shared/Loader';
import { API_BASE_URL } from 'src/config';

const FirmDetails = () => {
  const { user, login } = useContext<any>(AuthContext);
  const [serviceCategory, setServiceCategory] = useState('');
  const [typeOfFirm, setTypeOfFirm] = useState(user?.type_of_firm || '');
  const [services, setServices] = useState<{ _id: string; service_name: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/v1/services/get-all`);
        setServices(response.data.result);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchServices();
  }, []);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const response = await updateOrganizerProfile(user?._id, {
        service_category: serviceCategory,
        type_of_firm: typeOfFirm,
      });
      login(response?.result);
      toast.success('Service details updated successfully!', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    } catch (error) {
      console.error('Error updating details:', error);
      alert('Failed to update details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CardBox className="w-full max-w-4xl">
      <h2 className="card-title">Service Details</h2>
      <p className="card-subtitle mb-2">
        Update your service category and firm type to ensure accurate classification.
      </p>
      {loading ? (
        <div className="h-56 flex items-center justify-center">
          <Loader />
        </div>
      ) : (
        <>
          {' '}
          <div className="form-group">
            <label className="block text-sm font-medium card-subtitle">Service Category</label>
            <select
              value={serviceCategory}
              onChange={(e) => setServiceCategory(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 dark:bg-gray-700 dark:border-none rounded-md shadow-sm"
            >
              <option value="">Select a category</option>
              {services.map((service) => (
                <option key={service._id} value={service._id}>
                  {service.service_name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group mt-2">
            <label className="block text-sm font-medium card-subtitle">Type of Firm</label>
            <select
              value={typeOfFirm}
              onChange={(e) => setTypeOfFirm(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 dark:bg-gray-700 dark:border-none rounded-md shadow-sm"
            >
              <option value="">Select firm type</option>
              <option value="Sole Proprietorship">Sole Proprietorship</option>
              <option value="Partnership">Partnership</option>
              <option value="Private Limited">Private Limited</option>
            </select>
          </div>
          <button
            onClick={handleUpdate}
            className="w-2/4 bg-[#b03052] text-white py-2 mt-4 rounded-md hover:bg-blue-700 transition"
          >
            Update
          </button>
        </>
      )}
    </CardBox>
  );
};

export default FirmDetails;
