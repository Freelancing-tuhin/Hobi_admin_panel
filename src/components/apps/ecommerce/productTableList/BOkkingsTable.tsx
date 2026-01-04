import { useContext, useEffect, useState } from 'react';
import { Table, Pagination, Select, Spinner } from 'flowbite-react';
import { Icon } from '@iconify/react';
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
  const [loading, setLoading] = useState(true);

  const getBookings = async () => {
    try {
      setLoading(true);
      const data = await fetchOrganizerBookings(user?._id);
      setBookings(data.result || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      getBookings();
    }
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

  // Get booking status style
  const getBookingStatusStyle = (status: string) => {
    const styles: Record<string, { bg: string; text: string; icon: string }> = {
      'Pending': { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400', icon: 'solar:clock-circle-bold' },
      'check-in': { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', icon: 'solar:login-3-bold' },
      'in-progress': { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-400', icon: 'solar:play-circle-bold' },
      'Completed': { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400', icon: 'solar:check-circle-bold' },
      'Canceled': { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', icon: 'solar:close-circle-bold' },
    };
    return styles[status] || styles['Pending'];
  };

  // Get payment status style
  const getPaymentStatusStyle = (status: string) => {
    if (status === 'Completed') {
      return { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400', icon: 'solar:check-circle-bold' };
    }
    return { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400', icon: 'solar:clock-circle-bold' };
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  return (
    <CardBox>
      <div className="p-2">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#b03052]/20 to-[#8a2542]/20 rounded-xl flex items-center justify-center">
              <Icon icon="solar:ticket-bold-duotone" height={22} className="text-[#b03052]" />
            </div>
            <div>
              <h5 className="text-lg font-bold text-gray-800 dark:text-white">All Bookings</h5>
              <p className="text-xs text-gray-500 dark:text-gray-400">Manage customer bookings</p>
            </div>
          </div>
          <button
            onClick={getBookings}
            disabled={loading}
            className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
          >
            <Icon
              icon="solar:refresh-bold-duotone"
              className={`text-xl text-gray-500 ${loading ? 'animate-spin' : ''}`}
            />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Spinner size="lg" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-4">
              <Icon icon="solar:ticket-bold-duotone" className="text-5xl text-gray-300 dark:text-gray-600" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 font-semibold mb-1">No bookings yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Customer bookings will appear here
            </p>
          </div>
        ) : (
          <>
            <div className="border rounded-xl border-gray-200 dark:border-gray-700 overflow-x-auto">
              <Table hoverable>
                <Table.Head className="bg-gray-50 dark:bg-gray-800">
                  <Table.HeadCell className="font-bold text-xs uppercase tracking-wider text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <Icon icon="solar:user-bold" height={16} />
                      Customer
                    </div>
                  </Table.HeadCell>
                  <Table.HeadCell className="font-bold text-xs uppercase tracking-wider text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <Icon icon="solar:calendar-bold" height={16} />
                      Booking Date
                    </div>
                  </Table.HeadCell>
                  <Table.HeadCell className="font-bold text-xs uppercase tracking-wider text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <Icon icon="solar:calendar-mark-bold" height={16} />
                      Event
                    </div>
                  </Table.HeadCell>
                  <Table.HeadCell className="font-bold text-xs uppercase tracking-wider text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <Icon icon="solar:bill-list-bold" height={16} />
                      Status
                    </div>
                  </Table.HeadCell>
                  <Table.HeadCell className="font-bold text-xs uppercase tracking-wider text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <Icon icon="solar:card-bold" height={16} />
                      Payment
                    </div>
                  </Table.HeadCell>
                  <Table.HeadCell className="font-bold text-xs uppercase tracking-wider text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <Icon icon="solar:ticket-bold" height={16} />
                      Tickets
                    </div>
                  </Table.HeadCell>
                  <Table.HeadCell className="font-bold text-xs uppercase tracking-wider text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <Icon icon="solar:wallet-bold" height={16} />
                      Amount
                    </div>
                  </Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y divide-gray-100 dark:divide-gray-700">
                  {bookings.map((booking: any) => {
                    const paymentStyle = getPaymentStatusStyle(booking.paymentStatus);
                    return (
                      <Table.Row
                        key={booking._id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <Table.Cell>
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-gradient-to-br from-[#b03052] to-[#8a2542] rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                              {booking.userId?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800 dark:text-white text-sm">
                                {booking.userId?.full_name || 'Unknown'}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {booking.userId?.phone || ''}
                              </p>
                            </div>
                          </div>
                        </Table.Cell>
                        <Table.Cell>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {formatDateTime(booking?.updatedAt)}
                          </p>
                        </Table.Cell>
                        <Table.Cell>
                          <p className="font-medium text-gray-800 dark:text-white text-sm max-w-[180px] truncate">
                            {booking?.eventId?.title || 'N/A'}
                          </p>
                        </Table.Cell>
                        <Table.Cell>
                          <Select
                            value={booking.booking_status}
                            onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                            className="text-sm"
                            sizing="sm"
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
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg ${paymentStyle.bg} ${paymentStyle.text}`}
                          >
                            <Icon icon={paymentStyle.icon} height={14} />
                            {booking.paymentStatus || 'Pending'}
                          </span>
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                              <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">
                                {booking.ticketsCount || 0}
                              </span>
                            </div>
                          </div>
                        </Table.Cell>
                        <Table.Cell>
                          <span className="font-bold text-gray-800 dark:text-white">
                            {formatCurrency(booking.amountPaid)}
                          </span>
                        </Table.Cell>
                      </Table.Row>
                    );
                  })}
                </Table.Body>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Page <span className="font-semibold">{currentPage}</span> of <span className="font-semibold">{totalPages}</span>
                </p>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => setCurrentPage(page)}
                  showIcons
                />
              </div>
            )}
          </>
        )}
      </div>
    </CardBox>
  );
};

export default BookingsTable;
