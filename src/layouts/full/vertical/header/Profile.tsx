import { Icon } from '@iconify/react';
import { Badge, Dropdown } from 'flowbite-react';
import * as profileData from './Data';
import { Link } from 'react-router';
import { AuthContext } from 'src/context/authContext/AuthContext';
import { useContext } from 'react';
const Profile = () => {
  const { user, logout }: any = useContext(AuthContext);

  const handleLogout = () => {
    logout(); // Clears user data from context and localStorage
    window.location.href = '/auth/auth2/login'; // Redirect to login page after logout
  };
  return (
    <div className="relative ">
      <Dropdown
        label=""
        className="w-screen sm:w-[360px] pb-4 rounded-sm border"
        dismissOnClick={false}
        renderTrigger={() => (
          <div className="flex items-center gap-1">
            <span className="h-10 w-10 hover:text-primary rounded-full flex justify-center items-center cursor-pointer group-hover/menu:bg-lightprimary group-hover/menu:text-primary">
              <img
                src={user?.profile_pic}
                alt="logo"
                height="35"
                width="35"
                className="rounded-full"
              />
            </span>
            <Icon
              icon="solar:alt-arrow-down-bold"
              className="hover:text-primary dark:text-primary group-hover/menu:text-primary"
              height={12}
            />
          </div>
        )}
      >
        <div className="px-6">
          <div className="flex items-center gap-6 pb-5 border-b dark:border-darkborder mt-5 mb-3">
            <img
              src={user?.profile_pic}
              alt="logo"
              height="56"
              width="56"
              className="rounded-full"
            />
            <div>
              <h5 className="text-15 font-semibold">
                {user?.full_name} <span className="text-success">verified</span>
              </h5>
              <p className="text-sm text-ld opacity-80">{user?.email}</p>
            </div>
          </div>
        </div>
          {profileData.profileDD.map((items, index) => (
            <div key={index} className="px-6 mb-2">
              <Dropdown.Item
                as={Link}
                to={items.url}
                className="px-3 py-2 flex justify-between items-center bg-hover group/link w-full rounded-md"
                key={index}
              >
                <div className="flex items-center w-full ">
                  <div className=" flex gap-3 w-full ">
                    <h5 className="text-15 font-normal group-hover/link:text-primary">
                      {items.title}
                    </h5>
                    {items.url == '/apps/invoice' ? <Badge color={'lightprimary'}>4</Badge> : null}
                  </div>
                </div>
              </Dropdown.Item>
            </div>
          ))}
          <div
            onClick={handleLogout}
            className="ml-6 cursor-pointer rounded-md hover:bg-red-100 hover:text-red-500 px-3 py-2 "
          >
            Logout
          </div>
      </Dropdown>
    </div>
  );
};

export default Profile;
