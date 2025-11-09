import { Flowbite, ThemeModeScript } from 'flowbite-react';
import customTheme from './utils/theme/custom-theme';
import router from './routes/Router';
import { RouterProvider } from 'react-router';
import { ToastContainer } from 'react-toastify';
import { useContext, useEffect } from 'react';
import { getOrganizerDetails } from 'src/service/organizer';
import { AuthContext } from './context/authContext/AuthContext';
function App() {
   const { login }: any = useContext(AuthContext);
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    (async () => {
      try {
        const details = await getOrganizerDetails(token);
        console.log('Organizer details:', details);
         login(details?.result);
      } catch (err) {
        console.error('Failed to fetch organizer details', err);
      }
    })();
  }, []);
  return (
    <>
      <ThemeModeScript />
      <Flowbite theme={{ theme: customTheme }}>
        <ToastContainer />
        <RouterProvider router={router} />
      </Flowbite>
    </>
  );
}

export default App;
