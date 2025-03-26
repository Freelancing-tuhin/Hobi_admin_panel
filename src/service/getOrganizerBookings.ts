import axios from 'axios';
import { API_BASE_URL } from 'src/config';

const API_BOOKING_URL = `${API_BASE_URL}/api/v1/bookings`;

export const fetchOrganizerBookings = async (organizerId: any, page = 1, limit = 10) => {
  try {
    const response = await axios.get(`${API_BOOKING_URL}/get-organizer-booking`, {
      params: { organizerId, page, limit },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching organizer bookings:', error);
    throw error;
  }
};
