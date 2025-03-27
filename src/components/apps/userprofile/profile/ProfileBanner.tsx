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
          <div className="grid grid-cols-12 gap-3">
            <div className="lg:col-span-4 col-span-12 lg:order-1 order-2">
              <div className="flex gap-6 items-center justify-around lg:py-0 py-4">
                <div className="text-center">
                  <div className="text-center">
                    {user?.is_verified ? (
                      <h4 className="text-xl">✅verified</h4>
                    ) : (
                      <h4 className="text-xl">not verified</h4>
                    )}
                    <p className="text-darklink dark:text-bodytext text-sm">Account</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-4 col-span-12 lg:order-2 order-1">
              <div className="text-center -mt-20">
                <EditProfilePic />
                <h5 className="text-lg mt-3">{user?.full_name}</h5>
                <p className="text-darklink dark:text-bodytext">{user?.email}</p>
              </div>
            </div>
            <div className="lg:col-span-4 col-span-12 lg:order-3 order-3">
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
