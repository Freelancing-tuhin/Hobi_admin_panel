import GeneralDetail from 'src/components/apps/ecommerce/addProduct/GeneralDetail';
import Pricing from 'src/components/apps/ecommerce/addProduct/Pricing';
import ProductData from 'src/components/apps/ecommerce/addProduct/ProductData';
import Status from 'src/components/apps/ecommerce/addProduct/Status';
import Variation from 'src/components/apps/ecommerce/addProduct/Variation';
import Thumbnail from 'src/components/apps/ecommerce/editProduct/Thumbnail';
import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import { Button } from 'flowbite-react';
import { useContext, useState } from 'react';
import { createEvent, CreateEventPayload } from 'src/service/createEvent';
import { useNavigate } from 'react-router';
import { AuthContext } from 'src/context/authContext/AuthContext';
import LockScreen from 'src/views/authentication/lockScreen/LockScreen';
import Spinner from 'src/views/spinner/Spinner';
import { Icon } from '@iconify/react';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Add Event',
  },
];

// Step configuration
const STEPS = [
  { id: 1, title: 'Basic Info', icon: 'tabler:file-description' },
  { id: 2, title: 'Date & Time', icon: 'tabler:calendar-event' },
  { id: 3, title: 'Category', icon: 'tabler:category' },
  { id: 4, title: 'Media', icon: 'tabler:photo' },
  { id: 5, title: 'Pricing', icon: 'tabler:tag' },
];

const AddProduct = () => {
  const { user }: any = useContext(AuthContext);
  const [currentStep, setCurrentStep] = useState(1);
  const [stepErrors, setStepErrors] = useState<{ [key: number]: string }>({});
  const [eventData, setEventData] = useState({
    title: '',
    category: '',
    type: '',
    startDate: '',
    startTime: '',
    endTime: '',
    location: {
      address: '',
      latitude: 0,
      longitude: 0,
    },
    description: '',
    isTicketed: false,
    tickets: [],
    organizerId: user?._id,
  });
  const navigate = useNavigate();
  const [banner, setBanner] = useState<string | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (stepErrors[currentStep]) {
      setStepErrors((prev) => ({ ...prev, [currentStep]: '' }));
    }
  };

  const handleBannerChange = (file: File) => {
    setBannerFile(file);
    if (stepErrors[currentStep]) {
      setStepErrors((prev) => ({ ...prev, [currentStep]: '' }));
    }
  };

  // Validation functions for each step
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!eventData.title.trim()) {
          setStepErrors({ ...stepErrors, 1: 'Event name is required' });
          return false;
        }
        if (!eventData.location.address) {
          setStepErrors({ ...stepErrors, 1: 'Location is required' });
          return false;
        }
        return true;
      case 2:
        if (!eventData.type) {
          setStepErrors({ ...stepErrors, 2: 'Please select activity type' });
          return false;
        }
        if (!eventData.startDate) {
          setStepErrors({ ...stepErrors, 2: 'Start date is required' });
          return false;
        }
        if (!eventData.startTime) {
          setStepErrors({ ...stepErrors, 2: 'Start time is required' });
          return false;
        }
        if (!eventData.endTime) {
          setStepErrors({ ...stepErrors, 2: 'End time is required' });
          return false;
        }
        return true;
      case 3:
        if (!eventData.category) {
          setStepErrors({ ...stepErrors, 3: 'Please select a category' });
          return false;
        }
        return true;
      case 4:
        if (!bannerFile) {
          setStepErrors({ ...stepErrors, 4: 'Please upload a banner image' });
          return false;
        }
        return true;
      case 5:
        if (eventData.isTicketed && eventData.tickets.length === 0) {
          setStepErrors({ ...stepErrors, 5: 'Please add at least one ticket' });
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const goToStep = (step: number) => {
    // Only allow going back, or staying on current step
    // User cannot skip ahead without completing current step
    if (step < currentStep) {
      setCurrentStep(step);
    } else if (step === currentStep) {
      // Stay on current step
    } else {
      // Trying to go forward - validate all steps up to that point
      for (let i = currentStep; i < step; i++) {
        if (!validateStep(i)) {
          return;
        }
      }
      setCurrentStep(step);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep(4)) {
      return;
    }

    setIsLoading(true);
    const eventPayload: CreateEventPayload = {
      ...eventData,
      bannerImage: bannerFile!,
    };

    console.log('Submitting event:', eventPayload);
    try {
      await createEvent(eventPayload);
      navigate('/Event/list');
    } catch (err) {
      console.error('Create event failed', err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="grid grid-cols-12 gap-6">
            <div className="lg:col-span-7 col-span-12">
              <GeneralDetail
                title={eventData.title}
                description={eventData.description}
                handleChange={handleChange}
              />
            </div>
            <div className="lg:col-span-5 col-span-12">
              <Status eventData={eventData} setEventData={setEventData} />
            </div>
          </div>
        );
      case 2:
        return (
          <Variation eventData={eventData} setEventData={setEventData} />
        );
      case 3:
        return (
          <div className="max-w-4xl mx-auto">
            <ProductData eventData={eventData} setEventData={setEventData} />
          </div>
        );
      case 4:
        return (
          <div className="max-w-2xl mx-auto">
            <Thumbnail onBannerChange={handleBannerChange} setBanner={setBanner} banner={banner} />
          </div>
        );
      case 5:
        return (
          <div className="max-w-2xl mx-auto">
            <Pricing eventData={eventData} setEventData={setEventData} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className='relative'>
      <LockScreen />
      {isLoading && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative z-10">
            <Spinner />
          </div>
        </div>
      )}
      <BreadcrumbComp title="Add Event" items={BCrumb} />

      {/* Stepper */}
      <div className="mb-6">
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute top-4 md:top-5 left-8 right-8 md:left-10 md:right-10 h-[2px] bg-gray-200 dark:bg-gray-700">
            <div
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
            />
          </div>

          {/* Steps */}
          <div className="relative flex flex-row justify-between items-center">
            {STEPS.map((step) => {
              const isActive = step.id === currentStep;
              const isCompleted = step.id < currentStep;
              const isClickable = step.id <= currentStep;

              return (
                <div
                  key={step.id}
                  className={`flex flex-col items-center gap-1.5 cursor-pointer group transition-all duration-200 ${isClickable ? 'opacity-100' : 'opacity-50'
                    }`}
                  onClick={() => goToStep(step.id)}
                >
                  {/* Step Circle */}
                  <div
                    className={`relative z-10 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-200 ${isActive
                      ? 'bg-primary text-white'
                      : isCompleted
                        ? 'bg-primary text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-400 border border-gray-300'
                      }`}
                  >
                    {isCompleted ? (
                      <Icon icon="tabler:check" className="w-4 h-4 md:w-5 md:h-5" />
                    ) : (
                      <span className="text-xs font-semibold">{step.id}</span>
                    )}
                  </div>

                  {/* Step Info - Hidden on mobile, shown on desktop */}
                  <div className="text-center hidden md:block">
                    <p
                      className={`font-medium text-xs transition-colors duration-200 ${isActive || isCompleted
                        ? 'text-primary'
                        : 'text-gray-500 dark:text-gray-400'
                        }`}
                    >
                      {step.title}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile: Current Step Title */}
          <div className="md:hidden text-center mt-3">
            <p className="text-sm font-medium text-primary">
              {STEPS.find(s => s.id === currentStep)?.title}
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {stepErrors[currentStep] && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3 animate-shake">
          <Icon icon="solar:danger-triangle-bold" className="w-5 h-5 text-red-500" />
          <p className="text-red-600 dark:text-red-400 text-sm font-medium">{stepErrors[currentStep]}</p>
        </div>
      )}

      {/* Step Content */}
      <div className="mb-24 animate-fadeIn">{renderStepContent()}</div>

      {/* Navigation Buttons - Fixed Footer */}
      <div className=" bottom-0 left-0 right-0 bg-white dark:bg-dark border-t border-gray-200 dark:border-gray-700 px-6 py-4 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button
            color="light"
            className="flex items-center gap-2"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            <Icon icon="solar:arrow-left-outline" className="w-4 h-4" />
            Previous
          </Button>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Step {currentStep} of {STEPS.length}
            </span>
          </div>

          {currentStep < STEPS.length ? (
            <Button
              color="primary"
              className="flex items-center gap-2"
              onClick={handleNext}
            >
              Next Step
              <Icon icon="solar:arrow-right-outline" className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              color="primary"
              className="flex items-center gap-2"
              onClick={handleSubmit}
            >
              <Icon icon="solar:check-circle-bold" className="w-4 h-4" />
              Create Event
            </Button>
          )}
        </div>
      </div>

      {/* Custom Styles */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AddProduct;
