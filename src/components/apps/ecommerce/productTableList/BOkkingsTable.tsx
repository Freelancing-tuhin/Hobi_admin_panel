import { useContext, useEffect, useState } from 'react';
// import axios from 'axios';
// import { API_BASE_URL } from 'src/config';
import { Table, Pagination, Select } from 'flowbite-react';
// import { format } from 'date-fns';
// import { Icon } from '@iconify/react/dist/iconify.js';
import { fetchOrganizerBookings } from 'src/service/getOrganizerBookings';
import { AuthContext } from 'src/context/authContext/AuthContext';
import CardBox from 'src/components/shared/CardBox';
import { formatDateTime } from 'src/service/formatDate';
import { updateBookingStatus } from 'src/service/updateBookingStatus';

const BookingsTable = () => {
  const { user }: any = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const getBookings = async () => {
    try {
      const data = await fetchOrganizerBookings(user?._id);
      setBookings(data.result);
      setTotalPages(data.pagination?.totalPages);
      console.log('=========>', data);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    }
  };
  useEffect(() => {
    getBookings();
  }, [user?._id, currentPage]);

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      await updateBookingStatus(bookingId, newStatus);
      getBookings();
    } catch (error) {
      console.error('Failed to update booking status:', error);
      alert('Failed to update booking status');
    }
  };
  return (
    <CardBox>
      <div className="border rounded-md border-ld overflow-x-auto">
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>Customer</Table.HeadCell>
            <Table.HeadCell>Booking Date</Table.HeadCell>
            <Table.HeadCell>Event</Table.HeadCell>
            <Table.HeadCell>Booking Status</Table.HeadCell>
            <Table.HeadCell>Payment Status</Table.HeadCell>
            <Table.HeadCell>Total Tickets</Table.HeadCell>
            <Table.HeadCell>Amount Paid</Table.HeadCell>
            {/* <Table.HeadCell>Action</Table.HeadCell> */}
          </Table.Head>
          <Table.Body className="divide-y divide-border dark:divide-darkborder">
            {bookings.map((booking: any) => (
              <Table.Row key={booking._id}>
                <Table.Cell>{booking.userId?.full_name}</Table.Cell>
                <Table.Cell>{formatDateTime(booking?.updatedAt)}</Table.Cell>
                <Table.Cell className="overflow-hidden whitespace-nowrap text-ellipsis max-w-[16ch]">
                  {booking?.eventId?.title}
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap">
                  <Select
                    value={booking.booking_status}
                    onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                  >
                    {['Pending', 'check-in', 'in-progress', 'Completed', 'Canceled'].map(
                      (status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ),
                    )}
                  </Select>
                </Table.Cell>
                <Table.Cell>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-md ${
                      booking.paymentStatus === 'Completed'
                        ? 'bg-green-600 text-green-100'
                        : 'bg-yellow-400 text-red-800'
                    }`}
                  >
                    {booking.paymentStatus}
                  </span>
                </Table.Cell>

                <Table.Cell>{booking.ticketsCount}</Table.Cell>
                <Table.Cell>{booking.amountPaid}</Table.Cell>
                {/* <Table.Cell>
                <Button color="blue" size="xs" className="bg-red-500">
                  <Icon icon="hugeicons:delete-03" height="19" />
                </Button>
              </Table.Cell> */}
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        <div className="flex justify-center mb-4 mt-2 ">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
    </CardBox>
  );
};

export default BookingsTable;
