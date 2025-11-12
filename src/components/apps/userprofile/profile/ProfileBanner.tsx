import Banner from '/src/assets/images/backgrounds/profilebg.jpg';
// import { Button } from 'flowbite-react';
import CardBox from 'src/components/shared/CardBox';
import { AuthContext } from 'src/context/authContext/AuthContext';
import { useContext } from 'react';
import EditUserProfile from './editBasicDetails';
import EditProfilePic from './EditProfilePic';

const ProfileBanner = () => {
  const { user }: any = useContext(AuthContext);
  return (
    <>
      <CardBox className="p-0 overflow-hidden">
        <img src={Banner} alt="priofile banner" className="w-full h-32" height={30} />
        <div className="bg-white dark:bg-dark p-6 -mt-2">
          <div className="grid grid-cols-12 gap-4 items-center">
            {/* Left: account status */}
            <div className="lg:col-span-4 col-span-12 flex items-center lg:justify-start justify-center">
              <div className="text-center w-full lg:w-auto">
                <div className="inline-flex items-center gap-3 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-md">
                  <div
                    className={
                      `w-10 h-10 flex items-center justify-center rounded-full text-sm font-semibold ` +
                      (user?.is_verified ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600')
                    }
                  >
                    {user?.is_verified ? '✓' : '🔒'}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-green-500">{user?.is_verified ? 'Verified' : 'Unverified'}</p>
                    <p className="text-xs text-darklink dark:text-bodytext">Account</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Center: avatar + name */}
            <div className="lg:col-span-4 col-span-12 flex justify-center">
              <div className="text-center -mt-20">
                <div className="relative mx-auto w-28 h-28 rounded-full overflow-hidden border-4 border-white dark:border-dark bg-gray-100 shadow-sm">
                  {/* Avatar component - expected to render image; we provide initials fallback visually */}
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-xl font-semibold text-gray-700 dark:text-gray-200">
                    <EditProfilePic />
                  </div>

                  {/* Verified badge overlay */}
                  {user?.is_verified && (
                    <span className="absolute -bottom-1 -right-1 inline-flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-gray-900 border border-lightprimary dark:border-lightprimary shadow text-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                        <circle cx="12" cy="12" r="11" fill="currentColor" opacity="0.06" />
                        <path d="M9 12.5l1.8 1.8L15 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  )}
                </div>

                <div className="mt-3 flex items-center justify-center gap-2">
                  <h5 className="text-lg font-semibold tracking-wide">{user?.full_name}</h5>
                  {user?.is_verified && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-lightprimary text-primary border border-lightprimary">
                      Verified
                    </span>
                  )}
                </div>
                <p className="text-darklink dark:text-bodytext text-sm">{user?.email}</p>
              </div>
            </div>

            {/* Right: actions */}
            <div className="lg:col-span-4 col-span-12 flex items-center lg:justify-end justify-center">
              <EditUserProfile />
            </div>
          </div>
        </div>
        {/* Profile Tabs */}
      </CardBox>
    </>
  );
};

export default ProfileBanner;
