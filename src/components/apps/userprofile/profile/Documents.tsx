import { useContext, useState } from 'react';
import { AuthContext } from 'src/context/authContext/AuthContext';
import { uploadOrganizerDocuments } from 'src/service/uploadDocs';
import { Icon } from '@iconify/react';
import Loader from 'src/components/shared/Loader';
import { toast } from 'react-toastify';
import CardBox from 'src/components/shared/CardBox';

const stepLabels = [
  'Licenses for Establishment',
  'Certificate of Incorporation',
  'Licenses for Activity Undertaken',
  'Certifications',
  'Insurance for Outdoor Activities',
  'Health & Safety Documents',
];

const fieldMapping: any = {
  'Licenses for Establishment': 'licenses_for_establishment',
  'Certificate of Incorporation': 'certificate_of_incorporation',
  'Licenses for Activity Undertaken': 'licenses_for_activity_undertaken',
  Certifications: 'certifications',
  'Insurance for Outdoor Activities': 'insurance_for_outdoor_activities',
  'Health & Safety Documents': 'health_safety_documents',
};

const DocumentUploadStepper = () => {
  const { login, user } = useContext<any>(AuthContext);
  const [currentStep, setCurrentStep] = useState(0);
  const [files, setFiles] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const backendField = fieldMapping[stepLabels[currentStep]];
  const existingFileUrl = user?.[backendField] || null;
  const isFileUploaded = !!files[backendField] || !!existingFileUrl;

  const handleFileChange = (event: any) => {
    if (event.target.files?.length > 0) {
      const file = event.target.files[0];
      setFiles({ ...files, [backendField]: file });
      setErrorMessage(''); // Clear error when a file is uploaded
    }
  };

  const nextStep = () => {
    if (!isFileUploaded) {
      setErrorMessage('Please upload a file before proceeding.');
      return;
    }

    if (currentStep < stepLabels.length - 1) {
      setLoading(true); // Show loader
      setTimeout(() => {
        setCurrentStep((prevStep) => prevStep + 1);
        setErrorMessage(''); // Clear error when moving forward
        setLoading(false); // Hide loader after delay
      }, 500); // 0.5-second delay
    } else {
      handleUpload();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setErrorMessage(''); // Clear error when moving back
    }
  };
  const notify = () =>
    toast.success('Documents Uploaded Successfully!', {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });
  const handleUpload = async () => {
    setLoading(true);
    try {
      const organizerId = user?._id;
      const response = await uploadOrganizerDocuments(organizerId, files);
      login(response?.result);
      notify();
    } catch (error) {
      console.error('Upload Failed', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CardBox className="mx-auto  shadow-md rounded-md w-full max-w-lg h-[35rem]">
      <h2 className="text-lg font-semibold text-gray-700 mt-4">Upload Documents</h2>
      <p className="card-subtitle mb-4">
        All your Documents will be secured and will not be shared with anyone.
      </p>
      {loading ? (
        <div className="h-56 flex items-center justify-center">
          <Loader />
        </div>
      ) : (
        <>
          {/* Stepper */}
          <div className="flex items-center justify-between mb-6">
            {stepLabels.map((label, index) => (
              <div key={index} className="flex items-center">
                {/* Step Circle */}
                <div className="hidden">{label}</div>
                <div
                  className={`w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold 
                ${index === currentStep ? 'bg-[#b03052] text-white' : 'bg-gray-200 text-gray-700'}
                ${index < currentStep ? 'bg-green-500 text-white' : ''}
              `}
                >
                  {index + 1}
                </div>

                {/* Line between steps */}
                {index < stepLabels.length - 1 && (
                  <div
                    className={`w-10 h-0.5 ${index < currentStep ? 'bg-green-500' : 'bg-gray-300'}`}
                  ></div>
                )}
              </div>
            ))}
          </div>

          {/* File Upload Box */}
          <div className="border-2 border-dashed border-gray-300 p-3 text-center rounded-lg cursor-pointer">
            <label
              htmlFor="file-upload"
              className="block cursor-pointer hover:bg-gray-100 rounded-md pb-2"
            >
              <Icon icon="ic:round-cloud-upload" height="50" className="text-gray-400 mx-auto" />
              <p className="text-gray-500 mt-2">Click to upload a file</p>
              <p className="text-xs text-gray-400 mb-4">PNG, JPG, SVG, WEBP, and GIF allowed.</p>
            </label>

            <input id="file-upload" type="file" onChange={handleFileChange} className="hidden" />

            {/* Image Preview */}
            {files[backendField] ? (
              <div className="relative mt-1">
                <img
                  src={URL.createObjectURL(files[backendField])}
                  alt="Preview"
                  className="w-full max-h-32 object-cover rounded-md"
                />
                <p className="text-gray-600 mt-2">{files[backendField]?.name}</p>
              </div>
            ) : existingFileUrl ? (
              <div className="relative mt-1">
                <img
                  src={existingFileUrl}
                  alt="Uploaded Document"
                  className="w-full max-h-32 object-cover rounded-md"
                />
              </div>
            ) : null}
            <div className=" flex justify-center items-center gap-1 text-sm mt-4 font-semibold text-gray-700 mb-2 dark:card-subtitle">
              <Icon icon={'hugeicons:google-doc'} fontSize={18} color="brown" />
              {stepLabels[currentStep]}
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}

          {/* Buttons */}
          <div className="flex justify-between mt-6">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="px-4 py-2 bg-gray-400 text-white rounded-md disabled:opacity-50"
            >
              Back
            </button>
            <button
              onClick={nextStep}
              disabled={!isFileUploaded} // Disable button if no file is uploaded
              className={`px-4 py-2 text-white rounded-md ${
                isFileUploaded
                  ? currentStep === stepLabels.length - 1
                    ? 'bg-green-500'
                    : 'bg-[#b03052]'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              {currentStep === stepLabels.length - 1 ? 'Upload' : 'Next'}
            </button>
          </div>
        </>
      )}
    </CardBox>
  );
};

export default DocumentUploadStepper;
