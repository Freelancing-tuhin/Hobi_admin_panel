import axios from 'axios';
import { API_BASE_URL } from 'src/config';

const API_BOOKING_URL = `${API_BASE_URL}/api/v1/bookings`;

export const updateBookingStatus = async (bookingId: string, booking_status: string) => {
  try {
    const response = await axios.patch(
      `${API_BOOKING_URL}/update-status-booking`,
      { bookingId, booking_status },
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error updating booking status:', error);
    throw error;
  }
};
