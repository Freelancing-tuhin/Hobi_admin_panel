import CardBox from 'src/components/shared/CardBox';
import EventTable from './EventTable';
import { getEvent } from 'src/service/getEvents';
import { useContext, useState } from 'react';
import { AuthContext } from 'src/context/authContext/AuthContext';
import SearchBox from 'src/components/shared/SearchBox';
import { Icon } from '@iconify/react';

const ProductTablelist = () => {
  const { user }: any = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [searchText, setSearchText] = useState(null);
  const [loading, setLoading] = useState(false);

  const getEvents = async (page = 1) => {
    try {
      setLoading(true);
      const response = await getEvent({
        filter: { page: page, limit: 4, search: searchText, organizerId: user?._id },
      });
      setEvents(response.result || []);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CardBox>
        <div className="p-">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#b03052]/20 to-[#8a2542]/20 rounded-xl flex items-center justify-center">
                <Icon icon="solar:calendar-mark-bold-duotone" height={22} className="text-[#b03052]" />
              </div>
              <div>
                <h5 className="text-lg font-bold text-gray-800 dark:text-white">My Events</h5>
                <p className="text-xs text-gray-500 dark:text-gray-400">Manage and track your events</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <SearchBox
                setSearchText={setSearchText}
                searchText={searchText}
                getOrganizer={getEvents}
                placeholder={'Search events...'}
              />
              <button
                onClick={() => getEvents(1)}
                disabled={loading}
                className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
              >
                <Icon
                  icon="solar:refresh-bold-duotone"
                  className={`text-xl text-gray-500 ${loading ? 'animate-spin' : ''}`}
                />
              </button>
            </div>
          </div>

          <EventTable
            events={events}
            totalPages={totalPages}
            getEvents={getEvents}
            searchText={searchText}
            loading={loading}
          />
        </div>
      </CardBox>
    </>
  );
};

export default ProductTablelist;
