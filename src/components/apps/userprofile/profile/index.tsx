import { UserDataProvider } from 'src/context/UserDataContext';
import Introduction from './Introduction';
import ProfileBanner from './ProfileBanner';
import DocumentUploader from './Documents';
import BankDetails from './BankDetails';
import FirmDetails from './FirmDetails';
import { ToastContainer } from 'react-toastify';
import { Tabs } from 'flowbite-react';
import { Icon } from '@iconify/react';

const UserProfileApp = () => {
  return (
    <>
      <UserDataProvider>
        <ToastContainer />
        <div className="flex flex-col gap-6">
          {/* Banner */}
          <div className="w-full">
            <ProfileBanner />
          </div>

          {/* Tabs Section */}
          <div className="w-full">
            <Tabs aria-label="Profile sections" variant="underline" className="profile-tabs">
              {/* Profile Tab */}
              {/* <Tabs.Item
                active
                title="Profile"
                icon={() => <Icon icon="solar:user-circle-outline" height={20} />}
              >
                <div className="mt-4">
                  <Introduction />
                </div>
              </Tabs.Item> */}

              {/* Bank Details Tab */}
              <Tabs.Item
                title="Bank Details"
                icon={() => <Icon icon="solar:card-outline" height={20} />}
              >
                <div className="mt-4">
                  <BankDetails />
                </div>
              </Tabs.Item>

              {/* Firm Details Tab */}
              <Tabs.Item
                title="Firm Details"
                icon={() => <Icon icon="solar:buildings-2-outline" height={20} />}
              >
                <div className="mt-4">
                  <FirmDetails />
                </div>
              </Tabs.Item>

              {/* Documents Tab */}
              <Tabs.Item
                title="Documents"
                icon={() => <Icon icon="solar:document-text-outline" height={20} />}
              >
                <div className="mt-4">
                  <DocumentUploader />
                </div>
              </Tabs.Item>
            </Tabs>
          </div>
        </div>
      </UserDataProvider>
    </>
  );
};

export default UserProfileApp;
