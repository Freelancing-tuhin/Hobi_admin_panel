import { useContext, useEffect, useState } from 'react';
import CardBox from 'src/components/shared/CardBox';
import { AuthContext } from 'src/context/authContext/AuthContext';
import { updateOrganizerProfile } from 'src/service/auth';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loader from 'src/components/shared/Loader';
import { API_BASE_URL } from 'src/config';
import { Icon } from '@iconify/react';

// Firm type options with icons and descriptions
const firmTypes = [
  {
    value: 'Sole Proprietorship',
    label: 'Sole Proprietorship',
    icon: 'solar:user-circle-bold-duotone',
    description: 'Single owner business',
    color: 'from-blue-500 to-blue-600',
    bgLight: 'bg-blue-50 dark:bg-blue-900/20',
    borderColor: 'border-blue-500',
  },
  {
    value: 'Partnership',
    label: 'Partnership',
    icon: 'solar:users-group-rounded-bold-duotone',
    description: 'Two or more partners',
    color: 'from-purple-500 to-purple-600',
    bgLight: 'bg-purple-50 dark:bg-purple-900/20',
    borderColor: 'border-purple-500',
  },
  {
    value: 'Private Limited',
    label: 'Private Limited',
    icon: 'solar:buildings-bold-duotone',
    description: 'Limited liability company',
    color: 'from-emerald-500 to-emerald-600',
    bgLight: 'bg-emerald-50 dark:bg-emerald-900/20',
    borderColor: 'border-emerald-500',
  },
  {
    value: 'LLP',
    label: 'LLP',
    icon: 'solar:shield-star-bold-duotone',
    description: 'Limited Liability Partnership',
    color: 'from-amber-500 to-amber-600',
    bgLight: 'bg-amber-50 dark:bg-amber-900/20',
    borderColor: 'border-amber-500',
  },
];

const FirmDetails = () => {
  const { user, login } = useContext<any>(AuthContext);
  const [serviceCategory, setServiceCategory] = useState(user?.service_category || '');
  const [typeOfFirm, setTypeOfFirm] = useState(user?.type_of_firm || '');
  const [services, setServices] = useState<{ _id: string; service_name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
    if (!serviceCategory || !typeOfFirm) {
      toast.warning('Please select both service category and firm type', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

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
      toast.error('Failed to update details.');
    } finally {
      setLoading(false);
    }
  };

  // Filter services based on search query
  const filteredServices = services.filter((service) =>
    service.service_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get selected service name
  const selectedServiceName = services.find((s) => s._id === serviceCategory)?.service_name;

  // Get selected firm type details
  const selectedFirmType = firmTypes.find((f) => f.value === typeOfFirm);

  return (
    <div className="w-full">
      <CardBox className="w-full">
        <div className="p-2">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <Icon icon="solar:case-round-bold-duotone" height={28} className="text-[#b03052]" />
                Business Details
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Define your business type and service offerings
              </p>
            </div>
          </div>

          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <Loader />
            </div>
          ) : (
            <div className="space-y-8">
              {/* Current Selection Summary */}
              {(selectedServiceName || selectedFirmType) && (
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider font-medium">
                    Current Selection
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {selectedServiceName && (
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#b03052]/10 text-[#b03052] rounded-full text-sm font-medium">
                        <Icon icon="solar:tag-bold" height={16} />
                        {selectedServiceName}
                      </span>
                    )}
                    {selectedFirmType && (
                      <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${selectedFirmType.bgLight}`}>
                        <Icon icon={selectedFirmType.icon} height={16} />
                        {selectedFirmType.label}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Firm Type Selection */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                  <Icon icon="solar:buildings-2-bold" height={20} className="text-[#b03052]" />
                  Type of Business Entity
                  <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {firmTypes.map((firm) => (
                    <button
                      key={firm.value}
                      type="button"
                      onClick={() => setTypeOfFirm(firm.value)}
                      className={`group relative p-5 rounded-xl border-2 transition-all duration-300 text-left ${typeOfFirm === firm.value
                          ? `${firm.bgLight} ${firm.borderColor} shadow-lg`
                          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                    >
                      {/* Selection Indicator */}
                      {typeOfFirm === firm.value && (
                        <div className="absolute top-3 right-3">
                          <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${firm.color} flex items-center justify-center`}>
                            <Icon icon="solar:check-read-linear" height={14} className="text-white" />
                          </div>
                        </div>
                      )}

                      {/* Icon Container */}
                      <div
                        className={`w-14 h-14 rounded-xl flex items-center justify-center mb-3 transition-all ${typeOfFirm === firm.value
                            ? `bg-gradient-to-br ${firm.color} shadow-lg`
                            : 'bg-gray-100 dark:bg-gray-700 group-hover:scale-105'
                          }`}
                      >
                        <Icon
                          icon={firm.icon}
                          height={28}
                          className={typeOfFirm === firm.value ? 'text-white' : 'text-gray-500 dark:text-gray-400'}
                        />
                      </div>

                      {/* Label & Description */}
                      <h4 className={`font-semibold text-sm mb-1 ${typeOfFirm === firm.value ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'
                        }`}>
                        {firm.label}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {firm.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Service Category Selection */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  <Icon icon="solar:widget-2-bold" height={20} className="text-[#b03052]" />
                  Service Category
                  <span className="text-red-500">*</span>
                </label>

                {/* Search Input */}
                <div className="relative mb-4">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search categories..."
                    className="w-full px-4 py-3 pl-12 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-800 rounded-xl focus:border-[#b03052] focus:ring-2 focus:ring-[#b03052]/20 transition-all"
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Icon icon="solar:magnifer-linear" height={20} className="text-gray-400" />
                  </div>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <Icon icon="solar:close-circle-linear" height={20} />
                    </button>
                  )}
                </div>

                {/* Service Category Grid */}
                <div className="max-h-[280px] overflow-y-auto pr-2 scroll-smooth">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {filteredServices.map((service) => (
                      <button
                        key={service._id}
                        type="button"
                        onClick={() => setServiceCategory(service._id)}
                        className={`group relative p-4 rounded-xl border-2 transition-all duration-200 text-left ${serviceCategory === service._id
                            ? 'bg-[#b03052]/10 border-[#b03052] shadow-md'
                            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-[#b03052]/50 hover:bg-gray-50 dark:hover:bg-gray-750'
                          }`}
                      >
                        {/* Selection Check */}
                        {serviceCategory === service._id && (
                          <div className="absolute top-2 right-2">
                            <Icon icon="solar:check-circle-bold" height={18} className="text-[#b03052]" />
                          </div>
                        )}

                        {/* Service Icon */}
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 transition-all ${serviceCategory === service._id
                              ? 'bg-[#b03052] shadow-lg'
                              : 'bg-gray-100 dark:bg-gray-700 group-hover:bg-[#b03052]/20'
                            }`}
                        >
                          <Icon
                            icon="solar:star-bold"
                            height={20}
                            className={serviceCategory === service._id ? 'text-white' : 'text-gray-400 group-hover:text-[#b03052]'}
                          />
                        </div>

                        {/* Service Name */}
                        <h4 className={`font-medium text-sm line-clamp-2 ${serviceCategory === service._id ? 'text-[#b03052]' : 'text-gray-700 dark:text-gray-300'
                          }`}>
                          {service.service_name}
                        </h4>
                      </button>
                    ))}
                  </div>

                  {/* Empty State */}
                  {filteredServices.length === 0 && (
                    <div className="text-center py-8">
                      <Icon icon="solar:box-minimalistic-linear" height={48} className="text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">No categories found</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Update Button */}
              <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleUpdate}
                  disabled={!serviceCategory || !typeOfFirm}
                  className="px-8 py-3.5 bg-gradient-to-r from-[#b03052] to-[#8a2542] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#b03052]/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Icon icon="solar:check-circle-bold" height={20} />
                  Save Business Details
                </button>
              </div>
            </div>
          )}
        </div>
      </CardBox>

      {/* Info Card */}
      <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
            <Icon icon="solar:info-circle-bold" className="text-blue-600 dark:text-blue-400" height={22} />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-blue-800 dark:text-blue-300 text-sm">Why is this important?</h4>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              Your business classification helps us provide relevant features, compliance requirements,
              and connect you with the right audience for your services.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirmDetails;
