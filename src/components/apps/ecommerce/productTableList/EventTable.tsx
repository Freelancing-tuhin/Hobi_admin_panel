import { Icon } from '@iconify/react/dist/iconify.js';
import { format } from 'date-fns';
import { Table, Pagination, Button } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import EditEventModal from './EditEventModal';
import { deleteEvent } from 'src/service/deleteEvent';
// import { deleteEvent } from 'src/service/deleteEvent';

const EventTable = ({ events, totalPages, getEvents, searchText }: any) => {
  const [editedevents, setEditedevents] = useState();
  const [openEditModal, setOpenEditModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const OpenModal = (data: any) => {
    setOpenEditModal(true);
    setEditedevents(data);
  };

  const handleDeleteEvent = async (eventId: any) => {
    try {
      await deleteEvent(eventId);
      getEvents(currentPage);
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return ''; // Handle empty value
    const [hours, minutes] = timeString.split(':').map(Number);
    return new Date(0, 0, 0, hours, minutes).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  useEffect(() => {
    getEvents(currentPage);
  }, [currentPage, searchText]);

  return (
    <>
      <div className="border rounded-md border-ld overflow-x-auto">
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>Events</Table.HeadCell>
            <Table.HeadCell>Event Date</Table.HeadCell>
            <Table.HeadCell>Event Time</Table.HeadCell>
            <Table.HeadCell>Ratings</Table.HeadCell>
            <Table.HeadCell>Action</Table.HeadCell>
          </Table.Head>

          <Table.Body className="divide-y divide-border dark:divide-darkborder">
            {events.map((item: any) => (
              <Table.Row key={item._id}>
                <Table.Cell>
                  <div className="flex gap-3 items-center">
                    <img src={item.banner_Image} alt="Event Banner" className="h-14 w-14 rounded" />
                    <div>
                      <h6 className="text-base overflow-hidden whitespace-nowrap text-ellipsis max-w-[20ch]">
                        {item.title}
                      </h6>
                      <p className="text-sm text-darklink dark:text-bodytext">{item.category}</p>
                    </div>
                  </div>
                </Table.Cell>
                <Table.Cell>{format(new Date(item.startDate), 'E, MMM d yyyy')}</Table.Cell>
                <Table.Cell>
                  {formatTime(item?.startTime)} - {formatTime(item?.endTime)}
                </Table.Cell>

                <Table.Cell>
                  <h5 className="text-base flex items-center">
                    {[...Array(5)].map((_, index) => (
                      <svg
                        key={index}
                        className={`w-4 h-4 ms-1 ${
                          index < item?.ratings
                            ? 'text-yellow-300'
                            : 'text-gray-300 dark:text-gray-500'
                        }`}
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 22 20"
                      >
                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                      </svg>
                    ))}
                    <p className="hidden xl:inline ms-1 ml-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                      {item?.ratings > 0 ? item?.ratings : 0}
                    </p>
                    <p className="hidden xl:inline ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                      out of
                    </p>
                    <p className=" hidden xl:inline ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                      5
                    </p>
                  </h5>
                </Table.Cell>

                <Table.Cell className="flex gap-2 items-center">
                  <Link to={`/Event/${item._id}`}>
                    <Button
                      color="blue"
                      size="xs"
                      className="bg-[#b03052]"
                      // onClick={() => openEditModal(service)}
                    >
                      <Icon icon="solar:presentation-graph-bold" height="18" />
                    </Button>
                  </Link>
                  <Button
                    color="blue"
                    size="xs"
                    className="bg-gray-500"
                    onClick={() => OpenModal(item)}
                  >
                    <Icon icon="material-symbols:edit-document" height="18" />
                  </Button>
                  <Button
                    color="blue"
                    size="xs"
                    className="bg-red-500"
                    onClick={() => handleDeleteEvent(item._id)}
                  >
                    <Icon icon="hugeicons:delete-03" height="19" />
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
      <div className="flex justify-center mb-4 mt-2 ">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      <EditEventModal
        eventData={editedevents}
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        getEvents={() => getEvents(currentPage)}
      />
    </>
  );
};

export default EventTable;
