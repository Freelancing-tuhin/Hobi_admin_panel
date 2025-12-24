import { useState, useEffect, useContext } from 'react';
import { Navbar } from 'flowbite-react';
import { Icon } from '@iconify/react';
import Profile from './Profile';
import FullLogo from '../../shared/logo/FullLogo';
import { Drawer } from 'flowbite-react';
import MobileSidebar from '../sidebar/MobileSidebar';
import HorizontalMenu from '../../horizontal/header/HorizontalMenu';
import { CustomizerContext } from 'src/context/CustomizerContext';

interface HeaderPropsType {
  layoutType: string;
}

const Header = ({ layoutType }: HeaderPropsType) => {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const {
    setIsCollapse,
    isCollapse,
    isLayout,
    activeMode,
    setActiveMode,
    isMobileSidebar,
    setIsMobileSidebar,
  } = useContext(CustomizerContext);



  const toggleMode = () => {
    setActiveMode((prevMode: string) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  // mobile-sidebar
  const handleClose = () => setIsMobileSidebar(false);
  return (
    <>
      <header
        className={`top-0 z-[5]  ${isSticky ? 'bg-white dark:bg-darkgray sticky' : 'bg-transparent'
          }`}
      >
        <Navbar
          fluid
          className={`rounded-none bg-transparent dark:bg-transparent py-4 sm:px-[15px] px-2 ${layoutType == 'horizontal' ? 'container mx-auto !px-6' : ''
            }  ${isLayout == 'full' ? '!max-w-full ' : ''}`}
        >
          {/* Mobile Toggle Icon */}
          <span
            onClick={() => setIsMobileSidebar(true)}
            className="h-10 w-10 flex text-black dark:text-white text-opacity-65 xl:hidden hover:text-primary hover:bg-lightprimary rounded-full justify-center items-center cursor-pointer"
          >
            <Icon icon="solar:hamburger-menu-line-duotone" height={21} />
          </span>
          <div className="flex items-center gap-3">
            {/* Toggle Icon   */}
            <Navbar.Collapse className="xl:block ">
              <div className="flex gap-3 items-center relative">
                {layoutType == 'horizontal' ? (
                  <div className="me-3">
                    <FullLogo />
                  </div>
                ) : null}

                {/* Toggle Menu    */}
                {layoutType != 'horizontal' ? (
                  <span
                    onClick={() => {
                      if (isCollapse === 'full-sidebar') {
                        setIsCollapse('mini-sidebar');
                      } else {
                        setIsCollapse('full-sidebar');
                      }
                    }}
                    className="h-10 w-10 hover:text-primary hover:bg-lightprimary rounded-full flex justify-center items-center cursor-pointer text-darklink  dark:text-white"
                  >
                    <Icon icon="solar:hamburger-menu-line-duotone" height={21} />
                  </span>
                ) : null}

                {/* <Search /> */}
                {/* <AppLinks /> */}
              </div>
            </Navbar.Collapse>

            <div className="text-lg sm:text-2xl xl:text-4xl text-[#b03052] font-semibold logo-font">hobi Organizers Panel</div>

          </div>

          {/* Mobile Profile */}
          <div className="xl:hidden">
            <Profile />
          </div>

          <Navbar.Collapse className="xl:block hidden">
            <div className="flex gap-3 items-center">
              {/* Light Mode Button */}
              {activeMode === 'light' ? (
                <div
                  className="h-10 w-10 hover:text-primary hover:bg-lightprimary dark:hover:bg-darkminisidebar  dark:hover:text-primary focus:ring-0 rounded-full flex justify-center items-center cursor-pointer text-darklink  dark:text-white"
                  onClick={toggleMode}
                >
                  <span className="flex items-center">
                    <Icon icon="solar:moon-line-duotone" width="20" />
                  </span>
                </div>
              ) : (
                // Dark Mode Button
                <div
                  className="h-10 w-10 hover:text-primary hover:bg-lightprimary dark:hover:bg-darkminisidebar  dark:hover:text-primary focus:ring-0 rounded-full flex justify-center items-center cursor-pointer text-darklink  dark:text-white"
                  onClick={toggleMode}
                >
                  <span className="flex items-center">
                    <Icon icon="solar:sun-bold-duotone" width="20" />
                  </span>
                </div>
              )}

              {/* Notification Dropdown */}
              {/* <Notifications /> */}

              {/* Language Dropdown*/}
              {/* <Language /> */}

              {/* Profile Dropdown */}
              <Profile />
            </div>
          </Navbar.Collapse>
        </Navbar>

        {/* Horizontal Menu  */}
        {layoutType == 'horizontal' ? (
          <div className="xl:border-t xl:border-ld">
            <div className={`${isLayout == 'full' ? 'w-full px-6' : 'container'}`}>
              <HorizontalMenu />
            </div>
          </div>
        ) : null}
      </header>

      {/* Mobile Sidebar */}
      <Drawer open={isMobileSidebar} onClose={handleClose} className="w-full sm:w-130 mobile-sidebar-drawer">
        <Drawer.Header titleIcon={() => null} title="" onClick={handleClose} />
        <Drawer.Items>
          <MobileSidebar />
        </Drawer.Items>
      </Drawer>
    </>
  );
};

export default Header;
